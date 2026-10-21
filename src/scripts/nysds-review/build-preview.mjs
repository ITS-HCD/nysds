#!/usr/bin/env node
/**
 * Builds the accessibility preview site for a pull request into .preview/dist.
 *
 * Every story in the affected packages' *.stories.ts files becomes its own
 * static page: the story's markup inside <main>, the component's script, the
 * @nysds/styles stylesheet, and a bar at the bottom of the viewport with
 * previous/next links and a Home link. Nothing else — the pages are for testers
 * using assistive technology. The home page is an ordered list of every story.
 *
 * Affected packages are the nys-* packages changed since the base branch plus
 * every package that depends on them, directly or transitively. A change to a
 * shared package (tokens, styles, internals, codegen) or to the story generator
 * affects every component.
 *
 * Usage:
 *   node src/scripts/nysds-review/build-preview.mjs                  changed vs $PREVIEW_BASE (default origin/develop)
 *   node src/scripts/nysds-review/build-preview.mjs nys-select ...   treat these packages as changed
 *   node src/scripts/nysds-review/build-preview.mjs --all            every component
 *
 * Requires built packages (npm run build:packages). Story markup is captured by
 * rendering each story in Chromium with custom element registration disabled,
 * so the snapshot is the authored markup, not the upgraded DOM.
 *
 * A story tagged "!preview" (tags: ["!preview"]) is skipped.
 *
 * The site's landing page (/) links to the three review tools: this preview's
 * story list at /preview/, the visual regression report at /visual/ (from
 * visual.mjs, when .visual/report exists) and the codegen
 * review at /code-review/ (from npm run review:codegen -- --html-file
 * .code-review/index.html, when that file exists). The landing page is the
 * template templates/landing.html, filled in from a generated
 * site-data.js. The story list at /preview/ is likewise the template
 * templates/preview.html, filled in from a generated pages.js. The
 * site is written even when no component has stories to preview, so the
 * other tools are still reachable.
 *
 * The visual regression run screenshots these same pages: it imports
 * buildPages() to render every story, for both the base branch (from its git
 * worktree) and this branch, without the bottom bar.
 */
import fs from "fs";
import path from "path";
import { execFileSync, spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { build, createServer } from "vite";
import { chromium } from "playwright";
import prettier from "prettier";

// This script lives in src/scripts/nysds-review/, three levels below the root.
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "../../..");
const OUT = path.join(ROOT, ".preview");
const DIST = path.join(OUT, "dist");
const VR_REPORT = path.join(ROOT, ".visual/report");
const VR_RESULTS = path.join(ROOT, ".visual/results.json");
const CODE_REVIEW_PAGE = path.join(ROOT, ".code-review/index.html");
const LANDING_TEMPLATE = path.join(SCRIPT_DIR, "templates/landing.html");
// The story list at /preview/, filled in from a generated pages.js.
const PREVIEW_TEMPLATE = path.join(SCRIPT_DIR, "templates/preview.html");
// The landing page's header, footer and cards come from the full NYSDS bundle.
const NYSDS_BUNDLE = path.join(ROOT, "dist/nysds.js");
const SHARED_PACKAGES = new Set(["tokens", "styles", "internals", "codegen"]);
const SHARED_FILES = new Set(["src/scripts/generate-stories.mjs"]);

// --- Affected packages ------------------------------------------------------

export function readComponentPackages(root = ROOT) {
  const packages = new Map();
  for (const dir of fs.readdirSync(path.join(root, "packages"))) {
    if (!dir.startsWith("nys-")) continue;
    const pkgPath = path.join(root, "packages", dir, "package.json");
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
      .filter((name) => name.startsWith("@nysds/nys-"))
      .map((name) => name.replace("@nysds/", ""));
    packages.set(dir, { dir, deps });
  }
  return packages;
}

function changedFiles(base) {
  const git = (...args) =>
    execFileSync("git", args, { cwd: ROOT, encoding: "utf8" })
      .split("\n")
      .filter(Boolean);
  // Committed changes on this branch, plus uncommitted ones for local runs.
  // Whitespace-only edits (an editor reflowing a comment) are ignored: they
  // can't change rendering, and one in a shared component such as nys-icon
  // would pull every component that uses it into the preview. Real comment
  // edits still count, since stories are generated from JSDoc.
  // Markdown is ignored too: a README can't change what a component renders,
  // and one in a shared package (packages/codegen/README.md) would otherwise
  // put every component in the preview.
  const ignoreWhitespace = ["-w", "--ignore-blank-lines"];
  const files = new Set([
    ...git("diff", "--name-only", ...ignoreWhitespace, `${base}...HEAD`),
    ...git("diff", "--name-only", ...ignoreWhitespace, "HEAD"),
  ]);
  return [...files].filter((file) => !file.endsWith(".md"));
}

/** Returns [{ dir, reason }] — changed packages first, then their dependents. */
function affectedPackages(packages, args) {
  const all = [...packages.keys()].sort();
  if (args.includes("--all"))
    return all.map((dir) => ({ dir, reason: "All components" }));

  let changed;
  const named = args.filter((arg) => !arg.startsWith("--"));
  if (named.length) {
    changed = named.filter((dir) => {
      if (packages.has(dir)) return true;
      console.warn(`⚠ Unknown package "${dir}" — skipped.`);
      return false;
    });
  } else {
    const base = process.env.PREVIEW_BASE || "origin/develop";
    const files = changedFiles(base);
    const dirs = new Set(
      files
        .map((file) => file.match(/^packages\/([^/]+)\//)?.[1])
        .filter(Boolean),
    );
    const sharedHit =
      [...dirs].find((dir) => SHARED_PACKAGES.has(dir)) ??
      files.find((file) => SHARED_FILES.has(file));
    if (sharedHit) {
      console.log(
        `Shared code changed (${sharedHit}) — previewing every component.`,
      );
      return all.map((dir) => ({ dir, reason: `Uses ${sharedHit}` }));
    }
    changed = [...dirs].filter((dir) => packages.has(dir)).sort();
  }

  const dependents = new Map(all.map((dir) => [dir, []]));
  for (const { dir, deps } of packages.values()) {
    for (const dep of deps) dependents.get(dep)?.push(dir);
  }

  const result = changed.map((dir) => ({ dir, reason: "Changed in this PR" }));
  const seen = new Set(changed);
  // `result` grows while it's walked, so dependents of dependents are found too.
  for (const affected of result) {
    for (const dependent of dependents.get(affected.dir).sort()) {
      if (seen.has(dependent)) continue;
      seen.add(dependent);
      result.push({ dir: dependent, reason: `Uses ${affected.dir}` });
    }
  }
  return result;
}

// --- Story snapshots --------------------------------------------------------

export function storyFiles(dir, root = ROOT) {
  const src = path.join(root, "packages", dir, "src");
  return fs
    .readdirSync(src)
    .filter((fileName) => fileName.endsWith(".stories.ts"))
    .sort()
    .map((fileName) => path.join(src, fileName));
}

/** Story export names in source order (module namespaces are alphabetical). */
function storyExportOrder(file) {
  const source = fs.readFileSync(file, "utf8");
  return [...source.matchAll(/^export const (\w+)\b/gm)].map(
    (match) => match[1],
  );
}

// Runs in the browser. customElements.define is disabled first, so stories
// render to plain authored markup and module-scope setup still executes.
const HARNESS_HTML = `<!doctype html>
<html lang="en">
<head>
<script>customElements.define = () => {};</script>
<script type="module">
import { render } from "lit";

const toTitle = (name) =>
  name
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .trim();

window.__snapshotStories = async (url, order) => {
  const mod = await import(/* @vite-ignore */ url);
  const meta = mod.default ?? {};
  const stories = [];
  for (const exportName of order) {
    const story = mod[exportName];
    if (!story || typeof story !== "object") continue;
    if ([...(meta.tags ?? []), ...(story.tags ?? [])].includes("!preview")) continue;

    const args = { ...meta.args, ...story.args };
    const renderFn = story.render ?? meta.render;
    const container = document.createElement("div");
    document.body.append(container);

    if (renderFn) {
      const out = renderFn(args, {
        args,
        name: story.name ?? toTitle(exportName),
        parameters: { ...meta.parameters, ...story.parameters },
      });
      if (typeof out === "string") container.innerHTML = out;
      else if (out instanceof Node) container.append(out);
      else render(out, container);
    } else if (meta.component) {
      const el = document.createElement(meta.component);
      for (const [key, value] of Object.entries(args)) {
        if (value === true) el.setAttribute(key, "");
        else if (value != null && value !== false && value !== "" && typeof value !== "object")
          el.setAttribute(key, String(value));
      }
      container.append(el);
    } else {
      container.remove();
      continue;
    }

    // Args-driven stories bind every arg, so empty-string args render as empty
    // attributes (href="", ariaCurrent=""). Drop those; boolean attributes
    // come from boolean args and are kept.
    const emptyArgs = new Set(
      Object.entries(args)
        .filter(([, value]) => value === "")
        .map(([name]) => name.toLowerCase()),
    );
    for (const el of container.querySelectorAll("*")) {
      for (const attr of [...el.attributes]) {
        if (attr.value === "" && emptyArgs.has(attr.name)) el.removeAttribute(attr.name);
      }
    }

    const html = container.innerHTML.replace(/<!--\\?lit\\$\\d+\\$-->|<!--\\??-->/g, "");
    container.remove();
    // Setup-only stories (e.g. registering an icon library) render nothing to test.
    if (!html.trim()) continue;
    const tags = [...(meta.tags ?? []), ...(story.tags ?? [])];
    stories.push({ exportName, name: story.name ?? toTitle(exportName), tags, html });
  }
  return { title: (meta.title ?? "").split("/").pop() || meta.component, stories };
};
window.__ready = true;
</script>
</head>
<body></body>
</html>
`;

// Stories import Storybook only for types; keep it out of every bundle.
const stubStorybook = {
  name: "stub-storybook",
  enforce: "pre",
  resolveId: (id) => (id.startsWith("@storybook/") ? "\0storybook-stub" : null),
  load: (id) => (id === "\0storybook-stub" ? "export {};" : null),
};

const viteBase = (root) => ({
  configFile: false,
  root,
  logLevel: "warn",
  css: { postcss: null },
  plugins: [stubStorybook],
});

/** Renders each component's stories to markup; harnessDir must be inside root. */
async function snapshotStories(root, harnessDir, components) {
  fs.mkdirSync(harnessDir, { recursive: true });
  fs.writeFileSync(path.join(harnessDir, "index.html"), HARNESS_HTML);

  const server = await createServer({
    ...viteBase(root),
    publicDir: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    // A one-off render: no file watching, which would otherwise walk the
    // whole repo, including the base-branch worktree in .visual/base.
    server: { port: 0, host: "127.0.0.1", hmr: false, watch: null },
  });
  await server.listen();
  const origin = server.resolvedUrls.local[0].replace(/\/$/, "");

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.on("pageerror", (err) => console.warn(`⚠ ${err.message}`));
    const harnessUrl = path
      .relative(root, harnessDir)
      .split(path.sep)
      .join("/");
    await page.goto(`${origin}/${harnessUrl}/index.html`);
    await page.waitForFunction(() => window.__ready === true);

    for (const component of components) {
      component.files = [];
      for (const file of storyFiles(component.dir, root)) {
        const url = "/" + path.relative(root, file).split(path.sep).join("/");
        const { title, stories } = await page.evaluate(
          ([moduleUrl, exportOrder]) =>
            window.__snapshotStories(moduleUrl, exportOrder),
          [url, storyExportOrder(file)],
        );
        component.title ??= title;
        component.files.push({ file, stories });
      }
    }
  } finally {
    await browser.close();
    await server.close();
  }
}

// --- Page output ------------------------------------------------------------

const HTML_ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

function escapeHtml(text) {
  return String(text).replace(
    /[&<>"]/g,
    (character) => HTML_ENTITIES[character],
  );
}

/** "PeritemHeadingLevel" → "peritem-heading-level", for page paths. */
const kebab = (text) =>
  text
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();

async function formatMarkup(html) {
  try {
    return (await prettier.format(html, { parser: "html" })).trim();
  } catch {
    return html.trim();
  }
}

// Only what @nysds/styles utilities cannot express: a full-height body so the
// bar sits at the bottom of the viewport on short pages, the bar's offset,
// surface and divider, keeping focused content clear of it (WCAG 2.4.11), and
// dropping it into the page flow on short viewports such as 400% zoom (WCAG 1.4.10).
const BAR_STYLE = `<style>
      html { scroll-padding-bottom: var(--nys-space-1200); }
      body { min-height: 100dvh; }
      .nysds-preview-bar {
        bottom: 0;
        background: var(--nys-color-surface);
        border-top: var(--nys-border-width-sm) solid var(--nys-color-neutral-200);
      }
      @media (max-height: 480px) { .nysds-preview-bar { position: static; } }
      /*
        Previous, the current story and Next share one row. The two side
        columns always split the leftover width equally, so the title stays
        centered whatever the links say; each is at least one 48px button
        wide (--nys-size-600).
      */
      .nysds-preview-stepper {
        display: grid;
        grid-template-columns:
          minmax(var(--nys-size-600), 1fr) auto minmax(var(--nys-size-600), 1fr);
        align-items: center;
        gap: var(--nys-space-200);
      }
      .nysds-preview-stepper > :first-child { justify-self: start; }
      .nysds-preview-stepper > :last-child { justify-self: end; }
      /*
        Long story names wrap; keep every line centered. No margin: the
        typography styles give a paragraph that isn't last a bottom margin,
        which would lift the title off the buttons' center line.
      */
      .nysds-preview-current {
        margin: 0;
        text-align: center;
        font-weight: var(--nys-font-weight-semibold);
      }
      /* Previous/Next links styled like nys-button's outline variant. */
      .nysds-preview-step {
        min-height: var(--nys-size-600);
        padding: calc(var(--nys-space-150) - var(--nys-border-width-md))
          calc(var(--nys-space-250) - var(--nys-border-width-md));
        border: var(--nys-border-width-md) solid var(--nys-color-theme);
        border-radius: var(--nys-radius-xl);
        background: var(--nys-color-surface);
        color: var(--nys-color-theme);
        font-weight: var(--nys-font-weight-semibold);
        text-decoration: none;
      }
      /* Long link text wraps inside its column instead of overflowing it. */
      .nysds-preview-step { max-width: 100%; }
      .nysds-preview-arrow {
        flex: none;
        width: var(--nys-size-250);
        height: var(--nys-size-250);
        fill: currentColor;
      }
      .nysds-preview-step:hover { background: var(--nys-color-theme-weaker); }
      .nysds-preview-step:active { background: var(--nys-color-theme-weak); }
      .nysds-preview-step:focus-visible {
        outline: var(--nys-border-width-md) solid var(--nys-color-focus);
        outline-offset: var(--nys-space-2px);
      }
      .nysds-preview-visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
      /*
        Below the tablet breakpoint (40em) the links shrink to 48px arrow
        buttons, leaving the row to the title. The story names are only
        hidden visually: they stay in each link's accessible name.
      */
      @media (max-width: 39.99em) {
        .nysds-preview-step {
          justify-content: center;
          min-width: var(--nys-size-600);
          padding: calc(var(--nys-space-150) - var(--nys-border-width-md));
        }
        /* The arrow is all that's visible, so make it easy to see. */
        .nysds-preview-arrow {
          width: var(--nys-size-300);
          height: var(--nys-size-300);
        }
        .nysds-preview-step-label {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
      }
      .nysds-preview-bar .nysds-preview-home {
        text-align: center;
        background: var(--nys-color-theme);
        color: var(--nys-color-text-reverse);
        text-decoration: none;
        min-height: var(--nys-size-600);
        padding: calc(var(--nys-space-150) - var(--nys-border-width-md))
          calc(var(--nys-space-250) - var(--nys-border-width-md));
        border: var(--nys-border-width-md) solid var(--nys-color-theme);
        border-radius: var(--nys-radius-xl);
        font-weight: var(--nys-font-weight-semibold);
      }
    </style>`;

const pageLabel = (page) => `${page.title}, ${page.story}`;

function headHtml(title, extra = "") {
  return `<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>${escapeHtml(title)}</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/assets/fonts/nysds-fonts.css" />
    <link rel="stylesheet" href="/assets/css/nysds-full.min.css" />${extra}
  </head>`;
}

/**
 * The pull request being previewed: from PR_NUMBER/PR_TITLE/PR_URL in CI, or
 * the current branch's PR via the GitHub CLI locally. Null when neither is available.
 */
function pullRequest() {
  const { PR_NUMBER, PR_TITLE, PR_URL } = process.env;
  if (PR_NUMBER)
    return { number: PR_NUMBER, title: PR_TITLE ?? "", url: PR_URL ?? "" };
  try {
    const out = execFileSync(
      "gh",
      ["pr", "view", "--json", "number,title,url"],
      {
        cwd: ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    );
    return JSON.parse(out);
  } catch {
    return null;
  }
}

/**
 * The visual regression report, when one has been generated: the number of
 * stories per status (a story counts once, whichever viewport changed). Null
 * when there is no report.
 */
function visualReport() {
  if (!fs.existsSync(path.join(VR_REPORT, "index.html"))) return null;
  try {
    const { results } = JSON.parse(fs.readFileSync(VR_RESULTS, "utf8"));
    const storyIdsByStatus = {};
    for (const result of results) {
      storyIdsByStatus[result.status] ??= new Set();
      storyIdsByStatus[result.status].add(result.id);
    }
    const counts = {};
    for (const [status, storyIds] of Object.entries(storyIdsByStatus)) {
      counts[status] = storyIds.size;
    }
    return { counts };
  } catch {
    // The link still works without a summary.
    return { counts: null };
  }
}

/** "3 changed · 1 new", "no visual changes", or "" when there's no summary. */
function visualReportSummary(vr) {
  if (!vr?.counts) return "";
  const summary = ["changed", "new", "removed", "error"]
    .filter((status) => vr.counts[status])
    .map((status) => {
      const label = status === "error" ? "failed to capture" : status;
      return `${vr.counts[status]} ${label}`;
    })
    .join(" · ");
  return summary || "no visual changes";
}

// Material Symbols' arrow_back and arrow_forward, the icons nys-icon uses,
// inline so story pages don't need the nys-icon component.
const ARROW_PATHS = {
  Previous: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
  Next: "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z",
};

// An outline-button-styled link to a neighbouring story. The arrow is visual
// only; "Previous:"/"Next:" stays in the accessible name for screen readers.
function stepLink(page, direction) {
  const icon = `<svg class="nysds-preview-arrow" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="${ARROW_PATHS[direction]}"/></svg>`;
  const label = `<span class="nysds-preview-step-label"><span class="nysds-preview-visually-hidden">${direction}: </span>${escapeHtml(pageLabel(page))}</span>`;
  return `<a class="nysds-preview-step nys-display-inline-flex nys-flex-align-center nys-flex-gap-100" href="/${page.path}/">${
    direction === "Previous" ? icon + label : label + icon
  }</a>`;
}

function navBar(pages, index) {
  const previous = pages[index - 1];
  const next = pages[index + 1];
  // Previous, the current story and Next on one row. An empty cell stands in
  // for a missing link, so the title stays in the middle column.
  const stepper = `
      <div class="nysds-preview-stepper nys-margin-1px">
        ${previous ? stepLink(previous, "Previous") : "<span></span>"}
        <p class="nysds-preview-current">${escapeHtml(pageLabel(pages[index]))}</p>
        ${next ? stepLink(next, "Next") : "<span></span>"}
      </div>`;
  return `
    <nav
      aria-label="Stories to test"
      class="nysds-preview-bar nys-position-sticky nys-display-flex nys-flex-column nys-flex-gap-100 nys-padding-x-400 nys-padding-y-200 nys-font-ui-md"
    >${stepper}
      <p class="nys-margin-1px"><a href="/preview/" class="nysds-preview-home nys-display-block nys-font-ui-lg nys-padding-y-200">Home</a></p>
    </nav>`;
}

/** A story page. Bare pages (for screenshots) have no bottom bar. */
function pageHtml(pages, index, bare = false) {
  const page = pages[index];
  const position =
    pages.length > 1 && !bare ? ` (${index + 1} of ${pages.length})` : "";
  const barStyle = bare ? "" : `\n    ${BAR_STYLE}`;
  return `<!doctype html>
<html lang="en">
  ${headHtml(
    `${pageLabel(page)}${position}`,
    `${barStyle}
    <script type="module" src="/assets/js/${page.dir}.js"></script>`,
  )}
  <body class="nys-display-flex nys-flex-column">
    <main class="nys-flex-1 nys-padding-400">
${page.html
  .split("\n")
  .map((line) => (line ? `      ${line}` : line))
  .join("\n")}
    </main>${bare ? "" : navBar(pages, index)}
  </body>
</html>
`;
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) {
    console.warn(`⚠ Missing ${path.relative(ROOT, from)} — not copied.`);
    return;
  }
  fs.cpSync(from, to, { recursive: true });
}

// --- Main -------------------------------------------------------------------

function writeOutput(name, value) {
  if (process.env.GITHUB_OUTPUT)
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

/** Stylesheets, fonts, images and icons, at the same paths Storybook serves them. */
function copyAssets(root, dist) {
  copyDir(
    path.join(root, "packages/styles/dist"),
    path.join(dist, "assets/css"),
  );
  copyDir(
    path.join(root, ".storybook/assets/fonts"),
    path.join(dist, "assets/fonts"),
  );
  copyDir(
    path.join(root, ".storybook/assets/images"),
    path.join(dist, "assets/images"),
  );
  copyDir(
    path.join(root, "packages/nys-icon/dist/icons"),
    path.join(dist, "assets/icons"),
  );
  copyDir(path.join(root, "public"), dist);
  fs.copyFileSync(
    path.join(root, "favicon.svg"),
    path.join(dist, "favicon.svg"),
  );
}

/** Copies the full NYSDS component bundle the landing page uses, building it if needed. */
function copyComponentBundle() {
  // `npm run build` doesn't produce the single-file UMD bundle.
  if (!fs.existsSync(NYSDS_BUNDLE)) {
    console.log("Building dist/nysds.js for the landing page…");
    spawnSync("npm", ["run", "build:umd"], { cwd: ROOT, stdio: "inherit" });
  }
  if (!fs.existsSync(NYSDS_BUNDLE)) {
    console.warn(
      "⚠ Missing dist/nysds.js — the landing page's header, footer and cards won't render. Run npm run build:umd.",
    );
    return;
  }
  fs.mkdirSync(path.join(DIST, "assets/js"), { recursive: true });
  fs.copyFileSync(NYSDS_BUNDLE, path.join(DIST, "assets/js/nysds.js"));
}

/** "12 stories from 2 components", or a note that nothing changed. */
function previewSummary(pages) {
  if (pages.length === 0) return "No changed components to preview";
  const components = new Set(pages.map((page) => page.dir)).size;
  const stories = `${pages.length} ${pages.length === 1 ? "story" : "stories"}`;
  const from = `${components} ${components === 1 ? "component" : "components"}`;
  return `${stories} from ${from}`;
}

/**
 * The data the landing page template fills itself in from: the pull request
 * and, for each review tool this build has, where it is and a short summary.
 * A tool that wasn't generated is null.
 */
function siteData(pages, vr, hasCodeReview, pr) {
  return {
    pullRequest: pr,
    apps: {
      preview: { href: "/preview/", summary: previewSummary(pages) },
      visual: vr
        ? { href: "/visual/", summary: visualReportSummary(vr) }
        : null,
      codeReview: hasCodeReview
        ? {
            href: "/code-review/",
            summary: "Generated code, Current vs. Proposed",
          }
        : null,
    },
  };
}

/**
 * The data the story list template (templates/preview.html) fills
 * itself in from: the pull request, the visual regression summary (null
 * without a report), and the stories grouped by component in testing order.
 */
function previewData(pages, vr, pr) {
  const components = [];
  for (const page of pages) {
    let component = components.find((entry) => entry.dir === page.dir);
    if (!component) {
      component = { dir: page.dir, title: page.title, pages: [] };
      components.push(component);
    }
    component.pages.push({ story: page.story, path: page.path });
  }
  return {
    pullRequest: pr,
    visualReport: vr
      ? { href: "/visual/", summary: visualReportSummary(vr) }
      : null,
    components,
  };
}

/**
 * The site around the story pages: the landing page and its data, the story
 * list at /preview/, the VR report, the code review page and robots.txt.
 */
function writeSite(pages, vr) {
  const pr = pullRequest();

  // The story list: a static template plus the data it renders.
  fs.mkdirSync(path.join(DIST, "preview"), { recursive: true });
  fs.copyFileSync(PREVIEW_TEMPLATE, path.join(DIST, "preview/index.html"));
  fs.writeFileSync(
    path.join(DIST, "preview/pages.js"),
    `window.PREVIEW_DATA = ${JSON.stringify(previewData(pages, vr, pr), null, 2)};\n`,
  );

  // Self-contained (relative paths), so it works as-is under /visual/.
  if (vr) copyDir(VR_REPORT, path.join(DIST, "visual"));

  // The page and its review-data.js; the page loads NYSDS from jsDelivr.
  const hasCodeReview = fs.existsSync(CODE_REVIEW_PAGE);
  if (hasCodeReview) {
    copyDir(path.dirname(CODE_REVIEW_PAGE), path.join(DIST, "code-review"));
  }

  copyComponentBundle();
  fs.copyFileSync(LANDING_TEMPLATE, path.join(DIST, "index.html"));
  // A script rather than JSON, like the VR report's results.js.
  fs.writeFileSync(
    path.join(DIST, "site-data.js"),
    `window.SITE_DATA = ${JSON.stringify(siteData(pages, vr, hasCodeReview, pr), null, 2)};\n`,
  );

  fs.writeFileSync(
    path.join(DIST, "robots.txt"),
    "User-agent: *\nDisallow: /\n",
  );
}

/**
 * Builds one static page per story of the given components ([{ dir }]) into
 * `dist`, with each component's script and the shared assets. `root` is the
 * project to build from (the visual regression run passes the base branch's
 * worktree). Bare pages leave out the bottom bar. Returns the pages in testing
 * order: [{ dir, title, story, exportName, path, tags }].
 */
export async function buildPages({
  components,
  dist,
  root = ROOT,
  bare = false,
}) {
  // Vite identifies modules by real path. Through a symlink (macOS's /var is
  // /private/var, where the base worktree lives) the harness page's inline
  // script is registered under one path and looked up under the other.
  root = fs.realpathSync(root);
  fs.mkdirSync(path.dirname(dist), { recursive: true });
  dist = path.join(fs.realpathSync(path.dirname(dist)), path.basename(dist));
  await snapshotStories(
    root,
    path.join(path.dirname(dist), "harness"),
    components,
  );

  const pages = [];
  for (const component of components) {
    for (const { stories } of component.files) {
      for (const story of stories) {
        pages.push({
          dir: component.dir,
          title: component.title,
          story: story.name,
          exportName: story.exportName,
          tags: story.tags,
          path: `${component.dir}/${kebab(story.exportName)}`,
          html: await formatMarkup(story.html),
        });
      }
    }
  }

  // Component scripts: a package's stories modules, minus their story objects,
  // register the component (and its dependencies) and run module-scope setup.
  const ENTRY = "\0preview-entry:";
  const entries = new Map(
    components.map((component) => [
      component.dir,
      component.files.map((storyFile) => storyFile.file),
    ]),
  );
  await build({
    ...viteBase(root),
    publicDir: false,
    plugins: [
      stubStorybook,
      {
        name: "preview-entries",
        resolveId: (id) => (id.startsWith(ENTRY) ? id : null),
        load: (id) =>
          id.startsWith(ENTRY)
            ? entries
                .get(id.slice(ENTRY.length))
                .map((file) => `import ${JSON.stringify(file)};`)
                .join("\n")
            : null,
      },
    ],
    build: {
      outDir: dist,
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (
            warning.code === "INVALID_ANNOTATION" &&
            warning.message.includes("@stencil/core")
          )
            return;
          defaultHandler(warning);
        },
        input: Object.fromEntries(
          components.map((component) => [
            component.dir,
            `${ENTRY}${component.dir}`,
          ]),
        ),
        output: {
          entryFileNames: "assets/js/[name].js",
          chunkFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
        },
      },
    },
  });

  for (const [index, page] of pages.entries()) {
    const pageDir = path.join(dist, page.path);
    fs.mkdirSync(pageDir, { recursive: true });
    fs.writeFileSync(
      path.join(pageDir, "index.html"),
      pageHtml(pages, index, bare),
    );
  }
  copyAssets(root, dist);
  return pages;
}

async function main() {
  const args = process.argv.slice(2);
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const vr = visualReport();
  writeOutput("vr", vr ? 1 : 0);

  const components = affectedPackages(readComponentPackages(), args).filter(
    (component) => storyFiles(component.dir).length > 0,
  );
  if (!components.length) {
    console.log("No affected components with stories — nothing to preview.");
    fs.writeFileSync(
      path.join(OUT, "manifest.json"),
      JSON.stringify({ pages: [], components: [] }, null, 2),
    );
    writeOutput("pages", 0);
    // The landing page and the other review tools are still published.
    fs.mkdirSync(DIST, { recursive: true });
    copyAssets(ROOT, DIST);
    writeSite([], vr);
    console.log(
      `✓ Wrote the landing page to ${path.relative(ROOT, DIST)}/ — no story pages`,
    );
    return;
  }
  console.log(
    `Previewing ${components.length} component(s): ${components.map((component) => component.dir).join(", ")}`,
  );

  const pages = await buildPages({ components, dist: DIST });
  writeSite(pages, vr);

  const manifest = {
    // `pagePath`, because `path` is the Node path module here.
    pages: pages.map(({ dir, title, story, path: pagePath }) => ({
      dir,
      title,
      story,
      path: pagePath,
    })),
    components: components.map((component) => ({
      dir: component.dir,
      title: component.title,
      reason: component.reason,
      firstPath: pages.find((page) => page.dir === component.dir)?.path,
      stories: pages.filter((page) => page.dir === component.dir).length,
    })),
  };
  fs.writeFileSync(
    path.join(OUT, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  writeOutput("pages", pages.length);

  console.log(
    `✓ Wrote ${pages.length} page(s) to ${path.relative(ROOT, DIST)}/ — landing page at /, story list at /preview/${vr ? ", visual report at /visual/" : ""}${fs.existsSync(CODE_REVIEW_PAGE) ? ", code review at /code-review/" : ""}`,
  );
}

// Run only as a script; visual.mjs imports buildPages() without building the site.
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

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
 *   node src/scripts/build-preview.mjs                  changed vs $PREVIEW_BASE (default origin/develop)
 *   node src/scripts/build-preview.mjs nys-select ...   treat these packages as changed
 *   node src/scripts/build-preview.mjs --all            every component
 *
 * Requires built packages (npm run build:packages). Story markup is captured by
 * rendering each story in Chromium with custom element registration disabled,
 * so the snapshot is the authored markup, not the upgraded DOM.
 *
 * A story tagged "!preview" (tags: ["!preview"]) is skipped.
 */
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { build, createServer } from "vite";
import { chromium } from "playwright";
import prettier from "prettier";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const OUT = path.join(ROOT, ".preview");
const DIST = path.join(OUT, "dist");
const SHARED_PACKAGES = new Set(["tokens", "styles", "internals", "codegen"]);
const SHARED_FILES = new Set(["src/scripts/generate-stories.mjs"]);

// --- Affected packages ------------------------------------------------------

function readComponentPackages() {
  const packages = new Map();
  for (const dir of fs.readdirSync(path.join(ROOT, "packages"))) {
    if (!dir.startsWith("nys-")) continue;
    const pkgPath = path.join(ROOT, "packages", dir, "package.json");
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
  return [
    ...new Set([
      ...git("diff", "--name-only", `${base}...HEAD`),
      ...git("diff", "--name-only", "HEAD"),
    ]),
  ];
}

/** Returns [{ dir, reason }] — changed packages first, then their dependents. */
function affectedPackages(packages, args) {
  const all = [...packages.keys()].sort();
  if (args.includes("--all"))
    return all.map((dir) => ({ dir, reason: "All components" }));

  let changed;
  const named = args.filter((a) => !a.startsWith("--"));
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
      files.map((f) => f.match(/^packages\/([^/]+)\//)?.[1]).filter(Boolean),
    );
    const sharedHit =
      [...dirs].find((d) => SHARED_PACKAGES.has(d)) ??
      files.find((f) => SHARED_FILES.has(f));
    if (sharedHit) {
      console.log(
        `Shared code changed (${sharedHit}) — previewing every component.`,
      );
      return all.map((dir) => ({ dir, reason: `Uses ${sharedHit}` }));
    }
    changed = [...dirs].filter((d) => packages.has(d)).sort();
  }

  const dependents = new Map(all.map((dir) => [dir, []]));
  for (const { dir, deps } of packages.values()) {
    for (const dep of deps) dependents.get(dep)?.push(dir);
  }

  const result = changed.map((dir) => ({ dir, reason: "Changed in this PR" }));
  const seen = new Set(changed);
  for (let i = 0; i < result.length; i++) {
    for (const dependent of dependents.get(result[i].dir).sort()) {
      if (seen.has(dependent)) continue;
      seen.add(dependent);
      result.push({ dir: dependent, reason: `Uses ${result[i].dir}` });
    }
  }
  return result;
}

// --- Story snapshots --------------------------------------------------------

function storyFiles(dir) {
  const src = path.join(ROOT, "packages", dir, "src");
  return fs
    .readdirSync(src)
    .filter((f) => f.endsWith(".stories.ts"))
    .sort()
    .map((f) => path.join(src, f));
}

/** Story export names in source order (module namespaces are alphabetical). */
function storyExportOrder(file) {
  const source = fs.readFileSync(file, "utf8");
  return [...source.matchAll(/^export const (\w+)\b/gm)].map((m) => m[1]);
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
      Object.entries(args).filter(([, v]) => v === "").map(([k]) => k.toLowerCase()),
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
    stories.push({ exportName, name: story.name ?? toTitle(exportName), html });
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

const viteBase = {
  configFile: false,
  root: ROOT,
  logLevel: "warn",
  css: { postcss: null },
  plugins: [stubStorybook],
};

async function snapshotStories(components) {
  const harnessDir = path.join(OUT, "harness");
  fs.mkdirSync(harnessDir, { recursive: true });
  fs.writeFileSync(path.join(harnessDir, "index.html"), HARNESS_HTML);

  const server = await createServer({
    ...viteBase,
    publicDir: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { port: 0, host: "127.0.0.1", hmr: false },
  });
  await server.listen();
  const origin = server.resolvedUrls.local[0].replace(/\/$/, "");

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.on("pageerror", (err) => console.warn(`⚠ ${err.message}`));
    await page.goto(`${origin}/.preview/harness/index.html`);
    await page.waitForFunction(() => window.__ready === true);

    for (const component of components) {
      component.files = [];
      for (const file of storyFiles(component.dir)) {
        const url = "/" + path.relative(ROOT, file).split(path.sep).join("/");
        const { title, stories } = await page.evaluate(
          ([u, order]) => window.__snapshotStories(u, order),
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

const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

const kebab = (s) =>
  s
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
    </style>`;

const pageLabel = (p) => `${p.title}, ${p.story}`;

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

// Landing page styles, built only from @nysds/styles tokens. Each link is at
// least 44px tall (--nys-size-550) so it's easy to activate on touch screens.
const HOME_STYLE = `
    <style>
      .nysds-preview-hero {
        background: var(--nys-color-theme);
        color: var(--nys-color-text-reverse);
      }
      .nysds-preview-hero h1 { margin: 0 0 var(--nys-space-200); }
      .nysds-preview-hero p {
        margin: 0;
        max-width: 40rem;
        font-size: var(--nys-font-size-body-lg);
      }
      .nysds-preview-hero .nysds-preview-eyebrow {
        margin-bottom: var(--nys-space-100);
        font-size: var(--nys-font-size-ui-sm);
        font-weight: var(--nys-font-weight-semibold);
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .nysds-preview-hero .nysds-preview-pr {
        margin-bottom: var(--nys-space-100);
        font-weight: var(--nys-font-weight-semibold);
      }
      .nysds-preview-hero a,
      .nysds-preview-hero a:focus,
      .nysds-preview-hero a:active { color: var(--nys-color-link-reverse); }
      .nysds-preview-hero a:focus-visible {
        outline: var(--nys-border-width-md) solid var(--nys-color-focus-reverse);
        outline-offset: var(--nys-border-width-md);
      }
      main h2 { margin-top: 0; }
      .nysds-preview-list {
        margin: var(--nys-space-300) 0 0;
        padding-inline-start: var(--nys-space-600);
      }
      .nysds-preview-list li::marker {
        color: var(--nys-color-text-weak);
        font-variant-numeric: tabular-nums;
      }
      .nysds-preview-list a {
        display: flex;
        align-items: center;
        min-height: var(--nys-size-550);
        padding: var(--nys-space-100) var(--nys-space-200);
        border-bottom: var(--nys-border-width-sm) solid var(--nys-color-neutral-100);
      }
      .nysds-preview-list li:first-child a {
        border-top: var(--nys-border-width-sm) solid var(--nys-color-neutral-100);
      }
      .nysds-preview-list a:hover { background: var(--nys-color-theme-faint); }
      .nysds-preview-list a:focus-visible {
        outline: var(--nys-border-width-md) solid var(--nys-color-focus);
        outline-offset: calc(var(--nys-border-width-md) * -1);
      }
      .nysds-preview-component { font-weight: var(--nys-font-weight-semibold); }
    </style>`;

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

function pullRequestHtml(pr) {
  if (!pr) return "";
  const label = `Pull request #${escapeHtml(pr.number)}`;
  const link = pr.url
    ? `<a href="${escapeHtml(pr.url)}" style="color: var(--nys-color-ink-reverse);">${pr.title}</a>`
    : label;
  return `
        <p class="nysds-preview-pr">${link} - ${label}</p>`;
}

/** The landing page: every story, in testing order. */
function homeHtml(pages, pr) {
  const components = new Set(pages.map((p) => p.dir)).size;
  const stories = `${pages.length} ${pages.length === 1 ? "story" : "stories"}`;
  const from = `${components} ${components === 1 ? "component" : "components"}`;
  return `<!doctype html>
<html lang="en">
  ${headHtml(`${pr ? `PR #${pr.number} – ` : ""}NYSDS Component Testing Environment`, HOME_STYLE)}
  <body>
    <header class="nysds-preview-hero">
      <div class="nys-grid-container nys-grid-container-tablet nys-padding-y-200">
        <p class="nysds-preview-eyebrow">NYSDS Component Testing</p>
        <h1 style="font-size: var(--nys-font-size-ui);">${pullRequestHtml(pr)}</h1>
      </div>
    </header>
    <main class="nys-grid-container nys-grid-container-tablet nys-padding-y-600">
      <h2>${stories} from ${from}</h2>
      <ol class="nysds-preview-list nys-font-ui-md">
${pages
  .map(
    (p) =>
      `        <li><a href="/${p.path}/"><span><span class="nysds-preview-component">${escapeHtml(p.title)}</span>, ${escapeHtml(p.story)}</span></a></li>`,
  )
  .join("\n")}
      </ol>
    </main>
  </body>
</html>
`;
}

function navBar(pages, i) {
  const prev = pages[i - 1];
  const next = pages[i + 1];
  const stepper =
    pages.length < 2
      ? ""
      : `
      <div class="nys-display-flex nys-flex-justify-space-between nys-flex-align-center nys-flex-gap-200">
        ${prev ? `<a href="/${prev.path}/">Previous: ${escapeHtml(pageLabel(prev))}</a>` : "<span></span>"}
        <span>${i + 1} of ${pages.length}</span>
        ${next ? `<a href="/${next.path}/">Next: ${escapeHtml(pageLabel(next))}</a>` : "<span></span>"}
      </div>`;
  return `
    <nav
      aria-label="Stories to test"
      class="nysds-preview-bar nys-position-sticky nys-display-flex nys-flex-column nys-flex-gap-100 nys-padding-x-400 nys-padding-y-200 nys-font-ui-md"
    >${stepper}
      <p><a href="/"
      style="display: block;
        text-align: center;
        font-size: var(--nys-font-size-ui-lg);
        background-color: var(--nys-color-theme);
        color: #fff;
        text-decoration: none;
        padding: 1rem 0;">Home</a>
      </p>
    </nav>`;
}

function pageHtml(pages, i) {
  const p = pages[i];
  const position = pages.length > 1 ? ` (${i + 1} of ${pages.length})` : "";
  return `<!doctype html>
<html lang="en">
  ${headHtml(
    `${pageLabel(p)}${position}`,
    `
    ${BAR_STYLE}
    <script type="module" src="/assets/js/${p.dir}.js"></script>`,
  )}
  <body class="nys-display-flex nys-flex-column">
    <main class="nys-flex-1 nys-padding-400">
${p.html
  .split("\n")
  .map((line) => (line ? `      ${line}` : line))
  .join("\n")}
    </main>${navBar(pages, i)}
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

async function main() {
  const args = process.argv.slice(2);
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const components = affectedPackages(readComponentPackages(), args).filter(
    (c) => storyFiles(c.dir).length > 0,
  );
  if (!components.length) {
    console.log("No affected components with stories — nothing to preview.");
    fs.writeFileSync(
      path.join(OUT, "manifest.json"),
      JSON.stringify({ pages: [], components: [] }, null, 2),
    );
    writeOutput("pages", 0);
    return;
  }
  console.log(
    `Previewing ${components.length} component(s): ${components.map((c) => c.dir).join(", ")}`,
  );

  await snapshotStories(components);

  const pages = [];
  for (const c of components) {
    for (const { stories } of c.files) {
      for (const s of stories) {
        pages.push({
          dir: c.dir,
          title: c.title,
          story: s.name,
          path: `${c.dir}/${kebab(s.exportName)}`,
          html: await formatMarkup(s.html),
        });
      }
    }
  }

  // Component scripts: a package's stories modules, minus their story objects,
  // register the component (and its dependencies) and run module-scope setup.
  const ENTRY = "\0preview-entry:";
  const entries = new Map(
    components.map((c) => [c.dir, c.files.map((f) => f.file)]),
  );
  await build({
    ...viteBase,
    publicDir: false,
    plugins: [
      ...viteBase.plugins,
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
      outDir: DIST,
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
          components.map((c) => [c.dir, `${ENTRY}${c.dir}`]),
        ),
        output: {
          entryFileNames: "assets/js/[name].js",
          chunkFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
        },
      },
    },
  });

  for (const [i, p] of pages.entries()) {
    fs.mkdirSync(path.join(DIST, p.path), { recursive: true });
    fs.writeFileSync(path.join(DIST, p.path, "index.html"), pageHtml(pages, i));
  }

  // Same asset paths Storybook serves, so story markup that references them works.
  copyDir(
    path.join(ROOT, "packages/styles/dist"),
    path.join(DIST, "assets/css"),
  );
  copyDir(
    path.join(ROOT, ".storybook/assets/fonts"),
    path.join(DIST, "assets/fonts"),
  );
  copyDir(
    path.join(ROOT, ".storybook/assets/images"),
    path.join(DIST, "assets/images"),
  );
  copyDir(
    path.join(ROOT, "packages/nys-icon/dist/icons"),
    path.join(DIST, "assets/icons"),
  );
  copyDir(path.join(ROOT, "public"), DIST);
  fs.copyFileSync(
    path.join(ROOT, "favicon.svg"),
    path.join(DIST, "favicon.svg"),
  );

  fs.writeFileSync(
    path.join(DIST, "index.html"),
    homeHtml(pages, pullRequest()),
  );
  fs.writeFileSync(
    path.join(DIST, "robots.txt"),
    "User-agent: *\nDisallow: /\n",
  );

  const manifest = {
    pages: pages.map(({ dir, title, story, path: p }) => ({
      dir,
      title,
      story,
      path: p,
    })),
    components: components.map((c) => ({
      dir: c.dir,
      title: c.title,
      reason: c.reason,
      firstPath: pages.find((p) => p.dir === c.dir)?.path,
      stories: pages.filter((p) => p.dir === c.dir).length,
    })),
  };
  fs.writeFileSync(
    path.join(OUT, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  writeOutput("pages", pages.length);

  console.log(
    `✓ Wrote ${pages.length} page(s) to ${path.relative(ROOT, DIST)}/ — home page lists them at /`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

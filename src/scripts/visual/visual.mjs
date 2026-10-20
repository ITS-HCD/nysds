#!/usr/bin/env node
/**
 * Local visual regression for NYSDS — no hosted service.
 *
 *   npm run vr:test [-- --build] [--base origin/develop] [--fresh-baseline] [--no-states] [--filter button]
 *                   [--threshold 0.05] [--min-change 0.05] [--viewport desktop|mobile|all]
 *                                    capture baselines from the base branch, then compare
 *                                    every story on this branch against them
 *   npm run vr:baseline [-- --base origin/develop] [--fresh-baseline] [--filter button] [--viewport desktop|mobile|all]
 *                                    only capture the baselines
 *
 * Baseline screenshots are reused while the base commit and the rendering and
 * capture code (build-preview.mjs, visual.mjs, states.mjs) are unchanged;
 * --fresh-baseline recaptures them anyway; --skip-baseline uses whatever
 * baselines exist without checking (or fetching) the base branch.
 *   npm run vr:report [-- --port 6007] [--no-open]
 *                                    serve the generated report locally
 *
 * Stories are screenshotted as the same static pages the PR preview publishes
 * (build-preview.mjs), one page per story, built without the preview's bottom
 * bar. No Storybook build is involved.
 *
 * Baselines are never stored in the repo. They are rendered from the base branch
 * (--base, else $VR_BASE, else origin/develop): that commit is checked out in a
 * git worktree under .visual/base (gitignored), its packages are built, and this branch's
 * build-preview.mjs renders its pages, which are captured into
 * .visual/baselines. The worktree and its pages are kept per commit, so reruns
 * against an unchanged base skip the build. --base-pages <dir> uses pages
 * already built that way instead.
 *
 * This branch's pages are then built into .visual/pages and compared against
 * those baselines. They need built packages: --build (or missing
 * packages/styles/dist) runs npm run build:packages first. Interactive states
 * (hover, active, focus) listed in states.mjs get their own screenshots;
 * --no-states skips them. Stories tagged "!preview" or "skip-vr" aren't captured.
 *
 * The report is read-only: it shows what changed and nothing more. It is
 * written to .visual/report/ as a self-contained static site (relative paths,
 * no server endpoints), so the folder can be opened from disk or deployed
 * as-is. The PR preview publishes it at /visual/.
 */
import { spawnSync, execFileSync, exec } from "node:child_process";
import {
  copyFileSync, createReadStream, existsSync, mkdirSync, readFileSync,
  readdirSync, rmSync, statSync, writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { availableParallelism } from "node:os";
import { createServer } from "node:http";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import STATES from "./states.mjs";
import { buildPages, readComponentPackages, storyFiles } from "../build-preview.mjs";

const ROOT = resolve(fileURLToPath(import.meta.url), "../../../..");
const OUT = join(ROOT, ".visual");
// This branch's story pages; the base branch's live in its worktree.
const HEAD_PAGES = join(OUT, "pages");
// Pages built by an older build-preview.mjs are stale even for the same commit.
const BUILDER = createHash("sha1")
  .update(readFileSync(join(ROOT, "src/scripts/build-preview.mjs")))
  .digest("hex")
  .slice(0, 12);
const DIRS = {
  baselines: join(OUT, "baselines"),
  current: join(OUT, "current"),
  diff: join(OUT, "diff"),
};
const RESULTS = join(OUT, "results.json");
const REPORT = join(OUT, "report");
// Which base commit the current baselines were captured from.
const BASE_INFO = join(OUT, "base.json");
// Base-branch worktrees, one per commit, inside the gitignored .visual folder.
// ESLint, Stylelint, Prettier and Vite's watcher ignore .visual/ so they never
// pick up this second copy of the source.
const BASE_WORKTREES = join(OUT, "base");

const args = process.argv.slice(2);
const cmd = args[0] && !args[0].startsWith("--") ? args[0] : "test";
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const next = args[i + 1];
  return next && !next.startsWith("--") ? next : true;
};
const filter = flag("filter", "");
// pixelmatch per-pixel color tolerance (0-1, lower = stricter). Base and head are
// rendered by the same browser, so this can sit below pixelmatch's 0.1 default,
// which treats light grays such as neutral-50 (#ededed) as white.
const threshold = Number(flag("threshold", 0.05));
// Minimum % of changed pixels (0-100) before a story counts as "changed".
// Anything below it is reported as "passed". 0 = any differing pixel counts.
const minChange = Number(flag("min-change", 0.05));
const VIEWPORTS = { desktop: [1024, 768], mobile: [390, 900] };
const vpFlag = String(flag("viewport", "all"));
const viewports = vpFlag === "all" ? Object.keys(VIEWPORTS) : [vpFlag];
if (viewports.some((v) => !VIEWPORTS[v])) {
  console.error(`Unknown --viewport "${vpFlag}". Use desktop, mobile or all.`);
  process.exit(1);
}
const file = (kind, vp, id) => join(DIRS[kind], vp, `${id}.png`);
const concurrency = Number(flag("concurrency", Math.min(8, Math.max(2, availableParallelism() - 1))));

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".png": "image/png",
  ".svg": "image/svg+xml", ".woff": "font/woff", ".woff2": "font/woff2",
  ".ico": "image/x-icon", ".map": "application/json", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp",
  ".otf": "font/otf", ".ttf": "font/ttf", ".mp4": "video/mp4",
};

function serveDir(dir, port = 0) {
  return new Promise((res) => {
    const server = createServer((req, resp) => {
      const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
      let file = join(dir, path);
      // Story pages are folders: /nys-accordion/basic/ serves its index.html.
      if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
      if (!file.startsWith(dir) || !existsSync(file) || statSync(file).isDirectory()) {
        resp.writeHead(404).end("Not found");
        return;
      }
      resp.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream" });
      createReadStream(file).pipe(resp);
    });
    server.listen(port, "127.0.0.1", () => res(server));
  });
}

// The review UI is built with NYSDS itself: serve the built component bundle and styles.
const NYSDS_DIST = join(ROOT, "dist");
const NYSDS_CSS = join(ROOT, "packages/styles/dist");

const readPng = (p) => PNG.sync.read(readFileSync(p));
const pad = (img, w, h) => {
  if (img.width === w && img.height === h) return img;
  const out = new PNG({ width: w, height: h });
  out.data.fill(255);
  PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
  return out;
};

function compare(vp, id, meta) {
  meta = { ...meta, viewport: vp };
  const cur = file("current", vp, id);
  const base = file("baselines", vp, id);
  if (!existsSync(base)) return { ...meta, id, status: "new" };

  const a = readPng(base);
  const b = readPng(cur);
  const w = Math.max(a.width, b.width);
  const h = Math.max(a.height, b.height);
  const A = pad(a, w, h);
  const B = pad(b, w, h);
  const diff = new PNG({ width: w, height: h });
  const diffPixels = pixelmatch(A.data, B.data, diff.data, w, h, {
    threshold, diffColor: [255, 0, 0], alpha: 0.25,
  });
  const sizeChanged = a.width !== b.width || a.height !== b.height;
  const diffPercent = (diffPixels / (w * h)) * 100;
  if (!sizeChanged && (diffPixels === 0 || diffPercent < minChange)) {
    return { ...meta, id, status: "passed", ...(diffPixels && { diffPixels, diffPercent }) };
  }

  // Bounding box of the changed region, for "where did it change".
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (diff.data[i] === 255 && diff.data[i + 1] === 0 && diff.data[i + 2] === 0) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  writeFileSync(file("diff", vp, id), PNG.sync.write(diff));
  return {
    ...meta, id, status: "changed", diffPixels,
    diffPercent,
    bbox: x1 >= 0 ? { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 } : null,
    baselineSize: [a.width, a.height], currentSize: [b.width, b.height], sizeChanged,
  };
}

// Runs in the page: wait for fonts, Lit updates, and every image/video poster —
// including ones inside shadow roots (e.g. nys-video's remote thumbnail).
async function settle() {
  await document.fonts.ready;
  const all = (root) =>
    [...root.querySelectorAll("*")].flatMap((e) => [e, ...(e.shadowRoot ? all(e.shadowRoot) : [])]);
  for (let pass = 0; pass < 3; pass++) {
    const els = all(document);
    // Lazy images below the fold never load during a full-page capture.
    els.forEach((e) => { if (e.tagName === "IMG" && e.loading === "lazy") e.loading = "eager"; });
    await Promise.all(els.filter((e) => e.updateComplete).map((e) => e.updateComplete));
    await Promise.all(
      els
        .filter((e) => e.tagName === "IMG" && !e.complete)
        .map((e) => new Promise((r) => { e.onload = e.onerror = r; setTimeout(r, 20000); })),
    );
    await Promise.all(els.filter((e) => e.tagName === "IMG" && e.decode).map((e) => e.decode().catch(() => {})));
  }
}

// Re-shoot until two consecutive frames are byte-identical, so late paints
// (lazy images, font swaps) don't register as regressions. Gives up after 5 tries.
async function stabilize(page, out) {
  let prev = readFileSync(out);
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(250);
    await page.evaluate(settle);
    const next = await page.screenshot({ fullPage: true });
    if (next.equals(prev)) return;
    writeFileSync(out, next);
    prev = next;
  }
}

// Remote assets (YouTube thumbnails, Unsplash photos…) are fetched once and
// replayed from .visual/net-cache, so captures don't depend on network timing
// and every worker sees identical bytes. Delete the folder to refresh.
const NET_CACHE = join(OUT, "net-cache");
async function cacheRemote(context) {
  mkdirSync(NET_CACHE, { recursive: true });
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, async (route) => {
    const req = route.request();
    if (req.method() !== "GET" || !["image", "font", "stylesheet", "media"].includes(req.resourceType())) {
      return route.continue();
    }
    const key = createHash("sha1").update(req.url()).digest("hex");
    const body = join(NET_CACHE, key), meta = `${body}.json`;
    try {
      if (!existsSync(meta)) {
        const res = await route.fetch({ timeout: 20000 });
        if (!res.ok()) return route.fulfill({ response: res });
        writeFileSync(body, await res.body());
        writeFileSync(meta, JSON.stringify({ status: res.status(), headers: res.headers() }));
      }
      const { status, headers } = JSON.parse(readFileSync(meta, "utf8"));
      delete headers["content-encoding"]; delete headers["content-length"];
      await route.fulfill({ status, headers, body: readFileSync(body) });
    } catch {
      await route.continue().catch(() => {});
    }
  });
}

/** True when any element matching `targets` is focused, through shadow roots. */
const hasFocus = (targets) =>
  targets.evaluateAll((nodes) => {
    for (let a = document.activeElement; a; a = a.shadowRoot?.activeElement) if (nodes.includes(a)) return true;
    return false;
  });

/**
 * Puts the shot's target into its interactive state with real input. Hover and
 * active move the mouse to the target's center (force: whatever is on top
 * there gets hovered, as it would for a user, even when an overlay would make
 * Playwright refuse). Focus tabs to the target like a keyboard user, so
 * :focus-visible applies; script focus can't reach some components' shadow
 * DOM, so it's only the fallback.
 */
async function interact(page, shot) {
  if (shot.open) await page.locator(shot.open).first().click({ timeout: 5000 });
  const targets = page.locator(shot.target);
  const el = targets.first();
  await el.waitFor({ state: "attached", timeout: 5000 });
  if (shot.state === "focus") {
    // The first match isn't always tabbable (a stepper's first step), so any match counts.
    for (let i = 0; i < 40 && !(await hasFocus(targets)); i++) await page.keyboard.press("Tab");
    if (!(await hasFocus(targets))) await el.focus();
    if (!(await hasFocus(targets))) throw new Error(`Could not focus ${shot.target}`);
    return;
  }
  // Components can keep hidden copies of their markup; hover a visible one.
  await targets.filter({ visible: true }).first().hover({ timeout: 5000, force: true });
  if (shot.state === "active") await page.mouse.down();
}

/**
 * The screenshots for a viewport: every story, plus one per interactive state in
 * states.mjs. A state shot loads its story fresh, so it never inherits another
 * shot's hover or focus. `all` is the full story list, used to find each state's
 * story even when --filter narrows `stories`.
 */
function shotsFor(stories, all, vp) {
  const shots = stories.map((s) => ({ id: s.id, path: s.path, title: s.title, name: s.name }));
  if (flag("no-states", false)) return shots;
  const wanted = new Set(stories.map((s) => s.id));
  for (const entry of STATES) {
    if (!entry.states || (entry.viewports && !entry.viewports.includes(vp))) continue;
    const own = all.filter((s) => s.dir === entry.package);
    const story = entry.story ? own.find((s) => s.path.endsWith(`/${entry.story}`)) : own[0];
    if (!story || !wanted.has(story.id)) continue;
    for (const state of entry.states) {
      shots.push({
        id: `${story.id}.${state}`, path: story.path, title: story.title,
        name: `${story.name} (${state})`, state, target: entry.target, open: entry.open,
      });
    }
  }
  return shots;
}

/** Packages whose SCSS styles :hover/:active/:focus-visible but have no entry in states.mjs. */
function uncoveredStates() {
  const covered = new Set(STATES.map((e) => e.package));
  const packages = join(ROOT, "packages");
  return readdirSync(packages)
    .filter((dir) => dir.startsWith("nys-") && !covered.has(dir) && existsSync(join(packages, dir, "src")))
    .filter((dir) =>
      readdirSync(join(packages, dir, "src"))
        .filter((f) => f.endsWith(".scss"))
        .some((f) => /:(hover|active|focus-visible)\b/.test(readFileSync(join(packages, dir, "src", f), "utf8"))),
    );
}

async function capture(shots, baseUrl, vp, kind = "current") {
  const [vw, vh] = VIEWPORTS[vp];
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: vw, height: vh }, deviceScaleFactor: 1,
    reducedMotion: "reduce", colorScheme: "light",
  });
  await cacheRemote(context);
  const queue = [...shots];
  let done = 0;
  const failures = [];
  const worker = async () => {
    const page = await context.newPage();
    for (let s; (s = queue.shift()); ) {
      try {
        // Park the pointer so a previous shot's hover can't carry over.
        await page.mouse.move(0, 0);
        await page.goto(`${baseUrl}/${s.path}/`, { waitUntil: "load" });
        // "attached", not visible: some components (skipnav) are visually hidden until focused.
        await page.waitForSelector("main > *", { state: "attached", timeout: 15000 });
        await page.addStyleTag({
          content: `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}`,
        });
        const out = file(kind, vp, s.id);
        await page.waitForLoadState("networkidle", { timeout: 3000 }).catch(() => {});
        await page.evaluate(settle);
        if (s.state) await interact(page, s);
        await page.screenshot({ path: out, fullPage: true });
        // Fast path: a frame identical to the baseline is already stable.
        const base = file("baselines", vp, s.id);
        if (kind === "baselines" || !existsSync(base) || !readFileSync(base).equals(readFileSync(out))) {
          await stabilize(page, out);
        }
      } catch (e) {
        failures.push({ viewport: vp, id: s.id, error: String(e.message).split("\n")[0] });
      } finally {
        // Release a held "active" press on a blank page: releasing on the target
        // would click it, and moving away with the button held starts a drag
        // that stalls the next navigation.
        if (s.state === "active") {
          await page.goto("about:blank").catch(() => {});
          await page.mouse.up().catch(() => {});
        }
      }
      process.stdout.write(`\r  ${vp}: captured ${++done}/${shots.length}`);
    }
    await page.close();
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
  await browser.close();
  process.stdout.write("\n");
  return failures;
}

function run(command, argv, cwd) {
  const r = spawnSync(command, argv, { cwd, stdio: "inherit" });
  if (r.status) process.exit(r.status);
}

const git = (...argv) => execFileSync("git", argv, { cwd: ROOT, encoding: "utf8" }).trim();

/** The base ref and the commit it points to, fetched first when it's a remote branch. */
function resolveBase() {
  const ref = String(flag("base", process.env.VR_BASE || "origin/develop"));
  const [remote, ...branch] = ref.split("/");
  if (branch.length && git("remote").split("\n").includes(remote)) {
    // Offline is fine: fall back to whatever the ref already points to.
    spawnSync("git", ["fetch", "--quiet", remote, branch.join("/")], {
      cwd: ROOT, stdio: "inherit", env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });
  }
  return { ref, sha: git("rev-parse", "--verify", `${ref}^{commit}`) };
}

/**
 * Renders every component's stories as bare pages (no bottom bar) into
 * <out>/dist and records them in <out>/pages.json, tagged with this
 * build-preview.mjs version so a template change invalidates cached pages.
 */
async function renderPages(root, out) {
  const components = [...readComponentPackages(root).keys()]
    .sort()
    .filter((dir) => storyFiles(dir, root).length)
    .map((dir) => ({ dir }));
  const pages = await buildPages({ root, components, dist: join(out, "dist"), bare: true });
  writeFileSync(
    join(out, "pages.json"),
    JSON.stringify({
      builder: BUILDER,
      pages: pages.map(({ dir, title, story, path, tags }) => ({ dir, title, story, path, tags })),
    }),
  );
  return out;
}

const pagesCurrent = (out) => {
  try {
    return JSON.parse(readFileSync(join(out, "pages.json"), "utf8")).builder === BUILDER;
  } catch {
    return false;
  }
};

/** Builds the base commit's story pages in its own worktree; returns the pages folder. */
async function buildBasePages({ ref, sha }) {
  const override = flag("base-pages", "");
  if (override) return resolve(String(override));

  const dir = join(BASE_WORKTREES, sha.slice(0, 12));
  const out = join(dir, ".vr-pages");
  // Keep only the current base: each worktree carries its own node_modules.
  if (existsSync(BASE_WORKTREES)) {
    for (const d of readdirSync(BASE_WORKTREES).map((d) => join(BASE_WORKTREES, d))) {
      if (d === dir) continue;
      spawnSync("git", ["worktree", "remove", "--force", d], { cwd: ROOT, stdio: "ignore" });
      rmSync(d, { recursive: true, force: true });
    }
  }
  spawnSync("git", ["worktree", "prune"], { cwd: ROOT });

  if (pagesCurrent(out)) {
    console.log(`Reusing built baseline pages for ${ref} @ ${sha.slice(0, 7)}`);
    return out;
  }
  const fresh = !existsSync(dir);
  if (fresh) run("git", ["worktree", "add", "--detach", dir, sha], ROOT);
  console.log(`Building baseline pages from ${ref} @ ${sha.slice(0, 7)} in ${dir}…`);
  // Same steps the preview workflow runs on the PR branch. A worktree that was
  // already built only needs its pages re-rendered (build-preview.mjs changed).
  if (fresh || !existsSync(join(dir, "packages/styles/dist"))) {
    run("npm", ["i"], dir);
    run("npm", ["run", "build:packages"], dir);
    run("npm", ["run", "cem"], dir);
    run("node", ["src/scripts/generate-stories.mjs"], dir);
  }
  return renderPages(dir, out);
}

/** This branch's story pages, rebuilt every run; --build rebuilds the packages first. */
async function buildHeadPages() {
  if (flag("build", false) || !existsSync(join(ROOT, "packages/styles/dist"))) {
    console.log("Building packages…");
    run("npm", ["run", "build:packages"], ROOT);
  }
  console.log("Building story pages…");
  return renderPages(ROOT, HEAD_PAGES);
}

/** The pages to capture, as stories: { id, path, dir, title, name }. */
function loadStories(out) {
  const { pages } = JSON.parse(readFileSync(join(out, "pages.json"), "utf8"));
  const all = pages
    .filter((p) => !(p.tags ?? []).includes("skip-vr"))
    .map((p) => ({ id: p.path.replace("/", "--"), path: p.path, dir: p.dir, title: p.title, name: p.story }));
  const needle = String(filter).toLowerCase();
  const stories = all.filter((e) => e.id.includes(needle) || e.title.toLowerCase().includes(needle));
  return { all, stories, dist: join(out, "dist") };
}

// Changes to how pages are rendered or captured make old baseline screenshots stale.
const CAPTURE = createHash("sha1")
  .update(BUILDER)
  .update(readFileSync(fileURLToPath(import.meta.url)))
  .update(readFileSync(join(ROOT, "src/scripts/visual/states.mjs")))
  .digest("hex")
  .slice(0, 12);

/**
 * Baseline screenshots from an earlier run that this run can reuse: same base
 * commit, same rendering and capture code, states included the same way, and
 * covering every requested viewport and story (a full capture covers any --filter).
 */
function reusableBaselines(sha) {
  if (flag("fresh-baseline", false) || !existsSync(BASE_INFO)) return null;
  const prev = JSON.parse(readFileSync(BASE_INFO, "utf8"));
  const ok =
    prev.sha === sha &&
    prev.capture === CAPTURE &&
    prev.states === !flag("no-states", false) &&
    (prev.filter === "" || prev.filter === String(filter)) &&
    viewports.every((vp) => prev.viewports?.includes(vp));
  return ok ? prev : null;
}

/**
 * Baseline screenshots from the base branch's pages, captured fresh or reused
 * from an earlier run (see reusableBaselines; --fresh-baseline forces a capture).
 * Returns { ref, sha, failures }.
 */
async function captureBaselines() {
  const base = resolveBase();
  const prev = reusableBaselines(base.sha);
  if (prev) {
    console.log(`Reusing baseline screenshots from ${base.ref} @ ${base.sha.slice(0, 7)} (--fresh-baseline to recapture)`);
    return { ...base, failures: [] };
  }
  const { all, stories, dist } = loadStories(await buildBasePages(base));
  rmSync(DIRS.baselines, { recursive: true, force: true });
  rmSync(BASE_INFO, { force: true });
  for (const vp of Object.keys(VIEWPORTS)) mkdirSync(join(DIRS.baselines, vp), { recursive: true });

  const server = await serveDir(dist);
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const failures = [];
  for (const vp of viewports) {
    const shots = shotsFor(stories, all, vp);
    console.log(`Capturing ${shots.length} baselines from ${base.ref} at ${VIEWPORTS[vp].join("x")} (${vp})…`);
    failures.push(...(await capture(shots, baseUrl, vp, "baselines")));
  }
  server.close();
  for (const f of failures) console.error(`  ✗ baseline ${f.viewport}/${f.id}: ${f.error}`);
  writeFileSync(
    BASE_INFO,
    JSON.stringify({
      ref: base.ref, sha: base.sha, capture: CAPTURE, states: !flag("no-states", false),
      filter: String(filter), viewports,
    }),
  );
  console.log(`\n  Baselines from ${base.ref} @ ${base.sha.slice(0, 7)} saved to ${DIRS.baselines}\n`);
  return { ...base, failures };
}

async function runBaseline() {
  const { failures } = await captureBaselines();
  process.exitCode = failures.length ? 1 : 0;
}

async function runTest() {
  let base;
  if (flag("skip-baseline", false)) {
    if (!existsSync(BASE_INFO)) {
      console.error("No baselines yet. Run without --skip-baseline first.");
      process.exit(1);
    }
    base = JSON.parse(readFileSync(BASE_INFO, "utf8"));
    console.log(`Reusing baselines from ${base.ref} @ ${base.sha.slice(0, 7)}`);
  } else {
    base = await captureBaselines();
  }

  const { all, stories, dist } = loadStories(await buildHeadPages());
  for (const d of [DIRS.current, DIRS.diff]) {
    rmSync(d, { recursive: true, force: true });
    for (const vp of Object.keys(VIEWPORTS)) mkdirSync(join(d, vp), { recursive: true });
  }

  const server = await serveDir(dist);
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const results = [];
  const failures = [];
  const unchanged = {};
  for (const vp of viewports) {
    const shots = shotsFor(stories, all, vp);
    const states = shots.filter((s) => s.state).length;
    console.log(`Capturing ${shots.length - states} stories + ${states} interactive states at ${VIEWPORTS[vp].join("x")} (${vp})…`);
    const failed = await capture(shots, baseUrl, vp);
    failures.push(...failed);
    const bad = new Set(failed.map((f) => f.id));
    unchanged[vp] = 0;
    for (const s of shots) {
      if (bad.has(s.id)) continue;
      const r = compare(vp, s.id, { title: s.title, name: s.name, ...(s.state && { state: s.state }) });
      // Unchanged screenshots are neither kept nor reported — only changes are.
      if (r.status === "passed") {
        rmSync(file("current", vp, s.id));
        unchanged[vp]++;
      } else results.push(r);
    }

    if (!filter) {
      const live = new Set(shotsFor(all, all, vp).map((s) => s.id));
      for (const f of readdirSync(join(DIRS.baselines, vp))) {
        const id = f.replace(/\.png$/, "");
        if (!live.has(id)) results.push({ id, viewport: vp, title: id, name: "", status: "removed" });
      }
    }
  }
  server.close();
  for (const f of failures) results.push({ ...f, title: f.id, name: "", status: "error" });
  for (const r of results) r.key = `${r.viewport}/${r.id}`;

  const uncovered = uncoveredStates();
  const data = {
    generated: new Date().toISOString(),
    base: { ref: base.ref, sha: base.sha },
    viewports: VIEWPORTS, minChange, unchanged, uncovered, results,
  };
  writeFileSync(RESULTS, JSON.stringify(data, null, 2));
  writeReport(data);

  const n = (s) => results.filter((r) => r.status === s).length;
  const same = Object.values(unchanged).reduce((a, b) => a + b, 0);
  console.log(`\n  ${same} unchanged · ${n("changed")} changed · ${n("new")} new · ${n("removed")} removed · ${n("error")} errors`);
  if (uncovered.length) {
    console.warn(`  ⚠ No interactive-state coverage in states.mjs for: ${uncovered.join(", ")}`);
  }
  console.log(`  Report: ${REPORT}  (npm run vr:report to view)\n`);
  // Changes are informational only; just capture failures fail the run.
  process.exitCode = n("error") ? 1 : 0;
}

// Images each status shows in the report.
const REPORT_IMAGES = {
  changed: ["baselines", "current", "diff"],
  new: ["current"],
  removed: ["baselines"],
};

/** Writes a self-contained static site to .visual/report (deployable as-is). */
function writeReport(data) {
  rmSync(REPORT, { recursive: true, force: true });
  mkdirSync(join(REPORT, "assets"), { recursive: true });
  // The report's search field, viewport toggle and tabs are NYSDS components
  // from the single-file UMD bundle, which `npm run build` doesn't produce.
  if (!existsSync(join(NYSDS_DIST, "nysds.js"))) {
    console.log("Building dist/nysds.js for the report UI…");
    spawnSync("npm", ["run", "build:umd"], { cwd: ROOT, stdio: "inherit" });
  }
  for (const src of [join(NYSDS_DIST, "nysds.js"), join(NYSDS_CSS, "nysds-full.min.css")]) {
    if (existsSync(src)) copyFileSync(src, join(REPORT, "assets", src.split("/").pop()));
    else console.warn(`  Missing ${src}; run npm run build:umd and npm run build:packages, or the report has no controls.`);
  }
  for (const r of data.results) {
    for (const kind of REPORT_IMAGES[r.status] ?? []) {
      const dest = join(REPORT, kind, r.viewport, `${r.id}.png`);
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(file(kind, r.viewport, r.id), dest);
    }
  }
  // A script rather than JSON so the report also works when opened via file://.
  writeFileSync(join(REPORT, "results.js"), `window.VR_DATA = ${JSON.stringify(data)};\n`);
  writeFileSync(join(REPORT, "index.html"), REPORT_HTML);
}

async function runReport() {
  if (!existsSync(join(REPORT, "index.html"))) return console.error("No report. Run npm run vr:test first.");
  const server = await serveDir(REPORT, Number(flag("port", 6007)));
  const url = `http://127.0.0.1:${server.address().port}/`;
  console.log(`Visual report at ${url}  (Ctrl+C to stop)`);
  if (!flag("no-open", false)) exec(`open ${url}`);
}

const REPORT_HTML = readFileSync(join(fileURLToPath(import.meta.url), "../report.html"), "utf8");

const commands = { test: runTest, baseline: runBaseline, report: runReport };
if (commands[cmd]) commands[cmd]();
else console.error(`Unknown command: ${cmd}`);

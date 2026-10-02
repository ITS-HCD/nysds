#!/usr/bin/env node
/**
 * Local visual regression for NYSDS — no hosted service.
 *
 *   npm run vr:test [-- --build] [--filter button] [--threshold 0.1] [--min-change 0.05] [--viewport desktop|mobile|all]
 *   npm run vr:approve [-- --filter button]     approve every changed/new story
 *   npm run vr:review                           open the review UI (with per-story Approve buttons)
 *
 * Every Storybook story is screenshotted with Playwright and compared against
 * baselines in .visual/baselines. Results land in .visual/ (gitignored).
 */
import { spawnSync, exec } from "node:child_process";
import {
  copyFileSync, createReadStream, existsSync, mkdirSync, readFileSync,
  readdirSync, renameSync, rmSync, statSync, writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { availableParallelism } from "node:os";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const ROOT = resolve(fileURLToPath(import.meta.url), "../../../..");
const STORYBOOK = join(ROOT, "storybook-static");
const OUT = join(ROOT, ".visual");
const DIRS = {
  baselines: join(OUT, "baselines"),
  current: join(OUT, "current"),
  diff: join(OUT, "diff"),
};
const RESULTS = join(OUT, "results.json");

const args = process.argv.slice(2);
const cmd = args[0] && !args[0].startsWith("--") ? args[0] : "test";
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const next = args[i + 1];
  return next && !next.startsWith("--") ? next : true;
};
const filter = flag("filter", "");
const threshold = Number(flag("threshold", 0.1)); // pixelmatch per-pixel sensitivity
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
  ".ico": "image/x-icon", ".map": "application/json",
};

function serveDir(dir, port = 0, onRequest) {
  return new Promise((res) => {
    const server = createServer((req, resp) => {
      if (onRequest?.(req, resp)) return;
      const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
      const file = join(dir, path === "/" ? "index.html" : path);
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
function serveNysds(req, resp) {
  const rel = decodeURIComponent(new URL(req.url, "http://x").pathname).slice("/_nysds/".length);
  const [base, sub] = rel.startsWith("css/") ? [NYSDS_CSS, rel.slice(4)] : [NYSDS_DIST, rel];
  const file = join(base, sub);
  if (!file.startsWith(base) || !existsSync(file) || statSync(file).isDirectory()) {
    resp.writeHead(404).end("Not found (run npm run build and npm run build:packages first)");
    return true;
  }
  resp.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(resp);
  return true;
}

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

async function capture(stories, baseUrl, vp) {
  const [vw, vh] = VIEWPORTS[vp];
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: vw, height: vh }, deviceScaleFactor: 1,
    reducedMotion: "reduce", colorScheme: "light",
  });
  await cacheRemote(context);
  const queue = [...stories];
  let done = 0;
  const failures = [];
  const worker = async () => {
    const page = await context.newPage();
    for (let s; (s = queue.shift()); ) {
      try {
        await page.goto(`${baseUrl}/iframe.html?id=${s.id}&viewMode=story`, { waitUntil: "load" });
        // "attached", not visible: some components (skipnav) are visually hidden until focused.
        await page.waitForSelector("#storybook-root > *", { state: "attached", timeout: 15000 });
        await page.addStyleTag({
          content: `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}`,
        });
        const out = file("current", vp, s.id);
        await page.waitForLoadState("networkidle", { timeout: 3000 }).catch(() => {});
        await page.evaluate(settle);
        await page.screenshot({ path: out, fullPage: true });
        // Fast path: a frame identical to the baseline is already stable.
        const base = file("baselines", vp, s.id);
        if (!existsSync(base) || !readFileSync(base).equals(readFileSync(out))) await stabilize(page, out);
      } catch (e) {
        failures.push({ viewport: vp, id: s.id, error: String(e.message).split("\n")[0] });
      }
      process.stdout.write(`\r  ${vp}: captured ${++done}/${stories.length}`);
    }
    await page.close();
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
  await browser.close();
  process.stdout.write("\n");
  return failures;
}

// Baselines used to live flat in baselines/ (desktop only); move them under baselines/desktop.
function migrateLegacyBaselines() {
  for (const f of readdirSync(DIRS.baselines).filter((f) => f.endsWith(".png"))) {
    renameSync(join(DIRS.baselines, f), join(DIRS.baselines, "desktop", f));
  }
}

async function runTest() {
  if (flag("build", false) || !existsSync(join(STORYBOOK, "index.json"))) {
    console.log("Building Storybook…");
    const r = spawnSync("npm", ["run", "storybook:cibuild"], { cwd: ROOT, stdio: "inherit" });
    if (r.status) process.exit(r.status);
  }
  const index = JSON.parse(readFileSync(join(STORYBOOK, "index.json"), "utf8"));
  const all = Object.values(index.entries).filter(
    (e) => e.type === "story" && !(e.tags ?? []).includes("skip-vr"),
  );
  const needle = String(filter).toLowerCase();
  const stories = all.filter((e) => e.id.includes(needle) || e.title.toLowerCase().includes(needle));

  for (const d of [DIRS.current, DIRS.diff]) rmSync(d, { recursive: true, force: true });
  for (const d of Object.values(DIRS)) for (const vp of Object.keys(VIEWPORTS)) mkdirSync(join(d, vp), { recursive: true });
  migrateLegacyBaselines();

  const server = await serveDir(STORYBOOK);
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const results = [];
  const failures = [];
  for (const vp of viewports) {
    console.log(`Capturing ${stories.length} stories at ${VIEWPORTS[vp].join("x")} (${vp})…`);
    const failed = await capture(stories, baseUrl, vp);
    failures.push(...failed);
    const bad = new Set(failed.map((f) => f.id));
    for (const s of stories) if (!bad.has(s.id)) results.push(compare(vp, s.id, { title: s.title, name: s.name }));

    // Baselines with no matching story (only meaningful for an unfiltered run).
    if (!filter) {
      const live = new Set(all.map((s) => s.id));
      for (const f of readdirSync(join(DIRS.baselines, vp))) {
        const id = f.replace(/\.png$/, "");
        if (!live.has(id)) results.push({ id, viewport: vp, title: id, name: "", status: "removed" });
      }
    }
  }
  server.close();
  for (const f of failures) results.push({ ...f, title: f.id, name: "", status: "error" });
  for (const r of results) r.key = `${r.viewport}/${r.id}`;

  writeFileSync(RESULTS, JSON.stringify({ generated: new Date().toISOString(), viewports: VIEWPORTS, minChange, results }, null, 2));
  writeFileSync(join(OUT, "index.html"), REPORT_HTML);

  const n = (s) => results.filter((r) => r.status === s).length;
  console.log(`\n  ${n("passed")} unchanged · ${n("changed")} changed · ${n("new")} new · ${n("removed")} removed · ${n("error")} errors`);
  console.log(`  Review: npm run vr:review\n`);
  process.exitCode = n("changed") + n("removed") + n("error") ? 1 : 0;
}

function approve(keys) {
  const data = JSON.parse(readFileSync(RESULTS, "utf8"));
  for (const r of data.results) {
    if (!keys.includes(r.key)) continue;
    if (r.status === "removed") rmSync(file("baselines", r.viewport, r.id), { force: true });
    else if (r.status === "changed" || r.status === "new") {
      copyFileSync(file("current", r.viewport, r.id), file("baselines", r.viewport, r.id));
    } else continue;
    r.status = "passed";
    r.approved = true;
  }
  writeFileSync(RESULTS, JSON.stringify(data, null, 2));
  return data;
}

async function runApprove() {
  if (!existsSync(RESULTS)) return console.error("No results. Run npm run vr:test first.");
  const data = JSON.parse(readFileSync(RESULTS, "utf8"));
  const keys = data.results
    .filter((r) => ["changed", "new", "removed"].includes(r.status) && r.id.includes(filter))
    .filter((r) => vpFlag === "all" || r.viewport === vpFlag)
    .map((r) => r.key);
  approve(keys);
  console.log(`Approved ${keys.length} screenshots.`);
}

async function runReview() {
  if (!existsSync(RESULTS)) return console.error("No results. Run npm run vr:test first.");
  writeFileSync(join(OUT, "index.html"), REPORT_HTML);
  const server = await serveDir(OUT, Number(flag("port", 6007)), (req, resp) => {
    if (req.method === "GET" && req.url.startsWith("/_nysds/")) return serveNysds(req, resp);
    if (req.method !== "POST" || req.url !== "/approve") return false;
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const { ids } = JSON.parse(body); // keys: "<viewport>/<story id>"
      resp.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(approve(ids)));
    });
    return true;
  });
  const url = `http://127.0.0.1:${server.address().port}/`;
  console.log(`Visual review at ${url}  (Ctrl+C to stop)`);
  if (!flag("no-open", false)) exec(`open ${url}`);
}

const REPORT_HTML = readFileSync(join(fileURLToPath(import.meta.url), "../report.html"), "utf8");

const commands = { test: runTest, approve: runApprove, review: runReview };
if (commands[cmd]) commands[cmd]();
else console.error(`Unknown command: ${cmd}`);

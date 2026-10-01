#!/usr/bin/env node
/**
 * Local visual regression for NYSDS — no hosted service.
 *
 *   npm run vr:test [-- --build] [--filter button] [--threshold 0.1] [--viewport 1024x768]
 *   npm run vr:approve [-- --filter button]     approve every changed/new story
 *   npm run vr:review                           open the review UI (with per-story Approve buttons)
 *
 * Every Storybook story is screenshotted with Playwright and compared against
 * baselines in .visual/baselines. Results land in .visual/ (gitignored).
 */
import { spawnSync, exec } from "node:child_process";
import {
  copyFileSync, createReadStream, existsSync, mkdirSync, readFileSync,
  readdirSync, rmSync, statSync, writeFileSync,
} from "node:fs";
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
const [vw, vh] = String(flag("viewport", "1024x768")).split("x").map(Number);
const concurrency = Number(flag("concurrency", 4));

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

const readPng = (p) => PNG.sync.read(readFileSync(p));
const pad = (img, w, h) => {
  if (img.width === w && img.height === h) return img;
  const out = new PNG({ width: w, height: h });
  out.data.fill(255);
  PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
  return out;
};

function compare(id, meta) {
  const cur = join(DIRS.current, `${id}.png`);
  const base = join(DIRS.baselines, `${id}.png`);
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
  if (diffPixels === 0 && !sizeChanged) return { ...meta, id, status: "passed" };

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
  writeFileSync(join(DIRS.diff, `${id}.png`), PNG.sync.write(diff));
  return {
    ...meta, id, status: "changed", diffPixels,
    diffPercent: (diffPixels / (w * h)) * 100,
    bbox: x1 >= 0 ? { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 } : null,
    baselineSize: [a.width, a.height], currentSize: [b.width, b.height], sizeChanged,
  };
}

async function capture(stories, baseUrl) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: vw, height: vh }, deviceScaleFactor: 1,
    reducedMotion: "reduce", colorScheme: "light",
  });
  const queue = [...stories];
  let done = 0;
  const failures = [];
  const worker = async () => {
    const page = await context.newPage();
    for (let s; (s = queue.shift()); ) {
      try {
        await page.goto(`${baseUrl}/iframe.html?id=${s.id}&viewMode=story`, { waitUntil: "load" });
        await page.waitForSelector("#storybook-root > *", { timeout: 15000 });
        await page.addStyleTag({
          content: `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}`,
        });
        await page.evaluate(async () => {
          await document.fonts.ready;
          const els = [...document.querySelectorAll("*")].filter((e) => e.updateComplete);
          await Promise.all(els.map((e) => e.updateComplete));
        });
        await page.waitForTimeout(150);
        await page.screenshot({ path: join(DIRS.current, `${s.id}.png`), fullPage: true });
      } catch (e) {
        failures.push({ id: s.id, error: String(e.message).split("\n")[0] });
      }
      process.stdout.write(`\r  captured ${++done}/${stories.length}`);
    }
    await page.close();
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
  await browser.close();
  process.stdout.write("\n");
  return failures;
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
  Object.values(DIRS).forEach((d) => mkdirSync(d, { recursive: true }));

  const server = await serveDir(STORYBOOK);
  console.log(`Capturing ${stories.length} stories at ${vw}x${vh}…`);
  const failures = await capture(stories, `http://127.0.0.1:${server.address().port}`);
  server.close();

  const failed = new Set(failures.map((f) => f.id));
  const results = stories
    .filter((s) => !failed.has(s.id))
    .map((s) => compare(s.id, { title: s.title, name: s.name }));

  // Baselines with no matching story (only meaningful for an unfiltered run).
  if (!filter) {
    const live = new Set(all.map((s) => s.id));
    for (const f of readdirSync(DIRS.baselines)) {
      const id = f.replace(/\.png$/, "");
      if (!live.has(id)) results.push({ id, title: id, name: "", status: "removed" });
    }
  }
  for (const f of failures) results.push({ ...f, title: f.id, name: "", status: "error" });

  writeFileSync(RESULTS, JSON.stringify({ generated: new Date().toISOString(), viewport: [vw, vh], results }, null, 2));
  writeFileSync(join(OUT, "index.html"), REPORT_HTML);

  const n = (s) => results.filter((r) => r.status === s).length;
  console.log(`\n  ${n("passed")} unchanged · ${n("changed")} changed · ${n("new")} new · ${n("removed")} removed · ${n("error")} errors`);
  console.log(`  Review: npm run vr:review\n`);
  process.exitCode = n("changed") + n("removed") + n("error") ? 1 : 0;
}

function approve(ids) {
  const data = JSON.parse(readFileSync(RESULTS, "utf8"));
  for (const r of data.results) {
    if (!ids.includes(r.id)) continue;
    if (r.status === "removed") rmSync(join(DIRS.baselines, `${r.id}.png`), { force: true });
    else if (r.status === "changed" || r.status === "new") {
      copyFileSync(join(DIRS.current, `${r.id}.png`), join(DIRS.baselines, `${r.id}.png`));
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
  const ids = data.results
    .filter((r) => ["changed", "new", "removed"].includes(r.status) && r.id.includes(filter))
    .map((r) => r.id);
  approve(ids);
  console.log(`Approved ${ids.length} stories.`);
}

async function runReview() {
  if (!existsSync(RESULTS)) return console.error("No results. Run npm run vr:test first.");
  writeFileSync(join(OUT, "index.html"), REPORT_HTML);
  const server = await serveDir(OUT, Number(flag("port", 6007)), (req, resp) => {
    if (req.method !== "POST" || req.url !== "/approve") return false;
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const { ids } = JSON.parse(body);
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

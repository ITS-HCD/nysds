#!/usr/bin/env node
/**
 * Local visual regression testing for NYSDS. No hosted service is involved.
 *
 * Commands:
 *
 *   npm run vr:test [-- options]
 *     Captures baseline screenshots from the base branch, then screenshots every
 *     story on this branch and compares the two.
 *
 *   npm run vr:baseline [-- options]
 *     Only captures the baseline screenshots.
 *
 *   npm run vr:report [-- --port 6007] [--no-open]
 *     Serves the generated report locally.
 *
 * Options for vr:test and vr:baseline:
 *
 *   --base <ref>        Branch or commit to compare against. Default: $VR_BASE,
 *                       else origin/develop.
 *   --build             Rebuild this branch's packages (npm run build:packages)
 *                       before building its story pages.
 *   --fresh-baseline    Recapture the baseline screenshots even when the ones
 *                       from the previous run could be reused.
 *   --skip-baseline     (vr:test) Use whatever baselines exist, without checking
 *                       or fetching the base branch.
 *   --base-pages <dir>  Use base-branch story pages already built in <dir>.
 *   --no-states         Skip the interactive-state screenshots (states.mjs).
 *   --filter <text>     Only capture stories whose id or title contains <text>.
 *   --viewport <name>   desktop, mobile or all (default).
 *   --threshold <0-1>   Per-pixel color tolerance. Default 0.05.
 *   --min-change <%>    Percentage of changed pixels below which a story still
 *                       counts as unchanged. Default 0.05.
 *   --concurrency <n>   Number of browser pages capturing in parallel.
 *   --no-a11y           (vr:test) Skip the accessibility scan.
 *
 * How it works:
 *
 * Stories are screenshotted as the same static pages the PR preview publishes
 * (build-preview.mjs): one page per story, built without the preview's bottom
 * bar. No Storybook build is involved.
 *
 * Baselines are never stored in the repo. The base commit is checked out in a
 * git worktree under .visual/base (gitignored), its packages are built, and this
 * branch's build-preview.mjs renders its story pages. Those pages are
 * screenshotted into .visual/baselines. The worktree, its pages and the
 * screenshots are reused while the base commit and the rendering and capture
 * code (build-preview.mjs, visual.mjs, states.mjs) stay the same.
 *
 * This branch's pages are rebuilt into .visual/pages on every run and compared
 * against the baselines. They need built packages: --build, or a missing
 * packages/styles/dist, runs npm run build:packages first. Interactive states
 * (hover, active, focus) listed in states.mjs get their own screenshots. Stories
 * tagged "!preview" or "skip-vr" are not captured.
 *
 * Accessibility: while this branch's stories are captured, each story page's
 * <main> is also scanned with axe-core against WCAG 2.2 AA, at every viewport,
 * in its default state and in each interactive state from states.mjs (hover,
 * press, focus, click), so styles and content those states reveal are checked
 * too. Each failure is traced from the story's markup to the component's
 * rendered shadow DOM, and marked in whichever one it's in. The preview's
 * bottom bar sits outside <main>, so it's never scanned. Stories with
 * violations are written to a separate report in .visual/a11y-scan/, which the
 * PR preview publishes at /a11y-scan/.
 *
 * The report only shows what changed. It is written to .visual/report/ as a
 * self-contained static site (relative paths, no server endpoints), so the
 * folder can be opened from disk or deployed as-is. The PR preview publishes it
 * at /visual/.
 */
import { spawnSync, execFileSync, exec } from "node:child_process";
import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { availableParallelism } from "node:os";
import { createServer } from "node:http";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { format as formatWithPrettier } from "prettier";
import STATES from "./states.mjs";
import {
  buildPages,
  readComponentPackages,
  storyFiles,
} from "./build-preview.mjs";

// --- Paths ------------------------------------------------------------------

const ROOT = resolve(fileURLToPath(import.meta.url), "../../../..");
const OUTPUT_DIR = join(ROOT, ".visual");

// This branch's story pages. The base branch's pages live in its worktree.
const HEAD_PAGES_DIR = join(OUTPUT_DIR, "pages");

// Base-branch worktrees, one per commit, inside the gitignored .visual folder.
// ESLint, Stylelint, Prettier and Vite's file watcher ignore .visual/, so they
// never pick up this second copy of the source.
const BASE_WORKTREES_DIR = join(OUTPUT_DIR, "base");

const SCREENSHOT_DIRS = {
  baselines: join(OUTPUT_DIR, "baselines"),
  current: join(OUTPUT_DIR, "current"),
  diff: join(OUTPUT_DIR, "diff"),
};
const RESULTS_FILE = join(OUTPUT_DIR, "results.json");
const REPORT_DIR = join(OUTPUT_DIR, "report");

// Records which base commit (and capture settings) the baselines came from.
const BASELINE_INFO_FILE = join(OUTPUT_DIR, "base.json");

// Remote images and fonts, cached so captures don't depend on the network.
const NETWORK_CACHE_DIR = join(OUTPUT_DIR, "net-cache");

// The report UI is built with NYSDS itself: its component bundle and styles.
const NYSDS_BUNDLE = join(ROOT, "dist/nysds.js");
const NYSDS_STYLESHEET = join(ROOT, "packages/styles/dist/nysds-full.min.css");
// What NYSDS utilities can't express, shared with the other review pages.
const REVIEW_STYLESHEET = join(
  dirname(fileURLToPath(import.meta.url)),
  "templates/nysds-review.css",
);

// The accessibility scan's report, written beside the visual report.
const A11Y_REPORT_DIR = join(OUTPUT_DIR, "a11y-scan");
// Its counts, for the preview's landing page.
const A11Y_RESULTS_FILE = join(OUTPUT_DIR, "a11y.json");
const A11Y_TEMPLATE = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "templates/a11y-scan.html"),
  "utf8",
);
const AXE_SCRIPT = createRequire(import.meta.url).resolve(
  "axe-core/axe.min.js",
);

const REPORT_TEMPLATE = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "templates/visual-report.html"),
  "utf8",
);

// --- Command-line options ---------------------------------------------------

const commandLineArgs = process.argv.slice(2);
const command =
  commandLineArgs[0] && !commandLineArgs[0].startsWith("--")
    ? commandLineArgs[0]
    : "test";

/**
 * The value of a --name option: the argument after it, true when it's a bare
 * switch, or `fallback` when the option isn't given.
 */
function option(name, fallback) {
  const position = commandLineArgs.indexOf(`--${name}`);
  if (position === -1) return fallback;
  const value = commandLineArgs[position + 1];
  if (value && !value.startsWith("--")) return value;
  return true;
}

const storyFilter = String(option("filter", ""));
const captureStates = !option("no-states", false);
const scanAccessibility = !option("no-a11y", false);

// pixelmatch's per-pixel color tolerance (0-1, lower is stricter). Base and
// head are rendered by the same browser, so this can sit below pixelmatch's 0.1
// default, which treats light grays such as neutral-50 (#ededed) as white.
const colorThreshold = Number(option("threshold", 0.05));

// Minimum percentage (0-100) of changed pixels before a story counts as
// "changed". Anything below it is reported as "passed". 0 means any differing
// pixel counts.
const minChangePercent = Number(option("min-change", 0.05));

const VIEWPORTS = { desktop: [1024, 768], mobile: [390, 900] };
const viewportOption = String(option("viewport", "all"));
const viewports =
  viewportOption === "all" ? Object.keys(VIEWPORTS) : [viewportOption];
for (const viewport of viewports) {
  if (!VIEWPORTS[viewport]) {
    console.error(
      `Unknown --viewport "${viewportOption}". Use desktop, mobile or all.`,
    );
    process.exit(1);
  }
}

const defaultConcurrency = Math.min(8, Math.max(2, availableParallelism() - 1));
const concurrency = Number(option("concurrency", defaultConcurrency));

/** Where a screenshot of one kind (baselines, current, diff) is stored. */
function screenshotPath(kind, viewport, shotId) {
  return join(SCREENSHOT_DIRS[kind], viewport, `${shotId}.png`);
}

// --- Static file server -----------------------------------------------------

const CONTENT_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".map": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".otf": "font/otf",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
};

/** Serves `directory` on 127.0.0.1. Port 0 picks a free port. */
function serveDirectory(directory, port = 0) {
  return new Promise((resolveServer) => {
    const server = createServer((request, response) => {
      const urlPath = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      let filePath = join(directory, urlPath);

      // Story pages are folders: /nys-accordion/basic/ serves its index.html.
      if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        filePath = join(filePath, "index.html");
      }

      const isInsideDirectory = filePath.startsWith(directory);
      if (
        !isInsideDirectory ||
        !existsSync(filePath) ||
        statSync(filePath).isDirectory()
      ) {
        response.writeHead(404).end("Not found");
        return;
      }

      const contentType =
        CONTENT_TYPES[extname(filePath)] ?? "application/octet-stream";
      response.writeHead(200, { "Content-Type": contentType });
      createReadStream(filePath).pipe(response);
    });
    server.listen(port, "127.0.0.1", () => resolveServer(server));
  });
}

// --- Comparing screenshots --------------------------------------------------

function readPng(filePath) {
  return PNG.sync.read(readFileSync(filePath));
}

/** Returns `image` enlarged to width x height, with the new area filled white. */
function padImage(image, width, height) {
  if (image.width === width && image.height === height) return image;
  const padded = new PNG({ width, height });
  padded.data.fill(255);
  PNG.bitblt(image, padded, 0, 0, image.width, image.height, 0, 0);
  return padded;
}

/**
 * The smallest box around every pixel pixelmatch marked as changed (pure red in
 * the diff image), or null when there are none. Shows where a story changed.
 */
function changedRegion(diffImage) {
  const { width, height, data } = diffImage;
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const isChangedPixel = red === 255 && green === 0 && blue === 0;
      if (!isChangedPixel) continue;

      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }

  if (right < 0) return null;
  return { x: left, y: top, w: right - left + 1, h: bottom - top + 1 };
}

/**
 * Compares a shot's current screenshot with its baseline and writes a diff
 * image when they differ. Returns the result for the report, with a status of
 * "new" (no baseline), "passed" or "changed".
 */
function compareScreenshots(viewport, shotId, details) {
  const result = { ...details, viewport, id: shotId };
  const baselineFile = screenshotPath("baselines", viewport, shotId);
  const currentFile = screenshotPath("current", viewport, shotId);
  if (!existsSync(baselineFile)) return { ...result, status: "new" };

  const baselineImage = readPng(baselineFile);
  const currentImage = readPng(currentFile);
  const width = Math.max(baselineImage.width, currentImage.width);
  const height = Math.max(baselineImage.height, currentImage.height);
  const diffImage = new PNG({ width, height });

  const diffPixels = pixelmatch(
    padImage(baselineImage, width, height).data,
    padImage(currentImage, width, height).data,
    diffImage.data,
    width,
    height,
    { threshold: colorThreshold, diffColor: [255, 0, 0], alpha: 0.25 },
  );
  const diffPercent = (diffPixels / (width * height)) * 100;
  const sizeChanged =
    baselineImage.width !== currentImage.width ||
    baselineImage.height !== currentImage.height;

  const belowThreshold = diffPixels === 0 || diffPercent < minChangePercent;
  if (!sizeChanged && belowThreshold) {
    const passed = { ...result, status: "passed" };
    if (diffPixels > 0) {
      passed.diffPixels = diffPixels;
      passed.diffPercent = diffPercent;
    }
    return passed;
  }

  writeFileSync(
    screenshotPath("diff", viewport, shotId),
    PNG.sync.write(diffImage),
  );
  return {
    ...result,
    status: "changed",
    diffPixels,
    diffPercent,
    bbox: changedRegion(diffImage),
    baselineSize: [baselineImage.width, baselineImage.height],
    currentSize: [currentImage.width, currentImage.height],
    sizeChanged,
  };
}

// --- Capturing screenshots --------------------------------------------------

/**
 * Runs inside the page (passed to page.evaluate, so it can only use browser
 * APIs). Waits for fonts, Lit updates and every image to finish, including
 * images inside shadow roots such as nys-video's remote thumbnail.
 */
async function waitForPageToSettle() {
  function allElements(root) {
    const elements = [];
    for (const element of root.querySelectorAll("*")) {
      elements.push(element);
      if (element.shadowRoot) {
        elements.push(...allElements(element.shadowRoot));
      }
    }
    return elements;
  }

  await document.fonts.ready;

  // Repeat, since finishing one update can render new elements and images.
  for (let pass = 0; pass < 3; pass++) {
    const elements = allElements(document);
    const images = elements.filter((element) => element.tagName === "IMG");

    // Lazy images below the fold never load during a full-page capture.
    for (const image of images) {
      if (image.loading === "lazy") image.loading = "eager";
    }

    const litElements = elements.filter((element) => element.updateComplete);
    await Promise.all(litElements.map((element) => element.updateComplete));

    const loadingImages = images.filter((image) => !image.complete);
    await Promise.all(
      loadingImages.map(
        (image) =>
          new Promise((done) => {
            image.onload = done;
            image.onerror = done;
            setTimeout(done, 20000);
          }),
      ),
    );

    const decodableImages = images.filter((image) => image.decode);
    await Promise.all(
      decodableImages.map((image) => image.decode().catch(() => {})),
    );
  }
}

/**
 * Re-takes the screenshot until two in a row are byte-identical, so late
 * paints (lazy images, font swaps) don't show up as regressions. Gives up after
 * five tries.
 */
async function waitForStableScreenshot(page, outputFile) {
  let previous = readFileSync(outputFile);
  for (let attempt = 0; attempt < 5; attempt++) {
    await page.waitForTimeout(250);
    await page.evaluate(waitForPageToSettle);
    const next = await page.screenshot({ fullPage: true });
    if (next.equals(previous)) return;
    writeFileSync(outputFile, next);
    previous = next;
  }
}

/**
 * Remote assets (YouTube thumbnails, Unsplash photos…) are fetched once and
 * replayed from .visual/net-cache, so captures don't depend on network timing
 * and every browser page sees identical bytes. Delete the folder to refresh.
 */
async function cacheRemoteAssets(browserContext) {
  mkdirSync(NETWORK_CACHE_DIR, { recursive: true });
  const cachedTypes = ["image", "font", "stylesheet", "media"];

  await browserContext.route(/^https?:\/\/(?!127\.0\.0\.1)/, async (route) => {
    const request = route.request();
    if (
      request.method() !== "GET" ||
      !cachedTypes.includes(request.resourceType())
    ) {
      return route.continue();
    }

    const cacheKey = createHash("sha1").update(request.url()).digest("hex");
    const bodyFile = join(NETWORK_CACHE_DIR, cacheKey);
    const metadataFile = `${bodyFile}.json`;
    try {
      if (!existsSync(metadataFile)) {
        const response = await route.fetch({ timeout: 20000 });
        if (!response.ok()) return route.fulfill({ response });
        writeFileSync(bodyFile, await response.body());
        writeFileSync(
          metadataFile,
          JSON.stringify({
            status: response.status(),
            headers: response.headers(),
          }),
        );
      }

      const { status, headers } = JSON.parse(
        readFileSync(metadataFile, "utf8"),
      );
      // The cached body is stored decoded, at its full length.
      delete headers["content-encoding"];
      delete headers["content-length"];
      await route.fulfill({ status, headers, body: readFileSync(bodyFile) });
    } catch {
      await route.continue().catch(() => {});
    }
  });
}

/** True when any element matching `targets` has focus, through shadow roots. */
function targetHasFocus(targets) {
  return targets.evaluateAll((elements) => {
    let focused = document.activeElement;
    while (focused) {
      if (elements.includes(focused)) return true;
      focused = focused.shadowRoot?.activeElement;
    }
    return false;
  });
}

/**
 * Puts a shot's target into its interactive state with real input.
 *
 * Hover and active move the mouse to the target's center. `force` makes
 * Playwright move there even when another element covers the target; whatever
 * is on top then gets hovered, as it would for a user.
 *
 * Focus presses Tab until the target is focused, like a keyboard user, so
 * :focus-visible styles apply. Focusing from a script can't reach some
 * components' shadow DOM, so it's only the fallback.
 *
 * Click clicks the target and captures the result (an accordion expanded, a
 * tab selected), with the pointer moved away so its hover style isn't in the
 * screenshot. A click that leaves the page fails the shot: that target belongs
 * in a different state.
 */
async function enterInteractiveState(page, shot) {
  if (shot.open) {
    await page.locator(shot.open).first().click({ timeout: 5000 });
  }

  const targets = page.locator(shot.target);
  const firstTarget = targets.first();
  await firstTarget.waitFor({ state: "attached", timeout: 5000 });

  if (shot.state === "focus") {
    // The first match isn't always tabbable (a stepper's first step isn't),
    // so focus on any match counts.
    for (let presses = 0; presses < 40; presses++) {
      if (await targetHasFocus(targets)) break;
      await page.keyboard.press("Tab");
    }
    if (!(await targetHasFocus(targets))) await firstTarget.focus();
    if (!(await targetHasFocus(targets))) {
      throw new Error(`Could not focus ${shot.target}`);
    }
    return;
  }

  // Components can keep hidden copies of their markup; use a visible one.
  const visibleTarget = targets.filter({ visible: true }).first();

  if (shot.state === "click") {
    const pageBeforeClick = page.url();
    await visibleTarget.click({ timeout: 5000, force: true });
    if (page.url() !== pageBeforeClick) {
      throw new Error(`Clicking ${shot.target} left the page`);
    }
    await page.mouse.move(0, 0);
    await page.evaluate(waitForPageToSettle);
    return;
  }

  await visibleTarget.hover({ timeout: 5000, force: true });
  if (shot.state === "active") await page.mouse.down();
}

/**
 * The screenshots to take at one viewport: one per story, plus one per
 * interactive state in states.mjs.
 *
 * A state shot loads its story fresh, so it never inherits another shot's
 * hover or focus. `allStories` is the full list, used to find each state's
 * story; `stories` is the list after --filter.
 */
function shotsForViewport(stories, allStories, viewport) {
  const shots = stories.map((story) => ({
    id: story.id,
    storyId: story.id,
    path: story.path,
    title: story.title,
    name: story.name,
  }));
  if (!captureStates) return shots;

  const includedStoryIds = new Set(stories.map((story) => story.id));
  for (const entry of STATES) {
    if (!entry.states) continue;
    if (entry.viewports && !entry.viewports.includes(viewport)) continue;

    const packageStories = allStories.filter(
      (story) => story.dir === entry.package,
    );
    const story = entry.story
      ? packageStories.find((candidate) =>
          candidate.path.endsWith(`/${entry.story}`),
        )
      : packageStories[0];
    if (!story || !includedStoryIds.has(story.id)) continue;

    for (const state of entry.states) {
      shots.push({
        id: `${story.id}.${state}`,
        storyId: story.id,
        path: story.path,
        title: story.title,
        name: `${story.name} (${state})`,
        state,
        target: entry.target,
        open: entry.open,
      });
    }
  }
  return shots;
}

/**
 * Packages whose SCSS has :hover, :active or :focus-visible rules but no entry
 * in states.mjs. Reported so new state styles don't go untested.
 */
function packagesMissingStateCoverage() {
  const coveredPackages = new Set(STATES.map((entry) => entry.package));
  const packagesDir = join(ROOT, "packages");
  const stateSelector = /:(hover|active|focus-visible)\b/;

  return readdirSync(packagesDir).filter((packageName) => {
    if (!packageName.startsWith("nys-")) return false;
    if (coveredPackages.has(packageName)) return false;

    const sourceDir = join(packagesDir, packageName, "src");
    if (!existsSync(sourceDir)) return false;

    const stylesheets = readdirSync(sourceDir).filter((fileName) =>
      fileName.endsWith(".scss"),
    );
    return stylesheets.some((fileName) =>
      stateSelector.test(readFileSync(join(sourceDir, fileName), "utf8")),
    );
  });
}

/**
 * Screenshots every shot at one viewport into the `kind` folder (baselines or
 * current), several browser pages at a time. Returns the shots that failed.
 * With a `scans` array, every shot is also scanned with axe-core, in its
 * state, and its result pushed onto it.
 */
async function captureShots(
  shots,
  baseUrl,
  viewport,
  kind = "current",
  scans = null,
) {
  const [viewportWidth, viewportHeight] = VIEWPORTS[viewport];
  const browser = await chromium.launch();
  const browserContext = await browser.newContext({
    viewport: { width: viewportWidth, height: viewportHeight },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  await cacheRemoteAssets(browserContext);

  const queue = [...shots];
  const failures = [];
  let capturedCount = 0;

  async function captureNextShots() {
    const page = await browserContext.newPage();
    while (queue.length > 0) {
      const shot = queue.shift();
      try {
        // Park the pointer so a previous shot's hover can't carry over.
        await page.mouse.move(0, 0);
        await page.goto(`${baseUrl}/${shot.path}/`, { waitUntil: "load" });
        // "attached", not visible: some components (skipnav) are visually
        // hidden until focused.
        await page.waitForSelector("main > *", {
          state: "attached",
          timeout: 15000,
        });
        await page.addStyleTag({
          content:
            "*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }",
        });
        await page
          .waitForLoadState("networkidle", { timeout: 3000 })
          .catch(() => {});
        await page.evaluate(waitForPageToSettle);

        if (shot.state) await enterInteractiveState(page, shot);

        const outputFile = screenshotPath(kind, viewport, shot.id);
        await page.screenshot({ path: outputFile, fullPage: true });

        // Shortcut: a screenshot identical to its baseline is already stable.
        const baselineFile = screenshotPath("baselines", viewport, shot.id);
        const matchesBaseline =
          kind !== "baselines" &&
          existsSync(baselineFile) &&
          readFileSync(baselineFile).equals(readFileSync(outputFile));
        if (!matchesBaseline) {
          await waitForStableScreenshot(page, outputFile);
        }

        // After the screenshot, still in the shot's state (hovered, focused,
        // expanded...): the scan marks failing elements in the page.
        if (scans) {
          const scanned = {
            viewport,
            id: shot.storyId,
            state: shot.state ?? "default",
          };
          try {
            scans.push({ ...scanned, ...(await scanStory(page)) });
          } catch (error) {
            scans.push({
              ...scanned,
              error: String(error.message).split("\n")[0],
            });
          }
        }
      } catch (error) {
        failures.push({
          viewport,
          id: shot.id,
          error: String(error.message).split("\n")[0],
        });
      } finally {
        // Release a held "active" press on a blank page. Releasing on the
        // target would click it, and moving away with the button held starts
        // a drag that stalls the next navigation.
        if (shot.state === "active") {
          await page.goto("about:blank").catch(() => {});
          await page.mouse.up().catch(() => {});
        }
      }
      capturedCount++;
      process.stdout.write(
        `\r  ${viewport}: captured ${capturedCount}/${shots.length}`,
      );
    }
    await page.close();
  }

  const workers = [];
  for (let worker = 0; worker < concurrency; worker++) {
    workers.push(captureNextShots());
  }
  await Promise.all(workers);

  await browser.close();
  process.stdout.write("\n");
  return failures;
}

// --- Accessibility scans ----------------------------------------------------

// The WCAG 2.2 AA rules NYSDS commits to. axe's best-practice rules are left
// out: several judge the whole page (one h1, landmarks), not the component.
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

// Most severe first, the order the report lists issues in.
const IMPACTS = ["critical", "serious", "moderate", "minor"];

/**
 * Runs axe-core on the story page's <main>, so the preview's bottom bar is
 * never tested. Violations are reported wherever they are: in the story's own
 * markup (the source) or in the shadow DOM a component renders.
 *
 * Each failing element is traced through both, like the codegen review's
 * source and generated file. The story's light DOM is returned with the source
 * element marked (data-a11y-mark="e<index>"): the failing element itself, or
 * the component that renders it. The component's shadow root is returned
 * rendered, with the failing element marked (data-a11y-mark="issue") when the
 * violation is inside it.
 */
async function scanStory(page) {
  await page.addScriptTag({ path: AXE_SCRIPT });
  return page.evaluate(async (tags) => {
    const results = await window.axe.run(
      { include: ["main"] },
      { runOnly: { type: "tag", values: tags }, resultTypes: ["violations"] },
    );

    // Markup as written: without Lit's comment markers or inline styles.
    const clean = (html) =>
      html
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<style[\s\S]*?<\/style>/g, "");

    const main = document.querySelector("main");
    // Index in document order: the same element gets the same key at every
    // viewport, so scans of one story line up.
    const lightElements = [...main.querySelectorAll("*")];
    const sourceKey = (element) => {
      const index = lightElements.indexOf(element);
      return index === -1 ? null : `e${index}`;
    };
    const sourceElements = new Set();

    /** The element itself, or its nearest ancestor, that has a shadow root. */
    function owningComponent(element) {
      for (let current = element; current && current !== main; ) {
        if (current.shadowRoot) return current;
        current = current.parentElement;
      }
      return null;
    }

    const violations = results.violations.map((violation) => ({
      rule: violation.id,
      impact: violation.impact,
      help: violation.help,
      description: violation.description,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.flatMap((node) => {
        // In a shadow root, the target is [host, ..., element].
        const path = node.target[0];
        const selectors = Array.isArray(path) ? path : [path];
        const inShadowDom = selectors.length > 1;

        const host = document.querySelector(selectors[0]);
        let element = host;
        for (const selector of selectors.slice(1)) {
          element = element?.shadowRoot?.querySelector(selector);
        }
        if (!host || !element) return [];

        let root = null;
        let rendered = null;
        if (inShadowDom) {
          root = element.getRootNode();
          element.setAttribute("data-a11y-mark", "issue");
          rendered = clean(root.innerHTML);
          element.removeAttribute("data-a11y-mark");
        } else {
          // Shown for context: the component the failing element belongs to.
          root = owningComponent(element)?.shadowRoot ?? null;
          rendered = root ? clean(root.innerHTML) : null;
        }
        sourceElements.add(host);

        return [
          {
            target: selectors.join(" › "),
            where: inShadowDom ? "rendered" : "source",
            sourceKey: sourceKey(host),
            component: root?.host.localName ?? null,
            rendered,
            failureSummary: node.failureSummary ?? "",
          },
        ];
      }),
    }));

    for (const element of sourceElements) {
      const key = sourceKey(element);
      if (key) element.setAttribute("data-a11y-mark", key);
    }
    const markup = clean(main.innerHTML);
    for (const element of sourceElements) {
      element.removeAttribute("data-a11y-mark");
    }

    return {
      axeVersion: window.axe.version,
      markup,
      violations: violations.filter((violation) => violation.nodes.length > 0),
    };
  }, AXE_TAGS);
}

/** HTML laid out one element per line, or as it came if it can't be parsed. */
async function prettyHtml(html) {
  try {
    const formatted = await formatWithPrettier(html, {
      parser: "html",
      printWidth: 80,
      htmlWhitespaceSensitivity: "ignore",
    });
    return formatted.trim();
  } catch {
    return html.trim();
  }
}

const MARK_ATTRIBUTE = /\s*data-a11y-mark="([^"]*)"/;

/**
 * Formatted markup as numbered lines, each with the marks of the element whose
 * opening tag it belongs to. The data-a11y-mark attributes are removed.
 */
function markupLines(formatted) {
  const lines = [];
  let openingTagStart = 0;
  let marks = null;

  for (const text of formatted.split("\n")) {
    if (/^\s*<[a-z]/i.test(text)) openingTagStart = lines.length;
    const match = MARK_ATTRIBUTE.exec(text);
    let line = text;
    if (match) {
      marks = match[1].split(" ");
      // Mark the opening tag's lines before the attribute too.
      for (let index = openingTagStart; index < lines.length; index++) {
        lines[index].marks = marks;
      }
      line = text.replace(match[0], "");
      if (!line.trim()) continue;
    }
    lines.push({ number: lines.length + 1, text: line, marks: marks ?? [] });
    // The opening tag ends at the first ">" after the attribute.
    if (marks && line.includes(">")) marks = null;
  }
  return lines;
}

/** The lines of the element marked `mark`, with `context` lines either side. */
function linesAround(lines, mark, context) {
  const first = lines.findIndex((line) => line.marks.includes(mark));
  if (first === -1) return [];
  let last = first;
  while (lines[last + 1]?.marks.includes(mark)) last++;
  return lines
    .slice(Math.max(0, first - context), last + 1 + context)
    .map((line) => ({
      number: line.number,
      text: line.text,
      marked: line.marks.includes(mark),
    }));
}

/**
 * axe's "Fix any of the following: ..." text as groups of suggestions:
 * [{ heading: "Do one of these", items: [...] }].
 */
function fixSuggestions(failureSummary) {
  const groups = [];
  for (const line of failureSummary.split("\n")) {
    const text = line.trim();
    if (!text) continue;
    const heading = /^Fix (any|all) of the following:$/.exec(text);
    if (heading) {
      groups.push({
        heading: heading[1] === "any" ? "Do one of these" : "Do all of these",
        items: [],
      });
    } else if (groups.length > 0) {
      groups.at(-1).items.push(text);
    } else {
      groups.push({ heading: "", items: [text] });
    }
  }
  return groups;
}

/**
 * Merges each story's scans (one per viewport) into the report's data: its
 * issues, one per rule, most severe first. Each failing element comes with
 * its source (its story line, or that of the component rendering it) and the
 * component's whole rendered markup, with the failing lines marked in
 * whichever of the two the violation is in.
 */
async function accessibilityReportData(scans, stories) {
  const storiesById = new Map(stories.map((story) => [story.id, story]));
  const scansByStory = new Map();
  for (const scan of scans) {
    if (!scansByStory.has(scan.id)) scansByStory.set(scan.id, []);
    scansByStory.get(scan.id).push(scan);
  }

  const reportStories = [];
  const errors = [];
  const impactCounts = Object.fromEntries(IMPACTS.map((impact) => [impact, 0]));
  let axeVersion = "";

  for (const [storyId, storyScans] of scansByStory) {
    const story = storiesById.get(storyId);
    const rules = new Map();

    for (const scan of storyScans) {
      if (scan.error) {
        errors.push({
          id: storyId,
          viewport: scan.viewport,
          state: scan.state,
          error: scan.error,
        });
        continue;
      }
      axeVersion = scan.axeVersion;
      for (const violation of scan.violations) {
        if (!rules.has(violation.rule)) {
          rules.set(violation.rule, { ...violation, nodes: new Map() });
        }
        const nodes = rules.get(violation.rule).nodes;
        for (const node of violation.nodes) {
          const seen = nodes.get(node.target);
          // Keep the default state's markup when there is one: it's how the
          // story first renders. Otherwise, the first state it failed in.
          if (
            !seen ||
            (scan.state === "default" && !seen.states.has("default"))
          ) {
            nodes.set(node.target, {
              ...node,
              markup: scan.markup,
              viewports: seen?.viewports ?? new Set(),
              states: seen?.states ?? new Set(),
            });
          }
          nodes.get(node.target).viewports.add(scan.viewport);
          nodes.get(node.target).states.add(scan.state);
        }
      }
    }
    if (rules.size === 0) continue;

    const sortedRules = [...rules.values()].sort(
      (first, second) =>
        IMPACTS.indexOf(first.impact) - IMPACTS.indexOf(second.impact) ||
        first.rule.localeCompare(second.rule),
    );
    // Source markup is formatted once per distinct page state.
    const sourceLinesByMarkup = new Map();
    async function sourceLines(markup) {
      if (!sourceLinesByMarkup.has(markup)) {
        sourceLinesByMarkup.set(markup, markupLines(await prettyHtml(markup)));
      }
      return sourceLinesByMarkup.get(markup);
    }

    const issues = [];
    for (const [index, rule] of sortedRules.entries()) {
      const number = index + 1;
      impactCounts[rule.impact] = (impactCounts[rule.impact] ?? 0) + 1;
      const nodes = [];
      for (const node of rule.nodes.values()) {
        const rendered =
          node.rendered === null
            ? null
            : markupLines(await prettyHtml(node.rendered)).map((line) => ({
                number: line.number,
                text: line.text,
                marked: line.marks.includes("issue"),
              }));
        nodes.push({
          target: node.target,
          where: node.where,
          component: node.component,
          viewports: [...node.viewports],
          // Empty when it fails at rest; otherwise the states it fails in.
          states: node.states.has("default") ? [] : [...node.states],
          source: linesAround(
            await sourceLines(node.markup),
            node.sourceKey,
            0,
          ),
          rendered,
          fix: fixSuggestions(node.failureSummary),
        });
      }
      issues.push({
        number,
        rule: rule.rule,
        impact: rule.impact,
        help: rule.help,
        description: rule.description,
        helpUrl: rule.helpUrl,
        nodes,
      });
    }

    reportStories.push({
      id: storyId,
      path: story.path,
      title: story.title,
      name: story.name,
      issues,
    });
  }

  return {
    generated: new Date().toISOString(),
    axeVersion,
    tags: AXE_TAGS,
    viewports,
    scanned: scansByStory.size,
    impacts: impactCounts,
    stories: reportStories,
    errors,
  };
}

/** Writes the accessibility report to .visual/a11y-scan as a static site. */
async function writeAccessibilityReport(scans, stories) {
  const reportData = await accessibilityReportData(scans, stories);
  rmSync(A11Y_REPORT_DIR, { recursive: true, force: true });
  copyReportAssets(A11Y_REPORT_DIR);
  // A script rather than JSON, so the report also works opened from disk.
  writeFileSync(
    join(A11Y_REPORT_DIR, "a11y-results.js"),
    `window.A11Y_DATA = ${JSON.stringify(reportData)};\n`,
  );
  writeFileSync(join(A11Y_REPORT_DIR, "index.html"), A11Y_TEMPLATE);
  writeFileSync(
    A11Y_RESULTS_FILE,
    JSON.stringify({
      scanned: reportData.scanned,
      storiesWithIssues: reportData.stories.length,
      impacts: reportData.impacts,
      errors: reportData.errors.length,
    }),
  );
  return reportData;
}

// --- Building story pages ---------------------------------------------------

/** Runs a command, exiting with its status if it fails. */
function runCommand(executable, commandArgs, workingDirectory) {
  const result = spawnSync(executable, commandArgs, {
    cwd: workingDirectory,
    stdio: "inherit",
  });
  if (result.status) process.exit(result.status);
}

function git(...gitArgs) {
  return execFileSync("git", gitArgs, { cwd: ROOT, encoding: "utf8" }).trim();
}

/** The base ref and the commit it points to, fetching it first if it's remote. */
function resolveBaseCommit() {
  const ref = String(option("base", process.env.VR_BASE || "origin/develop"));
  const [remote, ...branchParts] = ref.split("/");
  const remotes = git("remote").split("\n");

  if (branchParts.length > 0 && remotes.includes(remote)) {
    // If this fails (offline), use whatever the ref already points to.
    spawnSync("git", ["fetch", "--quiet", remote, branchParts.join("/")], {
      cwd: ROOT,
      stdio: "inherit",
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });
  }
  return { ref, sha: git("rev-parse", "--verify", `${ref}^{commit}`) };
}

function fileHash(...filePaths) {
  const hash = createHash("sha1");
  for (const filePath of filePaths) hash.update(readFileSync(filePath));
  return hash.digest("hex").slice(0, 12);
}

// Pages built by a different build-preview.mjs are stale, even for the same
// commit. Screenshots are also stale when the capture code or states change.
const PAGE_BUILDER_VERSION = fileHash(
  join(ROOT, "src/scripts/nysds-review/build-preview.mjs"),
);
const CAPTURE_VERSION = fileHash(
  join(ROOT, "src/scripts/nysds-review/build-preview.mjs"),
  fileURLToPath(import.meta.url),
  join(ROOT, "src/scripts/nysds-review/states.mjs"),
);

/**
 * Renders every component's stories as bare pages (no bottom bar) into
 * <outputDir>/dist, and lists them in <outputDir>/pages.json along with the
 * page builder version that made them.
 */
async function renderStoryPages(projectRoot, outputDir) {
  const components = [...readComponentPackages(projectRoot).keys()]
    .sort()
    .filter((packageName) => storyFiles(packageName, projectRoot).length > 0)
    .map((packageName) => ({ dir: packageName }));

  const pages = await buildPages({
    root: projectRoot,
    components,
    dist: join(outputDir, "dist"),
    bare: true,
  });

  const pageList = pages.map((page) => ({
    dir: page.dir,
    title: page.title,
    story: page.story,
    path: page.path,
    tags: page.tags,
  }));
  writeFileSync(
    join(outputDir, "pages.json"),
    JSON.stringify({ builder: PAGE_BUILDER_VERSION, pages: pageList }),
  );
  return outputDir;
}

/** True when `outputDir` has pages from the current page builder. */
function storyPagesAreCurrent(outputDir) {
  try {
    const pageList = JSON.parse(
      readFileSync(join(outputDir, "pages.json"), "utf8"),
    );
    return pageList.builder === PAGE_BUILDER_VERSION;
  } catch {
    return false;
  }
}

/** Deletes base worktrees other than `keepDir`; each has its own node_modules. */
function removeOtherBaseWorktrees(keepDir) {
  if (existsSync(BASE_WORKTREES_DIR)) {
    for (const folderName of readdirSync(BASE_WORKTREES_DIR)) {
      const worktreeDir = join(BASE_WORKTREES_DIR, folderName);
      if (worktreeDir === keepDir) continue;
      spawnSync("git", ["worktree", "remove", "--force", worktreeDir], {
        cwd: ROOT,
        stdio: "ignore",
      });
      rmSync(worktreeDir, { recursive: true, force: true });
    }
  }
  spawnSync("git", ["worktree", "prune"], { cwd: ROOT });
}

/**
 * Builds the base commit's story pages in its own worktree and returns the
 * folder they're in. Reuses pages already built by the current page builder.
 */
async function buildBasePages({ ref, sha }) {
  const prebuiltPages = option("base-pages", "");
  if (prebuiltPages) return resolve(String(prebuiltPages));

  const worktreeDir = join(BASE_WORKTREES_DIR, sha.slice(0, 12));
  const pagesDir = join(worktreeDir, ".vr-pages");
  removeOtherBaseWorktrees(worktreeDir);

  if (storyPagesAreCurrent(pagesDir)) {
    console.log(`Reusing built baseline pages for ${ref} @ ${sha.slice(0, 7)}`);
    return pagesDir;
  }

  const isNewWorktree = !existsSync(worktreeDir);
  if (isNewWorktree) {
    runCommand("git", ["worktree", "add", "--detach", worktreeDir, sha], ROOT);
  }
  console.log(
    `Building baseline pages from ${ref} @ ${sha.slice(0, 7)} in ${worktreeDir}…`,
  );

  // The same steps the preview workflow runs on the PR branch. A worktree
  // that was already built only needs its pages rendered again (after
  // build-preview.mjs changed).
  const packagesBuilt = existsSync(join(worktreeDir, "packages/styles/dist"));
  if (isNewWorktree || !packagesBuilt) {
    runCommand("npm", ["i"], worktreeDir);
    runCommand("npm", ["run", "build:packages"], worktreeDir);
    runCommand("npm", ["run", "cem"], worktreeDir);
    runCommand("node", ["src/scripts/generate-stories.mjs"], worktreeDir);
  }
  return renderStoryPages(worktreeDir, pagesDir);
}

/** Builds this branch's story pages (every run); --build rebuilds packages first. */
async function buildHeadPages() {
  const packagesBuilt = existsSync(join(ROOT, "packages/styles/dist"));
  if (option("build", false) || !packagesBuilt) {
    console.log("Building packages…");
    runCommand("npm", ["run", "build:packages"], ROOT);
  }
  console.log("Building story pages…");
  return renderStoryPages(ROOT, HEAD_PAGES_DIR);
}

/**
 * The stories in a pages folder: { id, path, dir, title, name }. `stories` is
 * narrowed by --filter; `allStories` is not.
 */
function loadStories(pagesDir) {
  const { pages } = JSON.parse(
    readFileSync(join(pagesDir, "pages.json"), "utf8"),
  );
  const allStories = pages
    .filter((page) => !(page.tags ?? []).includes("skip-vr"))
    .map((page) => ({
      id: page.path.replace("/", "--"),
      path: page.path,
      dir: page.dir,
      title: page.title,
      name: page.story,
    }));

  const searchText = storyFilter.toLowerCase();
  const stories = allStories.filter(
    (story) =>
      story.id.includes(searchText) ||
      story.title.toLowerCase().includes(searchText),
  );
  return { allStories, stories, distDir: join(pagesDir, "dist") };
}

// --- Baselines --------------------------------------------------------------

/**
 * True when the previous run's baseline screenshots can be reused: same base
 * commit, same rendering and capture code, states included the same way, and
 * they cover every viewport and story this run needs. A capture without
 * --filter covers any filter.
 */
function previousBaselinesAreReusable(baseSha) {
  if (option("fresh-baseline", false)) return false;
  if (!existsSync(BASELINE_INFO_FILE)) return false;

  const previous = JSON.parse(readFileSync(BASELINE_INFO_FILE, "utf8"));
  const coversFilter =
    previous.filter === "" || previous.filter === storyFilter;
  const coversViewports = viewports.every((viewport) =>
    previous.viewports?.includes(viewport),
  );
  return (
    previous.sha === baseSha &&
    previous.capture === CAPTURE_VERSION &&
    previous.states === captureStates &&
    coversFilter &&
    coversViewports
  );
}

/**
 * Takes baseline screenshots of the base branch's story pages, or reuses the
 * previous run's (--fresh-baseline forces new ones). Returns { ref, sha,
 * failures }.
 */
async function captureBaselines() {
  const base = resolveBaseCommit();
  const shortSha = base.sha.slice(0, 7);

  if (previousBaselinesAreReusable(base.sha)) {
    console.log(
      `Reusing baseline screenshots from ${base.ref} @ ${shortSha} (--fresh-baseline to recapture)`,
    );
    return { ...base, failures: [] };
  }

  const { allStories, stories, distDir } = loadStories(
    await buildBasePages(base),
  );
  rmSync(SCREENSHOT_DIRS.baselines, { recursive: true, force: true });
  rmSync(BASELINE_INFO_FILE, { force: true });
  for (const viewport of Object.keys(VIEWPORTS)) {
    mkdirSync(join(SCREENSHOT_DIRS.baselines, viewport), { recursive: true });
  }

  const server = await serveDirectory(distDir);
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const failures = [];
  for (const viewport of viewports) {
    const shots = shotsForViewport(stories, allStories, viewport);
    const size = VIEWPORTS[viewport].join("x");
    console.log(
      `Capturing ${shots.length} baselines from ${base.ref} at ${size} (${viewport})…`,
    );
    failures.push(
      ...(await captureShots(shots, baseUrl, viewport, "baselines")),
    );
  }
  server.close();

  for (const failure of failures) {
    console.error(
      `  ✗ baseline ${failure.viewport}/${failure.id}: ${failure.error}`,
    );
  }
  writeFileSync(
    BASELINE_INFO_FILE,
    JSON.stringify({
      ref: base.ref,
      sha: base.sha,
      capture: CAPTURE_VERSION,
      states: captureStates,
      filter: storyFilter,
      viewports,
    }),
  );
  console.log(
    `\n  Baselines from ${base.ref} @ ${shortSha} saved to ${SCREENSHOT_DIRS.baselines}\n`,
  );
  return { ...base, failures };
}

// --- Commands ---------------------------------------------------------------

async function runBaselineCommand() {
  const { failures } = await captureBaselines();
  process.exitCode = failures.length > 0 ? 1 : 0;
}

async function runTestCommand() {
  let base;
  if (option("skip-baseline", false)) {
    if (!existsSync(BASELINE_INFO_FILE)) {
      console.error("No baselines yet. Run without --skip-baseline first.");
      process.exit(1);
    }
    base = JSON.parse(readFileSync(BASELINE_INFO_FILE, "utf8"));
    console.log(`Reusing baselines from ${base.ref} @ ${base.sha.slice(0, 7)}`);
  } else {
    base = await captureBaselines();
  }

  const { allStories, stories, distDir } = loadStories(await buildHeadPages());
  for (const kind of ["current", "diff"]) {
    rmSync(SCREENSHOT_DIRS[kind], { recursive: true, force: true });
    for (const viewport of Object.keys(VIEWPORTS)) {
      mkdirSync(join(SCREENSHOT_DIRS[kind], viewport), { recursive: true });
    }
  }

  const server = await serveDirectory(distDir);
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const results = [];
  const failures = [];
  const unchangedCount = {};
  const scans = scanAccessibility ? [] : null;

  for (const viewport of viewports) {
    const shots = shotsForViewport(stories, allStories, viewport);
    const stateShotCount = shots.filter((shot) => shot.state).length;
    const storyShotCount = shots.length - stateShotCount;
    const size = VIEWPORTS[viewport].join("x");
    console.log(
      `Capturing ${storyShotCount} stories + ${stateShotCount} interactive states at ${size} (${viewport})…`,
    );

    const viewportFailures = await captureShots(
      shots,
      baseUrl,
      viewport,
      "current",
      scans,
    );
    failures.push(...viewportFailures);
    const failedShotIds = new Set(
      viewportFailures.map((failure) => failure.id),
    );
    unchangedCount[viewport] = 0;

    for (const shot of shots) {
      if (failedShotIds.has(shot.id)) continue;
      const details = { title: shot.title, name: shot.name };
      if (shot.state) details.state = shot.state;
      const result = compareScreenshots(viewport, shot.id, details);

      // Unchanged screenshots are neither kept nor reported; only changes are.
      if (result.status === "passed") {
        rmSync(screenshotPath("current", viewport, shot.id));
        unchangedCount[viewport]++;
      } else {
        results.push(result);
      }
    }

    // Baselines with no matching shot on this branch were removed. Only
    // knowable when every story was captured (no --filter).
    if (!storyFilter) {
      const allShotIds = new Set(
        shotsForViewport(allStories, allStories, viewport).map(
          (shot) => shot.id,
        ),
      );
      const baselineDir = join(SCREENSHOT_DIRS.baselines, viewport);
      for (const fileName of readdirSync(baselineDir)) {
        const shotId = fileName.replace(/\.png$/, "");
        if (allShotIds.has(shotId)) continue;
        results.push({
          id: shotId,
          viewport,
          title: shotId,
          name: "",
          status: "removed",
        });
      }
    }
  }
  server.close();

  for (const failure of failures) {
    results.push({ ...failure, title: failure.id, name: "", status: "error" });
  }
  for (const result of results) {
    result.key = `${result.viewport}/${result.id}`;
  }

  const uncoveredPackages = packagesMissingStateCoverage();
  const reportData = {
    generated: new Date().toISOString(),
    base: { ref: base.ref, sha: base.sha },
    viewports: VIEWPORTS,
    minChange: minChangePercent,
    unchanged: unchangedCount,
    uncovered: uncoveredPackages,
    results,
  };
  writeFileSync(RESULTS_FILE, JSON.stringify(reportData, null, 2));
  writeReport(reportData);

  const countWithStatus = (status) =>
    results.filter((result) => result.status === status).length;
  const totalUnchanged = Object.values(unchangedCount).reduce(
    (sum, count) => sum + count,
    0,
  );
  console.log(
    `\n  ${totalUnchanged} unchanged · ${countWithStatus("changed")} changed · ${countWithStatus("new")} new · ${countWithStatus("removed")} removed · ${countWithStatus("error")} errors`,
  );
  if (uncoveredPackages.length > 0) {
    console.warn(
      `  ⚠ No interactive-state coverage in states.mjs for: ${uncoveredPackages.join(", ")}`,
    );
  }
  console.log(`  Report: ${REPORT_DIR}  (npm run vr:report to view)\n`);

  if (scans) {
    const a11y = await writeAccessibilityReport(scans, stories);
    const issueCount = Object.values(a11y.impacts).reduce(
      (sum, count) => sum + count,
      0,
    );
    const byImpact = IMPACTS.filter((impact) => a11y.impacts[impact])
      .map((impact) => `${a11y.impacts[impact]} ${impact}`)
      .join(" · ");
    console.log(
      `  Accessibility: ${a11y.scanned} stories scanned · ${a11y.stories.length} with issues${issueCount ? ` (${byImpact})` : ""}${a11y.errors.length ? ` · ${a11y.errors.length} scan errors` : ""}`,
    );
    console.log(`  Report: ${A11Y_REPORT_DIR}\n`);
  }

  // Changes are informational only; only capture failures fail the run.
  process.exitCode = countWithStatus("error") > 0 ? 1 : 0;
}

// The screenshots the report shows for each status.
const REPORT_IMAGE_KINDS = {
  changed: ["baselines", "current", "diff"],
  new: ["current"],
  removed: ["baselines"],
};

/**
 * Copies what a report page needs into its assets folder: the NYSDS
 * component bundle and stylesheet, and the review pages' stylesheet.
 */
function copyReportAssets(reportDir) {
  mkdirSync(join(reportDir, "assets"), { recursive: true });

  // The reports' controls are NYSDS components from the single-file UMD
  // bundle, which `npm run build` doesn't produce.
  if (!existsSync(NYSDS_BUNDLE)) {
    console.log("Building dist/nysds.js for the report UI…");
    spawnSync("npm", ["run", "build:umd"], { cwd: ROOT, stdio: "inherit" });
  }
  for (const assetFile of [NYSDS_BUNDLE, NYSDS_STYLESHEET, REVIEW_STYLESHEET]) {
    if (existsSync(assetFile)) {
      const assetName = assetFile.split("/").pop();
      copyFileSync(assetFile, join(reportDir, "assets", assetName));
    } else {
      console.warn(
        `  Missing ${assetFile}; run npm run build:umd and npm run build:packages, or the report has no controls.`,
      );
    }
  }
}

/** Writes the report to .visual/report as a self-contained static site. */
function writeReport(reportData) {
  rmSync(REPORT_DIR, { recursive: true, force: true });
  copyReportAssets(REPORT_DIR);

  for (const result of reportData.results) {
    for (const kind of REPORT_IMAGE_KINDS[result.status] ?? []) {
      const destination = join(
        REPORT_DIR,
        kind,
        result.viewport,
        `${result.id}.png`,
      );
      mkdirSync(dirname(destination), { recursive: true });
      copyFileSync(
        screenshotPath(kind, result.viewport, result.id),
        destination,
      );
    }
  }

  // A script rather than JSON, so the report also works opened from disk
  // (file://), where fetching JSON isn't allowed.
  writeFileSync(
    join(REPORT_DIR, "results.js"),
    `window.VR_DATA = ${JSON.stringify(reportData)};\n`,
  );
  writeFileSync(join(REPORT_DIR, "index.html"), REPORT_TEMPLATE);
}

async function runReportCommand() {
  if (!existsSync(join(REPORT_DIR, "index.html"))) {
    console.error("No report. Run npm run vr:test first.");
    return;
  }
  const server = await serveDirectory(REPORT_DIR, Number(option("port", 6007)));
  const url = `http://127.0.0.1:${server.address().port}/`;
  console.log(`Visual report at ${url}  (Ctrl+C to stop)`);
  if (!option("no-open", false)) exec(`open ${url}`);
}

const commands = {
  test: runTestCommand,
  baseline: runBaselineCommand,
  report: runReportCommand,
};
if (commands[command]) {
  commands[command]();
} else {
  console.error(`Unknown command: ${command}`);
}

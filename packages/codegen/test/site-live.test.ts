/**
 * Opt-in sweep over every `{% set preview %}` block in the live docs site.
 * Set NYSDS_SITE_DIR to a checkout of the docs site to enable it; CI and
 * machines without the checkout skip it. This is how the docs site build
 * stays honest: zero `unsupported` results except the allowlist.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest, transformExample } from "../dist/index.js";

const siteDir = process.env.NYSDS_SITE_DIR;
const available =
  !!siteDir &&
  fs.existsSync(path.join(siteDir, "src", "content", "components"));

/**
 * Component pages allowed to produce `unsupported` examples (scripts or
 * inline handlers that genuinely cannot be transformed). Keep this short;
 * every entry is a page with no React or Angular tab for that example.
 */
const ALLOWLIST = new Set<string>([
  // Pages whose examples use <script> blocks or inline onclick handlers
  // (swept 2026-09-01). Each needs a hand-written framework override or a
  // reworked example before it can come off this list.
  "alert",
  "backtotop",
  "card",
  "modal",
  "skipnav",
  "unavheader",
  "verticalnav",
]);

const PREVIEW_RE = /\{%\s*set\s+preview\s*%\}([\s\S]*?)\{%\s*endset\s*%\}/g;

test("live docs site sweep", { skip: !available }, () => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const manifest = loadManifest(
    path.join(here, "..", "..", "..", "custom-elements.json"),
  );
  const componentsDir = path.join(siteDir!, "src", "content", "components");
  const failures: string[] = [];
  let total = 0;

  for (const entry of fs.readdirSync(componentsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const indexPath = path.join(componentsDir, entry.name, "index.md");
    if (!fs.existsSync(indexPath)) continue;
    const content = fs.readFileSync(indexPath, "utf8");
    let match;
    let ordinal = 0;
    while ((match = PREVIEW_RE.exec(content)) !== null) {
      ordinal += 1;
      total += 1;
      for (const framework of ["react", "angular"] as const) {
        const result = transformExample({
          html: match[1],
          framework,
          manifest,
        });
        if (result.unsupported && !ALLOWLIST.has(entry.name)) {
          failures.push(
            `${entry.name}#${ordinal} (${framework}): ${result.warnings.join("; ")}`,
          );
        }
      }
    }
  }

  assert.ok(total > 100, `swept ${total} preview blocks`);
  assert.deepEqual(failures, [], `${failures.length} unsupported examples`);
});

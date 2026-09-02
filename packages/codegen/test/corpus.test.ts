/**
 * A copied sample of real docs-site preview blocks, run against the real
 * repository manifest. Asserts the transformer produces usable output for
 * every one — warnings are allowed, `unsupported` is not.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest, transformExample } from "../dist/index.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const corpusDir = path.join(here, "fixtures", "site-corpus");
const repoManifestPath = path.join(
  here,
  "..",
  "..",
  "..",
  "custom-elements.json",
);

const manifest = loadManifest(repoManifestPath);
const files = fs
  .readdirSync(corpusDir)
  .filter((name) => name.endsWith(".html"))
  .sort();

test("the corpus is not empty", () => {
  assert.ok(files.length >= 10, `found ${files.length} corpus files`);
});

for (const file of files) {
  const html = fs.readFileSync(path.join(corpusDir, file), "utf8");
  for (const framework of ["react", "angular"] as const) {
    test(`corpus ${file} -> ${framework}`, () => {
      const result = transformExample({ html, framework, manifest });
      assert.equal(
        result.unsupported,
        false,
        `unsupported; warnings: ${JSON.stringify(result.warnings)}`,
      );
      assert.ok(result.code.trim().length > 0, "produced code");
    });
  }
}

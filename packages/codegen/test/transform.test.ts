/**
 * Golden-file tests: one fixture per transformer rule. Set UPDATE_GOLDEN=1
 * to rewrite the golden files after an intentional formatting change, then
 * review the diff.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest, transformExample } from "../dist/index.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const examplesDir = path.join(here, "fixtures", "examples");
const manifest = loadManifest(path.join(here, "fixtures", "manifest.json"));
const update = process.env.UPDATE_GOLDEN === "1";

interface Variant {
  formsMode?: "none" | "template" | "reactive";
  suffix?: string;
  warnings?: number;
  unsupported?: boolean;
  reactImports?: string[];
  angularImports?: string[];
}

/** One entry per rule in the WS2 brief. */
const CASES: Record<string, Variant[]> = {
  "01-basic-attrs": [
    {
      reactImports: ["NysTextinput"],
      angularImports: ["NysTextinputComponent"],
    },
  ],
  "02-boolean": [{}],
  "03-number": [{}],
  "04-attr-mapping": [{}],
  "05-unknown-attr": [{ warnings: 1 }],
  "06-slot": [
    { reactImports: ["NysButton", "NysTextinput"] },
  ],
  "07-native": [{ reactImports: [], angularImports: [] }],
  "08-script": [{ warnings: 1, unsupported: true }],
  "09-style-block": [{ warnings: 1, unsupported: false }],
  "10-inline-handler": [{ warnings: 1, unsupported: true }],
  "11-forms-value": [
    {},
    { formsMode: "template", suffix: ".template" },
    { formsMode: "reactive", suffix: ".reactive" },
  ],
  "12-subcomponents": [
    { reactImports: ["NysOption", "NysSelect"] },
  ],
  "13-object-prop": [{}],
  "14-unknown-component": [{ warnings: 1, reactImports: [], angularImports: [] }],
  "15-forms-checked": [{}, { formsMode: "template", suffix: ".template" }],
  "16-inline-style": [{}],
  "17-comment": [{}],
};

for (const [name, variants] of Object.entries(CASES)) {
  const html = fs.readFileSync(path.join(examplesDir, `${name}.html`), "utf8");
  for (const variant of variants) {
    const suffix = variant.suffix ?? "";
    for (const framework of ["react", "angular"] as const) {
      const goldenName =
        framework === "react"
          ? `${name}${suffix}.jsx`
          : `${name}${suffix}.angular.html`;
      test(`${goldenName}`, () => {
        const result = transformExample({
          html,
          framework,
          manifest,
          formsMode: variant.formsMode,
        });
        const goldenPath = path.join(examplesDir, goldenName);
        if (update) {
          fs.writeFileSync(goldenPath, result.code);
        } else {
          const golden = fs.readFileSync(goldenPath, "utf8");
          assert.equal(result.code, golden);
        }
        assert.equal(
          result.language,
          framework === "react" ? "jsx" : "html"
        );
        if (variant.warnings !== undefined) {
          assert.equal(
            result.warnings.length,
            variant.warnings,
            `warnings: ${JSON.stringify(result.warnings)}`
          );
        } else {
          assert.deepEqual(result.warnings, []);
        }
        assert.equal(result.unsupported, variant.unsupported ?? false);
        const expectedImports =
          framework === "react" ? variant.reactImports : variant.angularImports;
        if (expectedImports !== undefined) {
          assert.deepEqual(result.imports, expectedImports);
        }
      });
    }
  }
}

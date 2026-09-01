/**
 * Keeps each component package's `exports` map in sync with the custom-element
 * source files in its src/ directory.
 *
 * Every `src/nys-<element>.ts` file is built as its own rollup entry (see
 * `packageEntries` in the root vite.config.js), so every element gets a
 * matching subpath export:
 *
 *   "@nysds/nys-accordion"                    → dist/nys-accordion.js  (index bundle: all elements)
 *   "@nysds/nys-accordion/nys-accordionitem"  → dist/nys-accordionitem.js (just that element)
 *
 * The subpath named after the package itself points at the index bundle so the
 * two spellings behave identically. Framework wrappers (React/Angular) import
 * the subpaths so a wrapper for a child element (e.g. NysAccordionItem)
 * resolves to a real module instead of a non-existent package like
 * "@nysds/nys-accordionitem".
 *
 * Run automatically as part of `npm run build:packages`.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pkgsDir = path.join(root, "packages");

let changed = 0;

for (const dir of fs.readdirSync(pkgsDir).sort()) {
  if (!dir.startsWith("nys-")) continue;
  const pkgJsonPath = path.join(pkgsDir, dir, "package.json");
  const srcDir = path.join(pkgsDir, dir, "src");
  if (!fs.existsSync(pkgJsonPath) || !fs.existsSync(srcDir)) continue;

  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));

  // Element source files: nys-*.ts, excluding .test/.stories/.figma/*.logo
  // partials (the extra dot fails the match).
  const elements = fs
    .readdirSync(srcDir)
    .map((f) => f.match(/^(nys-[a-z0-9-]+)\.ts$/)?.[1])
    .filter(Boolean)
    .sort();

  // "types" must precede "import" — Node and TypeScript pick the first
  // matching condition, so a trailing "types" key is never reached.
  const exportsMap = {
    ".": {
      types: "./dist/index.d.ts",
      import: `./dist/${dir}.js`,
    },
  };

  for (const el of elements) {
    exportsMap[`./${el}`] = {
      types: `./dist/${el}.d.ts`,
      // The package-named element is folded into the index bundle.
      import: el === dir ? `./dist/${dir}.js` : `./dist/${el}.js`,
    };
  }
  exportsMap["./package.json"] = "./package.json";

  const next = JSON.stringify(exportsMap);
  const prev = JSON.stringify(pkg.exports ?? {});
  if (next !== prev) {
    pkg.exports = exportsMap;
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
    console.log(`✓ exports synced: ${dir} (${elements.length} element${elements.length === 1 ? "" : "s"})`);
    changed++;
  }
}

console.log(changed ? `Updated ${changed} package.json file(s).` : "All package exports already in sync.");

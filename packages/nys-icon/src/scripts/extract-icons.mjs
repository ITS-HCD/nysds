/**
 * extract-icons.mjs
 *
 * Build-time script that reads nys-icon.library.ts and extracts each
 * embedded SVG into an individual .svg file under dist/icons/.
 * Also generates a manifest.json listing all icon names.
 *
 * Usage: node src/scripts/extract-icons.mjs
 * Run after `vite build` as part of the nys-icon package build.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcFile = resolve(__dirname, "../nys-icon.library.ts");
const outDir = resolve(__dirname, "../../dist/icons");

const source = readFileSync(srcFile, "utf8");

// Match each icon entry: iconName: `<svg...>...</svg>`,
const iconRegex = /(\w+):\s*`(<svg[\s\S]*?<\/svg>)`/g;
let match;
const names = [];

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

while ((match = iconRegex.exec(source)) !== null) {
  const [, name, svg] = match;
  // Clean up leading whitespace from template literal indentation
  const cleaned = svg.replace(/^\s+/gm, "").trim();
  writeFileSync(resolve(outDir, `${name}.svg`), cleaned, "utf8");
  names.push(name);
}

// Write manifest with sorted icon names
writeFileSync(
  resolve(outDir, "manifest.json"),
  JSON.stringify({ icons: names.sort() }, null, 2),
  "utf8",
);

console.log(`Extracted ${names.length} icons to dist/icons/`);

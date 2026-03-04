#!/usr/bin/env node
/**
 * Build script: extracts individual SVG files from nys-icon.library.ts.
 * Run as a pre-build step for the nys-icon package. Parses the TypeScript
 * source of truth and writes each icon as a separate .svg file to
 * packages/nys-icon/src/icons/ (a generated, gitignored directory).
 *
 * Usage: node src/scripts/extract-icons.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
const libraryPath = path.resolve(
  rootDir,
  "packages/nys-icon/src/nys-icon.library.ts",
);
const outputDir = path.resolve(rootDir, "packages/nys-icon/src/icons");

// Read the library file
const source = fs.readFileSync(libraryPath, "utf-8");

// Match each icon entry: `iconName: \`<svg ...>...</svg>\``
// The pattern captures the key name and the SVG content inside backticks
const iconPattern = /^\s{2}(\w+):\s*`(<svg[\s\S]*?<\/svg>)\s*`/gm;

// Ensure output directory exists
fs.mkdirSync(outputDir, { recursive: true });

let count = 0;
let match;

while ((match = iconPattern.exec(source)) !== null) {
  const [, name, svg] = match;
  // Trim leading whitespace from each line (the SVGs are indented in the TS file)
  const trimmedSvg =
    svg
      .split("\n")
      .map((line) => line.replace(/^  /, ""))
      .join("\n")
      .trim() + "\n";

  const filePath = path.join(outputDir, `${name}.svg`);
  fs.writeFileSync(filePath, trimmedSvg, "utf-8");
  count++;
}

console.log(`Extracted ${count} icons to ${outputDir}`);

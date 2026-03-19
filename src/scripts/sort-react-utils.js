/**
 * The auto-generated packages/react/index.js file does not guarantee
 * alphabetical ordering of exports. This script sorts the export lines
 * alphabetically after `npm run cem` has generated the file.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = resolve(__dirname, "../../packages/react/index.js");

const contents = readFileSync(indexPath, "utf-8");

const lines = contents.split("\n");
const exportLines = lines.filter((l) => l.startsWith("export"));
const otherLines = lines.filter((l) => !l.startsWith("export"));

const sorted = exportLines.sort((a, b) => a.localeCompare(b));

const output = [...otherLines, ...sorted].join("\n").trimEnd() + "\n";

writeFileSync(indexPath, output, "utf-8");
console.log("✅  packages/react/index.js exports sorted successfully.");

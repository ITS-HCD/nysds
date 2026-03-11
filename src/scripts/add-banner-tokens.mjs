import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const banner = `/*!
 * New York State Design System v1.16.0-alpha-1
 * Description: A design system for New York State's digital products.
 * Repository: https://github.com/its-hcd/nysds
 * License: MIT
 */
`;

const dirs = ["./dist", "./styles/dist"];

for (const dir of dirs) {
  let files;
  try {
    files = readdirSync(dir);
  } catch {
    continue; // skip if dir doesn't exist
  }

  for (const file of files) {
    if (!file.endsWith(".css")) continue;
    const filePath = join(dir, file);
    const contents = readFileSync(filePath, "utf8");
    // if (!contents.startsWith("/*!")) {
      writeFileSync(filePath, banner + contents, "utf8");
    // }
  }
}

console.log("✓ Banner injected into CSS files");
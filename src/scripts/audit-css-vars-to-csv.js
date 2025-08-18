// Run with: node src/scripts/audit-css-vars-to-csv.js
// Generates a CSV of all CSS properties used in nys-* packages in project root

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your packages directory
const COMPONENTS_DIR = path.resolve(__dirname, "../../packages");

// Regex to match CSS variable names
const CSS_VAR_REGEX = /--[_a-zA-Z0-9-]+/g;

// 🔍 Get all matching style files in nys-* packages
function getAllStyleFiles(baseDir) {
  const packageDirs = fs.readdirSync(baseDir).filter(name =>
    name.startsWith("nys-") && fs.statSync(path.join(baseDir, name)).isDirectory()
  );

  const files = [];

  for (const dir of packageDirs) {
    const stylePath = path.join(baseDir, dir, "src");
    if (fs.existsSync(stylePath)) {
      const styleFiles = fs.readdirSync(stylePath)
        .filter(name => name.endsWith(".styles.ts") && name.startsWith(dir))
        .map(name => path.join(stylePath, name));
      files.push(...styleFiles);
    }
  }

  return files;
}

// 🧠 Get component name from file path
function getComponentName(filePath) {
  const match = filePath.match(/packages[\/\\](nys-[^\/\\]+)/);
  return match ? match[1] : "unknown";
}

// 📦 Extract CSS variables from file content
function extractVarsFromContent(content) {
  return content.match(CSS_VAR_REGEX) || [];
}

// 🏁 Main function
async function runAudit() {
  const allFiles = getAllStyleFiles(COMPONENTS_DIR);
  const rows = [];

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, "utf-8");
    const vars = extractVarsFromContent(content);
    const component = getComponentName(filePath);

    for (const variable of vars) {
      let category = "other";
      if (variable.startsWith("--_nys-")) {
        category = "pseudoPrivate";
      } else if (variable.startsWith("--nys-")) {
        category = "public";
      }

      rows.push({
        component,
        category,
        css_variable: variable
      });
    }
  }

  const outputPath = path.resolve(__dirname, "../../css-vars-by-component.csv");

  const writer = createCsvWriter({
    path: outputPath,
    header: [
      { id: "component", title: "component" },
      { id: "category", title: "category" },
      { id: "css_variable", title: "css_variable" }
    ]
  });

  await writer.writeRecords(rows);
  console.log(`✅ CSV saved to: ${outputPath}`);
}

runAudit();

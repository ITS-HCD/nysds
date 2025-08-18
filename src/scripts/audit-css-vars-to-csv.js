// Run with: node src/scripts/audit-css-vars-to-csv.js
// Generates a CSV of all CSS properties used in nys-* packages in project root

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.resolve(__dirname, "../../packages");
const VAR_DECLARATION_REGEX = /(--[_a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;

// Collect all matching .styles.ts files
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

// Extract var name and full value
function extractVariables(content) {
  const vars = [];
  let match;
  while ((match = VAR_DECLARATION_REGEX.exec(content)) !== null) {
    vars.push({ name: match[1], value: match[2] });
  }
  return vars;
}

// Pull fallback tokens and raw values from var(...) chains
function parseVarChain(value) {
  const varCalls = [...value.matchAll(/var\(([^)]+)\)/g)];
  const fallbackTokens = [];
  let rawFallback = "";

  varCalls.forEach(match => {
    const parts = match[1].split(",").map(v => v.trim());
    if (parts[0].startsWith("--")) fallbackTokens.push(parts[0]);
    if (parts.length > 1 && !parts[1].startsWith("--")) rawFallback = parts[1];
  });

  return { fallbackTokens, rawFallback };
}

function getComponentName(filePath) {
  const match = filePath.match(/packages[\/\\](nys-[^\/\\]+)/);
  return match ? match[1] : "unknown";
}

function classifyVariable(privateVar, fallbackTokens) {
  const expectedPublic = privateVar.replace(/^--_/, "--");
  const index = fallbackTokens.indexOf(expectedPublic);

  if (index !== -1 && fallbackTokens.length > index + 1) {
    return {
      category: "public",
      fallback: fallbackTokens[index + 1]
    };
  }

  return {
    category: "private",
    fallback: fallbackTokens[0] || ""
  };
}

// Run full audit
async function runAudit() {
  const files = getAllStyleFiles(COMPONENTS_DIR);
  const rows = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf-8");
    const component = getComponentName(filePath);
    const vars = extractVariables(content);

    for (const { name, value } of vars) {
      if (!name.startsWith("--_nys-")) continue;

      const { fallbackTokens, rawFallback } = parseVarChain(value);
      const { category, fallback } = classifyVariable(name, fallbackTokens);

      rows.push({
        component,
        category,
        css_variable: name,
        fallback_value: fallback,
        raw_fallback: rawFallback
      });
    }
  }

  const outputPath = path.resolve(__dirname, "../../css-vars-by-component.csv");

  const writer = createCsvWriter({
    path: outputPath,
    header: [
      { id: "component", title: "component" },
      { id: "category", title: "category" },
      { id: "css_variable", title: "css_variable" },
      { id: "fallback_value", title: "fallback_value" },
      { id: "raw_fallback", title: "raw_fallback" }
    ]
  });

  await writer.writeRecords(rows);
  console.log(`✅ CSV saved to: ${outputPath}`);
}

runAudit();

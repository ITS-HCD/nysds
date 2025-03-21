#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Because __dirname, __filename are not defined in ESM:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your JSON file:
const filePath = path.join(__dirname, "figmaIcons.json");

function extractFigmaData() {
  // 1) Read and parse the JSON:
  const rawData = fs.readFileSync(filePath, "utf-8");
  const items = JSON.parse(rawData);

  // 2) Filter only the top‐level items you want
  const topLevelItems = items.filter((item) => item.id && item.name);

  // 3) Build the "document URL substitutions" lines
  const docSubstitutions = [];
  docSubstitutions.push("--- Document URL substitutions ---\n");
  topLevelItems.forEach((item) => {
    docSubstitutions.push(
      `"<FIGMA_ICON_${item.name.toUpperCase()}>": "https://www.figma.com/design/Tad3pBv2jhA8XVf6aMlKEi/?node-id=${item.id}",`
    );
  });
  const docSubstitutionsOutput = docSubstitutions.join("\n");

  // 4) Build the "Code Connect" lines
  const codeConnectLines = [];
  codeConnectLines.push("--- Code Connect lines ---\n");
  topLevelItems.forEach((item) => {
    codeConnectLines.push(
      `figma.connect("<FIGMA_ICONS_${item.name.toUpperCase()}>", { example: () => html\`${item.name}\` });`
    );
  });
  const codeConnectLinesOutput = codeConnectLines.join("\n");

  // 5) Write each set of lines to its own file:
  fs.writeFileSync(path.join(__dirname, "codeconnect-docsubstitutions.txt"), docSubstitutionsOutput);
  fs.writeFileSync(path.join(__dirname, "codeconnect-icons.txt"), codeConnectLinesOutput);

  // 6) Confirm it worked
  console.log("Wrote doc substitutions to codeconnect-docsubstitutions.txt");
  console.log("Wrote code connect icons to codeconnect-icons.txt");
}

extractFigmaData();

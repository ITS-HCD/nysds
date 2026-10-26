#!/usr/bin/env node
/**
 * Snapshot the Terrazzo CSS output and compare two snapshots by meaning
 * (references resolved, values normalized, per selector) — for example, the
 * CSS before and after a Figma pull.
 *
 * Usage:
 *   node scripts/css-diff.mjs snapshot <name>
 *   node scripts/css-diff.mjs compare <before> <after> [--step <n>] [--drift [--out <file.md>]]
 *
 * Snapshots live in .snapshots/<name>/ (gitignored). `compare` prints a summary
 * and writes reports/step-<n>-<after>.md (or reports/compare-<before>-<after>.md).
 * `--drift` also writes the Figma ↔ code report (default reports/figma-code-drift.md)
 * from .snapshots/figma-meta.json, which figma-pull.mjs writes.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { colorKey, deltaE, normalizeValue, parseBlocks, resolveValue, singleColor } from "./lib/css-vars.mjs";
import { variableName } from "./lib/variable-name.mjs";
import { FILES } from "./figma-to-dtcg.mjs";

const PACKAGE_DIRECTORY = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPOSITORY_ROOT = join(PACKAGE_DIRECTORY, "../..");
const SNAPSHOTS_DIRECTORY = join(PACKAGE_DIRECTORY, ".snapshots");
const REPORTS_DIRECTORY = join(PACKAGE_DIRECTORY, "reports");
const DEFAULT_DRIFT_REPORT = "figma-code-drift.md";
const USAGE =
  "Usage: css-diff.mjs snapshot <name> | compare <before> <after> [--step <n>] [--drift [--out <file.md>]]";

// ---------------------------------------------------------------------------
// Command line
// ---------------------------------------------------------------------------

const [command, ...commandArguments] = process.argv.slice(2);

if (command === "snapshot" && commandArguments[0]) {
  takeSnapshot(commandArguments[0]);
} else if (command === "compare" && commandArguments[0] && commandArguments[1]) {
  const stepNumber = getOptionValue("--step");
  let driftReportFile = null;
  if (commandArguments.includes("--drift")) {
    driftReportFile = getOptionValue("--out") ?? DEFAULT_DRIFT_REPORT;
  }
  compareSnapshots(commandArguments[0], commandArguments[1], stepNumber, driftReportFile);
} else {
  console.error(USAGE);
  process.exit(1);
}

/** The value after a command-line option (e.g. `--step 3` → "3"), or null. */
function getOptionValue(optionName) {
  const optionIndex = commandArguments.indexOf(optionName);
  if (optionIndex === -1) {
    return null;
  }
  return commandArguments[optionIndex + 1];
}

// ---------------------------------------------------------------------------
// Snapshot
// ---------------------------------------------------------------------------

/** Convert, build, and copy the CSS and token sources into .snapshots/<name>/. */
function takeSnapshot(snapshotName) {
  console.log(`Building tokens with ${getTerrazzoVersion()}…`);
  execFileSync(process.execPath, ["scripts/figma-to-dtcg.mjs"], { cwd: PACKAGE_DIRECTORY, stdio: "inherit" });
  execFileSync(findInstalledFile("node_modules/.bin/tz"), ["build"], { cwd: PACKAGE_DIRECTORY, stdio: "inherit" });

  const snapshotDirectory = join(SNAPSHOTS_DIRECTORY, snapshotName);
  rmSync(snapshotDirectory, { recursive: true, force: true });
  mkdirSync(join(snapshotDirectory, "css"), { recursive: true });

  cpSync(join(PACKAGE_DIRECTORY, "dist/tokens.css"), join(snapshotDirectory, "css/tokens.css"));
  cpSync(join(PACKAGE_DIRECTORY, "src"), join(snapshotDirectory, "tokens"), {
    recursive: true,
    filter: (sourcePath) => !sourcePath.endsWith(".DS_Store"),
  });
  cpSync(join(PACKAGE_DIRECTORY, "terrazzo.config.js"), join(snapshotDirectory, "terrazzo.config.js"));

  const snapshotInfo = { name: snapshotName, terrazzo: getTerrazzoVersion(), created: new Date().toISOString() };
  writeFileSync(join(snapshotDirectory, "meta.json"), JSON.stringify(snapshotInfo, null, 2) + "\n");

  console.log(`Snapshot "${snapshotName}" → ${relative(REPOSITORY_ROOT, snapshotDirectory)}`);
}

/** Path of a file in node_modules, checking this package first, then the repo root. */
function findInstalledFile(relativePath) {
  for (const directory of [PACKAGE_DIRECTORY, REPOSITORY_ROOT]) {
    const candidatePath = join(directory, relativePath);
    if (existsSync(candidatePath)) {
      return candidatePath;
    }
  }
  throw new Error(`Not installed: ${relativePath}`);
}

function getTerrazzoVersion() {
  const terrazzoPackageFile = findInstalledFile("node_modules/@terrazzo/cli/package.json");
  const terrazzoPackage = JSON.parse(readFileSync(terrazzoPackageFile, "utf8"));
  return `@terrazzo/cli@${terrazzoPackage.version}`;
}

// ---------------------------------------------------------------------------
// Loading a snapshot
// ---------------------------------------------------------------------------

/**
 * Load a snapshot as a set of "contexts": each place a custom property can be
 * read, with the properties it declares and the scope its references resolve in.
 *
 * - "tokens.css :root"                          → the :root block
 * - "tokens.css .nys-theme-x, [data-theme=…]"   → a theme block, resolved over :root
 * - "theme-x.css"                               → old Terrazzo 0.5 per-theme files, resolved over :root
 */
function loadSnapshot(snapshotName) {
  const snapshotDirectory = join(SNAPSHOTS_DIRECTORY, snapshotName);
  if (!existsSync(snapshotDirectory)) {
    throw new Error(`No snapshot "${snapshotName}" — run: css-diff.mjs snapshot ${snapshotName}`);
  }
  const snapshotInfo = JSON.parse(readFileSync(join(snapshotDirectory, "meta.json"), "utf8"));

  function readCSSFile(fileName) {
    return parseBlocks(readFileSync(join(snapshotDirectory, "css", fileName), "utf8"));
  }

  const tokensCSSBlocks = readCSSFile("tokens.css");
  const rootDeclarations = new Map();
  for (const block of tokensCSSBlocks) {
    if (block.selector === ":root") {
      for (const [propertyName, propertyValue] of block.declarations) {
        rootDeclarations.set(propertyName, propertyValue);
      }
    }
  }

  // context name → { declared: Map, scope: Map }
  const contexts = new Map();
  contexts.set("tokens.css :root", { declared: rootDeclarations, scope: rootDeclarations });

  for (const block of tokensCSSBlocks) {
    if (block.selector === ":root") {
      continue;
    }
    contexts.set(`tokens.css ${block.selector}`, {
      declared: block.declarations,
      scope: new Map([...rootDeclarations, ...block.declarations]),
    });
  }

  // Terrazzo 0.5 builds also wrote styles/dist/theme-<name>.css
  const themeFileNames = readdirSync(join(snapshotDirectory, "css"))
    .filter((fileName) => fileName.startsWith("theme-"))
    .sort();
  for (const themeFileName of themeFileNames) {
    const themeDeclarations = new Map();
    for (const block of readCSSFile(themeFileName)) {
      for (const [propertyName, propertyValue] of block.declarations) {
        themeDeclarations.set(propertyName, propertyValue);
      }
    }
    contexts.set(themeFileName, {
      declared: themeDeclarations,
      scope: new Map([...rootDeclarations, ...themeDeclarations]),
    });
  }

  return {
    name: snapshotName,
    info: snapshotInfo,
    contexts,
    tokensByCSSName: indexTokens(join(snapshotDirectory, "tokens")),
  };
}

/** CSS name → { id, file } for every token in a snapshot's token source files. */
function indexTokens(tokensDirectory) {
  const tokensByCSSName = new Map();
  const jsonFiles = readdirSync(tokensDirectory, { recursive: true }).filter((fileName) =>
    String(fileName).endsWith(".json"),
  );

  for (const jsonFile of jsonFiles) {
    const document = JSON.parse(readFileSync(join(tokensDirectory, jsonFile), "utf8"));
    visitTokenIds(document, [], (tokenId) => {
      const cssName = variableName(tokenId);
      if (!tokensByCSSName.has(cssName)) {
        tokensByCSSName.set(cssName, { id: tokenId, file: `src/${jsonFile}` });
      }
    });
  }

  return tokensByCSSName;
}

/** Call `visit(tokenId)` for every token (any object with a $value) in a DTCG document. */
function visitTokenIds(node, pathSoFar, visit) {
  const isObject = node !== null && typeof node === "object" && !Array.isArray(node);
  if (!isObject) {
    return;
  }
  if ("$value" in node && pathSoFar.length > 0) {
    visit(pathSoFar.join("."));
  }
  for (const [key, child] of Object.entries(node)) {
    if (!key.startsWith("$")) {
      visitTokenIds(child, [...pathSoFar, key], visit);
    }
  }
}

// ---------------------------------------------------------------------------
// Compare
// ---------------------------------------------------------------------------

function compareSnapshots(beforeName, afterName, stepNumber, driftReportFile) {
  const before = loadSnapshot(beforeName);
  const after = loadSnapshot(afterName);

  const removed = [];
  const added = [];
  const changed = [];
  const structuralNotes = [];
  let formatOnlyCount = 0;
  const formatOnlyExamples = [];

  const allContextNames = new Set([...before.contexts.keys(), ...after.contexts.keys()]);
  for (const contextName of allContextNames) {
    const beforeContext = before.contexts.get(contextName);
    let afterContext = after.contexts.get(contextName);

    // Per-theme files are no longer built; their properties live in the tokens.css theme block
    const themeFileMatch = contextName.match(/^theme-(\w+)\.css$/);
    if (beforeContext && !afterContext && themeFileMatch) {
      const themeName = themeFileMatch[1];
      afterContext = after.contexts.get(`tokens.css .nys-theme-${themeName}, [data-theme="${themeName}"]`);
      if (afterContext) {
        structuralNotes.push(
          `\`${contextName}\` is no longer generated; compared against the ${themeName} block in tokens.css`,
        );
      }
    }

    if (!beforeContext || !afterContext) {
      const onlyIn = beforeContext ? beforeName : afterName;
      structuralNotes.push(`Context \`${contextName}\` only exists in **${onlyIn}**`);
      if (!afterContext) {
        for (const propertyName of beforeContext.declared.keys()) {
          removed.push({ context: contextName, property: propertyName });
        }
      } else {
        for (const propertyName of afterContext.declared.keys()) {
          added.push({ context: contextName, property: propertyName });
        }
      }
      continue;
    }

    if (beforeContext.declared.size !== afterContext.declared.size) {
      structuralNotes.push(
        `\`${contextName}\` declares ${beforeContext.declared.size} vars in ${beforeName}, ${afterContext.declared.size} in ${afterName}`,
      );
    }

    const propertyNames = new Set([...beforeContext.declared.keys(), ...afterContext.declared.keys()]);
    for (const propertyName of propertyNames) {
      const existsBefore = beforeContext.scope.has(propertyName);
      const existsAfter = afterContext.scope.has(propertyName);
      if (existsBefore && !existsAfter) {
        removed.push({ context: contextName, property: propertyName });
        continue;
      }
      if (!existsBefore && existsAfter) {
        added.push({ context: contextName, property: propertyName });
        continue;
      }

      const rawBefore = beforeContext.scope.get(propertyName);
      const rawAfter = afterContext.scope.get(propertyName);
      const resolvedBefore = resolveValue(rawBefore, beforeContext.scope);
      const resolvedAfter = resolveValue(rawAfter, afterContext.scope);

      const sameMeaning = normalizeValue(resolvedBefore) === normalizeValue(resolvedAfter);
      if (sameMeaning) {
        if (rawBefore !== rawAfter) {
          formatOnlyCount += 1;
          if (formatOnlyExamples.length < 10) {
            formatOnlyExamples.push({ context: contextName, property: propertyName, rawBefore, rawAfter });
          }
        }
        continue;
      }

      const colorBefore = singleColor(resolvedBefore);
      const colorAfter = singleColor(resolvedAfter);
      changed.push({
        context: contextName,
        property: propertyName,
        token: after.tokensByCSSName.get(propertyName) ?? before.tokensByCSSName.get(propertyName),
        before: colorBefore ? colorKey(colorBefore) : resolvedBefore,
        after: colorAfter ? colorKey(colorAfter) : resolvedAfter,
        rawBefore,
        rawAfter,
        colorDistance: colorBefore && colorAfter ? deltaE(colorBefore, colorAfter) : null,
      });
    }
  }

  const comparison = { before, after, stepNumber, removed, added, changed, formatOnlyCount, formatOnlyExamples, structuralNotes };
  printSummary(comparison);

  let reportFileName;
  if (stepNumber) {
    reportFileName = `step-${stepNumber}-${afterName}.md`;
  } else {
    reportFileName = `compare-${beforeName}-${afterName}.md`;
  }
  mkdirSync(REPORTS_DIRECTORY, { recursive: true });
  writeFileSync(join(REPORTS_DIRECTORY, reportFileName), renderComparisonReport(comparison));
  console.log(`\nReport → ${relative(REPOSITORY_ROOT, join(REPORTS_DIRECTORY, reportFileName))}`);

  if (driftReportFile) {
    writeDriftReport(before, after, changed, driftReportFile);
  }
}

/** "1.23" for a color distance, "" when the values aren't single colors. */
function formatColorDistance(colorDistance) {
  if (colorDistance === null) {
    return "";
  }
  return colorDistance.toFixed(2);
}

/** Escape text for a Markdown table cell. */
function escapeTableCell(text) {
  return String(text ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ");
}

// ---------------------------------------------------------------------------
// Drift report
// ---------------------------------------------------------------------------

/** The words of a CSS name, without the --nys- prefix: "--nys-font-size-h1" → ["font", "size", "h1"]. */
function getNameWords(cssName) {
  return cssName.replace(/^--nys-/, "").split("-");
}

/** Whether two CSS names are probably the same token named differently. */
function namesLookSimilar(firstCSSName, secondCSSName) {
  const firstWords = getNameWords(firstCSSName);
  const secondWords = getNameWords(secondCSSName);
  const sameWhenJoined = firstWords.join("") === secondWords.join(""); // "semibold" vs "semi-bold"
  const firstInsideSecond = firstWords.every((word) => secondWords.includes(word));
  const secondInsideFirst = secondWords.every((word) => firstWords.includes(word));
  return sameWhenJoined || firstInsideSecond || secondInsideFirst;
}

/**
 * Team-facing report of every place code and Figma disagree, built from the
 * CSS comparison plus .snapshots/figma-meta.json (written by figma-pull.mjs).
 */
function writeDriftReport(before, after, changed, reportFileName) {
  if (!existsSync(FILES.meta)) {
    throw new Error("No .snapshots/figma-meta.json — run figma-pull.mjs first");
  }
  const figmaMeta = JSON.parse(readFileSync(FILES.meta, "utf8"));

  function getFigmaVariableName(cssName) {
    return figmaMeta.published[cssName]?.figma ?? "";
  }

  // The theme-*.css files mirror the tokens.css theme blocks, so report tokens.css only.
  // "Direct": the token's own value changed. "Follows": it aliases a token that changed.
  const tokensCSSChanges = changed.filter((change) => change.context.startsWith("tokens.css"));
  const directChanges = tokensCSSChanges.filter((change) => change.rawBefore !== change.rawAfter);
  const followingChanges = tokensCSSChanges.filter((change) => change.rawBefore === change.rawAfter);

  const rootScopeBefore = before.contexts.get("tokens.css :root").scope;
  const manualTokens = [];
  for (const manualEntry of figmaMeta.manual) {
    let value = "";
    if (rootScopeBefore.has(manualEntry.css)) {
      value = resolveValue(rootScopeBefore.get(manualEntry.css), rootScopeBefore);
    }
    manualTokens.push({ ...manualEntry, value });
  }

  const possibleRenames = [];
  for (const manualToken of manualTokens) {
    for (const excludedVariable of figmaMeta.excluded) {
      const similarName = namesLookSimilar(manualToken.css, excludedVariable.css);
      const sameValue = normalizeValue(manualToken.value) === normalizeValue(excludedVariable.value);
      if (similarName && sameValue) {
        possibleRenames.push({ manualToken, excludedVariable });
      }
    }
  }

  const lines = [];
  lines.push("# Figma ↔ code token drift", "");
  lines.push(`Generated ${new Date().toISOString()} by \`scripts/css-diff.mjs --drift\`.`, "");
  lines.push(`Figma file \`${figmaMeta.fileKey}\`. Before: snapshot \`${before.name}\`; after: \`${after.name}\`.`, "");
  lines.push("Figma is the source of truth: every **Value differs** row is now the Figma value in `tokens.css`.");
  lines.push('Fill in **Team resolution** (e.g. "Figma correct", "fix in Figma", "intentional").', "");

  lines.push("| Section | Count |", "|---|---|");
  lines.push(`| Value differs (code changed to Figma) | ${directChanges.length} |`);
  lines.push(`| Follows a changed alias | ${followingChanges.length} |`);
  lines.push(`| In code, missing in Figma (src/tokens.manual.json) | ${manualTokens.length} |`);
  lines.push(`| In Figma, excluded (figma.config.mjs) | ${figmaMeta.excluded.length} |`);
  lines.push(`| Possible renames | ${possibleRenames.length} |`);
  lines.push(`| Type/unit mismatches (kept code) | ${figmaMeta.mismatches.length} |`);
  lines.push("");

  lines.push("## Value differs", "");
  lines.push(
    "| CSS var | Context | Figma variable | Code (before) | Figma (now) | ΔE | Code raw | Figma raw | Team resolution |",
  );
  lines.push("|---|---|---|---|---|---|---|---|---|");
  for (const change of directChanges) {
    const context = change.context.replace("tokens.css ", "").replace(/^\.nys-theme-(\w+).*/, "theme: $1");
    lines.push(
      `| \`${change.property}\` | ${context} | ${escapeTableCell(getFigmaVariableName(change.property))} | \`${change.before}\` | \`${change.after}\` | ${formatColorDistance(change.colorDistance)} | \`${escapeTableCell(change.rawBefore)}\` | \`${escapeTableCell(change.rawAfter)}\` | |`,
    );
  }
  lines.push("");

  if (followingChanges.length > 0) {
    lines.push("## Follows a changed alias", "");
    lines.push("Unchanged tokens whose resolved value moved because a token they alias changed above.", "");
    lines.push("| CSS var | Context | Aliases | Before | Now |", "|---|---|---|---|---|");
    for (const change of followingChanges) {
      const context = change.context.replace("tokens.css ", "");
      lines.push(
        `| \`${change.property}\` | ${context} | \`${escapeTableCell(change.rawAfter)}\` | \`${change.before}\` | \`${change.after}\` |`,
      );
    }
    lines.push("");
  }

  lines.push("## In code, missing in Figma", "");
  lines.push("Kept from `src/tokens.manual.json`. Add them to Figma (then delete them there) or deprecate them.", "");
  lines.push("| CSS var | Token | Value | Team resolution |", "|---|---|---|---|");
  for (const manualToken of manualTokens) {
    lines.push(`| \`${manualToken.css}\` | \`${manualToken.path}\` | \`${escapeTableCell(manualToken.value)}\` | |`);
  }
  lines.push("");

  lines.push("## In Figma, excluded", "");
  lines.push("Not published: matched by `exclude` in `figma.config.mjs`. Remove a pattern to publish it.", "");
  lines.push("| CSS var (derived) | Figma variable | Type | Value | Team resolution |", "|---|---|---|---|---|");
  for (const excludedVariable of figmaMeta.excluded) {
    lines.push(
      `| \`${excludedVariable.css}\` | ${escapeTableCell(excludedVariable.figma)} | ${excludedVariable.type} | \`${escapeTableCell(excludedVariable.value)}\` | |`,
    );
  }
  lines.push("");

  lines.push("## Possible renames", "");
  lines.push(
    "A manual token and an excluded Figma variable with similar names and the same value — likely the same token named differently.",
    "",
  );
  lines.push("| Code CSS var | Figma variable | Value | Team resolution |", "|---|---|---|---|");
  for (const { manualToken, excludedVariable } of possibleRenames) {
    lines.push(
      `| \`${manualToken.css}\` | ${escapeTableCell(excludedVariable.figma)} (\`${excludedVariable.css}\`) | \`${escapeTableCell(manualToken.value)}\` | |`,
    );
  }
  lines.push("");

  lines.push("## Type/unit mismatches", "");
  if (figmaMeta.mismatches.length > 0) {
    lines.push("| CSS var | Figma variable | Problem | Alias chain |", "|---|---|---|---|");
    for (const mismatch of figmaMeta.mismatches) {
      const aliasChain = mismatch.chain ? mismatch.chain.join(" → ") : "";
      lines.push(
        `| \`${mismatch.css}\` | ${escapeTableCell(mismatch.figma)} | ${escapeTableCell(mismatch.reason)} | ${escapeTableCell(aliasChain)} |`,
      );
    }
  } else {
    lines.push("None.");
  }
  lines.push("");

  lines.push("## Not synced", "");
  if (figmaMeta.unmappedThemeModes.length > 0) {
    const modeNames = figmaMeta.unmappedThemeModes.map((modeName) => `**${modeName}**`).join(", ");
    lines.push(`- Theme modes with no theme in code: ${modeNames}`);
  }
  if (figmaMeta.breakpointVariance.length > 0) {
    lines.push(
      `- ${figmaMeta.breakpointVariance.length} variables differ by Responsive mode; code uses **Mobile** (\`modes.Responsive\` in figma.config.mjs):`,
    );
    for (const variance of figmaMeta.breakpointVariance) {
      lines.push(`  - \`${variance.css}\`: ${escapeTableCell(JSON.stringify(variance.values))}`);
    }
  }
  for (const warning of figmaMeta.warnings) {
    lines.push(`- \`${warning.css}\`: ${escapeTableCell(warning.warning)}`);
  }
  lines.push("");

  writeFileSync(join(REPORTS_DIRECTORY, reportFileName), lines.join("\n"));
  console.log(`Drift report → ${relative(REPOSITORY_ROOT, join(REPORTS_DIRECTORY, reportFileName))}`);
  console.log(
    `  value differs: ${directChanges.length} (+${followingChanges.length} via aliases), manual: ${manualTokens.length}, excluded: ${figmaMeta.excluded.length}, renames: ${possibleRenames.length}`,
  );
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function printSummary(comparison) {
  const { before, after, removed, added, changed, formatOnlyCount, structuralNotes } = comparison;

  console.log(`\n${before.name} (${before.info.terrazzo}) → ${after.name} (${after.info.terrazzo})`);
  console.log(`  removed vars:            ${removed.length}`);
  console.log(`  added vars:              ${added.length}`);
  console.log(`  semantic value changes:  ${changed.length}`);
  console.log(`  format-only changes:     ${formatOnlyCount}`);
  for (const note of structuralNotes) {
    console.log(`  note: ${note.replace(/[`*]/g, "")}`);
  }

  if (removed.length > 0) {
    console.log("\nRemoved:");
    for (const entry of removed) {
      console.log(`  ${entry.property}  (${entry.context})`);
    }
  }
  if (added.length > 0) {
    console.log("\nAdded:");
    for (const entry of added) {
      console.log(`  ${entry.property}  (${entry.context})`);
    }
  }
  if (changed.length > 0) {
    console.log("\nSemantic value changes:");
    const header = ["CSS var", "Context", "Token", "Source", "Before", "After", "ΔE"];
    const rows = changed.map((change) => [
      change.property,
      change.context,
      change.token?.id ?? "?",
      change.token?.file ?? "?",
      change.before,
      change.after,
      formatColorDistance(change.colorDistance),
    ]);
    printTable(header, rows);
  }
}

/** Print rows as space-padded columns. */
function printTable(header, rows) {
  const columnWidths = header.map((heading, columnIndex) => {
    const cellLengths = rows.map((row) => String(row[columnIndex]).length);
    return Math.max(heading.length, ...cellLengths);
  });

  function formatRow(row) {
    const paddedCells = row.map((cell, columnIndex) => String(cell).padEnd(columnWidths[columnIndex]));
    return `  ${paddedCells.join("  ")}`;
  }

  console.log(formatRow(header));
  console.log(`  ${columnWidths.map((width) => "-".repeat(width)).join("  ")}`);
  for (const row of rows) {
    console.log(formatRow(row));
  }
}

function renderComparisonReport(comparison) {
  const { before, after, stepNumber, removed, added, changed, formatOnlyCount, formatOnlyExamples, structuralNotes } =
    comparison;

  const lines = [];
  const titlePrefix = stepNumber ? `Step ${stepNumber}: ` : "";
  lines.push(`# ${titlePrefix}${before.name} → ${after.name}`);
  lines.push("");
  lines.push(`Generated ${new Date().toISOString()} by \`scripts/css-diff.mjs\`.`);
  lines.push("");
  lines.push("| | Before | After |");
  lines.push("|---|---|---|");
  lines.push(`| Snapshot | \`${before.name}\` | \`${after.name}\` |`);
  lines.push(`| Terrazzo | ${before.info.terrazzo} | ${after.info.terrazzo} |`);
  lines.push("");
  lines.push("| Result | Count |");
  lines.push("|---|---|");
  lines.push(`| Removed vars | ${removed.length} |`);
  lines.push(`| Added vars | ${added.length} |`);
  lines.push(`| Semantic value changes | ${changed.length} |`);
  lines.push(`| Format-only changes | ${formatOnlyCount} |`);
  lines.push("");

  if (structuralNotes.length > 0) {
    lines.push("## Structural notes", "");
    for (const note of structuralNotes) {
      lines.push(`- ${note}`);
    }
    lines.push("");
  }

  if (removed.length > 0) {
    lines.push("## Removed vars", "", "| CSS var | Context |", "|---|---|");
    for (const entry of removed) {
      lines.push(`| \`${entry.property}\` | ${entry.context} |`);
    }
    lines.push("");
  }

  if (added.length > 0) {
    lines.push("## Added vars", "", "| CSS var | Context |", "|---|---|");
    for (const entry of added) {
      lines.push(`| \`${entry.property}\` | ${entry.context} |`);
    }
    lines.push("");
  }

  if (changed.length > 0) {
    lines.push("## Semantic value changes", "");
    lines.push("| CSS var | Context | Token | Source | Before | After | ΔE | Raw before | Raw after |");
    lines.push("|---|---|---|---|---|---|---|---|---|");
    for (const change of changed) {
      const tokenId = change.token?.id ?? "?";
      const tokenFile = change.token?.file ?? "?";
      lines.push(
        `| \`${change.property}\` | ${change.context} | \`${tokenId}\` | ${tokenFile} | \`${change.before}\` | \`${change.after}\` | ${formatColorDistance(change.colorDistance)} | \`${change.rawBefore}\` | \`${change.rawAfter}\` |`,
      );
    }
    lines.push("");
  }

  if (formatOnlyExamples.length > 0) {
    lines.push("## Format-only changes (examples)", "");
    lines.push("Same resolved value, different CSS text.", "");
    lines.push("| CSS var | Context | Before | After |", "|---|---|---|---|");
    for (const example of formatOnlyExamples) {
      lines.push(`| \`${example.property}\` | ${example.context} | \`${example.rawBefore}\` | \`${example.rawAfter}\` |`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

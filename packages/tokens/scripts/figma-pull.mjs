#!/usr/bin/env node
/**
 * Read-only pull of local variables from the NYSDS Figma file through the Figma
 * Variables REST API (Enterprise plan). Runs before every `npm run build:packages`
 * (root `tokens:pull`), so tokens and styles build from current Figma data.
 *
 * Needs a personal access token with only the `file_variables:read` scope in
 * FIGMA_TOKEN (repo-root .env). Without one, or if Figma can't be reached, it
 * prints a warning and the build uses the committed figma/variables.json.
 *
 * When the variables changed, it:
 *   1. snapshots the current CSS,
 *   2. stores the API response in figma/variables.json (in a stable order),
 *   3. converts it to DTCG (scripts/figma-to-dtcg.mjs),
 *   4. writes reports/missing-descriptions.md,
 *   5. snapshots the new CSS and writes reports/figma-code-drift.md.
 *
 * Options:
 *   --force   regenerate the reports even when nothing changed
 *
 * FIGMA_FILE_KEY overrides which Figma file is read (default: the figma_token_sync branch).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { convert, FILES, writeTokens } from "./figma-to-dtcg.mjs";
import { variableName } from "./lib/variable-name.mjs";

const PACKAGE_DIRECTORY = join(dirname(FILES.figma), "..");
const REPOSITORY_ROOT = join(PACKAGE_DIRECTORY, "../..");
const LEGACY_DESCRIPTIONS_FILE = join(PACKAGE_DIRECTORY, "reports/legacy-descriptions.json");
const MISSING_DESCRIPTIONS_REPORT = join(PACKAGE_DIRECTORY, "reports/missing-descriptions.md");

// figma_token_sync branch of 💠 NYS Design System (main file: U2QpuSUXRTxbgG64Fzi9bu)
const DEFAULT_FIGMA_FILE_KEY = "xNdGOyHyVVHWlQIyEQEL9t";

const forceReports = process.argv.includes("--force");
const usingCommittedFileMessage = `using committed ${relative(REPOSITORY_ROOT, FILES.figma)}`;

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

const figmaToken = process.env.FIGMA_TOKEN;
if (!figmaToken) {
  console.warn(`figma:pull: FIGMA_TOKEN is not set (repo-root .env) — ${usingCommittedFileMessage}`);
  process.exit(0);
}

const figmaFileKey = process.env.FIGMA_FILE_KEY || DEFAULT_FIGMA_FILE_KEY;
const figmaResponse = await fetchVariables(figmaFileKey);
if (!figmaResponse) {
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Compare with the stored file
// ---------------------------------------------------------------------------

const newFileContents = JSON.stringify(sortForStorage(figmaResponse), null, 2) + "\n";
const storedFileExists = existsSync(FILES.figma);
const variablesChanged = !storedFileExists || readFileSync(FILES.figma, "utf8") !== newFileContents;

if (!variablesChanged && !forceReports) {
  console.log(`figma:pull: ${figmaFileKey} unchanged`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Store, convert, report
// ---------------------------------------------------------------------------

runCSSDiff("snapshot", "pre-pull");

writeFileSync(FILES.figma, newFileContents);
const action = variablesChanged ? "updated" : "re-converted";
console.log(`figma:pull: ${action} ${relative(REPOSITORY_ROOT, FILES.figma)} from ${figmaFileKey}`);

const manualTokens = JSON.parse(readFileSync(FILES.manual, "utf8"));
const conversion = convert(figmaResponse, manualTokens);
writeTokens(conversion);

const { meta } = conversion;
const publishedCount = Object.keys(meta.published).length;
console.log(
  `Converted: ${publishedCount} tokens from Figma, ${meta.manual.length} from tokens.manual.json, ${meta.excluded.length} excluded`,
);
if (meta.unmappedThemeModes.length > 0) {
  console.log(`Theme modes not synced: ${meta.unmappedThemeModes.join(", ")}`);
}
for (const mismatch of meta.mismatches) {
  console.warn(`  ✗ ${mismatch.css}: ${mismatch.reason}`);
}
for (const warning of meta.warnings) {
  console.warn(`  ! ${warning.css}: ${warning.warning}`);
}

mkdirSync(dirname(FILES.meta), { recursive: true });
writeFileSync(FILES.meta, JSON.stringify({ fileKey: figmaFileKey, ...meta }, null, 2) + "\n");

writeMissingDescriptionsReport(figmaFileKey, meta, conversion.tokens);
console.log(`Wrote ${relative(REPOSITORY_ROOT, MISSING_DESCRIPTIONS_REPORT)}`);

runCSSDiff("snapshot", "post-pull");
runCSSDiff("compare", "pre-pull", "post-pull", "--drift");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** The Variables API response, or null (after a warning) if it can't be fetched. */
async function fetchVariables(fileKey) {
  const url = `https://api.figma.com/v1/files/${fileKey}/variables/local`;

  let response;
  try {
    response = await fetch(url, { headers: { "X-Figma-Token": figmaToken } });
  } catch (error) {
    const reason = error.cause?.code ?? error.message;
    console.warn(`figma:pull: could not reach Figma (${reason}) — ${usingCommittedFileMessage}`);
    return null;
  }

  let responseBody;
  try {
    responseBody = await response.json();
  } catch {
    responseBody = {};
  }

  const requestFailed = !response.ok || responseBody.error;
  if (requestFailed) {
    const reason = responseBody.message ?? responseBody.err ?? response.statusText;
    console.warn(`figma:pull: Figma API ${response.status}: ${reason} — ${usingCommittedFileMessage}`);
    if (response.status === 403) {
      console.warn(
        "  Check the token has the file_variables:read scope, the account is a full Enterprise member, and it can view the file.",
      );
    }
    return null;
  }

  return responseBody;
}

/**
 * Figma returns the variable and collection maps, and each collection's
 * variableIds list, in a different order on every call. Sort them so the stored
 * file only changes when the variables do. Values are kept exactly as returned.
 */
function sortForStorage(response) {
  const sortedCollections = sortObjectKeys(response.meta?.variableCollections);
  for (const collection of Object.values(sortedCollections)) {
    if (Array.isArray(collection.variableIds)) {
      collection.variableIds = [...collection.variableIds].sort();
    }
  }

  return {
    ...response,
    meta: {
      ...response.meta,
      variableCollections: sortedCollections,
      variables: sortObjectKeys(response.meta?.variables),
    },
  };
}

function sortObjectKeys(object) {
  const entries = Object.entries(object ?? {});
  entries.sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey));
  return Object.fromEntries(entries);
}

/** Run scripts/css-diff.mjs with the given arguments, showing its output. */
function runCSSDiff(...cssDiffArguments) {
  execFileSync(process.execPath, ["scripts/css-diff.mjs", ...cssDiffArguments], {
    cwd: PACKAGE_DIRECTORY,
    stdio: "inherit",
  });
}

/** Escape text for a Markdown table cell. */
function escapeTableCell(text) {
  return String(text ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ");
}

/** Read a token from a DTCG document by its dot-separated path. */
function getToken(document, path) {
  let node = document;
  for (const segment of path.split(".")) {
    if (node === undefined || node === null) {
      return undefined;
    }
    node = node[segment];
  }
  return node;
}

/**
 * List every published variable that has no description in Figma, grouped by
 * Figma collection, with the description code had before the sync as a suggestion.
 */
function writeMissingDescriptionsReport(fileKey, meta, tokens) {
  // Legacy descriptions are keyed by the old token path; match on the CSS name,
  // which did not change.
  const legacyDescriptionsByCSSName = new Map();
  if (existsSync(LEGACY_DESCRIPTIONS_FILE)) {
    const legacyDescriptions = JSON.parse(readFileSync(LEGACY_DESCRIPTIONS_FILE, "utf8"));
    for (const [oldTokenPath, description] of Object.entries(legacyDescriptions)) {
      legacyDescriptionsByCSSName.set(variableName(oldTokenPath), description);
    }
  }

  const rowsByCollection = new Map();
  let missingCount = 0;
  for (const [cssName, publishedEntry] of Object.entries(meta.published)) {
    if (publishedEntry.described) {
      continue;
    }
    missingCount += 1;

    const [collectionName, figmaVariableName] = publishedEntry.figma.split(" / ");
    if (!rowsByCollection.has(collectionName)) {
      rowsByCollection.set(collectionName, []);
    }
    rowsByCollection.get(collectionName).push({
      cssName,
      figmaVariableName,
      suggestion: legacyDescriptionsByCSSName.get(cssName),
    });
  }

  const totalCount = Object.keys(meta.published).length;
  const describedCount = totalCount - missingCount;

  const lines = [
    "# Missing descriptions",
    "",
    `Generated ${new Date().toISOString()} by \`scripts/figma-pull.mjs\` from Figma file \`${fileKey}\`.`,
    "",
    "Token descriptions come only from Figma variable descriptions. Write these in Figma, then re-run `npm run figma:pull -w packages/tokens`.",
    "The suggestion column is the description code had before the sync (`reports/legacy-descriptions.json`).",
    "",
    `**${missingCount}** of ${totalCount} synced variables have no description (${describedCount} do).`,
    "",
  ];

  const collectionNames = [...rowsByCollection.keys()].sort((first, second) => first.localeCompare(second));
  for (const collectionName of collectionNames) {
    const rows = rowsByCollection.get(collectionName);
    lines.push(`## ${collectionName} (${rows.length})`);
    lines.push("");
    lines.push("| Figma variable | CSS var | Suggested description |");
    lines.push("|---|---|---|");
    for (const row of rows) {
      lines.push(`| \`${row.figmaVariableName}\` | \`${row.cssName}\` | ${escapeTableCell(row.suggestion)} |`);
    }
    lines.push("");
  }

  if (meta.manual.length > 0) {
    lines.push(`## Manual tokens (${meta.manual.length})`);
    lines.push("");
    lines.push("No Figma variable yet, so their description stays in `src/tokens.manual.json`.");
    lines.push("");
    lines.push("| CSS var | Token | Current description |");
    lines.push("|---|---|---|");
    for (const manualEntry of meta.manual) {
      const currentDescription = getToken(tokens, manualEntry.path)?.$description;
      lines.push(`| \`${manualEntry.css}\` | \`${manualEntry.path}\` | ${escapeTableCell(currentDescription)} |`);
    }
    lines.push("");
  }

  writeFileSync(MISSING_DESCRIPTIONS_REPORT, lines.join("\n"));
}

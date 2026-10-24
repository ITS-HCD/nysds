#!/usr/bin/env node
/**
 * Read-only pull of local variables from the NYSDS Figma file via the Figma
 * Variables REST API (Enterprise). Runs before every `npm run build:packages`
 * (root `tokens:pull`), so tokens and styles build from current Figma data.
 *
 * Needs a personal access token with only the `file_variables:read` scope in
 * FIGMA_TOKEN (repo-root .env). Without one, or if Figma can't be reached, it
 * warns and the build uses the committed figma/variables.json.
 *
 * When the variables changed, it stores the API response (in a stable order) in
 * figma/variables.json (the source of truth), converts it to DTCG, and writes
 * reports/figma-code-drift.md (CSS before/after) and reports/missing-descriptions.md.
 * `--force` regenerates the reports even when nothing changed.
 *
 * FIGMA_FILE_KEY overrides the file (default: the figma_token_sync branch).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { convert, FILES, writeTokens } from "./figma-to-dtcg.mjs";
import { variableName } from "./lib/variable-name.mjs";

const PKG = join(dirname(FILES.figma), "..");
const ROOT = join(PKG, "../..");
const LEGACY = join(PKG, "reports/legacy-descriptions.json");
const MISSING = join(PKG, "reports/missing-descriptions.md");

// figma_token_sync branch of 💠 NYS Design System (main file: U2QpuSUXRTxbgG64Fzi9bu)
const DEFAULT_FILE_KEY = "xNdGOyHyVVHWlQIyEQEL9t";

const force = process.argv.includes("--force");
const committed = () => `using committed ${relative(ROOT, FILES.figma)}`;

const token = process.env.FIGMA_TOKEN;
if (!token) {
  console.warn(`figma:pull: FIGMA_TOKEN is not set (repo-root .env) — ${committed()}`);
  process.exit(0);
}
const fileKey = process.env.FIGMA_FILE_KEY || DEFAULT_FILE_KEY;
const body = await fetchVariables(fileKey);
if (!body) process.exit(0);

// Figma returns the id-keyed maps and each collection's variableIds in a different
// order on each call; sort them so the stored file only changes when the variables
// do. Values are kept as returned.
const sortKeys = (map) => Object.fromEntries(Object.entries(map ?? {}).sort(([x], [y]) => x.localeCompare(y)));
const collections = sortKeys(body.meta?.variableCollections);
for (const c of Object.values(collections)) if (Array.isArray(c.variableIds)) c.variableIds = [...c.variableIds].sort();
const stored = { ...body, meta: { ...body.meta, variableCollections: collections, variables: sortKeys(body.meta?.variables) } };
const next = JSON.stringify(stored, null, 2) + "\n";
const changed = !existsSync(FILES.figma) || readFileSync(FILES.figma, "utf8") !== next;
if (!changed && !force) {
  console.log(`figma:pull: ${fileKey} unchanged`);
  process.exit(0);
}

// CSS before/after for the drift report
const cssDiff = (...args) => execFileSync(process.execPath, ["scripts/css-diff.mjs", ...args], { cwd: PKG, stdio: "inherit" });
cssDiff("snapshot", "pre-pull");

writeFileSync(FILES.figma, next);
console.log(`figma:pull: ${changed ? "updated" : "re-converted"} ${relative(ROOT, FILES.figma)} from ${fileKey}`);

const result = convert(body, JSON.parse(readFileSync(FILES.manual, "utf8")));
writeTokens(result);
const { meta } = result;
console.log(
  `Converted: ${Object.keys(meta.published).length} tokens from Figma, ${meta.manual.length} from tokens.manual.json, ${meta.excluded.length} excluded`,
);
if (meta.unmappedThemeModes.length) console.log(`Theme modes not synced: ${meta.unmappedThemeModes.join(", ")}`);
for (const m of meta.mismatches) console.warn(`  ✗ ${m.css}: ${m.reason}`);
for (const w of meta.warnings) console.warn(`  ! ${w.css}: ${w.warning}`);

mkdirSync(dirname(FILES.meta), { recursive: true });
writeFileSync(FILES.meta, JSON.stringify({ fileKey, ...meta }, null, 2) + "\n");
writeMissingDescriptions(fileKey, meta, result.tokens);
console.log(`Wrote ${relative(ROOT, MISSING)}`);

cssDiff("snapshot", "post-pull");
cssDiff("compare", "pre-pull", "post-pull", "--drift");

/** The Variables API response, or null (after a warning) if it can't be fetched. */
async function fetchVariables(fileKey) {
  let res;
  try {
    res = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
      headers: { "X-Figma-Token": token },
    });
  } catch (error) {
    console.warn(`figma:pull: could not reach Figma (${error.cause?.code ?? error.message}) — ${committed()}`);
    return null;
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) {
    console.warn(`figma:pull: Figma API ${res.status}: ${body.message ?? body.err ?? res.statusText} — ${committed()}`);
    if (res.status === 403) {
      console.warn("  Check the token has the file_variables:read scope, the account is a full Enterprise member, and it can view the file.");
    }
    return null;
  }
  return body;
}

function writeMissingDescriptions(fileKey, meta, tokens) {
  const legacy = existsSync(LEGACY) ? JSON.parse(readFileSync(LEGACY, "utf8")) : {};
  // keyed by the pre-sync token path; match on the CSS name, which did not change
  const legacyByCSS = new Map(Object.entries(legacy).map(([path, text]) => [variableName(path), text]));
  const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  const groups = new Map();
  const missing = Object.entries(meta.published).filter(([, p]) => !p.described);
  for (const [css, p] of missing) {
    const collection = p.figma.split(" / ")[0];
    if (!groups.has(collection)) groups.set(collection, []);
    groups.get(collection).push({ css, figma: p.figma.split(" / ")[1], suggestion: legacyByCSS.get(css) });
  }
  const total = Object.keys(meta.published).length;
  const md = [
    "# Missing descriptions",
    "",
    `Generated ${new Date().toISOString()} by \`scripts/figma-pull.mjs\` from Figma file \`${fileKey}\`.`,
    "",
    "Token descriptions come only from Figma variable descriptions. Write these in Figma, then re-run `npm run figma:pull -w packages/tokens`.",
    "The suggestion column is the description code had before the sync (`reports/legacy-descriptions.json`).",
    "",
    `**${missing.length}** of ${total} synced variables have no description (${total - missing.length} do).`,
    "",
  ];
  for (const [collection, rows] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    md.push(`## ${collection} (${rows.length})`, "", "| Figma variable | CSS var | Suggested description |", "|---|---|---|");
    for (const r of rows) md.push(`| \`${r.figma}\` | \`${r.css}\` | ${esc(r.suggestion)} |`);
    md.push("");
  }
  if (meta.manual.length) {
    md.push(
      `## Manual tokens (${meta.manual.length})`,
      "",
      "No Figma variable yet, so their description stays in `src/tokens.manual.json`.",
      "",
      "| CSS var | Token | Current description |",
      "|---|---|---|",
    );
    for (const m of meta.manual) md.push(`| \`${m.css}\` | \`${m.path}\` | ${esc(getToken(tokens, m.path)?.$description)} |`);
    md.push("");
  }
  writeFileSync(MISSING, md.join("\n"));
}

function getToken(doc, path) {
  return path.split(".").reduce((node, key) => node?.[key], doc);
}

#!/usr/bin/env node
/**
 * Read-only pull of local variables from the NYSDS Figma file via the Figma
 * Variables REST API (Enterprise). Needs a personal access token with only the
 * `file_variables:read` scope in FIGMA_TOKEN (repo-root .env).
 *
 *   node --env-file=../../.env scripts/figma-pull.mjs            # fetch, transform, write
 *   node --env-file=../../.env scripts/figma-pull.mjs --inspect  # fetch and summarize only
 *   node scripts/figma-pull.mjs --offline                        # reuse figma/variables.raw.json
 *
 * FIGMA_FILE_KEY overrides the file (default: the figma_token_sync branch).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const PKG = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = join(PKG, "../..");
const RAW = join(PKG, "figma/variables.raw.json");

// figma_token_sync branch of 💠 NYS Design System (main file: U2QpuSUXRTxbgG64Fzi9bu)
const DEFAULT_FILE_KEY = "xNdGOyHyVVHWlQIyEQEL9t";

const args = process.argv.slice(2);
const inspect = args.includes("--inspect");
const offline = args.includes("--offline");

const raw = offline ? JSON.parse(readFileSync(RAW, "utf8")) : await fetchVariables();
if (inspect) {
  printInspect(raw);
} else {
  const { run } = await import("./lib/figma-sync.mjs");
  await run(raw);
}

async function fetchVariables() {
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    console.error("FIGMA_TOKEN is not set. Add it to the repo-root .env and run with --env-file=../../.env");
    process.exit(1);
  }
  const fileKey = process.env.FIGMA_FILE_KEY || DEFAULT_FILE_KEY;
  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
    headers: { "X-Figma-Token": token },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) {
    console.error(`Figma API ${res.status}: ${body.message ?? body.err ?? res.statusText}`);
    if (res.status === 403) {
      console.error("Check the token has the file_variables:read scope, the account is a full Enterprise member, and it can view the file.");
    }
    process.exit(1);
  }
  mkdirSync(dirname(RAW), { recursive: true });
  writeFileSync(RAW, JSON.stringify({ fileKey, fetched: new Date().toISOString(), ...body }, null, 2) + "\n");
  console.log(`Fetched ${fileKey} → ${relative(ROOT, RAW)}`);
  return JSON.parse(readFileSync(RAW, "utf8"));
}

function printInspect(raw) {
  const { variables, variableCollections } = raw.meta;
  const vars = Object.values(variables);
  for (const c of Object.values(variableCollections).sort((a, b) => a.name.localeCompare(b.name))) {
    const own = vars.filter((v) => v.variableCollectionId === c.id);
    const defaultMode = c.modes.find((m) => m.modeId === c.defaultModeId)?.name;
    console.log(`\n■ ${c.name}${c.remote ? " (remote)" : ""}${c.hiddenFromPublishing ? " (hidden)" : ""}`);
    console.log(`  modes: ${c.modes.map((m) => m.name).join(", ")}  (default: ${defaultMode})`);
    console.log(`  variables: ${own.length}`);
    const types = count(own.map((v) => v.resolvedType));
    console.log(`  types: ${Object.entries(types).map(([k, n]) => `${k} ${n}`).join(", ")}`);
    const scopes = count(own.flatMap((v) => v.scopes ?? []));
    console.log(`  scopes: ${Object.entries(scopes).map(([k, n]) => `${k} ${n}`).join(", ") || "—"}`);
    const aliases = own.filter((v) => Object.values(v.valuesByMode).some((x) => x?.type === "VARIABLE_ALIAS")).length;
    const described = own.filter((v) => v.description?.trim()).length;
    console.log(`  aliases: ${aliases}   with description: ${described}`);
    const groups = count(own.map((v) => v.name.split("/").slice(0, 2).join("/")));
    console.log(`  groups: ${Object.entries(groups).map(([k, n]) => `${k} (${n})`).join(", ")}`);
    console.log(`  samples:`);
    for (const v of own.slice(0, 4)) {
      const val = v.valuesByMode[c.defaultModeId];
      console.log(`    ${v.name}  [${v.resolvedType}]  ${formatSample(val, variables)}`);
    }
  }
}

function count(list) {
  const out = {};
  for (const x of list) out[x] = (out[x] ?? 0) + 1;
  return out;
}

function formatSample(val, variables) {
  if (val?.type === "VARIABLE_ALIAS") return `→ ${variables[val.id]?.name ?? `(remote ${val.id})`}`;
  if (val && typeof val === "object" && "r" in val) {
    const h = (n) => Math.round(n * 255).toString(16).padStart(2, "0");
    return `#${h(val.r)}${h(val.g)}${h(val.b)}${val.a < 1 ? h(val.a) : ""}`;
  }
  return JSON.stringify(val);
}

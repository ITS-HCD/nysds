/**
 * Figma variables → DTCG tokens. Figma is the source of truth for every token
 * whose CSS name matches a Figma variable; tokens without one keep their code
 * value. Writes src/tokens.json, src/themes/*.json, reports/missing-descriptions.md
 * and figma/sync-meta.json (read by `css-diff.mjs compare … --drift`).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import config from "../../figma.config.mjs";
import { colorObject } from "../codemod-object-format.mjs";
import { formatJSON } from "./format-json.mjs";
import { variableName } from "./variable-name.mjs";

const PKG = join(dirname(fileURLToPath(import.meta.url)), "../..");
const ROOT = join(PKG, "../..");
const SRC = join(PKG, "src");
const THEMES = join(SRC, "themes");
const META = join(PKG, "figma/sync-meta.json");
const LEGACY = join(PKG, "reports/legacy-descriptions.json");
const MISSING = join(PKG, "reports/missing-descriptions.md");

const readJSON = (file) => JSON.parse(readFileSync(file, "utf8"));

// ---------------------------------------------------------------- naming

/** Figma variable name → CSS custom property, or null if its collection isn't mapped. */
export function figmaCSSName(collectionName, variableName_) {
  const rule = config.collections[collectionName];
  if (!rule) return null;
  const parts = variableName_
    .split("/")
    .slice(1) // first segment is the collection's own folder (e.g. "p-color-unpublished", "!-nys")
    .map((s) =>
      s
        .trim()
        .replace(/^[@#%&*!]-/, "") // sort-order prefixes ("@-font-lineheight")
        .replace(/-[@#%&*]$/, "") // sort-order suffixes ("color-@")
        .toLowerCase()
        .replace(/\s+/g, "-"),
    );
  return `--nys-${[rule.prefix, ...parts].filter(Boolean).join("-")}`;
}

// ---------------------------------------------------------------- code index

/** cssName → { id, type, node } for every token in a DTCG document. */
function indexTokens(doc) {
  const index = new Map();
  const walk = (node, path, type) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return;
    const t = node.$type ?? type;
    if ("$value" in node) {
      index.set(variableName(path.join(".")), { id: path.join("."), type: t, node });
      return;
    }
    for (const [k, v] of Object.entries(node)) if (!k.startsWith("$")) walk(v, [...path, k], t);
  };
  walk(doc, [], undefined);
  return index;
}

// ---------------------------------------------------------------- figma model

function figmaModel(raw) {
  const { variables, variableCollections } = raw.meta;
  const byCSS = new Map(); // cssName → variable (highest-priority collection wins)
  for (const c of Object.values(variableCollections)) {
    if (c.remote || !config.collections[c.name]) continue;
    for (const id of c.variableIds) {
      const v = variables[id];
      if (!v) continue;
      const css = figmaCSSName(c.name, v.name);
      const current = byCSS.get(css);
      const prio = config.collections[c.name].priority ?? 0;
      if (!current || prio > (config.collections[variableCollections[current.variableCollectionId].name].priority ?? 0)) {
        byCSS.set(css, v);
      }
    }
  }
  const cssOf = (v) => figmaCSSName(variableCollections[v.variableCollectionId]?.name, v.name);
  return { variables, collections: variableCollections, byCSS, cssOf };
}

/** Mode id for a collection given the mode overrides in `ctx` ({ collectionName: modeName }). */
function modeFor(collection, ctx) {
  const want = ctx[collection.name] ?? config.modes[collection.name];
  return (collection.modes.find((m) => m.name === want) ?? collection.modes.find((m) => m.modeId === collection.defaultModeId)).modeId;
}

/**
 * Follow a variable's alias chain. Stops at the first variable that is itself
 * emitted as a token (→ alias), otherwise returns the raw value.
 */
function resolveVar(model, v, ctx, emitted, selfCSS, depth = 0) {
  const collection = model.collections[v.variableCollectionId];
  const value = v.valuesByMode[modeFor(collection, ctx)];
  if (value?.type !== "VARIABLE_ALIAS") return { raw: value, figmaType: v.resolvedType, chain: [v.name] };
  const target = model.variables[value.id];
  if (!target) return { error: `aliases a remote/library variable (${value.id})`, chain: [v.name] };
  if (depth > 25) return { error: "alias chain too deep", chain: [v.name] };
  const targetCSS = model.cssOf(target);
  if (targetCSS && targetCSS !== selfCSS && emitted.has(targetCSS)) {
    return { alias: targetCSS, chain: [v.name, target.name] };
  }
  const next = resolveVar(model, target, ctx, emitted, selfCSS, depth + 1);
  return { ...next, chain: [v.name, ...next.chain] };
}

// ---------------------------------------------------------------- values

const byte = (n) => Math.round(Math.min(1, Math.max(0, n)) * 255).toString(16).padStart(2, "0");
export const figmaHex = ({ r, g, b, a = 1 }) => `#${byte(r)}${byte(g)}${byte(b)}${a < 1 ? byte(a) : ""}`;

export function figmaDimension(px, cssName) {
  if (config.pxDimensions.some((re) => re.test(cssName))) return { value: px, unit: "px" };
  return { value: Number((px / config.remBase).toFixed(4)), unit: "rem" };
}

const weightKey = (s) => String(s).toLowerCase().replace(/[\s_-]+/g, "");

/** Figma value → DTCG $value for a token of `type`. Returns { value } or { error }. */
export function toDTCG(type, figmaType, raw, cssName) {
  switch (type) {
    case "color":
      if (figmaType === "COLOR") return { value: colorObject(figmaHex(raw)) };
      break;
    case "dimension":
      if (figmaType === "FLOAT") return { value: figmaDimension(raw, cssName) };
      break;
    case "fontFamily":
      if (figmaType === "STRING") {
        const fallbacks = config.fontFallbacks[raw];
        return fallbacks ? { value: [raw, ...fallbacks] } : { value: [raw], warning: `no fallback stack for "${raw}"` };
      }
      break;
    case "fontWeight":
      if (figmaType === "FLOAT") return { value: raw };
      if (figmaType === "STRING") {
        const w = config.fontWeights[weightKey(raw)];
        if (w) return { value: w };
        return { error: `font style "${raw}" is not a weight` };
      }
      break;
    case "number":
      if (figmaType === "FLOAT") return { value: raw };
      break;
    case "string":
      if (figmaType === "STRING") return { value: raw };
      break;
  }
  return { error: `Figma ${figmaType} can't become a ${type} token` };
}

/** CSS string for a Figma-only variable (for the drift report). */
function figmaCSSValue(figmaType, raw, cssName) {
  if (figmaType === "COLOR") return figmaHex(raw);
  if (figmaType === "FLOAT") {
    const d = figmaDimension(raw, cssName);
    return `${d.value}${d.unit}`;
  }
  return String(raw);
}

// ---------------------------------------------------------------- run

export async function run(raw) {
  const tokensFile = join(SRC, "tokens.json");
  const tokens = readJSON(tokensFile);
  const themeFiles = Object.fromEntries(
    existsSync(THEMES)
      ? readdirSync(THEMES).filter((f) => f.endsWith(".json")).map((f) => [f.replace(/\.json$/, ""), readJSON(join(THEMES, f))])
      : [],
  );

  archiveLegacyDescriptions(tokens);

  const code = indexTokens(tokens);
  const model = figmaModel(raw);

  // Which CSS names get Figma values
  const matched = [...code.keys()].filter((css) => model.byCSS.has(css));
  const added = Object.keys(config.add).filter((css) => model.byCSS.has(css) && !code.has(css));
  const emitted = new Set([...matched, ...added]);
  const pathOf = (css) => code.get(css)?.id ?? config.add[css];

  const meta = {
    fileKey: raw.fileKey,
    fetched: raw.fetched,
    matched: {},
    codeOnly: [],
    figmaOnly: [],
    mismatches: [],
    warnings: [],
    breakpointVariance: [],
    unmappedThemeModes: [],
  };

  const themeCollection = Object.values(model.collections).find((c) => c.name === "Theme" && !c.remote);
  if (themeCollection) {
    const mapped = new Set([config.modes.Theme, ...Object.values(config.themes)]);
    meta.unmappedThemeModes = themeCollection.modes.map((m) => m.name).filter((n) => !mapped.has(n));
  }
  const responsive = Object.values(model.collections).find((c) => c.name === "Responsive" && !c.remote);

  const valueFor = (css, v, ctx) => {
    const r = resolveVar(model, v, ctx, emitted, css);
    if (r.error) return { error: r.error, chain: r.chain };
    if (r.alias) return { value: `{${pathOf(r.alias)}}`, chain: r.chain };
    const type = code.get(css)?.type ?? typeFromFigma(v.resolvedType);
    return { ...toDTCG(type, r.figmaType, r.raw, css), chain: r.chain };
  };

  const themeSets = Object.fromEntries(Object.keys(config.themes).map((t) => [t, {}]));
  let updated = 0;

  for (const css of emitted) {
    const v = model.byCSS.get(css);
    const collection = model.collections[v.variableCollectionId].name;
    meta.matched[css] = { figma: `${collection} / ${v.name}`, path: pathOf(css) };

    const base = valueFor(css, v, {});
    if (base.error) {
      meta.mismatches.push({ css, figma: v.name, reason: base.error, chain: base.chain });
      continue; // keep the code value
    }
    if (base.warning) meta.warnings.push({ css, figma: v.name, warning: base.warning });

    let node = code.get(css)?.node;
    if (!node) node = insertToken(tokens, pathOf(css), typeFromFigma(v.resolvedType));
    node.$value = base.value;
    if (v.description?.trim()) node.$description = v.description.trim();
    else delete node.$description;
    updated++;

    // Agency theme overrides: whatever resolves differently under that Theme mode
    for (const [theme, mode] of Object.entries(config.themes)) {
      const tv = valueFor(css, v, { Theme: mode });
      if (!tv.error && JSON.stringify(tv.value) !== JSON.stringify(base.value)) themeSets[theme][css] = tv.value;
    }

    if (responsive) {
      const per = responsive.modes.map((m) => [m.name, JSON.stringify(valueFor(css, v, { Responsive: m.name }).value)]);
      if (new Set(per.map(([, x]) => x)).size > 1) {
        meta.breakpointVariance.push({ css, values: Object.fromEntries(per.map(([n, x]) => [n, JSON.parse(x ?? "null")])) });
      }
    }
  }

  for (const [css, t] of code) {
    if (!emitted.has(css)) meta.codeOnly.push({ css, path: t.id });
  }
  for (const [css, v] of model.byCSS) {
    if (emitted.has(css)) continue;
    const r = resolveVar(model, v, {}, new Set(), css);
    meta.figmaOnly.push({
      css,
      figma: `${model.collections[v.variableCollectionId].name} / ${v.name}`,
      type: v.resolvedType,
      value: r.error ? `(${r.error})` : figmaCSSValue(r.figmaType, r.raw, css),
    });
  }

  // Write tokens + theme sets
  writeFileSync(tokensFile, formatJSON(tokens));
  mkdirSync(THEMES, { recursive: true });
  for (const [theme, overrides] of Object.entries(themeSets)) {
    const doc = {};
    for (const [css, value] of Object.entries(overrides)) {
      insertToken(doc, pathOf(css), code.get(css)?.type ?? "color").$value = value;
    }
    writeFileSync(join(THEMES, `${theme}.json`), formatJSON(doc));
  }

  mkdirSync(dirname(META), { recursive: true });
  writeFileSync(META, JSON.stringify(meta, null, 2) + "\n");
  writeMissingDescriptions(tokens, code, meta, model);

  const rel = (p) => relative(ROOT, p);
  console.log(`Figma ${raw.fileKey} (fetched ${raw.fetched})`);
  console.log(`  tokens from Figma:      ${updated}`);
  console.log(`  kept (no Figma var):    ${meta.codeOnly.length}`);
  console.log(`  Figma-only (reported):  ${meta.figmaOnly.length}`);
  console.log(`  mismatches (kept code): ${meta.mismatches.length}`);
  console.log(`  theme overrides:        ${Object.entries(themeSets).map(([t, o]) => `${t} ${Object.keys(o).length}`).join(", ")}`);
  if (meta.unmappedThemeModes.length) console.log(`  theme modes not synced: ${meta.unmappedThemeModes.join(", ")}`);
  for (const w of meta.warnings) console.log(`  warning: ${w.css}: ${w.warning}`);
  console.log(`\nWrote ${rel(tokensFile)}, ${rel(THEMES)}/*.json, ${rel(MISSING)}, ${rel(META)}`);
}

function typeFromFigma(resolvedType) {
  return { COLOR: "color", FLOAT: "dimension", STRING: "string" }[resolvedType] ?? "string";
}

/** Create (or find) the token node at a dot path, setting $type on new tokens. */
function insertToken(doc, path, type) {
  let node = doc;
  const parts = path.split(".");
  for (const p of parts.slice(0, -1)) node = node[p] ??= {};
  const leaf = parts.at(-1);
  if (!node[leaf]) node[leaf] = { $type: type, $value: null };
  return node[leaf];
}

// ---------------------------------------------------------------- descriptions

/** One-time: keep the hand-written descriptions before Figma becomes their source. */
function archiveLegacyDescriptions(tokens) {
  if (existsSync(LEGACY)) return;
  const out = {};
  const walk = (node, path) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return;
    if ("$value" in node) {
      if (node.$description) out[path.join(".")] = node.$description;
      return;
    }
    for (const [k, v] of Object.entries(node)) if (!k.startsWith("$")) walk(v, [...path, k]);
  };
  walk(tokens, []);
  mkdirSync(dirname(LEGACY), { recursive: true });
  writeFileSync(LEGACY, JSON.stringify(out, null, 2) + "\n");
  console.log(`Archived ${Object.keys(out).length} legacy descriptions → ${relative(ROOT, LEGACY)}`);
}

function writeMissingDescriptions(tokens, code, meta, model) {
  const legacy = existsSync(LEGACY) ? readJSON(LEGACY) : {};
  const groups = new Map();
  let missing = 0;
  for (const [css, m] of Object.entries(meta.matched)) {
    const v = model.byCSS.get(css);
    if (v.description?.trim()) continue;
    missing++;
    const coll = model.collections[v.variableCollectionId].name;
    if (!groups.has(coll)) groups.set(coll, []);
    groups.get(coll).push({ css, figma: v.name, suggestion: legacy[m.path] });
  }
  const described = Object.keys(meta.matched).length - missing;

  const md = [
    "# Missing descriptions",
    "",
    `Generated ${new Date().toISOString()} by \`scripts/figma-pull.mjs\` from Figma file \`${meta.fileKey}\`.`,
    "",
    "Token descriptions come only from Figma variable descriptions. Write these in Figma, then re-run `npm run figma:pull -w packages/tokens`.",
    "The suggestion column is the description code had before the sync (`reports/legacy-descriptions.json`).",
    "",
    `**${missing}** of ${Object.keys(meta.matched).length} synced variables have no description (${described} do).`,
    "",
  ];
  for (const [coll, rows] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    md.push(`## ${coll} (${rows.length})`, "", "| Figma variable | CSS var | Suggested description |", "|---|---|---|");
    for (const r of rows) md.push(`| \`${r.figma}\` | \`${r.css}\` | ${r.suggestion ? r.suggestion.replace(/\|/g, "\\|") : ""} |`);
    md.push("");
  }
  if (meta.codeOnly.length) {
    md.push(
      `## Code-only tokens (${meta.codeOnly.length})`,
      "",
      "These have no Figma variable, so their description stays in `src/tokens.json` until the variable exists in Figma.",
      "",
      "| CSS var | Token | Current description |",
      "|---|---|---|",
    );
    for (const c of meta.codeOnly) {
      md.push(`| \`${c.css}\` | \`${c.path}\` | ${(code.get(c.css)?.node.$description ?? "").replace(/\|/g, "\\|")} |`);
    }
    md.push("");
  }
  mkdirSync(dirname(MISSING), { recursive: true });
  writeFileSync(MISSING, md.join("\n"));
}

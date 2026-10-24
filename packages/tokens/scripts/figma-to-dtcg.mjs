#!/usr/bin/env node
/**
 * Convert the Figma Variables API response (figma/variables.json, stored exactly
 * as returned) to DTCG tokens for Terrazzo:
 *
 *   figma/variables.json + src/tokens.manual.json  →  src/tokens.json + src/themes/*.json
 *
 * Rules (collections, modes, units, exclusions) live in figma.config.mjs.
 * src/tokens.manual.json holds the few tokens Figma has no variable for
 * (shadows, gutters, …); Figma wins if both define the same CSS name.
 *
 *   node scripts/figma-to-dtcg.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import config from "../figma.config.mjs";
import { variableName } from "./lib/variable-name.mjs";

const PKG = join(dirname(fileURLToPath(import.meta.url)), "..");
export const FILES = {
  figma: join(PKG, "figma/variables.json"),
  manual: join(PKG, "src/tokens.manual.json"),
  tokens: join(PKG, "src/tokens.json"),
  themes: join(PKG, "src/themes"),
  /** What the last pull published/excluded, for the drift report (gitignored). */
  meta: join(PKG, ".snapshots/figma-meta.json"),
};

const SCHEMA = "https://www.designtokens.org/schemas/2025.10/format.json";

// ---------------------------------------------------------------- naming

/** Normalized name parts after the collection's folder ("p-color-unpublished", "!-nys"). */
function nameParts(name) {
  return name
    .split("/")
    .slice(1)
    .map((s) =>
      s
        .trim()
        .replace(/^[@#%&*!]-/, "") // sort-order prefixes ("@-font-lineheight")
        .replace(/-[@#%&*]$/, "") // sort-order suffixes ("color-@")
        .toLowerCase()
        .replace(/\s+/g, "-"),
    );
}

/** Figma variable → CSS custom property, or null if its collection isn't mapped. */
export function figmaCSSName(collectionName, name) {
  const rule = config.collections[collectionName];
  if (!rule) return null;
  return `--nys-${[rule.prefix, ...nameParts(name)].filter(Boolean).join("-")}`;
}

/** Figma variable → DTCG token path ("primitive.color.blue.600", "font.size.md"). */
export function figmaTokenPath(collectionName, name) {
  const rule = config.collections[collectionName];
  const [first = "", ...rest] = nameParts(name);
  const split = config.splitPrefixes.find((p) => first.startsWith(`${p}-`));
  const head = split ? [split, first.slice(split.length + 1)] : [first];
  return [rule.layer, rule.prefix, ...head, ...rest].filter(Boolean).join(".");
}

// ---------------------------------------------------------------- values

const byte = (n) => Math.round(Math.min(1, Math.max(0, n)) * 255);
const hexByte = (n) => byte(n).toString(16).padStart(2, "0");
export const figmaHex = ({ r, g, b, a = 1 }) => `#${hexByte(r)}${hexByte(g)}${hexByte(b)}${a < 1 ? hexByte(a) : ""}`;

/** Figma RGBA → DTCG color (8-bit precision, alpha separate from the 6-digit hex). */
export function figmaColor({ r, g, b, a = 1 }) {
  const unit = (n) => Number((byte(n) / 255).toFixed(4));
  const color = { colorSpace: "srgb", components: [unit(r), unit(g), unit(b)] };
  if (byte(a) < 255) color.alpha = unit(a);
  color.hex = figmaHex({ r, g, b });
  return color;
}

export function figmaDimension(px, cssName) {
  if (config.pxDimensions.some((re) => re.test(cssName))) return { value: px, unit: "px" };
  return { value: Number((px / config.remBase).toFixed(4)), unit: "rem" };
}

export function tokenType(resolvedType, cssName) {
  if (resolvedType === "COLOR") return "color";
  const rule = config.types.find(([re]) => re.test(cssName));
  if (rule) return rule[1];
  return resolvedType === "FLOAT" ? "dimension" : "string";
}

const weightKey = (s) => String(s).toLowerCase().replace(/[\s_-]+/g, "");

/** Raw Figma value → DTCG $value for a token of `type`: { value } or { error }. */
export function toDTCG(type, figmaType, raw, cssName) {
  switch (type) {
    case "color":
      if (figmaType === "COLOR") return { value: figmaColor(raw) };
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
      if (figmaType === "STRING" && config.fontWeights[weightKey(raw)]) return { value: config.fontWeights[weightKey(raw)] };
      if (figmaType === "STRING") return { error: `font style "${raw}" is not a weight` };
      break;
    case "string":
      if (figmaType === "STRING") return { value: raw };
      break;
  }
  return { error: `Figma ${figmaType} can't become a ${type} token` };
}

/** CSS string for an unpublished variable's value (drift report). */
function cssValue(figmaType, raw, cssName) {
  if (figmaType === "COLOR") return figmaHex(raw);
  if (figmaType === "FLOAT") {
    const d = figmaDimension(raw, cssName);
    return `${d.value}${d.unit}`;
  }
  return String(raw);
}

// ---------------------------------------------------------------- figma model

function modeFor(collection, ctx) {
  const want = ctx[collection.name] ?? config.modes[collection.name];
  return (collection.modes.find((m) => m.name === want) ?? collection.modes.find((m) => m.modeId === collection.defaultModeId)).modeId;
}

/**
 * Follow a variable's alias chain. Stops at the first published variable with a
 * different CSS name (→ alias); otherwise returns the raw value.
 */
function resolve(model, v, ctx, selfCSS, depth = 0) {
  const value = v.valuesByMode[modeFor(model.collections[v.variableCollectionId], ctx)];
  if (value?.type !== "VARIABLE_ALIAS") return { raw: value, figmaType: v.resolvedType, chain: [v.name] };
  const target = model.variables[value.id];
  if (!target) return { error: `aliases a remote/library variable (${value.id})`, chain: [v.name] };
  if (depth > 25) return { error: "alias chain too deep", chain: [v.name] };
  const targetCSS = model.cssOf(target);
  if (targetCSS && targetCSS !== selfCSS && model.published.has(targetCSS)) {
    return { alias: model.published.get(targetCSS).path, chain: [v.name, target.name] };
  }
  const next = resolve(model, target, ctx, selfCSS, depth + 1);
  return { ...next, chain: [v.name, ...next.chain] };
}

function buildModel(response) {
  const { variables, variableCollections: collections } = response.meta;
  const cssOf = (v) => figmaCSSName(collections[v.variableCollectionId]?.name, v.name);
  const priority = (v) => config.collections[collections[v.variableCollectionId].name].priority ?? 0;

  // CSS name → every local variable that maps to it
  const candidates = new Map();
  for (const c of Object.values(collections)) {
    if (c.remote || !config.collections[c.name]) continue;
    for (const id of c.variableIds) {
      const v = variables[id];
      if (!v) continue;
      const css = cssOf(v);
      if (!candidates.has(css)) candidates.set(css, []);
      candidates.get(css).push(v);
    }
  }

  const published = new Map(); // css → { value: variable, path }
  const excluded = new Map(); // css → variable
  for (const [css, vars] of candidates) {
    const sorted = [...vars].sort((a, b) => priority(b) - priority(a));
    const valueVar = sorted[0];
    if (config.exclude.some((re) => re.test(css))) {
      excluded.set(css, valueVar);
      continue;
    }
    const pathVar = sorted.at(-1);
    const path = figmaTokenPath(collections[pathVar.variableCollectionId].name, pathVar.name);
    const description = sorted.map((v) => v.description?.trim()).find(Boolean);
    published.set(css, { variable: valueVar, path, description });
  }
  return { variables, collections, cssOf, published, excluded };
}

// ---------------------------------------------------------------- convert

/**
 * @returns {{ tokens: object, themes: Record<string, object>, meta: object }}
 *   meta lists what the drift report needs (published, manual, excluded, mismatches).
 */
export function convert(response, manual = {}) {
  const model = buildModel(response);
  const tokens = { $schema: SCHEMA };
  const themes = Object.fromEntries(Object.keys(config.themes).map((t) => [t, {}]));
  const meta = { published: {}, manual: [], excluded: [], mismatches: [], warnings: [], breakpointVariance: [], unmappedThemeModes: [] };

  const themeCollection = Object.values(model.collections).find((c) => c.name === "Theme" && !c.remote);
  if (themeCollection) {
    const mapped = new Set([config.modes.Theme, ...Object.values(config.themes)]);
    meta.unmappedThemeModes = themeCollection.modes.map((m) => m.name).filter((n) => !mapped.has(n));
  }
  const responsive = Object.values(model.collections).find((c) => c.name === "Responsive" && !c.remote);

  const valueOf = (css, v, ctx) => {
    const r = resolve(model, v, ctx, css);
    if (r.error) return r;
    if (r.alias) return { value: `{${r.alias}}`, chain: r.chain };
    return { ...toDTCG(tokenType(v.resolvedType, css), r.figmaType, r.raw, css), chain: r.chain };
  };

  // Path order (numeric-aware: neutral.10, .50, .100), independent of Figma's ordering
  const byPath = (a, b) => a.localeCompare(b, "en", { numeric: true });
  const published = [...model.published].sort(([, a], [, b]) => byPath(a.path, b.path));
  for (const [css, { variable: v, path, description }] of published) {
    const collection = model.collections[v.variableCollectionId].name;
    meta.published[css] = { figma: `${collection} / ${v.name}`, path, described: Boolean(description) };
    if (variableName(path) !== css) meta.warnings.push({ css, warning: `token path ${path} builds ${variableName(path)}` });

    const base = valueOf(css, v, {});
    if (base.error) {
      meta.mismatches.push({ css, figma: v.name, reason: base.error, chain: base.chain });
      continue;
    }
    if (base.warning) meta.warnings.push({ css, warning: base.warning });

    const token = { $type: tokenType(v.resolvedType, css), $value: base.value };
    if (description) token.$description = description;
    setToken(tokens, path, token);

    for (const [theme, mode] of Object.entries(config.themes)) {
      const t = valueOf(css, v, { Theme: mode });
      if (!t.error && JSON.stringify(t.value) !== JSON.stringify(base.value)) {
        setToken(themes[theme], path, { $type: token.$type, $value: t.value });
      }
    }

    if (responsive) {
      const per = responsive.modes.map((m) => [m.name, valueOf(css, v, { Responsive: m.name }).value]);
      if (new Set(per.map(([, x]) => JSON.stringify(x))).size > 1) {
        meta.breakpointVariance.push({ css, values: Object.fromEntries(per) });
      }
    }
  }

  for (const [css, v] of [...model.excluded].sort(([a], [b]) => byPath(a, b))) {
    const r = resolve(model, v, {}, css);
    meta.excluded.push({
      css,
      figma: `${model.collections[v.variableCollectionId].name} / ${v.name}`,
      type: v.resolvedType,
      value: r.error ? `(${r.error})` : r.alias ? `{${r.alias}}` : cssValue(r.figmaType, r.raw, css),
    });
  }

  // Tokens Figma doesn't have
  walkTokens(manual, (path, token) => {
    const css = variableName(path);
    if (model.published.has(css)) {
      meta.warnings.push({ css, warning: `now in Figma — remove ${path} from src/tokens.manual.json` });
      return;
    }
    meta.manual.push({ css, path });
    setToken(tokens, path, token);
  });

  return { tokens, themes, meta };
}

function setToken(doc, path, token) {
  let node = doc;
  const parts = path.split(".");
  for (const p of parts.slice(0, -1)) node = node[p] ??= {};
  node[parts.at(-1)] = token;
}

function walkTokens(node, visit, path = [], type) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return;
  const t = node.$type ?? type;
  if ("$value" in node) return visit(path.join("."), { $type: t, ...node });
  for (const [k, v] of Object.entries(node)) if (!k.startsWith("$")) walkTokens(v, visit, [...path, k], t);
}

// ---------------------------------------------------------------- output

/**
 * 2-space JSON, except objects/arrays holding only primitives stay on one line,
 * so color/dimension objects and font stacks read as single values.
 */
export function formatJSON(value) {
  const isPrimitive = (v) => v === null || typeof v !== "object";
  const isFlat = (v) =>
    Array.isArray(v)
      ? v.every(isPrimitive)
      : Object.values(v).every((x) => isPrimitive(x) || (Array.isArray(x) && x.every(isPrimitive)));
  const format = (v, indent) => {
    if (isPrimitive(v)) return JSON.stringify(v);
    const isArray = Array.isArray(v);
    const entries = isArray ? v : Object.entries(v);
    if (entries.length === 0) return isArray ? "[]" : "{}";
    if (isFlat(v) && (isArray || !Object.keys(v).some((k) => k.startsWith("$")))) {
      return isArray
        ? `[${v.map((x) => JSON.stringify(x)).join(", ")}]`
        : `{ ${entries.map(([k, x]) => `${JSON.stringify(k)}: ${JSON.stringify(x)}`).join(", ")} }`;
    }
    const inner = `${indent}  `;
    const lines = isArray
      ? v.map((x) => inner + format(x, inner))
      : entries.map(([k, x]) => `${inner}${JSON.stringify(k)}: ${format(x, inner)}`);
    return `${isArray ? "[" : "{"}\n${lines.join(",\n")}\n${indent}${isArray ? "]" : "}"}`;
  };
  return `${format(value, "")}\n`;
}

export function writeTokens({ tokens, themes }) {
  writeFileSync(FILES.tokens, formatJSON(tokens));
  for (const [theme, doc] of Object.entries(themes)) writeFileSync(join(FILES.themes, `${theme}.json`), formatJSON(doc));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = convert(JSON.parse(readFileSync(FILES.figma, "utf8")), JSON.parse(readFileSync(FILES.manual, "utf8")));
  writeTokens(result);
  const { meta } = result;
  console.log(
    `figma-to-dtcg: ${Object.keys(meta.published).length} tokens from Figma, ${meta.manual.length} from tokens.manual.json, ${meta.excluded.length} excluded`,
  );
  for (const m of meta.mismatches) console.warn(`  ✗ ${m.css}: ${m.reason}`);
  for (const w of meta.warnings) console.warn(`  ! ${w.css}: ${w.warning}`);
}

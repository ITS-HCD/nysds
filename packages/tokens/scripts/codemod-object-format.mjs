#!/usr/bin/env node
/**
 * One-time codemod: convert string colors and dimensions in DTCG token files to
 * the DTCG 2025.10 object notation Terrazzo 2 requires.
 *
 *   "#0000001a" → { "colorSpace": "srgb", "components": [0, 0, 0], "alpha": 0.102, "hex": "#000000" }
 *   "1.5rem"    → { "value": 1.5, "unit": "rem" }
 *
 * Aliases ("{…}") are left as-is. Shadow sub-values are converted too.
 *
 *   node scripts/codemod-object-format.mjs src/tokens.json src/themes/*.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { formatJSON } from "./lib/format-json.mjs";

const isAlias = (v) => typeof v === "string" && v.startsWith("{");

export function colorObject(str) {
  const m = str.trim().toLowerCase().match(/^#([0-9a-f]{3,8})$/);
  if (!m || ![3, 4, 6, 8].includes(m[1].length)) throw new Error(`Unsupported color: ${str}`);
  let h = m[1];
  if (h.length <= 4) h = [...h].map((c) => c + c).join("");
  const byte = (o) => parseInt(h.slice(o, o + 2), 16);
  const unit = (b) => Number((b / 255).toFixed(4));
  const obj = { colorSpace: "srgb", components: [unit(byte(0)), unit(byte(2)), unit(byte(4))] };
  if (h.length === 8) obj.alpha = unit(byte(6));
  obj.hex = `#${h.slice(0, 6)}`;
  return obj;
}

export function dimensionObject(str) {
  const m = str.trim().match(/^(-?\d*\.?\d+)(px|rem|em)$/);
  if (!m) throw new Error(`Unsupported dimension: ${str}`);
  return { value: Number(m[1]), unit: m[2] };
}

const SHADOW_DIMENSIONS = ["offsetX", "offsetY", "blur", "spread"];

function convertShadowLayer(layer) {
  const out = { ...layer };
  if (typeof out.color === "string" && !isAlias(out.color)) out.color = colorObject(out.color);
  for (const key of SHADOW_DIMENSIONS) {
    if (typeof out[key] === "string" && !isAlias(out[key])) out[key] = dimensionObject(out[key]);
  }
  return out;
}

/** Convert one token's $value given its (inherited) $type. Returns [value, changed]. */
export function convertValue(type, value) {
  if (isAlias(value)) return [value, false];
  if (type === "color" && typeof value === "string") return [colorObject(value), true];
  if (type === "dimension" && typeof value === "string") return [dimensionObject(value), true];
  if (type === "shadow" && value && typeof value === "object") {
    const layers = Array.isArray(value) ? value.map(convertShadowLayer) : convertShadowLayer(value);
    return [layers, JSON.stringify(layers) !== JSON.stringify(value)];
  }
  return [value, false];
}

export function convertTokens(node, inheritedType, stats = { converted: 0 }) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return stats;
  const type = node.$type ?? inheritedType;
  if ("$value" in node) {
    const [value, changed] = convertValue(type, node.$value);
    if (changed) {
      node.$value = value;
      stats.converted++;
    }
    return stats;
  }
  for (const [key, child] of Object.entries(node)) {
    if (!key.startsWith("$")) convertTokens(child, type, stats);
  }
  return stats;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("Usage: codemod-object-format.mjs <tokens.json> [more.json…]");
    process.exit(1);
  }
  for (const file of files) {
    const json = JSON.parse(readFileSync(file, "utf8"));
    const { converted } = convertTokens(json);
    writeFileSync(file, formatJSON(json));
    console.log(`${file}: ${converted} tokens converted`);
  }
}

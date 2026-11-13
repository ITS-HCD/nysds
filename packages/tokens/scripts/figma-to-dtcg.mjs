#!/usr/bin/env node
/**
 * Convert the Figma Variables API response (figma/variables.json) to DTCG
 * tokens for Terrazzo:
 *
 *   figma/variables.json + src/tokens.manual.json  →  src/tokens.json + src/themes/*.json
 *
 * The mapping rules (which collections, which modes, units, exclusions) live in
 * figma.config.mjs. src/tokens.manual.json holds the few tokens that have no
 * Figma variable yet (shadows, gutters, …). If Figma and the manual file both
 * define the same CSS name, Figma wins.
 *
 * Usage:
 *   node scripts/figma-to-dtcg.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import figmaConfig from "../figma.config.mjs";
import { variableName } from "./lib/variable-name.mjs";

const PACKAGE_DIRECTORY = join(dirname(fileURLToPath(import.meta.url)), "..");

export const FILES = {
  /** The Figma Variables API response, as stored by figma-pull.mjs. */
  figma: join(PACKAGE_DIRECTORY, "figma/variables.json"),
  /** Tokens that exist only in code. */
  manual: join(PACKAGE_DIRECTORY, "src/tokens.manual.json"),
  /** Generated: every token, with the default (NYS) theme values. */
  tokens: join(PACKAGE_DIRECTORY, "src/tokens.json"),
  /** Generated: one file per agency theme, holding only the tokens that theme changes. */
  themes: join(PACKAGE_DIRECTORY, "src/themes"),
  /** What the last pull published and excluded, read by the drift report (gitignored). */
  meta: join(PACKAGE_DIRECTORY, ".snapshots/figma-meta.json"),
};

const DTCG_SCHEMA_URL = "https://www.designtokens.org/schemas/2025.10/format.json";

/** How deep an alias chain may go before we assume it loops. */
const MAXIMUM_ALIAS_DEPTH = 25;

// ---------------------------------------------------------------------------
// Naming
// ---------------------------------------------------------------------------

/**
 * Split a Figma variable name into normalized parts, dropping the first part
 * (the collection's own folder, such as "p-color-unpublished" or "!-nys").
 *
 * "!-nys/color-@/text-weak" → ["color", "text-weak"]
 */
function getNameParts(figmaVariableName) {
  const allParts = figmaVariableName.split("/");
  const partsAfterFolder = allParts.slice(1);
  const normalizedParts = [];

  for (const part of partsAfterFolder) {
    let normalizedPart = part.trim();
    // Sort-order prefixes designers use to order groups, e.g. "@-font-lineheight"
    normalizedPart = normalizedPart.replace(/^[@#%&*!]-/, "");
    // Sort-order suffixes, e.g. "color-@"
    normalizedPart = normalizedPart.replace(/-[@#%&*]$/, "");
    normalizedPart = normalizedPart.toLowerCase();
    normalizedPart = normalizedPart.replace(/\s+/g, "-");
    normalizedParts.push(normalizedPart);
  }

  return normalizedParts;
}

/**
 * The CSS custom property a Figma variable maps to, or null if its collection
 * is not listed in figma.config.mjs.
 *
 * ("Color", "p-color-unpublished/blue/600") → "--nys-color-blue-600"
 */
export function figmaCSSName(collectionName, figmaVariableName) {
  const collectionRule = figmaConfig.collections[collectionName];
  if (!collectionRule) {
    return null;
  }

  const nameParts = [];
  if (collectionRule.prefix) {
    nameParts.push(collectionRule.prefix);
  }
  nameParts.push(...getNameParts(figmaVariableName));
  const nonEmptyParts = nameParts.filter((part) => part !== "");

  return `--nys-${nonEmptyParts.join("-")}`;
}

/**
 * The DTCG token path a Figma variable is written to.
 *
 * ("Color", "p-color-unpublished/blue/600")            → "primitive.color.blue.600"
 * ("Typography", "p-type-unpublished/#-font-size/md")  → "font.size.md"
 */
export function figmaTokenPath(collectionName, figmaVariableName) {
  const collectionRule = figmaConfig.collections[collectionName];
  const nameParts = getNameParts(figmaVariableName);
  const firstPart = nameParts[0] ?? "";
  const remainingParts = nameParts.slice(1);

  // "font-size" becomes two path segments: "font", "size"
  const splitPrefix = figmaConfig.splitPrefixes.find((prefix) => firstPart.startsWith(`${prefix}-`));
  let leadingSegments;
  if (splitPrefix) {
    leadingSegments = [splitPrefix, firstPart.slice(splitPrefix.length + 1)];
  } else {
    leadingSegments = [firstPart];
  }

  const pathSegments = [];
  if (collectionRule.layer) {
    pathSegments.push(collectionRule.layer);
  }
  if (collectionRule.prefix) {
    pathSegments.push(collectionRule.prefix);
  }
  pathSegments.push(...leadingSegments, ...remainingParts);

  return pathSegments.filter((segment) => segment !== "").join(".");
}

// ---------------------------------------------------------------------------
// Values
// ---------------------------------------------------------------------------

/** A Figma color channel (0–1) as an 8-bit integer (0–255). */
function toEightBit(channel) {
  const clampedChannel = Math.min(1, Math.max(0, channel));
  return Math.round(clampedChannel * 255);
}

/** A Figma color channel (0–1) as two hex digits. */
function toHexPair(channel) {
  return toEightBit(channel).toString(16).padStart(2, "0");
}

/**
 * A Figma RGBA color as hex: 6 digits, or 8 when it is not fully opaque.
 *
 * { r: 1, g: 1, b: 1, a: 0.1 } → "#ffffff1a"
 */
export function figmaHex(figmaColorValue) {
  const { r: red, g: green, b: blue, a: alpha = 1 } = figmaColorValue;
  let hex = `#${toHexPair(red)}${toHexPair(green)}${toHexPair(blue)}`;
  if (alpha < 1) {
    hex += toHexPair(alpha);
  }
  return hex;
}

/**
 * A Figma RGBA color as a DTCG color. Channels are rounded to 8-bit precision
 * so Figma's float noise doesn't reach the CSS; alpha is kept apart from the
 * 6-digit hex, as DTCG requires.
 */
export function figmaColor(figmaColorValue) {
  const { r: red, g: green, b: blue, a: alpha = 1 } = figmaColorValue;
  const toRoundedUnit = (channel) => Number((toEightBit(channel) / 255).toFixed(4));

  const dtcgColor = {
    colorSpace: "srgb",
    components: [toRoundedUnit(red), toRoundedUnit(green), toRoundedUnit(blue)],
  };
  if (toEightBit(alpha) < 255) {
    dtcgColor.alpha = toRoundedUnit(alpha);
  }
  dtcgColor.hex = figmaHex({ r: red, g: green, b: blue });

  return dtcgColor;
}

/**
 * A Figma number (always px) as a DTCG dimension: rem, unless the CSS name is
 * listed in figma.config.mjs `pxDimensions`.
 */
export function figmaDimension(pixels, cssName) {
  const staysInPixels = figmaConfig.pxDimensions.some((pattern) => pattern.test(cssName));
  if (staysInPixels) {
    return { value: pixels, unit: "px" };
  }
  const rems = Number((pixels / figmaConfig.remBase).toFixed(4));
  return { value: rems, unit: "rem" };
}

/** The DTCG $type for a Figma variable, from its Figma type and CSS name. */
export function tokenType(figmaResolvedType, cssName) {
  if (figmaResolvedType === "COLOR") {
    return "color";
  }

  for (const [cssNamePattern, dtcgType] of figmaConfig.types) {
    if (cssNamePattern.test(cssName)) {
      return dtcgType;
    }
  }

  if (figmaResolvedType === "FLOAT") {
    return "dimension";
  }
  return "string";
}

/** "Semi Bold" → "semibold", to look up in figma.config.mjs `fontWeights`. */
function toFontWeightKey(fontStyleName) {
  return String(fontStyleName).toLowerCase().replace(/[\s_-]+/g, "");
}

/**
 * Convert a raw Figma value to the DTCG $value for a token of `dtcgType`.
 * Returns { value }, { value, warning } or { error }.
 */
export function toDTCG(dtcgType, figmaResolvedType, rawValue, cssName) {
  if (dtcgType === "color" && figmaResolvedType === "COLOR") {
    return { value: figmaColor(rawValue) };
  }

  if (dtcgType === "dimension" && figmaResolvedType === "FLOAT") {
    return { value: figmaDimension(rawValue, cssName) };
  }

  if (dtcgType === "fontFamily" && figmaResolvedType === "STRING") {
    const fallbackFonts = figmaConfig.fontFallbacks[rawValue];
    if (fallbackFonts) {
      return { value: [rawValue, ...fallbackFonts] };
    }
    return { value: [rawValue], warning: `no fallback stack for "${rawValue}"` };
  }

  if (dtcgType === "fontWeight" && figmaResolvedType === "FLOAT") {
    return { value: rawValue };
  }

  if (dtcgType === "fontWeight" && figmaResolvedType === "STRING") {
    const fontWeight = figmaConfig.fontWeights[toFontWeightKey(rawValue)];
    if (fontWeight) {
      return { value: fontWeight };
    }
    return { error: `font style "${rawValue}" is not a weight` };
  }

  if (dtcgType === "string" && figmaResolvedType === "STRING") {
    return { value: rawValue };
  }

  return { error: `Figma ${figmaResolvedType} can't become a ${dtcgType} token` };
}

/** A raw Figma value as a CSS string, for listing excluded variables in the drift report. */
function toCSSString(figmaResolvedType, rawValue, cssName) {
  if (figmaResolvedType === "COLOR") {
    return figmaHex(rawValue);
  }
  if (figmaResolvedType === "FLOAT") {
    const dimension = figmaDimension(rawValue, cssName);
    return `${dimension.value}${dimension.unit}`;
  }
  return String(rawValue);
}

// ---------------------------------------------------------------------------
// Reading the Figma response
// ---------------------------------------------------------------------------

/**
 * The mode id to read from a collection. `modeOverrides` maps collection name →
 * mode name (e.g. { Theme: "Admin (NYS)" }); otherwise figma.config.mjs `modes`
 * decides, and otherwise the collection's default mode.
 */
function getModeId(collection, modeOverrides) {
  const wantedModeName = modeOverrides[collection.name] ?? figmaConfig.modes[collection.name];
  const wantedMode = collection.modes.find((mode) => mode.name === wantedModeName);
  if (wantedMode) {
    return wantedMode.modeId;
  }
  const defaultMode = collection.modes.find((mode) => mode.modeId === collection.defaultModeId);
  return defaultMode.modeId;
}

/**
 * Follow a variable's alias chain until it reaches either:
 * - a published variable with a different CSS name → { alias: "<token path>" }
 * - a raw value                                    → { rawValue, figmaResolvedType }
 * - something it can't follow                      → { error }
 *
 * Every result carries `chain`: the Figma variable names it passed through.
 */
function resolveVariable(figmaModel, variable, modeOverrides, ownCSSName, depth = 0) {
  const collection = figmaModel.collections[variable.variableCollectionId];
  const value = variable.valuesByMode[getModeId(collection, modeOverrides)];

  const isAlias = value?.type === "VARIABLE_ALIAS";
  if (!isAlias) {
    return { rawValue: value, figmaResolvedType: variable.resolvedType, chain: [variable.name] };
  }

  const targetVariable = figmaModel.variables[value.id];
  if (!targetVariable) {
    return { error: `aliases a remote/library variable (${value.id})`, chain: [variable.name] };
  }
  if (depth > MAXIMUM_ALIAS_DEPTH) {
    return { error: "alias chain too deep", chain: [variable.name] };
  }

  // Stop at a published token, unless it is this same CSS variable (e.g. Semantic
  // "color/neutral/900" aliasing Color "neutral/900"): then keep following.
  const targetCSSName = figmaModel.getCSSName(targetVariable);
  const targetIsAnotherPublishedToken =
    targetCSSName !== null && targetCSSName !== ownCSSName && figmaModel.published.has(targetCSSName);
  if (targetIsAnotherPublishedToken) {
    const targetPath = figmaModel.published.get(targetCSSName).path;
    return { alias: targetPath, chain: [variable.name, targetVariable.name] };
  }

  const resolvedTarget = resolveVariable(figmaModel, targetVariable, modeOverrides, ownCSSName, depth + 1);
  return { ...resolvedTarget, chain: [variable.name, ...resolvedTarget.chain] };
}

/**
 * Index the Figma response by CSS name and decide, for each CSS name, which
 * variable supplies the value, which supplies the token path, and whether it
 * is published or excluded.
 */
function buildFigmaModel(figmaResponse) {
  const variables = figmaResponse.meta.variables;
  const collections = figmaResponse.meta.variableCollections;

  function getCollectionName(variable) {
    return collections[variable.variableCollectionId]?.name;
  }

  function getCSSName(variable) {
    return figmaCSSName(getCollectionName(variable), variable.name);
  }

  function getPriority(variable) {
    return figmaConfig.collections[getCollectionName(variable)].priority ?? 0;
  }

  // CSS name → every local variable that maps to it
  const variablesByCSSName = new Map();
  for (const collection of Object.values(collections)) {
    const isMappedLocalCollection = !collection.remote && figmaConfig.collections[collection.name];
    if (!isMappedLocalCollection) {
      continue;
    }
    for (const variableId of collection.variableIds) {
      const variable = variables[variableId];
      if (!variable) {
        continue;
      }
      const cssName = getCSSName(variable);
      if (!variablesByCSSName.has(cssName)) {
        variablesByCSSName.set(cssName, []);
      }
      variablesByCSSName.get(cssName).push(variable);
    }
  }

  const published = new Map(); // CSS name → { variable, path, description }
  const excluded = new Map(); // CSS name → variable

  for (const [cssName, candidateVariables] of variablesByCSSName) {
    const byPriorityHighestFirst = [...candidateVariables].sort(
      (first, second) => getPriority(second) - getPriority(first),
    );
    // The value comes from the highest priority (Semantic, the published collection)
    const valueVariable = byPriorityHighestFirst[0];

    const isExcluded = figmaConfig.exclude.some((pattern) => pattern.test(cssName));
    if (isExcluded) {
      excluded.set(cssName, valueVariable);
      continue;
    }

    // The token path comes from the lowest priority (the primitive)
    const pathVariable = byPriorityHighestFirst[byPriorityHighestFirst.length - 1];
    const path = figmaTokenPath(getCollectionName(pathVariable), pathVariable.name);

    // The first non-empty description, highest priority first
    let description;
    for (const candidate of byPriorityHighestFirst) {
      const candidateDescription = candidate.description?.trim();
      if (candidateDescription) {
        description = candidateDescription;
        break;
      }
    }

    published.set(cssName, { variable: valueVariable, path, description });
  }

  return { variables, collections, getCSSName, published, excluded };
}

// ---------------------------------------------------------------------------
// Converting
// ---------------------------------------------------------------------------

/** Sort token paths so numbered steps read in order: neutral.10, neutral.50, neutral.100. */
function compareTokenPaths(firstPath, secondPath) {
  return firstPath.localeCompare(secondPath, "en", { numeric: true });
}

/**
 * Convert a Figma Variables API response to DTCG.
 *
 * @param {object} figmaResponse  the stored response (figma/variables.json)
 * @param {object} manualTokens   src/tokens.manual.json
 * @returns {{ tokens: object, themes: Record<string, object>, meta: object }}
 *   `meta` lists what the drift and missing-description reports need.
 */
export function convert(figmaResponse, manualTokens = {}) {
  const figmaModel = buildFigmaModel(figmaResponse);

  const tokens = { $schema: DTCG_SCHEMA_URL };
  const themes = {};
  for (const themeName of Object.keys(figmaConfig.themes)) {
    themes[themeName] = {};
  }
  const meta = {
    published: {},
    manual: [],
    excluded: [],
    mismatches: [],
    warnings: [],
    breakpointVariance: [],
    unmappedThemeModes: [],
  };

  // Theme modes in Figma that no agency theme in figma.config.mjs maps to
  const themeCollection = Object.values(figmaModel.collections).find(
    (collection) => collection.name === "Theme" && !collection.remote,
  );
  if (themeCollection) {
    const mappedModeNames = new Set([figmaConfig.modes.Theme, ...Object.values(figmaConfig.themes)]);
    for (const mode of themeCollection.modes) {
      if (!mappedModeNames.has(mode.name)) {
        meta.unmappedThemeModes.push(mode.name);
      }
    }
  }

  const responsiveCollection = Object.values(figmaModel.collections).find(
    (collection) => collection.name === "Responsive" && !collection.remote,
  );

  /** The DTCG $value of a variable under the given mode overrides. */
  function getTokenValue(cssName, variable, modeOverrides) {
    const resolved = resolveVariable(figmaModel, variable, modeOverrides, cssName);
    if (resolved.error) {
      return resolved;
    }
    if (resolved.alias) {
      return { value: `{${resolved.alias}}`, chain: resolved.chain };
    }
    const dtcgType = tokenType(variable.resolvedType, cssName);
    const converted = toDTCG(dtcgType, resolved.figmaResolvedType, resolved.rawValue, cssName);
    return { ...converted, chain: resolved.chain };
  }

  // Published tokens, in path order (independent of the order Figma returns them)
  const publishedInPathOrder = [...figmaModel.published].sort(([, first], [, second]) =>
    compareTokenPaths(first.path, second.path),
  );

  for (const [cssName, publishedEntry] of publishedInPathOrder) {
    const { variable, path, description } = publishedEntry;
    const collectionName = figmaModel.collections[variable.variableCollectionId].name;

    meta.published[cssName] = {
      figma: `${collectionName} / ${variable.name}`,
      path,
      described: Boolean(description),
    };

    const cssNameFromPath = variableName(path);
    if (cssNameFromPath !== cssName) {
      meta.warnings.push({ css: cssName, warning: `token path ${path} builds ${cssNameFromPath}` });
    }

    const defaultValue = getTokenValue(cssName, variable, {});
    if (defaultValue.error) {
      meta.mismatches.push({ css: cssName, figma: variable.name, reason: defaultValue.error, chain: defaultValue.chain });
      continue;
    }
    if (defaultValue.warning) {
      meta.warnings.push({ css: cssName, warning: defaultValue.warning });
    }

    const token = { $type: tokenType(variable.resolvedType, cssName), $value: defaultValue.value };
    if (description) {
      token.$description = description;
    }
    setToken(tokens, path, token);

    // Agency themes: keep only the tokens whose value differs from the default theme
    for (const [themeName, figmaThemeModeName] of Object.entries(figmaConfig.themes)) {
      const themeValue = getTokenValue(cssName, variable, { Theme: figmaThemeModeName });
      if (themeValue.error) {
        continue;
      }
      const differsFromDefault = JSON.stringify(themeValue.value) !== JSON.stringify(defaultValue.value);
      if (differsFromDefault) {
        setToken(themes[themeName], path, { $type: token.$type, $value: themeValue.value });
      }
    }

    // Record variables whose value changes by breakpoint (code uses one breakpoint)
    if (responsiveCollection) {
      const valuesByBreakpoint = {};
      const distinctValues = new Set();
      for (const mode of responsiveCollection.modes) {
        const breakpointValue = getTokenValue(cssName, variable, { Responsive: mode.name }).value;
        valuesByBreakpoint[mode.name] = breakpointValue;
        distinctValues.add(JSON.stringify(breakpointValue));
      }
      if (distinctValues.size > 1) {
        meta.breakpointVariance.push({ css: cssName, values: valuesByBreakpoint });
      }
    }
  }

  // Excluded variables, listed with their value for the drift report
  const excludedInNameOrder = [...figmaModel.excluded].sort(([firstName], [secondName]) =>
    compareTokenPaths(firstName, secondName),
  );
  for (const [cssName, variable] of excludedInNameOrder) {
    const resolved = resolveVariable(figmaModel, variable, {}, cssName);
    let displayValue;
    if (resolved.error) {
      displayValue = `(${resolved.error})`;
    } else if (resolved.alias) {
      displayValue = `{${resolved.alias}}`;
    } else {
      displayValue = toCSSString(resolved.figmaResolvedType, resolved.rawValue, cssName);
    }
    meta.excluded.push({
      css: cssName,
      figma: `${figmaModel.collections[variable.variableCollectionId].name} / ${variable.name}`,
      type: variable.resolvedType,
      value: displayValue,
    });
  }

  // Tokens that Figma doesn't have yet
  visitTokens(manualTokens, (path, token) => {
    const cssName = variableName(path);
    if (figmaModel.published.has(cssName)) {
      meta.warnings.push({ css: cssName, warning: `now in Figma — remove ${path} from src/tokens.manual.json` });
      return;
    }
    meta.manual.push({ css: cssName, path });
    setToken(tokens, path, token);
  });

  return { tokens, themes, meta };
}

/** Put a token at a dot-separated path, creating groups along the way. */
function setToken(document, path, token) {
  const pathSegments = path.split(".");
  const tokenName = pathSegments.pop();

  let group = document;
  for (const segment of pathSegments) {
    if (group[segment] === undefined) {
      group[segment] = {};
    }
    group = group[segment];
  }
  group[tokenName] = token;
}

/**
 * Call `visit(path, token)` for every token in a DTCG document. Each token is
 * given its inherited $type, so it can be moved without its group.
 */
function visitTokens(node, visit, pathSoFar = [], inheritedType = undefined) {
  const isGroupOrToken = node !== null && typeof node === "object" && !Array.isArray(node);
  if (!isGroupOrToken) {
    return;
  }

  const type = node.$type ?? inheritedType;
  if ("$value" in node) {
    visit(pathSoFar.join("."), { $type: type, ...node });
    return;
  }

  for (const [key, child] of Object.entries(node)) {
    if (!key.startsWith("$")) {
      visitTokens(child, visit, [...pathSoFar, key], type);
    }
  }
}

// ---------------------------------------------------------------------------
// Writing
// ---------------------------------------------------------------------------

function isPrimitive(value) {
  return value === null || typeof value !== "object";
}

function isArrayOfPrimitives(value) {
  return Array.isArray(value) && value.every(isPrimitive);
}

/**
 * Whether a value is printed on one line: an array of primitives, or an object
 * whose values are all primitives or arrays of primitives (a color or dimension
 * value). Tokens and groups (objects with `$` keys) always get their own lines.
 */
function printsOnOneLine(value) {
  if (Array.isArray(value)) {
    return isArrayOfPrimitives(value);
  }
  const hasDollarKey = Object.keys(value).some((key) => key.startsWith("$"));
  if (hasDollarKey) {
    return false;
  }
  return Object.values(value).every((child) => isPrimitive(child) || isArrayOfPrimitives(child));
}

function formatValue(value, indentation) {
  if (isPrimitive(value)) {
    return JSON.stringify(value);
  }

  const isArray = Array.isArray(value);
  const openBracket = isArray ? "[" : "{";
  const closeBracket = isArray ? "]" : "}";
  const isEmpty = isArray ? value.length === 0 : Object.keys(value).length === 0;
  if (isEmpty) {
    return `${openBracket}${closeBracket}`;
  }

  if (printsOnOneLine(value)) {
    if (isArray) {
      const items = value.map((item) => JSON.stringify(item));
      return `[${items.join(", ")}]`;
    }
    const entries = Object.entries(value).map(([key, child]) => `${JSON.stringify(key)}: ${JSON.stringify(child)}`);
    return `{ ${entries.join(", ")} }`;
  }

  const innerIndentation = `${indentation}  `;
  const lines = [];
  if (isArray) {
    for (const item of value) {
      lines.push(`${innerIndentation}${formatValue(item, innerIndentation)}`);
    }
  } else {
    for (const [key, child] of Object.entries(value)) {
      lines.push(`${innerIndentation}${JSON.stringify(key)}: ${formatValue(child, innerIndentation)}`);
    }
  }
  return `${openBracket}\n${lines.join(",\n")}\n${indentation}${closeBracket}`;
}

/**
 * JSON with 2-space indentation, except that color values, dimension values and
 * font stacks stay on one line so each reads as a single value.
 */
export function formatJSON(value) {
  return `${formatValue(value, "")}\n`;
}

/** Write src/tokens.json and src/themes/<theme>.json. */
export function writeTokens({ tokens, themes }) {
  writeFileSync(FILES.tokens, formatJSON(tokens));
  for (const [themeName, themeDocument] of Object.entries(themes)) {
    writeFileSync(join(FILES.themes, `${themeName}.json`), formatJSON(themeDocument));
  }
}

// ---------------------------------------------------------------------------
// Command line
// ---------------------------------------------------------------------------

const isRunDirectly = import.meta.url === `file://${process.argv[1]}`;
if (isRunDirectly) {
  const figmaResponse = JSON.parse(readFileSync(FILES.figma, "utf8"));
  const manualTokens = JSON.parse(readFileSync(FILES.manual, "utf8"));
  const result = convert(figmaResponse, manualTokens);
  writeTokens(result);

  const { meta } = result;
  const publishedCount = Object.keys(meta.published).length;
  console.log(
    `figma-to-dtcg: ${publishedCount} tokens from Figma, ${meta.manual.length} from tokens.manual.json, ${meta.excluded.length} excluded`,
  );
  for (const mismatch of meta.mismatches) {
    console.warn(`  ✗ ${mismatch.css}: ${mismatch.reason}`);
  }
  for (const warning of meta.warnings) {
    console.warn(`  ! ${warning.css}: ${warning.warning}`);
  }
}

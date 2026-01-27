/**
 * Design Token Parser
 *
 * Reads and parses NYSDS design tokens with a CSS-centric approach.
 * Returns data aligned with tokens.css output (not JSON internals).
 *
 * Key transformations:
 * - Token paths are converted to CSS variable names
 * - Alias references become var() expressions
 * - Layer prefixes (primitive, applied) are stripped
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ESM path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Legacy interface for backward compatibility
 */
export interface DesignToken {
  name: string;
  value: string;
  category: string;
  description?: string;
}

/**
 * CSS-centric token info aligned with tokens.css output
 */
export interface CSSTokenInfo {
  /** CSS variable name, e.g., "--nys-color-text" */
  cssVariable: string;
  /** CSS value as it appears in tokens.css, e.g., "var(--nys-color-neutral-900)" or "#1b1b1b" */
  cssValue: string;
  /** If this is an alias, the variable it references, e.g., "--nys-color-neutral-900" */
  referencesVariable?: string;
  /** Fully resolved value for previews, e.g., "#1b1b1b" */
  resolvedValue?: string;
  /** Token description from $description field */
  description?: string;
  /** Token category (color, font, space, etc.) */
  category: string;
  /** Token layer (primitive, applied, color, etc.) */
  layer: string;
  /** Original JSON path for debugging */
  jsonPath: string;
}

/**
 * Token dependency graph node
 */
export interface TokenGraphNode {
  cssVariable: string;
  referencesVariable?: string;
  usedBy: string[];
}

export interface TokenGroup {
  category: string;
  tokens: DesignToken[];
}

// ============================================================================
// Token Data Cache
// ============================================================================

let cachedLegacyTokens: DesignToken[] | null = null;
let cachedCSSTokens: CSSTokenInfo[] | null = null;
let cachedTokenGraph: Map<string, TokenGraphNode> | null = null;
let cachedRawTokens: Record<string, unknown> | null = null;

// ============================================================================
// Path Resolution
// ============================================================================

/**
 * Get the path to tokens.json file
 * Uses ESM-compatible path resolution with fallbacks for different contexts
 */
export function getTokensPath(): string | null {
  // Fallback paths for different execution contexts
  const possiblePaths = [
    // From lib/ directory (normal execution)
    resolve(__dirname, "../../../../tokens/src/tokens.json"),
    // From mcp-server package root
    resolve(__dirname, "../../../tokens/src/tokens.json"),
    // From monorepo root
    resolve(__dirname, "../../../../../packages/tokens/src/tokens.json"),
    // Direct path from monorepo root
    resolve(process.cwd(), "packages/tokens/src/tokens.json"),
    // From mcp-server package
    resolve(process.cwd(), "../tokens/src/tokens.json"),
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}

/**
 * Get the path to tokens.css file
 */
export function getTokensCSSPath(): string | null {
  const possiblePaths = [
    resolve(__dirname, "../../../../tokens/dist/tokens.css"),
    resolve(__dirname, "../../../tokens/dist/tokens.css"),
    resolve(__dirname, "../../../../../packages/tokens/dist/tokens.css"),
    resolve(process.cwd(), "packages/tokens/dist/tokens.css"),
    resolve(process.cwd(), "../tokens/dist/tokens.css"),
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}

// ============================================================================
// CSS Variable Transformation
// ============================================================================

/**
 * Transform a JSON token path to CSS variable name
 *
 * Examples:
 * - "primitive.color.neutral.900" → "--nys-color-neutral-900"
 * - "applied.color.text.default" → "--nys-color-text"
 * - "color.theme.default" → "--nys-color-theme"
 * - "font.size.md" → "--nys-font-size-md"
 */
export function toCSSVariable(jsonPath: string): string {
  let name =
    "--nys-" +
    jsonPath
      // Strip layer prefixes
      .replace(/^(primitive|applied|appearance|theme)\./, "")
      // Dots to hyphens
      .replace(/\./g, "-");

  // Strip trailing -default suffix
  name = name.replace(/-default$/, "");

  return name;
}

/**
 * Convert an alias reference to CSS var() syntax
 *
 * Examples:
 * - "{primitive.color.neutral.900}" → "var(--nys-color-neutral-900)"
 * - "{font.size.md}" → "var(--nys-font-size-md)"
 */
export function aliasToVarRef(aliasValue: string): {
  cssValue: string;
  referencesVariable: string;
} {
  // Extract the path from {path.to.token}
  const match = aliasValue.match(/^\{(.+)\}$/);
  if (!match) {
    return { cssValue: aliasValue, referencesVariable: "" };
  }

  const referencesVariable = toCSSVariable(match[1]);
  const cssValue = `var(${referencesVariable})`;
  return { cssValue, referencesVariable };
}

/**
 * Determine the category from a JSON path
 */
function getCategoryFromPath(jsonPath: string): string {
  const parts = jsonPath.split(".");

  // Skip layer prefix if present
  const startIndex = ["primitive", "applied", "appearance", "theme"].includes(
    parts[0],
  )
    ? 1
    : 0;

  return parts[startIndex] || "unknown";
}

/**
 * Determine the layer from a JSON path
 *
 * Layers:
 * - primitive: Raw values (colors, sizes, fonts, spacing, etc.)
 * - applied: Semantic tokens that reference primitives (includes color.theme.* defaults)
 * - theme: Agency theme overrides
 * - appearance: Light/dark mode variations
 */
function getLayerFromPath(jsonPath: string): string {
  const parts = jsonPath.split(".");

  // Check for explicit layer prefixes
  if (["primitive", "applied", "appearance", "theme"].includes(parts[0])) {
    return parts[0];
  }

  // color.theme.* tokens are applied semantic tokens (agency themes override these)
  if (parts[0] === "color" && parts[1] === "theme") {
    return "applied";
  }

  // Non-prefixed categories (space, size, font, radius, etc.) contain raw values
  // so they are classified as "primitive"
  return "primitive";
}

// ============================================================================
// Token Parsing
// ============================================================================

/**
 * Load raw token data from tokens.json
 */
function loadRawTokens(): Record<string, unknown> | null {
  if (cachedRawTokens) {
    return cachedRawTokens;
  }

  const tokensPath = getTokensPath();
  if (!tokensPath) {
    console.error("Warning: No tokens file found");
    return null;
  }

  try {
    const content = readFileSync(tokensPath, "utf-8");
    cachedRawTokens = JSON.parse(content);
    return cachedRawTokens;
  } catch (error) {
    console.error("Warning: Could not parse tokens file:", error);
    return null;
  }
}

/**
 * Parse tokens recursively into CSS-centric format
 */
function parseCSSTokens(
  obj: Record<string, unknown>,
  prefix: string = "",
  resolvedValues: Map<string, string> = new Map(),
): CSSTokenInfo[] {
  const tokens: CSSTokenInfo[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) continue; // Skip meta properties

    const jsonPath = prefix ? `${prefix}.${key}` : key;

    if (
      typeof value === "object" &&
      value !== null &&
      "$value" in (value as Record<string, unknown>)
    ) {
      // This is a token
      const tokenObj = value as Record<string, unknown>;
      const rawValue = tokenObj.$value;
      const description = tokenObj.$description as string | undefined;

      const cssVariable = toCSSVariable(jsonPath);
      const category = getCategoryFromPath(jsonPath);
      const layer = getLayerFromPath(jsonPath);

      let cssValue: string;
      let referencesVariable: string | undefined;
      let resolvedValue: string | undefined;

      // Handle different value types
      if (typeof rawValue === "string" && rawValue.startsWith("{")) {
        // Alias reference
        const aliasResult = aliasToVarRef(rawValue);
        cssValue = aliasResult.cssValue;
        referencesVariable = aliasResult.referencesVariable;
        // Try to resolve the value
        resolvedValue = resolvedValues.get(referencesVariable);
      } else if (Array.isArray(rawValue)) {
        // Complex value (like shadows) - format as string
        cssValue = JSON.stringify(rawValue);
        resolvedValue = cssValue;
      } else if (typeof rawValue === "object" && rawValue !== null) {
        // Object value (like single shadow)
        cssValue = JSON.stringify(rawValue);
        resolvedValue = cssValue;
      } else {
        // Direct value
        cssValue = String(rawValue);
        resolvedValue = cssValue;
      }

      // Store resolved value for other tokens to reference
      if (resolvedValue) {
        resolvedValues.set(cssVariable, resolvedValue);
      }

      tokens.push({
        cssVariable,
        cssValue,
        referencesVariable,
        resolvedValue,
        description,
        category,
        layer,
        jsonPath,
      });
    } else if (typeof value === "object" && value !== null) {
      // Recurse into nested group
      tokens.push(
        ...parseCSSTokens(
          value as Record<string, unknown>,
          jsonPath,
          resolvedValues,
        ),
      );
    }
  }

  return tokens;
}

/**
 * Resolve all alias values to their final resolved values
 */
function resolveAllValues(tokens: CSSTokenInfo[]): void {
  const byVariable = new Map<string, CSSTokenInfo>();
  for (const token of tokens) {
    byVariable.set(token.cssVariable, token);
  }

  // Iterate to resolve nested aliases (max 10 levels to prevent infinite loops)
  for (let i = 0; i < 10; i++) {
    let changed = false;

    for (const token of tokens) {
      if (token.referencesVariable && !token.resolvedValue) {
        const referenced = byVariable.get(token.referencesVariable);
        if (referenced?.resolvedValue) {
          token.resolvedValue = referenced.resolvedValue;
          changed = true;
        }
      }
    }

    if (!changed) break;
  }
}

// ============================================================================
// Token Graph
// ============================================================================

/**
 * Build a dependency graph of tokens
 * Shows which tokens reference which, and which tokens are used by which
 */
export function buildTokenGraph(): Map<string, TokenGraphNode> {
  if (cachedTokenGraph) {
    return cachedTokenGraph;
  }

  const tokens = getCSSTokens();
  const graph = new Map<string, TokenGraphNode>();

  // Initialize all nodes
  for (const token of tokens) {
    graph.set(token.cssVariable, {
      cssVariable: token.cssVariable,
      referencesVariable: token.referencesVariable,
      usedBy: [],
    });
  }

  // Build usedBy relationships
  for (const token of tokens) {
    if (token.referencesVariable) {
      const referenced = graph.get(token.referencesVariable);
      if (referenced) {
        referenced.usedBy.push(token.cssVariable);
      }
    }
  }

  cachedTokenGraph = graph;
  return graph;
}

// ============================================================================
// Public API - CSS-Centric
// ============================================================================

/**
 * Get all tokens in CSS-centric format
 */
export function getCSSTokens(): CSSTokenInfo[] {
  if (cachedCSSTokens) {
    return cachedCSSTokens;
  }

  const rawTokens = loadRawTokens();
  if (!rawTokens) {
    cachedCSSTokens = [];
    return cachedCSSTokens;
  }

  cachedCSSTokens = parseCSSTokens(rawTokens);
  resolveAllValues(cachedCSSTokens);
  return cachedCSSTokens;
}

/**
 * Get CSS tokens filtered by category
 */
export function getCSSTokensByCategory(category: string): CSSTokenInfo[] {
  const tokens = getCSSTokens();
  return tokens.filter(
    (t) => t.category.toLowerCase() === category.toLowerCase(),
  );
}

/**
 * Get CSS tokens filtered by layer
 */
export function getCSSTokensByLayer(layer: string): CSSTokenInfo[] {
  const tokens = getCSSTokens();
  return tokens.filter((t) => t.layer.toLowerCase() === layer.toLowerCase());
}

/**
 * Search CSS tokens by variable name, value, or description
 */
export function searchCSSTokens(query: string): CSSTokenInfo[] {
  const tokens = getCSSTokens();
  const lowerQuery = query.toLowerCase();

  return tokens.filter(
    (t) =>
      t.cssVariable.toLowerCase().includes(lowerQuery) ||
      t.cssValue.toLowerCase().includes(lowerQuery) ||
      t.resolvedValue?.toLowerCase().includes(lowerQuery) ||
      t.description?.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get a single token by CSS variable name
 */
export function getCSSTokenByVariable(
  variableName: string,
): CSSTokenInfo | undefined {
  const tokens = getCSSTokens();
  // Normalize: accept with or without -- prefix
  const normalized = variableName.startsWith("--")
    ? variableName
    : `--nys-${variableName}`;
  return tokens.find((t) => t.cssVariable === normalized);
}

/**
 * Get all unique categories
 */
export function getCSSTokenCategories(): { category: string; count: number }[] {
  const tokens = getCSSTokens();
  const counts = new Map<string, number>();

  for (const token of tokens) {
    counts.set(token.category, (counts.get(token.category) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

/**
 * Get raw tokens.css content
 */
export function getTokensCSS(): string | null {
  const cssPath = getTokensCSSPath();
  if (!cssPath) {
    return null;
  }

  try {
    return readFileSync(cssPath, "utf-8");
  } catch {
    return null;
  }
}

// ============================================================================
// Public API - Legacy (Backward Compatible)
// ============================================================================

/**
 * Parse DTCG format tokens recursively (legacy format)
 */
function parseDTCGTokens(
  obj: Record<string, unknown>,
  prefix: string = "",
  category: string = "",
): DesignToken[] {
  const tokens: DesignToken[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) continue; // Skip meta properties

    const name = prefix ? `${prefix}.${key}` : key;
    const currentCategory = category || key;

    if (
      typeof value === "object" &&
      value !== null &&
      "$value" in (value as Record<string, unknown>)
    ) {
      // This is a token
      const tokenObj = value as Record<string, unknown>;
      tokens.push({
        name,
        value: String(tokenObj.$value),
        category: currentCategory,
        description: tokenObj.$description as string | undefined,
      });
    } else if (typeof value === "object" && value !== null) {
      // Recurse into nested group
      tokens.push(
        ...parseDTCGTokens(
          value as Record<string, unknown>,
          name,
          currentCategory,
        ),
      );
    }
  }

  return tokens;
}

/**
 * Load all design tokens (legacy format)
 */
export function getAllTokens(): DesignToken[] {
  if (cachedLegacyTokens) {
    return cachedLegacyTokens;
  }

  const rawTokens = loadRawTokens();
  if (!rawTokens) {
    cachedLegacyTokens = [];
    return cachedLegacyTokens;
  }

  cachedLegacyTokens = parseDTCGTokens(rawTokens);
  return cachedLegacyTokens;
}

/**
 * Get tokens filtered by category (legacy format)
 */
export function getTokensByCategory(category: string): DesignToken[] {
  const tokens = getAllTokens();
  return tokens.filter(
    (t) => t.category.toLowerCase() === category.toLowerCase(),
  );
}

/**
 * Search tokens by name or value (legacy format)
 */
export function searchTokens(query: string): DesignToken[] {
  const tokens = getAllTokens();
  const lowerQuery = query.toLowerCase();

  return tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.value.toLowerCase().includes(lowerQuery) ||
      t.description?.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get available token categories (legacy format)
 */
export function getTokenCategories(): string[] {
  const tokens = getAllTokens();
  const categories = new Set(tokens.map((t) => t.category));
  return Array.from(categories).sort();
}

/**
 * Clear all cached tokens (useful for testing)
 */
export function clearTokenCache(): void {
  cachedLegacyTokens = null;
  cachedCSSTokens = null;
  cachedTokenGraph = null;
  cachedRawTokens = null;
}

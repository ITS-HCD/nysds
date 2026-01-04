/**
 * Design Token Parser
 *
 * Reads and parses design tokens from NYSDS.
 * Supports DTCG format (Design Token Community Group).
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export interface DesignToken {
  name: string;
  value: string;
  category: string;
  description?: string;
}

export interface TokenGroup {
  category: string;
  tokens: DesignToken[];
}

let cachedTokens: DesignToken[] | null = null;

/**
 * Get the path to tokens file
 */
function getTokensPath(): string | null {
  const possiblePaths = [
    resolve(process.cwd(), "tokens/tokens.json"),
    resolve(process.cwd(), "dist/tokens.json"),
    resolve(process.cwd(), "src/tokens/tokens.json"),
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}

/**
 * Parse DTCG format tokens recursively
 */
function parseDTCGTokens(
  obj: Record<string, unknown>,
  prefix: string = "",
  category: string = ""
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
          currentCategory
        )
      );
    }
  }

  return tokens;
}

/**
 * Load all design tokens
 */
export function getAllTokens(): DesignToken[] {
  if (cachedTokens) {
    return cachedTokens;
  }

  const tokensPath = getTokensPath();

  if (!tokensPath) {
    // Return placeholder tokens for development
    console.error("Warning: No tokens file found");
    cachedTokens = getPlaceholderTokens();
    return cachedTokens;
  }

  try {
    const content = readFileSync(tokensPath, "utf-8");
    const data = JSON.parse(content);
    cachedTokens = parseDTCGTokens(data);
    return cachedTokens;
  } catch (error) {
    console.error("Warning: Could not parse tokens file:", error);
    cachedTokens = getPlaceholderTokens();
    return cachedTokens;
  }
}

/**
 * Get tokens filtered by category
 */
export function getTokensByCategory(category: string): DesignToken[] {
  const tokens = getAllTokens();
  return tokens.filter(
    (t) => t.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Search tokens by name or value
 */
export function searchTokens(query: string): DesignToken[] {
  const tokens = getAllTokens();
  const lowerQuery = query.toLowerCase();

  return tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.value.toLowerCase().includes(lowerQuery) ||
      t.description?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get available token categories
 */
export function getTokenCategories(): string[] {
  const tokens = getAllTokens();
  const categories = new Set(tokens.map((t) => t.category));
  return Array.from(categories).sort();
}

/**
 * Placeholder tokens for development/testing
 */
function getPlaceholderTokens(): DesignToken[] {
  return [
    // Colors
    { name: "color.primary", value: "#154973", category: "color", description: "Primary brand color" },
    { name: "color.secondary", value: "#0050a0", category: "color", description: "Secondary brand color" },
    { name: "color.success", value: "#00a91c", category: "color", description: "Success state color" },
    { name: "color.warning", value: "#e5a000", category: "color", description: "Warning state color" },
    { name: "color.error", value: "#d54309", category: "color", description: "Error state color" },
    { name: "color.info", value: "#00bde3", category: "color", description: "Info state color" },
    // Spacing
    { name: "spacing.xs", value: "4px", category: "spacing", description: "Extra small spacing" },
    { name: "spacing.sm", value: "8px", category: "spacing", description: "Small spacing" },
    { name: "spacing.md", value: "16px", category: "spacing", description: "Medium spacing" },
    { name: "spacing.lg", value: "24px", category: "spacing", description: "Large spacing" },
    { name: "spacing.xl", value: "32px", category: "spacing", description: "Extra large spacing" },
    // Typography
    { name: "font.family.sans", value: "'Proxima Nova', system-ui, sans-serif", category: "typography", description: "Primary font family" },
    { name: "font.size.sm", value: "14px", category: "typography", description: "Small font size" },
    { name: "font.size.md", value: "16px", category: "typography", description: "Medium font size" },
    { name: "font.size.lg", value: "20px", category: "typography", description: "Large font size" },
    { name: "font.weight.regular", value: "400", category: "typography", description: "Regular font weight" },
    { name: "font.weight.bold", value: "700", category: "typography", description: "Bold font weight" },
  ];
}

/**
 * Clear the cached tokens (useful for testing)
 */
export function clearTokenCache(): void {
  cachedTokens = null;
}

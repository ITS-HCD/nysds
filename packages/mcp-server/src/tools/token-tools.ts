/**
 * Token Tools
 *
 * MCP tools for working with NYSDS design tokens.
 *
 * Tools:
 * - find_tokens: Search or browse tokens (discovery)
 * - get_token: Get full details for a specific token (deep dive)
 * - get_token_graph: Get token dependency graph
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getCSSTokens,
  getCSSTokenByVariable,
  buildTokenGraph,
  getRecommendedTokens,
  getPrimitiveTokens,
  getAlternativeTokens,
  getThemes,
  getTokenValueInTheme,
  type CSSTokenInfo,
  type ThemeValue,
} from "../lib/token-parser.js";

// ============================================================================
// Shared Constants
// ============================================================================

const CATEGORY_ENUM = [
  "color",
  "font",
  "space",
  "size",
  "radius",
  "shadow",
  "border",
  "decoration",
  "form",
  "gutter",
  "icon",
] as const;

const TOKEN_TOOL_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

/**
 * Rank how well a token matches a query; lower is better, undefined means no
 * match. Every query word must match, and the rank is the weakest word's:
 * 0: the name is the query; 1: the word is a whole dash-separated run of the
 * name ("text" in --nys-color-text-weak), or names a theme the token changes
 * in ("health"); 2: anywhere in the name; 3: description.
 */
function rankTokenMatch(
  t: CSSTokenInfo,
  query: string,
  themeNames: Set<string>,
): number | undefined {
  const q = query.trim().toLowerCase().replace(/^-+/, "").replace(/^nys-/, "");
  const name = t.cssVariable.toLowerCase().replace(/^--nys-/, "");
  const description = t.description?.toLowerCase() ?? "";
  if (!q) return undefined;
  if (name === q || name === q.replace(/\s+/g, "-")) return 0;

  let rank = 0;
  for (const word of q.split(/\s+/)) {
    let wordRank: number | undefined;
    if (`-${name}-`.includes(`-${word}-`)) wordRank = 1;
    else if (themeNames.has(word) && t.themes?.[word]) wordRank = 1;
    else if (name.includes(word)) wordRank = 2;
    else if (description.includes(word)) wordRank = 3;
    if (wordRank === undefined) return undefined;
    rank = Math.max(rank, wordRank);
  }
  return rank;
}

/**
 * Validate a theme argument; returns an error message, or undefined if valid
 */
function checkTheme(theme: string | undefined, allowAll: boolean) {
  if (!theme) return undefined;
  const names = getThemes().map((t) => t.name);
  if (names.includes(theme) || (allowAll && theme === "all")) return undefined;
  return `Unknown theme: ${theme}. Themes: ${names.join(", ")}${allowAll ? ", or all" : ""}`;
}

const themeError = (message: string) => ({
  content: [
    {
      type: "text" as const,
      text: JSON.stringify({ error: message }, null, 2),
    },
  ],
  isError: true,
});

// ============================================================================
// Tool Registration
// ============================================================================

export function registerTokenTools(server: McpServer): void {
  // -------------------------------------------------------------------------
  // find_tokens - Search or browse tokens (discovery)
  // -------------------------------------------------------------------------
  server.tool(
    "find_tokens",
    'Search or browse NYSDS design tokens. Omit query to list all. Returns CSS variable names for use with var(). Tokens that change by agency theme are marked themed; pass theme (or name one in the query, e.g. "health") to get their value in that theme.',
    {
      query: z
        .string()
        .optional()
        .describe(
          'Free-text search across token names and descriptions; every word must match ("theme mid"). A theme name ("health") matches the tokens that change in that theme. Omit to list all.',
        ),
      category: z.enum(CATEGORY_ENUM).optional().describe("Filter by category"),
      include: z
        .enum(["recommended", "primitive", "all"])
        .default("recommended")
        .describe(
          "'recommended' (default) excludes color primitives; 'primitive' returns only primitives; 'all' returns everything",
        ),
      theme: z
        .string()
        .optional()
        .describe(
          "Agency theme (default, admin, business, environment, health, local, safety, transportation), or 'all'. Adds each themed token's value in that theme.",
        ),
    },
    TOKEN_TOOL_ANNOTATIONS,
    async ({ query, category, include, theme }) => {
      const invalid = checkTheme(theme, true);
      if (invalid) return themeError(invalid);
      const themeNames = new Set(
        getThemes()
          .map((t) => t.name)
          .filter((name) => name !== "default"),
      );

      // Pick token set based on include value
      let tokens: CSSTokenInfo[];
      if (include === "primitive") {
        tokens = getPrimitiveTokens();
      } else if (include === "all") {
        tokens = getCSSTokens();
      } else {
        tokens = getRecommendedTokens();
      }

      // Apply category filter
      if (category) {
        tokens = tokens.filter(
          (t) => t.category.toLowerCase() === category.toLowerCase(),
        );
      }

      // Apply query filter (case-insensitive match on cssVariable or description),
      // ranked so name matches come before description-only matches
      if (query) {
        const ranked = tokens
          .map((t) => ({ t, rank: rankTokenMatch(t, query, themeNames) }))
          .filter((r) => r.rank !== undefined);
        // Array.prototype.sort is stable, so ties keep their original order
        ranked.sort((a, b) => a.rank! - b.rank!);
        tokens = ranked.map((r) => r.t);
      }

      // Themes to show values for: the theme argument, plus any named in the query
      const shownThemes = new Set<string>();
      if (theme === "all") {
        getThemes().forEach((t) => shownThemes.add(t.name));
      } else if (theme) {
        shownThemes.add(theme);
      }
      for (const word of query?.toLowerCase().split(/\s+/) ?? []) {
        if (themeNames.has(word)) shownThemes.add(word);
      }

      const results = tokens.map((t) => {
        let themes: Record<string, ThemeValue> | undefined;
        if (t.themes && shownThemes.size > 0) {
          themes = Object.fromEntries(
            [...shownThemes].map((name) => [name, t.themes![name]]),
          );
        }
        return {
          cssVariable: t.cssVariable,
          description: t.description,
          category: t.category,
          themed: t.themes ? true : undefined,
          themes,
        };
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ count: results.length, results }, null, 2),
          },
        ],
      };
    },
  );

  // -------------------------------------------------------------------------
  // get_token - Get full details for a specific token (deep dive)
  // -------------------------------------------------------------------------
  server.tool(
    "get_token",
    "Get full details for a specific design token including resolved values and alternatives. For a token that changes by agency theme, returns its value in every theme; for a palette primitive, lists the theme tokens that use it.",
    {
      theme: z
        .string()
        .optional()
        .describe(
          "Agency theme (default, admin, business, environment, health, local, safety, transportation). Sets cssValue and resolvedValue to that theme's value.",
        ),
      token: z
        .string()
        .describe(
          'CSS variable name (e.g., "--nys-color-text", "nys-color-text", "color-text", or "var(--nys-color-text)")',
        ),
    },
    TOKEN_TOOL_ANNOTATIONS,
    async ({ token, theme }) => {
      const invalid = checkTheme(theme, false);
      if (invalid) return themeError(invalid);
      const tokenInfo = getCSSTokenByVariable(token);

      if (!tokenInfo) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  error: `Token not found: ${token}`,
                  suggestion: "Use find_tokens to search for available tokens",
                },
                null,
                2,
              ),
            },
          ],
          isError: true,
        };
      }

      const alternatives = getAlternativeTokens(tokenInfo);
      const value = getTokenValueInTheme(tokenInfo, theme ?? "default");
      const usedByThemes = buildTokenGraph().get(
        tokenInfo.cssVariable,
      )?.usedByThemes;

      const result = {
        cssVariable: tokenInfo.cssVariable,
        theme,
        cssValue: value.cssValue,
        resolvedValue: value.resolvedValue,
        description: tokenInfo.description,
        category: tokenInfo.category,
        layer: tokenInfo.layer,
        themed: Boolean(tokenInfo.themes),
        themes: tokenInfo.themes,
        themeSelectors: tokenInfo.themes
          ? 'Apply a theme with [data-theme="<name>"] or .nys-theme-<name>; default is :root. See get_guide({ topic: "themes" }).'
          : undefined,
        usedByThemes: usedByThemes
          ? Object.entries(usedByThemes).map(([cssVariable, themes]) => ({
              cssVariable,
              themes,
            }))
          : undefined,
        alternatives,
        resourceUri: "nysds://tokens",
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );

  // -------------------------------------------------------------------------
  // get_token_graph - Token dependency graph
  // -------------------------------------------------------------------------
  server.tool(
    "get_token_graph",
    "Get the token dependency graph showing which tokens reference which and which are used by which. Themed tokens list their reference in every agency theme (themeReferences), and palette primitives list the theme tokens that use them (usedByThemes).",
    {
      filter: z
        .enum(["all", "aliases-only", "primitives-only", "most-used"])
        .default("all")
        .describe("Filter the graph to specific token types"),
      category: z
        .enum(CATEGORY_ENUM)
        .optional()
        .describe("Filter to a specific category"),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20)
        .describe("Maximum number of tokens to return (default: 20)"),
    },
    TOKEN_TOOL_ANNOTATIONS,
    async ({ filter, category, limit }) => {
      const graph = buildTokenGraph();
      const tokens = getCSSTokens();

      // Build lookup for categories
      const tokenCategories = new Map<string, string>();
      for (const t of tokens) {
        tokenCategories.set(t.cssVariable, t.category);
      }

      const allNodes = Array.from(graph.values());
      let nodes = allNodes;

      // Apply category filter
      if (category) {
        nodes = nodes.filter(
          (n) => tokenCategories.get(n.cssVariable) === category,
        );
      }

      // Apply type filter
      if (filter === "aliases-only") {
        nodes = nodes.filter((n) => n.referencesVariable);
      } else if (filter === "primitives-only") {
        nodes = nodes.filter((n) => !n.referencesVariable);
      } else if (filter === "most-used") {
        nodes = nodes.filter((n) => n.usedBy.length > 0);
        nodes.sort((a, b) => b.usedBy.length - a.usedBy.length);
      }

      // Apply limit
      nodes = nodes.slice(0, limit);
      const stats = {
        totalTokens: allNodes.length,
        aliasTokens: allNodes.filter((n) => n.referencesVariable).length,
        primitiveTokens: allNodes.filter((n) => !n.referencesVariable).length,
        mostUsed: allNodes
          .filter((n) => n.usedBy.length > 0)
          .sort((a, b) => b.usedBy.length - a.usedBy.length)
          .slice(0, 5)
          .map((n) => ({
            cssVariable: n.cssVariable,
            usedByCount: n.usedBy.length,
          })),
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                filter,
                category: category || "all",
                nodes: nodes.map((n) => ({
                  cssVariable: n.cssVariable,
                  referencesVariable: n.referencesVariable,
                  themeReferences: n.themeReferences,
                  usedBy: n.usedBy.length > 0 ? n.usedBy : undefined,
                  usedByThemes: n.usedByThemes,
                })),
                stats,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}

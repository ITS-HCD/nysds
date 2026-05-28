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
  type CSSTokenInfo,
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

// ============================================================================
// Tool Registration
// ============================================================================

export function registerTokenTools(server: McpServer): void {
  // -------------------------------------------------------------------------
  // find_tokens - Search or browse tokens (discovery)
  // -------------------------------------------------------------------------
  server.tool(
    "find_tokens",
    "Search or browse NYSDS design tokens. Omit query to list all. Returns CSS variable names for use with var().",
    {
      query: z
        .string()
        .optional()
        .describe(
          "Free-text search across token names and descriptions. Omit to list all.",
        ),
      category: z.enum(CATEGORY_ENUM).optional().describe("Filter by category"),
      include: z
        .enum(["recommended", "primitive", "all"])
        .default("recommended")
        .describe(
          "'recommended' (default) excludes color primitives; 'primitive' returns only primitives; 'all' returns everything",
        ),
    },
    TOKEN_TOOL_ANNOTATIONS,
    async ({ query, category, include }) => {
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

      // Apply query filter (case-insensitive match on cssVariable or description)
      if (query) {
        const lowerQuery = query.toLowerCase();
        tokens = tokens.filter(
          (t) =>
            t.cssVariable.toLowerCase().includes(lowerQuery) ||
            t.description?.toLowerCase().includes(lowerQuery),
        );
      }

      const results = tokens.map((t) => ({
        cssVariable: t.cssVariable,
        description: t.description,
        category: t.category,
      }));

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
    "Get full details for a specific design token including resolved values and alternatives.",
    {
      token: z
        .string()
        .describe(
          'CSS variable name (e.g., "--nys-color-text" or "color-text")',
        ),
    },
    TOKEN_TOOL_ANNOTATIONS,
    async ({ token }) => {
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

      const result = {
        cssVariable: tokenInfo.cssVariable,
        cssValue: tokenInfo.cssValue,
        resolvedValue: tokenInfo.resolvedValue,
        description: tokenInfo.description,
        category: tokenInfo.category,
        layer: tokenInfo.layer,
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
    "Get the token dependency graph showing which tokens reference which and which are used by which",
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
                  usedBy: n.usedBy.length > 0 ? n.usedBy : undefined,
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

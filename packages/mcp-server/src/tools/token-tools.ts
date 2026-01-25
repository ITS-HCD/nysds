/**
 * Token Tools
 *
 * MCP tools for working with NYSDS design tokens.
 *
 * Tools:
 * - get_design_tokens: Get tokens with filtering and options
 * - find_tokens: Search tokens by CSS variable, value, or description
 * - list_themes: List all 8 agency themes
 * - get_token_value: Get detailed info for a specific token
 * - validate_token_usage: Validate token usage in context
 * - list_token_categories: List categories with token counts
 * - get_token_graph: Get token dependency graph
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getCSSTokens,
  getCSSTokensByCategory,
  getCSSTokensByLayer,
  searchCSSTokens,
  getCSSTokenByVariable,
  getCSSTokenCategories,
  buildTokenGraph,
  type CSSTokenInfo,
} from "../lib/token-parser.js";

// ============================================================================
// Theme Data
// ============================================================================

interface ThemeInfo {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  selectors: string[];
}

const AGENCY_THEMES: ThemeInfo[] = [
  {
    id: "default",
    name: "Default (NY.gov)",
    description: "Default NY.gov theme for general state sites",
    primaryColor: "#154973",
    selectors: [":root", "[data-theme='default']", ".nys-theme-default"],
  },
  {
    id: "admin",
    name: "Administration",
    description: "For administrative and regulatory agencies",
    primaryColor: "#a2350a",
    selectors: ["[data-theme='admin']", ".nys-theme-admin"],
  },
  {
    id: "business",
    name: "Business",
    description: "For commerce and economic development agencies",
    primaryColor: "#084b52",
    selectors: ["[data-theme='business']", ".nys-theme-business"],
  },
  {
    id: "environment",
    name: "Environment",
    description: "For environmental and conservation agencies",
    primaryColor: "#233f2b",
    selectors: ["[data-theme='environment']", ".nys-theme-environment"],
  },
  {
    id: "health",
    name: "Health",
    description: "For health and human services agencies",
    primaryColor: "#43285d",
    selectors: ["[data-theme='health']", ".nys-theme-health"],
  },
  {
    id: "local",
    name: "Local Government",
    description: "For local government entities",
    primaryColor: "#402217",
    selectors: ["[data-theme='local']", ".nys-theme-local"],
  },
  {
    id: "safety",
    name: "Public Safety",
    description: "For public safety agencies",
    primaryColor: "#435d6e",
    selectors: ["[data-theme='safety']", ".nys-theme-safety"],
  },
  {
    id: "transportation",
    name: "Transportation",
    description: "For DOT and transit authorities",
    primaryColor: "#0b5583",
    selectors: ["[data-theme='transportation']", ".nys-theme-transportation"],
  },
];

// ============================================================================
// Token Context Validation
// ============================================================================

interface ValidationResult {
  valid: boolean;
  cssVariable: string;
  context: string;
  recommendations: string[];
  alternatives: string[];
  warnings?: string[];
}

/**
 * Get recommended pairings and validation for a token in a specific context
 */
function validateTokenInContext(
  token: CSSTokenInfo,
  context: "text" | "background" | "border" | "icon",
): ValidationResult {
  const recommendations: string[] = [];
  const alternatives: string[] = [];
  const warnings: string[] = [];
  let valid = true;

  const varName = token.cssVariable;

  // Context-specific validation rules
  if (context === "text") {
    if (varName.includes("-surface-")) {
      valid = false;
      warnings.push(
        "Surface colors should not be used for text. Use --nys-color-text-* tokens.",
      );
      alternatives.push(
        "--nys-color-text",
        "--nys-color-text-weak",
        "--nys-color-text-weaker",
      );
    } else if (varName.includes("-text-")) {
      recommendations.push(
        "Pair with --nys-color-surface for optimal contrast on light backgrounds",
      );
      recommendations.push(
        "Pair with --nys-color-surface-reverse for dark backgrounds",
      );
    } else if (varName.includes("-link-")) {
      recommendations.push("Ensure links are distinguishable from body text");
      recommendations.push("Include visible focus and hover states");
    } else if (varName.includes("-danger-") || varName.includes("-warning-")) {
      recommendations.push("Pair with corresponding icon for accessibility");
    }
  } else if (context === "background") {
    if (varName.includes("-text-")) {
      valid = false;
      warnings.push(
        "Text colors should not be used for backgrounds. Use --nys-color-surface-* tokens.",
      );
      alternatives.push(
        "--nys-color-surface",
        "--nys-color-surface-raised",
        "--nys-color-surface-reverse",
      );
    } else if (varName.includes("-surface-")) {
      if (varName.includes("-reverse")) {
        recommendations.push(
          "Use --nys-color-text-reverse for text on dark surfaces",
        );
      } else {
        recommendations.push("Use --nys-color-text for text on light surfaces");
      }
    } else if (
      varName.includes("-weak") &&
      (varName.includes("-success-") ||
        varName.includes("-info-") ||
        varName.includes("-warning-") ||
        varName.includes("-danger-"))
    ) {
      recommendations.push("Use for alert/notification backgrounds");
      recommendations.push(
        "Pair with corresponding -strong variant for text color",
      );
    }
  } else if (context === "border") {
    if (varName.includes("-base-")) {
      recommendations.push("Good for borders and dividers");
    } else if (varName.includes("-focus")) {
      recommendations.push("Reserved for focus ring outlines");
      recommendations.push("Use 2px solid for visible focus indication");
    } else if (varName.includes("-theme-")) {
      recommendations.push("Use for branded accent borders");
    }
  } else if (context === "icon") {
    if (varName.includes("-ink-")) {
      recommendations.push("Primary choice for icons");
      if (varName.includes("-reverse")) {
        recommendations.push("Use on dark backgrounds");
      }
    } else if (varName.includes("-text-")) {
      recommendations.push("Icons can use text colors for consistency");
    } else if (
      varName.includes("-success-") ||
      varName.includes("-danger-") ||
      varName.includes("-warning-") ||
      varName.includes("-info-")
    ) {
      recommendations.push(
        "Use for status icons to reinforce meaning with color",
      );
    }
  }

  // Find similar tokens as alternatives
  if (alternatives.length === 0) {
    const tokens = getCSSTokens();
    const category = token.category;
    const similar = tokens
      .filter(
        (t) =>
          t.category === category &&
          t.cssVariable !== varName &&
          ((context === "text" && t.cssVariable.includes("-text-")) ||
            (context === "background" && t.cssVariable.includes("-surface-")) ||
            (context === "border" && t.cssVariable.includes("-base-")) ||
            (context === "icon" && t.cssVariable.includes("-ink-"))),
      )
      .slice(0, 3)
      .map((t) => t.cssVariable);
    alternatives.push(...similar);
  }

  return {
    valid,
    cssVariable: token.cssVariable,
    context,
    recommendations,
    alternatives,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// ============================================================================
// Tool Registration
// ============================================================================

export function registerTokenTools(server: McpServer): void {
  // -------------------------------------------------------------------------
  // get_design_tokens - Enhanced token retrieval
  // -------------------------------------------------------------------------
  server.tool(
    "get_design_tokens",
    "Get NYSDS design tokens with optional filtering by category or layer. Returns CSS variable names and values.",
    {
      category: z
        .enum([
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
        ])
        .optional()
        .describe("Filter by token category"),
      layer: z
        .enum(["primitive", "applied", "base"])
        .optional()
        .describe(
          "Filter by token layer (primitive = raw values, applied = semantic tokens)",
        ),
      includeResolvedValues: z
        .boolean()
        .default(false)
        .describe("Include resolved hex/rem values for previews"),
      includeDescriptions: z
        .boolean()
        .default(true)
        .describe("Include token descriptions"),
    },
    async ({ category, layer, includeResolvedValues, includeDescriptions }) => {
      let tokens: CSSTokenInfo[];

      if (category) {
        tokens = getCSSTokensByCategory(category);
      } else if (layer) {
        tokens = getCSSTokensByLayer(layer);
      } else {
        tokens = getCSSTokens();
      }

      // Format output based on options
      const formatted = tokens.map((t) => {
        const result: Record<string, string | undefined> = {
          cssVariable: t.cssVariable,
          cssValue: t.cssValue,
        };

        if (t.referencesVariable) {
          result.referencesVariable = t.referencesVariable;
        }

        if (includeResolvedValues && t.resolvedValue) {
          result.resolvedValue = t.resolvedValue;
        }

        if (includeDescriptions && t.description) {
          result.description = t.description;
        }

        return result;
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                count: tokens.length,
                tokens: formatted,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // -------------------------------------------------------------------------
  // find_tokens - Search tokens
  // -------------------------------------------------------------------------
  server.tool(
    "find_tokens",
    "Search for design tokens by CSS variable name, value, or description",
    {
      query: z
        .string()
        .describe(
          "Search query to match against CSS variable names, values, and descriptions",
        ),
      category: z
        .enum([
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
        ])
        .optional()
        .describe("Optionally filter results to a specific category"),
    },
    async ({ query, category }) => {
      let results = searchCSSTokens(query);

      if (category) {
        results = results.filter(
          (t) => t.category.toLowerCase() === category.toLowerCase(),
        );
      }

      const formatted = results.map((t) => ({
        cssVariable: t.cssVariable,
        cssValue: t.cssValue,
        referencesVariable: t.referencesVariable,
        description: t.description,
        category: t.category,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                query,
                count: results.length,
                results: formatted,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // -------------------------------------------------------------------------
  // list_themes - List agency themes
  // -------------------------------------------------------------------------
  server.tool(
    "list_themes",
    "List all NYSDS agency themes with their selectors and primary colors",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                themes: AGENCY_THEMES,
                usage: {
                  htmlAttribute: '<html data-theme="admin">',
                  cssClass: '<body class="nys-theme-admin">',
                  cssCustomProperty: "Themes modify --nys-color-theme-* tokens",
                },
                totalThemes: AGENCY_THEMES.length,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // -------------------------------------------------------------------------
  // get_token_value - Get detailed token info
  // -------------------------------------------------------------------------
  server.tool(
    "get_token_value",
    "Get detailed information about a specific design token including its value, description, and which tokens use it",
    {
      token: z
        .string()
        .describe(
          'CSS variable name (e.g., "--nys-color-text" or "color-text")',
        ),
    },
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
                  suggestion:
                    "Try searching with find_tokens to discover available tokens",
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      // Get dependents (tokens that use this one)
      const graph = buildTokenGraph();
      const node = graph.get(tokenInfo.cssVariable);
      const usedBy = node?.usedBy || [];

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                cssVariable: tokenInfo.cssVariable,
                cssValue: tokenInfo.cssValue,
                referencesVariable: tokenInfo.referencesVariable,
                resolvedValue: tokenInfo.resolvedValue,
                description: tokenInfo.description,
                category: tokenInfo.category,
                layer: tokenInfo.layer,
                usedBy: usedBy.length > 0 ? usedBy : undefined,
                usage: `var(${tokenInfo.cssVariable})`,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // -------------------------------------------------------------------------
  // validate_token_usage - Validate token in context
  // -------------------------------------------------------------------------
  server.tool(
    "validate_token_usage",
    "Validate whether a token is appropriate for a specific usage context (text, background, border, icon)",
    {
      token: z
        .string()
        .describe(
          'CSS variable name (e.g., "--nys-color-text" or "color-text")',
        ),
      context: z
        .enum(["text", "background", "border", "icon"])
        .describe("How the token will be used"),
    },
    async ({ token, context }) => {
      const tokenInfo = getCSSTokenByVariable(token);

      if (!tokenInfo) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  error: `Token not found: ${token}`,
                  suggestion:
                    "Try searching with find_tokens to discover available tokens",
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      const validation = validateTokenInContext(tokenInfo, context);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(validation, null, 2),
          },
        ],
      };
    },
  );

  // -------------------------------------------------------------------------
  // list_token_categories - List categories with counts
  // -------------------------------------------------------------------------
  server.tool(
    "list_token_categories",
    "List all token categories with the number of tokens in each",
    {},
    async () => {
      const categories = getCSSTokenCategories();
      const total = categories.reduce((sum, c) => sum + c.count, 0);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                categories,
                totalTokens: total,
              },
              null,
              2,
            ),
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
        .enum([
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
        ])
        .optional()
        .describe("Filter to a specific category"),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(50)
        .describe("Maximum number of tokens to return"),
    },
    async ({ filter, category, limit }) => {
      const graph = buildTokenGraph();
      const tokens = getCSSTokens();

      // Build lookup for categories
      const tokenCategories = new Map<string, string>();
      for (const t of tokens) {
        tokenCategories.set(t.cssVariable, t.category);
      }

      let nodes = Array.from(graph.values());

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

      // Calculate stats
      const allNodes = Array.from(graph.values());
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

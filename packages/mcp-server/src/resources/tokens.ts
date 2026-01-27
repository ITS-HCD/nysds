/**
 * Token Resources
 *
 * MCP resources for NYSDS design tokens.
 *
 * Resources:
 * - nysds://tokens - All tokens in CSS-centric format
 * - nysds://tokens/css - Raw tokens.css file content
 * - nysds://tokens/graph - Token dependency graph with stats
 * - nysds://tokens/color - Color tokens only
 * - nysds://tokens/font - Typography tokens
 * - nysds://tokens/space - Spacing tokens
 * - nysds://tokens/size - Size tokens
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getCSSTokens,
  getCSSTokensByCategory,
  getCSSTokenCategories,
  buildTokenGraph,
  getTokensCSS,
} from "../lib/token-parser.js";

export function registerTokenResources(server: McpServer): void {
  // ---------------------------------------------------------------------------
  // nysds://tokens - All design tokens in CSS-centric format
  // ---------------------------------------------------------------------------
  server.resource(
    "tokens",
    "nysds://tokens",
    {
      description:
        "All NYSDS design tokens with CSS variable names, values, and descriptions",
      mimeType: "application/json",
    },
    async () => {
      const tokens = getCSSTokens();
      const categories = getCSSTokenCategories();

      const formatted = tokens.map((t) => ({
        cssVariable: t.cssVariable,
        cssValue: t.cssValue,
        referencesVariable: t.referencesVariable,
        resolvedValue: t.resolvedValue,
        description: t.description,
        category: t.category,
        layer: t.layer,
      }));

      return {
        contents: [
          {
            uri: "nysds://tokens",
            mimeType: "application/json",
            text: JSON.stringify(
              {
                totalTokens: tokens.length,
                categories: categories.map((c) => c.category),
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

  // ---------------------------------------------------------------------------
  // nysds://tokens/css - Raw tokens.css file content
  // ---------------------------------------------------------------------------
  server.resource(
    "tokens-css",
    "nysds://tokens/css",
    {
      description: "Raw tokens.css file content for direct CSS usage",
      mimeType: "text/css",
    },
    async () => {
      const css = getTokensCSS();

      if (!css) {
        return {
          contents: [
            {
              uri: "nysds://tokens/css",
              mimeType: "text/plain",
              text: "/* tokens.css not found. Run 'npm run build -w packages/tokens' to generate. */",
            },
          ],
        };
      }

      return {
        contents: [
          {
            uri: "nysds://tokens/css",
            mimeType: "text/css",
            text: css,
          },
        ],
      };
    },
  );

  // ---------------------------------------------------------------------------
  // nysds://tokens/graph - Token dependency graph with stats
  // ---------------------------------------------------------------------------
  server.resource(
    "tokens-graph",
    "nysds://tokens/graph",
    {
      description:
        "Token dependency graph showing which tokens reference which and usage statistics",
      mimeType: "application/json",
    },
    async () => {
      const graph = buildTokenGraph();
      const nodes = Array.from(graph.values());

      // Calculate statistics
      const aliasTokens = nodes.filter((n) => n.referencesVariable);
      const primitiveTokens = nodes.filter((n) => !n.referencesVariable);
      const usedTokens = nodes.filter((n) => n.usedBy.length > 0);

      // Find most referenced tokens
      const mostReferenced = [...usedTokens]
        .sort((a, b) => b.usedBy.length - a.usedBy.length)
        .slice(0, 10)
        .map((n) => ({
          cssVariable: n.cssVariable,
          usedByCount: n.usedBy.length,
          usedBy: n.usedBy.slice(0, 5),
        }));

      // Build a simplified graph representation
      const graphData = nodes
        .filter((n) => n.referencesVariable || n.usedBy.length > 0)
        .map((n) => ({
          cssVariable: n.cssVariable,
          referencesVariable: n.referencesVariable,
          usedBy: n.usedBy.length > 0 ? n.usedBy : undefined,
        }));

      return {
        contents: [
          {
            uri: "nysds://tokens/graph",
            mimeType: "application/json",
            text: JSON.stringify(
              {
                stats: {
                  totalTokens: nodes.length,
                  aliasTokens: aliasTokens.length,
                  primitiveTokens: primitiveTokens.length,
                  tokensWithDependents: usedTokens.length,
                },
                mostReferenced,
                graph: graphData,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // ---------------------------------------------------------------------------
  // nysds://tokens/color - Color tokens only
  // ---------------------------------------------------------------------------
  server.resource(
    "tokens-color",
    "nysds://tokens/color",
    {
      description:
        "All NYSDS color tokens including primitives, semantic colors, and theme colors",
      mimeType: "application/json",
    },
    async () => {
      const tokens = getCSSTokensByCategory("color");

      // Group by layer for better organization
      const primitive = tokens.filter((t) => t.layer === "primitive");
      const applied = tokens.filter((t) => t.layer === "applied");
      const base = tokens.filter(
        (t) => t.layer === "base" || t.layer === "color",
      );

      const formatToken = (t: (typeof tokens)[0]) => ({
        cssVariable: t.cssVariable,
        cssValue: t.cssValue,
        referencesVariable: t.referencesVariable,
        resolvedValue: t.resolvedValue,
        description: t.description,
      });

      return {
        contents: [
          {
            uri: "nysds://tokens/color",
            mimeType: "application/json",
            text: JSON.stringify(
              {
                totalColors: tokens.length,
                layers: {
                  primitive: {
                    count: primitive.length,
                    description:
                      "Raw color values - reference these via applied tokens",
                    tokens: primitive.map(formatToken),
                  },
                  applied: {
                    count: applied.length,
                    description: "Semantic color tokens - use these in code",
                    tokens: applied.map(formatToken),
                  },
                  theme: {
                    count: base.length,
                    description: "Theme-aware colors that change per agency",
                    tokens: base.map(formatToken),
                  },
                },
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // ---------------------------------------------------------------------------
  // nysds://tokens/font - Typography tokens
  // ---------------------------------------------------------------------------
  server.resource(
    "tokens-font",
    "nysds://tokens/font",
    {
      description:
        "All NYSDS typography tokens including font families, sizes, weights, and line heights",
      mimeType: "application/json",
    },
    async () => {
      const tokens = getCSSTokensByCategory("font");

      // Group by subcategory based on CSS variable name
      const families = tokens.filter((t) =>
        t.cssVariable.includes("-font-family-"),
      );
      const sizes = tokens.filter((t) => t.cssVariable.includes("-font-size-"));
      const weights = tokens.filter((t) =>
        t.cssVariable.includes("-font-weight-"),
      );
      const lineHeights = tokens.filter((t) =>
        t.cssVariable.includes("-font-lineheight-"),
      );
      const letterSpacing = tokens.filter((t) =>
        t.cssVariable.includes("-font-letterspacing-"),
      );

      const formatToken = (t: (typeof tokens)[0]) => ({
        cssVariable: t.cssVariable,
        cssValue: t.cssValue,
        resolvedValue: t.resolvedValue,
        description: t.description,
      });

      return {
        contents: [
          {
            uri: "nysds://tokens/font",
            mimeType: "application/json",
            text: JSON.stringify(
              {
                totalTypography: tokens.length,
                groups: {
                  families: {
                    count: families.length,
                    description: "Font family stacks",
                    tokens: families.map(formatToken),
                  },
                  sizes: {
                    count: sizes.length,
                    description: "Font sizes for different contexts",
                    tokens: sizes.map(formatToken),
                  },
                  weights: {
                    count: weights.length,
                    description: "Font weight values",
                    tokens: weights.map(formatToken),
                  },
                  lineHeights: {
                    count: lineHeights.length,
                    description: "Line height values",
                    tokens: lineHeights.map(formatToken),
                  },
                  letterSpacing: {
                    count: letterSpacing.length,
                    description: "Letter spacing adjustments",
                    tokens: letterSpacing.map(formatToken),
                  },
                },
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // ---------------------------------------------------------------------------
  // nysds://tokens/space - Spacing tokens
  // ---------------------------------------------------------------------------
  server.resource(
    "tokens-space",
    "nysds://tokens/space",
    {
      description:
        "All NYSDS spacing tokens for margins, padding, and gaps. Based on an 8px grid.",
      mimeType: "application/json",
    },
    async () => {
      const tokens = getCSSTokensByCategory("space");

      const formatToken = (t: (typeof tokens)[0]) => ({
        cssVariable: t.cssVariable,
        cssValue: t.cssValue,
        resolvedValue: t.resolvedValue,
        description: t.description,
      });

      // Sort by numeric value if possible
      const sorted = [...tokens].sort((a, b) => {
        const aNum = parseFloat(a.resolvedValue || "0");
        const bNum = parseFloat(b.resolvedValue || "0");
        return aNum - bNum;
      });

      return {
        contents: [
          {
            uri: "nysds://tokens/space",
            mimeType: "application/json",
            text: JSON.stringify(
              {
                totalSpacing: tokens.length,
                description:
                  "Spacing scale based on 8px base unit. Use for margins, padding, and gaps.",
                tokens: sorted.map(formatToken),
                usage: {
                  padding: "padding: var(--nys-space-200);",
                  margin: "margin-block: var(--nys-space-400);",
                  gap: "gap: var(--nys-space-100);",
                },
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // ---------------------------------------------------------------------------
  // nysds://tokens/size - Size tokens
  // ---------------------------------------------------------------------------
  server.resource(
    "tokens-size",
    "nysds://tokens/size",
    {
      description:
        "All NYSDS size tokens for widths, heights, and component dimensions",
      mimeType: "application/json",
    },
    async () => {
      const tokens = getCSSTokensByCategory("size");

      const formatToken = (t: (typeof tokens)[0]) => ({
        cssVariable: t.cssVariable,
        cssValue: t.cssValue,
        resolvedValue: t.resolvedValue,
        description: t.description,
      });

      // Sort by numeric value if possible
      const sorted = [...tokens].sort((a, b) => {
        const aNum = parseFloat(a.resolvedValue || "0");
        const bNum = parseFloat(b.resolvedValue || "0");
        return aNum - bNum;
      });

      return {
        contents: [
          {
            uri: "nysds://tokens/size",
            mimeType: "application/json",
            text: JSON.stringify(
              {
                totalSizes: tokens.length,
                description:
                  "Size tokens for component dimensions, icon sizes, and fixed widths/heights.",
                tokens: sorted.map(formatToken),
                usage: {
                  iconSize:
                    "width: var(--nys-size-200); height: var(--nys-size-200);",
                  minHeight: "min-height: var(--nys-size-400);",
                  componentSize: "inline-size: var(--nys-size-600);",
                },
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

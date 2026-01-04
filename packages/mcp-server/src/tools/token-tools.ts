/**
 * Token Tools
 *
 * MCP tools for working with NYSDS design tokens.
 *
 * P0 Tools:
 * - get_design_tokens: Token values by category
 *
 * P1 Tools:
 * - find_tokens: Search tokens by name/value
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllTokens, getTokensByCategory, searchTokens } from "../lib/token-parser.js";

export function registerTokenTools(server: McpServer): void {
  // get_design_tokens - Token values by category
  server.tool(
    "get_design_tokens",
    "Get NYSDS design tokens, optionally filtered by category (color, spacing, typography, etc.)",
    {
      category: z
        .string()
        .optional()
        .describe("Token category to filter by (e.g., 'color', 'spacing', 'typography'). If omitted, returns all tokens."),
    },
    async ({ category }) => {
      const tokens = category ? getTokensByCategory(category) : getAllTokens();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(tokens, null, 2),
          },
        ],
      };
    }
  );

  // find_tokens - Search tokens by name/value (P1)
  server.tool(
    "find_tokens",
    "Search for design tokens by name or value",
    {
      query: z.string().describe("Search query to match against token names and values"),
    },
    async ({ query }) => {
      const results = searchTokens(query);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }
  );
}

/**
 * Token Resources
 *
 * MCP resources for NYSDS design tokens.
 *
 * P0 Resources:
 * - nysds://tokens - All design tokens
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllTokens } from "../lib/token-parser.js";

export function registerTokenResources(server: McpServer): void {
  // nysds://tokens - All design tokens
  server.resource(
    "tokens",
    "nysds://tokens",
    {
      description: "All NYSDS design tokens (colors, spacing, typography, etc.)",
      mimeType: "application/json",
    },
    async () => {
      const tokens = getAllTokens();

      return {
        contents: [
          {
            uri: "nysds://tokens",
            mimeType: "application/json",
            text: JSON.stringify(tokens, null, 2),
          },
        ],
      };
    }
  );
}

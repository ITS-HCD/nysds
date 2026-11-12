/**
 * Guide Resources
 *
 * MCP resources for NYSDS installation and usage guides.
 *
 * P0 Resources:
 * - nysds://installation - Installation guide (same file get_guide serves)
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { loadGuide } from "../tools/guide-tools.js";

export function registerGuideResources(server: McpServer): void {
  // nysds://installation - Installation guide
  server.resource(
    "installation",
    "nysds://installation",
    {
      description: "NYSDS installation and setup guide",
      mimeType: "text/markdown",
    },
    async () => {
      const guide = loadGuide("installation.md");

      return {
        contents: [
          {
            uri: "nysds://installation",
            mimeType: "text/markdown",
            text: guide,
          },
        ],
      };
    },
  );
}

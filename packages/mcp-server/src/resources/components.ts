/**
 * Component Resources
 *
 * MCP resources for NYSDS component documentation.
 *
 * P0 Resources:
 * - nysds://components - Component overview list
 * - nysds://component/{tag} - Individual component docs
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllComponents, getComponent } from "../lib/cem-parser.js";

export function registerComponentResources(server: McpServer): void {
  // nysds://components - Component overview list
  server.resource(
    "components",
    "nysds://components",
    {
      description: "List of all NYSDS web components with summaries",
      mimeType: "application/json",
    },
    async () => {
      const components = getAllComponents();
      const list = components.map((c) => ({
        tagName: c.tagName,
        name: c.name,
        summary: c.summary || c.description?.split("\n")[0] || "No description",
      }));

      return {
        contents: [
          {
            uri: "nysds://components",
            mimeType: "application/json",
            text: JSON.stringify(list, null, 2),
          },
        ],
      };
    }
  );

  // nysds://component/{tag} - Individual component docs
  server.resource(
    "component",
    "nysds://component/{tag}",
    {
      description: "Full documentation for a specific NYSDS component",
      mimeType: "application/json",
    },
    async (uri) => {
      // Extract tag from URI: nysds://component/nys-button -> nys-button
      const tag = uri.pathname.split("/").pop() || "";
      const component = getComponent(tag);

      if (!component) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/plain",
              text: `Component "${tag}" not found`,
            },
          ],
        };
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(component, null, 2),
          },
        ],
      };
    }
  );
}

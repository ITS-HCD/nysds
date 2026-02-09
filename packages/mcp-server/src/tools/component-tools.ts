/**
 * Component Tools
 *
 * MCP tools for working with NYSDS components.
 *
 * Tools:
 * - find_components: Search or list all components
 * - get_component: Full documentation for a specific component
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getComponent, getAllComponents } from "../lib/cem-parser.js";
import { searchComponents } from "../lib/search.js";

export function registerComponentTools(server: McpServer): void {
  // find_components - Search or list all components
  server.tool(
    "find_components",
    "Search for NYSDS components by name or description. Omit query to list all components.",
    {
      query: z
        .string()
        .optional()
        .describe(
          "Search query to match against component names and descriptions. Omit to list all components.",
        ),
    },
    async ({ query }) => {
      // If no query, return all components
      if (!query || query.trim() === "") {
        const components = getAllComponents();
        const list = components.map((c) => ({
          tagName: c.tagName,
          name: c.name,
          summary:
            c.summary || c.description?.split("\n")[0] || "No description",
          resourceUri: `nysds://component/${c.tagName}`,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(list, null, 2),
            },
          ],
        };
      }

      // Otherwise search
      const results = searchComponents(query).map((r) => ({
        ...r,
        resourceUri: `nysds://component/${r.tagName}`,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    },
  );

  // get_component - Full documentation for a specific component
  server.tool(
    "get_component",
    "Get full documentation for a specific NYSDS component including properties, events, slots, and CSS custom properties",
    {
      tagName: z
        .string()
        .describe("The tag name of the component (e.g., 'nys-button')"),
    },
    async ({ tagName }) => {
      const component = getComponent(tagName);

      if (!component) {
        return {
          content: [
            {
              type: "text",
              text: `Component "${tagName}" not found. Use find_components to see available components.`,
            },
          ],
          isError: true,
        };
      }

      // Remove members array to avoid duplication with attributes
      // Attributes contains the HTML API, members duplicates this plus private methods
      const { members: _members, ...componentWithoutMembers } = component;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              ...componentWithoutMembers,
              resourceUri: `nysds://component/${tagName}`,
            }, null, 2),
          },
        ],
      };
    },
  );
}

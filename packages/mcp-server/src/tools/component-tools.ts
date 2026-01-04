/**
 * Component Tools
 *
 * MCP tools for working with NYSDS components.
 *
 * P0 Tools:
 * - list_components: List all NYSDS components with summaries
 * - get_component_docs: Full documentation for a specific component
 * - find_components: Search by name/description (fuzzy)
 * - get_usage_guide: Installation and usage patterns
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getComponent, getAllComponents } from "../lib/cem-parser.js";
import { searchComponents } from "../lib/search.js";

export function registerComponentTools(server: McpServer): void {
  // list_components - List all NYSDS components with summaries
  server.tool(
    "list_components",
    "List all NYSDS web components with their tag names and brief descriptions",
    {},
    async () => {
      const components = getAllComponents();
      const list = components.map((c) => ({
        tagName: c.tagName,
        name: c.name,
        summary: c.summary || c.description?.split("\n")[0] || "No description",
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
  );

  // get_component_docs - Full documentation for a specific component
  server.tool(
    "get_component_docs",
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
              text: `Component "${tagName}" not found. Use list_components to see available components.`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(component, null, 2),
          },
        ],
      };
    }
  );

  // find_components - Search by name/description
  server.tool(
    "find_components",
    "Search for NYSDS components by name or description",
    {
      query: z.string().describe("Search query to match against component names and descriptions"),
    },
    async ({ query }) => {
      const results = searchComponents(query);

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

  // get_usage_guide - Installation and usage patterns
  server.tool(
    "get_usage_guide",
    "Get installation and usage guide for NYSDS components",
    {},
    async () => {
      const guide = `# NYSDS Component Usage Guide

## Installation

\`\`\`bash
npm install @nysds/components
\`\`\`

## Basic Usage

Import components individually:

\`\`\`javascript
import '@nysds/components/nys-button';
import '@nysds/components/nys-alert';
\`\`\`

Or import all components:

\`\`\`javascript
import '@nysds/components';
\`\`\`

## Using Components in HTML

\`\`\`html
<nys-button label="Click me" variant="primary"></nys-button>
<nys-alert type="info">This is an informational message.</nys-alert>
\`\`\`

## CSS Custom Properties

NYSDS components use CSS custom properties for theming. Import the base styles:

\`\`\`css
@import '@nysds/components/dist/styles.css';
\`\`\`

Use the get_design_tokens tool to explore available tokens.
`;

      return {
        content: [
          {
            type: "text",
            text: guide,
          },
        ],
      };
    }
  );
}

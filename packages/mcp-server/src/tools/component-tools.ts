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
import { isPublicMember } from "@nysds/codegen";
import { getComponent, getAllComponents } from "../lib/cem-parser.js";
import { searchComponents } from "../lib/search.js";
import {
  getIconNames,
  iconAttributes,
  ICON_GUIDE_POINTER,
} from "../lib/icons.js";
import {
  buildExampleSnippets,
  type FrameworkFilter,
} from "../lib/framework-snippets.js";
import {
  buildAngularUsageNotes,
  buildReactUsageNotes,
  buildVueUsageNotes,
} from "../lib/framework-usage.js";

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
    "Get full documentation for a specific NYSDS component including properties, events, slots, and CSS custom properties. Set framework to 'react', 'angular', or 'vue' to get that framework's import line, event naming, and forms guidance alongside HTML/React/Angular code examples.",
    {
      tagName: z
        .string()
        .describe("The tag name of the component (e.g., 'nys-button')"),
      includeExamples: z
        .boolean()
        .default(false)
        .describe(
          "Include code examples from component JSDoc. Set to true when you need usage patterns. Each example carries html, react, and angular snippets.",
        ),
      framework: z
        .enum(["html", "react", "angular", "vue"])
        .default("html")
        .describe(
          "Which framework to optimize the response for. 'html' (default) returns plain custom-element usage. 'react', 'angular', and 'vue' add framework-specific usage notes (import line, event naming, forms binding). For a form-control component, 'react' and 'angular' also transform that framework's example snippets into its idiomatic controlled/reactive-forms pattern; Vue templates use the HTML snippets as written.",
        ),
    },
    async ({ tagName, includeExamples, framework }) => {
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

      const { members, examples, formControl, ...rest } = component;

      // Keep only the public API, and describe each attribute once: drop
      // private, protected, deprecated and Lit-internal members (the same
      // rule the framework wrappers use), and fields `attributes` already
      // covers. Public methods such as focus() and property-only fields stay.
      const attributeFields = new Set(
        (component.attributes ?? []).map((a) => a.fieldName ?? a.name),
      );
      const publicMembers = members?.filter(
        (m) =>
          isPublicMember(m) &&
          !(m.kind === "field" && attributeFields.has(m.name)),
      );

      // Icon-name attributes get the built-in NYSDS icon set, so agents pick
      // a name that renders.
      const iconAttrs = iconAttributes(component);
      const iconNames = getIconNames();
      const icons =
        iconAttrs.length > 0 && iconNames.length > 0
          ? {
              attributes: iconAttrs,
              names: iconNames,
              note: ICON_GUIDE_POINTER,
            }
          : undefined;

      const usage: Record<string, unknown> = {};
      if (framework === "react") {
        usage.react = buildReactUsageNotes(
          tagName,
          component.name,
          formControl,
        );
      } else if (framework === "angular") {
        usage.angular = buildAngularUsageNotes(
          tagName,
          component.name,
          formControl,
        );
      } else if (framework === "vue") {
        usage.vue = buildVueUsageNotes(component.name, formControl);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ...rest,
                members: publicMembers?.length ? publicMembers : undefined,
                formControl,
                icons,
                examples:
                  includeExamples && examples && examples.length > 0
                    ? buildExampleSnippets(
                        examples,
                        framework as FrameworkFilter,
                        formControl,
                      )
                    : undefined,
                usage: Object.keys(usage).length > 0 ? usage : undefined,
                resourceUri: `nysds://component/${component.tagName}`,
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

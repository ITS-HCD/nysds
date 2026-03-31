/**
 * Validation Tools
 *
 * MCP tools for validating NYSDS component usage.
 *
 * Tools:
 * - validate_component_api: Validate prop/attribute usage
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getComponent } from "../lib/cem-parser.js";

export function registerValidationTools(server: McpServer): void {
  // validate_component_api - Validate prop/attribute usage
  server.tool(
    "validate_component_api",
    "Validate that the provided attributes/properties are valid for a given NYSDS component",
    {
      tagName: z
        .string()
        .describe("The tag name of the component (e.g., 'nys-button')"),
      attributes: z
        .record(z.string())
        .describe("Object of attribute names and values to validate"),
    },
    async ({ tagName, attributes }) => {
      const component = getComponent(tagName);

      if (!component) {
        return {
          content: [
            {
              type: "text",
              text: `Component "${tagName}" not found.`,
            },
          ],
          isError: true,
        };
      }

      const validAttributes = new Set(
        component.attributes?.map((a) => a.name) || [],
      );
      const validProperties = new Set(
        component.members
          ?.filter((m) => m.kind === "field")
          .map((m) => m.name) || [],
      );

      const errors: string[] = [];
      const warnings: string[] = [];

      for (const attr of Object.keys(attributes)) {
        if (!validAttributes.has(attr) && !validProperties.has(attr)) {
          errors.push(`Unknown attribute/property: "${attr}"`);
        }
      }

      const result = {
        valid: errors.length === 0,
        errors,
        warnings,
        validAttributes: Array.from(validAttributes),
        validProperties: Array.from(validProperties),
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
}

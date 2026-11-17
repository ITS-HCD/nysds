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
import { isPublicProp, normalizeTypeText } from "@nysds/codegen";
import { getComponent } from "../lib/cem-parser.js";

// HTML global attributes: valid on every element, custom elements included.
// aria-*, data-*, and on* handlers are matched by prefix below.
const GLOBAL_ATTRIBUTES = new Set([
  "accesskey",
  "autocapitalize",
  "autofocus",
  "class",
  "contenteditable",
  "dir",
  "draggable",
  "enterkeyhint",
  "exportparts",
  "hidden",
  "id",
  "inert",
  "inputmode",
  "is",
  "itemid",
  "itemprop",
  "itemref",
  "itemscope",
  "itemtype",
  "lang",
  "nonce",
  "part",
  "popover",
  "role",
  "slot",
  "spellcheck",
  "style",
  "tabindex",
  "title",
  "translate",
]);

interface ApiEntry {
  name: string;
  type?: string;
}

/**
 * Allowed values when a type is a union of string literals
 * (`"sm" | "md" | "lg"`), else undefined. `undefined`/`null` members are
 * skipped; any other non-literal member means the type is open.
 */
function stringLiteralValues(
  typeText: string | undefined,
): string[] | undefined {
  const normalized = normalizeTypeText(typeText);
  if (!normalized) return undefined;
  const values: string[] = [];
  for (const part of normalized.split("|").map((p) => p.trim())) {
    if (part === "undefined" || part === "null") continue;
    const literal = part.match(/^(["'])(.*)\1$/);
    if (!literal) return undefined;
    values.push(literal[2]);
  }
  return values.length > 0 ? values : undefined;
}

const compact = (name: string) => name.toLowerCase().replace(/[-_]/g, "");

export function registerValidationTools(server: McpServer): void {
  // validate_component_api - Validate prop/attribute usage
  server.tool(
    "validate_component_api",
    "Validate that the provided attributes/properties are valid for a given NYSDS component. Checks names (case-insensitive, like HTML), enum values, and nys-* event bindings. HTML global attributes (class, style, slot, aria-*, data-*) are accepted. Lit binding prefixes (.prop, ?attr, @event) are understood.",
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
              text: `Component "${tagName}" not found. Use find_components to see available components.`,
            },
          ],
          isError: true,
        };
      }

      const attrEntries: ApiEntry[] = (component.attributes || []).map((a) => ({
        name: a.name,
        type: a.type?.text,
      }));
      const propEntries: ApiEntry[] = (component.members || [])
        .filter((m) => isPublicProp(m))
        .map((m) => ({ name: m.name, type: m.type?.text }));
      const eventNames = new Set((component.events || []).map((e) => e.name));

      const byLowerName = new Map<string, ApiEntry>();
      for (const entry of [...propEntries, ...attrEntries]) {
        byLowerName.set(entry.name.toLowerCase(), entry);
      }

      const errors: string[] = [];
      const warnings: string[] = [];

      for (const [rawKey, value] of Object.entries(attributes)) {
        const binding = /^[.?@]/.test(rawKey) ? rawKey[0] : "";
        const key = binding ? rawKey.slice(1) : rawKey;
        const lower = key.toLowerCase();

        if (binding === "@") {
          if (lower.startsWith("nys-") && !eventNames.has(lower)) {
            errors.push(
              `Unknown event: "${key}". ${tagName} emits: ${[...eventNames].join(", ") || "no custom events"}`,
            );
          }
          continue;
        }

        const entry = byLowerName.get(lower);
        if (entry) {
          // A bound value is an expression, not the literal attribute value.
          if (binding) continue;
          const allowed = stringLiteralValues(entry.type);
          if (allowed && !allowed.includes(value)) {
            errors.push(
              `Invalid value "${value}" for "${entry.name}". Expected one of: ${allowed.map((v) => `"${v}"`).join(", ")}`,
            );
          } else if (
            normalizeTypeText(entry.type) === "boolean" &&
            value.toLowerCase() === "false"
          ) {
            warnings.push(
              `"${entry.name}" is a boolean attribute: its presence means true, so "${value}" still turns it on. Remove the attribute instead.`,
            );
          }
          continue;
        }

        if (lower.startsWith("aria-")) {
          const prop = byLowerName.get(compact(lower));
          if (prop) {
            warnings.push(
              `"${key}" lands on the host element. ${tagName} exposes "${prop.name}" for this; use that so it reaches the inner control.`,
            );
          }
          continue;
        }

        if (
          GLOBAL_ATTRIBUTES.has(lower) ||
          lower.startsWith("data-") ||
          /^on[a-z]+$/.test(lower)
        ) {
          continue;
        }

        const suggestion = [...byLowerName.values()].find(
          (e) => compact(e.name) === compact(key),
        );
        errors.push(
          suggestion
            ? `Unknown attribute/property: "${key}". Did you mean "${suggestion.name}"?`
            : `Unknown attribute/property: "${key}"`,
        );
      }

      const result = {
        valid: errors.length === 0,
        errors,
        warnings,
        validAttributes: attrEntries.map((e) => e.name),
        validProperties: propEntries.map((e) => e.name),
        events: [...eventNames],
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

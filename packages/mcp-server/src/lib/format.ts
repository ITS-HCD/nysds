/**
 * Format Utilities
 *
 * Helpers for formatting MCP tool responses.
 */

/**
 * JSON replacer that strips null and undefined values from objects.
 * Use with JSON.stringify(obj, stripNulls, 2) for cleaner output.
 */
export function stripNulls(_key: string, value: unknown): unknown {
  if (value === null || value === undefined) {
    return undefined; // Omit from output
  }
  if (Array.isArray(value) && value.length === 0) {
    return undefined; // Omit empty arrays
  }
  return value;
}

/**
 * Format an object as JSON, stripping null/undefined values and empty arrays.
 */
export function formatResponse(data: unknown): string {
  return JSON.stringify(data, stripNulls, 2);
}

/**
 * Create a text content response for MCP tools.
 */
export function textContent(data: unknown): { type: "text"; text: string } {
  return {
    type: "text",
    text: formatResponse(data),
  };
}

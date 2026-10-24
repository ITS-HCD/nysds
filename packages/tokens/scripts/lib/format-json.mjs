/**
 * JSON.stringify with 2-space indent, except objects and arrays whose values
 * are all primitives (or arrays of primitives) stay on one line — so color and
 * dimension objects and fontFamily lists read as single values.
 */
export function formatJSON(value) {
  return `${format(value, "")}\n`;
}

const isPrimitive = (v) => v === null || typeof v !== "object";
const isFlat = (v) =>
  Array.isArray(v)
    ? v.every(isPrimitive)
    : Object.values(v).every((x) => isPrimitive(x) || (Array.isArray(x) && x.every(isPrimitive)));

function format(value, indent) {
  if (isPrimitive(value)) return JSON.stringify(value);
  const isArray = Array.isArray(value);
  const entries = isArray ? value : Object.entries(value);
  if (entries.length === 0) return isArray ? "[]" : "{}";

  // Inline flat containers, but only token values (not groups that happen to be flat)
  if (isFlat(value) && (isArray || !Object.keys(value).some((k) => k.startsWith("$")))) {
    return isArray
      ? `[${value.map((v) => JSON.stringify(v)).join(", ")}]`
      : `{ ${entries.map(([k, v]) => `${JSON.stringify(k)}: ${format(v, "")}`).join(", ")} }`;
  }

  const inner = indent + "  ";
  const lines = isArray
    ? value.map((v) => inner + format(v, inner))
    : entries.map(([k, v]) => `${inner}${JSON.stringify(k)}: ${format(v, inner)}`);
  return `${isArray ? "[" : "{"}\n${lines.join(",\n")}\n${indent}${isArray ? "]" : "}"}`;
}

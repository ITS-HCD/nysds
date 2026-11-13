/**
 * Token id → CSS custom property name. Shared by terrazzo.config.js and the
 * migration scripts so both always agree on naming.
 * @param {string} id dot-separated token id, e.g. "primitive.color.blue.600"
 */
export function variableName(id) {
  // Convert dots to dashes and add prefix
  let name = `--nys-${id.replace(/\./g, "-")}`;
  // Strip layer prefixes: primitive, applied, appearance, theme
  // (e.g., "primitive.color.blue.600" → "--nys-color-blue-600")
  // (e.g., "applied.color.text.default" → "--nys-color-text")
  name = name.replace(/--nys-(primitive|applied|appearance|theme)-/, "--nys-");
  // Legacy: also strip nested -primitive- and -semantic- if present
  name = name.replace(/-primitive-/, "-");
  name = name.replace(/-semantic-/, "-");
  // Remove "-default" suffix for backward compatibility
  // (e.g., "color.theme.default" → "--nys-color-theme")
  return name.replace(/-default$/, "");
}

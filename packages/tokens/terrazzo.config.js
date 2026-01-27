import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";

export default defineConfig({
  tokens: ["./src/tokens.json"],
  outDir: "./dist/",
  plugins: [
    css({
      filename: "tokens.css",
      legacyHex: true,
      variableName: (id) => {
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
      },
      modeSelectors: [
        // Default theme (State Blue) uses :root, no special selector needed
        { mode: "admin", selectors: ['[data-theme="admin"]', ".nys-theme-admin"] },
        { mode: "business", selectors: ['[data-theme="business"]', ".nys-theme-business"] },
        { mode: "environment", selectors: ['[data-theme="environment"]', ".nys-theme-environment"] },
        { mode: "health", selectors: ['[data-theme="health"]', ".nys-theme-health"] },
        { mode: "local", selectors: ['[data-theme="local"]', ".nys-theme-local"] },
        { mode: "safety", selectors: ['[data-theme="safety"]', ".nys-theme-safety"] },
        { mode: "transportation", selectors: ['[data-theme="transportation"]', ".nys-theme-transportation"] },
      ],
    }),
  ],
});

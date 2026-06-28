import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";

const variableName = (id) => {
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
};

const themes = [
  "admin",
  "business",
  "environment",
  "health",
  "local",
  "safety",
  "transportation",
];

export default defineConfig({
  tokens: ["./src/tokens.json"],
  outDir: "./dist/",
  plugins: [
    // Main token file — all tokens + all theme mode overrides
    css({
      filename: "tokens.css",
      legacyHex: true,
      variableName,
      modeSelectors: [
        // Default theme (State Blue) uses :root, no special selector needed
        { mode: "admin", selectors: ['[data-theme="admin"]', ".nys-theme-admin"] },
        { mode: "business", selectors: ['[data-theme="business"]', ".nys-theme-business"] },
        { mode: "environment", selectors: ['[data-theme="environment"]', ".nys-theme-environment"] },
        { mode: "health", selectors: ['[data-theme="health"]', ".nys-theme-health"] },
        { mode: "local", selectors: ['[data-theme="local"]', ".nys-theme-local"] },
        { mode: "safety", selectors: ['[data-theme="safety"]', ".nys-theme-safety"] },
        { mode: "transportation", selectors: ['[data-theme="transportation"]', ".nys-theme-transportation"] },
        // Dark mode (appearance axis) — re-points the applied set under [data-mode="dark"].
        { mode: "dark", selectors: ['[data-mode="dark"]'] },
        // Dark × agency theme — each agency's theme-* ramp in dark, composing the two axes.
        { mode: "admin-dark", selectors: ['[data-mode="dark"][data-theme="admin"]'] },
        { mode: "business-dark", selectors: ['[data-mode="dark"][data-theme="business"]'] },
        { mode: "environment-dark", selectors: ['[data-mode="dark"][data-theme="environment"]'] },
        { mode: "health-dark", selectors: ['[data-mode="dark"][data-theme="health"]'] },
        { mode: "local-dark", selectors: ['[data-mode="dark"][data-theme="local"]'] },
        { mode: "safety-dark", selectors: ['[data-mode="dark"][data-theme="safety"]'] },
        { mode: "transportation-dark", selectors: ['[data-mode="dark"][data-theme="transportation"]'] },
      ],
    }),
    // Per-theme files — only the CSS vars that change for that theme
    ...themes.map((theme) =>
      css({
        filename: `../../styles/dist/theme-${theme}.css`,
        legacyHex: true,
        variableName,
        exclude: ["*"], // skip :root block; only output the mode selector block below
        modeSelectors: [
          {
            mode: theme,
            selectors: [`:root`],
          },
        ],
      })
    ),
  ],
});

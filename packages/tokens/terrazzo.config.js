import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";
import { variableName } from "./scripts/lib/variable-name.mjs";

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

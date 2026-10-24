import { readFileSync } from "node:fs";
import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";
import { variableName as nameFromId } from "./scripts/lib/variable-name.mjs";

// plugin-css passes the whole token (Terrazzo ≥0.6)
const variableName = (token) => nameFromId(token.id);

const themes = [
  "admin",
  "business",
  "environment",
  "health",
  "local",
  "safety",
  "transportation",
];

/** Token ids a theme set overrides, so theme blocks emit only what changes. */
const themeTokenIds = (theme) => {
  const ids = [];
  const walk = (node, path) => {
    if ("$value" in node) return ids.push(path.join("."));
    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith("$") && child && typeof child === "object") walk(child, [...path, key]);
    }
  };
  walk(JSON.parse(readFileSync(new URL(`./src/themes/${theme}.json`, import.meta.url), "utf8")), []);
  return ids;
};

export default defineConfig({
  // DTCG resolver: base set (tokens.json) + "theme" modifier (src/themes/*.json)
  tokens: ["./src/resolver.json"],
  outDir: "./dist/",
  lint: {
    rules: {
      // TEMPORARY (Terrazzo 2 migration): accept string colors/dimensions until
      // tokens.json is converted to DTCG object notation.
      "core/valid-color": ["error", { legacyFormat: true }],
      // legacyFormat is broken for dimensions in 2.10 (strings still error), so off.
      "core/valid-dimension": "off",
    },
  },
  plugins: [
    // Main token file — all tokens (State Blue on :root) + every theme's overrides
    css({
      filename: "tokens.css",
      legacyHex: true,
      variableName,
      permutations: [
        { input: { theme: "default" }, prepare: (contents) => `:root {\n  ${contents}\n}` },
        ...themes.map((theme) => ({
          input: { theme },
          include: themeTokenIds(theme),
          prepare: (contents) =>
            `[data-theme="${theme}"],\n.nys-theme-${theme} {\n  ${contents}\n}`,
        })),
      ],
    }),
    // Per-theme files — only the CSS vars that change for that theme
    ...themes.map((theme) =>
      css({
        filename: `../../styles/dist/theme-${theme}.css`,
        legacyHex: true,
        variableName,
        permutations: [
          { input: { theme }, include: themeTokenIds(theme), prepare: (contents) => `:root {\n  ${contents}\n}` },
        ],
      }),
    ),
  ],
});

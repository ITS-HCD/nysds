import { readFileSync } from "node:fs";
import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";
import figma from "./figma.config.mjs";
import { variableName as nameFromId } from "./scripts/lib/variable-name.mjs";

// plugin-css passes the whole token (Terrazzo ≥0.6)
const variableName = (token) => nameFromId(token.id);

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
  plugins: [
    // All tokens (State Blue on :root) + each agency theme's overrides
    css({
      filename: "tokens.css",
      legacyHex: true,
      variableName,
      permutations: [
        { input: { theme: "default" }, prepare: (contents) => `:root {\n  ${contents}\n}` },
        ...Object.keys(figma.themes).map((theme) => ({
          input: { theme },
          include: themeTokenIds(theme),
          prepare: (contents) => `[data-theme="${theme}"],\n.nys-theme-${theme} {\n  ${contents}\n}`,
        })),
      ],
    }),
  ],
});

/**
 * Guide Tools
 *
 * Consolidated MCP tool for NYSDS guides and documentation.
 * Loads guide content from data/guides/ markdown files.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getCSSTokens, getThemes } from "../lib/token-parser.js";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to guides directory (relative to dist/tools/)
const GUIDES_DIR = join(__dirname, "../../data/guides");

/**
 * Load a guide markdown file. Shared with the nysds://installation resource
 * so the tool and the resource serve the same text.
 */
export function loadGuide(filename: string): string {
  try {
    return readFileSync(join(GUIDES_DIR, filename), "utf-8");
  } catch {
    return `Guide not found: ${filename}`;
  }
}

/**
 * Load a framework-specific guide
 */
function loadFrameworkGuide(framework: string): string {
  try {
    return readFileSync(
      join(GUIDES_DIR, "frameworks", `${framework}.md`),
      "utf-8",
    );
  } catch {
    return `Framework guide not found: ${framework}`;
  }
}

/**
 * Theme value tables for the themes guide, built from tokens.json so they
 * can't drift from tokens.css the way a hand-written table did.
 */
export function renderThemeValueTables(): string {
  const themes = getThemes().map((t) => t.name);
  const tokens = getCSSTokens().filter((t) => t.layer === "theme" && t.themes);
  if (tokens.length === 0) return "";

  const header = `| Token | ${themes.map((t) => `\`${t}\``).join(" | ")} |`;
  const divider = `|---|${themes.map(() => "---").join("|")}|`;
  const table = (cell: (token: (typeof tokens)[0], theme: string) => string) =>
    [
      header,
      divider,
      ...tokens.map(
        (token) =>
          `| \`${token.cssVariable}\` | ${themes.map((theme) => cell(token, theme)).join(" | ")} |`,
      ),
    ].join("\n");

  const selectors = getThemes()
    .filter((t) => t.selectors.length > 0)
    .map(
      (t) =>
        `| \`${t.name}\` | ${t.selectors.map((s) => `\`${s}\``).join(", ")} |`,
    );

  return `## Theme values

Generated from the design tokens. Resolved colors:

${table((token, theme) => token.themes![theme]?.resolvedValue ?? "")}

The palette primitive each value points to (\`--nys-color-\` prefix omitted):

${table((token, theme) =>
  (token.themes![theme]?.referencesVariable ?? "").replace(/^--nys-color-/, ""),
)}

## Theme selectors

| Theme | Selectors |
|---|---|
${selectors.join("\n")}
`;
}

const TOPIC_TO_FILE: Record<string, string> = {
  installation: "installation.md",
  "form-validation": "form-validation.md",
  styles: "styles.md",
  fonts: "fonts.md",
  "page-structure": "page-structure.md",
  themes: "themes.md",
};

export function registerGuideTools(server: McpServer): void {
  server.tool(
    "get_guide",
    "Get NYSDS guides for installation, forms, styles, fonts, page structure, themes, or framework setup",
    {
      topic: z
        .enum([
          "installation",
          "form-validation",
          "styles",
          "fonts",
          "page-structure",
          "themes",
        ])
        .describe("The guide topic to retrieve"),
      framework: z
        .enum(["angular", "react", "vue", "dotnet", "drupal", "vanilla"])
        .optional()
        .describe(
          "Only applies with topic 'installation': returns that framework's setup guide instead of the general installation guide. Ignored for other topics.",
        ),
    },
    async ({ topic, framework }) => {
      let content: string;

      if (framework && topic === "installation") {
        content = loadFrameworkGuide(framework);
      } else {
        const filename = TOPIC_TO_FILE[topic];
        content = filename ? loadGuide(filename) : `Unknown topic: ${topic}`;
        if (topic === "themes") {
          content += `\n${renderThemeValueTables()}`;
        }
        if (framework) {
          content += `\n\n---\n\nNote: \`framework\` only applies to topic "installation". For ${framework} setup, call get_guide({ topic: "installation", framework: "${framework}" }).\n`;
        }
      }

      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    },
  );
}

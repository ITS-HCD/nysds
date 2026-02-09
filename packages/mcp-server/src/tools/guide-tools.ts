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

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to guides directory (relative to dist/tools/)
const GUIDES_DIR = join(__dirname, "../../data/guides");

/**
 * Load a guide markdown file
 */
function loadGuide(filename: string): string {
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

const TOPIC_TO_FILE: Record<string, string> = {
  installation: "installation.md",
  "form-validation": "form-validation.md",
  styles: "styles.md",
  fonts: "fonts.md",
  "page-structure": "page-structure.md",
};

export function registerGuideTools(server: McpServer): void {
  server.tool(
    "get_guide",
    "Get NYSDS guides for installation, forms, styles, fonts, page structure, or framework setup",
    {
      topic: z
        .enum([
          "installation",
          "form-validation",
          "styles",
          "fonts",
          "page-structure",
          "framework",
        ])
        .describe("The guide topic to retrieve"),
      framework: z
        .enum(["angular", "react", "vue", "dotnet", "drupal", "vanilla"])
        .optional()
        .describe("Required when topic is 'framework'. The framework to get setup instructions for."),
    },
    async ({ topic, framework }) => {
      let content: string;

      if (topic === "framework") {
        if (!framework) {
          return {
            content: [
              {
                type: "text",
                text: "Error: 'framework' parameter is required when topic is 'framework'. Choose from: angular, react, vue, dotnet, drupal, vanilla",
              },
            ],
            isError: true,
          };
        }
        content = loadFrameworkGuide(framework);
      } else {
        const filename = TOPIC_TO_FILE[topic];
        content = filename ? loadGuide(filename) : `Unknown topic: ${topic}`;
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

/**
 * Framework Resources
 *
 * MCP resources for NYSDS framework packages (@nysds/react, @nysds/angular).
 *
 * Resources:
 * - nysds://frameworks - Index of framework packages with version and guide URI
 * - nysds://frameworks/react - @nysds/react guide (synced from its README)
 * - nysds://frameworks/angular - @nysds/angular guide (synced from its README)
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getFrameworksIndex } from "../lib/frameworks-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const GUIDES_DIR = join(__dirname, "../../data/guides/frameworks");

function loadFrameworkGuide(framework: "react" | "angular"): string {
  try {
    return readFileSync(join(GUIDES_DIR, `${framework}.md`), "utf-8");
  } catch {
    return `Framework guide not found: ${framework}. Run "npm run sync:guides -w @nysds/mcp-server".`;
  }
}

export function registerFrameworkResources(server: McpServer): void {
  // nysds://frameworks - Index of framework packages
  server.resource(
    "frameworks",
    "nysds://frameworks",
    {
      description:
        "Index of NYSDS framework packages (@nysds/react, @nysds/angular) with their published version and guide resource URI",
      mimeType: "application/json",
    },
    async () => {
      const index = getFrameworksIndex();
      const list = [
        {
          id: "react",
          packageName: index.react.packageName,
          version: index.react.version,
          guideUri: "nysds://frameworks/react",
        },
        {
          id: "angular",
          packageName: index.angular.packageName,
          version: index.angular.version,
          guideUri: "nysds://frameworks/angular",
        },
      ];

      return {
        contents: [
          {
            uri: "nysds://frameworks",
            mimeType: "application/json",
            text: JSON.stringify(list, null, 2),
          },
        ],
      };
    },
  );

  // nysds://frameworks/react - @nysds/react guide
  server.resource(
    "frameworks-react",
    "nysds://frameworks/react",
    {
      description: "@nysds/react install, usage, forms, SSR, and troubleshooting guide",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "nysds://frameworks/react",
          mimeType: "text/markdown",
          text: loadFrameworkGuide("react"),
        },
      ],
    }),
  );

  // nysds://frameworks/angular - @nysds/angular guide
  server.resource(
    "frameworks-angular",
    "nysds://frameworks/angular",
    {
      description:
        "@nysds/angular install, usage, forms, SSR, and troubleshooting guide",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "nysds://frameworks/angular",
          mimeType: "text/markdown",
          text: loadFrameworkGuide("angular"),
        },
      ],
    }),
  );
}

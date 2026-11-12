/**
 * NYSDS MCP Server Setup
 *
 * Configures the MCP server with tools, resources, and prompts
 * for the New York State Design System.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools/index.js";
import { registerResources } from "./resources/index.js";
import { registerPrompts } from "./prompts/nysds-mode.js";

const SERVER_NAME = "nysds-mcp";

// Report the published package version, read from package.json next to dist/
const SERVER_VERSION: string = JSON.parse(
  readFileSync(
    resolve(dirname(fileURLToPath(import.meta.url)), "../package.json"),
    "utf-8",
  ),
).version;

const SERVER_INSTRUCTIONS = `NYSDS (New York State Design System) web components, design tokens, utility classes, and guides.
- Components: find_components to discover (omit query to list all), get_component for the full API, validate_component_api to check markup before writing it.
- Tokens: find_tokens to search or browse, get_token for one token's value and alternatives (themed tokens return all 8 agency themes), get_token_graph for dependencies. Style with var(--nys-*) tokens rather than raw values.
- Styles: @nysds/styles has two installs. The default (@nysds/styles, nysds.min.css) is CSS variables only. The full install (@nysds/styles/full, nysds-full.min.css) adds a reset, typography, and the utility classes; get_utility_classes only works with it. See get_guide({ topic: "styles" }).
- Layout: get_utility_classes. Setup and patterns: get_guide (installation, form-validation, styles, fonts, page-structure, themes; framework applies to installation).
Prefer nys-* components over hand-built HTML controls.`;

export interface NysdsMcpServer {
  start(): Promise<void>;
}

export async function createServer(): Promise<NysdsMcpServer> {
  const server = new McpServer(
    {
      name: SERVER_NAME,
      version: SERVER_VERSION,
    },
    { instructions: SERVER_INSTRUCTIONS },
  );

  // Register all capabilities
  registerTools(server);
  registerResources(server);
  registerPrompts(server);

  return {
    async start() {
      const transport = new StdioServerTransport();
      await server.connect(transport);
      console.error(`${SERVER_NAME} v${SERVER_VERSION} started`);
    },
  };
}

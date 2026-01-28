/**
 * NYSDS MCP Server Setup
 *
 * Configures the MCP server with tools, resources, and prompts
 * for the New York State Design System.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools/index.js";
import { registerResources } from "./resources/index.js";
import { registerPrompts } from "./prompts/nysds-mode.js";

const SERVER_NAME = "nysds-mcp";
const SERVER_VERSION = "1.0.0";

export interface NysdsMcpServer {
  start(): Promise<void>;
}

export async function createServer(): Promise<NysdsMcpServer> {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

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

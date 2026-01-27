/**
 * MCP Resources Registration
 *
 * Registers all NYSDS resources with the MCP server.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerComponentResources } from "./components.js";
import { registerTokenResources } from "./tokens.js";
import { registerGuideResources } from "./guides.js";

export function registerResources(server: McpServer): void {
  registerComponentResources(server);
  registerTokenResources(server);
  registerGuideResources(server);
}

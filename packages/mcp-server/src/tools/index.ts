/**
 * MCP Tools Registration
 *
 * Registers all NYSDS tools with the MCP server.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerComponentTools } from "./component-tools.js";
import { registerTokenTools } from "./token-tools.js";
import { registerValidationTools } from "./validation-tools.js";

export function registerTools(server: McpServer): void {
  registerComponentTools(server);
  registerTokenTools(server);
  registerValidationTools(server);
}

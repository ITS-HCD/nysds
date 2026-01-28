#!/usr/bin/env node
/**
 * NYSDS MCP Server Entry Point
 *
 * Starts the MCP server with stdio transport for local execution.
 * Run via: npx @nysds/mcp-server
 */

import { createServer } from "./server.js";

async function main() {
  const server = await createServer();
  await server.start();
}

main().catch((error) => {
  console.error("Failed to start NYSDS MCP server:", error);
  process.exit(1);
});

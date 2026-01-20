# @nysds/mcp-server

MCP (Model Context Protocol) server for the New York State Design System. Exposes NYSDS components, design tokens, and documentation to AI assistants.

> [!WARNING]
> This MCP server is a work-in-progress and the current results are incomplete or inaccurate. The server is functional, but the quality of the output depends on the robustness of the underlying documentation, which requires some updating. Our team is in the process of migrating design tokens to the [DTCG 2025.10 format (will be @nysds/tokens)](https://www.designtokens.org/tr/2025.10/format/) and enhancing component JSDoc with patterns, accessibility guidance, and usage rules based on guidance from ["Effective Writing for AI" by Benny Powers](https://bennypowers.dev/cem/docs/mcp/writing-descriptions/). Results should improve significantly as tokens and improved documentation rolls out.

## Installation

```bash
npm install @nysds/mcp-server
```
> [!WARNING]
> This isn't published to NPM (yet), so the above won't work. You'd need to clone this repo to your local machine and switch to the `feature/mcp-server` branch.

Once it's cloned, run this command from the `/packages/mcp-server` directory:

```bash
# Build the server
npm run build

# Run in development mode (watch)
npm run dev

# Test with MCP Inspector
# npm run inspect

# Until this is published to NPM, you need to run:
npx @modelcontextprotocol/inspector dist/index.js
```


## Connecting to the MCP Server

This MCP server runs locally on your machine. To use it, you need to configure your AI code assistant to spawn and communicate with it. Each assistant has its own configuration format, but they all follow the same pattern: tell the assistant how to start the server (via `npx`), and it will automatically connect and use the available tools.

### GitHub Copilot

MCP support in GitHub Copilot is available in VS Code. Add to your VS Code settings or workspace `.vscode/mcp.json`:

```json
{
  "servers": {
    "nysds": {
      "command": "npx",
      "args": ["@nysds/mcp-server"]
    }
  }
}
```

See the [Copilot MCP documentation](https://docs.github.com/en/copilot/using-github-copilot/using-extensions-to-integrate-external-tools-with-copilot-chat) for the latest setup instructions.

### Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "nysds": {
      "command": "npx",
      "args": ["@nysds/mcp-server"]
    }
  }
}
```

### Claude Code

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "nysds": {
      "command": "npx",
      "args": ["@nysds/mcp-server"]
    }
  }
}
```

Or configure globally in `~/.claude/settings.json`.

### Cursor

Add to your Cursor MCP settings (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "nysds": {
      "command": "npx",
      "args": ["@nysds/mcp-server"]
    }
  }
}
```

## Available Tools

### P0 (Core)

| Tool | Description |
|------|-------------|
| `list_components` | List all NYSDS components with summaries |
| `get_component_docs` | Full documentation for a specific component |
| `find_components` | Search components by name/description |
| `get_design_tokens` | Get token values by category |
| `get_usage_guide` | Installation and usage patterns |

### P1 (Extended)

| Tool | Description |
|------|-------------|
| `validate_component_api` | Validate prop/attribute usage |
| `setup_framework` | Framework-specific setup guides |
| `find_tokens` | Search tokens by name/value |

## Available Resources

| URI | Description |
|-----|-------------|
| `nysds://components` | Component overview list |
| `nysds://component/{tag}` | Individual component docs |
| `nysds://tokens` | All design tokens |
| `nysds://installation` | Installation guide |

## Prompts

| Prompt | Description |
|--------|-------------|
| `nysds_mode` | Activates NYSDS-aware coding assistance |

## Example Prompts

Once configured, you can ask your AI assistant questions like:

**Discovering components:**
- "What NYSDS components are available for forms?"
- "Show me the documentation for the nys-button component"
- "What properties does nys-alert support?"

**Building UI:**
- "Create a contact form using NYSDS components with fields for name, email, and message"
- "Build a page header with the global header component and navigation"
- "Add form validation to this input using NYSDS error message components"

**Working with tokens:**
- "What color tokens are available in NYSDS?"
- "Show me the spacing tokens I should use for consistent layouts"
- "What's the correct token for the primary brand color?"

**Framework integration:**
- "How do I set up NYSDS components in my Angular project?"
- "Show me how to use nys-button in React"
- "What's the recommended way to integrate NYSDS with Vue?"

**Code review:**
- "Is this the correct way to use the nys-select component?"
- "Check if I'm using valid attributes on this nys-checkbox"

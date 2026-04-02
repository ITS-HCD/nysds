# @nysds/mcp-server

MCP (Model Context Protocol) server for the New York State Design System. Exposes NYSDS components, design tokens, and documentation to AI assistants.

> [!WARNING]
> This MCP server is a work-in-progress and the current tool results are being refined. The server is functional, but the quality of the output depends on the robustness of the underlying documentation, and we're enhancing component JSDoc with patterns, accessibility guidance, and usage rules based on guidance from ["Effective Writing for AI" by Benny Powers](https://bennypowers.dev/cem/docs/mcp/writing-descriptions/).

## Getting Started

No installation is required. The MCP server runs on-demand via `npx` — your AI assistant downloads and starts it automatically when you add the configuration below. You just need [Node.js](https://nodejs.org/) (v18 or later) installed on your machine.

Jump to the configuration for your assistant:
- [GitHub Copilot](#github-copilot)
- [Claude Desktop](#claude-desktop)
- [Claude Code](#claude-code)
- [Cursor](#cursor)
- [Gemini CLI](#gemini-cli)

### Using the Next Channel

To pull in the latest bleeding-edge changes before they hit the stable release, point to the `next` dist-tag by replacing `@nysds/mcp-server` with `@nysds/mcp-server@next` in any of the configurations below. For example:

```json
"args": ["-y", "@nysds/mcp-server@next"]
```

To go back to stable, just remove `@next`.

> [!NOTE]
> Next releases may include breaking changes, incomplete features, or components not fully supported. They're useful for previewing upcoming work, but stick with the stable channel for production use.

### Optional: Local Installation

If you prefer to install the server locally — for example, to use the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) or to pin a specific version — you can install it globally:

```bash
npm install -g @nysds/mcp-server
nysds-mcp
```

Or run it directly without installing:

```bash
npx -y @nysds/mcp-server
```

## Connecting to Your AI Assistant

Each assistant has its own configuration format, but they all follow the same pattern: tell the assistant how to start the server (via `npx`), and it handles the rest.

### GitHub Copilot

MCP support in GitHub Copilot is available in VS Code. Add to your VS Code settings or workspace `.vscode/mcp.json`:

```json
{
  "servers": {
    "nysds": {
      "command": "npx",
      "args": ["-y", "@nysds/mcp-server"]
    }
  }
}
```

See the [Copilot MCP documentation](https://docs.github.com/en/copilot/using-github-copilot/using-extensions-to-integrate-external-tools-with-copilot-chat) for the latest setup instructions.

### Claude Desktop

Add to your Claude Desktop configuration:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "nysds": {
      "command": "npx",
      "args": ["-y", "@nysds/mcp-server"]
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
      "args": ["-y", "@nysds/mcp-server"]
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
      "args": ["-y", "@nysds/mcp-server"]
    }
  }
}
```

### Gemini CLI

Add to your Gemini CLI settings file (`~/.gemini/settings.json`) or your project's `.gemini/settings.json`:

```json
{
  "mcpServers": {
    "nysds": {
      "command": "npx",
      "args": ["-y", "@nysds/mcp-server"]
    }
  }
}
```

See the [Gemini CLI documentation](https://github.com/google-gemini/gemini-cli) for the latest setup instructions.

## Available Tools

### Components

| Tool | Description |
|------|-------------|
| `find_components` | Search for components by name/description, or list all (omit query) |
| `get_component` | Full documentation for a specific component. Use `includeExamples: true` for code examples. |
| `validate_component_api` | Validate that attributes/properties are valid for a component |

### Design Tokens

| Tool | Description |
|------|-------------|
| `get_tokens` | Get tokens, categories, or agency themes. Filter by category or layer. |
| `find_tokens` | Search tokens by CSS variable name, value, or description |
| `get_token_info` | Detailed info for a specific token with optional context validation |
| `get_token_graph` | Token dependency graph showing references and usage |

### Styles & Guides

| Tool | Description |
|------|-------------|
| `get_utility_classes` | Grid, flexbox, spacing, display, and typography utility classes |
| `get_guide` | Guides for installation, forms, styles, fonts, page structure, or framework setup (angular, react, dotnet, drupal, vanilla). Angular, React, .NET, and Drupal guides are currently untested. |

## Available Resources

| URI | Description |
|-----|-------------|
| `nysds://components` | Component overview list |
| `nysds://component/{tag}` | Individual component docs |
| `nysds://tokens` | All design tokens with CSS variables and descriptions |
| `nysds://tokens/css` | Raw tokens.css file content |
| `nysds://tokens/graph` | Token dependency graph with stats |
| `nysds://tokens/color` | Color tokens only |
| `nysds://tokens/font` | Typography tokens |
| `nysds://tokens/space` | Spacing tokens |
| `nysds://tokens/size` | Size tokens |
| `nysds://installation` | Installation guide |

## Prompts

| Prompt | Description |
|--------|-------------|
| `nysds_mode` | Activates NYSDS-aware coding assistance |

## Example Prompts

Once configured, you can ask your AI assistant to help you build real applications with the design system.

**Building applications from requirements:**

> Read the PDF from this folder and create a PRD for a multi-step front end application. Use the NYS Design System. Build with Vite and TypeScript. Break up the tasks into a step-by-step list. Before you start, ask any clarifying questions to do this task well.

> Build out a newsletter signup form using the NYS Design System. Use existing DS components where possible. Where not, build new components using the same approach as existing components, and style with appropriate NYSDS design tokens and utility classes. Afterward, perform a gap analysis that documents everything not in the design system that was created.

**Scaffolding and setup:**

> Set up a new Vite project with TypeScript and install the NYS Design System. Configure it with the correct fonts, tokens, and page structure. Show me a working hello world page that follows the NYSDS page layout guide.

> I have an existing .NET Razor Pages app. Walk me through integrating NYSDS components into it step by step.

**Building pages and features:**

> Build a search results page with a text input, filters using checkboxes and selects, and a results list. Use NYSDS components for all form elements and follow the grid system for layout.

> Create an accessible multi-step wizard form for a permit application with validation on each step. Use NYSDS form components and show error states using the design system's error patterns.

**Working with design tokens and theming:**

> I'm building a page for the Department of Health. Show me how to apply their agency theme using NYSDS tokens, and build a dashboard header that uses the correct brand colors.

> Show me all the spacing tokens available and explain the scale. Then refactor this layout to use NYSDS spacing tokens instead of hardcoded values.

**Code review and validation:**

> Review this HTML page and identify everywhere I'm using NYSDS components incorrectly — wrong attributes, missing required properties, or deprecated patterns.

> Check if I'm using the right token layers. I want to make sure my component-level styles reference the correct semantic tokens instead of raw values.

**Exploring the system:**

> What NYSDS components are available for forms? Show me the documentation for each one with code examples.

> Show me the token dependency graph for the primary color. I want to understand how the base, semantic, and component layers connect.

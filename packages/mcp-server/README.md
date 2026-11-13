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

## Local Development

If you're working on the NYSDS repo itself and want your changes reflected in the MCP server:

1. **Build** — run `npm run build:link` (or `npm run build:all` for a full production build) from the repo root. This rebuilds the `custom-elements.json` manifest and the MCP server bundle that your AI assistant reads.
2. **Restart your AI assistant** — the MCP server process is loaded at startup, so changes won't take effect until you restart (e.g. quit and relaunch Claude Desktop, or run `/mcp` → restart in Claude Code).

```bash
# Fastest rebuild loop during MCP development
npm run build:link

# Then restart your AI assistant to pick up the changes
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

| Tool                     | Description                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `find_components`        | Search for components by name/description, or list all (omit query)                         |
| `get_component`          | Full documentation for a specific component. Use `includeExamples: true` for code examples (each carries `html`, `react`, and `angular` snippets). Pass `framework: "react"`, `"angular"`, or `"vue"` for that framework's import line, event naming, and forms guidance. Components with icon-name attributes (`nys-icon`'s `name`, `prefixIcon`, `icon`, etc.) include `icons.names`: the built-in NYSDS icon set. |
| `validate_component_api` | Validate attribute/property names, enum values, and `nys-*` event bindings for a component. Accepts HTML global attributes (`class`, `slot`, `aria-*`, `data-*`) and Lit binding prefixes (`.prop`, `?attr`, `@event`). Warns when an icon name isn't in the NYSDS icon set (unless `nys-icon` sets another `library`). |

### Design Tokens

| Tool              | Description                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| `find_tokens`     | Search or browse tokens by CSS variable name, description, or category. Every query word must match (`"theme mid"`), and name matches rank first. Themed tokens are marked `themed`; pass `theme` (or put a theme name like `"health"` in the query) to get their values in that theme. By default (`include: "recommended"`) color primitives such as `--nys-color-blue-600` are left out, and the response's `hidden` field says how many matches were hidden; pass `include: "all"` or `"primitive"` to see them. |
| `get_token`       | Details for one token: value, resolved value, layer, and alternatives. Accepts `--nys-color-text`, `nys-color-text`, `color-text`, or `var(--nys-color-text)`. Themed tokens return their value in all 8 agency themes; pass `theme` to make that theme's value the top-level one. Palette primitives list the theme tokens that use them (`usedByThemes`). |
| `get_token_graph` | Token dependency graph showing references and usage, including per-theme references (`themeReferences`, `usedByThemes`) |

### Styles & Guides

| Tool                  | Description                                                                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `get_utility_classes` | Every utility class, by category: display, flexbox (including order), float, grid, margin & padding, opacity, overflow, position, responsive, typography, and z-index. Each category says whether it supports breakpoint prefixes (`nys-tablet:`, etc.), and `responsive` lists them all. Requires the full `@nysds/styles` install. |
| `get_guide`           | Guides for installation, forms, styles, fonts, page structure, themes, or icons (the NYSDS icon names, and registering another icon library with `registerIconLibrary()`). With `topic: "installation"`, pass `framework` (angular, react, vue, dotnet, drupal, vanilla) for that framework's setup guide. The angular, react, and vue guides are the `@nysds/angular`, `@nysds/react`, and `@nysds/vue` package READMEs. |

## Available Resources

| URI                       | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| `nysds://components`      | Component overview list                               |
| `nysds://component/{tag}` | Individual component docs (e.g. `nysds://component/nys-button`) |
| `nysds://tokens`          | All design tokens with CSS variables and descriptions |
| `nysds://tokens/css`      | Raw tokens.css file content                           |
| `nysds://tokens/graph`    | Token dependency graph with stats                     |
| `nysds://tokens/color`    | Color tokens by layer (primitive, applied, theme); the theme layer carries every agency theme's values |
| `nysds://tokens/font`     | Typography tokens                                     |
| `nysds://tokens/space`    | Spacing tokens                                        |
| `nysds://tokens/size`     | Size tokens                                           |
| `nysds://installation`    | Installation guide                                    |
| `nysds://frameworks`      | Index of framework packages (`@nysds/react`, `@nysds/vue`, `@nysds/angular`) with version and guide URI |
| `nysds://frameworks/react`   | `@nysds/react` install, usage, forms, SSR, and troubleshooting guide |
| `nysds://frameworks/vue`     | `@nysds/vue` install, usage, `v-model` forms, SSR, and troubleshooting guide |
| `nysds://frameworks/angular` | `@nysds/angular` install, usage, forms, SSR, and troubleshooting guide |

## Prompts

| Prompt       | Description                             |
| ------------ | --------------------------------------- |
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

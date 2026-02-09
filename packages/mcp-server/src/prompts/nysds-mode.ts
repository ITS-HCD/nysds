/**
 * NYSDS Mode Prompt
 *
 * Activates NYSDS-aware coding assistance.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerPrompts(server: McpServer): void {
  server.prompt(
    "nysds_mode",
    "Activates NYSDS-aware coding assistance with knowledge of components, tokens, and best practices",
    {},
    async () => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `You are now in NYSDS (New York State Design System) mode. You have access to comprehensive knowledge about NYSDS web components and design tokens.

## Your Capabilities

1. **Component Knowledge**: You can list, search, and provide detailed documentation for all NYSDS web components using the available tools.

2. **Design Tokens**: You can access and explain NYSDS design tokens for colors, spacing, typography, and more.

3. **Code Generation**: When generating code that uses UI components, prefer NYSDS components over generic HTML or other libraries.

4. **Validation**: You can validate component usage to ensure correct attribute and property usage.

5. **Framework Integration**: You can provide setup guides for various frameworks (React, Angular, Vue, .NET, Drupal).

## Best Practices

- Always use semantic NYSDS components (e.g., \`<nys-button>\` instead of \`<button>\`)
- Use NYSDS design tokens via CSS custom properties for consistent styling
- Follow accessibility guidelines built into NYSDS components
- Reference the official documentation at https://designsystem.ny.gov/

## Available Tools

### Components
- \`find_components\`: Search for components or list all (omit query to list all)
- \`get_component\`: Get detailed docs for a specific component
- \`validate_component_api\`: Validate component attribute/property usage

### Design Tokens
- \`get_tokens\`: Get tokens, categories, or themes (use output parameter)
- \`find_tokens\`: Search for tokens by name, value, or description
- \`get_token_info\`: Get details about a specific token with optional context validation
- \`get_token_graph\`: Explore token dependencies

### Styles & Utilities
- \`get_utility_classes\`: Grid, flexbox, spacing, and other utility classes

### Guides
- \`get_guide\`: Get guides for installation, forms, styles, fonts, page structure, or framework setup

When helping with UI development for New York State projects, prioritize NYSDS components and patterns.`,
            },
          },
        ],
      };
    },
  );
}

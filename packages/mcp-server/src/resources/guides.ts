/**
 * Guide Resources
 *
 * MCP resources for NYSDS installation and usage guides.
 *
 * P0 Resources:
 * - nysds://installation - Installation guide
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGuideResources(server: McpServer): void {
  // nysds://installation - Installation guide
  server.resource(
    "installation",
    "nysds://installation",
    {
      description: "NYSDS installation and setup guide",
      mimeType: "text/markdown",
    },
    async () => {
      const guide = `# NYSDS Installation Guide

## 1. Install packages

\`\`\`bash
npm install @nysds/components @nysds/styles
\`\`\`

## 2. Load styles

NYSDS components require CSS variables to render correctly. Choose the right stylesheet:

**New project** — includes a CSS reset, typography, and utility/layout classes:
\`\`\`css
@import '@nysds/styles/full';
\`\`\`

**Existing project** — loads only the CSS variables that style the components:
\`\`\`css
@import '@nysds/styles';
\`\`\`

## 3. Import and use components

\`\`\`javascript
import '@nysds/nys-button';
import '@nysds/nys-alert';
\`\`\`

Or import all components:

\`\`\`javascript
import '@nysds/components';
\`\`\`

Then use them in HTML:

\`\`\`html
<nys-button label="Submit" variant="filled"></nys-button>
<nys-alert type="info">This is an informational message.</nys-alert>
\`\`\`

## Framework Integration

For framework-specific setup, use the \`get_guide\` tool with \`topic: "framework"\` and a \`framework\` parameter (angular, react, dotnet, drupal, or vanilla).

## Resources

- Documentation: https://designsystem.ny.gov/
- GitHub: https://github.com/ITS-HCD/nysds
`;

      return {
        contents: [
          {
            uri: "nysds://installation",
            mimeType: "text/markdown",
            text: guide,
          },
        ],
      };
    },
  );
}

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

## Quick Start

Install the NYSDS components package:

\`\`\`bash
npm install @nysds/components
\`\`\`

## Import Components

### Option 1: Import All Components

\`\`\`javascript
import '@nysds/components';
\`\`\`

### Option 2: Import Individual Components

\`\`\`javascript
import '@nysds/components/nys-button';
import '@nysds/components/nys-alert';
\`\`\`

## Include Styles

Import the base CSS for design tokens:

\`\`\`css
@import '@nysds/components/dist/styles.css';
\`\`\`

## Usage

Once imported, use components as HTML elements:

\`\`\`html
<nys-button label="Submit" variant="primary"></nys-button>
<nys-alert type="success">Operation completed successfully!</nys-alert>
\`\`\`

## Framework Integration

For framework-specific setup (React, Angular, Vue, etc.), use the \`setup_framework\` tool.

## Browser Support

NYSDS components support all modern browsers (Chrome, Firefox, Safari, Edge).

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

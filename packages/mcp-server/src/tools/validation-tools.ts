/**
 * Validation Tools
 *
 * MCP tools for validating NYSDS component usage.
 *
 * P1 Tools:
 * - validate_component_api: Validate prop/attribute usage
 * - setup_framework: Framework-specific guides
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getComponent } from "../lib/cem-parser.js";

export function registerValidationTools(server: McpServer): void {
  // validate_component_api - Validate prop/attribute usage
  server.tool(
    "validate_component_api",
    "Validate that the provided attributes/properties are valid for a given NYSDS component",
    {
      tagName: z
        .string()
        .describe("The tag name of the component (e.g., 'nys-button')"),
      attributes: z
        .record(z.string())
        .describe("Object of attribute names and values to validate"),
    },
    async ({ tagName, attributes }) => {
      const component = getComponent(tagName);

      if (!component) {
        return {
          content: [
            {
              type: "text",
              text: `Component "${tagName}" not found.`,
            },
          ],
          isError: true,
        };
      }

      const validAttributes = new Set(
        component.attributes?.map((a) => a.name) || [],
      );
      const validProperties = new Set(
        component.members
          ?.filter((m) => m.kind === "field")
          .map((m) => m.name) || [],
      );

      const errors: string[] = [];
      const warnings: string[] = [];

      for (const attr of Object.keys(attributes)) {
        if (!validAttributes.has(attr) && !validProperties.has(attr)) {
          errors.push(`Unknown attribute/property: "${attr}"`);
        }
      }

      const result = {
        valid: errors.length === 0,
        errors,
        warnings,
        validAttributes: Array.from(validAttributes),
        validProperties: Array.from(validProperties),
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );

  // setup_framework - Framework-specific guides
  server.tool(
    "setup_framework",
    "Get framework-specific setup guide for using NYSDS components",
    {
      framework: z
        .enum(["angular", "react", "vue", "dotnet", "drupal", "vanilla"])
        .describe("The framework to get setup instructions for"),
    },
    async ({ framework }) => {
      // TODO: Load from data/guides/ directory
      const guides: Record<string, string> = {
        vanilla: `# NYSDS with Vanilla JavaScript

## Installation

\`\`\`bash
npm install @nysds/components
\`\`\`

## Usage

\`\`\`html
<script type="module">
  import '@nysds/components';
</script>

<nys-button label="Click me"></nys-button>
\`\`\`
`,
        react: `# NYSDS with React

## Installation

\`\`\`bash
npm install @nysds/components
\`\`\`

## Usage

\`\`\`jsx
import '@nysds/components/nys-button';

function App() {
  return <nys-button label="Click me" />;
}
\`\`\`

Note: Web components work in React but require property binding for complex types.
`,
        angular: `# NYSDS with Angular

## Installation

\`\`\`bash
npm install @nysds/components
\`\`\`

## Configuration

Add CUSTOM_ELEMENTS_SCHEMA to your module:

\`\`\`typescript
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
\`\`\`

## Usage

\`\`\`typescript
import '@nysds/components/nys-button';
\`\`\`

\`\`\`html
<nys-button label="Click me"></nys-button>
\`\`\`
`,
        vue: `# NYSDS with Vue

## Installation

\`\`\`bash
npm install @nysds/components
\`\`\`

## Configuration

Configure Vue to recognize custom elements:

\`\`\`javascript
// vite.config.js
export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('nys-')
        }
      }
    })
  ]
}
\`\`\`

## Usage

\`\`\`vue
<script setup>
import '@nysds/components/nys-button';
</script>

<template>
  <nys-button label="Click me" />
</template>
\`\`\`
`,
        dotnet: `# NYSDS with .NET / Blazor

## Installation

Add the package via npm or include from CDN:

\`\`\`html
<script type="module" src="https://cdn.jsdelivr.net/npm/@nysds/components"></script>
\`\`\`

## Usage in Razor

\`\`\`razor
<nys-button label="Click me"></nys-button>
\`\`\`
`,
        drupal: `# NYSDS with Drupal

## Installation

Add the library to your theme's libraries.yml:

\`\`\`yaml
nysds:
  js:
    https://cdn.jsdelivr.net/npm/@nysds/components: { type: external, minified: true }
\`\`\`

## Usage in Twig

\`\`\`twig
<nys-button label="{{ 'Click me'|t }}"></nys-button>
\`\`\`
`,
      };

      const guide = guides[framework] || `No guide available for ${framework}`;

      return {
        content: [
          {
            type: "text",
            text: guide,
          },
        ],
      };
    },
  );
}

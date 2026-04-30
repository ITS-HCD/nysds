/**
 * Utility Tools
 *
 * MCP tools for NYSDS utility classes.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const UTILITY_DOCS = {
  grid: `## Grid System

NYSDS provides a 12-column responsive grid system.

### Structure
\`\`\`html
<div class="nys-grid-container">
  <div class="nys-grid-row">
    <div class="nys-grid-col-6">Half width</div>
    <div class="nys-grid-col-6">Half width</div>
  </div>
</div>
\`\`\`

### Column Classes
- \`nys-grid-col-[1-12]\` - Fixed column widths (1-12 columns)
- \`nys-grid-col\` - Equal width columns (auto-distributes)
- \`nys-grid-col-auto\` - Column sized to content
- \`nys-grid-col-fill\` - Column fills remaining space

### Gap Classes
- \`nys-grid-gap\` - Default gap between columns (responsive: 8px → 16px at desktop)
- \`nys-grid-gap-0\` - No gap
- \`nys-grid-gap-2px\` - 2px gap
- \`nys-grid-gap-50\` - 4px gap (0.25rem)
- \`nys-grid-gap-100\` - 8px gap (0.5rem)
- \`nys-grid-gap-150\` - 12px gap (0.75rem)
- \`nys-grid-gap-200\` - 16px gap (1rem)
- \`nys-grid-gap-250\` - 20px gap (1.25rem)
- \`nys-grid-gap-300\` - 24px gap (1.5rem)
- \`nys-grid-gap-400\` - 32px gap (2rem)
- \`nys-grid-gap-500\` - 40px gap (2.5rem)
- \`nys-grid-gap-600\` - 48px gap (3rem)

### Offset Classes
- \`nys-grid-offset-[1-12]\` - Offset column by 1-12 columns

### Example: Form with Sidebar
\`\`\`html
<div class="nys-grid-container">
  <div class="nys-grid-row">
    <div class="nys-grid-col-12 nys-desktop:nys-grid-col-4">
      <!-- Sidebar content (stepper, navigation) -->
    </div>
    <div class="nys-grid-col-12 nys-desktop:nys-grid-col-8">
      <!-- Main content (form) -->
    </div>
  </div>
</div>
\`\`\``,

  flex: `## Flexbox Utilities

### Display
- \`nys-display-flex\` - Sets display: flex

### Direction
- \`nys-flex-row\` - Row direction (default)
- \`nys-flex-column\` - Column direction

### Wrapping
- \`nys-flex-wrap\` - Allow items to wrap
- \`nys-flex-no-wrap\` - Prevent wrapping

### Alignment (Cross Axis)
- \`nys-flex-align-start\` - Align items to start
- \`nys-flex-align-center\` - Align items to center
- \`nys-flex-align-end\` - Align items to end
- \`nys-flex-align-stretch\` - Stretch items to fill

### Justification (Main Axis)
- \`nys-flex-justify-start\` - Justify to start
- \`nys-flex-justify-center\` - Justify to center
- \`nys-flex-justify-end\` - Justify to end

### Flex Sizing
- \`nys-flex-[1-12]\` - Flex grow/shrink values
- \`nys-flex-auto\` - flex: auto (grow and shrink)
- \`nys-flex-fill\` - Fill available space

### Example: Button Group
\`\`\`html
<div class="nys-display-flex nys-flex-justify-end nys-flex-gap-200">
  <nys-button label="Cancel" variant="outline"></nys-button>
  <nys-button label="Submit"></nys-button>
</div>
\`\`\``,

  spacing: `## Spacing Utilities

Pattern: \`nys-{property}-{direction}-{value}\`

### Properties
- \`margin\` - External spacing
- \`padding\` - Internal spacing

### Directions
- \`t\` - Top
- \`r\` - Right
- \`b\` - Bottom
- \`l\` - Left
- \`x\` - Horizontal (left + right)
- \`y\` - Vertical (top + bottom)
- (none) - All sides

### Values
- \`0\` - 0
- \`1px\` - 1px
- \`2px\` - 2px
- \`50\` - var(--nys-space-50) = 0.125rem (2px)
- \`100\` - var(--nys-space-100) = 0.25rem (4px)
- \`150\` - var(--nys-space-150) = 0.375rem (6px)
- \`200\` - var(--nys-space-200) = 0.5rem (8px)
- \`250\` - var(--nys-space-250) = 0.625rem (10px)
- \`300\` - var(--nys-space-300) = 0.75rem (12px)
- \`400\` - var(--nys-space-400) = 1rem (16px)
- \`500\` - var(--nys-space-500) = 1.25rem (20px)
- \`600\` - var(--nys-space-600) = 1.5rem (24px)
- \`700\` - var(--nys-space-700) = 2rem (32px)
- \`800\` - var(--nys-space-800) = 2.5rem (40px)
- \`1200\` - var(--nys-space-1200) = 4rem (64px)

### Examples
\`\`\`html
<!-- Add bottom margin to an alert -->
<nys-alert class="nys-margin-b-300">...</nys-alert>

<!-- Add padding to a container -->
<div class="nys-padding-400">...</div>

<!-- Horizontal margin -->
<div class="nys-margin-x-200">...</div>
\`\`\``,

  display: `## Display Utilities

- \`nys-display-none\` - Hide element
- \`nys-display-block\` - Block display
- \`nys-display-inline\` - Inline display
- \`nys-display-inline-block\` - Inline-block display
- \`nys-display-flex\` - Flex display

### Example: Hide on Mobile
\`\`\`html
<div class="nys-display-none nys-tablet:nys-display-block">
  Only visible on tablet and larger
</div>
\`\`\``,

  opacity: `## Opacity Utilities

- \`nys-opacity-0\` - Fully transparent
- \`nys-opacity-25\` - 25% opacity
- \`nys-opacity-50\` - 50% opacity
- \`nys-opacity-75\` - 75% opacity
- \`nys-opacity-100\` - Fully opaque`,

  zindex: `## Z-Index Utilities

- \`nys-z-0\` - z-index: 0
- \`nys-z-10\` - z-index: 10
- \`nys-z-20\` - z-index: 20
- \`nys-z-30\` - z-index: 30
- \`nys-z-40\` - z-index: 40
- \`nys-z-50\` - z-index: 50
- \`nys-z-auto\` - z-index: auto`,

  typography: `## Typography Utilities

### Text Alignment
- \`nys-text-left\` - Left align text
- \`nys-text-center\` - Center align text
- \`nys-text-right\` - Right align text

### Font Weight
- \`nys-font-normal\` - Normal weight
- \`nys-font-medium\` - Medium weight
- \`nys-font-semibold\` - Semibold weight
- \`nys-font-bold\` - Bold weight

### Text Transform
- \`nys-text-uppercase\` - Uppercase text
- \`nys-text-lowercase\` - Lowercase text
- \`nys-text-capitalize\` - Capitalize text`,

  responsive: `## Responsive Breakpoints

NYSDS utility classes support responsive prefixes.

### Breakpoints
- (no prefix) - All screen sizes (mobile-first)
- \`nys-mobile-lg:\` - 30em (480px) and up
- \`nys-tablet:\` - 40em (640px) and up
- \`nys-desktop:\` - 64em (1024px) and up

### Pattern
\`nys-{breakpoint}:nys-{class}\`

### Examples
\`\`\`html
<!-- Full width on mobile, half on tablet, third on desktop -->
<div class="nys-grid-col-12 nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-4">
  Responsive column
</div>

<!-- Stack on mobile, row on tablet -->
<div class="nys-display-flex nys-flex-column nys-tablet:nys-flex-row">
  Responsive flex direction
</div>

<!-- Hide on mobile, show on desktop -->
<div class="nys-display-none nys-desktop:nys-display-block">
  Desktop only content
</div>
\`\`\``,

  componentSpacing: `## Component Spacing

When adding spacing around NYSDS components, use utility classes rather than wrapper elements.

### Examples
\`\`\`html
<!-- Add bottom margin to an alert -->
<nys-alert class="nys-margin-b-300" type="info">
  This alert has bottom margin.
</nys-alert>

<!-- Add top margin to a button -->
<nys-button class="nys-margin-t-400" label="Submit"></nys-button>

<!-- Stack form fields with consistent spacing -->
<nys-textinput class="nys-margin-b-300" label="First Name"></nys-textinput>
<nys-textinput class="nys-margin-b-300" label="Last Name"></nys-textinput>
<nys-textinput class="nys-margin-b-400" label="Email"></nys-textinput>
<nys-button label="Submit"></nys-button>
\`\`\``,
};

export function registerUtilityTools(server: McpServer): void {
  // get_utility_classes - Comprehensive utility class reference
  server.tool(
    "get_utility_classes",
    "Get NYSDS utility class reference for layout, spacing, and styling",
    {
      category: z
        .enum([
          "grid",
          "flex",
          "spacing",
          "display",
          "opacity",
          "zindex",
          "typography",
          "responsive",
          "all",
        ])
        .optional()
        .describe(
          "Category of utility classes to retrieve. Defaults to 'all'.",
        ),
    },
    async ({ category = "all" }) => {
      let content: string;

      if (category === "all") {
        content = `# NYSDS Utility Classes

${UTILITY_DOCS.grid}

${UTILITY_DOCS.flex}

${UTILITY_DOCS.spacing}

${UTILITY_DOCS.display}

${UTILITY_DOCS.opacity}

${UTILITY_DOCS.zindex}

${UTILITY_DOCS.typography}

${UTILITY_DOCS.responsive}

${UTILITY_DOCS.componentSpacing}`;
      } else {
        content =
          UTILITY_DOCS[category as keyof typeof UTILITY_DOCS] ||
          `Unknown category: ${category}`;
      }

      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    },
  );
}

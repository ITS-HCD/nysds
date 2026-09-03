/**
 * Utility Tools
 *
 * MCP tools for NYSDS utility classes.
 *
 * The class lists this tool returns are RENDERED from the scale constants
 * below. Those constants mirror the Sass sources that actually generate the
 * stylesheet:
 *
 *   - packages/styles/src/utilities/_config.scss     ($spacing, $opacity-values,
 *                                                     $zindex-values, $display-values,
 *                                                     $breakpoints, $flex-columns)
 *   - packages/styles/src/utilities/_layout-grid.scss ($responsive-gap-suffixes)
 *   - packages/styles/src/core/typography.scss        ($body-sizes, $ui-sizes,
 *                                                     $ui-underline-styles, $display-sizes)
 *
 * Do not hand-write a class name into the markdown. Add it to a scale and let
 * the renderer emit it, so a name can never appear here without a scale entry
 * behind it.
 *
 * `npm run verify:utility-docs` compiles the stylesheet and asserts that every
 * class this tool names exists in it. Run it after touching any scale.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/* ------------------------------------------------------------------ *
 * Scales — mirror the Sass sources listed above.
 * ------------------------------------------------------------------ */

type SpacingEntry = readonly [key: string, px: string, rem?: string];

/**
 * `$spacing` in _config.scss. The utilities emit literal pixel values, not
 * `var(--nys-space-*)` references, so the rendered docs quote pixels.
 *
 * There is deliberately no `0` key: `nys-margin-0` and `nys-padding-0` are
 * not generated.
 */
const SPACING: readonly SpacingEntry[] = [
  ["1px", "1px"],
  ["2px", "2px"],
  ["50", "4px", "0.25rem"],
  ["100", "8px", "0.5rem"],
  ["150", "12px", "0.75rem"],
  ["200", "16px", "1rem"],
  ["250", "20px", "1.25rem"],
  ["300", "24px", "1.5rem"],
  ["400", "32px", "2rem"],
  ["500", "40px", "2.5rem"],
  ["600", "48px", "3rem"],
  ["700", "56px", "3.5rem"],
  ["800", "64px", "4rem"],
  ["1200", "96px", "6rem"],
];

/** `$responsive-gap-suffixes` in _layout-grid.scss. */
const RESPONSIVE_GAP_KEYS: readonly string[] = [
  "400",
  "500",
  "600",
  "700",
  "800",
  "1200",
];

/** `$opacity-values` in _config.scss. */
const OPACITY: readonly number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

/** `$zindex-values` in _config.scss. */
const ZINDEX: ReadonlyArray<readonly [name: string, value: string]> = [
  ["0", "0"],
  ["100", "100"],
  ["200", "200"],
  ["300", "300"],
  ["400", "400"],
  ["500", "500"],
  ["auto", "auto"],
  ["bottom", "-100"],
  ["top", "99999"],
];

/** `$display-values` in _config.scss. */
const DISPLAY: readonly string[] = [
  "none",
  "block",
  "inline",
  "inline-block",
  "flex",
  "inline-flex",
  "table",
  "table-cell",
  "table-row",
];

/** `$breakpoints` in _config.scss. */
const BREAKPOINTS: ReadonlyArray<
  readonly [name: string, em: string, px: string]
> = [
  ["mobile-lg", "30em", "480px"],
  ["tablet", "40em", "640px"],
  ["desktop", "64em", "1024px"],
  ["widescreen", "87.5em", "1400px"],
];

/** Typography scales in core/typography.scss. */
const HEADING_LEVELS: readonly number[] = [1, 2, 3, 4, 5, 6];
const BODY_SIZES: readonly string[] = ["xs", "sm", "md"];
const UI_SIZES: readonly string[] = ["xs", "sm", "md", "lg", "xl"];
const DISPLAY_SIZES: readonly string[] = ["sm", "md", "lg", "xl"];
/** `$ui-underline-styles` — only these size/weight pairs are generated. */
const UI_UNDERLINE: ReadonlyArray<readonly [size: string, weight: string]> = [
  ["sm", "semibold"],
  ["md", "semibold"],
  ["md", "regular"],
  ["lg", "semibold"],
];

const FLEX_ALIGN: readonly string[] = [
  "start",
  "center",
  "end",
  "baseline",
  "stretch",
];
const FLEX_JUSTIFY: readonly string[] = [
  "start",
  "center",
  "end",
  "space-between",
  "space-around",
  "space-evenly",
];

/* ------------------------------------------------------------------ *
 * Renderers
 * ------------------------------------------------------------------ */

const spacingKeys = SPACING.map(([key]) => key);
const bullets = (lines: readonly string[]) => lines.join("\n");
const inlineList = (items: readonly string[]) =>
  items.map((i) => `\`${i}\``).join(", ");

const spacingValueRows = bullets(
  SPACING.map(
    ([key, px, rem]) => `- \`${key}\` - ${px}${rem ? ` (${rem})` : ""}`,
  ),
);

const gapValueRows = bullets(
  SPACING.map(([key, px, rem]) => {
    const size = `${px}${rem ? ` (${rem})` : ""}`;
    // Gaps in the responsive set are capped at 2rem below 64em. For 400 the
    // cap equals the full value, so only note it where it actually differs.
    const capped =
      RESPONSIVE_GAP_KEYS.includes(key) && Number.parseInt(px, 10) > 32;
    return capped
      ? `- \`nys-grid-gap-${key}\` - ${size} at 64em and up, capped at 32px (2rem) below that`
      : `- \`nys-grid-gap-${key}\` - ${size}`;
  }),
);

const opacityRows = bullets(
  OPACITY.map((v) => {
    const label =
      v === 0
        ? "Fully transparent"
        : v === 100
          ? "Fully opaque"
          : `${v}% opaque`;
    return `- \`nys-opacity-${v}\` - opacity: ${v / 100} (${label})`;
  }),
);

const zindexRows = bullets(
  ZINDEX.map(([name, value]) => `- \`nys-z-${name}\` - z-index: ${value}`),
);

const displayRows = bullets(
  DISPLAY.map((v) => `- \`nys-display-${v}\` - display: ${v}`),
);

const breakpointRows = bullets(
  BREAKPOINTS.map(
    ([name, em, px]) => `- \`nys-${name}:\` - ${em} (${px}) and up`,
  ),
);

const headingRows = bullets(
  HEADING_LEVELS.map(
    (n) => `- \`nys-font-h${n}\` - Heading level ${n} type style`,
  ),
);

const underlineRows = bullets(
  UI_UNDERLINE.flatMap(([size, weight]) => [
    `- \`nys-font-ui-${size}-${weight}-underline\` - UI ${size} ${weight}, 7% underline`,
    `- \`nys-font-ui-${size}-${weight}-underline-strong\` - UI ${size} ${weight}, 14% underline`,
  ]),
);

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
Gap classes apply to \`nys-grid-row\`. Use \`nys-grid-gap-x-*\` or
\`nys-grid-gap-y-*\` for a single axis. There is no \`nys-grid-gap-0\`; omit
the gap class instead.

${gapValueRows}

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
- \`nys-display-inline-flex\` - Sets display: inline-flex

### Direction
- \`nys-flex-row\` - Row direction (default)
- \`nys-flex-column\` - Column direction

### Wrapping
- \`nys-flex-wrap\` - Allow items to wrap
- \`nys-flex-no-wrap\` - Prevent wrapping

### Alignment (Cross Axis)
${bullets(FLEX_ALIGN.map((v) => `- \`nys-flex-align-${v}\` - align-items: ${v}`))}

### Self Alignment
${bullets(FLEX_ALIGN.map((v) => `- \`nys-flex-align-self-${v}\` - align-self: ${v}`))}

### Justification (Main Axis)
${bullets(FLEX_JUSTIFY.map((v) => `- \`nys-flex-justify-${v}\` - justify-content: ${v}`))}

### Flex Sizing
- \`nys-flex-[1-12]\` - Flex grow/shrink values
- \`nys-flex-auto\` - flex: auto (grow and shrink)
- \`nys-flex-fill\` - Fill available space

### Gaps
Available on the spacing scale: ${inlineList(spacingKeys)}

- \`nys-flex-gap-{value}\` - gap on both axes
- \`nys-flex-row-gap-{value}\` - row-gap only
- \`nys-flex-column-gap-{value}\` - column-gap only

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
The utilities emit literal pixel values. There is no zero and no \`auto\`
value — \`nys-margin-0\` and \`nys-padding-0\` are not generated. Omit the
class instead.

${spacingValueRows}

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

${displayRows}

### Example: Hide on Mobile
\`\`\`html
<div class="nys-display-none nys-tablet:nys-display-block">
  Only visible on tablet and larger
</div>
\`\`\``,

  opacity: `## Opacity Utilities

The scale steps by 10 — there is no \`nys-opacity-25\` or \`nys-opacity-75\`.

${opacityRows}`,

  zindex: `## Z-Index Utilities

The scale steps by 100, not by 10. \`nys-z-10\` through \`nys-z-50\` do not
exist — the comparable values are \`nys-z-100\` through \`nys-z-500\`.

${zindexRows}`,

  typography: `## Typography Utilities

NYSDS ships a role-based type scale, not atomic text modifiers. Each class
sets font-family, size, and line-height together, matching the text styles in
the NYSDS Foundations Figma file.

There are NO text-alignment, text-transform, or font-weight utilities
(no \`nys-text-center\`, no \`nys-font-bold\`). Use CSS for those.

### Headings
${headingRows}

### Body
${bullets(BODY_SIZES.map((s) => `- \`nys-font-body-${s}\` - Body text, ${s}`))}

### UI
${bullets(UI_SIZES.map((s) => `- \`nys-font-ui-${s}\` - UI text, ${s}`))}

### UI Underline
${underlineRows}

### Display
${bullets(DISPLAY_SIZES.map((s) => `- \`nys-font-display-${s}\` - Display text, ${s}`))}

### Agency
- \`nys-font-agency\` - Agency / application title

### Font family hooks
These are attribute selectors, not standalone classes. They set only
font-family on any element whose class list contains the substring, so pair
them with a size class:

- \`[class*="nys-font-mono-"]\` - monospace family
- \`[class*="nys-font-sans-"]\` - sans-serif family
- \`[class*="nys-font-serif-"]\` - serif family`,

  responsive: `## Responsive Breakpoints

NYSDS utility classes support responsive prefixes.

### Breakpoints
- (no prefix) - All screen sizes (mobile-first)
${breakpointRows}

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

/**
 * Classes the reference deliberately names in order to say they do NOT exist.
 *
 * These are the names people reach for out of habit from other frameworks.
 * Saying so explicitly is more useful than silence, but it means the docs
 * mention class names the stylesheet does not define, which would otherwise
 * trip the verifier.
 *
 * `verify-utility-docs.mjs` asserts each of these is genuinely absent, so if
 * NYSDS ever adds one, the stale warning fails the check instead of quietly
 * misinforming people.
 */
const KNOWN_ABSENT: readonly string[] = [
  "nys-text-center",
  "nys-font-bold",
  "nys-z-10",
  "nys-z-50",
  "nys-opacity-25",
  "nys-opacity-75",
  "nys-margin-0",
  "nys-padding-0",
  "nys-grid-gap-0",
];

/**
 * Exported so `src/scripts/verify-utility-docs.mjs` can assert that every class
 * named in this reference exists in the compiled stylesheet — and that every
 * class named in KNOWN_ABSENT still does not.
 */
export { UTILITY_DOCS, KNOWN_ABSENT };

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

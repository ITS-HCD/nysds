/**
 * Utility Tools
 *
 * MCP tools for NYSDS utility classes.
 *
 * The class lists this tool returns are RENDERED from the scale constants
 * below. Those constants mirror the Sass sources that actually generate the
 * stylesheet:
 *
 *   - packages/styles/src/utilities/_config.scss      ($spacing, $opacity-values,
 *                                                      $zindex-values, $display-values,
 *                                                      $breakpoints, $flex-columns,
 *                                                      $order-values, $float-values,
 *                                                      $overflow-values, $position-values,
 *                                                      $grid-containers)
 *   - packages/styles/src/utilities/_layout-grid.scss  ($responsive-gap-suffixes)
 *   - packages/styles/src/utilities/_flex.scss         (align, justify, gap)
 *   - packages/styles/src/core/typography.scss         ($body-sizes, $ui-sizes,
 *                                                      $ui-underline-styles, $display-sizes)
 *
 * Do not hand-write a class name into the markdown. Add it to a scale and let
 * the renderer emit it, so a name can never appear here without a scale entry
 * behind it.
 *
 * `npm run verify:utility-docs` compiles the stylesheet and asserts, in both
 * directions, that every class this tool names exists and every class the
 * stylesheet defines is documented here. Run it after touching any scale.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/* ------------------------------------------------------------------ *
 * Scales — mirror the Sass sources listed above.
 * ------------------------------------------------------------------ */

type SpacingEntry = readonly [key: string, px: string, rem?: string];

/**
 * `$spacing` in _config.scss. Margin and padding emit literal pixel values;
 * flex gaps reference the matching `--nys-space-*` token.
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

/** `$directions` in _config.scss. */
const SPACING_DIRECTIONS: ReadonlyArray<readonly [key: string, sides: string]> =
  [
    ["t", "top"],
    ["r", "right"],
    ["b", "bottom"],
    ["l", "left"],
    ["x", "left and right"],
    ["y", "top and bottom"],
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

/** `$grid-containers` in _config.scss: [suffix, max-width]. */
const GRID_CONTAINERS: ReadonlyArray<readonly [suffix: string, max: string]> = [
  ["", "64rem (1024px)"],
  ["-card", "10rem (160px)"],
  ["-card-lg", "15rem (240px)"],
  ["-mobile", "20rem (320px)"],
  ["-mobile-lg", "30rem (480px)"],
  ["-tablet", "40rem (640px)"],
  ["-tablet-lg", "55rem (880px)"],
  ["-desktop", "64rem (1024px)"],
  ["-desktop-lg", "75rem (1200px)"],
  ["-widescreen", "80rem (1280px)"],
  ["-nys-mobile-lg", "30rem (480px)"],
  ["-nys-tablet", "40rem (640px)"],
  ["-nys-desktop", "64rem (1024px)"],
  ["-nys-widescreen", "80rem (1280px)"],
];

/** `$flex-columns` in _config.scss. */
const FLEX_COLUMNS: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/** `$opacity-values` in _config.scss. */
const OPACITY: readonly number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

/** `$zindex-values` in _config.scss. */
const ZINDEX: ReadonlyArray<readonly [name: string, value: string]> = [
  ["auto", "auto"],
  ["bottom", "-100"],
  ["0", "0"],
  ["100", "100"],
  ["200", "200"],
  ["300", "300"],
  ["400", "400"],
  ["500", "500"],
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
  "table-row",
  "table-cell",
];

/** `$order-values` in _config.scss. */
const ORDER: ReadonlyArray<readonly [name: string, value: number]> = [
  ["first", -1],
  ["last", 999],
  ["initial", 0],
  ...Array.from({ length: 12 }, (_, i) => [String(i), i] as const),
];

/** `$float-values` in _config.scss. */
const FLOAT: readonly string[] = ["left", "right", "none"];

/** `$overflow-values` in _config.scss, with what each does. */
const OVERFLOW: ReadonlyArray<readonly [value: string, effect: string]> = [
  ["auto", "scrollbars appear only when content overflows"],
  ["hidden", "clips overflowing content, with no scrollbars"],
  ["scroll", "always shows scrollbars"],
  ["visible", "content spills outside the box (the browser default)"],
];
const OVERFLOW_AXES: ReadonlyArray<readonly [infix: string, property: string]> =
  [
    ["", "overflow"],
    ["x-", "overflow-x"],
    ["y-", "overflow-y"],
  ];

/** `$position-values` in _config.scss, with what each does. */
const POSITION: ReadonlyArray<readonly [value: string, effect: string]> = [
  ["static", "normal document flow (the browser default)"],
  [
    "relative",
    "stays in flow; becomes the positioning context for absolutely positioned children",
  ],
  [
    "absolute",
    "removed from flow; placed relative to the nearest positioned ancestor",
  ],
  ["fixed", "removed from flow; placed relative to the viewport"],
  ["sticky", "scrolls with the page until it reaches its offset, then sticks"],
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

/** Align values in _flex.scss; start/end compile to flex-start/flex-end. */
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
const flexValue = (v: string) =>
  v === "start" || v === "end" ? `flex-${v}` : v;

/* ------------------------------------------------------------------ *
 * Renderers
 * ------------------------------------------------------------------ */

const spacingKeys = SPACING.map(([key]) => key);
const bullets = (lines: readonly string[]) => lines.join("\n");
const inlineList = (items: readonly string[]) =>
  items.map((i) => `\`${i}\``).join(", ");
const sizeLabel = ([, px, rem]: SpacingEntry) =>
  `${px}${rem ? ` (${rem})` : ""}`;

const spacingValueRows = bullets(
  SPACING.map((entry) => `- \`${entry[0]}\` - ${sizeLabel(entry)}`),
);

const gapValueRows = bullets(
  SPACING.map((entry) => {
    const [key, px] = entry;
    // Gaps in the responsive set are capped at 2rem below 64em. For 400 the
    // cap equals the full value, so only note it where it actually differs.
    const capped =
      RESPONSIVE_GAP_KEYS.includes(key) && Number.parseInt(px, 10) > 32;
    return capped
      ? `- \`nys-grid-gap-${key}\` - ${sizeLabel(entry)} at 64em and up, capped at 32px (2rem) below that`
      : `- \`nys-grid-gap-${key}\` - ${sizeLabel(entry)}`;
  }),
);

const containerRows = bullets(
  GRID_CONTAINERS.map(
    ([suffix, max]) => `- \`nys-grid-container${suffix}\` - max-width ${max}`,
  ),
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

const orderRows = bullets(
  ORDER.map(([name, value]) => `- \`nys-order-${name}\` - order: ${value}`),
);

const floatRows = bullets(
  FLOAT.map((v) => `- \`nys-float-${v}\` - float: ${v}`),
);

const overflowSections = OVERFLOW_AXES.map(
  ([infix, property]) => `### ${property}
${bullets(OVERFLOW.map(([v, effect]) => `- \`nys-overflow-${infix}${v}\` - ${property}: ${v} (${effect})`))}`,
).join("\n\n");

const positionRows = bullets(
  POSITION.map(
    ([v, effect]) => `- \`nys-position-${v}\` - position: ${v} (${effect})`,
  ),
);

const breakpointRows = bullets(
  BREAKPOINTS.map(
    ([name, em, px]) => `- \`nys-${name}:\` - min-width ${em} (${px}) and up`,
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

/** Every breakpoint applied to one class, e.g. for a "responsive" bullet. */
const atEachBreakpoint = (cls: string) =>
  inlineList(BREAKPOINTS.map(([name]) => `nys-${name}:${cls}`));

/** One line per category stating its responsive support. */
const responsiveNote = (example: string) =>
  `### Responsive
Every class in this category supports breakpoint prefixes, for example ${atEachBreakpoint(example)}. See the Responsive category.`;

const UTILITY_DOCS = {
  display: `## Display Utilities

Control element visibility and display behavior.

${displayRows}

### Hiding content
\`nys-display-none\` removes the element from the layout AND from the
accessibility tree, so screen readers skip it too. NYSDS ships no
visually-hidden (screen-reader-only) class; to hide something visually but
keep it for assistive technology, use your own visually-hidden CSS. See
https://designsystem.ny.gov/utilities/hiding/ for how each hiding technique
affects assistive technology.

### Table display
Combine \`nys-display-table\`, \`nys-display-table-row\`, and
\`nys-display-table-cell\` to get table-like layout from non-table markup.
Don't use them for tabular data; use a real \`<table>\` or the NYSDS table
component.

${responsiveNote("nys-display-none")}

### Example: Hide on Mobile
\`\`\`html
<div class="nys-display-none nys-tablet:nys-display-block">
  Only visible on tablet and larger
</div>
\`\`\``,

  flex: `## Flexbox Utilities

Build flexible one-dimensional layouts with alignment and ordering. Put
\`nys-display-flex\` (or \`nys-display-inline-flex\`) on the container, then
add the classes below.

### Direction
- \`nys-flex-row\` - flex-direction: row (default)
- \`nys-flex-column\` - flex-direction: column

### Wrapping
- \`nys-flex-wrap\` - flex-wrap: wrap
- \`nys-flex-no-wrap\` - flex-wrap: nowrap

### Alignment (cross axis, on the container)
${bullets(FLEX_ALIGN.map((v) => `- \`nys-flex-align-${v}\` - align-items: ${flexValue(v)}`))}

### Self alignment (on an item)
${bullets(FLEX_ALIGN.map((v) => `- \`nys-flex-align-self-${v}\` - align-self: ${flexValue(v)}`))}

### Justification (main axis, on the container)
${bullets(FLEX_JUSTIFY.map((v) => `- \`nys-flex-justify-${v}\` - justify-content: ${flexValue(v)}`))}

### Item sizing
${bullets(FLEX_COLUMNS.map((n) => `- \`nys-flex-${n}\` - flex: ${n}`))}
- \`nys-flex-auto\` - flex: auto (grow and shrink from content size)
- \`nys-flex-fill\` - flex: 1 1 0% (fill available space equally)

### Gaps
Gaps use the spacing scale (\`gap: var(--nys-space-{value})\`):
${inlineList(spacingKeys)}

- \`nys-flex-gap-{value}\` - gap on both axes, e.g. \`nys-flex-gap-200\`
- \`nys-flex-row-gap-{value}\` - row-gap only, e.g. \`nys-flex-row-gap-200\`
- \`nys-flex-column-gap-{value}\` - column-gap only, e.g. \`nys-flex-column-gap-200\`

### Order
Change an item's visual position without changing the DOM:

${orderRows}

Order changes only what's on screen. Screen readers and keyboard focus still
follow the DOM, so reordering content that has a meaningful sequence can fail
WCAG 1.3.2 (Meaningful Sequence) and 2.4.3 (Focus Order). Keep the DOM in
reading order and reorder only where the sequence doesn't matter.

${responsiveNote("nys-flex-column")} The order classes do too, for example
\`nys-tablet:nys-order-first\`.

### Example: Button Group
\`\`\`html
<div class="nys-display-flex nys-flex-justify-end nys-flex-gap-200">
  <nys-button label="Cancel" variant="outline"></nys-button>
  <nys-button label="Submit"></nys-button>
</div>
\`\`\``,

  float: `## Float Utilities

Float elements left or right within a container, so inline content wraps
around them. For layout, use the grid or flexbox utilities instead; floats
suit content flow, such as text wrapping around an image.

${floatRows}

### Clearing floats
- \`nys-clearfix\` - on a container, makes it contain its floated children
  (adds a \`::after\` with \`clear: both\`)

### Responsive
\`nys-float-left\`, \`nys-float-right\`, and \`nys-float-none\` support
breakpoint prefixes, for example ${atEachBreakpoint("nys-float-left")}.
\`nys-clearfix\` does not. See the Responsive category.

### Example: Image Beside Text from Tablet Up
\`\`\`html
<div class="nys-clearfix">
  <img class="nys-float-none nys-tablet:nys-float-left nys-margin-r-200" src="photo.jpg" alt="..." />
  <p>Text wraps around the image on tablet and larger screens.</p>
</div>
\`\`\``,

  grid: `## Grid System

Structure content with a responsive 12-column flexbox grid. The grid is
mobile-first: unprefixed column classes apply at every width, and
breakpoint-prefixed classes take over from their breakpoint up.

### Structure
\`\`\`html
<div class="nys-grid-container">
  <div class="nys-grid-row">
    <div class="nys-grid-col-6">Half width</div>
    <div class="nys-grid-col-6">Half width</div>
  </div>
</div>
\`\`\`

\`nys-grid-row\` is required as the direct parent of columns. Columns whose
widths add up to more than 12 wrap to a new line.

### Containers
A container centers its rows at a maximum width. It has 1.25rem side padding,
2rem from 48em, and 4rem from 80em. Omit the container when the grid should
span the full page width.

${containerRows}

To change the content width site-wide, set \`--nys-max-width--content\` (for
example on \`:root\`); it overrides every container's max-width and also sets
the header, footer, and breadcrumb width.

### Column Classes
- \`nys-grid-col-[1-12]\` - Fixed width of 1-12 of the 12 columns, e.g. \`nys-grid-col-4\`
- \`nys-grid-col\` - Equal width columns (auto-distributes)
- \`nys-grid-col-auto\` - Column sized to its content
- \`nys-grid-col-fill\` - Column fills remaining space

### Offset Classes
- \`nys-grid-offset-[1-12]\` - Push a column right by 1-12 columns, e.g. \`nys-grid-offset-4\`
- \`nys-grid-offset-none\` - Remove an offset (useful at a larger breakpoint)

### Gap Classes
Gap classes go on the \`nys-grid-row\`. Use \`nys-grid-gap-x-*\` or
\`nys-grid-gap-y-*\` for a single axis. There is no \`nys-grid-gap-0\`; omit
the gap class instead.

Default gaps:
- \`nys-grid-gap\` - 0.5rem horizontal and 1rem vertical; 1rem and 2rem at 64em and up
- \`nys-grid-gap-x\` - 0.5rem horizontal; 1rem at 64em and up
- \`nys-grid-gap-y\` - 1rem vertical; 2rem at 64em and up

Sized gaps (each also comes as \`-x-\` and \`-y-\`, e.g. \`nys-grid-gap-x-200\`):

${gapValueRows}

### Responsive
Containers, \`nys-grid-row\`, every column class, every offset class, and the
sized gap classes support breakpoint prefixes, for example
${atEachBreakpoint("nys-grid-col-6")}. A responsive gap class still needs
\`nys-grid-row\` on the same element. The default gaps (\`nys-grid-gap\`,
\`nys-grid-gap-x\`, \`nys-grid-gap-y\`) have no prefixed versions; they
already grow at 64em. See the Responsive category.

### Example: Form with Sidebar
\`\`\`html
<div class="nys-grid-container">
  <div class="nys-grid-row nys-grid-gap">
    <div class="nys-grid-col-12 nys-desktop:nys-grid-col-4">
      <!-- Sidebar content (stepper, navigation) -->
    </div>
    <div class="nys-grid-col-12 nys-desktop:nys-grid-col-8">
      <!-- Main content (form) -->
    </div>
  </div>
</div>
\`\`\``,

  spacing: `## Margin & Padding Utilities

Add consistent spacing inside and outside elements.

Pattern: \`nys-{property}-{value}\` for all sides, or
\`nys-{property}-{direction}-{value}\` for some sides.

### Properties
- \`margin\` - Space outside the element
- \`padding\` - Space inside the element

### Directions
${bullets(SPACING_DIRECTIONS.map(([key, sides]) => `- \`${key}\` - ${sides}, e.g. \`nys-margin-${key}-200\``))}
- (none) - All sides, e.g. \`nys-padding-200\`

### Values
The utilities emit literal pixel values. There is no zero and no \`auto\`
value — \`nys-margin-0\` and \`nys-padding-0\` are not generated. Omit the
class instead.

${spacingValueRows}

${responsiveNote("nys-margin-b-400")} This includes the directional
classes, for example \`nys-desktop:nys-padding-x-800\`.

### Examples
\`\`\`html
<!-- Add bottom margin to an alert -->
<nys-alert class="nys-margin-b-300">...</nys-alert>

<!-- Add padding to a container -->
<div class="nys-padding-400">...</div>

<!-- Horizontal margin -->
<div class="nys-margin-x-200">...</div>

<!-- More padding on larger screens -->
<section class="nys-padding-y-400 nys-desktop:nys-padding-y-800">...</section>
\`\`\``,

  opacity: `## Opacity Utilities

Control element transparency. Opacity applies to the element and all of its
children. The scale steps by 10 — there is no \`nys-opacity-25\` or
\`nys-opacity-75\`.

${opacityRows}

Lower opacity lowers text contrast, so check that text still meets WCAG 1.4.3
(4.5:1). Opacity doesn't disable anything: a faded control is still focusable
and clickable. Use the component's \`disabled\` property for disabled states.

${responsiveNote("nys-opacity-50")}

### Example
\`\`\`html
<img class="nys-opacity-50 nys-desktop:nys-opacity-100" src="hero.jpg" alt="..." />
\`\`\``,

  overflow: `## Overflow Utilities

Manage content overflow and scrolling behavior: clip it, add scrollbars, or
let it spill out.

${overflowSections}

A region that scrolls (\`auto\` or \`scroll\`) must be reachable by keyboard
(WCAG 2.1.1). If it contains nothing focusable, give it \`tabindex="0"\` and
an accessible name, e.g. \`role="region"\` with \`aria-label\`.

${responsiveNote("nys-overflow-auto")} This includes the \`-x-\` and
\`-y-\` classes, for example \`nys-desktop:nys-overflow-x-visible\`.

### Example: Horizontally Scrolling Table
\`\`\`html
<div class="nys-overflow-x-auto" tabindex="0" role="region" aria-label="Fee schedule">
  <table>...</table>
</div>
\`\`\``,

  position: `## Position Utilities

Control element positioning (static, relative, absolute, fixed, sticky).

${positionRows}

There are no top, right, bottom, or left offset utilities; set offsets in
your own CSS. Pair positioned elements with the Z-index utilities to control
stacking.

${responsiveNote("nys-position-sticky")}

### Examples
\`\`\`html
<!-- Badge pinned to a card's corner -->
<div class="nys-position-relative">
  <span class="nys-position-absolute" style="top: 0; right: 0;">New</span>
</div>

<!-- Sidebar that sticks while scrolling, from desktop up -->
<aside class="nys-position-static nys-desktop:nys-position-sticky" style="top: 1rem;">...</aside>
\`\`\``,

  responsive: `## Responsive Utilities

Apply utility classes at specific screen-width breakpoints.

### Breakpoints
Breakpoints are mobile-first \`min-width\` media queries. An unprefixed class
applies at every width; a prefixed class applies from its breakpoint up.

- (no prefix) - All screen sizes
${breakpointRows}

### Pattern
\`nys-{breakpoint}:{utility class}\` — the breakpoint prefix, a colon, then the
full utility class name, e.g. \`nys-tablet:nys-display-flex\`. Write it as-is in
\`class\`. In a CSS selector, escape the colon:
\`.nys-tablet\\:nys-display-flex\`.

### Utilities that support breakpoint prefixes
Every class in these categories has a version for each breakpoint:

- **Display** - every \`nys-display-*\` class, e.g. ${atEachBreakpoint("nys-display-none")}
- **Flexbox** - every \`nys-flex-*\` class (direction, wrap, align, align-self,
  justify, item sizing, and all gaps) and every \`nys-order-*\` class, e.g.
  \`nys-tablet:nys-flex-row\`, \`nys-desktop:nys-flex-justify-space-between\`,
  \`nys-tablet:nys-flex-gap-400\`, \`nys-desktop:nys-order-last\`
- **Float** - \`nys-float-left\`, \`nys-float-right\`, \`nys-float-none\`,
  e.g. \`nys-tablet:nys-float-right\`
- **Grid** - containers, \`nys-grid-row\`, columns, offsets, and sized gaps,
  e.g. \`nys-desktop:nys-grid-container\`, \`nys-tablet:nys-grid-col-6\`,
  \`nys-desktop:nys-grid-col-auto\`, \`nys-desktop:nys-grid-offset-2\`,
  \`nys-desktop:nys-grid-offset-none\`, \`nys-desktop:nys-grid-gap-400\`
  (on an element that also has \`nys-grid-row\`)
- **Margin & Padding** - every \`nys-margin-*\` and \`nys-padding-*\` class,
  including directional ones, e.g. \`nys-tablet:nys-margin-b-400\`,
  \`nys-desktop:nys-padding-x-800\`
- **Opacity** - every \`nys-opacity-*\` class, e.g. \`nys-desktop:nys-opacity-100\`
- **Overflow** - every \`nys-overflow-*\`, \`nys-overflow-x-*\`, and
  \`nys-overflow-y-*\` class, e.g. \`nys-desktop:nys-overflow-visible\`
- **Position** - every \`nys-position-*\` class, e.g. \`nys-desktop:nys-position-sticky\`
- **Z-index** - every \`nys-z-*\` class, e.g. \`nys-desktop:nys-z-500\`

### Utilities that do NOT support breakpoint prefixes
- **Typography** - no \`nys-font-*\` class has a prefixed version
- \`nys-clearfix\`
- The default grid gaps \`nys-grid-gap\`, \`nys-grid-gap-x\`, and
  \`nys-grid-gap-y\` (they already grow at 64em)

### How prefixes combine
A prefixed class wins from its breakpoint up, so set the small-screen value
without a prefix and override it at larger breakpoints. Each breakpoint keeps
its value until a larger one overrides it.

\`\`\`html
<!-- 12 columns on mobile, 6 from tablet, 4 from desktop, 3 from widescreen -->
<div class="nys-grid-col-12 nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-4 nys-widescreen:nys-grid-col-3">
\`\`\`

Changing a layout drastically between breakpoints can disorient users. Keep
the content order the same at every size.

### Examples
\`\`\`html
<!-- Stack on mobile, row with space between from tablet -->
<div class="nys-display-flex nys-flex-column nys-flex-gap-200 nys-tablet:nys-flex-row nys-tablet:nys-flex-justify-space-between">
  Responsive flex layout
</div>

<!-- Hide on mobile, show from desktop -->
<div class="nys-display-none nys-desktop:nys-display-block">
  Desktop only content
</div>

<!-- Tighter spacing on mobile, roomier on desktop -->
<section class="nys-padding-200 nys-desktop:nys-padding-600">...</section>

<!-- Sticky sidebar only on wide screens -->
<aside class="nys-desktop:nys-position-sticky nys-desktop:nys-z-100">...</aside>

<!-- Wider grid gaps from desktop -->
<div class="nys-grid-row nys-grid-gap-200 nys-desktop:nys-grid-gap-400">...</div>
\`\`\``,

  typography: `## Typography Utilities

Apply font size, weight, and style presets. NYSDS ships a role-based type
scale, not atomic text modifiers. Each class sets font-family, size, weight,
line-height, and letter-spacing together, matching the text styles in the
NYSDS Foundations Figma file.

There are NO text-alignment, text-transform, or font-weight utilities
(no \`nys-text-center\`, no \`nys-font-bold\`). Use CSS for those.

### Headings
${headingRows}

Heading classes change only the look. Keep the heading element (\`<h1>\`–\`<h6>\`)
that fits the document outline, and use the class to restyle it.

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
- \`[class*="nys-font-serif-"]\` - serif family

### Responsive
Typography classes do NOT support breakpoint prefixes. To change type at a
breakpoint, use your own media query.`,

  zindex: `## Z-Index Utilities

Control stacking order of overlapping elements. Higher values sit in front.
z-index only works on positioned elements, so pair these with a Position
utility other than \`nys-position-static\`.

The scale steps by 100, not by 10. \`nys-z-10\` through \`nys-z-50\` do not
exist — the comparable values are \`nys-z-100\` through \`nys-z-500\`.

${zindexRows}

${responsiveNote("nys-z-100")}

### Example
\`\`\`html
<div class="nys-position-relative nys-z-0 nys-desktop:nys-z-500">...</div>
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
 * Classes the reference says have no breakpoint-prefixed versions.
 * `verify-utility-docs.mjs` asserts the stylesheet defines none of them with
 * a `nys-{breakpoint}:` prefix, and that every other documented class has one.
 */
const NOT_RESPONSIVE: readonly RegExp[] = [
  /^nys-font-/,
  /^nys-clearfix$/,
  /^nys-grid-gap(-x|-y)?$/,
];

/**
 * Class families the reference documents by pattern rather than by listing
 * every name (e.g. `nys-margin-{direction}-{value}`). The verifier counts a
 * stylesheet class as documented if it is named outright or matches one of
 * these.
 */
const DOCUMENTED_PATTERNS: readonly RegExp[] = [
  /^nys-(margin|padding)(-[trblxy])?-(1px|2px|\d+)$/,
  /^nys-flex-(row-|column-)?gap-(1px|2px|\d+)$/,
  /^nys-grid-gap(-x|-y)?-(1px|2px|\d+)$/,
  /^nys-grid-col-([1-9]|1[0-2])$/,
  /^nys-grid-offset-([1-9]|1[0-2])$/,
];

/**
 * Exported so `src/scripts/verify-utility-docs.mjs` can check this reference
 * against the compiled stylesheet in both directions.
 */
export { UTILITY_DOCS, KNOWN_ABSENT, NOT_RESPONSIVE, DOCUMENTED_PATTERNS };

/**
 * Prepended to every response: the utility classes only exist in the full
 * install, and agents on the default install otherwise write classes that do
 * nothing. Kept out of UTILITY_DOCS so verify-utility-docs doesn't harvest it.
 */
const INSTALL_REQUIREMENT = `> **Requires the full install.** These classes ship only in \`@nysds/styles/full\` (\`nysds-full.min.css\`). The default install, \`@nysds/styles\` (\`nysds.min.css\`), contains only CSS variables, so none of these classes work with it. The \`nys-font-*\` typography classes are also available on their own from \`@nysds/styles/typography\`, loaded alongside \`@nysds/styles\`. See get_guide({ topic: "styles" }).`;

/** Category order for `all`, matching designsystem.ny.gov/utilities. */
const CATEGORIES = [
  "display",
  "flex",
  "float",
  "grid",
  "spacing",
  "opacity",
  "overflow",
  "position",
  "responsive",
  "typography",
  "zindex",
] as const;

export function registerUtilityTools(server: McpServer): void {
  // get_utility_classes - Comprehensive utility class reference
  server.tool(
    "get_utility_classes",
    "Get the NYSDS utility class reference: display, flexbox (including order), float, grid, margin & padding, opacity, overflow, position, responsive breakpoint prefixes, typography, and z-index. Each category says whether its classes support breakpoint prefixes. These classes require the full @nysds/styles install (@nysds/styles/full); the default @nysds/styles install has CSS variables only.",
    {
      category: z
        .enum([...CATEGORIES, "all"])
        .optional()
        .describe(
          "Category of utility classes to retrieve. 'spacing' is margin & padding; 'flex' includes order; 'responsive' lists every utility that supports breakpoint prefixes. Defaults to 'all'.",
        ),
    },
    async ({ category = "all" }) => {
      const content =
        category === "all"
          ? `# NYSDS Utility Classes

${[...CATEGORIES.map((c) => UTILITY_DOCS[c]), UTILITY_DOCS.componentSpacing].join("\n\n")}`
          : UTILITY_DOCS[category];

      return {
        content: [
          {
            type: "text",
            text: `${INSTALL_REQUIREMENT}\n\n${content}`,
          },
        ],
      };
    },
  );
}

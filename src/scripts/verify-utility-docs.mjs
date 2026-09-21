// Verifies that every utility class named by the MCP `get_utility_classes` tool
// actually exists in the compiled stylesheet.
//
// Why this exists: the tool's reference used to be a hand-maintained markdown
// string. It drifted — advertising ~18 classes that had never existed
// (`nys-text-center`, `nys-font-bold`, `nys-z-50`, `nys-opacity-25`,
// `nys-margin-0`, ...) plus a spacing table at half the real values. Nothing in
// the build could notice, because no code ever compared the prose to the CSS.
// This script closes that loop: it renders the docs, harvests every class name
// out of them, compiles the real stylesheet, and fails on any name the
// stylesheet does not define.
//
// Run AFTER `npm run build:mcp`.  Usage: node src/scripts/verify-utility-docs.mjs
import * as sass from "sass";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const STYLES_SRC = resolve(process.cwd(), "packages/styles/src");
const MCP_DIST = resolve(
  process.cwd(),
  "packages/mcp-server/dist/tools/utility-tools.js",
);

/* 1. Compile the utility + typography layers. These are the only layers that
 *    emit `nys-*` utility classes; skipping core/tokens keeps the script from
 *    depending on a built @nysds/tokens. */
let css;
try {
  css = sass.compileString(
    '@use "utilities" as *;\n@use "core/typography" as *;\n',
    {
      loadPaths: [STYLES_SRC],
      style: "compressed",
      silenceDeprecations: ["global-builtin", "import"],
    },
  ).css;
} catch (err) {
  console.error(`Could not compile ${STYLES_SRC}:\n${err.message}`);
  process.exit(1);
}

/* 2. Every class the stylesheet actually defines. Selectors escape `:` in
 *    responsive variants (`.nys-tablet\:nys-display-block`), so unescape. */
const defined = new Set(
  [...css.matchAll(/\.((?:[A-Za-z0-9_-]|\\.)+)/g)].map((m) =>
    m[1].replace(/\\(.)/g, "$1"),
  ),
);

/* 3. Every class the MCP docs name. Two sources: `class="..."` attributes in
 *    the HTML examples, and single-token inline code spans. Tag names in the
 *    examples (`<nys-button>`) are excluded by construction. */
let UTILITY_DOCS, KNOWN_ABSENT;
try {
  ({ UTILITY_DOCS, KNOWN_ABSENT } = await import(pathToFileURL(MCP_DIST).href));
} catch {
  console.error(
    `Could not import ${MCP_DIST}\nRun \`npm run build:mcp\` first.`,
  );
  process.exit(1);
}

const claimed = new Map(); // class name -> categories that named it

for (const [category, text] of Object.entries(UTILITY_DOCS)) {
  const tokens = [];
  for (const m of text.matchAll(/class="([^"]+)"/g)) {
    tokens.push(...m[1].split(/\s+/));
  }
  for (const m of text.matchAll(/`([^`\n]+)`/g)) {
    tokens.push(m[1]);
  }

  for (const raw of tokens) {
    const token = raw.trim();
    if (!token.startsWith("nys-")) continue;
    // Patterns and prefixes, not concrete class names:
    //   nys-{property}-...   nys-grid-col-[1-12]   nys-tablet:   nys-font-mono-
    if (/[{}[\]*]/.test(token)) continue;
    if (token.endsWith(":") || token.endsWith("-")) continue;
    if (KNOWN_ABSENT.includes(token)) continue;
    if (!claimed.has(token)) claimed.set(token, new Set());
    claimed.get(token).add(category);
  }
}

/* 4. Compare, both directions. */
const missing = [...claimed.entries()].filter(([cls]) => !defined.has(cls));
// A warning that says "nys-text-center does not exist" becomes a lie the day
// someone adds it, so assert the absences too.
const staleWarnings = KNOWN_ABSENT.filter((cls) => defined.has(cls));

console.log(
  `Checked ${claimed.size} class names from ${Object.keys(UTILITY_DOCS).length} doc sections ` +
    `against ${defined.size} classes in the compiled stylesheet.`,
);
console.log(
  `Checked ${KNOWN_ABSENT.length} documented-as-absent class names are still absent.`,
);

if (missing.length === 0 && staleWarnings.length === 0) {
  console.log("PASS - every documented utility class exists.");
  process.exit(0);
}

if (staleWarnings.length > 0) {
  console.error(
    `\nFAIL - ${staleWarnings.length} class(es) documented as non-existent now exist:\n`,
  );
  for (const cls of staleWarnings) {
    console.error(`  ${cls}`);
  }
  console.error(
    "\nThe stylesheet gained a class the reference tells people not to use.\n" +
      "Remove it from KNOWN_ABSENT and document it properly.",
  );
}

if (missing.length > 0) {
  console.error(
    `\nFAIL - ${missing.length} documented class(es) do not exist:\n`,
  );
  for (const [cls, categories] of missing) {
    console.error(`  ${cls}  (named in: ${[...categories].sort().join(", ")})`);
  }
  console.error(
    "\nEither the class was removed from the stylesheet or the doc scale in\n" +
      "packages/mcp-server/src/tools/utility-tools.ts names something that was\n" +
      "never generated. Fix the scale, rebuild the MCP server, and re-run.",
  );
}

process.exit(1);

#!/usr/bin/env node
/**
 * generate-stories.mjs
 *
 * Parses @example blocks from a web component's main .ts source file and
 * generates a .stories.ts file in the same directory.
 *
 * Usage:
 *   node generate-stories.mjs <path-to-component.ts>
 *
 * Example:
 *   node generate-stories.mjs packages/nys-accordion/src/nys-accordion.ts
 */

import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse @example blocks from a JSDoc comment string.
 * Returns an array of { name: string, html: string }.
 */
function parseExamples(source) {
  const examples = [];
  const exampleRegex =
    /\*\s*@example\s+([^\n]+)\n([\s\S]*?)(?=\*\s*@example|\*\/)/g;

  let match;
  while ((match = exampleRegex.exec(source)) !== null) {
    const name = match[1].trim();
    const body = match[2];

    const codeMatch = body.match(/```html\n([\s\S]*?)```/);
    if (!codeMatch) continue;

    const html = codeMatch[1]
      .split("\n")
      .map((line) => line.replace(/^\s*\*\s?/, ""))
      .join("\n")
      .trimEnd();

    examples.push({ name, html });
  }

  return examples;
}

/**
 * Convert an @example name to a valid TS export identifier.
 * e.g. "Single Select" -> "SingleSelect"
 */
function toStoryName(name) {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
}

/**
 * Parse attributes from the raw attribute string of a single opening tag.
 * Receives ONLY the attr portion (everything between tag name and >).
 *
 * Returns:
 *   booleans: string[]           — presence-only attrs, e.g. singleSelect, bordered
 *   strings:  Record<string,string> — key="value" attrs
 */
function parseTagAttrs(attrStr) {
  const booleans = [];
  const strings = {};

  // First extract key="value" or key='value', remove them from consideration
  const stringAttrRe = /([\w-]+)=["']([^"']*)["']/g;
  const remaining = attrStr.replace(stringAttrRe, (_, k, v) => {
    strings[k] = v;
    return ""; // remove matched portion
  });

  // What's left: standalone words are boolean attrs
  // Match whole words that look like valid HTML attribute names (camelCase or kebab)
  const boolAttrRe = /\b([a-zA-Z][\w-]*)\b/g;
  let m;
  while ((m = boolAttrRe.exec(remaining)) !== null) {
    booleans.push(m[1]);
  }

  return { booleans, strings };
}

/**
 * Extract all opening tags from an HTML string as { tagName, attrStr } pairs.
 */
function extractTags(html) {
  const tags = [];
  // Match <tagName ...attrs...> — non-greedy, stops at >
  const tagRe = /<([\w-]+)((?:\s[^>]*)?)\s*\/?>/g;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    tags.push({ tagName: m[1], attrStr: m[2] });
  }
  return tags;
}

/**
 * Collect ALL nys- component attrs across all tags in all examples.
 * Returns { booleans: Set<string>, strings: Set<string> }
 *
 * Filters out non-argType attrs: id, style, href, target, class
 */
const SKIP_ATTRS = new Set(["id", "style", "href", "target", "class"]);

function collectAllAttrs(examples) {
  const allBooleans = new Set();
  const allStrings = new Set();

  for (const { html } of examples) {
    for (const { tagName, attrStr } of extractTags(html)) {
      if (!tagName.startsWith("nys-")) continue;
      const { booleans, strings } = parseTagAttrs(attrStr);
      booleans.filter((b) => !SKIP_ATTRS.has(b)).forEach((b) => allBooleans.add(b));
      Object.keys(strings)
        .filter((k) => !SKIP_ATTRS.has(k))
        .forEach((k) => allStrings.add(k));
    }
  }

  return { booleans: allBooleans, strings: allStrings };
}

/**
 * Build the args object for the Basic story from the first example's HTML.
 * Pulls from root component tag + first child item tag.
 */
function buildBasicArgs(html) {
  const args = {};
  const tags = extractTags(html);

  // Root tag (first tag)
  if (tags.length > 0) {
    const { booleans, strings } = parseTagAttrs(tags[0].attrStr);
    booleans.filter((b) => !SKIP_ATTRS.has(b)).forEach((b) => (args[b] = true));
    Object.entries(strings)
      .filter(([k]) => !SKIP_ATTRS.has(k))
      .forEach(([k, v]) => (args[k] = v));
  }

  // First child item tag
  const childTag = tags.find((t) => t.tagName !== tags[0].tagName);
  if (childTag) {
    const { booleans, strings } = parseTagAttrs(childTag.attrStr);
    booleans.filter((b) => !SKIP_ATTRS.has(b)).forEach((b) => (args[b] = true));
    Object.entries(strings)
      .filter(([k]) => !SKIP_ATTRS.has(k))
      .forEach(([k, v]) => (args[k] = v));
  }

  return args;
}

/**
 * Build argTypes block string.
 */
function buildArgTypes(booleans, strings) {
  const entries = [];
  entries.push(`    id: { control: "text" }`);
  strings.forEach((s) => {
    if (s !== "id") entries.push(`    ${s}: { control: "text" }`);
  });
  booleans.forEach((b) => {
    entries.push(`    ${b}: { control: "boolean", default: false }`);
  });
  return entries.join(",\n");
}

/**
 * Build interface fields string.
 */
function buildInterfaceFields(booleans, strings) {
  const lines = [];
  lines.push("  id: string;");
  strings.forEach((s) => {
    if (s !== "id") lines.push(`  ${s}: string;`);
  });
  booleans.forEach((b) => {
    lines.push(`  ${b}: boolean;`);
  });
  return lines.join("\n");
}

/**
 * Infer Storybook title from component name.
 * nys-accordion -> Components/Accordion
 */
function inferTitle(componentName) {
  const base = componentName
    .replace(/^nys-/, "")
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  return `Components/${base}`;
}

/**
 * Indent every non-empty line by n spaces.
 */
function indent(str, n) {
  const pad = " ".repeat(n);
  return str
    .split("\n")
    .map((l) => (l.trim() === "" ? "" : pad + l))
    .join("\n");
}

/**
 * Build the Basic (dynamic) story.
 *
 * Strategy:
 *  - Replace root tag's attrs with dynamic bindings
 *  - Replace first child item tag's attrs with dynamic bindings
 *  - Leave the rest of the HTML untouched
 */
function buildBasicStory(example, args) {
  const html = example.html;

  // --- Replace root opening tag ---
  const rootTagRe = /^(<)([\w-]+)((?:\s[^>]*)?)(\/?>)/;
  const rootTagMatch = html.match(rootTagRe);
  if (!rootTagMatch) {
    // Fallback: fully static
    return buildStaticStory(example, "Basic");
  }

  const rootTagName = rootTagMatch[2];
  const rootAttrStr = rootTagMatch[3];
  const { booleans: rb, strings: rs } = parseTagAttrs(rootAttrStr);

  const rootDynamicAttrs = [
    ...rb.filter((b) => !SKIP_ATTRS.has(b)).map((b) => `      ?${b}=\${args.${b}}`),
    ...Object.keys(rs)
      .filter((k) => !SKIP_ATTRS.has(k))
      .map((k) => `      .${k}=\${args.${k}}`),
  ];

  const rootReplacement =
    rootDynamicAttrs.length > 0
      ? `<${rootTagName}\n${rootDynamicAttrs.join("\n")}\n    >`
      : `<${rootTagName}>`;

  let remaining = html.slice(rootTagMatch[0].length);

  // --- Replace first child item opening tag ---
  // Match the first nys-*item or nys-*-item tag
  const childTagRe = /<([\w-]+-item|[\w-]+item)((?:\s[^>]*)?)(\/?>)/;
  const childTagMatch = remaining.match(childTagRe);

  let beforeChild = "";
  let childReplacement = "";
  let afterChild = remaining;

  if (childTagMatch) {
    const childTagName = childTagMatch[1];
    const childAttrStr = childTagMatch[2];
    const { booleans: cb, strings: cs } = parseTagAttrs(childAttrStr);

    beforeChild = remaining.slice(0, childTagMatch.index);
    afterChild = remaining.slice(childTagMatch.index + childTagMatch[0].length);

    const childDynamicAttrs = [
      "        .id=${args.id}",
      ...cb.filter((b) => !SKIP_ATTRS.has(b)).map((b) => `        .${b}=\${args.${b}}`),
      ...Object.keys(cs)
        .filter((k) => !SKIP_ATTRS.has(k))
        .map((k) => `        .${k}=\${args.${k}}`),
    ];

    childReplacement = `<${childTagName}\n${childDynamicAttrs.join("\n")}\n      >`;
  }

  const renderHtml = `${rootReplacement}${beforeChild}${childReplacement}${afterChild}`;

  // Format args block
  const argsLines = Object.entries(args)
    .map(([k, v]) => `    ${k}: ${typeof v === "boolean" ? v : `"${v}"`}`)
    .join(",\n");

  return `export const Basic: Story = {
  args: {
${argsLines}
  },
  render: (args) => html\`
    ${renderHtml.trim()}
  \`,
  parameters: {
    docs: {
      source: {
        code: \`
${example.html}\`,
        type: "auto",
      },
    },
  },
};`;
}

/**
 * Build a static story.
 */
function buildStaticStory(example, nameOverride) {
  const storyName = nameOverride || toStoryName(example.name);

  return `export const ${storyName}: Story = {
  render: () => html\`
${indent(example.html, 4)}
  \`,
  parameters: {
    docs: {
      source: {
        code: \`
${example.html}\`,
        type: "auto",
      },
    },
  },
};`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: node generate-stories.mjs <path-to-component.ts>");
    process.exit(1);
  }

  const resolvedInput = path.resolve(inputPath);
  if (!fs.existsSync(resolvedInput)) {
    console.error(`File not found: ${resolvedInput}`);
    process.exit(1);
  }

  const source = fs.readFileSync(resolvedInput, "utf8");
  const componentName = path.basename(resolvedInput, ".ts");

  const examples = parseExamples(source);
  if (examples.length === 0) {
    console.warn(`No @example blocks found in ${resolvedInput}. Skipping.`);
    process.exit(0);
  }

  // Collect all attrs across all examples
  const { booleans: allBooleans, strings: allStrings } = collectAllAttrs(examples);

  const title = inferTitle(componentName);
  const interfaceName =
    componentName
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join("") + "Args";

  // Collect sibling nys- component imports from all example HTML
  const usedTags = new Set();
  examples.forEach(({ html }) => {
    const tagRe = /<(nys-[\w-]+)/g;
    let m;
    while ((m = tagRe.exec(html)) !== null) {
      usedTags.add(m[1]);
    }
  });

  const siblingImports = [...usedTags]
    .filter((t) => t !== componentName)
    .map((t) =>
      t === "nys-icon"
        ? `import "@nysds/nys-icon";`
        : `import "./${t}";`
    )
    .join("\n");

  const importsBlock = [
    `import { html } from "lit";`,
    `import { Meta, StoryObj } from "@storybook/web-components-vite";`,
    `import "./${componentName}";`,
    siblingImports,
  ]
    .filter(Boolean)
    .join("\n");

  const metaBlock = `// Define the structure of the args used in the stories
interface ${interfaceName} {
${buildInterfaceFields(allBooleans, allStrings)}
}

const meta: Meta<${interfaceName}> = {
  title: "${title}",
  component: "${componentName}",
  argTypes: {
${buildArgTypes(allBooleans, allStrings)}
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<${interfaceName}>;`;

  // Build stories
  const storyBlocks = examples.map((example, i) => {
    if (i === 0) {
      const args = buildBasicArgs(example.html);
      return buildBasicStory(example, args);
    }
    return buildStaticStory(example);
  });

  const output = [importsBlock, "", metaBlock, "", storyBlocks.join("\n\n"), ""].join("\n");

  const outputPath = path.join(
    path.dirname(resolvedInput),
    `${componentName}.stories.ts`
  );

  fs.writeFileSync(outputPath, output, "utf8");
  console.log(`✓ Generated ${outputPath}`);
}

main();

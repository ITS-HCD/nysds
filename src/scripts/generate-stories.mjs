#!/usr/bin/env node
/**
 * generate-stories.mjs
 *
 * Parses @example blocks from a web component's main .ts source file and
 * generates a .stories.ts file in the same directory.
 *
 * Accepts one or more file paths (glob-expanded by the shell).
 * Only processes root components — files whose basename matches the package
 * folder name 2 levels up (e.g. packages/nys-accordion/src/nys-accordion.ts).
 * Subcomponents in the same directory (e.g. nys-accordionitem.ts) are detected
 * automatically and their @example stories are appended to the root stories file.
 *
 * Usage:
 *   node generate-stories.mjs packages/nys-accordion/src/nys-accordion.ts
 *   node generate-stories.mjs packages/nys-accordion/src/nys-accordion.ts
 */

import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function toStoryName(name) {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
}

function parseTagAttrs(attrStr) {
  const booleans = [];
  const strings = {};

  const stringAttrRe = /([\w-]+)=["']([^"']*)["']/g;
  const remaining = attrStr.replace(stringAttrRe, (_, k, v) => {
    strings[k] = v;
    return "";
  });

  const boolAttrRe = /\b([a-zA-Z][\w-]*)\b/g;
  let m;
  while ((m = boolAttrRe.exec(remaining)) !== null) {
    booleans.push(m[1]);
  }

  return { booleans, strings };
}

function extractTags(html) {
  const tags = [];
  const tagRe = /<([\w-]+)((?:\s[^>]*)?)\s*\/?>/g;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    tags.push({ tagName: m[1], attrStr: m[2] });
  }
  return tags;
}

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

function buildBasicArgs(html) {
  const args = {};
  const tags = extractTags(html);

  if (tags.length > 0) {
    const { booleans, strings } = parseTagAttrs(tags[0].attrStr);
    booleans.filter((b) => !SKIP_ATTRS.has(b)).forEach((b) => (args[b] = true));
    Object.entries(strings)
      .filter(([k]) => !SKIP_ATTRS.has(k))
      .forEach(([k, v]) => (args[k] = v));
  }

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

function inferTitle(componentName) {
  const base = componentName
    .replace(/^nys-/, "")
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  return `Components/${base}`;
}

function indent(str, n) {
  const pad = " ".repeat(n);
  return str
    .split("\n")
    .map((l) => (l.trim() === "" ? "" : pad + l))
    .join("\n");
}

function buildBasicStory(example, args) {
  const html = example.html;

  const rootTagRe = /^(<)([\w-]+)((?:\s[^>]*)?)(\/?>)/;
  const rootTagMatch = html.match(rootTagRe);
  if (!rootTagMatch) {
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

function findSubcomponents(rootFilePath) {
  const dir = path.dirname(rootFilePath);
  const rootBase = path.basename(rootFilePath);

  const subcomponents = [];

  const entries = fs.readdirSync(dir).filter(
    (f) =>
      f.endsWith(".ts") &&
      !f.endsWith(".stories.ts") &&
      !f.endsWith(".d.ts") &&
      f !== rootBase
  );

  for (const entry of entries) {
    const filePath = path.join(dir, entry);
    const source = fs.readFileSync(filePath, "utf8");
    const examples = parseExamples(source);
    if (examples.length > 0) {
      subcomponents.push({
        filePath,
        componentName: path.basename(entry, ".ts"),
        examples,
      });
    }
  }

  return subcomponents;
}

/**
 * A file is a root component if its basename (without .ts) matches the
 * package folder name two levels up:
 *   packages/nys-accordion/src/nys-accordion.ts  -> nys-accordion == nys-accordion ✓
 *   packages/nys-accordion/src/nys-accordionitem.ts -> nys-accordionitem != nys-accordion ✗
 */
function isRootComponent(resolvedFilePath) {
  const fileName = path.basename(resolvedFilePath, ".ts");
  const packageDir = path.dirname(path.dirname(resolvedFilePath));
  const packageName = path.basename(packageDir);
  return fileName === packageName;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function processComponent(inputPath) {
  const resolvedInput = path.resolve(inputPath);
  if (!fs.existsSync(resolvedInput)) {
    console.error(`File not found: ${resolvedInput}`);
    return;
  }

  if (!isRootComponent(resolvedInput)) {
    console.log(`  Skipping ${path.basename(resolvedInput)} (not a root component)`);
    return;
  }

  const source = fs.readFileSync(resolvedInput, "utf8");
  const componentName = path.basename(resolvedInput, ".ts");

  const rootExamples = parseExamples(source);
  if (rootExamples.length === 0) {
    console.warn(`  No @example blocks found in ${path.basename(resolvedInput)}. Skipping.`);
    return;
  }

  const subcomponents = findSubcomponents(resolvedInput);
  if (subcomponents.length > 0) {
    console.log(
      `  Found subcomponents: ${subcomponents.map((s) => s.componentName).join(", ")}`
    );
  }

  const allExamples = [
    ...rootExamples.map((e) => ({ ...e, isRoot: true })),
    ...subcomponents.flatMap(({ examples }) =>
      examples.map((e) => ({ ...e, isRoot: false }))
    ),
  ];

  const { booleans: allBooleans, strings: allStrings } = collectAllAttrs(allExamples);

  const title = inferTitle(componentName);
  const interfaceName =
    componentName
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join("") + "Args";

  const usedTags = new Set();
  allExamples.forEach(({ html }) => {
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

  const storyBlocks = allExamples.map((example, i) => {
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

function main() {
  const inputPaths = process.argv.slice(2);
  if (inputPaths.length === 0) {
    console.error("Usage: node generate-stories.mjs <path-to-component.ts> [...]");
    process.exit(1);
  }

  for (const inputPath of inputPaths) {
    processComponent(inputPath);
  }
}

main();

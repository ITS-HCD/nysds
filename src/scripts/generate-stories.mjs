#!/usr/bin/env node
import fs from "fs";
import path from "path";
import prettier from "prettier";

// ---------------------------------------------------------------------------
// Helpers (kept mostly the same, adapted for CEM structure)
// ---------------------------------------------------------------------------

async function formatCode(code) {
  if (!code) return "";
  try {
    // Basic heuristic: if it contains '<' and '>', try HTML
    if (code.includes("<") && code.includes(">")) {
      return (
        await prettier.format(code, {
          parser: "html",
          printWidth: 100,
          htmlWhitespaceSensitivity: "ignore",
        })
      ).trim();
    }
    // Otherwise try typescript
    return (
      await prettier.format(code, {
        parser: "typescript",
        printWidth: 100,
      })
    ).trim();
  } catch (e) {
    return code.trim();
  }
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

function collectAllAttrs(examples, allAttributesMap, primaryTagName) {
  const allBooleans = new Set();
  const allStrings = new Map();

  // Helper to get type from the attribute list
  const getType = (tagName, attrName) => {
    const attrs = allAttributesMap[tagName] || [];
    const attr = attrs.find((a) => a.name === attrName);
    return attr && attr.type ? attr.type.text : "string";
  };

  // 1. Seed with all attributes from the primary component
  const primaryAttrs = allAttributesMap[primaryTagName] || [];
  primaryAttrs.forEach((attr) => {
    if (SKIP_ATTRS.has(attr.name)) return;
    const typeText = attr.type ? attr.type.text : "string";
    if (typeText === "boolean") {
      allBooleans.add(attr.name);
    } else {
      allStrings.set(attr.name, typeText);
    }
  });

  // 2. Add attributes found in examples (this handles secondary components)
  for (const { code } of examples) {
    for (const { tagName, attrStr } of extractTags(code)) {
      if (!tagName.startsWith("nys-")) continue;
      const { booleans, strings } = parseTagAttrs(attrStr);
      booleans.filter((b) => !SKIP_ATTRS.has(b)).forEach((b) => {
        const type = getType(tagName, b);
        if (type === "boolean") {
          allBooleans.add(b);
        } else if (!allStrings.has(b) || allStrings.get(b) === "string") {
          allStrings.set(b, type);
        }
      });

      Object.keys(strings)
        .filter((k) => !SKIP_ATTRS.has(k))
        .forEach((k) => {
          const type = getType(tagName, k);
          if (type === "boolean") {
            allBooleans.add(k);
          } else if (!allStrings.has(k) || allStrings.get(k) === "string") {
            allStrings.set(k, type);
          }
        });
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

function buildArgTypes(booleans, stringsMap) {
  const entries = [];
  entries.push(`    id: { control: "text" }`);
  stringsMap.forEach((type, name) => {
    if (name === "id") return;

    const cleanType = type.replace(/\s+/g, " ").replace(/^\|\s*/, "").trim();
    if (cleanType.includes("|") && cleanType.includes("\"")) {
      const options = cleanType
        .split("|")
        .map((s) => s.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
      entries.push(`    ${name}: { control: "select", options: ${JSON.stringify(options)} }`);
    } else if (cleanType === "number") {
      entries.push(`    ${name}: { control: "number" }`);
    } else {
      entries.push(`    ${name}: { control: "text" }`);
    }
  });
  booleans.forEach((b) => {
    entries.push(`    ${b}: { control: "boolean", default: false }`);
  });
  return entries.join(",\n");
}

function buildInterfaceFields(booleans, stringsMap) {
  const lines = [];
  lines.push("  id: string;");
  stringsMap.forEach((type, name) => {
    if (name !== "id") {
      const cleanType = type.replace(/\s+/g, " ").replace(/^\|\s*/, "").trim();
      lines.push(`  ${name}: ${cleanType};`);
    }
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

function escapeCode(code) {
  return code.split("`").join("\\`").split("${").join("${");
}

function isHtml(code) {
  return code.trim().startsWith("<");
}

function buildBasicStory(example, args, allBooleans, allStrings) {
  const html = example.code;

  const rootTagRe = /^(<)([\w-]+)((?:\s[^>]*)?)(\/?>)/;
  const rootTagMatch = html.match(rootTagRe);
  if (!rootTagMatch) {
    return buildStaticStory(example, "Basic");
  }

  const rootTagName = rootTagMatch[2];

  const rootDynamicAttrs = [
    `      .id=\${args.id}`,
    ...Array.from(allBooleans).map((b) => `      ?${b}=\${args.${b}}`),
    ...Array.from(allStrings.keys()).map((k) => `      .${k}=\${args.${k}}`),
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
    ${escapeCode(renderHtml.trim())}
  \`,
  parameters: {
    docs: {
      source: {
        code: \`
${escapeCode(example.code.trim())}\`,
        type: "auto",
      },
    },
  },
};`;
}

function buildStaticStory(example, nameOverride) {
  const storyName = nameOverride || toStoryName(example.title);
  const code = example.code;

  let renderTemplate;
  if (isHtml(code)) {
    renderTemplate = `html\`
${indent(escapeCode(code), 4)}
  \``;
  } else {
    renderTemplate = `html\`<pre style="white-space: pre-wrap; font-family: monospace; font-size: 0.85em; background: #f4f4f4; padding: 1em; border-radius: 4px;"><code>\${${JSON.stringify(
      code
    )}}</code></pre>\``;
  }

  return `export const ${storyName}: Story = {
  render: () => ${renderTemplate},
  parameters: {
    docs: {
      source: {
        code: \`
${escapeCode(example.code.trim())}\`,
        type: "auto",
      },
    },
  },
};`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const cem = JSON.parse(fs.readFileSync("custom-elements.json", "utf8"));

  // Build a map of all component attributes and their types for lookups
  const allAttributesMap = {};
  for (const mod of cem.modules) {
    for (const decl of mod.declarations || []) {
      if (decl.tagName) {
        allAttributesMap[decl.tagName] = decl.attributes || [];
      }
    }
  }

  // Group declarations by module path to maintain bundling
  const modulesByPath = {};
  for (const mod of cem.modules) {
    modulesByPath[mod.path] = mod.declarations || [];
  }

  // Find root components to generate stories for
  const rootModules = cem.modules.filter((mod) => {
    const fileName = path.basename(mod.path, ".ts");
    const packageDir = path.dirname(path.dirname(mod.path));
    const packageName = path.basename(packageDir);
    return fileName === packageName;
  });

  for (const mod of rootModules) {
    const componentName = path.basename(mod.path, ".ts");
    const dir = path.dirname(mod.path);

    // Collect all examples from all declarations in the same module directory
    const allExamples = [];

    // Find all modules in the same directory
    const moduleEntries = Object.entries(modulesByPath);
    for (const [modPath, declarations] of moduleEntries) {
      if (path.dirname(modPath) === dir) {
        for (const decl of declarations) {
          if (decl.examples) {
            allExamples.push(...decl.examples);
          }
        }
      }
    }

    // Format all examples
    for (const example of allExamples) {
      example.code = await formatCode(example.code);
    }

    if (allExamples.length === 0) {
      console.log(`  No examples found for ${componentName}. Skipping.`);
      continue;
    }

    const { booleans: allBooleans, strings: allStrings } = collectAllAttrs(
      allExamples,
      allAttributesMap,
      componentName
    );

    const title = inferTitle(componentName);
    const interfaceName =
      componentName
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join("") + "Args";

    const usedTags = new Set();
    allExamples.forEach(({ code }) => {
      const tagRe = /<(nys-[\w-]+)/g;
      let m;
      while ((m = tagRe.exec(code)) !== null) {
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
        const args = buildBasicArgs(example.code);
        return buildBasicStory(example, args, allBooleans, allStrings);
      }
      return buildStaticStory(example);
    });

    const output = [importsBlock, "", metaBlock, "", storyBlocks.join("\n\n"), ""].join("\n");

    const outputPath = path.join(dir, `${componentName}.stories.ts`);

    fs.writeFileSync(outputPath, output, "utf8");
    console.log(`✓ Generated ${outputPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

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

function parseTagAttrs(attrStr, componentName, allAttributesMap) {
  const booleans = [];
  const strings = {};

  const stringAttrRe = /([\w-]+)=["']([^"']*)["']/g;
  const remaining = attrStr.replace(stringAttrRe, (_, k, v) => {
    strings[k] = v;
    return "";
  });

  const componentAttrs = allAttributesMap[componentName] || [];
  const componentBooleans = componentAttrs
    .filter((a) => a.type && a.type.text === "boolean")
    .map((a) => a.name);

  const boolAttrRe = /\b([a-zA-Z][\w-]*)\b/g;
  let m;
  while ((m = boolAttrRe.exec(remaining)) !== null) {
    const attr = m[1];
    if (componentBooleans.includes(attr)) {
      booleans.push(attr);
    }
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

const SKIP_ATTRS = new Set(["id", "href", "target"]);

function collectAllAttrs(examples, allAttributesMap, primaryTagName, componentDir, tagToModule) {
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

  // Identify allowed child components based on directory
  const allowedTags = new Set([primaryTagName]);
  for (const [tag, modPath] of Object.entries(tagToModule)) {
    if (path.dirname(modPath) === componentDir) {
      allowedTags.add(tag);
    }
  }

  // 2. Add attributes found in examples (this handles children)
  // Include attributes from the primary component and its child components
  for (const { code } of examples) {
    for (const { tagName, attrStr } of extractTags(code)) {
      if (!allowedTags.has(tagName)) continue;

      const { booleans, strings } = parseTagAttrs(attrStr, tagName, allAttributesMap);
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

function buildBasicArgs(html, allAttributesMap) {
  const args = {};
  const tags = extractTags(html);

  const setArgsFromAttrs = (tagName, attrStr) => {
    const { booleans, strings } = parseTagAttrs(attrStr, tagName, allAttributesMap);
    booleans.filter((b) => !SKIP_ATTRS.has(b)).forEach((b) => (args[b] = true));
    
    const attrs = allAttributesMap[tagName] || [];
    Object.entries(strings)
      .filter(([k]) => !SKIP_ATTRS.has(k))
      .forEach(([k, v]) => {
        const attr = attrs.find(a => a.name === k);
        if (attr && attr.type && attr.type.text === "number") {
          args[k] = Number(v);
        } else {
          args[k] = v;
        }
      });
  };

  if (tags.length > 0) {
    setArgsFromAttrs(tags[0].tagName, tags[0].attrStr);
  }

  const childTag = tags.find((t) => t.tagName !== tags[0].tagName);
  if (childTag) {
    setArgsFromAttrs(childTag.tagName, childTag.attrStr);
  }

  return args;
}

function buildArgTypes(booleans, stringsMap) {
  const entries = [];
  entries.push(`id: { control: "text" },`);
  stringsMap.forEach((type, name) => {
    if (name === "id") return;

    const cleanType = type.replace(/\s+/g, " ").replace(/^\|\s*/, "").trim();
    const key = name.includes("-") ? `"${name}"` : name;
    if (cleanType.includes("|") && cleanType.includes("\"")) {
      const options = cleanType
        .split("|")
        .map((s) => s.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
      entries.push(`${key}: { control: "select", options: [${options.map(o => JSON.stringify(o)).join(", ")}] },`);
    } else if (cleanType === "number") {
      entries.push(`${key}: { control: "number" },`);
    } else {
      entries.push(`${key}: { control: "text" },`);
    }
  });
  booleans.forEach((b) => {
    const key = b.includes("-") ? `"${b}"` : b;
    entries.push(`${key}: { control: "boolean", default: false },`);
  });
  return entries.join("\n");
}

function buildInterfaceFields(booleans, stringsMap) {
  const lines = [];
  lines.push("id: string;");
  stringsMap.forEach((type, name) => {
    if (name !== "id") {
      const cleanType = type.replace(/\s+/g, " ").replace(/^\|\s*/, "").trim();
      const key = name.includes("-") ? `"${name}"` : name;
      lines.push(`${key}: ${cleanType};`);
    }
  });
  booleans.forEach((b) => {
    const key = b.includes("-") ? `"${b}"` : b;
    lines.push(`${key}: boolean;`);
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

function buildBasicStory(example, args, allBooleans, allStrings, allAttributesMap, storyName) {
  const html = example.renderCode;

  const rootTagRe = /^(<)([\w-]+)((?:\s[^>]*)?)(\/?>)/;
  const rootTagMatch = html.match(rootTagRe);
  if (!rootTagMatch) {
    return buildStaticStory(example, storyName);
  }

  const rootTagName = rootTagMatch[2];

  let rootReplacement;
  if (rootTagName === 'style') {
    rootReplacement = rootTagMatch[0];
  } else {
    const rootDynamicAttrs = [
      `.id=\${args.id}`,
      ...Array.from(allBooleans).map((b) => `?${b}=\${args['${b}']}`),
      ...Array.from(allStrings.keys()).map((k) => `.${k}=\${args['${k}']}`),
    ];
    rootReplacement =
      rootDynamicAttrs.length > 0
        ? `<${rootTagName}\n${rootDynamicAttrs.join("\n")}\n>`
        : `<${rootTagName}>`;
  }

  let remaining = html.slice(rootTagMatch[0].length);

  const childTagRe = /<([\w-]+-item|[\w-]+item)((?:\s[^>]*)?)(\/?>)/;
  const childTagMatch = remaining.match(childTagRe);

  let beforeChild = "";
  let childReplacement = "";
  let afterChild = remaining;

  if (childTagMatch) {
    const childTagName = childTagMatch[1];
    const childAttrStr = childTagMatch[2];
    const { booleans: cb, strings: cs } = parseTagAttrs(childAttrStr, childTagName, allAttributesMap);

    beforeChild = remaining.slice(0, childTagMatch.index);
    afterChild = remaining.slice(childTagMatch.index + childTagMatch[0].length);

    const childDynamicAttrs = [
      "        .id=${args.id}",
      ...cb.filter((b) => !SKIP_ATTRS.has(b)).map((b) => `.${b}=\${args['${b}']}`),
      ...Object.keys(cs)
        .filter((k) => !SKIP_ATTRS.has(k))
        .map((k) => `.${k}=\${args['${k}']}`),
    ];

    childReplacement = `<${childTagName}\n${childDynamicAttrs.join("\n")}\n>`;
  }

  const renderHtml = `${rootReplacement}${beforeChild}${childReplacement}${afterChild}`;

  const argsLines = Object.entries(args)
    .map(([k, v]) => {
      if (typeof v === "boolean") return `${k}: ${v},`;
      if (typeof v === "number") return `${k}: ${v},`;
      return `${k}: "${v}",`;
    })
    .join("\n");

  const argsBlock = argsLines ? `args: {\n${argsLines}\n  },` : `args: {},`;

  return `export const ${storyName}: Story = {
${argsBlock}
  render: (args) => {
    return html\`
      ${escapeCode(renderHtml.trim())}
    \`;
  },
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
  const code = example.renderCode;

  // Heuristic: check if it contains JS imperative code
  const isImperative = code.includes("const ") || code.includes("function ") || code.includes("=> ");

  let renderTemplate;
  if (isImperative) {
    // Split the example into logic and HTML
    const parts = code.split(/(?=const |function |let |var )/);
    const htmlPart = parts.find((p) => p.trim().startsWith("<")) || "";
    const jsPart = parts.filter((p) => !p.trim().startsWith("<")).join("\n");

    renderTemplate = `() => {
${indent(jsPart.trim(), 4)}
    return html\`${indent(htmlPart.trim(), 6)}\`;
  }`;
  } else if (isHtml(code)) {
    renderTemplate = `() => {
    return html\`
${indent(escapeCode(code), 6)}
    \`;
  }`;
  } else {
    renderTemplate = `() => {
    return html\`<pre style="white-space: pre-wrap; font-family: monospace; font-size: 0.85em; background: #f4f4f4; padding: 1em; border-radius: 4px;"><code>\${${JSON.stringify(
      code
    )}}</code></pre>\`;
  }`;
  }

  return `export const ${storyName}: Story = {
  render: ${renderTemplate},
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
  const componentFilter = process.argv[2];
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

  const tagToModule = {};
  for (const mod of cem.modules) {
    for (const decl of mod.declarations || []) {
      if (decl.tagName) {
        tagToModule[decl.tagName] = mod.path;
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

    if (componentFilter && componentName !== componentFilter) {
      continue;
    }

    const dir = path.dirname(mod.path);

    // Collect all examples from all declarations in the same module directory
    const allExamples = [];

    // Find all modules in the same directory
    const moduleEntries = Object.entries(modulesByPath);
    for (const [modPath, declarations] of moduleEntries) {
      if (path.dirname(modPath) === dir) {
        for (const decl of declarations) {
          if (decl.examples) {
            allExamples.push(
              ...decl.examples.map((ex) => ({ ...ex, tagName: decl.tagName || componentName }))
            );
          }
        }
      }
    }

    // Sort allExamples: parent components (e.g. groups) first, then alphabetical by tag
    allExamples.sort((a, b) => {
      const aTag = a.tagName;
      const bTag = b.tagName;
      const aIsGroup = aTag.endsWith("group");
      const bIsGroup = bTag.endsWith("group");

      if (aIsGroup && !bIsGroup) return -1;
      if (!aIsGroup && bIsGroup) return 1;

      return aTag.localeCompare(bTag);
    });

    // Format all examples
    for (const example of allExamples) {
      if (example.render) {
        example.renderCode = await formatCode(example.render);
        example.code = await formatCode(example.code);
      } else {
        const formatted = await formatCode(example.code);
        example.renderCode = formatted;
        example.code = formatted;
      }
    }

    if (allExamples.length === 0) {
      console.log(`No examples found for ${componentName}. Skipping.`);
      continue;
    }

    const { booleans: allBooleans, strings: allStrings } = collectAllAttrs(
      allExamples,
      allAttributesMap,
      componentName,
      dir,
      tagToModule
    );

    const title = inferTitle(componentName);
    const interfaceName =
      componentName
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join("") + "Args";

    const usedTags = new Set();
    allExamples.forEach(({ code, renderCode }) => {
      const tagRe = /<(nys-[\w-]+)/g;
      let m;
      while ((m = tagRe.exec(code)) !== null) {
        usedTags.add(m[1]);
      }
      if (renderCode) {
        tagRe.lastIndex = 0;
        while ((m = tagRe.exec(renderCode)) !== null) {
          usedTags.add(m[1]);
        }
      }
    });

    // Also scan source files for internal usage of common components
    const componentSourceFiles = fs.readdirSync(dir).filter(
      (f) => f.endsWith(".ts") && !f.endsWith(".stories.ts") && !f.endsWith(".test.ts")
    );
    for (const f of componentSourceFiles) {
      const content = fs.readFileSync(path.join(dir, f), "utf8");
      if (content.includes("<nys-label")) usedTags.add("nys-label");
      if (content.includes("<nys-errormessage")) usedTags.add("nys-errormessage");
      if (content.includes("<nys-textinput")) usedTags.add("nys-textinput");
    }

    const siblingImports = [...usedTags]
      .filter((t) => t !== componentName)
      .map((t) => {
        const modPath = tagToModule[t];
        if (modPath) {
          // If in the same directory, import locally
          if (path.dirname(modPath) === dir) {
            return `import "./${t}";`;
          }
          // Otherwise use the package path
          return `import "@nysds/${t}";`;
        }
        // Fallback if not found in CEM
        return `import "@nysds/${t}";`;
      })
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

    const usedNames = new Set();
    const storyBlocks = allExamples.map((example, i) => {
      if (i === 0) {
        const args = buildBasicArgs(example.code, allAttributesMap);
        let name = toStoryName(example.title || "Basic");
        if (usedNames.has(name)) {
          while (usedNames.has(name)) {
            name += "Alt";
          }
        }
        usedNames.add(name);
        return buildBasicStory(example, args, allBooleans, allStrings, allAttributesMap, name);
      }
      let name = toStoryName(example.title || "Story");
      while (usedNames.has(name)) {
        name += "Alt";
      }
      usedNames.add(name);
      return buildStaticStory(example, name);
    });

    const output = [importsBlock, "", metaBlock, "", storyBlocks.join("\n\n"), ""].join("\n");

    const outputPath = path.join(dir, `${componentName}.stories.ts`);

    const projectConfig = await prettier.resolveConfig(outputPath);
    const formattedOutput = await prettier.format(output, {
      ...projectConfig,
      parser: "typescript",
      filepath: outputPath,
    });

    fs.writeFileSync(outputPath, formattedOutput, "utf8");
    console.log(`✓ Generated ${outputPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

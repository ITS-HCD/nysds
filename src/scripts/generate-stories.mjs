#!/usr/bin/env node
import fs from "fs";
import path from "path";
import prettier from "prettier";

// ---------------------------------------------------------------------------
// Helpers (kept mostly the same, adapted for CEM structure)
// ---------------------------------------------------------------------------

// formatCode — add early return for script-containing HTML
async function formatCode(code) {
  if (!code) return "";
  try {
    if (code.includes("<") && code.includes(">")) {
      if (code.includes("</script>")) return code.trim(); // skip Prettier
      return (
        await prettier.format(code, {
          parser: "html",
          printWidth: 100,
          htmlWhitespaceSensitivity: "ignore",
        })
      ).trim();
    }
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
  return code.split("`").join("\\`");
}

// For static render templates and docs source blocks: also escape ${ so any
// stray interpolation in a JSDoc example renders literally instead of
// executing (and crashing on undefined identifiers like `args`).
function escapeStaticCode(code) {
  return code.split("`").join("\\`").split("${").join("\\${");
}

function isHtml(code) {
  return code.trim().startsWith("<");
}

/**
 * Extracts all registerIconLibrary(...) call blocks from a render code string.
 * Returns { scriptCalls: string[], strippedCode: string }
 * where scriptCalls are the raw JS call strings and strippedCode has the
 * <script>...</script> block removed.
 */
function extractRegisterIconLibraryCalls(code) {
  const scriptRe = /<script>([\s\S]*?)<\/script>/g;
  const scriptCalls = [];
  let strippedCode = code;

  let match;
  while ((match = scriptRe.exec(code)) !== null) {
    const scriptBody = match[1].trim();
    if (scriptBody.includes("registerIconLibrary(")) {
      scriptCalls.push(scriptBody);
      // Only remove <script> blocks that are registerIconLibrary calls — those
      // are hoisted to module scope. All other <script> blocks (e.g. property
      // assignments like header.languages = [...]) must stay in the render code
      // so they execute alongside the HTML they configure.
      strippedCode = strippedCode.replace(match[0], "").trim();
    }
  }

  return { scriptCalls, strippedCode };
}

/**
 * Builds a source.code string that prepends a JS registration snippet
 * (matching the manual file style) before the HTML, when applicable.
 */
function buildSourceCode(exampleCode, scriptCalls) {
  if (!scriptCalls || scriptCalls.length === 0) {
    return escapeStaticCode(exampleCode.trim());
  }

  // Strip any registerIconLibrary <script> blocks from the source example code
  // so they don't appear twice alongside the hoisted module-scope snippet.
  let cleanedCode = exampleCode;
  const scriptRe = /<script>([\s\S]*?)<\/script>/g;
  let match;
  while ((match = scriptRe.exec(exampleCode)) !== null) {
    if (match[1].includes("registerIconLibrary(")) {
      cleanedCode = cleanedCode.replace(match[0], "").trim();
    }
  }

  const jsSnippet = [
    "// Register the icon library before using <nys-icon>",
    `import { registerIconLibrary } from '@nysds/nys-icon';`,
    "",
    ...scriptCalls,
  ].join("\n");

  return escapeStaticCode([jsSnippet, "", cleanedCode.trim()].join("\n"));
}

// ---------------------------------------------------------------------------
// Interactive story helpers (args-driven, for the first/Basic example)
// ---------------------------------------------------------------------------

function parseOpenTagAttributes(attrString) {
  const attrs = {};
  const attrRe = /\s+([\w:-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>/]*)))?/g;
  let m;
  while ((m = attrRe.exec(attrString)) !== null) {
    const name = m[1];
    const value =
      m[2] !== undefined
        ? m[2]
        : m[3] !== undefined
          ? m[3]
          : m[4] !== undefined && m[4] !== ""
            ? m[4]
            : true;
    attrs[name] = value;
  }
  return attrs;
}

function parseCemDefault(defaultStr) {
  if (defaultStr === undefined || defaultStr === null) return undefined;
  if (defaultStr === "true") return true;
  if (defaultStr === "false") return false;
  if (defaultStr === "null") return null;
  const strMatch = defaultStr.match(/^"(.*)"$/s);
  if (strMatch) return strMatch[1];
  const num = Number(defaultStr);
  if (!isNaN(num) && defaultStr.trim() !== "") return num;
  return defaultStr;
}

function parseStringUnionOptions(typeText) {
  if (!typeText || !typeText.includes("|")) return null;
  const parts = typeText.split("|").map((s) => s.trim());
  const options = [];
  for (const part of parts) {
    const m = part.match(/^"(.*)"$/);
    if (!m) return null;
    options.push(m[1]);
  }
  return options.length > 0 ? options : null;
}

function isSimpleArgsType(typeText) {
  if (!typeText) return false;
  if (typeText === "boolean" || typeText === "string" || typeText === "number") return true;
  if (parseStringUnionOptions(typeText) !== null) return true;
  return false;
}

function buildArgsForProps(props, exampleAttrs, args, argTypes) {
  for (const prop of props) {
    const typeText = prop.type?.text ?? "string";
    const cemDefault = parseCemDefault(prop.default);
    const exampleAttrValue = exampleAttrs[prop.attribute];

    let argValue;
    if (exampleAttrValue !== undefined) {
      if (typeText === "boolean") {
        argValue = true;
      } else if (typeText === "number") {
        argValue = Number(exampleAttrValue) || 0;
      } else {
        argValue =
          typeof exampleAttrValue === "string" ? exampleAttrValue : (cemDefault ?? "");
      }
    } else {
      argValue =
        cemDefault !== null && cemDefault !== undefined
          ? cemDefault
          : typeText === "boolean"
            ? false
            : typeText === "number"
              ? 0
              : "";
    }

    args[prop.attribute] = argValue;

    const unionOptions = parseStringUnionOptions(typeText);
    if (unionOptions) {
      argTypes[prop.attribute] = { control: { type: "select" }, options: unionOptions };
    }
  }
}

function filterProps(decl, excludeAttrNames = new Set()) {
  return (decl.members || []).filter(
    (m) =>
      m.kind === "field" &&
      m.attribute &&
      m.attribute !== "id" &&
      !m.attribute.startsWith("_") &&
      !m.static &&
      m.privacy !== "private" &&
      m.privacy !== "protected" &&
      isSimpleArgsType(m.type?.text) &&
      !m.description?.startsWith("Internal:") &&
      !excludeAttrNames.has(m.attribute),
  );
}

function buildLitBinding(prop) {
  const typeText = prop.type?.text ?? "string";
  return typeText === "boolean"
    ? `?${prop.attribute}=\${args.${prop.attribute}}`
    : `${prop.attribute}=\${args.${prop.attribute}}`;
}

function buildInteractiveStory(example, nameOverride, tagToDeclaration, localTags) {
  const storyName = nameOverride || toStoryName(example.title);
  const rawRenderCode = example.renderCode;

  if (!rawRenderCode || !isHtml(rawRenderCode)) {
    return buildStaticStory(example, nameOverride);
  }

  // Regex with 'g' flag so we can loop to find the first *local* tag.
  const openTagReG =
    /<(nys-[\w-]+)((?:\s+[\w:-]+(?:=(?:"[^"]*"|'[^']*'|[^\s>]*))?)*)\s*\/?>/g;

  // --- Root tag: first nys-* whose .ts lives in this package dir ---
  let rootMatch = null;
  let tmp;
  openTagReG.lastIndex = 0;
  while ((tmp = openTagReG.exec(rawRenderCode)) !== null) {
    if (localTags.has(tmp[1])) { rootMatch = tmp; break; }
  }
  if (!rootMatch) return buildStaticStory(example, nameOverride);

  const rootTagName = rootMatch[1];
  const rootDecl = tagToDeclaration[rootTagName];
  if (!rootDecl) return buildStaticStory(example, nameOverride);

  const rootProps = filterProps(rootDecl);
  if (rootProps.length === 0) return buildStaticStory(example, nameOverride);

  const rootAttrNames = new Set(rootProps.map((p) => p.attribute));
  const rootExampleAttrs = parseOpenTagAttributes(rootMatch[2] || "");

  const args = {};
  const argTypes = {};
  buildArgsForProps(rootProps, rootExampleAttrs, args, argTypes);

  const newRootTag = `<${rootTagName}\n  ${rootProps.map(buildLitBinding).join("\n  ")}\n>`;

  // --- First child nys-* tag: must also be local, different from root ---
  const afterRootStr = rawRenderCode.slice(rootMatch.index + rootMatch[0].length);
  let childMatch = null;
  openTagReG.lastIndex = 0;
  while ((tmp = openTagReG.exec(afterRootStr)) !== null) {
    if (localTags.has(tmp[1]) && tmp[1] !== rootTagName) { childMatch = tmp; break; }
  }
  let childReplacement = null;

  if (childMatch) {
    const childTagName = childMatch[1];
    const childDecl = tagToDeclaration[childTagName];

    if (childDecl) {
      // Only props that don't overlap with root and aren't set-by-parent
      const childProps = filterProps(childDecl, rootAttrNames).filter(
        (m) => !/set by (parent|group)/i.test(m.description || ""),
      );

      if (childProps.length > 0) {
        const childExampleAttrs = parseOpenTagAttributes(childMatch[2] || "");
        buildArgsForProps(childProps, childExampleAttrs, args, argTypes);

        const childPropAttrs = new Set(childProps.map((p) => p.attribute));

        // Rebuild child tag attrs: keep id static, replace matching props with
        // bindings, pass through static attrs, then append unseen prop bindings.
        const attrParts = [];

        if ("id" in childExampleAttrs) {
          const v = childExampleAttrs["id"];
          attrParts.push(typeof v === "string" ? `id="${v}"` : "id");
        }

        for (const [attrName, attrValue] of Object.entries(childExampleAttrs)) {
          if (attrName === "id") continue;
          if (childPropAttrs.has(attrName)) {
            const prop = childProps.find((p) => p.attribute === attrName);
            attrParts.push(buildLitBinding(prop));
          } else {
            attrParts.push(attrValue === true ? attrName : `${attrName}="${attrValue}"`);
          }
        }

        // Add interactive bindings for child props not present in the example
        for (const prop of childProps) {
          if (!(prop.attribute in childExampleAttrs)) {
            attrParts.push(buildLitBinding(prop));
          }
        }

        const newChildTag = `<${childTagName}\n  ${attrParts.join("\n  ")}\n>`;
        const childAbsStart = rootMatch.index + rootMatch[0].length + childMatch.index;
        childReplacement = {
          start: childAbsStart,
          end: childAbsStart + childMatch[0].length,
          replacement: newChildTag,
        };
      }
    }
  }

  // Apply replacements back-to-front to keep indices valid
  const replacements = [
    { start: rootMatch.index, end: rootMatch.index + rootMatch[0].length, replacement: newRootTag },
    ...(childReplacement ? [childReplacement] : []),
  ].sort((a, b) => b.start - a.start);

  let reconstructedHtml = rawRenderCode;
  for (const { start, end, replacement } of replacements) {
    reconstructedHtml = reconstructedHtml.slice(0, start) + replacement + reconstructedHtml.slice(end);
  }

  const argsEntries = Object.entries(args)
    .map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`)
    .join(",\n");

  const argTypesLines = Object.entries(argTypes).map(([k, v]) => {
    const opts = v.options.map((o) => JSON.stringify(o)).join(", ");
    return `    ${k}: { control: { type: "select" }, options: [${opts}] }`;
  });
  const argTypesStr =
    argTypesLines.length > 0
      ? `\n  argTypes: {\n${argTypesLines.join(",\n")}\n  },`
      : "";

  const sourceCode = buildSourceCode(example.code, []);

  return `export const ${storyName}: Story = {
  args: {
${argsEntries}
  },${argTypesStr}
  render: (args) => {
    return html\`
${indent(escapeCode(reconstructedHtml), 6)}
    \`;
  },
  parameters: {
    docs: {
      source: {
        code: \`
${sourceCode}\`,
        type: "auto",
      },
    },
  },
};`;
}

function buildStaticStory(example, nameOverride) {
  const storyName = nameOverride || toStoryName(example.title);
  const rawRenderCode = example.renderCode;

  // Extract any registerIconLibrary calls from <script> blocks in the render code
  const { scriptCalls, strippedCode } = extractRegisterIconLibraryCalls(rawRenderCode);
  const code = strippedCode;

  // Heuristic: check if it contains JS imperative code
  const isImperative = !code.trim().startsWith("<") && (
    code.includes("const ") || code.includes("function ") || code.includes("=> ")
  );

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
${indent(escapeStaticCode(code), 6)}
    \`;
  }`;
  } else {
    renderTemplate = `() => {
    return html\`<pre style="white-space: pre-wrap; font-family: monospace; font-size: 0.85em; background: #f4f4f4; padding: 1em; border-radius: 4px;"><code>\${${JSON.stringify(
      code
    )}}</code></pre>\`;
  }`;
  }

  const sourceCode = buildSourceCode(example.code, scriptCalls);

  return `export const ${storyName}: Story = {
  render: ${renderTemplate},
  parameters: {
    docs: {
      source: {
        code: \`
${sourceCode}\`,
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

  const tagToModule = {};
  for (const mod of cem.modules) {
    for (const decl of mod.declarations || []) {
      if (decl.tagName) {
        tagToModule[decl.tagName] = mod.path;
      }
    }
  }

  const tagToDeclaration = {};
  for (const mod of cem.modules) {
    for (const decl of mod.declarations || []) {
      if (decl.tagName) {
        tagToDeclaration[decl.tagName] = decl;
      }
    }
  }

  // Map each tag to its owning package name (the directory two levels up from
  // the source file). Sub-components like nys-dropdownmenuitem live inside the
  // nys-dropdownmenu package, so this resolves to "nys-dropdownmenu" for both.
  const tagToPackage = {};
  for (const [tag, modPath] of Object.entries(tagToModule)) {
    const packageDir = path.dirname(path.dirname(modPath));
    tagToPackage[tag] = path.basename(packageDir);
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
    for (const [modPath, declarations] of Object.entries(modulesByPath)) {
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
      const aIsGroup = a.tagName.endsWith("group");
      const bIsGroup = b.tagName.endsWith("group");
      if (aIsGroup && !bIsGroup) return -1;
      if (!aIsGroup && bIsGroup) return 1;
      return a.tagName.localeCompare(b.tagName);
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

    const title = inferTitle(componentName);

    const usedTags = new Set();
    allExamples.forEach(({ renderCode }) => {
      if (!renderCode) return;
      const tagRe = /<(nys-[\w-]+)/g;
      let m;
      while ((m = tagRe.exec(renderCode)) !== null) usedTags.add(m[1]);
    });

    // Also scan source files for internal usage of common components
    const componentSourceFiles = fs
      .readdirSync(dir)
      .filter(
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
          if (path.dirname(modPath) === dir) {
            return `import "./${t}";`;
          }
          const pkg = tagToPackage[t] ?? t;
          return `import "@nysds/${pkg}";`;
        }
        return `import "@nysds/${t}";`;
      })
      .filter((imp, i, arr) => arr.indexOf(imp) === i)  // dedupe same-package tags
      .join("\n");

    // Detect if any render code uses registerIconLibrary — if so, hoist the
    // import and all unique registration calls to module scope. This is
    // necessary because registering inside render() is too late: the element's
    // connectedCallback fires before the render body executes on first visit.
    const moduleScopeRegistrations = [];
    let needsIconLibraryImport = false;

    for (const example of allExamples) {
      if (example.renderCode && example.renderCode.includes("registerIconLibrary(")) {
        needsIconLibraryImport = true;
        const { scriptCalls } = extractRegisterIconLibraryCalls(example.renderCode);
        for (const call of scriptCalls) {
          if (!moduleScopeRegistrations.includes(call)) {
            moduleScopeRegistrations.push(call);
          }
        }
      }
    }

    const iconLibraryImport = needsIconLibraryImport
      ? `import { registerIconLibrary } from "./icon-library-registry";`
      : "";

    const moduleScopeBlock =
      moduleScopeRegistrations.length > 0
        ? [
          "",
          "// Register external icon libraries at module scope so they are available",
          "// before any <nys-icon> elements connect. Registering inside render() is",
          "// too late on the first visit because the elements' connectedCallback and",
          "// _loadIcon fire before the render body executes, returning null from",
          "// getIconLibrary().",
          ...moduleScopeRegistrations,
        ].join("\n")
        : "";

    const importsBlock = [
      `import { html } from "lit";`,
      `import { Meta, StoryObj } from "@storybook/web-components-vite";`,
      `import "./${componentName}";`,
      siblingImports,
      iconLibraryImport,
    ]
      .filter(Boolean)
      .join("\n");

    const metaBlock = `const meta: Meta = {
  title: "${title}",
  component: "${componentName}",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj;`;

    // Tags whose .ts source file lives in this package dir — only these get
    // interactive args. External components used in demos (e.g. nys-unavheader
    // inside nys-backtotop) are kept as static HTML.
    const localTags = new Set(
      componentSourceFiles
        .map((f) => path.basename(f, ".ts"))
        .filter((name) => name.startsWith("nys-") && tagToDeclaration[name]),
    );

    const usedNames = new Set();
    const storyBlocks = allExamples.map((example, i) => {
      let name = toStoryName(example.title || (i === 0 ? "Basic" : "Story"));
      while (usedNames.has(name)) {
        name += "Alt";
      }
      usedNames.add(name);
      if (i === 0) {
        return buildInteractiveStory(example, name, tagToDeclaration, localTags);
      }
      return buildStaticStory(example, name);
    });

    const output = [
      importsBlock,
      moduleScopeBlock,
      "",
      metaBlock,
      "",
      storyBlocks.join("\n\n"),
      "",
    ].join("\n");

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

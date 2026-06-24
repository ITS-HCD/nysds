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
    allExamples.forEach(({ code, renderCode }) => {
      const tagRe = /<(nys-[\w-]+)/g;
      let m;
      while ((m = tagRe.exec(code)) !== null) usedTags.add(m[1]);
      if (renderCode) {
        tagRe.lastIndex = 0;
        while ((m = tagRe.exec(renderCode)) !== null) usedTags.add(m[1]);
      }
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

    const usedNames = new Set();
    const storyBlocks = allExamples.map((example, i) => {
      let name = toStoryName(example.title || (i === 0 ? "Basic" : "Story"));
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

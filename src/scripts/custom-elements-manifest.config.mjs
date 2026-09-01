import { customElementReactWrapperPlugin } from "custom-element-react-wrappers";
import { customElementVsCodePlugin } from "custom-element-vs-code-integration";
import { customElementJsxPlugin } from "custom-element-jsx-integration";
import { cemExamplesPlugin } from "cem-plugin-examples";

// Plugin to extract custom JSDoc tags (@accessibility, @usage, etc.) from source files
import fs from "fs";
import path from "path";

/**
 * Extracts `@render <Title>` JSDoc tags and attaches them as `render` onto the
 * matching `@example <Title>` entry produced by cem-plugin-examples.
 *
 * Parsing mirrors cem-plugin-examples: it reads the tag comment off the
 * TypeScript JSDoc AST (which already strips the leading `*` prefixes), takes
 * the first line as the title, and unwraps a fenced code block if present.
 */
const CAPTION_RE = /^<caption>(?<caption>.*)<\/caption>\s*(?<rest>.*)/ms;
const NEWLINE_RE = /^(?<caption>[^\n]+)\n(?<rest>.*)/ms;
const CODEBLOCK_RE = /^```(?<lang>\w*)\s*\n(?<code>[\s\S]*?)```\s*$/m;

function parseRenderTag(comment) {
  const RE = comment.startsWith("<caption>") ? CAPTION_RE : NEWLINE_RE;
  const match = comment.match(RE);
  if (!match?.groups) return null;

  const title = match.groups.caption.trim();
  const body = match.groups.rest.trim();

  const codeMatch = body.match(CODEBLOCK_RE);
  if (codeMatch?.groups) {
    return { title, code: codeMatch.groups.code.trim() };
  }
  return { title, code: body };
}

const renderTagsPlugin = () => {
  /** Map<modulePath, Map<declarationName, Array<{title, code}>>> */
  const collected = new Map();

  return {
    name: "nysds-render-tags",
    analyzePhase({ ts, node, moduleDoc }) {
      if (!ts.isClassDeclaration(node) || !("jsDoc" in node)) return;
      const className = node.name?.getText();
      if (!className) return;

      for (const jsdoc of node.jsDoc ?? []) {
        if (!Array.isArray(jsdoc.tags)) continue;
        for (const tag of jsdoc.tags) {
          let tagName;
          try {
            tagName = tag.tagName.getText();
          } catch {
            continue;
          }
          if (tagName !== "render") continue;
          if (typeof tag.comment !== "string") continue;

          const parsed = parseRenderTag(tag.comment);
          if (!parsed) continue;

          if (!collected.has(moduleDoc.path)) {
            collected.set(moduleDoc.path, new Map());
          }
          const byClass = collected.get(moduleDoc.path);
          if (!byClass.has(className)) byClass.set(className, []);
          byClass.get(className).push(parsed);
        }
      }
    },
    packageLinkPhase({ customElementsManifest }) {
      for (const mod of customElementsManifest.modules) {
        const byClass = collected.get(mod.path);
        if (!byClass || !mod.declarations) continue;

        for (const decl of mod.declarations) {
          const renderBlocks = byClass.get(decl.name);
          if (!renderBlocks) continue;

          for (const { title, code } of renderBlocks) {
            const example = decl.examples?.find((ex) => ex.title === title);
            if (example) {
              example.render = code;
            } else {
              console.warn(
                `[nysds-render-tags] ${mod.path}: @render "${title}" has no matching @example — skipped.`
              );
            }
          }
        }
      }
    },
  };
};

const customJsDocTagsPlugin = () => ({
  name: "nysds-jsdoc-tags",
  packageLinkPhase({ customElementsManifest }) {
    for (const mod of customElementsManifest.modules) {
      if (!mod.declarations) continue;

      const sourceFile = mod.path;
      if (!fs.existsSync(sourceFile)) continue;

      const content = fs.readFileSync(sourceFile, "utf-8");

      for (const decl of mod.declarations) {
        if (decl.kind !== "class") continue;

        const classNameRegex = new RegExp(
          `(\\/\\*\\*[\\s\\S]*?\\*\\/)?\\s*export\\s+class\\s+${decl.name}`,
          "m"
        );
        const match = content.match(classNameRegex);
        if (!match || !match[1]) continue;

        const docComment = match[1];

        const extractBullets = (raw) =>
          raw
            .split(/\n\s*\*\s*-\s*/)
            .map((s) => s.replace(/^\*?\s*-?\s*/, "").replace(/\n\s*\*\s*/g, " ").trim())
            .filter(Boolean);

        const usageMatch = docComment.match(
          /@usage\s+([\s\S]*?)(?=\n\s*\*?\s*@|\n\s*\*\/)/
        );
        if (usageMatch) {
          decl.usage = extractBullets(usageMatch[1]);
        }
      }
    }
  },
});

const reactOpts = {
  /** Output directory for the generated React wrappers — published separately as @nysds/react */
  outdir: "./packages/react",
  // ssrSafe: true, // Commented out but kept here in case we run into any issues with SSR
  /**
   * Path to the compiled bundle, relative to the output wrapper files.
   * packages/react/ is two levels below the root, so ../../dist/nysds.es.js
   * points at the built ES module. Using dist/ (not raw src/) means the import
   * path stays stable even if files inside src/ are moved around.
   */
  modulePath: () => "../../dist/nysds.es.js",
};

const vscodeOpts = {
  /** Output directory to write the VSCode autocompletes to- default is the root of the project */
  outdir: "./dist/.vscode",
};

// JSX output for React-like libraries like Preact
const jsxOpts = {
  /** Output directory to write the VSCode autocompletes to- default is the root of the project */
  outdir: "./packages/react",
  fileName: "nysds-jsx.d.ts",
};

export default {
  /** Globs to analyze */
  globs: ["**/packages/**/*.ts"],
  /** Globs to exclude */
  exclude: [
    "**/packages/**/*figma.ts",
    "**/packages/**/*stories.ts",
    "**/packages/**/*logo.ts",
    "**/packages/**/*library.ts",
    "**/packages/styles/**",
    "**/packages/internals/**",
    "**/packages/mcp-server/**",
    // Keep dependencies, generated framework output, and example apps out of
    // the manifest. A prior branch shipped a manifest polluted with
    // packages/angular/node_modules paths; these guards prevent a repeat.
    // packages/react/** also covers the generated nysds-jsx.d.ts, which used
    // to cause circular references when analyzed.
    "**/node_modules/**",
    "**/packages/react/**",
    "**/packages/angular/**",
    "**/packages/codegen/**",
    "**/examples/**",
  ],
  /** Directory to output CEM to */
  outdir: "./",
  /** Output CEM path to `package.json`, defaults to true */
  packagejson: true,
  /** Enable special handling for litelement */
  litelement: true,
  /** Provide custom plugins */
  plugins: [
    customJsDocTagsPlugin(),
    {
      name: "nysds-sorter",
      packageLinkPhase({ customElementsManifest }) {
        // Sort top-level modules
        customElementsManifest.modules.sort((a, b) =>
          a.path.localeCompare(b.path)
        );

        for (const mod of customElementsManifest.modules) {
          if (mod.declarations) {
            mod.declarations.sort((a, b) =>
              (a.name || "").localeCompare(b.name || "")
            );
          }

          if (mod.exports) {
            mod.exports.sort((a, b) =>
              (a.name || "").localeCompare(b.name || "")
            );
          }
        }
      }
    },
    cemExamplesPlugin(),
    renderTagsPlugin(),
    customElementVsCodePlugin(vscodeOpts),
    customElementReactWrapperPlugin(reactOpts),
    customElementJsxPlugin(jsxOpts),
  ],
  /**
   * Resolution options when using `dependencies: true`
   * For detailed information about each option, please refer to the [oxc-resolver documentation](https://github.com/oxc-project/oxc-resolver?tab=readme-ov-file#options).
   */
  resolutionOptions: {
    extensions: [".js", ".ts"],
    mainFields: ["module", "main"],
    conditionNames: ["import", "require"],
    // ... other oxc-resolver options
  },
};

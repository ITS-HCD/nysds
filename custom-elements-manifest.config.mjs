import { customElementReactWrapperPlugin } from "custom-element-react-wrappers";
import { customElementVsCodePlugin } from "custom-element-vs-code-integration";
import { customElementJsxPlugin } from "custom-element-jsx-integration";
import { cemExamplesPlugin } from "cem-plugin-examples";

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
    "**/packages/mcp-server/**",
    "**/packages/react/nysds-jsx.d.ts" // Exclude the generated JSX file to prevent it from being included in the CEM and causing circular references
  ],
  /** Directory to output CEM to */
  outdir: "./",
  /** Output CEM path to `package.json`, defaults to true */
  packagejson: true,
  /** Enable special handling for litelement */
  litelement: true,
  /** Provide custom plugins */
  plugins: [
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

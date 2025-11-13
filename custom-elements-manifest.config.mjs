import { customElementReactWrapperPlugin } from "custom-element-react-wrappers";
import { customElementVsCodePlugin } from "custom-element-vs-code-integration";

const reactOpts = {
  /** Output directory to write the React wrappers to - default is the root of the project */
  outdir: "dist/react-wrappers",
};

const vscodeOpts = {
  /** Output directory to write the React wrappers to - default is the root of the project */
  outdir: ".vscode",
};

export default {
  /** Globs to analyze */
  globs: ["**/packages/**/*.ts"],
  /** Globs to exclude */
  exclude: ["**/packages/**/*figma.ts", "**/packages/**/*stories.ts", "**/packages/**/*styles.ts", "**/packages/**/*logo.ts", "**/packages/**/*library.ts"],
  /** Directory to output CEM to */
  outdir: "dist",
  /** Run in dev mode, provides extra logging */
  dev: false,
  /** Run in watch mode, runs on file changes */
  watch: false,
  /** Include third party custom elements manifests */
  dependencies: false,
  /** Output CEM path to `package.json`, defaults to true */
  packagejson: true,
  /** Enable special handling for litelement */
  litelement: true,
  /** Enable special handling for catalyst */
  catalyst: false,
  /** Enable special handling for fast */
  fast: false,
  /** Enable special handling for stencil */
  stencil: false,
  /** Provide custom plugins */
  plugins: [
    customElementReactWrapperPlugin(reactOpts),
    customElementVsCodePlugin(vscodeOpts)
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

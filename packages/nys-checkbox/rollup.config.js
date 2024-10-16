import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import summary from "rollup-plugin-summary";
import postcss from "rollup-plugin-postcss";
import del from "rollup-plugin-delete";

// Banner to put at the top of the generated banner files
const banner = `
  /**
   * 
   * ░█▀▀▀ ▀▄░▄▀ ░█▀▀█ ░█▀▀▀ ░█─── ░█▀▀▀█ ▀█▀ ░█▀▀▀█ ░█▀▀█ 
   * ░█▀▀▀ ─░█── ░█─── ░█▀▀▀ ░█─── ─▀▀▀▄▄ ░█─ ░█──░█ ░█▄▄▀ 
   * ░█▄▄▄ ▄▀░▀▄ ░█▄▄█ ░█▄▄▄ ░█▄▄█ ░█▄▄▄█ ▄█▄ ░█▄▄▄█ ░█─░█
   * 
   * Checkbox Component v0.0.1
   * Part of New York State's Excelsior Design System (v0.0.1)
   * (c) ${new Date().getFullYear()} New York State Design System Team
   * A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/excelsior
   * License: MIT
   */
`;

export default {
  input: "src/index.ts", // Entry point for the individual component
  output: [
    {
      file: "dist/nys-checkbox.esm.js", // ESM build (for modern browsers)
      format: "es",
      sourcemap: true,
      banner,
    },
    {
      file: "dist/nys-checkbox.cjs.js", // CommonJS build (for Node.js)
      format: "cjs",
      sourcemap: true,
      banner,
    },
    {
      file: "dist/nys-checkbox.js", // Univeral Module Definition (UMD) build (for older browsers)
      format: "umd",
      name: "NysCheckbox",
      sourcemap: true,
      banner,
      globals: {
        lit: "Lit", // Map Lit to the global 'Lit' object for the legacy UMD build
      },
    },
  ],
  plugins: [
    del({ targets: "dist/*" }), // Clean the dist folder before building
    resolve(), // Resolve module paths for dependencies
    typescript({ tsconfig: "./tsconfig.json" }), // Use TypeScript plugin
    postcss({
      extract: true, // Extract CSS from the component
      minimize: true, // Minify the CSS
    }),
    summary(), // Output a summary of the bundle size
  ],
  external: ["lit"], // Treat 'lit' as an external dependency (since it's a shared dependency)
};

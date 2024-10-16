import { defineConfig } from "vite";
import path from "path";
import del from "rollup-plugin-delete";
import postcss from "rollup-plugin-postcss";

// Banner to put at the top of the generated files
const banner = `
  /**
   * 
   * ░█▀▀▀ ▀▄░▄▀ ░█▀▀█ ░█▀▀▀ ░█─── ░█▀▀▀█ ▀█▀ ░█▀▀▀█ ░█▀▀█ 
   * ░█▀▀▀ ─░█── ░█─── ░█▀▀▀ ░█─── ─▀▀▀▄▄ ░█─ ░█──░█ ░█▄▄▀ 
   * ░█▄▄▄ ▄▀░▀▄ ░█▄▄█ ░█▄▄▄ ░█▄▄█ ░█▄▄▄█ ▄█▄ ░█▄▄▄█ ░█─░█
   * 
   * Test Component v0.0.1
   * Part of New York State's Excelsior Design System (v0.0.1)
   * (c) ${new Date().getFullYear()} New York State Design System Team
   * A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/excelsior
   * License: MIT
   */
`;

export default defineConfig({
  build: {
    minify: "terser",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // Entry point for the component
      name: "NysTestComponent", // Name for UMD build
      formats: ["es", "cjs", "umd"], // Generate ESM, CJS, and UMD builds
      fileName: (format) => `nys-test-component.${format}.js`, // Output filenames
    },
    sourcemap: true, // Generate sourcemaps for all builds
    rollupOptions: {
      external: ["lit"], // Externalize 'lit' for ESM and CJS builds
      output: {
        globals: {
          lit: "Lit", // Map 'lit' to global 'Lit' in UMD builds
        },
        banner, // Add banner to all output files
      },
      plugins: [
        del({ targets: "dist/*" }), // Clean the dist folder before building
        postcss({
          extract: true, // Extract CSS from the component
          minimize: true, // Minify the CSS
        }),
      ],
    },
  },
});

import { defineConfig } from "vite";
import path from "path";
import del from "rollup-plugin-delete";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import { promises as fs } from "fs";

// This banner will go at the top of our generated files
const banner = `
/*!
   * 
   * ░█▀▀▀ ▀▄░▄▀ ░█▀▀█ ░█▀▀▀ ░█─── ░█▀▀▀█ ▀█▀ ░█▀▀▀█ ░█▀▀█ 
   * ░█▀▀▀ ─░█── ░█─── ░█▀▀▀ ░█─── ─▀▀▀▄▄ ░█─ ░█──░█ ░█▄▄▀ 
   * ░█▄▄▄ ▄▀░▀▄ ░█▄▄█ ░█▄▄▄ ░█▄▄█ ░█▄▄▄█ ▄█▄ ░█▄▄▄█ ░█─░█
   * 
   * New York State's Excelsior Design System (v0.0.1)
   * (c) ${new Date().getFullYear()} New York State Design System Team
   * Description: A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/excelsior
   * License: MIT
 */
`;

export default defineConfig(async () => {
  // Load the tsconfig.base.json file asynchronously, since Vite does not support custom JSON files yet
  const tsconfigBase = await fs.readFile(
    path.resolve(__dirname, "./tsconfig.base.json"),
    "utf-8",
  );

  return {
    build: {
      minify: "terser",
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"), // Entry point for the library
        name: "excelsior", // Global name for UMD builds
        formats: ["es", "cjs", "umd"], // Generate ESM, CJS, and UMD builds
        fileName: (format) => `excelsior.${format}.js`, // Output file naming convention
      },
      sourcemap: true, // Generate sourcemaps
      rollupOptions: {
        external: ["lit"], // Externalize lit for ESM and CJS builds
        output: {
          globals: {
            lit: "Lit", // Map 'lit' to the global 'Lit' in UMD builds
          },
          banner, // Add banner to all outputs
        },
        plugins: [
          del({ targets: "dist/*", runOnce: true }), // Clean up the `dist` folder before the build
          replace({
            "process.env.NODE_ENV": JSON.stringify("production"), // Replace environment variables
            preventAssignment: true,
          }),
          postcss({
            extract: true, // Extract CSS into separate files
            minimize: true, // Minify CSS for production
          }),
        ],
      },
    },
    esbuild: {
      tsconfigRaw: JSON.parse(tsconfigBase), // Use the loaded tsconfig.base.json
    },
    optimizeDeps: {
      include: ["lit"], // Explicitly include 'lit' for pre-bundling
    },
  };
});

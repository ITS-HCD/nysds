import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve"; // Ensure bundled dependencies
import path from "path";

// This banner will go at the top of our generated files
const banner = `

/*!
   * 
   * ░█▀▀▀ ▀▄░▄▀ ░█▀▀█ ░█▀▀▀ ░█─── ░█▀▀▀█ ▀█▀ ░█▀▀▀█ ░█▀▀█ 
   * ░█▀▀▀ ─░█── ░█─── ░█▀▀▀ ░█─── ─▀▀▀▄▄ ░█─ ░█──░█ ░█▄▄▀ 
   * ░█▄▄▄ ▄▀░▀▄ ░█▄▄█ ░█▄▄▄ ░█▄▄█ ░█▄▄▄█ ▄█▄ ░█▄▄▄█ ░█─░█
   * 
   * New York State's Excelsior Design System (v0.0.9-alpha)
   * Description: A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/excelsior
   * License: MIT
 */

`;

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Excelsior", // Global variable for UMD
      fileName: () => "excelsior.js", // Output as "excelsior.js" for UMD
      formats: ["umd"], // UMD format
    },
    sourcemap: true,
    emptyOutDir: false, // Since we're building both ESM and UMD
    rollupOptions: {
      external: [], // Bundle all dependencies including Lit
      plugins: [
        nodeResolve(), // Resolves and bundles Lit and other dependencies
      ],
      output: {
        banner,
        globals: {
          lit: "Lit", // Ensure compatibility with global Lit
        },
      },
    },
  },
});

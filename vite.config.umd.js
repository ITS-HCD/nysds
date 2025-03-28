import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve"; // Ensure bundled dependencies
import path from "path";

// This banner will go at the top of our generated files
const banner = `

/*!
   * New York State Design System (v1.1.1)
   * Description: A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
 */

`;

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "NYSDS", // Global variable for UMD
      fileName: () => "nysds.js", // Output as "nysds.js" for UMD
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

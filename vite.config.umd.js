import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import { minifyTemplateLiterals } from "rollup-plugin-minify-template-literals";
import { minify } from 'rollup-plugin-esbuild-minify';

const shouldAnalyze = process.env.ANALYZE === "true";

const banner = `
/*!
   * New York State Design System (v1.11.1)
   * Description: A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
 */
`;

export default defineConfig({
  build: {
    lib: {
      entry: ["./src/index.ts"],
      name: "NYSDS", // Global variable for UMD
      fileName: () => "nysds.js", // Output as "nysds.js" for UMD
      formats: ["umd"], // UMD format
    },
    sourcemap: true,
    emptyOutDir: false, // Since we're building both ESM and UMD
    rollupOptions: {
      external: [], // Bundle all dependencies including Lit
      output: {
        compact: true,
        banner,
        globals: {
          lit: "Lit", // Ensure compatibility with global Lit
        },
      },
      plugins: [
        minifyTemplateLiterals(),
        minify(),
        shouldAnalyze && visualizer({ filename: "dist/stats-umd.html", open: true }),
      ].filter(Boolean),
    },
  },
});

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

// Externalize Lit and all NYSDS internal packages
const external = (id) => id === "lit" || id.startsWith("lit/");

export default defineConfig({
  build: {
    lib: {
      entry: ["./src/index.ts"],
    },
    sourcemap: true,
    emptyOutDir: false, // Since we're building both ES and UMD formats
    rollupOptions: {
      external,
      output: [
        {
          compact: true,
          format: "es",
          banner,
          dir: "dist",
          entryFileNames: "nysds.es.js",
          globals: {
            lit: "Lit",
          },
        },
      ],
      plugins: [
        minifyTemplateLiterals(),
        minify(),
        shouldAnalyze &&
          visualizer({ filename: "dist/stats-es.html", open: true }),
      ].filter(Boolean),
    },
  },
});

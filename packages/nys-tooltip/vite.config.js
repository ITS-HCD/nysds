import { defineConfig } from "vite";
import { minifyTemplateLiterals } from "rollup-plugin-minify-template-literals";
import { minify } from "rollup-plugin-esbuild-minify";

// Banner to put at the top of the generated files
const banner = `
/*!
   * ▒█▄░▒█ ▒█░░▒█ ▒█▀▀▀█ ▒█▀▀▄ ▒█▀▀▀█ 
   * ▒█▒█▒█ ▒█▄▄▄█ ░▀▀▀▄▄ ▒█░▒█ ░▀▀▀▄▄ 
   * ▒█░░▀█ ░░▒█░░ ▒█▄▄▄█ ▒█▄▄▀ ▒█▄▄▄█
   * 
   * Tooltip Component
   * Part of the New York State Design System
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
*/
`;

export default defineConfig(({ mode }) => ({
  build: {
    lib: {
      entry: ["src/index.ts"], // Simplified entry point
      fileName: "nys-tooltip", // Output file name
      formats: ["es"], // ES build only
    },
    emptyOutDir: false,
    sourcemap: true, // Enable sourcemaps
    rollupOptions: {
      external: ["lit"], // Externalize Lit for ES build
      plugins: [
        minify(),
        minifyTemplateLiterals(),
      ],
      output: {
        compact: true,
        banner: mode === "production" ? banner : undefined, // Add banner only in production
        globals: {
          lit: "Lit",
        },
      },
    },
  },
}));

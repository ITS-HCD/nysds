import { defineConfig } from "vite";

// Banner to put at the top of the generated files
const banner = `
/*!
   * 
   * ▒█▄░▒█ ▒█░░▒█ ▒█▀▀▀█ ▒█▀▀▄ ▒█▀▀▀█ 
   * ▒█▒█▒█ ▒█▄▄▄█ ░▀▀▀▄▄ ▒█░▒█ ░▀▀▀▄▄ 
   * ▒█░░▀█ ░░▒█░░ ▒█▄▄▄█ ▒█▄▄▀ ▒█▄▄▄█
   * 
   * Universal Navigation Footer Component
   * Part of New York State's Design System
   * A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
*/
`;

export default defineConfig(({ mode }) => ({
  build: {
    lib: {
      entry: ["src/index.ts"], // Simplified entry point
      fileName: "nys-unavfooter", // Output file name
      formats: ["es"], // ES build only
    },
    emptyOutDir: false,
    sourcemap: true, // Enable sourcemaps
    rollupOptions: {
      external: ["lit"], // Externalize Lit for ES build
      output: {
        banner: mode === "production" ? banner : undefined, // Add banner only in production
        globals: {
          lit: "Lit",
        },
      },
    },
  },
}));

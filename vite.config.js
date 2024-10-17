import { defineConfig } from "vite";
import path from "path";
import del from "rollup-plugin-delete";

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

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // Entry point for your library
      name: "Excelsior", // Global name for UMD build
    },
    sourcemap: true, // Generate sourcemaps globally for all builds
    rollupOptions: {
      external: (id) => id === "lit" || id.startsWith("lit/"), // Externalize Lit
      output: [
        // ESM Build for bundlers and modern tools
        {
          format: "es",
          banner,
          dir: "dist",
          entryFileNames: "excelsior.es.js",
        },
        // UMD Build for browser usage (with global 'Lit' bundled)
        {
          format: "umd",
          banner,
          name: "Excelsior",
          dir: "dist",
          entryFileNames: "excelsior.js",
          globals: {
            lit: "Lit",
            "lit/decorators.js": "LitDecorators",
          },
        },
      ],
      plugins: [
        del({ targets: "dist/*", runOnce: true }), // Clean up the `dist` folder before building
      ],
    },
  },
});

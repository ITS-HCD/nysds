import { defineConfig } from "vite";
import path from "path";
import del from "rollup-plugin-delete";

// Banner to put at the top of the generated files
const banner = `
/*!
   * 
   * ░█▀▀▀ ▀▄░▄▀ ░█▀▀█ ░█▀▀▀ ░█─── ░█▀▀▀█ ▀█▀ ░█▀▀▀█ ░█▀▀█ 
   * ░█▀▀▀ ─░█── ░█─── ░█▀▀▀ ░█─── ─▀▀▀▄▄ ░█─ ░█──░█ ░█▄▄▀ 
   * ░█▄▄▄ ▄▀░▀▄ ░█▄▄█ ░█▄▄▄ ░█▄▄█ ░█▄▄▄█ ▄█▄ ░█▄▄▄█ ░█─░█
   * 
   * TextInput Component v0.0.1
   * Part of New York State's Excelsior Design System (v0.0.1)
   * (c) ${new Date().getFullYear()} New York State Design System Team
   * A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/excelsior
   * License: MIT
*/
`;

export default defineConfig(({ mode }) => ({
  build: {
    lib: {
      entry: ["src/index.ts"], // Simplified entry point
      fileName: "nys-textinput", // Output file name
      formats: ["es"], // ES build only
    },
    emptyOutDir: false,
    sourcemap: true, // Enable sourcemaps
    rollupOptions: {
      external: ["lit"], // Externalize Lit for ES build
      output: {
        banner: mode === "production" ? banner : undefined, // Add banner only in production
        {
          format: "es",
          banner,
        globals: {
          lit: "Lit",
        },
        // UMD Build for browser usage (with global 'Lit' bundled)
        {
          format: "umd",
          banner,
          name: "Textinput",
          dir: "dist",
          entryFileNames: "nys-textinput.js",
          globals: {
            lit: "Lit",
            "lit/decorators.js": "LitDecorators",
          },
        },
      },
      plugins: [
        del({ targets: "dist/*", runOnce: true }), // Clean the dist folder before building
      ],
    },
  },
}));

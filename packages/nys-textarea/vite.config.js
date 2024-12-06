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
   * TextArea Component v0.0.1
   * Part of New York State's Excelsior Design System (v0.0.1)
   * (c) ${new Date().getFullYear()} New York State Design System Team
   * A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/excelsior
   * License: MIT
*/
`;

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // Entry point for the component
      name: "Textarea", // Name for UMD build
    },
    sourcemap: true, // Enable sourcemaps
    rollupOptions: {
      external: (id) => id === "lit" || id.startsWith("lit/"), // Externalize Lit for ESM
      output: [
        // ESM Build for bundlers and modern tools
        {
          format: "es",
          banner,
          dir: "dist",
          entryFileNames: "nys-textarea.es.js",
        },
        // UMD Build for browser usage (with global 'Lit' bundled)
        {
          format: "umd",
          banner,
          name: "Textarea",
          dir: "dist",
          entryFileNames: "nys-textarea.js",
          globals: {
            lit: "Lit",
            "lit/decorators.js": "LitDecorators",
          },
        },
      ],
      plugins: [
        del({ targets: "dist/*", runOnce: true }), // Clean the dist folder before building
      ],
    },
  },
});

import { defineConfig } from "vite";

// This banner will go at the top of our generated files
const banner = `
/*!
   * 
   * ░█▀▀▀ ▀▄░▄▀ ░█▀▀█ ░█▀▀▀ ░█─── ░█▀▀▀█ ▀█▀ ░█▀▀▀█ ░█▀▀█ 
   * ░█▀▀▀ ─░█── ░█─── ░█▀▀▀ ░█─── ─▀▀▀▄▄ ░█─ ░█──░█ ░█▄▄▀ 
   * ░█▄▄▄ ▄▀░▀▄ ░█▄▄█ ░█▄▄▄ ░█▄▄█ ░█▄▄▄█ ▄█▄ ░█▄▄▄█ ░█─░█
   * 
   * New York State's Excelsior Design System (v1.0.0)
   * Description: A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/excelsior
   * License: MIT
 */
`;

export default defineConfig({
  build: {
    lib: {
      // Entry file for our library that exports all components
      entry: ["./src/index.ts"],
    },
    sourcemap: true,
    emptyOutDir: false, // Since we're building both ESM and UMD
    rollupOptions: {
      external: (id) => id === "lit" || id.startsWith("lit/"),
      output: [
        // ESM Build for bundlers and modern tools
        {
          format: "es",
          banner,
          dir: "dist",
          entryFileNames: "excelsior.es.js",
          globals: {
            lit: "Lit",
          },
        },
      ],
    },
  },
});

import { defineConfig } from "vite";

const banner = `
/*!
   * New York State Design System (v1.1.1)
   * Description: A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
 */
`;

// Externalize Lit and all NYSDS internal packages
const external = (id) =>
  id === "lit" || 
  id.startsWith("lit/") || 
  id.startsWith("@nysds/");

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
          format: "es",
          banner,
          dir: "dist",
          entryFileNames: "nysds.es.js",
          globals: {
            lit: "Lit",
          },
        },
      ],
    },
  },
});

import { defineConfig } from "vite";

// Banner to put at the top of the generated files
const banner = `
/*!
   * 
   * ▒█▄░▒█ ▒█░░▒█ ▒█▀▀▀█ ▒█▀▀▄ ▒█▀▀▀█ 
   * ▒█▒█▒█ ▒█▄▄▄█ ░▀▀▀▄▄ ▒█░▒█ ░▀▀▀▄▄ 
   * ▒█░░▀█ ░░▒█░░ ▒█▄▄▄█ ▒█▄▄▀ ▒█▄▄▄█
   * 
<<<<<<< HEAD
   * Universal Footer Component v1.0.0
   * Part of New York State's Excelsior Design System
   * (c) ${new Date().getFullYear()} New York State Design System Team
=======
   * Univeral Navigation Footer Component v1.0.0
   * Part of New York State's Design System
>>>>>>> 21a8638c2b8a2648a086acf254a08745311902f6
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

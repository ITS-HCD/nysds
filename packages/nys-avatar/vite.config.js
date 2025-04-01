import { defineConfig } from "vite";

// Banner to put at the top of the generated files
const banner = `
/*!
   * ▒█▄░▒█ ▒█░░▒█ ▒█▀▀▀█ ▒█▀▀▄ ▒█▀▀▀█ 
   * ▒█▒█▒█ ▒█▄▄▄█ ░▀▀▀▄▄ ▒█░▒█ ░▀▀▀▄▄ 
   * ▒█░░▀█ ░░▒█░░ ▒█▄▄▄█ ▒█▄▄▀ ▒█▄▄▄█
   * 
   * Avatar Component v1.1.1
   * Part of the New York State Design System
   * A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
*/
`;

export default defineConfig(({ mode }) => ({
  build: {
    lib: {
      entry: ["src/index.ts"], // Simplified entry point
      fileName: "nys-avatar", // Output file name
      formats: ["es"], // ES build only
    },
    emptyOutDir: false,
    sourcemap: true, // Enable sourcemaps
    rollupOptions: {
      // External deps declared manually (should match peerDependencies)
      external: ["lit", "@nysds/nys-icon"],
      output: {
        banner: mode === "production" ? banner : undefined, // Add banner only in production
        globals: {
          lit: "Lit",
        },
      },
    },
  },
}));

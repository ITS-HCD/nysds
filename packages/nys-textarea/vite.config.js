import { defineConfig } from "vite";

// Banner to put at the top of the generated files
const banner = `
/*!
   * ▒█▄░▒█ ▒█░░▒█ ▒█▀▀▀█ ▒█▀▀▄ ▒█▀▀▀█ 
   * ▒█▒█▒█ ▒█▄▄▄█ ░▀▀▀▄▄ ▒█░▒█ ░▀▀▀▄▄ 
   * ▒█░░▀█ ░░▒█░░ ▒█▄▄▄█ ▒█▄▄▀ ▒█▄▄▄█
   * 
   * TextArea Component
   * Part of the New York State Design System
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
*/
`;

export default defineConfig(({ mode }) => ({
  build: {
    lib: {
      entry: ["src/index.ts"], // Simplified entry point
      fileName: "nys-textarea", // Output file name
      formats: ["es"], // ES build only
    },
    emptyOutDir: false,
    sourcemap: true, // Enable sourcemaps
    rollupOptions: {
      external: [
        "lit",
        "@nysds/nys-icon",
        "@nysds/nys-label",
        "@nysds/nys-errormessage",
      ],
      output: {
        banner: mode === "production" ? banner : undefined, // Add banner only in production
        globals: {
          lit: "Lit",
        },
      },
    },
  },
}));

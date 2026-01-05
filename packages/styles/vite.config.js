import { defineConfig } from "vite";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // Allow @import from node_modules
        includePaths: ["node_modules"],
      },
    },
  },
  build: {
    cssCodeSplit: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        // NYSDS Bundles: Using @import to create style bundles
        nysds: "./src/nysds.scss", // Main core styles (includes tokens with all theme modes)
        // Note: nysds-full requires USWDS to be built first
        // "nysds-full": "./src/nysds-full.scss", // Core + utilities
        // Typography
        "nysds-typography": "./src/core/typography.scss",
      },
      output: {
        assetFileNames: "[name].min.css",
        dir: "dist",
      },
    },
  },
});

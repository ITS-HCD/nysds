import { defineConfig } from "vite";

export default defineConfig({
  build: {
    cssCodeSplit: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        // NYSDS Bundles: Using @import to create style bundles
        nysds: "./src/nysds.css", // Main core styles
        "nysds-full": "./src/nysds-full.css", // Core + utilities
        // Themes
        "nysds-theme-admin": "./src/themes/admin.css",
        "nysds-theme-business": "./src/themes/business.css",
        "nysds-theme-environment": "./src/themes/environment.css",
        "nysds-theme-health": "./src/themes/health.css",
        "nysds-theme-local": "./src/themes/local.css",
        "nysds-theme-safety": "./src/themes/safety.css",
        "nysds-theme-transportation": "./src/themes/transportation.css",
        // Typography
        "nysds-typography": "./src/core/typography.css",
      },
      output: {
        assetFileNames: "[name].min.css",
        dir: "dist",
      },
    },
  },
});

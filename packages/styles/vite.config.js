import { defineConfig } from "vite";

export default defineConfig({
  build: {
    cssCodeSplit: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        // NYSDS Bundles: Using @import to create style bundles
        nysds: "./src/nysds.scss", // Main core styles
        "nysds-full": "./src/nysds-full.scss", // Core + utilities
        // Themes
        "nysds-theme-admin": "./src/themes/admin.scss",
        "nysds-theme-business": "./src/themes/business.scss",
        "nysds-theme-environment": "./src/themes/environment.scss",
        "nysds-theme-health": "./src/themes/health.scss",
        "nysds-theme-local": "./src/themes/local.scss",
        "nysds-theme-safety": "./src/themes/safety.scss",
        "nysds-theme-transportation": "./src/themes/transportation.scss",
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

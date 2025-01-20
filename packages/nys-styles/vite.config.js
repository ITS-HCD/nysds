import { defineConfig } from "vite";

export default defineConfig({
  build: {
    cssCodeSplit: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        excelsior: "./src/excelsior.css", // Main core styles
        "excelsior-full": "./src/excelsior-full.css", // Core + utilities
        "excelsior-theme-admin": "./src/themes/admin.css",
        "excelsior-theme-business": "./src/themes/business.css",
        "excelsior-theme-environment": "./src/themes/environment.css",
        "excelsior-theme-health": "./src/themes/health.css",
        "excelsior-theme-local": "./src/themes/local.css",
        "excelsior-theme-safety": "./src/themes/safety.css",
        "excelsior-theme-transportation": "./src/themes/transportation.css",
      },
      output: {
        assetFileNames: "[name].min.css",
        dir: "dist",
      },
    },
  },
});

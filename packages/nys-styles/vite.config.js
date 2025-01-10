import { defineConfig } from "vite";

export default defineConfig({
  build: {
    cssCodeSplit: true, // Split up CSS files
    rollupOptions: {
      input: {
        excelsior: "./src/excelsior.css",
        "excelsior-theme-admin": "./src/theme-admin.css",
        "excelsior-theme-business": "./src/theme-business.css",
        "excelsior-theme-environment": "./src/theme-environment.css",
        "excelsior-theme-health": "./src/theme-health.css",
        "excelsior-theme-local": "./src/theme-local.css",
        "excelsior-theme-safety": "./src/theme-safety.css",
        "excelsior-theme-transportation": "./src/theme-transportation.css",
        "excelsior-utility": "./src/utility.css",
        "excelsior-utility-grid": "./src/utility-layout-grid.css",
      },
      output: {
        assetFileNames: "[name].min.css",
        dir: "dist", // Output folder
      },
    },
    sourcemap: true, // Optional, add source maps if needed
  },
});

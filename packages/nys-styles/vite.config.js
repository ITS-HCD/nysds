import { defineConfig } from "vite";

export default defineConfig({
  build: {
    cssCodeSplit: true, // Split up CSS files
    rollupOptions: {
      input: {
        excelsior: "./src/excelsior.css",
        "theme-admin": "./src/theme-admin.css",
        "theme-business": "./src/theme-business.css",
        "theme-environment": "./src/theme-environment.css",
        "theme-health": "./src/theme-health.css",
        "theme-local": "./src/theme-local.css",
        "theme-safety": "./src/theme-safety.css",
        "theme-transportation": "./src/theme-transportation.css",
      },
      output: {
        assetFileNames: "[name].min.css",
        dir: "dist", // Output folder
      },
    },
    sourcemap: true, // Optional, add source maps if needed
  },
});

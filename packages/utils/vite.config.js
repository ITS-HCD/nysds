import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts", // Entry point for utilities
      fileName: "utils",
      formats: ["es"], // Only ES module format
    },
    emptyOutDir: false,
    rollupOptions: {
      external: [], // No external dependencies
    },
  },
});

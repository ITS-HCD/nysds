import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // One React copy, whatever the monorepo hoists elsewhere. Matters
    // when CI pins React 18 in this workspace while a sibling package
    // brings React 19.
    dedupe: ["react", "react-dom"],
  },
});

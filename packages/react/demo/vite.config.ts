import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The demo consumes the LOCAL builds: `@nysds/react` resolves through the npm
// workspace symlink to packages/react (the generated wrappers), and each
// wrapper's `import "@nysds/nys-*"` resolves the same way to that component
// package's dist/ output. Build the packages first: `npm run build:packages`.
export default defineConfig({
  plugins: [react()],
});

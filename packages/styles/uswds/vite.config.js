import { defineConfig } from "vite";
import path from "path";

// Vite build config specifically for compiling the project's Sass
// - entry: `src/stylesheets/uswds.scss`
// - ensures `./packages` is available to the Sass compiler via includePaths
// - outputs compiled CSS under `dist/css` with sourcemaps (non-minified)
export default defineConfig({
  root: __dirname,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/stylesheets/uswds.scss"),
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "css/[name][extname]";
          }
          return "assets/[name][extname]";
        },
      },
    },
    // produce expanded CSS here; users can run a second build or a postcss step to minify
    minify: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        loadPaths: ["./packages"],
      },
    },
  },
});

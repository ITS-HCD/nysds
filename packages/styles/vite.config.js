import { defineConfig } from "vite";

const bannerText = `/*!
   * New York State Design System (v1.14.0)
   * Description: A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
 */`;

function cssBannerPlugin(banner) {
  return {
    name: "css-banner",
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === "asset" && file.fileName.endsWith(".css")) {
          file.source = banner + "\n" + file.source;
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [cssBannerPlugin(bannerText)],
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
    emptyOutDir: false, // Since we're building both ESM and UMD
    rollupOptions: {
      input: {
        // NYSDS Bundles: Using @import to create style bundles
        nysds: "./src/nysds.scss", // Main core styles (includes tokens with all theme modes)
        "nysds-full": "./src/nysds-full.scss", // Core + utilities
        "nysds-typography": "./src/core/typography.scss",
      },
      output: {
        assetFileNames: "[name].min.css",
        dir: "dist",
      },
    },
  },
});

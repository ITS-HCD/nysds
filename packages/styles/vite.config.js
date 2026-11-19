import { defineConfig } from "vite";
import { version } from "./package.json";

const bannerText = `/*!
   * New York State Design System v${version}
   * Description: A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
 */`;

 // Sass or the minifier can put @charset at the top of the CSS.
// It is only valid as the first thing in a file, so remove it before adding the banner.
const CHARSET_RULE = /^@charset\s*["'][^"']*["'];?\s*/i;

function cssBannerPlugin(banner) {
  return {
    name: "css-banner",
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === "asset" && file.fileName.endsWith(".css")) {
          const css = String(file.source).replace(CHARSET_RULE, "");
          file.source = banner + "\n" + css;
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

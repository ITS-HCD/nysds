import { mergeConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import fs from "fs";
import path from "path";
// import { minifyTemplateLiterals } from "rollup-plugin-minify-template-literals";
// import { minify } from 'rollup-plugin-esbuild-minify';

const shouldAnalyze = process.env.ANALYZE === "true";

const banner = `
/*!
   * New York State Design System (v1.13.0)
   * Description: A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
 */
`;

const overrideConfig = {};

// Externalize Lit and all NYSDS internal packages
const external = (id) => id === "lit" || id.startsWith("lit/");

// Plugin to remove demo HTML files after build
function removeDemoFiles() {
  return {
    name: "remove-demo-files",
    closeBundle() {
      const demoFolder = path.resolve("dist/nys-stepper");

      if (fs.existsSync(demoFolder)) {
        fs.rmSync(demoFolder, { recursive: true, force: true });
        console.log(`✓ Removed demo directory: dist/nys-stepper/`);
      }
    },
  };
}

export const defaultConfig = {
  css: {
    postcss: null,
    preprocessorOptions: {
      scss: {
        additionalData:
        `@use "../../../src/scss/global-variables.scss" as *;
         @use "../../../src/scss/mixins.scss" as *;
        `,
      },
    },
  },
  build: {
    lib: {
      entry: ["./src/index.ts"],
      fileName: () => "nysds.es.js",
    },
    sourcemap: true,
    emptyOutDir: false, // Since we're building both ES and UMD formats
    rollupOptions: {
      external,
      output: [
        {
          compact: true,
          format: "es",
          banner,
          dir: "dist",
          globals: {
            lit: "Lit",
          },
        },
      ],
      plugins: [
        // minify(),
        // minifyTemplateLiterals(),
        shouldAnalyze &&
          visualizer({ filename: "dist/stats-es.html", open: true }),
        removeDemoFiles(), // Add the cleanup plugin
      ].filter(Boolean),
    },
  },
};

export default mergeConfig(defaultConfig, overrideConfig);

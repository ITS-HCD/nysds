import { mergeConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import fs from "fs";
import path from "path";
// import { minifyTemplateLiterals } from "rollup-plugin-minify-template-literals";
// import { minify } from 'rollup-plugin-esbuild-minify';

const shouldAnalyze = process.env.ANALYZE === "true";

const banner = `
/*!
   * New York State Design System (v1.14.0)
   * Description: A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
 */
`;

const overrideConfig = {};

// Externalize Lit and all NYSDS internal packages
const external = (id) => id === "lit" || id.startsWith("lit/");

// Plugin to copy nys-icon SVG files into dist/icons/
function copyNysIcons() {
  return {
    name: "copy-nys-icons",
    closeBundle() {
      const srcDir = path.resolve("packages/nys-icon/src/icons");
      const destDir = path.resolve("dist/icons");
      if (!fs.existsSync(srcDir)) return;
      fs.mkdirSync(destDir, { recursive: true });
      let count = 0;
      for (const file of fs.readdirSync(srcDir)) {
        if (file.endsWith(".svg")) {
          fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
          count++;
        }
      }
      console.log(`✓ Copied ${count} icon SVGs to dist/icons/`);
    },
  };
}

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
  },
  esbuild: {
    legalComments: 'inline',
  },
  build: {
    lib: {
      entry: ["./src/index.ts"],
      fileName: () => "nysds.es.js",
      formats: ["es"],
    },
    minify: 'esbuild',
    sourcemap: true,
    emptyOutDir: false, // Since we're building both ES and UMD formats
    rollupOptions: {
      external,
      output: {
        compact: true,
        banner,
        dir: "dist",
        globals: {
          lit: "Lit",
        },
      },
      plugins: [
        shouldAnalyze &&
          visualizer({ filename: "dist/stats-es.html", open: true }),
        removeDemoFiles(), // Add the cleanup plugin
        copyNysIcons(), // Copy icon SVGs alongside the bundle
      ].filter(Boolean),
    },
  },
};

export default mergeConfig(defaultConfig, overrideConfig);

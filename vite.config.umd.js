import { defineConfig } from "vite";
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

export default defineConfig({
  css: {
    postcss: null,
  },
  esbuild: {
    legalComments: 'inline',
  },
  build: {
    lib: {
      entry: ["./src/index.ts"],
      name: "NYSDS", // Global variable for UMD
      fileName: () => "nysds.js", // Output as "nysds.js" for UMD
      formats: ["umd"], // UMD format
    },
    minify: 'esbuild',
    sourcemap: true,
    emptyOutDir: false, // Since we're building both ESM and UMD
    rollupOptions: {
      external: [], // Bundle all dependencies including Lit
      output: {
        compact: true,
        banner,
        globals: {
          lit: "Lit", // Ensure compatibility with global Lit
        },
      },
      plugins: [
        shouldAnalyze &&
          visualizer({ filename: "dist/stats-umd.html", open: true }),
        removeDemoFiles(), // Add the cleanup plugin
        copyNysIcons(), // Copy icon SVGs alongside the bundle
      ].filter(Boolean),
    },
  },
});

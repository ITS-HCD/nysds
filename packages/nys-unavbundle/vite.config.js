import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  prependBanner,
  sourceAliases,
  stripIconLibrary,
} from "./scripts/vite-plugins.js";
import { version } from "./package.json";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../..");

const banner = `/*!
 * NYS Universal Navigation bundle v${version}
 * Drop-in <nys-unavheader> and <nys-unavfooter>. Dependencies and design
 * tokens are inlined; no other NYSDS assets are required.
 * Repository: https://github.com/its-hcd/nysds
 * License: MIT
 */`;

export default defineConfig({
  css: {
    postcss: null,
  },
  esbuild: {
    // A distributed bundle should carry the @license notices of everything
    // inlined into it.
    legalComments: "inline",
  },
  resolve: {
    alias: sourceAliases(repoRoot),
  },
  plugins: [stripIconLibrary(repoRoot), prependBanner(banner)],
  build: {
    lib: {
      entry: resolve(here, "src/index.ts"),
      // Global for <script src> consumers; the elements register themselves, so
      // the global is only useful for the exported classes and injectTokens().
      name: "NYSUnav",
      formats: ["iife"],
      fileName: () => "nys-unavbundle.js",
    },
    minify: "esbuild",
    sourcemap: true,
    cssCodeSplit: false,
    emptyOutDir: false,
    rollupOptions: {
      // A drop-in has nothing to resolve against: bundle Lit, dompurify, and
      // every @nysds package rather than externalizing them.
      external: [],
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});

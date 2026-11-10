import { defineConfig } from "vite";

/**
 * Library build for @nysds/react.
 *
 * - One output module per source module (`preserveModules`), so each
 *   generated wrapper is its own chunk behind a package.json subpath.
 * - Every bare specifier (react, @lit/react, @nysds/nys-*, lit) is
 *   external: this package ships no vendored code.
 * - Rollup strips module-level directives when bundling, so the
 *   `"use client"` banner is re-applied to every emitted chunk. The
 *   matching MODULE_LEVEL_DIRECTIVE warnings are silenced.
 * - Declarations come from `tsc --emitDeclarationOnly` (see the build
 *   script); `emptyOutDir: false` keeps them.
 */
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    emptyOutDir: false,
    rollupOptions: {
      external: (id) => !id.startsWith(".") && !id.startsWith("/"),
      output: {
        preserveModules: true,
        // Name each chunk from its path under src/ instead of the [name]
        // placeholder: preserveModulesRoot mis-resolves when the repo
        // path contains characters rollup sanitizes (a worktree with
        // "+" in its path, for example).
        entryFileNames: (chunkInfo) => {
          const id = (chunkInfo.facadeModuleId ?? "").replace(/\\/g, "/");
          const marker = id.lastIndexOf("/src/");
          const stem =
            marker === -1 ? chunkInfo.name : id.slice(marker + "/src/".length);
          return stem.replace(/\.tsx?$/, "") + ".js";
        },
        banner: '"use client";',
      },
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        if (warning.message.includes("sourcemap for reporting an error")) return;
        warn(warning);
      },
    },
  },
});

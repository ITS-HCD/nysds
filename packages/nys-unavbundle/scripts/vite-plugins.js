/**
 * Vite plugins backing the drop-in bundle.
 *
 * `sourceAliases()` points `@nysds/*` at TypeScript source rather than each
 * package's `dist/`. That is what lets `stripIconLibrary()` intercept the icon
 * map — by the time a package is built, the dynamic `import()` in
 * icon-library-registry has already been resolved into a chunk.
 */

import { resolve } from "node:path";
import { readIconLibrary, resolveUsedIcons } from "./icon-allowlist.js";

/**
 * Resolve `@nysds/internals` and `@nysds/nys-*` to source, so the whole
 * component graph compiles into one file instead of being externalized the way
 * the per-component builds do it.
 */
export function sourceAliases(repoRoot) {
  return [
    {
      find: /^@nysds\/internals$/,
      replacement: resolve(repoRoot, "packages/internals/src/index.ts"),
    },
    {
      find: /^@nysds\/(nys-[a-z]+)$/,
      replacement: resolve(repoRoot, "packages/$1/src/index.ts"),
    },
  ];
}

/**
 * Replace `nys-icon.library.ts` with a map holding only the icons the universal
 * nav can reach. Everything downstream is unchanged: the registry still sees a
 * `Record<string, string>` default export, and a name that isn't in it resolves
 * to `undefined` exactly as an unknown name always has.
 */
export function stripIconLibrary(repoRoot) {
  let summary = "";

  return {
    name: "nys-unavbundle-strip-icons",
    enforce: "pre",

    load(id) {
      if (!id.endsWith("nys-icon.library.ts")) return null;

      const library = readIconLibrary(repoRoot);
      const used = resolveUsedIcons(repoRoot, library);

      const pruned = {};
      for (const name of used) pruned[name] = library[name];

      summary = `${used.length}/${Object.keys(library).length} icons kept`;

      // JSON rather than template literals: the SVG sources are data, and this
      // way nothing in them can be read as an expression.
      return `const iconLibrary = ${JSON.stringify(pruned)};\nexport default iconLibrary;\n`;
    },

    closeBundle() {
      if (summary) console.log(`✓ nys-unavbundle: ${summary}`);
    },
  };
}

/**
 * Put the bundle's own banner at the very top of the file.
 *
 * Rollup's `output.banner` is prepended before Vite's esbuild minify pass, which
 * re-emits the chunk and relocates the comment inside the IIFE wrapper. Running
 * after minification instead keeps it at byte 0, where someone opening the CDN
 * file will actually see it.
 *
 * The sourcemap is shifted to match. By this point Vite has already emitted the
 * map as its own bundle *asset*, so the edit has to go through `source` on that
 * asset — mutating `chunk.map` here is silently discarded. One `;` in a VLQ
 * `mappings` string is one generated line, so prefixing as many semicolons as
 * the banner has lines moves every existing mapping down by exactly that much.
 */
export function prependBanner(banner) {
  return {
    name: "nys-unavbundle-banner",

    generateBundle(_options, bundle) {
      const lines = banner.split("\n").length;

      for (const file of Object.values(bundle)) {
        if (file.type === "chunk") {
          file.code = `${banner}\n${file.code}`;
          continue;
        }

        if (file.fileName.endsWith(".map")) {
          const map = JSON.parse(file.source);
          map.mappings = ";".repeat(lines) + map.mappings;
          file.source = JSON.stringify(map);
        }
      }
    },
  };
}

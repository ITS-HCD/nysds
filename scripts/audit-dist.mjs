/**
 * Dist-output audit: fails if any shipped bundle contains a `new URL(...)`
 * shape that Webpack-family bundlers statically rewrite into a build-time
 * asset reference. That rewrite breaks consumer builds with
 * `Module not found: Can't resolve './icons/'` (issue #1677, symptom B).
 *
 * The source avoids these shapes (see icon-library-registry.ts), but a
 * minifier can fold variables back into the fragile pattern — so the audit
 * runs against the built output, not the source.
 *
 * Run after building: node scripts/audit-dist.mjs
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve, dirname, relative, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function jsFilesIn(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".js"))
    .map((f) => join(dir, f));
}

const bundles = [
  ...jsFilesIn(join(root, "dist")),
  ...readdirSync(join(root, "packages"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => jsFilesIn(join(root, "packages", d.name, "dist"))),
];

const patterns = [
  {
    name: 'icons literal inside new URL(): new URL("./icons/", …)',
    regex: /new URL\(\s*["']\.?\/?icons\//g,
  },
  {
    name: "webpack asset pattern: new URL(<literal>, import.meta.url)",
    regex: /new URL\(\s*["'][^"']*["']\s*,\s*import\.meta\.url\s*\)/g,
  },
];

let failures = 0;

for (const bundle of bundles) {
  const path = resolve(root, bundle);
  if (!existsSync(path)) continue;
  const text = readFileSync(path, "utf8");
  for (const { name, regex } of patterns) {
    const matches = text.match(regex);
    if (matches) {
      failures += matches.length;
      console.error(
        `✗ ${relative(root, path)}: ${matches.length} match(es) for ${name}`,
      );
      for (const m of matches.slice(0, 5)) console.error(`    ${m}`);
    }
  }
}

if (bundles.length === 0) {
  console.error("✗ No bundles found — run the build first (npm run build).");
  process.exit(1);
}

if (failures > 0) {
  console.error(
    `\nDist audit FAILED: ${failures} bundler-fragile pattern(s) in shipped output.\n` +
      "See packages/nys-icon/src/icon-library-registry.ts (iconsDirFrom) for the\n" +
      "required shape and .claude/docs/nys-icon-library-registration-fixes.md §6.",
  );
  process.exit(1);
}

console.log(
  `Dist audit passed: ${bundles.length} bundle(s) free of bundler-fragile URL patterns.`,
);

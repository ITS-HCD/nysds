/**
 * Build-time icon scan.
 *
 * The bundle registers `nys-icon` as a side effect of registering the header,
 * but only a fraction of the 80-odd icons in the NYSDS library can ever be
 * reached from the universal nav. This walks the sources that end up in the
 * bundle, collects every string literal that names a real icon, and hands the
 * result to `stripIconLibrary()` so the rest never ship.
 *
 * The scan is deliberately loose: it matches any quoted lowercase identifier
 * and then intersects with the library's own keys. Over-matching costs a few
 * hundred bytes; under-matching renders a blank square, so the bias is toward
 * keeping an icon. Names the scan cannot see statically (feed-driven alert
 * icons, alert type fallbacks) are listed in RUNTIME_ICONS below.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

/** Packages whose source is reachable from `<nys-unavheader>` / `<nys-unavfooter>`. */
export const SCANNED_PACKAGES = [
  "nys-unavheader",
  "nys-unavfooter",
  "nys-alert",
  "nys-button",
  "nys-textinput",
  "nys-label",
  "nys-errormessage",
  "nys-tooltip",
];

/**
 * Icons chosen at runtime rather than written as a literal in the template.
 * Kept explicit so a refactor of the source-side maps can't silently drop them.
 *
 * - The statewide alert feed picks an icon by name (`FEED_ICONS` in
 *   nys-unavheader), so any value that map can produce must be present.
 * - `nys-alert` falls back to a per-type icon when the feed sends none.
 */
export const RUNTIME_ICONS = [
  // nys-unavheader FEED_ICONS values
  "coronavirus",
  "ac_unit",
  "air",
  "clear_day",
  "rainy",
  "warning",
  "emergency_home",
  "error",
  "info",
  "notifications",
  "schedule",
  "location_on",
  // nys-alert type fallbacks
  "check_circle",
];

const ICON_ENTRY_RE = /(\w+):\s*`(<svg[\s\S]*?<\/svg>)\s*`/g;
const CANDIDATE_RE = /["'`]([a-z][a-z0-9_]{2,})["'`]/g;

/** Parse `nys-icon.library.ts` into a plain name -> SVG source map. */
export function readIconLibrary(repoRoot) {
  const source = readFileSync(
    resolve(repoRoot, "packages/nys-icon/src/nys-icon.library.ts"),
    "utf8",
  );

  const icons = {};
  for (const [, name, svg] of source.matchAll(ICON_ENTRY_RE)) {
    icons[name] = svg;
  }

  if (Object.keys(icons).length === 0) {
    throw new Error(
      "nys-unavbundle: parsed 0 icons from nys-icon.library.ts — the library format changed",
    );
  }
  return icons;
}

/** Names the bundle can actually render, sorted. */
export function resolveUsedIcons(repoRoot, library) {
  const known = new Set(Object.keys(library));
  const used = new Set();

  for (const name of RUNTIME_ICONS) {
    if (!known.has(name)) {
      throw new Error(
        `nys-unavbundle: RUNTIME_ICONS lists "${name}", which is not in the icon library`,
      );
    }
    used.add(name);
  }

  for (const pkg of SCANNED_PACKAGES) {
    const source = readFileSync(
      resolve(repoRoot, `packages/${pkg}/src/${pkg}.ts`),
      "utf8",
    );
    for (const [, candidate] of source.matchAll(CANDIDATE_RE)) {
      if (known.has(candidate)) used.add(candidate);
    }
  }

  return [...used].sort();
}

// `npm run icons -w @nysds/nys-unavbundle` — prints what the bundle would keep.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const repoRoot = resolve(import.meta.dirname, "../../..");
  const library = readIconLibrary(repoRoot);
  const used = resolveUsedIcons(repoRoot, library);
  const dropped = Object.keys(library).filter((n) => !used.includes(n));
  console.log(`kept ${used.length}/${Object.keys(library).length}:`);
  console.log("  " + used.join(" "));
  console.log(`\ndropped ${dropped.length}:`);
  console.log("  " + dropped.sort().join(" "));
}

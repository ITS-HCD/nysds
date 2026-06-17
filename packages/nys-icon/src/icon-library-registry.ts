/**
 * Icon Library Registry
 *
 * Global registry for icon libraries. The "default" library resolves
 * NYSDS icons from colocated SVG files extracted at build time.
 * Custom libraries (Font Awesome, Material Icons, etc.) can be
 * registered at runtime via `registerIconLibrary()`.
 *
 * The registry and watcher maps are stored on `window` so that even
 * when bundlers (Storybook Vite, etc.) create duplicate module
 * instances, every copy shares a single source of truth.
 */

export interface IconLibrary {
  /** Given an icon name, return the URL to its SVG file. Return undefined if not found. */
  resolver: (name: string) => string | undefined;
  /** Optional post-fetch transform applied to the parsed SVGElement. */
  mutator?: (svg: SVGElement) => void;
}

export interface NysIconWatcher {
  redraw(): void;
}

// ---------------------------------------------------------------------------
// Global singleton storage – survives module duplication by bundlers
// ---------------------------------------------------------------------------
interface NysIconGlobals {
  __nysIconRegistry: Map<string, IconLibrary>;
  __nysIconWatchers: Map<string, Set<NysIconWatcher>>;
}

declare global {
  interface Window extends NysIconGlobals {}
}

if (!window.__nysIconRegistry) {
  window.__nysIconRegistry = new Map<string, IconLibrary>();
}
if (!window.__nysIconWatchers) {
  window.__nysIconWatchers = new Map<string, Set<NysIconWatcher>>();
}

const registry = window.__nysIconRegistry;
const watchers = window.__nysIconWatchers;

/**
 * Resolve the base URL of the colocated `icons/` folder for the default
 * library, working "no matter where it is being served from" for vanilla-JS
 * installs (copy `dist/` somewhere and reference it with a `<script>` tag).
 *
 * The goal is to anchor `icons/` to the *served bundle's* directory, not to the
 * HTML page. We try several signals, most precise first:
 *
 *   1. `document.currentScript` — the executing tag for a classic
 *      `<script src="…/nysds.js">`. Only valid during synchronous module
 *      init, which is why this runs eagerly at load time.
 *   2. A matching `<script src>` in the DOM — `currentScript` is `null` for
 *      module scripts (`<script type="module">`), so we locate our own bundle
 *      by filename. This is the case the README documents.
 *   3. `import.meta.url` — the native module URL for a genuine ESM build.
 *   4. `document.baseURI` — last-resort page-relative fallback.
 *
 * `import.meta.url` alone is not enough: in the UMD bundle it is polyfilled,
 * and when that bundle is loaded as a module it degrades to a page-relative
 * URL. Reading it via a variable (rather than the literal
 * `new URL("./icons/", import.meta.url)` pattern) also stops downstream
 * bundlers from rewriting it into a broken asset reference.
 *
 * React/Angular and other bundler-driven setups inline the source with no
 * `nysds` script tag present, so they fall through here and must register an
 * explicit `"default"` resolver — see the docs.
 */
function resolveDefaultIconBaseUrl(): string {
  // Matches the served bundle filenames: nysds.js, nysds.es.js, nysds.min.js,
  // or the standalone nys-icon.js.
  const bundlePattern =
    /(?:^|\/)(?:nysds(?:\.es|\.min)?|nys-icon)\.js(?:[?#]|$)/;

  if (typeof document !== "undefined") {
    const current = document.currentScript as HTMLScriptElement | null;
    if (current?.src) return new URL("./icons/", current.src).href;

    const scripts = Array.from(
      document.querySelectorAll<HTMLScriptElement>("script[src]"),
    );
    const self = scripts.find((s) => bundlePattern.test(s.src));
    if (self?.src) return new URL("./icons/", self.src).href;
  }

  // Genuine ESM: import.meta.url is the module's own URL. Held in a variable
  // so bundlers don't statically rewrite the `new URL(literal, …)` pattern.
  const moduleUrl = import.meta.url;
  if (moduleUrl) return new URL("./icons/", moduleUrl).href;

  return new URL("./icons/", document.baseURI).href;
}

// Default library: resolves NYSDS icons from colocated dist/icons/ folder.
// Only register once (the first module instance to run wins).
if (!registry.has("default")) {
  const defaultBaseUrl = resolveDefaultIconBaseUrl();
  registry.set("default", {
    resolver: (name: string) =>
      name ? `${defaultBaseUrl}${name}.svg` : undefined,
  });
}

/** Register or replace a named icon library. All watching icons using this library will redraw.
 * @example Register a Font Awesome library with a custom resolver:
 * ```ts
 * registerIconLibrary("fa", {
 *   resolver: (name) => `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/svg/${name}.svg`
 * });
 * ```
 */

export function registerIconLibrary(name: string, library: IconLibrary): void {
  registry.set(name, library);
  watchers.get(name)?.forEach((w) => w.redraw());
}

/** Remove a registered icon library. All watching icons using this library will redraw. */
export function unregisterIconLibrary(name: string): void {
  registry.delete(name);
  watchers.get(name)?.forEach((w) => w.redraw());
}

/** Get a registered icon library by name. */
export function getIconLibrary(name: string): IconLibrary | undefined {
  return registry.get(name);
}

/** Subscribe an icon instance to library change notifications. */
export function watchIconLibrary(name: string, watcher: NysIconWatcher): void {
  if (!watchers.has(name)) watchers.set(name, new Set());
  watchers.get(name)!.add(watcher);
}

/** Unsubscribe an icon instance from library change notifications. */
export function unwatchIconLibrary(
  name: string,
  watcher: NysIconWatcher,
): void {
  watchers.get(name)?.delete(watcher);
}

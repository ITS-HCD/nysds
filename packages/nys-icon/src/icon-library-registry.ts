/**
 * Icon Library Registry
 *
 * Global registry for icon libraries. The "default" library resolves the
 * standard NYSDS icon set from an inline SVG map shipped as JavaScript
 * (`nys-icon.library.ts`), loaded lazily as a separate chunk — no base-URL
 * discovery, no per-icon fetch, no browser globals. Custom libraries
 * (Font Awesome, Material Icons, etc.) register at runtime via
 * `registerIconLibrary()` and typically resolve to URLs.
 *
 * The registry and watcher maps are stored on `globalThis` so that even
 * when bundlers (Storybook Vite, etc.) create duplicate module
 * instances, every copy shares a single source of truth. `globalThis`
 * (rather than `window`) keeps module import side-effect-safe in
 * Node/SSR environments, where `window` does not exist.
 */

/**
 * How a resolver locates an icon: a URL string (legacy shorthand for
 * `{ type: "url" }`), an explicit URL, or inline SVG source. Resolvers may
 * return synchronously or via a Promise.
 */
export type IconResolution =
  | string
  | { type: "url"; href: string }
  | { type: "svg"; content: string };

export interface IconLibrary {
  /** Given an icon name, return where/what its SVG is. Return undefined if not found. */
  resolver: (
    name: string,
  ) => IconResolution | undefined | Promise<IconResolution | undefined>;
  /** Optional post-parse transform applied to the SVGElement. */
  mutator?: (svg: SVGElement) => void;
}

export interface NysIconWatcher {
  redraw(): void;
}

// ---------------------------------------------------------------------------
// Global singleton storage – survives module duplication by bundlers
// ---------------------------------------------------------------------------
declare global {
  var __nysIconRegistry: Map<string, IconLibrary> | undefined;
  var __nysIconWatchers: Map<string, Set<NysIconWatcher>> | undefined;
  var __nysIconDefaultRegistered: boolean | undefined;
}

const registry = (globalThis.__nysIconRegistry ??= new Map<
  string,
  IconLibrary
>());
const watchers = (globalThis.__nysIconWatchers ??= new Map<
  string,
  Set<NysIconWatcher>
>());

// ---------------------------------------------------------------------------
// Default library — the standard NYSDS icon set, shipped as JS data
// ---------------------------------------------------------------------------

let defaultSet: Record<string, string> | null = null;
let defaultSetLoading: Promise<Record<string, string>> | null = null;

/**
 * Load the standard icon set lazily. The specifier is a *literal* so every
 * bundler code-splits the map into a separate async chunk — fetched once,
 * only when a default-library icon actually renders — instead of bundling
 * ~139 KB into the consumer's main chunk. Do NOT turn this into a
 * template-literal / computed import: dynamic specifiers reintroduce the
 * bundler static-analysis failures this design eliminates (#1677, #1687).
 */
async function loadDefaultSet(): Promise<Record<string, string>> {
  if (defaultSet) return defaultSet;
  defaultSetLoading ??= import("./nys-icon.library").then(
    (m) => (defaultSet = m.default),
  );
  return defaultSetLoading;
}

// Registered lazily on first lookup (never at import time, which must stay
// side-effect-free for SSR) and only once — the first module instance to
// resolve it wins, and an explicit register/unregister of "default" is
// never overridden.
function ensureDefaultLibrary(): void {
  if (globalThis.__nysIconDefaultRegistered || registry.has("default")) {
    globalThis.__nysIconDefaultRegistered = true;
    return;
  }

  globalThis.__nysIconDefaultRegistered = true;
  registry.set("default", {
    resolver: async (name) => {
      if (!name) return undefined;
      const set = await loadDefaultSet();
      const content = set[name];
      return content ? { type: "svg", content } : undefined;
    },
  });
}

/** Register or replace a named icon library. All watching icons using this library will redraw.
 *
 * Intended for custom/external libraries — the standard NYSDS set is
 * built in and needs no registration. Registering under `"default"`
 * replaces the built-in set (escape hatch).
 *
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
  ensureDefaultLibrary();
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

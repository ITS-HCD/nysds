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

// Default library: resolves NYSDS icons from colocated dist/icons/ folder.
// Only register once (the first module instance to run wins).
if (!registry.has("default")) {
  const defaultBaseUrl = new URL(/* @vite-ignore */ "./icons/", import.meta.url)
    .href;
  registry.set("default", {
    resolver: (name: string) =>
      name ? `${defaultBaseUrl}${name}.svg` : undefined,
  });
}

/** Register or replace a named icon library. All watching icons using this library will redraw. */
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

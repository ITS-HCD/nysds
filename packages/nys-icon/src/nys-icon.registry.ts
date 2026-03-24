/**
 * Icon library registry for nys-icon.
 *
 * Allows consumers to register external icon libraries (Font Awesome,
 * Google Material Icons, etc.) at runtime. Each library provides a
 * `resolver` function that maps an icon name to a fetchable URL, and
 * an optional `mutator` function that transforms the SVG after parsing.
 *
 * The built-in NYSDS icons are registered as the "default" library
 * automatically when the component module loads.
 *
 * @example
 * ```typescript
 * import { registerIconLibrary } from "@nysds/nys-icon";
 *
 * registerIconLibrary("fa", {
 *   resolver: (name) =>
 *     `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/${name}.svg`,
 *   mutator: (svg) => svg.setAttribute("fill", "currentColor"),
 * });
 * ```
 */

import type { NysIcon } from "./nys-icon";

/** Resolves an icon name to a fetchable URL. */
export type IconLibraryResolver = (name: string) => string;

/** Optionally transforms the SVG element after parsing (e.g., set fill). */
export type IconLibraryMutator = (svg: SVGElement) => void;

/** An icon library configuration. */
export interface IconLibraryConfig {
  resolver: IconLibraryResolver;
  mutator?: IconLibraryMutator;
}

// ---- Internal state (globalThis-backed singletons) ----
// Using globalThis ensures that all copies of this module (source, dist bundle,
// UMD bundle) share the same registry and watcher set. Without this, environments
// like Storybook that load both source and dist copies would create separate
// Map/Set instances, causing registerIconLibrary calls in one copy to be invisible
// to the component running from the other copy.

const REGISTRY_KEY = Symbol.for("nysds.iconRegistry");
const WATCHERS_KEY = Symbol.for("nysds.iconWatchers");

const _global = globalThis as Record<symbol, unknown>;
_global[REGISTRY_KEY] ??= new Map<string, IconLibraryConfig>();
_global[WATCHERS_KEY] ??= new Set<NysIcon>();

const registry = _global[REGISTRY_KEY] as Map<string, IconLibraryConfig>;
const watchedIcons = _global[WATCHERS_KEY] as Set<NysIcon>;

// ---- Public API ----

/**
 * Register (or replace) a named icon library.
 * All currently-mounted `<nys-icon>` elements using this library will
 * automatically re-render with the new resolver/mutator.
 */
export function registerIconLibrary(
  name: string,
  config: IconLibraryConfig,
): void {
  registry.set(name, config);

  // Re-render any mounted icons that reference this library.
  watchedIcons.forEach((icon) => {
    if (icon.library === name) {
      icon.setIcon();
    }
  });
}

/**
 * Remove a named icon library.
 * Icons using the removed library will re-render (and show nothing / fire error).
 * The `"default"` library cannot be unregistered.
 */
export function unregisterIconLibrary(name: string): void {
  if (name === "default") {
    console.warn(
      '[nys-icon] Cannot unregister the "default" icon library.',
    );
    return;
  }
  registry.delete(name);

  // Re-render affected icons so they clear / error.
  watchedIcons.forEach((icon) => {
    if (icon.library === name) {
      icon.setIcon();
    }
  });
}

/**
 * Look up a registered icon library by name.
 * Returns `undefined` if no library is registered under that name.
 */
export function getIconLibrary(
  name: string,
): IconLibraryConfig | undefined {
  return registry.get(name);
}

// ---- Watcher helpers (called by NysIcon lifecycle) ----

/** @internal */
export function watchIcon(icon: NysIcon): void {
  watchedIcons.add(icon);
}

/** @internal */
export function unwatchIcon(icon: NysIcon): void {
  watchedIcons.delete(icon);
}

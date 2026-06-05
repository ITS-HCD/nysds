/**
 * Icon Cache
 *
 * Shared SVG fetch and parse cache. Deduplicates concurrent requests
 * for the same icon URL. Each consumer gets a cloned SVGElement via
 * `cloneNode(true)` so DOM nodes are never shared.
 */

const cache = new Map<string, Promise<SVGElement>>();

// DOMPurify (~30KB) is only needed when sanitizing a fetched remote SVG.
// Consumers that use only the built-in icon library never call _doFetch, so
// we load it lazily and memoize the promise to keep that weight out of the
// initial bundle for static icon consumers.
type DOMPurifyModule = typeof import("dompurify").default;
let _domPurifyLoader: Promise<DOMPurifyModule> | undefined;

function _loadDOMPurify(): Promise<DOMPurifyModule> {
  if (!_domPurifyLoader) {
    _domPurifyLoader = import("dompurify").then((m) => m.default);
  }
  return _domPurifyLoader;
}

async function _doFetch(url: string): Promise<SVGElement> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to load icon: ${resp.status}`);
  }
  const text = await resp.text();
  const DOMPurify = await _loadDOMPurify();
  // Sanitize before parsing — strips <script>, event handlers, javascript: hrefs
  const clean = DOMPurify.sanitize(text, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ["script", "use"], // <use> can SSRF to external hrefs
    FORBID_ATTR: ["onload", "onerror", "onbegin", "href", "xlink:href"],
  });
  const parser = new DOMParser();
  const doc = parser.parseFromString(clean, "image/svg+xml");
  const svg = doc.documentElement;
  if (!(svg instanceof SVGElement)) {
    throw new Error(`Invalid SVG from ${url}`);
  }
  return svg;
}

/** Fetch and parse an SVG from a URL. Returns a cloned SVGElement (safe for multiple consumers). */
export async function fetchIcon(url: string): Promise<SVGElement> {
  if (!cache.has(url)) {
    cache.set(url, _doFetch(url));
  }
  const svg = await cache.get(url)!;
  return svg.cloneNode(true) as SVGElement;
}

/** Clear one or all entries from the cache. */
export function clearIconCache(url?: string): void {
  if (url) {
    cache.delete(url);
  } else {
    cache.clear();
  }
}

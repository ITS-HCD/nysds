/**
 * Icon Cache
 *
 * Shared SVG fetch and parse cache. Deduplicates concurrent requests
 * for the same icon URL. Each consumer gets a cloned SVGElement via
 * `cloneNode(true)` so DOM nodes are never shared.
 */

const cache = new Map<string, Promise<SVGElement>>();

async function _doFetch(url: string): Promise<SVGElement> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to load icon from ${url}: ${resp.status}`);
  }
  const text = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "image/svg+xml");
  const svg = doc.documentElement;
  if (!(svg instanceof SVGElement)) {
    throw new Error(`Invalid SVG response from ${url}`);
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

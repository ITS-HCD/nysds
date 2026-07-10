/**
 * Icon Cache
 *
 * Shared SVG sanitize/parse pipeline and caches. URL-based icons (custom
 * libraries) are fetched once per URL; inline SVG sources (the built-in
 * NYSDS set) are parsed once per source string. Each consumer gets a
 * cloned SVGElement via `cloneNode(true)` so DOM nodes are never shared.
 */

import DOMPurify from "dompurify";

const urlCache = new Map<string, Promise<SVGElement>>();
const inlineCache = new Map<string, SVGElement>();

/** Sanitize and parse SVG text. One pipeline for fetched and inline sources. */
function sanitizeAndParse(text: string, context: string): SVGElement {
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
    throw new Error(`Invalid SVG from ${context}`);
  }
  return svg;
}

async function _doFetch(url: string): Promise<SVGElement> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to load icon: ${resp.status}`);
  }
  return sanitizeAndParse(await resp.text(), url);
}

/** Fetch and parse an SVG from a URL. Returns a cloned SVGElement (safe for multiple consumers). */
export async function fetchIcon(url: string): Promise<SVGElement> {
  if (!urlCache.has(url)) {
    urlCache.set(url, _doFetch(url));
  }
  const svg = await urlCache.get(url)!;
  return svg.cloneNode(true) as SVGElement;
}

/**
 * Parse an inline SVG source string. Results are cached by source content,
 * so repeated renders of the same icon sanitize/parse once. Returns a
 * cloned SVGElement (safe for multiple consumers).
 */
export function parseIcon(source: string): SVGElement {
  let svg = inlineCache.get(source);
  if (!svg) {
    svg = sanitizeAndParse(source, "inline SVG source");
    inlineCache.set(source, svg);
  }
  return svg.cloneNode(true) as SVGElement;
}

/** Clear one URL entry, or all cached icons (URL and inline) when no URL is given. */
export function clearIconCache(url?: string): void {
  if (url) {
    urlCache.delete(url);
  } else {
    urlCache.clear();
    inlineCache.clear();
  }
}

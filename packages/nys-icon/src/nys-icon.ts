import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-icon.scss?inline";

// Resolve the default base path at module parse time.
// ES modules: use import.meta.url. UMD: fall back to document.currentScript.
const _defaultBasePath = (() => {
  try {
    return new URL(/* @vite-ignore */ "./icons/", import.meta.url).href;
  } catch {
    if (typeof document !== "undefined" && document.currentScript) {
      return new URL(
        "./icons/",
        (document.currentScript as HTMLScriptElement).src,
      ).href;
    }
    return "./icons/";
  }
})();

// Module-level cache: stores Promises so concurrent requests share one fetch.
const iconCache = new Map<string, Promise<string | null>>();

async function fetchIcon(
  name: string,
  basePath: string,
): Promise<string | null> {
  const url = `${basePath}${name}.svg`;

  if (iconCache.has(url)) {
    return iconCache.get(url)!;
  }

  const promise = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Icon "${name}" not found (${response.status})`);
      }
      return response.text();
    })
    .catch((err) => {
      iconCache.delete(url); // Allow retries on failure
      console.warn(`[nys-icon] Failed to load icon "${name}": ${err.message}`);
      return null;
    });

  iconCache.set(url, promise);
  return promise;
}

/**
 * Renders SVG icons from the NYSDS icon library (Material Symbols). Decorative by default (`aria-hidden`).
 *
 * Pass `name` to select an icon from the library. Use `ariaLabel` to make the icon accessible
 * (removes `aria-hidden`). Supports size presets, rotation, flipping, and custom colors.
 *
 * @summary SVG icon from Material Symbols library with size, rotation, and color options.
 * @element nys-icon
 *
 * @example Basic icon
 * ```html
 * <nys-icon name="check_circle" size="lg"></nys-icon>
 * ```
 *
 * @example Accessible icon with label
 * ```html
 * <nys-icon name="warning" ariaLabel="Warning" color="var(--nys-color-warning)"></nys-icon>
 * ```
 */

export class NysIcon extends LitElement {
  static styles = unsafeCSS(styles);

  /**
   * Base URL for loading SVG icon files.
   * Defaults to resolving relative to the component's own module URL.
   * Override this static property to point to a CDN or custom path.
   */
  static iconsBasePath: string = _defaultBasePath;

  /** Icon name from Material Symbols library. Required. */
  @property({ type: String, reflect: true }) name = "";

  /** Accessible label. When set, removes `aria-hidden` and adds `aria-label` to the SVG. */
  @property({ type: String }) ariaLabel = "";

  /** Rotation in degrees. Applied via CSS `rotate`. */
  @property({ type: String }) rotate = "0";

  /** Flip direction: `horizontal`, `vertical`, or empty for none. */
  @property({ type: String }) flip = "";

  /** Icon color. Accepts any CSS color value. Defaults to `currentcolor`. */
  @property({ type: String }) color = "";

  /**
   * Icon size. Semantic sizes: `xs`-`5xl`. Pixel sizes: `12`-`50`.
   * @default "md"
   */
  @property({ type: String }) size:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "12"
    | "14"
    | "16"
    | "18"
    | "20"
    | "24"
    | "32"
    | "40"
    | "50" = "md";

  @state() private _renderedSvg: SVGElement | null = null;

  // Version counter to ignore stale fetch responses when name changes rapidly.
  private _loadVersion = 0;

  // Public promise that resolves when the current icon has finished loading.
  private _iconLoadedResolve!: () => void;
  iconLoaded: Promise<void> = new Promise((r) => {
    this._iconLoadedResolve = r;
  });

  override willUpdate(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("name")) {
      this._loadIcon();
    }
  }

  private async _loadIcon() {
    const name = this.name;
    if (!name) {
      this._renderedSvg = null;
      this._iconLoadedResolve();
      return;
    }

    // Reset the iconLoaded promise for a new load cycle.
    this.iconLoaded = new Promise((r) => {
      this._iconLoadedResolve = r;
    });

    const currentVersion = ++this._loadVersion;
    const svgText = await fetchIcon(name, NysIcon.iconsBasePath);

    // Ignore if name changed while we were fetching.
    if (currentVersion !== this._loadVersion) return;

    if (svgText === null) {
      this._renderedSvg = null;
      this.dispatchEvent(
        new CustomEvent("nys-icon-error", {
          detail: { name },
          bubbles: true,
          composed: true,
        }),
      );
      this._iconLoadedResolve();
      return;
    }

    this._renderedSvg = this._parseSvg(svgText);
    this._iconLoadedResolve();
  }

  /**
   * Parses an SVG string and applies accessibility, rotation, flip, color, and size classes.
   */
  private _parseSvg(svgText: string): SVGElement | null {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    if (!(svgElement instanceof SVGElement)) {
      return null;
    }

    // Add accessibility attributes directly to the <svg>
    svgElement.setAttribute("role", "img");
    if (this.ariaLabel) {
      svgElement.setAttribute("aria-label", this.ariaLabel);
      svgElement.removeAttribute("aria-hidden");
    } else {
      svgElement.setAttribute("aria-hidden", "true");
      svgElement.removeAttribute("aria-label");
    }

    // Add styles
    svgElement.style.rotate = `${this.rotate}deg`;
    svgElement.style.color = this.color || "currentcolor";
    svgElement.classList.add(`nys-icon--${this.size}`);
    svgElement.classList.add(`nys-icon--svg`);

    if (this.flip) {
      svgElement.classList.add(`nys-icon--flip-${this.flip}`);
    }

    return svgElement;
  }

  render() {
    return this._renderedSvg ? html`${this._renderedSvg}` : null;
  }
}

/*
 Conditionally register the custom element.
 This ensure the custom element is registered only once to avoid duplication, especially in environments like Storybook where this component may be used as a dependency.
 */
if (!customElements.get("nys-icon")) {
  customElements.define("nys-icon", NysIcon);
}

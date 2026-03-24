import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-icon.scss?inline";
import {
  registerIconLibrary,
  getIconLibrary,
  watchIcon,
  unwatchIcon,
} from "./nys-icon.registry";

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

/**
 * Fetch an SVG by its full URL. Results are cached by URL so the same
 * resource is only requested once per page session.
 */
async function fetchIconByUrl(url: string): Promise<string | null> {
  if (iconCache.has(url)) {
    return iconCache.get(url)!;
  }

  const promise = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Icon not found at "${url}" (${response.status})`);
      }
      return response.text();
    })
    .catch((err) => {
      iconCache.delete(url); // Allow retries on failure
      console.warn(`[nys-icon] Failed to load icon: ${err.message}`);
      return null;
    });

  iconCache.set(url, promise);
  return promise;
}

/**
 * Renders SVG icons from a registered icon library. Decorative by default (`aria-hidden`).
 *
 * Pass `name` to select an icon. Use `library` to select which icon library resolves
 * the name (defaults to the built-in NYSDS library). Use `ariaLabel` to make the icon
 * accessible (removes `aria-hidden`). Supports size presets, rotation, flipping, and
 * custom colors.
 *
 * @summary SVG icon with swappable library support, size, rotation, and color options.
 * @element nys-icon
 *
 * @example Basic icon (default NYSDS library)
 * ```html
 * <nys-icon name="check_circle" size="lg"></nys-icon>
 * ```
 *
 * @example Icon from a custom library
 * ```html
 * <nys-icon library="fa" name="regular/heart"></nys-icon>
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
   * Base URL for loading SVG icon files from the default library.
   * Defaults to resolving relative to the component's own module URL.
   * Override this static property to point to a CDN or custom path.
   */
  static iconsBasePath: string = _defaultBasePath;

  /** Icon name. Required. Resolved to a URL by the active library's resolver. */
  @property({ type: String, reflect: true }) name = "";

  /**
   * Which registered icon library to use. Defaults to `"default"` (built-in NYSDS icons).
   * Register custom libraries with `registerIconLibrary()`.
   */
  @property({ type: String, reflect: true }) library = "default";

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

  // Version counter to ignore stale fetch responses when name/library changes rapidly.
  private _loadVersion = 0;

  // Public promise that resolves when the current icon has finished loading.
  private _iconLoadedResolve!: () => void;
  iconLoaded: Promise<void> = new Promise((r) => {
    this._iconLoadedResolve = r;
  });

  override connectedCallback() {
    super.connectedCallback();
    watchIcon(this);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    unwatchIcon(this);
  }

  override willUpdate(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("name") || changedProperties.has("library")) {
      this._loadIcon();
    }
  }

  /**
   * Public method called by the registry when the icon's library is
   * re-registered or unregistered. Triggers a reload.
   */
  setIcon() {
    this._loadIcon();
  }

  private async _loadIcon() {
    const { name, library } = this;

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

    // Look up the library in the registry.
    const lib = getIconLibrary(library);
    if (!lib) {
      console.warn(
        `[nys-icon] Icon library "${library}" is not registered.`,
      );
      this._renderedSvg = null;
      this.dispatchEvent(
        new CustomEvent("nys-icon-error", {
          detail: { name, library },
          bubbles: true,
          composed: true,
        }),
      );
      this._iconLoadedResolve();
      return;
    }

    // Resolve the icon name to a URL via the library's resolver.
    const url = lib.resolver(name);
    const svgText = await fetchIconByUrl(url);

    // Ignore if name/library changed while we were fetching.
    if (currentVersion !== this._loadVersion) return;

    if (svgText === null) {
      this._renderedSvg = null;
      this.dispatchEvent(
        new CustomEvent("nys-icon-error", {
          detail: { name, library },
          bubbles: true,
          composed: true,
        }),
      );
      this._iconLoadedResolve();
      return;
    }

    const svgElement = this._parseSvg(svgText);

    // Apply the library's mutator if present.
    if (svgElement && lib.mutator) {
      lib.mutator(svgElement);
    }

    this._renderedSvg = svgElement;
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

// Register the built-in NYSDS icon library as the "default".
// The resolver reads iconsBasePath dynamically so overrides take effect.
registerIconLibrary("default", {
  resolver: (name: string) => `${NysIcon.iconsBasePath}${name}.svg`,
});

/*
 Conditionally register the custom element.
 This ensure the custom element is registered only once to avoid duplication, especially in environments like Storybook where this component may be used as a dependency.
 */
if (!customElements.get("nys-icon")) {
  customElements.define("nys-icon", NysIcon);
}

import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import {
  getIconLibrary,
  watchIconLibrary,
  unwatchIconLibrary,
  NysIconWatcher,
} from "./icon-library-registry";
import { fetchIcon } from "./icon-cache";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-icon.scss?inline";

/**
 * Renders SVG icons from a registered icon library. The built-in NYSDS icon
 * library (Material Symbols) is the default. Custom libraries (Font Awesome,
 * Material Icons, etc.) can be registered via `registerIconLibrary()`.
 *
 * Pass `name` to select an icon. Use `library` to choose a registered library
 * (defaults to `"default"` for NYSDS icons). Use `ariaLabel` to make the icon
 * accessible (removes `aria-hidden`). Supports size presets, rotation,
 * flipping, and custom colors.
 *
 * @summary SVG icon with swappable library support, size, rotation, and color options.
 * @element nys-icon
 *
 * @example Basic icon (default NYSDS library)
 * ```html
 * <nys-icon name="check_circle" size="lg"></nys-icon>
 * ```
 *
 * @example Font Awesome icon
 * ```html
 * <nys-icon name="house" library="fa" size="lg"></nys-icon>
 * ```
 *
 * @example Accessible icon with label
 * ```html
 * <nys-icon name="warning" ariaLabel="Warning" color="var(--nys-color-warning)"></nys-icon>
 * ```
 */
export class NysIcon extends LitElement implements NysIconWatcher {
  static styles = unsafeCSS(styles);

  /** Icon name to resolve from the selected library. Required. */
  @property({ type: String, reflect: true }) name = "";

  /** Which registered icon library to use. Defaults to the built-in NYSDS library. */
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

  @state() private _svg: SVGElement | null = null;

  /** Monotonically increasing token so stale async fetches are discarded. */
  private _loadSeq = 0;

  connectedCallback() {
    super.connectedCallback();
    watchIconLibrary(this.library, this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    unwatchIconLibrary(this.library, this);
  }

  /** Called by the icon library registry when the current library changes. */
  redraw() {
    this._loadIcon();
  }

  /**
   * Lit calls firstUpdated after the first render, once all reactive
   * properties (including those set from the template) are resolved.
   * This guarantees the initial _loadIcon runs with the correct name
   * and library values, avoiding the race where updated() might not
   * fire for properties that equal their defaults.
   */
  firstUpdated() {
    this._loadIcon();
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has("name") || changedProps.has("library")) {
      if (changedProps.has("library")) {
        const oldLib = changedProps.get("library") as string;
        if (oldLib) unwatchIconLibrary(oldLib, this);
        watchIconLibrary(this.library, this);
      }
      this._loadIcon();
    }

    // Re-apply attributes when visual props change (without re-fetching)
    if (
      this._svg &&
      (changedProps.has("ariaLabel") ||
        changedProps.has("rotate") ||
        changedProps.has("flip") ||
        changedProps.has("color") ||
        changedProps.has("size"))
    ) {
      this._applyAttributes(this._svg);
      this.requestUpdate();
    }
  }

  private async _loadIcon() {
    // Bump the sequence token; any in-flight fetch with an older token
    // will be discarded when it resolves.
    const seq = ++this._loadSeq;

    const lib = getIconLibrary(this.library);
    if (!lib || !this.name) {
      this._svg = null;
      return;
    }

    const url = lib.resolver(this.name);
    if (!url) {
      this._svg = null;
      return;
    }

    try {
      const svg = await fetchIcon(url);
      // Discard if a newer _loadIcon call was made while we were fetching.
      if (seq !== this._loadSeq) return;
      lib.mutator?.(svg);
      this._applyAttributes(svg);
      this._svg = svg;
    } catch {
      if (seq === this._loadSeq) this._svg = null;
    }
  }

  private _applyAttributes(svg: SVGElement) {
    svg.setAttribute("role", "img");
    if (this.ariaLabel) {
      svg.setAttribute("aria-label", this.ariaLabel);
      svg.removeAttribute("aria-hidden");
    } else {
      svg.setAttribute("aria-hidden", "true");
      svg.removeAttribute("aria-label");
    }

    svg.style.rotate = `${this.rotate}deg`;
    svg.style.color = this.color || "currentcolor";
    svg.classList.add(`nys-icon--${this.size}`);
    svg.classList.add(`nys-icon--svg`);

    if (this.flip) {
      svg.classList.add(`nys-icon--flip-${this.flip}`);
    }
  }

  render() {
    return this._svg ? html`${this._svg}` : null;
  }
}

/*
 Conditionally register the custom element.
 This ensure the custom element is registered only once to avoid duplication, especially in environments like Storybook where this component may be used as a dependency.
 */
if (!customElements.get("nys-icon")) {
  customElements.define("nys-icon", NysIcon);
}

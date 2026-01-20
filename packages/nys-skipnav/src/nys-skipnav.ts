import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-skipnav.scss?inline";

/**
 * An accessible "Skip to main content" link for keyboard and screen reader users. Visually hidden until focused.
 *
 * Place as the first focusable element in the document. Links to `#main-content` by default, or specify `href`
 * for a custom target. The target element receives focus when activated for proper screen reader announcement.
 *
 * @summary Skip navigation link for keyboard accessibility. Hidden until focused.
 * @element nys-skipnav
 *
 * @example Default skip link
 * ```html
 * <nys-skipnav></nys-skipnav>
 * <main id="main-content">...</main>
 * ```
 *
 * @example Custom target
 * ```html
 * <nys-skipnav href="#content-area"></nys-skipnav>
 * ```
 */
export class NysSkipnav extends LitElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Target element ID (with `#`). Defaults to `#main-content`. */
  @property({ type: String }) href = "";

  constructor() {
    super();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-skipnav-${Date.now()}`;
    }
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private _handleFocus() {
    const linkElement = this.shadowRoot?.querySelector(".nys-skipnav__link");

    linkElement?.classList.add("show");
  }

  private _handleBlur() {
    const linkElement = this.shadowRoot?.querySelector(".nys-skipnav__link");

    linkElement?.classList.remove("show"); // Link is hidden whenever not focused
  }

  private _handleClick() {
    // Use href or default to #main-content
    const targetId = (this.href || "#main-content").replace("#", "");
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      // Make sure it's focusable for screen readers rather than just scrolling to it
      targetEl.setAttribute("tabindex", "-1");
      targetEl.focus();
      // Remove the blue outline that is applied to focused elements since we don't want the blue outline on the main container
      targetEl.style.outline = "none";
    }
  }

  render() {
    return html`
      <div class="nys-skipnav">
        <a
          href=${this.href ? this.href : "#main-content"}
          tabindex="0"
          class="nys-skipnav__link"
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
          @click="${this._handleClick}"
        >
          Skip to main content
        </a>
      </div>
    `;
  }
}

if (!customElements.get("nys-skipnav")) {
  customElements.define("nys-skipnav", NysSkipnav);
}

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-skipnav.scss?inline";

/**
 * An accessible "Skip to main content" link for keyboard and screen reader users. Visually hidden until focused.
 *
 * **Status:** Stable | **WCAG:** 2.2 AA
 *
 * Place as the first focusable element in the document, ideally right after the opening `<body>` tag, before any headers or navigation.
 * Links to `#main-content` by default, or specify `href` for a custom target. The target element receives focus when activated for proper
 * screen reader announcement and navigation bypass. Hidden visually by default and appears on Tab or when focused via keyboard.
 *
 * ## When to use
 * - Pages with large headers or navigation elements before the main content.
 * - Any site where keyboard users benefit from skipping repeated navigation.
 *
 * ## When not to use
 * - Pages that start directly with main content and have no navigation to skip.
 *
 * ## Accessibility features
 * - First focusable element on page load for keyboard users.
 * - Visible only on focus with clear focus indicator that meets WCAG 2.2 AA.
 * - Pressing Enter moves focus to the target element for proper screen reader announcement.
 * - Correctly announces the link and manages focus on activation for assistive technologies.
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Use on pages with repeated navigation or other content before the main section.
 * - Make sure the `href` on `<nys-skipnav>` matches the `id` of the main content container.
 *
 * **Don't:**
 * - Use if there's nothing to skip over.
 * - Mismatch the `href` and target `id`.
 *
 * @summary Skip navigation link for keyboard accessibility. Hidden until focused.
 * @element nys-skipnav
 *
 * @example Default skip link targeting main-content
 * ```html
 * <nys-skipnav></nys-skipnav>
 * <header>...</header>
 * <main id="main-content">...</main>
 * ```
 *
 * @example Custom href target
 * ```html
 * <nys-skipnav href="#content-area"></nys-skipnav>
 * <div id="content-area">Main content goes here</div>
 * ```
 *
 * ## Dependencies
 *  *
 *  * This component has no dependencies on other NYS Design System components.
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

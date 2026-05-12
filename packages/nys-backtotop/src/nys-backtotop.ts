import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-backtotop.scss?inline";

/**
 * A floating "Back to top" button that appears after scrolling. Smooth-scrolls to page top when clicked.
 *
 * Auto-shows after scrolling 1.5 viewports on pages 4+ screens tall. Set `visible` to force display.
 * Renders as circle button on mobile. Position with `position` prop (`left` or `right`).
 *
 * **Placement:** For best accessibility, place as the first focusable element in the page footer.
 * If no footer exists, place at the bottom of the body tag (after main content). Floating
 * positioning allows it to overlay content without taking up layout space.
 *
 * **Focus Management:** When clicked, after scrolling to the top, focus is automatically moved
 * to the `<main>` element (if present), the first heading (`<h1>` or `<h2>`), or the document element.
 * This ensures keyboard navigation continues naturally from the top of the page.
 *
 * @summary Floating back-to-top button with auto-show behavior, smooth scroll, and focus management.
 * @element nys-backtotop
 *
 * @example Auto-appearing button in footer
 * ```html
 * <footer>
 *   <nys-backtotop></nys-backtotop>
 *   <!-- Other footer content -->
 * </footer>
 * ```
 *
 * @example Always visible, left position
 * ```html
 * <nys-backtotop visible position="left"></nys-backtotop>
 * ```
 */
export class NysBacktotop extends LitElement {
  static styles = unsafeCSS(styles);

  /** Horizontal position: `left` or `right`. */
  @property({ type: String }) position = "right";

  /** Force button visibility. Overrides auto-show scroll behavior. */
  @property({ type: Boolean, reflect: true }) visible = false;

  @state() private isMobile = false;
  @state() private forceVisible = false;

  private mediaQuery: MediaQueryList;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  constructor() {
    super();
    this._handleScroll = this._handleScroll.bind(this);
    this._handleResize = this._handleResize.bind(this);
    this.mediaQuery = window.matchMedia("(max-width: 480px)");
  }

  connectedCallback() {
    super.connectedCallback();
    this.forceVisible = this.hasAttribute("visible"); // true only if passed in markup
    window.addEventListener("scroll", this._handleScroll);
    this.mediaQuery.addEventListener("change", this._handleResize);
    this._handleResize(); // Initialize
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this._handleScroll);
    this.mediaQuery.removeEventListener("change", this._handleResize);
    super.disconnectedCallback();
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _handleScroll() {
    // If visible was explicitly set by user, don't override it
    if (this.forceVisible) return;

    const screenHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    // Show only if total page height >= 4 screens and scrolled past 1.5 screens
    this.visible =
      pageHeight >= screenHeight * 4 && window.scrollY > screenHeight * 1.5;
  }

  private _scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Move focus to the main content area or first heading after scroll
    // Use a scroll event listener to detect when smooth scroll completes
    const handleScrollComplete = () => {
      window.removeEventListener("scroll", handleScrollComplete);
      this._moveFocusToTop();
    };
    window.addEventListener("scroll", handleScrollComplete, { once: true });
  }

  private _moveFocusToTop() {
    // Try to focus main element, then first heading, then body as fallback
    const mainEl = document.querySelector("main");
    if (mainEl) {
      // Ensure main is focusable
      if (!mainEl.hasAttribute("tabindex")) {
        mainEl.setAttribute("tabindex", "-1");
      }
      (mainEl as HTMLElement).focus();
      return;
    }

    const heading = document.querySelector("h1, h2");
    if (heading) {
      if (!heading.hasAttribute("tabindex")) {
        heading.setAttribute("tabindex", "-1");
      }
      (heading as HTMLElement).focus();
      return;
    }

    // If no main or heading, focus document element as last resort
    (document.documentElement as HTMLElement).focus();
  }

  private _handleResize() {
    this.isMobile = this.mediaQuery.matches;
  }

  render() {
    const classes = [
      "nys-backtotop",
      this.position,
      this.visible ? "visible" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return html`<nys-button
      id="nys-backtotop"
      prefixIcon="chevron_up"
      variant="outline"
      label="Back to top"
      size="sm"
      class="${classes}"
      ?circle=${this.isMobile}
      @nys-click=${this._scrollToTop}
    ></nys-button>`;
  }
}

if (!customElements.get("nys-backtotop")) {
  customElements.define("nys-backtotop", NysBacktotop);
}

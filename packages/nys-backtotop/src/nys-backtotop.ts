import { html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
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
 * **Focus Management:** When clicked, after scrolling to the top, focus is moved to `<body>`.
 * This places the user before the skip-navigation link so they can re-use it to jump directly
 * back to main content — and works regardless of whether the page uses `<main>` or heading landmarks.
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
export class NysBacktotop extends NysElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

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
    // Respect the user's reduced-motion preference (WCAG 2.3.3): skip the
    // smooth-scroll animation and jump instantly when motion is not wanted.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth";

    // If we are already at the top, no scroll event will fire, so move focus
    // immediately rather than waiting on a scroll that never happens.
    if (window.scrollY === 0) {
      window.scrollTo({ top: 0, behavior });
      this._moveFocusToTop();
      return;
    }

    window.scrollTo({ top: 0, behavior });
    // Move focus to the top after the scroll completes.
    // Use a scroll event listener to detect when the scroll finishes.
    const handleScrollComplete = () => {
      window.removeEventListener("scroll", handleScrollComplete);
      this._moveFocusToTop();
    };
    window.addEventListener("scroll", handleScrollComplete, { once: true });
  }

  private _moveFocusToTop() {
    // Focus <body> so the user lands before the skip-navigation link and can
    // re-use it to jump back to main content, regardless of page structure.
    if (!document.body.hasAttribute("tabindex")) {
      document.body.setAttribute("tabindex", "-1");
    }
    document.body.focus();
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

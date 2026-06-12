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
 * **Focus Management:** When clicked, after scrolling to the top, focus is moved to `<body>`.
 * This places the user before the skip-navigation link so they can re-use it to jump directly
 * back to main content — and works regardless of whether the page uses `<main>` or heading landmarks.
 *
 * @summary Floating back-to-top button with auto-show behavior, smooth scroll, and focus management.
 * @element nys-backtotop
 *
 * @example Basic
 * ```html
 * <footer>
 *   <nys-backtotop></nys-backtotop>
 *   <!-- Other footer content -->
 * </footer>
 * ```
 *
 * @render Basic
 * ```html
 * <style>
 *   code {
 *     white-space: nowrap;
 *     padding: var(--nys-space-1px) var(--nys-space-2px);
 *     border-radius: var(--nys-radius-md);
 *     color: var(--nys-color-red-600);
 *     background: var(--nys-color-neutral-10);
 *     font-size: var(--nys-font-size-sm);
 *   }
 * </style>
 * <nys-unavheader hideTranslate hideSearch></nys-unavheader>
 * <nys-globalheader appName="Back to Top Example"></nys-globalheader>
 * <main style="padding: 0 2rem">
 *   <h1>Sample Content on page</h1>
 *   <p>
 *     This is a sample content area used to demonstrate the functionality of
 *     the Back to Top button. In an actual application,
 *     <code>nys-backtotop</code> would not be visible until the user scrolls
 *     down the page.
 *   </p>
 * </main>
 * <footer>
 *   <nys-backtotop visible .position=${args.position}></nys-backtotop>
 *   <nys-unavfooter></nys-unavfooter>
 * </footer>
 * ```
 * @example Left
 * ```html
 * <footer>
 *   <nys-backtotop position="left"></nys-backtotop>
 *   <!-- Other footer content -->
 * </footer>
 * ```
 *
 * @render Left
 * ```html
 * <style>
 *   code {
 *     white-space: nowrap;
 *     padding: var(--nys-space-1px) var(--nys-space-2px);
 *     border-radius: var(--nys-radius-md);
 *     color: var(--nys-color-red-600);
 *     background: var(--nys-color-neutral-10);
 *     font-size: var(--nys-font-size-sm);
 *   }
 *   nys-button {
 *     position: fixed;
 *     bottom: 1rem;
 *     right: 1rem;
 *     --_nys-button-border-radius: var(--nys-radius-round);
 *  }
 * </style>
 * <nys-unavheader hideTranslate hideSearch></nys-unavheader>
 * <nys-globalheader appName="Back to Top Example"></nys-globalheader>
 * <main style="padding: 0 2rem">
 *   <h1>Sample Content on page</h1>
 *   <p>
 *     This is a sample content area used to demonstrate the functionality of
 *     the Back to Top button. In an actual application,
 *     <code>nys-backtotop</code> would not be visible until the user scrolls
 *     down the page.
 *   </p>
 * </main>
 * <footer>
 *   <nys-backtotop visible position="left"></nys-backtotop>
 *   <nys-button prefixIcon="sms" variant="outline" label="Chat with us" size="sm"></nys-button>
 *   <nys-unavfooter></nys-unavfooter>
 * </footer>
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

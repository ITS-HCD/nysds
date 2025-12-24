import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-backtotop.scss?inline";

/**
 * `<nys-backtotop>` renders a button that scrolls the page to the top.
 *
 * Behavior:
 * - Automatically appears after scrolling past 1.5 viewport heights
 *   if page height is at least 4 screens tall.
 * - Adapts its style for mobile screens (circle button on narrow screens).
 * - Can be explicitly made visible via `visible` attribute.
 */
export class NysBacktotop extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String }) position = "right";
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

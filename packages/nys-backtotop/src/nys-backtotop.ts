import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-backtotop.styles";

export class NysBacktotop extends LitElement {
  @property({ type: String }) position = "right";
  @property({ type: Boolean, reflect: true }) visible = false;

  static styles = styles;

  @state() private isMobile = false;
  @state() private forceVisible = false;

  private mediaQuery: MediaQueryList;

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
      .onClick=${this._scrollToTop}
      ?circle=${this.isMobile}
    ></nys-button>`;
  }
}

if (!customElements.get("nys-backtotop")) {
  customElements.define("nys-backtotop", NysBacktotop);
}

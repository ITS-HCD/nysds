import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-backtotop.styles";
import "@nysds/nys-button";

export class NysBacktotop extends LitElement {
  @property({ type: String }) position = "right";

  static styles = styles;

  @state()
  private _visible = false;

  constructor() {
    super();
    this._handleScroll = this._handleScroll.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("scroll", this._handleScroll);
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this._handleScroll);
    super.disconnectedCallback();
  }

  private _handleScroll() {
    const showAfter = window.innerHeight * 2;
    this._visible = window.scrollY > showAfter;
  }
  private _scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  render() {
    const classes = [
      "nys-backtotop",
      this.position,
      this._visible ? "visible" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return html`<nys-button
      id="nys-backtotop"
      prefixIcon="chevron_up"
      variant="outline"
      label="Back To Top"
      class="${classes}"
      .onClick=${this._scrollToTop}
    ></nys-button>`;
  }
}

if (!customElements.get("nys-backtotop")) {
  customElements.define("nys-backtotop", NysBacktotop);
}

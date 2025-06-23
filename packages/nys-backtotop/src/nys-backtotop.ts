import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-backtotop.styles";
import "@nysds/nys-button";

export class NysBacktotop extends LitElement {
  static styles = styles;
  @property({ type: String }) position = "right";

  constructor() {
    super();
  }

  private _scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  render() {
    return html`<nys-button
      id="nys-backtotop"
      prefixIcon="chevron_up"
      variant="outline"
      label="Back To Top"
      class="${this.position}"
      .onClick=${this._scrollToTop}
    ></nys-button>`;
  }
}

if (!customElements.get("nys-backtotop")) {
  customElements.define("nys-backtotop", NysBacktotop);
}

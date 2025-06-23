import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-backtotop.styles";

export class NysBacktotop extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";

  static styles = styles;

  constructor() {
    super();
  }

  render() {
    return html`<div class="nys-backtotop"></div>`;
  }
}

if (!customElements.get("nys-backtotop")) {
  customElements.define("nys-backtotop", NysBacktotop);
}

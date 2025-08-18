import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-divider.styles";

export class NysDivider extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";

  static styles = styles;

  constructor() {
    super();
  }

  render() {
    return html`<div class="nys-divider"></div>`;
  }
}

if (!customElements.get("nys-divider")) {
  customElements.define("nys-divider", NysDivider);
}

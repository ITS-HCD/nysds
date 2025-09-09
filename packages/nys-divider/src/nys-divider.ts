import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-divider.styles";

export class NysDivider extends LitElement {
  @property({ type: Boolean, reflect: true }) inverted = false;

  static styles = styles;

  constructor() {
    super();
  }

  render() {
    return html`<hr class="nys-divider" />`;
  }
}

if (!customElements.get("nys-divider")) {
  customElements.define("nys-divider", NysDivider);
}

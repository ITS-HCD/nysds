import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-badge.styles";

export class NysBadge extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";

  static styles = styles;

  constructor() {
    super();
  }

  render() {
    return html`<div class="nys-badge"></div>`;
  }
}

if (!customElements.get("nys-badge")) {
  customElements.define("nys-badge", NysBadge);
}

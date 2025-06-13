import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-tooltip.styles";

export class NysTooltip extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";

  static styles = styles;

  constructor() {
    super();
  }

  render() {
    return html`<div class="nys-tooltip"></div>`;
  }
}

if (!customElements.get("nys-tooltip")) {
  customElements.define("nys-tooltip", NysTooltip);
}

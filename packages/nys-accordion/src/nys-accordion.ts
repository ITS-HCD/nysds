import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-accordion.styles";

export class NysAccordion extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";

  static styles = styles;

  constructor() {
    super();
  }

  render() {
    return html`<div class="nys-accordion"></div>`;
  }
}

if (!customElements.get("nys-accordion")) {
  customElements.define("nys-accordion", NysAccordion);
}

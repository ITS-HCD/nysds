import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-accordion.styles";

export class NysAccordionGroup extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) heading = "";
  @property({ type: Boolean, reflect: true }) expanded = false;
  @property({ type: Boolean, reflect: true }) bordered = false;

  static styles = styles;

  constructor() {
    super();
  }

  render() {
    return html`<div class="nys-accordion">
      <div class="nys-accordion__heading">
        <p>${this.heading}</p>
        <nys-button></nys-button>
      </div>
      <div class="nys-accordion__content">
        <slot></slot>
      </div>
    </div>`;
  }
}

if (!customElements.get("nys-accordion")) {
  customElements.define("nys-accordion", NysAccordionGroup);
}

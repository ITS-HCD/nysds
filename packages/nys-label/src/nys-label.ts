import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-label.styles";

export class NysLabel extends LitElement {
  @property({ type: String }) for = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) flag = "";
  @property({ type: String }) tooltip = "";
  @property({ type: Boolean, reflect: true }) tooltipInverted = false;

  static styles = styles;

  render() {
    return html`
      <div class="nys-label">
        <div class="nys-label__tooltip-wrapper">
          <label for=${this.for} class="nys-label__label"
            >${this.label}
            ${this.flag === "required"
              ? html`<div class="nys-label__required">*</div>`
              : ""}
            ${this.flag === "optional"
              ? html`<div class="nys-label__optional">(Optional)</div>`
              : ""}</label
          >
          ${this.tooltip
            ? html`<nys-tooltip
                text="${this.tooltip}"
                position="top"
                focusable
                ?inverted=${this.tooltipInverted}
              >
                <div class="nys-label__tooltip-icon">
                  <nys-icon name="info" size="3xl"></nys-icon>
                </div>
              </nys-tooltip>`
            : ""}
        </div>
        <label for=${this.for} class="nys-label__description">
          <slot name="description">${this.description}</slot>
        </label>
      </div>
    `;
  }
}

if (!customElements.get("nys-label")) {
  customElements.define("nys-label", NysLabel);
}

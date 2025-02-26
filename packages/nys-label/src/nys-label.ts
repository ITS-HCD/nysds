import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-label.styles";

export class NysLabel extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) flag = "";

  static styles = styles;

  render() {
    return html`
      <div class="nys-label">
        <label for=${this.id} class="nys-label__label"
          >${this.label}
          ${this.flag === "required"
            ? html`<label class="nys-label__required">*</label>`
            : ""}
          ${this.flag === "optional"
            ? html`<label class="nys-label__optional">(Optional)</label>`
            : ""}</label
        >
        <label for=${this.id} class="nys-label__description">
          <slot name="description">${this.description}</slot>
        </label>
      </div>
    `;
  }
}

if (!customElements.get("nys-label")) {
  customElements.define("nys-label", NysLabel);
}

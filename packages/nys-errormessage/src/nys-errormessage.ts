import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-errormessage.styles";
import "@nysds/nys-icon";

@customElement("nys-errormessage")
export class NysErrorMessage extends LitElement {
  @property({ type: Boolean }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: Boolean, reflect: true }) showDivider = false;

  static styles = styles;

  render() {
    return html`${this.showError && this.errorMessage
      ? html`<div class="nys-errormessage" ?showDivider=${this.showDivider}>
          <nys-icon name="error" size="xl"></nys-icon>
          ${this.errorMessage}
        </div>`
      : ""}`;
  }
}

if (!customElements.get("nys-errormessage")) {
  customElements.define("nys-errormessage", NysErrorMessage);
}

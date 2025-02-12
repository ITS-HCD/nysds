import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-errormessage.styles";

@customElement("nys-errormessage")
export class NysErrorMessage extends LitElement {
  @property({ type: Boolean }) showError = false;
  @property({ type: String }) errorMessage = "";

  static styles = styles;

  render() {
    return html`${this.showError && this.errorMessage
      ? html`<div class="nys-errormessage">
          <nys-icon name="error" size="xl"></nys-icon>
          ${this.errorMessage}
        </div>`
      : ""}`;
  }
}

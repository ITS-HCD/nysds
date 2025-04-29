import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-errormessage.styles";
import "@nysds/nys-icon";

export class NysErrorMessage extends LitElement {
  @property({ type: Boolean }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: Boolean, reflect: true }) showDivider = false;
  private _internals: ElementInternals;

  static styles = styles;

  /********************** Lifecycle updates **********************/
  static formAssociated = true; // allows use of elementInternals' API

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  render() {
    return html`${this.showError
      ? html`<div class="nys-errormessage" ?showDivider=${this.showDivider}>
          <nys-icon name="error" size="2xl"></nys-icon>
          ${this._internals.validationMessage || this.errorMessage}
        </div>`
      : ""}`;
  }
}

if (!customElements.get("nys-errormessage")) {
  customElements.define("nys-errormessage", NysErrorMessage);
}

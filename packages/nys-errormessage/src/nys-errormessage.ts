import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-errormessage.scss?inline";

/**
 * THIS IS A PRIVATE COMPONENT!
 * `<nys-errormessage>` displays an error message for form elements.
 * Can optionally show a divider and supports native form validation messages.
 */
export class NysErrorMessage extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: Boolean }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: Boolean, reflect: true }) showDivider = false;
  private _internals: ElementInternals;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

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

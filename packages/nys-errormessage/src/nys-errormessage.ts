import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-errormessage.scss?inline";

/**
 * **Internal component.** Displays error messages for form validation with icon and ARIA alert role.
 *
 * Used internally by form components. Not intended for direct use. Shows error icon and message
 * when `showError` is true. Integrates with ElementInternals for native form validation messages.
 *
 * @summary Internal error message display with icon and ARIA alert support.
 * @element nys-errormessage
 */
export class NysErrorMessage extends LitElement {
  static styles = unsafeCSS(styles);

  /** Whether to display the error message. */
  @property({ type: Boolean }) showError = false;

  /** Error text to display. Falls back to native validation message if available. */
  @property({ type: String }) errorMessage = "";

  /** Shows a divider line above the error message. */
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
      ? html`<div
          class="nys-errormessage"
          ?showDivider=${this.showDivider}
          role="alert"
        >
          <nys-icon name="error" size="2xl"></nys-icon>
          ${this._internals.validationMessage || this.errorMessage}
        </div>`
      : ""}`;
  }
}

if (!customElements.get("nys-errormessage")) {
  customElements.define("nys-errormessage", NysErrorMessage);
}

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-errormessage.scss?inline";

let errorMessageIdCounter = 0;

/**
 * **Internal component.** Displays error messages for form validation with icon and ARIA alert role.
 *
 * Used internally by form components. Not intended for direct use. Shows error icon and message
 * when `showError` is true. Integrates with ElementInternals for native form validation messages.
 *
 * ## When to use
 * This component should not be used alone; it is built into form fields. Use it to convey
 * clear error messages on form fields when validation fails.
 *
 * Avoid for:
 * - Using the component alone or without a form field
 * - Adding a divider to bordered form fields (like text inputs and selects)
 * - Using generalized error messages
 *
 * ## Divider option
 * Add a divider line with `showDivider` to components that are not bordered. Do not show
 * the divider in bordered form fields (text inputs, selects).
 *
 * ## Accessibility
 * - Uses `role="alert"` with `aria-live="assertive"` for immediate announcement
 * - `aria-atomic="true"` ensures the entire message is read when it changes
 * - Integrates with form validation for semantic error handling
 *
 * @summary Internal error message display with icon and ARIA alert support.
 * @element nys-errormessage
 */
export class NysErrorMessage extends LitElement {
  static styles = unsafeCSS(styles);

  /** The "id" of the error message. */
  @property({ type: String, reflect: true }) id = "";

  /** Whether to display the error message. */
  @property({ type: Boolean }) showError = false;

  /** Error text to display. Falls back to native validation message if available. */
  @property({ type: String }) errorMessage = "";

  /** Shows a divider line above the error message. */
  @property({ type: Boolean, reflect: true }) showDivider = false;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  constructor() {
    super();
    if (!this.id) {
      this.id = `nys-errormessage-${Date.now()}-${errorMessageIdCounter++}`;
    }
  }

  render() {
    return html`<div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      class="nys-errormessage__region"
    >
      ${this.showError
        ? html`<div class="nys-errormessage" ?showDivider=${this.showDivider}>
            <nys-icon name="error" size="2xl"></nys-icon>
            ${this.errorMessage}
          </div>`
        : ""}
    </div>`;
  }
}

if (!customElements.get("nys-errormessage")) {
  customElements.define("nys-errormessage", NysErrorMessage);
}

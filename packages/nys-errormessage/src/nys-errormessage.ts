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
 * @summary Internal error message display with icon and ARIA alert support.
 * @element nys-errormessage
 *
 * Association contract for form controls:
 * Chromium never surfaces `aria-errormessage` for a control inside a shadow root —
 * verified against Blink's AX tree by `scripts/verify-a11y-names.mjs`, and true for the
 * IDREF attribute and for `ariaErrorMessageElements` reflection alike. `aria-describedby`
 * DOES resolve there. Form controls therefore reference this element with BOTH
 * `aria-errormessage` (for engines that honor it) and `aria-describedby` (which is what
 * actually reaches the AX tree today), alongside `aria-invalid` — which Blink requires
 * before it will expose an error relation at all.
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

  // Expose the shadow-encapsulated error text as the host's own accessible name so
  // aria-errormessage references resolve across engines. Guarded for SSR. The inner
  // role="alert" live region is unchanged.
  private _errInternals: ElementInternals | null =
    typeof this.attachInternals === "function" ? this.attachInternals() : null;

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

  updated() {
    if (this._errInternals) {
      this._errInternals.ariaLabel = this.errorMessage || null;
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

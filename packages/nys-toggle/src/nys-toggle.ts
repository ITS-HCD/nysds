import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import "@nys-excelsior/nys-icon";
import styles from "./nys-toggle.styles";
import { FormControlController } from "@nys-excelsior/form-controller";

let toggleIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-toggle")
export class NysToggle extends LitElement {
  // The form controls will automatically append the component's values to the FormData object that’s used to submit the form.
  private readonly formControlController = new FormControlController(this, {
    form: () =>
      this.form
        ? (document.getElementById(this.form) as HTMLFormElement)
        : this.closest("form"),
    value: () => (this.checked ? "on" : undefined),
    defaultValue: () => (this.checked ? "on" : undefined),
    reportValidity: () => this.reportValidity(),
    checkValidity: () => this.checkValidity(),
  });

  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) noIcon = false;
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  private static readonly VALID_SIZES = ["sm", "md"] as const;

  // Private property to store the internal `size` value, restricted to the valid types. Default is "md".
  private _size: (typeof NysToggle.VALID_SIZES)[number] = "md";

  // Getter and setter for the `size` property.
  @property({ reflect: true })
  get size(): (typeof NysToggle.VALID_SIZES)[number] {
    return this._size;
  }

  set size(value: string) {
    // Check if the provided value is in VALID_SIZES. If not, default to "md".
    this._size = NysToggle.VALID_SIZES.includes(
      value as (typeof NysToggle.VALID_SIZES)[number],
    )
      ? (value as (typeof NysToggle.VALID_SIZES)[number])
      : "md";
  }

  // Gets the validity property
  get validity() {
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.validity : { valid: true };
  }

  @property({ type: String }) form = "";

  /******************** Functions ********************/

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-toggle-${Date.now()}-${toggleIdCounter++}`;
    }
  }

  firstUpdated() {
    this.formControlController.updateValidity();
  }

  // Gets the associated form, if one exists.
  getForm(): HTMLFormElement | null {
    return this.formControlController.getForm();
  }

  // Set the form control custom validity message
  setCustomValidity(message: string) {
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.setCustomValidity(message);
      this.formControlController.updateValidity();
    }
  }

  // Check the form control validity
  checkValidity(): boolean {
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.checkValidity() : false;
  }

  // Report the form control validity
  reportValidity(): boolean {
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.reportValidity() : false;
  }

  // Handle invalid event
  private handleInvalid(event: Event) {
    this.formControlController.setValidity(false);
    this.formControlController.emitInvalidEvent(event);
  }

  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(new Event("focus"));
  }

  // Handle blur event
  private _handleBlur() {
    this.dispatchEvent(new Event("blur"));
  }

  private _handleChange(e: Event) {
    const { checked } = e.target as HTMLInputElement;
    this.checked = checked;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );

    // Dispatch formSubmission event for integration with nys-form
    this.dispatchEvent(
      new CustomEvent("nys-formSubmission", {
        detail: { name: [this.name], value: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleKeyDown(event: KeyboardEvent) {
    if (!this.disabled && (event.key === " " || event.key === "Enter")) {
      event.preventDefault();

      // Manually toggle the checked state
      this.checked = !this.checked;

      /* Dispatch a custom event for the toggle action:
       * allows bubbling up so if developers wish to use the toggle state info.
       */
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { checked: this.checked },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  render() {
    return html`
      <label class="nys-toggle">
        <div class="nys-toggle__content">
          <div class="nys-toggle__toggle">
            <input
              id="${this.id}"
              type="checkbox"
              name="${ifDefined(this.name ? this.name : undefined)}"
              .value=${this.value}
              form=${this.form}
              .checked=${this.checked}
              ?disabled=${this.disabled}
              role="switch"
              aria-checked="${this.checked ? "true" : "false"}"
              aria-disabled="${this.disabled ? "true" : "false"}"
              @change=${this._handleChange}
              @focus=${this._handleFocus}
              @blur=${this._handleBlur}
              @keydown=${this._handleKeyDown}
              @invalid=${this.handleInvalid}
            />
            <span class="slider">
              <div class="knob">
                ${this.noIcon
                  ? ""
                  : html`<nys-icon
                      class="toggle-icon"
                      name="${this.checked ? "check" : "close"}"
                    ></nys-icon>`}
              </div>
            </span>
          </div>
          <div class="nys-toggle__text ${this.disabled ? "disabled" : ""}">
            <div class="nys-toggle__label">${this.label}</div>
            <slot name="description">${this.description}</slot>
          </div>
        </div>
      </label>
    `;
  }
}

import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./nys-checkbox.styles";
import "@nysds/nys-icon";
import "./nys-checkboxgroup";

let checkboxIdCounter = 0; // Counter for generating unique IDs

export class NysCheckbox extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: Boolean }) groupExist = false;
  @property({ type: Boolean, reflect: true }) tile = false;
  private static readonly VALID_SIZES = ["sm", "md"] as const;
  private _size: (typeof NysCheckbox.VALID_SIZES)[number] = "md";

  // Getter and setter for the `size` property.
  @property({ reflect: true })
  get size(): (typeof NysCheckbox.VALID_SIZES)[number] {
    return this._size;
  }

  set size(value: string) {
    // Check if the provided value is in VALID_WIDTHS. If not, default to "full".
    this._size = NysCheckbox.VALID_SIZES.includes(
      value as (typeof NysCheckbox.VALID_SIZES)[number],
    )
      ? (value as (typeof NysCheckbox.VALID_SIZES)[number])
      : "md";
  }

  public async getInputElement(): Promise<HTMLInputElement | null> {
    await this.updateComplete; // Wait for the component to finish rendering
    return this.shadowRoot?.querySelector("input") || null;
  }

  static styles = styles;
  private _internals: ElementInternals;

  /********************** Lifecycle updates **********************/
  static formAssociated = true; // allows use of elementInternals' API

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-checkbox-${Date.now()}-${checkboxIdCounter++}`;
    }
    this.addEventListener("invalid", this._handleInvalid);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("invalid", this._handleInvalid);
  }

  firstUpdated() {
    // This ensures our element always participates in the form
    this._setValue();
    this._manageRequire();
  }

  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    this.checked = false;
  }

  /********************** Form Integration **********************/
  private _setValue() {
    if (!this.groupExist) {
      this._internals.setFormValue(this.checked ? this.value : null);
    }
  }

  private _manageRequire() {
    const input = this.shadowRoot?.querySelector("input");
    const message = this.errorMessage || "This field is required";
    if (!input) return;

    if (this.required && !this.checked) {
      this._internals.ariaRequired = "true";
      this._internals.setValidity({ valueMissing: true }, message, input);
    } else {
      this._internals.setValidity({});
    }
  }

  private _setValidityMessage(message: string = "") {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    // Toggle the HTML <div> tag error message
    this.showError = !!message;
    // If user sets errorMessage, this will always override the native validation message
    if (this.errorMessage?.trim() && message !== "") {
      message = this.errorMessage;
    }

    this._internals.setValidity(
      message ? { customError: true } : {},
      message,
      input,
    );
  }

  private _validate() {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    // Get the native validation state
    let message = input.validationMessage;

    this._setValidityMessage(message);
  }

  /********************** Functions **********************/
  // This helper function is called to perform the element's native validation.
  checkValidity(): boolean {
    // If the radiogroup is required but no radio is selected, return false.
    if (this.required && !this.checked) {
      return false;
    }

    // Otherwise, optionally check the native input's validity if available.
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.checkValidity() : true;
  }

  private _handleInvalid(event: Event) {
    event.preventDefault();

    this.showError = true;
    this._validate(); // Make sure validation message appears

    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      // Focus only if this is the first invalid element (top-down approach)
      const form = this._internals.form;
      if (form) {
        const elements = Array.from(form.elements) as Array<
          HTMLElement & { checkValidity?: () => boolean }
        >;
        // Find the first element in the form that is invalid
        const firstInvalidElement = elements.find(
          (element) =>
            typeof element.checkValidity === "function" &&
            !element.checkValidity(),
        );
        if (firstInvalidElement === this) {
          input.focus();
        }
      } else {
        // If not part of a form, simply focus.
        input.focus();
      }
    }
  }

  /******************** Event Handlers ********************/
  private _emitChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: {
          checked: this.checked,
          name: this.name,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Handle checkbox change event
  private _handleChange(e: Event) {
    const { checked } = e.target as HTMLInputElement;
    this.checked = checked;
    if (!this.groupExist) {
      this._internals.setFormValue(this.checked ? this.value : null);
    }
    this._validate();
    this._emitChangeEvent();
  }

  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(new Event("nys-focus"));
  }

  // Handle blur event
  private _handleBlur() {
    this.dispatchEvent(new Event("nys-blur"));
  }

  // Handle keydown for keyboard accessibility
  private async _handleKeydown(e: KeyboardEvent) {
    if (e.code === "Space") {
      e.preventDefault();
      if (!this.disabled) {
        this.checked = !this.checked;
        this._internals.setFormValue(this.checked ? this.value : null);

        // Wait for DOM updates before validating. This is necessary to ensure the native input validation state is updated before this.validate().
        await this.updateComplete;
        this._validate();

        this._emitChangeEvent();
      }
    }
  }

  render() {
    return html`
      <div class="nys-checkbox">
        <label class="nys-checkbox__content">
          <div class="nys-checkbox__checkboxwrapper">
            <input
              id="${this.id}"
              class="nys-checkbox__checkbox"
              type="checkbox"
              name="${ifDefined(this.name ? this.name : undefined)}"
              .checked=${this.checked}
              ?disabled=${this.disabled}
              .value=${this.value}
              ?required="${this.required}"
              aria-checked="${this.checked}"
              aria-disabled="${this.disabled ? "true" : "false"}"
              aria-required="${this.required}"
              @change="${this._handleChange}"
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
              @keydown="${this._handleKeydown}"
            />
            ${this.checked
              ? html`<nys-icon
                  for="${this.id}"
                  name="check"
                  size="${this.size === "md"
                    ? "4xl"
                    : this.size === "sm"
                      ? "2xl"
                      : "xl"}"
                  class="nys-checkbox__icon"
                ></nys-icon>`
              : ""}
          </div>
          ${this.label &&
          html` <div class="nys-checkbox__text">
            <div class="nys-checkbox__requiredwrapper">
              <label for=${this.id} class="nys-checkbox__label"
                >${this.label}</label
              >
              ${this.required
                ? html`<label class="nys-checkbox__required">*</label>`
                : ""}
            </div>
            <label for=${this.id} class="nys-checkbox__description">
              <slot name="description">${this.description}</slot>
            </label>
          </div>`}
        </label>
      </div>
      ${this.parentElement?.tagName.toLowerCase() !== "nys-checkboxgroup"
        ? html`<nys-errormessage
            id="single-error-message"
            ?showError=${this.showError}
            errorMessage=${this._internals.validationMessage ||
            this.errorMessage}
            .showDivider=${!this.tile}
          ></nys-errormessage>`
        : ""}
    `;
  }
}

if (!customElements.get("nys-checkbox")) {
  customElements.define("nys-checkbox", NysCheckbox);
}

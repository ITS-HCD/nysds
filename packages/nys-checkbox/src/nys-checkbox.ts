import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./nys-checkbox.styles";
import "@nysds/nys-icon";
import "./nys-checkboxgroup";

let checkboxIdCounter = 0; // Counter for generating unique IDs

export class NysCheckbox extends LitElement {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean }) showError = false;
  @property({ type: String }) errorMessage = "";
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
  }

  firstUpdated() {
    // This ensures our element always participates in the form
    this._setValue();
    this._manageRequire();
  }

  /********************** Form Integration **********************/
  private _setValue() {
    this._internals.setFormValue(this.checked ? this.value : null);
  }

  private _manageRequire() {
    console.log('inside required ')
    const input = this.shadowRoot?.querySelector("input");
    const message = this.errorMessage
      ? this.errorMessage
      : "This field is required";
    if (!input) return;

    if (this.required && !this.checked) {
      this._internals.ariaRequired = "true";
      this._internals.setValidity({ valueMissing: true }, message, input);
    } else {
      this._internals.setValidity({});
    }
  }

  private _setValidityMessage(message: string = "") {
    console.log("validating")
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    // Toggle the HTML <div> tag error message
    this.showError = !!message;
    // If user sets errorMessage, this will always override the native validation message
    if (this.errorMessage.trim() && message !== "") {
      message = this.errorMessage;
    }

    console.log("the message is: ", message);
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
    console.log("inside validate()", message);

    this._setValidityMessage(message);
  }


  /******************** Event Handlers ********************/
  // Handle checkbox change event
  private _handleChange(e: Event) {
    const { checked } = e.target as HTMLInputElement;
    this.checked = checked;
    console.log("checked: ", this.checked);
    this._internals.setFormValue(this.checked ? this.value : null);
    this._validate();

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(new Event("focus"));
  }

  // Handle blur event
  private _handleBlur() {
    this.dispatchEvent(new Event("blur"));
  }

  // Handle keydown for keyboard accessibility
  private _handleKeydown(e: KeyboardEvent) {
    if (e.code === "Space") {
      e.preventDefault();
      if (!this.disabled) {
        this.checked = !this.checked;
        this._internals.setFormValue(this.checked ? this.value : null);
        this._manageRequire();

        this.dispatchEvent(
          new CustomEvent("change", {
            detail: { checked: this.checked },
            bubbles: true,
            composed: true,
          }),
        );
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
              aria-disabled="${this.disabled}"
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
                    ? "2xl"
                    : this.size === "sm"
                      ? "sm"
                      : "md"}"
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
              ${this.description}
              <slot name="description"></slot>
            </label>
          </div>`}
        </label>
        ${this.showError
          ? html`<div class="nys-checkbox__error">
              <nys-icon name="error" size="xl"></nys-icon>
              ${this._internals.validationMessage || this.errorMessage}
            </div>`
          : ""}
      </div>
    `;
  }
}

if (!customElements.get("nys-checkbox")) {
  customElements.define("nys-checkbox", NysCheckbox);
}

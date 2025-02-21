import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-select.styles";
import "@nysds/nys-icon";
import { NysOption } from "./nys-option";

let selectIdCounter = 0; // Counter for generating unique IDs

export class NysSelect extends LitElement {
  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String, reflect: true }) label = "";
  @property({ type: String, reflect: true }) description = "";
  @property({ type: String, reflect: true }) value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: String, reflect: true }) form = "";
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String, reflect: true }) errorMessage = "";
  private static readonly VALID_WIDTHS = ["sm", "md", "lg", "full"] as const;
  private _width: (typeof NysSelect.VALID_WIDTHS)[number] = "md";

  // Getter and setter for the `width` property.
  @property({ reflect: true })
  get width(): (typeof NysSelect.VALID_WIDTHS)[number] {
    return this._width;
  }

  set width(value: string) {
    // Check if the provided value is in VALID_WIDTHS. If not, default to "full".
    this._width = NysSelect.VALID_WIDTHS.includes(
      value as (typeof NysSelect.VALID_WIDTHS)[number],
    )
      ? (value as (typeof NysSelect.VALID_WIDTHS)[number])
      : "full";
  }

  static styles = styles;

  private _hasUserInteracted = false; // need this flag for "eager mode"
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
      this.id = `nys-select-${Date.now()}-${selectIdCounter++}`;
    }
  }

  firstUpdated() {
    // This ensures our element always participates in the form
    this._setValue();
    this._manageRequire();
  }

  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    this.value = "";
  }

  private _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector(
      'slot:not([name="description"])',
    ) as HTMLSlotElement | null;
    if (slot) {
      const assignedElements = slot.assignedElements({ flatten: true });
      const select = this.shadowRoot?.querySelector("select");

      if (select) {
        // Clone and append slotted elements
        assignedElements.forEach((node) => {
          if (node instanceof NysOption) {
            const optionElement = document.createElement("option");
            optionElement.value = node.value;
            optionElement.textContent =
              node.label || node.textContent?.trim() || "";
            optionElement.disabled = node.disabled;
            optionElement.selected = node.selected;
            select.appendChild(optionElement);
          }
        });
      }
    }
  }
  /********************** Form Integration **********************/
  private _setValue() {
    this._internals.setFormValue(this.value);
  }

  private _manageRequire() {
    const select = this.shadowRoot?.querySelector("select");
    const message = this.errorMessage
      ? this.errorMessage
      : "This field is required";
    if (!select) return;

    if (this.required && !this.value) {
      this._internals.ariaRequired = "true";
      this._internals.setValidity({ valueMissing: true }, message, select);
    } else {
      this._internals.setValidity({});
    }
  }

  private _setValidityMessage(message: string = "") {
    const select = this.shadowRoot?.querySelector("select");
    if (!select) return;

    // Toggle the HTML <div> tag error message
    this.showError = !!message;
    // If user sets errorMessage, this will always override the native validation message
    if (this.errorMessage.trim() && message !== "") {
      message = this.errorMessage;
    }

    this._internals.setValidity(
      message ? { customError: true } : {},
      message,
      select,
    );
  }

  private _validate() {
    const select = this.shadowRoot?.querySelector("select");
    if (!select) return;

    // Get the native validation state
    let message = select.validationMessage;

    this._setValidityMessage(message);
  }

  /******************** Event Handlers ********************/
  // Handle change event to bubble up selected value
  private _handleChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this._internals.setFormValue(this.value);

    // Field is invalid after unfocused, validate aggressively on each change (e.g. Eager mode: a combination of aggressive and lazy.)
    if (this._hasUserInteracted) {
      this._validate();
    }

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Handle input changes by update the value as select changes
  private _handleInput() {
    this.dispatchEvent(new Event("input"));
  }

  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(new Event("focus"));
  }

  // Handle blur event
  private _handleBlur() {
    this._hasUserInteracted = true; // At initial unfocus: if textarea is invalid, start aggressive mode
    this._validate();

    this.dispatchEvent(new Event("blur"));
  }

  // Check if the current value matches any option, and if so, set it as selected
  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    // This ensures the value is set correctly after the component renders
    if (changedProperties.has("value")) {
      const selectElement = this.shadowRoot?.querySelector("select");
      if (selectElement) {
        selectElement.value = this.value;
      }
    }
  }

  render() {
    return html`
      <div class="nys-select">
        ${this.label &&
        html` <div class="nys-select__text">
          <div class="nys-select__requiredwrapper">
            <label for=${this.id} class="nys-select__label"
              >${this.label}</label
            >
            ${this.required
              ? html`<label class="nys-select__required">*</label>`
              : ""}
          </div>
          <div class="nys-select__description">
            ${this.description}
            <slot name="description"></slot>
          </div>
        </div>`}
        <div class="nys-select__selectwrapper">
          <select
            class="nys-select__select"
            name=${this.name}
            id=${this.id}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-disabled="${this.disabled}"
            aria-label="${this.label} ${this.description}"
            .value=${this.value}
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
            @change="${this._handleChange}"
            @input="${this._handleInput}"
          >
            <option hidden disabled selected value></option>
          </select>
          <slot
            @slotchange="${this._handleSlotChange}"
            style="display: none;"
          ></slot>
          <nys-icon
            name="chevron_down"
            size="lg"
            class="nys-select__icon"
          ></nys-icon>
        </div>
        ${this.showError
          ? html`<div class="nys-select__error">
              <nys-icon name="error" size="xl"></nys-icon>
              ${this._internals.validationMessage || this.errorMessage}
            </div>`
          : ""}
      </div>
    `;
  }
}

if (!customElements.get("nys-select")) {
  customElements.define("nys-select", NysSelect);
}

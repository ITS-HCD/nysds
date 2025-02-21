import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-radiobutton.styles";
import "@nysds/nys-icon";

let radiogroupIdCounter = 0; // Counter for generating unique IDs

export class NysRadiogroup extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  // State for storing the selected value for form use
  @state() private selectedValue: string | null = null;
  private static readonly VALID_SIZES = ["sm", "md"] as const;
  private _size: (typeof NysRadiogroup.VALID_SIZES)[number] = "md";

  // Getter and setter for the `size` property.
  @property({ reflect: true })
  get size(): (typeof NysRadiogroup.VALID_SIZES)[number] {
    return this._size;
  }

  set size(value: string) {
    // Check if the provided value is in VALID_WIDTHS. If not, default to "full".
    this._size = NysRadiogroup.VALID_SIZES.includes(
      value as (typeof NysRadiogroup.VALID_SIZES)[number],
    )
      ? (value as (typeof NysRadiogroup.VALID_SIZES)[number])
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
      this.id = `nys-radiogroup-${Date.now()}-${radiogroupIdCounter++}`;
    }
    this.addEventListener("change", this._handleRadioButtonChange);
    this.addEventListener("invalid", this._handleInvalid);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("change", this._handleRadioButtonChange);
    this.removeEventListener("invalid", this._handleInvalid);
  }

  firstUpdated() {
    // Ensure checked state is respected
    this._initializeCheckedState();
    // This ensures our element always participates in the form
    this._setValue();
    this.setRadioButtonRequire();
  }

  updated(changedProperties: Map<string | symbol, unknown>) {
    if (
      changedProperties.has("required") ||
      changedProperties.has("selectedValue")
    ) {
      this._manageRequire();
    }
    if (changedProperties.has("size")) {
      this.updateRadioButtonsSize();
    }
  }

  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton) => {
      (radioButton as any).formResetUpdate();
    });
  }

  /********************** Form Integration **********************/
  private _setValue() {
    this._internals.setFormValue(this.selectedValue);
  }

  // Updates the "require" attribute of a radiobutton underneath a radiogroup to ensure requirement for all radiobutton under the same name/group
  private setRadioButtonRequire() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton, index) => {
      if (this.required && index === 0) {
        radioButton.setAttribute("required", "required");
      }
    });
  }

  private async _manageRequire() {
    const message = this.errorMessage || "This field is required";

    const firstRadio = this.querySelector("nys-radiobutton");
    const firstRadioInput = firstRadio
      ? await (firstRadio as any).getInputElement()
      : null;

    if (this.required && !this.selectedValue) {
      this._internals.setValidity(
        { valueMissing: true },
        message,
        firstRadioInput ? firstRadioInput : this,
      );
    } else {
      this._internals.setValidity({});
      this.showError = false;
    }
  }

  private _initializeCheckedState() {
    const checkedRadio = this.querySelector("nys-radiobutton[checked]");
    if (checkedRadio) {
      this.selectedValue = checkedRadio.getAttribute("value");
      this._internals.setFormValue(this.selectedValue);
    }
  }

  // Updates the size of each radiobutton underneath a radiogroup to ensure size standardization
  private updateRadioButtonsSize() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton) => {
      radioButton.setAttribute("size", this.size);
    });
  }

  // Keeps radiogroup informed of the name and value of its current selected radiobutton
  private _handleRadioButtonChange(event: Event) {
    const customEvent = event as CustomEvent;
    const { value } = customEvent.detail;

    this.selectedValue = value;
    this._internals.setFormValue(this.selectedValue);
  }

  private _handleInvalid() {
    // Check if the radio group is invalid and set `showError` accordingly
    if (this._internals.validity.valueMissing) {
      this.showError = true;
    }
  }

  render() {
    return html` <div role="radiogroup" class="nys-radiogroup">
      ${this.label &&
      html` <div class="nys-radiobutton__text">
        <div class="nys-radiobutton__requiredwrapper">
          <label for=${this.id} class="nys-radiogroup__label"
            >${this.label}</label
          >
          ${this.required
            ? html`<label class="nys-radiobutton__required">*</label>`
            : ""}
        </div>
        <div class="nys-radiogroup__description">
          ${this.description}
          <slot name="description"></slot>
        </div>
      </div>`}
      <div class="nys-radiogroup__content">
        <slot></slot>
      </div>
      ${this.showError
        ? html`<div class="nys-radiobutton__error">
            <nys-icon name="error" size="xl"></nys-icon>
            ${this._internals.validationMessage || this.errorMessage}
          </div>`
        : ""}
    </div>`;
  }
}

if (!customElements.get("nys-radiogroup")) {
  customElements.define("nys-radiogroup", NysRadiogroup);
}

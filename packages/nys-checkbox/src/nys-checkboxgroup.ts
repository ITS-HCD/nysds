import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-checkbox.styles";

let checkboxgroupIdCounter = 0; // Counter for generating unique IDs

export class NysCheckboxgroup extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  private static readonly VALID_SIZES = ["sm", "md"] as const;
  private _size: (typeof NysCheckboxgroup.VALID_SIZES)[number] = "md";

  // Getter and setter for the `size` property.
  @property({ reflect: true })
  get size(): (typeof NysCheckboxgroup.VALID_SIZES)[number] {
    return this._size;
  }

  set size(value: string) {
    // Check if the provided value is in VALID_WIDTHS. If not, default to "full".
    this._size = NysCheckboxgroup.VALID_SIZES.includes(
      value as (typeof NysCheckboxgroup.VALID_SIZES)[number],
    )
      ? (value as (typeof NysCheckboxgroup.VALID_SIZES)[number])
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
      this.id = `nys-checkbox-${Date.now()}-${checkboxgroupIdCounter++}`;
    }
    this.addEventListener("change", this._manageCheckboxRequired);
  }

  updated(changedProperties: Map<string | symbol, unknown>) {
    if (changedProperties.has("required")) {
      this.setupCheckboxRequired();
    }
    if (changedProperties.has("size")) {
      this.updateCheckboxSize();
    }
  }

  /********************** Functions **********************/
  // Initial update on checkbox required attribute
  private async setupCheckboxRequired() {
    const firstCheckbox = this.querySelector("nys-checkbox");
    const message = this.errorMessage || "This field is required";

    const firstCheckboxInput = firstCheckbox
      ? await (firstCheckbox as any).getInputElement()
      : null;

    this._internals.setValidity(
      { valueMissing: true },
      message,
      firstCheckboxInput ? firstCheckboxInput : this,
    );
  }

  // Updates the required attribute of each checkbox in the group
  private async _manageCheckboxRequired() {
    const message = this.errorMessage || "This field is required";
    const firstCheckbox = this.querySelector("nys-checkbox");
    const firstCheckboxInput = firstCheckbox
      ? await (firstCheckbox as any).getInputElement()
      : null;

    let atLeastOneChecked = false;
    const checkboxes = this.querySelectorAll("nys-checkbox");
    // Loop through each child checkbox to see if one is checked.
    checkboxes.forEach((checkbox: any) => {
      if (checkbox.checked) {
        atLeastOneChecked = true;
      }
    });

    if (atLeastOneChecked) {
      this._internals.setValidity({});
      this.showError = false;
    } else {
      this._internals.setValidity(
        { valueMissing: true },
        message,
        firstCheckboxInput ? firstCheckboxInput : this,
      );
      this.showError = true;
    }
  }

  // Updates the size of each checkbox in the group
  private updateCheckboxSize() {
    const checkboxes = this.querySelectorAll("nys-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.setAttribute("size", this.size);
    });
  }

  render() {
    return html` <div class="nys-checkboxgroup">
      ${this.label &&
      html` <div class="nys-checkbox__text">
        <div class="nys-checkbox__requiredwrapper">
          <label for=${this.id} class="nys-checkboxgroup__label"
            >${this.label}</label
          >
          ${this.required
            ? html`<label class="nys-checkbox__required">*</label>`
            : ""}
        </div>
        <label for=${this.id} class="nys-checkboxgroup__description">
          ${this.description}
          <slot name="description"></slot>
        </label>
      </div>`}
      <div class="nys-checkboxgroup__content">
        <slot></slot>
      </div>
      ${this.showError
        ? html`<div class="nys-checkbox__error">
            <nys-icon name="error" size="xl"></nys-icon>
            ${this._internals.validationMessage || this.errorMessage}
          </div>`
        : ""}
    </div>`;
  }
}

if (!customElements.get("nys-checkboxgroup")) {
  customElements.define("nys-checkboxgroup", NysCheckboxgroup);
}

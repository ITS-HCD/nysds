import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-select.styles";
import { classMap } from "lit/directives/class-map.js";
import "../../nys-icon/src/index.ts"; // references: "/packages/nys-icon/dist/nys-icon.es.js";
import { FormControlController } from '../../nys-form/src/form-controller';

let selectIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-select")
export class NysSelect extends LitElement {
  // The form controls will automatically append the component's values to the FormData object that’s used to submit the form.
  private readonly formControlController = new FormControlController(this, {
    value: () => this.value,
    defaultValue: () => "",
    reportValidity: () => this.reportValidity(),
    checkValidity: () => this.checkValidity(),
  });

  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) form = "";
  @property({ type: String }) size = "";
  @property({ type: Boolean }) hasError = false;
  @property({ type: String }) errorMessage = "";

  static styles = styles;

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-select-${Date.now()}-${selectIdCounter++}`;
    }
  }

  // Set the form control custom validity message
  setCustomValidity(message: string) {
    const select = this.shadowRoot?.querySelector("select");
    if (select) {
      select.setCustomValidity(message);
      this.formControlController.updateValidity();
    }
  }

  // Check the form control validity
  checkValidity(): boolean {
    const select = this.shadowRoot?.querySelector("select");
    return select ? select.checkValidity() : false;
  }

  // Report the form control validity
  reportValidity(): boolean {
    const select = this.shadowRoot?.querySelector("select");
    return select ? select.reportValidity() : false;
  }

  // Because slot only projects HTML elements into the shadow DOM, we need to dynamically clone and append slotted elements into the shadow DOM form directly.
  private _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector("slot");
    if (slot) {
      const assignedElements = slot.assignedElements({ flatten: true });
      const select = this.shadowRoot?.querySelector("select");

      if (select) {
        // Append slotted elements directly
        assignedElements.forEach((node) => {
          select.appendChild(node.cloneNode(true));
          node.remove(); // remove from light DOM (this solves duplicated ID issue with slots)
        });
      }
    }
  }

  // Handle select change event
  private _handleChange(e: Event) {
    const option = e.target as HTMLSelectElement;
    this.value = option.value;

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
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

  // This function is executed when loaded so we have at least pass info (even if empty) to the user
  // When called, reveal detail: {name: value} passed the shadowDom into the outer <nys-form> component.
  private _handleSubmitForm() {
    // Dispatch formSubmission event for integration with nys-form
    this.dispatchEvent(
      new CustomEvent("nys-submitForm", {
        detail: { name: [this.name], value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    this._handleSubmitForm();

    const selectClasses = {
      "nys-select__select": true,
      "nys-select__selecterror": this.hasError,
      [this.size]: !!this.size,
    };

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
          <label for=${this.id} class="nys-select__description">
            ${this.description}
          </label>
        </div>`}
        <div class="nys-select__requiredwrapper">
          <div class="nys-select__selectwrapper">
            <select
              class="${classMap(selectClasses)}"
              name=${this.name}
              id=${this.id}
              ?disabled=${this.disabled}
              ?required=${this.required}
              aria-disabled="${this.disabled}"
              aria-label="${this.label} ${this.description}"
              value=${this.value}
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
              @change="${this._handleChange}"
            >
              <option hidden disabled selected value></option>
            </select>
            <slot
              @slotchange="${this._handleSlotChange}"
              style="display: none;"
            ></slot>
            <slot name="icon">
              <nys-icon
                name="chevron_down"
                size="lg"
                class="nys-select__icon"
              ></nys-icon>
            </slot>
          </div>
          ${this.required && !this.label
            ? html`<label class="nys-select__required">*</label>`
            : ""}
        </div>
        ${this.hasError && this.errorMessage
          ? html`<div class="nys-select__error">
              <nys-icon name="error"></nys-icon>
              ${this.errorMessage}
            </div>`
          : ""}
      </div>
    `;
  }
}

import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-select.styles";
import { classMap } from "lit/directives/class-map.js";
import "@nys-excelsior/nys-icon";
import { FormControlController } from "@nys-excelsior/form-controller";
let selectIdCounter = 0; // Counter for generating unique IDs
import { NysOption } from "./nys-option";

@customElement("nys-select")
export class NysSelect extends LitElement {
  // The form controls will automatically append the component's values to the FormData object that’s used to submit the form.
  private readonly formControlController = new FormControlController(this, {
    form: () =>
      this.form
        ? (document.getElementById(this.form) as HTMLFormElement)
        : this.closest("form"),
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

  @state() private _options: {
    value: string;
    label: string;
    disabled: boolean;
    selected: boolean;
  }[] = [];

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
      const nodes = slot.assignedElements({ flatten: true });
      this._options = nodes
        .filter((node) => node instanceof NysOption)
        .map((node) => {
          const nysOption = node as NysOption;
          const label = nysOption.label || nysOption.textContent?.trim() || "";
          return {
            value: nysOption.value,
            label: label,
            disabled: nysOption.disabled,
            selected: nysOption.selected,
          };
        });
    }
    this.requestUpdate(); // Request an update after processing options
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

  render() {
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
            >
              <option hidden disabled selected value></option>
              ${this._options.map(
                (opt) =>
                  html`<option
                    value=${opt.value}
                    label=${opt.label}
                    ?disabled=${opt.disabled}
                    ?hidden=${opt.selected}
                    ?selected=${opt.selected}
                  >
                    ${opt.label}
                  </option>`,
              )}
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

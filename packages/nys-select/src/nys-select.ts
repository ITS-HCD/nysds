import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-select.styles";

@customElement("nys-select")
export class NysSelect extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) form = "";
  @property({ type: Boolean }) clearable = false; //TODO: implement on refactor once figma is completed and icons can be pulled in
  @property({ type: String }) size = "";
  @property({ type: String }) options: Array<string> = [];
  @property({ type: String }) errorMessage = "";

  static styles = styles;

  // Handle input event to check pattern validity
  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const checkValidity = input.checkValidity();
    this.dispatchEvent(
      new CustomEvent("nys-checkValidity", {
        detail: { checkValidity },
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
        ${
          this.label &&
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
          </div>`
        }    
      <div class="nys-select__requiredwrapper">
        <div class="nys-select__selectwrapper">
          <select
            class="nys-select__select ${this.size}"
            name=${this.name}
            id=${this.id}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-disabled="${this.disabled}"
            aria-label="${this.label} ${this.description}"
            .value=${this.value}
            placeholder=${this.placeholder}
            @input=${this._handleInput}
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
          >
            <option hidden disabled selected value>${this.placeholder}</option>
            ${this.options.map((opt) => html` <option value=${opt}>${opt}</option> `)}
          </select>
          <slot name="icon">
            <nys-icon name="arrow-down" size="lg" class="nys-select__icon"></nys-icon>
          </slot>
        </div>
        ${
          this.required && !this.label
            ? html`<label class="nys-select__required">*</label>`
            : ""
        }
      </div>
      ${
        this.errorMessage &&
        html`<div class="nys-select__error">
          <nys-icon name="error"></nys-icon>
          ${this.errorMessage}
        </div>`
      }
      </div>
</div>
  `;
  }
}

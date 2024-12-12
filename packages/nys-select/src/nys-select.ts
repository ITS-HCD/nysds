import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-select.styles";
import { classMap } from "lit/directives/class-map.js";

@customElement("nys-select")
export class NysSelect extends LitElement {
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

  @state() private _options: { value: string; text: string }[] = [];

  static styles = styles;

  private _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector("slot");
    if (slot) {
      const nodes = slot.assignedElements({ flatten: true });
      this._options = nodes
        .filter((node) => node instanceof HTMLOptionElement)
        .map((node) => ({
          value: (node as HTMLOptionElement).value,
          text: node.textContent || "",
        }));
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
                (opt) => html`<option value=${opt.value}>${opt.text}</option>`,
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

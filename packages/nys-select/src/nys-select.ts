import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-select.styles";
import "@nys-excelsior/nys-icon";
import { NysOption } from "./nys-option";

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
  @property({ type: Boolean }) showError = false;
  @property({ type: String }) errorMessage = "";
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
            <slot name="description"></slot>
          </label>
        </div>`}
        <div class="nys-select__requiredwrapper">
          <div class="nys-select__selectwrapper">
            <select
              class=${this.showError
                ? "nys-select__select nys-select__selecterror"
                : "nys-select__select"}
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
          ${this.required && !this.label
            ? html`<label class="nys-select__required">*</label>`
            : ""}
        </div>
        ${this.showError && this.errorMessage
          ? html`<div class="nys-select__error">
              <nys-icon name="error" size="xl"></nys-icon>
              ${this.errorMessage}
            </div>`
          : ""}
      </div>
    `;
  }
}

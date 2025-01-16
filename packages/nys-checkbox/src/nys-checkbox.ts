import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./nys-checkbox.styles"; // Assuming styles are in a separate file
import "@nys-excelsior/nys-icon"; // references: "/packages/nys-icon/dist/nys-icon.es.js";

let checkboxIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-checkbox")
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

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-checkbox-${Date.now()}-${checkboxIdCounter++}`;
    }
  }

  // Handle checkbox change event
  private _handleChange(e: Event) {
    const { checked } = e.target as HTMLInputElement;
    this.checked = checked;
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
                  size="2xl"
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
        ${this.showError && this.errorMessage
          ? html`<div class="nys-checkbox__error">
              <nys-icon name="error" size="xl"></nys-icon>
              ${this.errorMessage}
            </div>`
          : ""}
      </div>
    `;
  }
}

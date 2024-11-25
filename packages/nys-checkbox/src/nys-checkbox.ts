import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./nys-checkbox.styles"; // Assuming styles are in a separate file

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

  @state()
  private _disabled = false;

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
      <label class="nys-checkbox">
        <input
          id="${this.id}"
          class="nys-checkbox__input"
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
        <div class="nys-checkbox__text">
          <div class="nys-checkbox__label">${this.label}</div>
          ${this.description
            ? html`<div class="nys-checkbox__description">
                ${this.description}
              </div>`
            : ""}
        </div>
      </label>
    `;
  }
}

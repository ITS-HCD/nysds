import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("nys-checkbox")
export class NysCheckbox extends LitElement {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) id = ""; // ID to link label and input
  @property({ type: String }) name = ""; // Name for form submission
  @property({ type: String }) value = ""; // Value for form submission

  static styles = css`
    :host {
      display: block;
    }

    .nys-checkbox {
      display: flex;
      align-items: center;
    }

    .nys-checkbox__input {
      appearance: none;
      width: 16px;
      height: 16px;
      border: 2px solid var(--checkbox-border-color, darkgray);
      background-color: white;
      cursor: pointer;
      margin-right: 8px;
    }

    .nys-checkbox__input:checked {
      background-color: var(--checkbox-checked-bg-color, #154973);
      border: none;
    }

    .nys-checkbox__input:disabled {
      background-color: var(--checkbox-disabled-bg-color, lightgray);
      border-color: var(--checkbox-disabled-border-color, gray);
      cursor: not-allowed;
    }

    .nys-checkbox__label {
      font-family: Arial, sans-serif;
      margin-left: 8px;
    }

    .nys-checkbox__description {
      font-size: 12px;
      color: gray;
    }
  `;

  private _handleChange(e: Event) {
    const { checked } = e.target as HTMLInputElement;
    this.checked = checked;
    this.dispatchEvent(new Event("change"));
  }

  private _handleFocus() {
    this.dispatchEvent(new Event("focus"));
  }

  private _handleBlur() {
    this.dispatchEvent(new Event("blur"));
  }

  render() {
    return html`
      <div class="nys-checkbox">
        <input
          id="${this.id}"
          class="nys-checkbox__input"
          type="checkbox"
          name="${this.name}"
          .checked="${this.checked}"
          ?disabled="${this.disabled}"
          .value="${this.value}"
          aria-checked="${this.checked}"
          aria-disabled="${this.disabled}"
          @change="${this._handleChange}"
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
        />
        <label for="${this.id}" class="nys-checkbox__label">
          ${this.label}
          ${this.description
            ? html`<div class="nys-checkbox__description">
                ${this.description}
              </div>`
            : ""}
        </label>
      </div>
    `;
  }
}

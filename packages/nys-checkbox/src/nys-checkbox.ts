import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("nys-checkbox")
export class NysCheckbox extends LitElement {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) indeterminate = false;
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";

  static styles = css`
    :host {
      display: block;
    }

    .checkbox-container {
      display: flex;
      align-items: center;
    }

    input[type="checkbox"] {
      appearance: none;
      width: 16px;
      height: 16px;
      border: 2px solid var(--checkbox-border-color, darkgray);
      background-color: white;
      cursor: pointer;
      margin-right: 8px;
    }

    input[type="checkbox"]:checked {
      background-color: var(--checkbox-checked-bg-color, #154973);
      border: none;
    }

    input[type="checkbox"]:indeterminate {
      background-color: var(--checkbox-checked-bg-color, #154973);
      border: none;
    }

    input[type="checkbox"]:disabled {
      background-color: var(--checkbox-disabled-bg-color, lightgray);
      border-color: var(--checkbox-disabled-border-color, gray);
      cursor: not-allowed;
    }

    label {
      font-family: Arial, sans-serif;
      margin-left: 8px;
    }

    .description {
      font-size: 12px;
      color: gray;
    }
  `;

  private _handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    this.dispatchEvent(
      new CustomEvent("change", { detail: { checked: this.checked } }),
    );
  }

  render() {
    return html`
      <div class="checkbox-container">
        <input
          type="checkbox"
          .checked="${this.checked}"
          ?disabled="${this.disabled}"
          aria-checked="${this.indeterminate ? "mixed" : this.checked}"
          aria-disabled="${this.disabled}"
          @change="${this._handleChange}"
        />
        <label>
          ${this.label}
          ${this.description
            ? html`<div class="description">${this.description}</div>`
            : ""}
        </label>
      </div>
    `;
  }
}

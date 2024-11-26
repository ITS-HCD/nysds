import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-select.styles";

@customElement("nys-select")
export class NysSelect extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = null;
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) placeholder = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) form = "";
  @property({ type: Boolean }) clearable = false;
  @property({ type: String }) size = "";
  @property({ type: Boolean }) multiple = false;
  @property({ type: Array }) options = [];
  @property({ type: String }) warningMessage = "";

  constructor() {
    super();
  }

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

  render() {
    return html`
      <div class="nys-select">
        ${
          (this.label || this.description) &&
          html`<div class="nys-select__text">
            <label for=${this.id} class="nys-select__label"
              >${this.label}</label
            >
            <label for=${this.id} class="nys-select__description"
              >${this.description}</label
            >
          </div>`
        }
          <select
            class="nys-select__select ${this.size}"
            name=${this.name}
            id=${this.id}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-disabled="${this.disabled}"
            aria-label="${this.label} ${this.description}"
            placeholder=${this.placeholder}
            @input=${this._handleInput}
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
          >
            <option hidden disabled selected value>${this.placeholder}</option>
            <option disabled value>${this.label}</option>
            ${this.options.map((opt) => html` <option value=${opt}>${opt}</option> `)}
          </select>
          ${
            this.warningMessage &&
            html`<div class="nys-select__error">
              <nys-icon name="warning"></nys-icon>
              ${this.warningMessage}
            </div>`
          }
        </div>
      </div>
    `;
  }
}

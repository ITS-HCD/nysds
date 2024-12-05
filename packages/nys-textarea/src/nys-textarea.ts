import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-textarea.styles";

@customElement("nys-textarea")
export class NysTextarea extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) form = "";
  @property({ type: Number }) maxlength = null;
  @property({ type: String }) size = "";
  @property({ type: String }) errorMessage = "";

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
      <label class="nys-textarea">
        ${this.label &&
        html` <div class="nys-textarea__text">
          <div class="nys-textarea__requiredwrapper">
            <div class="nys-textarea__label">${this.label}</div>
            ${this.required
              ? html`<div class="nys-textarea__required">*</div>`
              : ""}
          </div>
          <slot class="nys-textarea__description"> ${this.description} </slot>
        </div>`}
        <div class="nys-textarea__requiredwrapper">
          <textarea
            class="nys-textarea__input ${this.size}"
            name=${this.name}
            id=${this.id}
            ?disabled=${this.disabled}
            ?required=${this.required}
            ?readonly=${this.readonly}
            aria-disabled="${this.disabled}"
            aria-label="${this.label} ${this.description}"
            .value=${this.value}
            placeholder=${this.placeholder}
            maxlength=${this.maxlength}
            form=${this.form}
            @input=${this._handleInput}
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
          ></textarea>
          ${this.required && !this.label
            ? html`<div class="nys-textarea__required">*</div>`
            : ""}
        </div>
        ${this.errorMessage &&
        html`<div class="nys-select__error">
          <nys-icon name="error"></nys-icon>
          ${this.errorMessage}
        </div>`}
      </label>
    `;
  }
}

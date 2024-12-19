import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-textarea.styles";
import "../../nys-icon/src/index.ts"; // references: "/packages/nys-icon/dist/nys-icon.es.js";

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
  @property({ type: Number }) rows = null;
  private static readonly VALID_RESIZE = ["vertical", "none"] as const;

  // Use `typeof` to dynamically infer the allowed types
  private _resize: (typeof NysTextarea.VALID_RESIZE)[number] = "vertical";

  // Getter and setter for the `resize` property
  @property({ reflect: true })
  get resize(): (typeof NysTextarea.VALID_RESIZE)[number] {
    return this._resize;
  }

  set resize(value: string) {
    this._resize = NysTextarea.VALID_RESIZE.includes(
      value as (typeof NysTextarea.VALID_RESIZE)[number],
    )
      ? (value as (typeof NysTextarea.VALID_RESIZE)[number])
      : "vertical";
  }
  @property({ type: Boolean }) showError = false;
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
          <slot class="nys-textarea__description" name="description">
            ${this.description}
          </slot>
        </div>`}
        <div class="nys-textarea__requiredwrapper">
          <textarea
            class="nys-textarea__textarea ${this.size} ${this.resize}"
            name=${this.name}
            id=${this.id}
            ?disabled=${this.disabled}
            ?required=${this.required}
            ?readonly=${this.readonly}
            aria-disabled="${this.disabled}"
            .value=${this.value}
            placeholder=${this.placeholder}
            maxlength=${this.maxlength}
            rows=${this.rows}
            form=${this.form}
            @input=${this._handleInput}
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
          ></textarea>
          ${this.required && !this.label
            ? html`<div class="nys-textarea__required">*</div>`
            : ""}
        </div>
        ${this.showError && this.errorMessage
          ? html`<div class="nys-textarea__error">
              <nys-icon name="error"></nys-icon>
              ${this.errorMessage}
            </div>`
          : ""}
      </label>
    `;
  }
}

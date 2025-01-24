import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-textarea.styles";
import "@nys-excelsior/nys-icon";

@customElement("nys-textarea")
export class NysTextarea extends LitElement {
  @property({ type: String, attribute: "id" }) id = "";
  @property({ type: String, attribute: "name" }) name = "";
  @property({ type: String, attribute: "label" }) label = "";
  @property({ type: String, attribute: "description" }) description = "";
  @property({ type: String, attribute: "placeholder" }) placeholder = "";
  @property({ type: String, attribute: "value" }) value = "";
  @property({ type: Boolean, attribute: "disabled" }) disabled = false;
  @property({ type: Boolean, attribute: "readonly" }) readonly = false;
  @property({ type: Boolean, attribute: "required" }) required = false;
  @property({ type: String, attribute: "form" }) form = "";
  @property({ type: Number, attribute: "maxlength" }) maxlength = null;
  private static readonly VALID_WIDTHS = ["sm", "md", "lg", "full"] as const;
  @property({ reflect: true })
  width: (typeof NysTextarea.VALID_WIDTHS)[number] = "full";

  // Ensure the "width" property is valid after updates
  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("width")) {
      this.width = NysTextarea.VALID_WIDTHS.includes(this.width)
        ? this.width
        : "full";
    }
  }
  @property({ type: Number, attribute: "rows" }) rows = null;
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
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String, attribute: "error-message" }) errorMessage = "";

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
            <label for=${this.id} class="nys-textarea__label"
              >${this.label}</label
            >
            ${this.required
              ? html`<label class="nys-textarea__required">*</label>`
              : ""}
          </div>
          <div class="nys-textarea__description">
            ${this.description}
            <slot name="description"> </slot>
          </div>
        </div>`}
        <textarea
          class="nys-textarea__textarea ${this.resize}"
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
        ${this.showError && this.errorMessage
          ? html`<div class="nys-textarea__error">
              <nys-icon name="error" size="xl"></nys-icon>
              ${this.errorMessage}
            </div>`
          : ""}
      </label>
    `;
  }
}

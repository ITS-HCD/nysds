import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-textarea.styles";
import "@nys-excelsior/nys-icon";

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
  private static readonly VALID_WIDTHS = ["sm", "md", "lg", "full"] as const;
  @property({ reflect: true })
  width: (typeof NysTextarea.VALID_WIDTHS)[number] = "full";
  @property({ type: Number }) rows = 4;
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
  @property({ type: String }) errorMessage = "";

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("width")) {
      this.width = NysTextarea.VALID_WIDTHS.includes(this.width)
        ? this.width
        : "full";
    }
    if (changedProperties.has("rows")) {
      this.rows = this.rows ?? 4;
    }
  }

  static styles = styles;

  // Handle input event to check pattern validity
  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
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

  // Handle change event to bubble up selected value
  private _handleChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleSelect(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleSelectionChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this.dispatchEvent(
      new CustomEvent("selectionchange", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
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
          .rows=${this.rows}
          form=${this.form}
          @input=${this._handleInput}
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
          @change="${this._handleChange}"
          @select="${this._handleSelect}"
          @selectionchange="${this._handleSelectionChange}"
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

if (!customElements.get("nys-textarea")) {
  customElements.define("nys-textarea", NysTextarea);
}

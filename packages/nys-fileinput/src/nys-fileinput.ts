import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-fileinput.styles";
import "@nys-excelsior/nys-icon"; // references: "/packages/nys-icon/dist/nys-icon.es.js";
import "@nys-excelsior/nys-button";

export class NysFileinput extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) form = "";
  private static readonly VALID_WIDTHS = ["sm", "md", "lg", "full"] as const;
  @property({ reflect: true })
  width: (typeof NysFileinput.VALID_WIDTHS)[number] = "full";

  // Ensure the "width" property is valid after updates
  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("width")) {
      this.width = NysFileinput.VALID_WIDTHS.includes(this.width)
        ? this.width
        : "full";
    }
  }

  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";

  constructor() {
    super();
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

  // Handle change event
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

  render() {
    return html`
      <div class="nys-fileinput">
        ${this.label &&
        html` <div class="nys-fileinput__text">
          <div class="nys-fileinput__requiredwrapper">
            <label for=${this.id} class="nys-fileinput__label"
              >${this.label}</label
            >
            ${this.required
              ? html`<label class="nys-fileinput__required">*</label>`
              : ""}
          </div>

          <div class="nys-fileinput__description">
            ${this.description}
            <slot name="description"> </slot>
          </div>
        </div>`}
        <label class="nys-fileinput__input">
          ${this.width !== "sm"
            ? html`<nys-button
                class="nys-fileinput__iconbutton"
                prefixIcon="upload_file"
                label=${this.width !== "md" ? "Select File" : ""}
                size="sm"
              >
              </nys-button>`
            : null}
          <label class="nys-fileinput__filetext">No File Chosen</label>
          <input
            type="file"
            name=${this.name}
            id=${this.id}
            ?disabled=${this.disabled}
            ?required=${this.required}
            ?readonly=${this.readonly}
            aria-disabled="${this.disabled}"
            aria-label="${this.label} ${this.description}"
            .value=${this.value}
            form=${this.form}
            @input=${this._handleInput}
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
            @change="${this._handleChange}"
          />
        </label>
        ${this.showError && this.errorMessage
          ? html`<div class="nys-fileinput__error">
              <nys-icon name="error" size="xl"></nys-icon>
              ${this.errorMessage}
            </div>`
          : ""}
      </div>
    `;
  }
}

if (!customElements.get("nys-fileinput")) {
  customElements.define("nys-fileinput", NysFileinput);
}

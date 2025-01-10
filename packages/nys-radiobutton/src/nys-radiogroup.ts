import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-radiobutton.styles";
import "@nys-excelsior/nys-icon"; // references: "/packages/nys-icon/dist/nys-icon.es.js";

let radiogroupIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-radiogroup")
export class NysRadiogroup extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  private static readonly VALID_SIZES = ["sm", "md"] as const;
  private _size: (typeof NysRadiogroup.VALID_SIZES)[number] = "md";

  // Getter and setter for the `width` property.
  @property({ reflect: true })
  get size(): (typeof NysRadiogroup.VALID_SIZES)[number] {
    return this._size;
  }

  set size(value: string) {
    // Check if the provided value is in VALID_WIDTHS. If not, default to "full".
    this._size = NysRadiogroup.VALID_SIZES.includes(
      value as (typeof NysRadiogroup.VALID_SIZES)[number],
    )
      ? (value as (typeof NysRadiogroup.VALID_SIZES)[number])
      : "md";
  }

  static styles = styles;

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-radiogroup-${Date.now()}-${radiogroupIdCounter++}`;
    }
    this.updateRadioButtonsSize();

  }

  private updateRadioButtonsSize() {
    const radioButtons = this.querySelectorAll('nys-radiobutton');
    radioButtons.forEach((radioButton) => {
      radioButton.setAttribute('size', this.size);
    });
  }

  render() {
    return html` <div role="radiogroup" class="nys-radiogroup">
      ${this.label &&
      html` <div class="nys-radiobutton__text">
        <div class="nys-radiobutton__requiredwrapper">
          <label for=${this.id} class="nys-radiobutton__label"
            >${this.label}</label
          >
          ${this.required
            ? html`<label class="nys-radiobutton__required">*</label>`
            : ""}
        </div>
        <label for=${this.id} class="nys-radiobutton__description">
          ${this.description}
          <slot name="description"></slot>
        </label>
      </div>`}
      <div class="nys-radiogroup__content">
        <slot></slot>
      </div>
      ${this.showError && this.errorMessage
        ? html`<div class="nys-radiobutton__error">
            <nys-icon name="error" size="xl"></nys-icon>
            ${this.errorMessage}
          </div>`
        : ""}
    </div>`;
  }
}

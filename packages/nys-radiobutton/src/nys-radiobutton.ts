import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./nys-radiobutton.styles"; // Assuming styles are in a separate file

let radiobuttonIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-radiobutton")
export class NysRadiobutton extends LitElement {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: String }) value = "";
  private static readonly VALID_SIZES = ["sm", "md"] as const;
  private _size: (typeof NysRadiobutton.VALID_SIZES)[number] = "md";
  // Getter and setter for the `width` property.
  @property({ reflect: true })
  get size(): (typeof NysRadiobutton.VALID_SIZES)[number] {
    return this._size;
  }

  set size(value: string) {
    // Check if the provided value is in VALID_WIDTHS. If not, default to "full".
    this._size = NysRadiobutton.VALID_SIZES.includes(
      value as (typeof NysRadiobutton.VALID_SIZES)[number],
    )
      ? (value as (typeof NysRadiobutton.VALID_SIZES)[number])
      : "md";
  }

  static buttonGroup: Record<string, NysRadiobutton> = {};

  static styles = styles;

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-radiobutton-${Date.now()}-${radiobuttonIdCounter++}`;
    }

    // If this button is initially checked, set it as the current button in its group
    if (this.checked) {
      if (NysRadiobutton.buttonGroup[this.name]) {
        NysRadiobutton.buttonGroup[this.name].checked = false;
        NysRadiobutton.buttonGroup[this.name].requestUpdate();
      }
      NysRadiobutton.buttonGroup[this.name] = this;
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    // Watch for changes to `checked` and ensure only one is selected per group
    if (changedProperties.has("checked") && this.checked) {
      if (NysRadiobutton.buttonGroup[this.name] !== this) {
        if (NysRadiobutton.buttonGroup[this.name]) {
          NysRadiobutton.buttonGroup[this.name].checked = false;
          NysRadiobutton.buttonGroup[this.name].requestUpdate();
        }
        NysRadiobutton.buttonGroup[this.name] = this;
      }
    }
  }

  // Handle radiobutton change event
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
      if (!this.disabled && !this.checked) {
        if (NysRadiobutton.buttonGroup[this.name]) {
          NysRadiobutton.buttonGroup[this.name].checked = false;
          NysRadiobutton.buttonGroup[this.name].requestUpdate();
        }

        NysRadiobutton.buttonGroup[this.name] = this;
        this.checked = true;
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

  // Handle unselection of other options in group
  private _handleClick() {
    if (!this.checked) {
      if (NysRadiobutton.buttonGroup[this.name]) {
        NysRadiobutton.buttonGroup[this.name].checked = false;
        NysRadiobutton.buttonGroup[this.name].requestUpdate();
      }

      NysRadiobutton.buttonGroup[this.name] = this;
      this.checked = true;
    }
  }

  render() {
    return html`
      <div class="nys-radiobutton">
        <input
          id="${this.id}"
          class="nys-radiobutton__radio"
          type="radio"
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
          @click="${this._handleClick}"
        />
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
      </div>
    `;
  }
}

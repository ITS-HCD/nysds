import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./nys-radiobutton.styles"; // Assuming styles are in a separate file
import "./nys-radiogroup";

let radiobuttonIdCounter = 0; // Counter for generating unique IDs

export class NysRadiobutton extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) inverted = false;
  @property({ type: String, reflect: true }) form: string | null = null;
  private static readonly VALID_SIZES = ["sm", "md"] as const;
  private _size: (typeof NysRadiobutton.VALID_SIZES)[number] = "md";

  // Getter and setter for the `size` property.
  @property({ reflect: true })
  get size(): (typeof NysRadiobutton.VALID_SIZES)[number] {
    return this._size;
  }

  set size(value: string) {
    // Check if the provided value is in VALID_SIZES. If not, default to "md".
    this._size = NysRadiobutton.VALID_SIZES.includes(
      value as (typeof NysRadiobutton.VALID_SIZES)[number],
    )
      ? (value as (typeof NysRadiobutton.VALID_SIZES)[number])
      : "md";
  }
  @property({ type: Boolean, reflect: true }) tile = false;

  public async getInputElement(): Promise<HTMLInputElement | null> {
    await this.updateComplete; // Wait for the component to finish rendering
    return this.shadowRoot?.querySelector("input") || null;
  }

  // This callback is automatically called when the parent form is reset.
  public formResetUpdate() {
    this.checked = false;
  }

  static buttonGroup: Record<string, NysRadiobutton> = {};

  static styles = styles;

  /********************** Lifecycle updates **********************/
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

    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
    this.addEventListener("click", this._handleChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener("focus", this._handleFocus);
    this.removeEventListener("blur", this._handleBlur);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    // When "checked" changes, update the internals.
    if (changedProperties.has("checked")) {
      // Ensure only one radiobutton per group is checked.
      if (this.checked && NysRadiobutton.buttonGroup[this.name] !== this) {
        if (NysRadiobutton.buttonGroup[this.name]) {
          NysRadiobutton.buttonGroup[this.name].checked = false;
          NysRadiobutton.buttonGroup[this.name].requestUpdate();
        }
        NysRadiobutton.buttonGroup[this.name] = this;
      }
    }
  }

  /********************** Functions **********************/
  // This helper function is called to perform the element's native validation.
  checkValidity(): boolean {
    // If the radiogroup is required but no radio is selected, return false.
    if (this.required && !this.checked) {
      return false;
    }

    // Otherwise, optionally check the native input's validity if available.
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.checkValidity() : true;
  }

  /******************** Event Handlers ********************/
  private _emitChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: {
          id: this.id,
          checked: this.checked,
          name: this.name,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Handle radiobutton change event & unselection of other options in group
  private _handleChange() {
    // Remove active-focus so the focus outline doesn't linger
    // when the user selects a choice, since form focus is no longer needed
    this.classList.remove("active-focus");

    if (!this.checked && !this.disabled) {
      if (NysRadiobutton.buttonGroup[this.name]) {
        NysRadiobutton.buttonGroup[this.name].checked = false;
        NysRadiobutton.buttonGroup[this.name].requestUpdate();
      }

      NysRadiobutton.buttonGroup[this.name] = this;
      this.checked = true;

      // Dispatch a change event with the name and value
      this._emitChangeEvent();
    }
  }

  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(new Event("nys-focus"));
  }

  // Handle blur event
  private _handleBlur() {
    this.classList.remove("active-focus"); // removing this classList so the focus ring for handleInvalid() at radiogroup level will disappear
    this.dispatchEvent(new Event("nys-blur"));
  }

  private _callInputHandling() {
    if (this.disabled) return;

    // Find the hidden input and trigger a click to toggle selection
    const input = this.shadowRoot?.querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;

    if (input) {
      input.focus();
      input.click();
    }
  }

  render() {
    return html`
      <input
        type="radio"
        name="${ifDefined(this.name ? this.name : undefined)}"
        .checked=${this.checked}
        ?disabled=${this.disabled}
        .value=${this.value}
        ?required="${this.required}"
        form=${ifDefined(this.form || undefined)}
        @change="${this._handleChange}"
        hidden
        aria-hidden="true"
      />
      <div
        class="nys-radiobutton"
        @click="${this._callInputHandling}"
        aria-label=${this.label}
      >
        <span class="nys-radiobutton__radio"></span>
        ${this.label &&
        html`<nys-label
          label=${this.label}
          description=${ifDefined(this.description || undefined)}
          ?inverted=${this.inverted}
        >
          <slot name="description" slot="description">${this.description}</slot>
        </nys-label> `}
      </div>
    `;
  }
}

if (!customElements.get("nys-radiobutton")) {
  customElements.define("nys-radiobutton", NysRadiobutton);
}

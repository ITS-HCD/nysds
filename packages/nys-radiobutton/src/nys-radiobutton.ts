import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import "./nys-radiogroup";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-radiobutton.scss?inline";

let radiobuttonIdCounter = 0;

/**
 * A radio button for single selection within a `nys-radiogroup`. Only one radio with the same `name` can be selected.
 *
 * Use within `nys-radiogroup` for 2-6 mutually exclusive options. For 7+ options, use `nys-select`.
 * For multiple selections, use `nys-checkbox`.
 *
 * @summary Radio button for single selection from mutually exclusive options.
 * @element nys-radiobutton
 *
 * @slot description - Custom HTML description content.
 *
 * @fires nys-change - Fired when selection changes. Detail: `{id, checked, name, value}`.
 * @fires nys-focus - Fired when radio gains focus.
 * @fires nys-blur - Fired when radio loses focus.
 *
 * @example Radio group
 * ```html
 * <nys-radiogroup label="Select borough" required>
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 */

export class NysRadiobutton extends LitElement {
  static styles = unsafeCSS(styles);

  /** Whether this radio is selected. Only one per group can be checked. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Prevents interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Marks group as required. Set on radiogroup, not individual radios. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Visible label text. Required for accessibility. */
  @property({ type: String }) label = "";

  /** Helper text below label. Use slot for custom HTML. */
  @property({ type: String }) description = "";

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Group name. Radios with same name are mutually exclusive. */
  @property({ type: String, reflect: true }) name = "";

  /** Value submitted when this radio is selected. */
  @property({ type: String }) value = "";

  /** Adjusts colors for dark backgrounds. */
  @property({ type: Boolean, reflect: true }) inverted = false;

  /** Form `id` to associate with. */
  @property({ type: String, reflect: true }) form: string | null = null;

  /**
   * Radio size: `sm` (24px) or `md` (32px, default).
   * @default "md"
   */
  @property({ type: String, reflect: true }) size: "sm" | "md" = "md";

  /** Renders as tile with larger clickable area. */
  @property({ type: Boolean, reflect: true }) tile = false;
  @property({ type: Boolean, reflect: true }) other = false;
  @property({ type: Boolean }) showOtherError = false;

  private _hasUserInteracted = false; // need this flag for "eager mode"

  public async getInputElement(): Promise<HTMLInputElement | null> {
    await this.updateComplete; // Wait for the component to finish rendering
    return this.shadowRoot?.querySelector("input") || null;
  }

  // This callback is automatically called when the parent form is reset.
  public formResetUpdate() {
    this.checked = false;
  }

  static buttonGroup: Record<string, NysRadiobutton> = {};

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
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

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  // This helper function is called to perform the element's native validation.
  checkValidity(): boolean {
    // If the radiogroup is required but no radio is selected, return false.
    if (this.required && !this.checked) {
      return false;
    }

    if (this.other && this.checked) {
      const isInvalid = this.value.trim() === "";
      if (isInvalid) {
        return false;
      }
    }

    // Otherwise, optionally check the native input's validity if available.
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.checkValidity() : true;
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

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

    this.showOtherError = false;

    if (!this.checked && !this.disabled) {
      if (NysRadiobutton.buttonGroup[this.name]) {
        NysRadiobutton.buttonGroup[this.name].checked = false;
        NysRadiobutton.buttonGroup[this.name].requestUpdate();
      }
      NysRadiobutton.buttonGroup[this.name] = this;

      this.checked = true;
      this._validateOtherAndEmitError();
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

    this._hasUserInteracted = true;
    this._validateOtherAndEmitError();
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

  private _handleTextInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let newValue = input.value;
    this.value = newValue;

    if (this._hasUserInteracted) {
      this._validateOtherAndEmitError();
    }

    this._emitChangeEvent();
  }

  private _validateOtherAndEmitError() {
    if (!this.other) return;

    if (!this.checked) {
      this.showOtherError = false;
      return;
    }

    if (!this._hasUserInteracted) {
      this.showOtherError = false;
      return;
    }

    const isInvalid = this.value.trim() === "";
    this.showOtherError = isInvalid;

    if (isInvalid) {
      this.dispatchEvent(
        new CustomEvent("nys-error", {
          detail: {
            id: this.id,
            name: this.name,
            type: "other",
            message: "Please enter a value for this option.",
            sourceRadio: this,
          },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private _handleOtherKeydown(e: KeyboardEvent) {
    if(e.key == "Space" || e.key === " ") {
      e.stopPropagation();
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
        <div class="nys-radiobutton__main-container">
          <span class="nys-radiobutton__radio"></span>
          ${(this.label || this.other) &&
          html`<nys-label
            label="${this.other ? "Other" : this.label}"
            description=${ifDefined(this.description || undefined)}
            ?inverted=${this.inverted}
          >
            <slot name="description" slot="description"
              >${this.description}</slot
            >
          </nys-label> `}
        </div>
        <div class="nys-radiobutton__other-container">
          ${this.other && this.checked
            ? html`
                <nys-textinput
                  .value=${this.value}
                  id=${"radiobutton-other-" + this.id}
                  @nys-input=${this._handleTextInput}
                  @nys-blur=${this._handleBlur}
                  @keydown=${this._handleOtherKeydown}
                  aria-invalid=${this.showOtherError ? "true" : "false"}
                  width="md"
                ></nys-textinput>
              `
            : ""}
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-radiobutton")) {
  customElements.define("nys-radiobutton", NysRadiobutton);
}

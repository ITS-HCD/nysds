import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import "./nys-checkboxgroup";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-checkbox.scss?inline";

let checkboxIdCounter = 0;

/**
 * A checkbox input for binary choices or multi-select lists. Can be used standalone or in a `nys-checkboxgroup`.
 * Form-associated with validation via ElementInternals.
 *
 * Use for binary decisions (agree/disagree) or selecting multiple options from a list.
 * For single selection from 2-6 options, use `nys-radiobutton`. For immediate state changes, use `nys-toggle`.
 *
 * @summary Checkbox for binary choices or multi-select options.
 * @element nys-checkbox
 *
 * @slot description - Custom HTML description content.
 *
 * @fires nys-change - Fired when checked state changes. Detail: `{id, checked, name, value}`.
 * @fires nys-focus - Fired when checkbox gains focus.
 * @fires nys-blur - Fired when checkbox loses focus.
 *
 * @example Single checkbox
 * ```html
 * <nys-checkbox label="I agree to the terms" name="terms" required></nys-checkbox>
 * ```
 *
 * @example Checkbox group
 * ```html
 * <nys-checkboxgroup label="Select landmarks">
 *   <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
 *   <nys-checkbox name="landmarks" value="niagara" label="Niagara Falls"></nys-checkbox>
 * </nys-checkboxgroup>
 * ```
 */

export class NysCheckbox extends LitElement {
  static styles = unsafeCSS(styles);

  /** Whether checkbox is checked. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Prevents interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Marks as required. Validates that checkbox is checked. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Visible label text. Required for accessibility. */
  @property({ type: String }) label = "";

  /** Helper text below label. Use slot for custom HTML. */
  @property({ type: String }) description = "";

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Name for form submission. Use same name for grouped checkboxes. */
  @property({ type: String, reflect: true }) name = "";

  /** Value submitted when checked. */
  @property({ type: String }) value = "";

  /** Form `id` to associate with when checkbox is outside form element. */
  @property({ type: String, reflect: true }) form: string | null = null;

  /** Shows error message when true. */
  @property({ type: Boolean, reflect: true }) showError = false;

  /** Error message text. Shown only when `showError` is true. */
  @property({ type: String }) errorMessage = "";

  /** Internal: Set by parent checkboxgroup. Do not set manually. */
  @property({ type: Boolean }) groupExist = false;

  /** Renders as tile with larger clickable area. Apply to group for consistency. */
  @property({ type: Boolean, reflect: true }) tile = false;

  /** Adjusts colors for dark backgrounds. */
  @property({ type: Boolean, reflect: true }) inverted = false;

  /** Tooltip text shown on hover/focus of info icon. */
  @property({ type: String }) tooltip = "";

  /**
   * Checkbox size: `sm` (24px) or `md` (32px, default).
   * @default "md"
   */
  @property({ type: String, reflect: true }) size: "sm" | "md" = "md";
  @property({ type: Boolean, reflect: true }) other = false;
  @property({ type: Boolean }) showOtherError = false;
  @state() private isMobile = window.innerWidth < 480;

  private _hasUserInteracted = false; // need this flag for "eager mode"
  private _textInputHasFocus = false;

  public async getInputElement(): Promise<HTMLInputElement | null> {
    await this.updateComplete; // Wait for the component to finish rendering
    return this.shadowRoot?.querySelector("input") || null;
  }

  private _internals: ElementInternals;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  static formAssociated = true; // allows use of elementInternals' API

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-checkbox-${Date.now()}-${checkboxIdCounter++}`;
    }
    this.addEventListener("invalid", this._handleInvalid);
    window.addEventListener("resize", this._handleResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("invalid", this._handleInvalid);
    window.removeEventListener("resize", this._handleResize);
  }

  firstUpdated() {
    // This ensures our element always participates in the form
    this._setValue();
    this._manageRequire();
    this._manageLabelClick();
  }

  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */

  private _setValue() {
    if (!this.groupExist) {
      this._internals.setFormValue(this.checked ? this.value : null);
    }
  }

  private _manageRequire() {
    const input = this.shadowRoot?.querySelector("input");
    const message = this.errorMessage || "This field is required";
    if (!input) return;

    if (this.required && !this.checked) {
      this._internals.ariaRequired = "true";
      this._internals.setValidity({ valueMissing: true }, message, input);
    } else {
      this._internals.setValidity({});
    }
  }

  private _setValidityMessage(message: string = "") {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    // Toggle the HTML <div> tag error message
    this.showError = !!message;
    // If user sets errorMessage, this will always override the native validation message
    if (this.errorMessage?.trim() && message !== "") {
      message = this.errorMessage;
    }

    this._internals.setValidity(
      message ? { customError: true } : {},
      message,
      input,
    );
  }

  private _validate() {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    // Get the native validation state
    const validity = input.validity;
    let message = "";

    if (validity.valueMissing) {
      message = "This field is required";
    }

    this._setValidityMessage(message);
  }

  // Called automatically when the parent form is reset
  formResetCallback() {
    this.checked = false;
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

    // Otherwise, optionally check the native input's validity if available.
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.checkValidity() : true;
  }

  private _handleInvalid(event: Event) {
    event.preventDefault();

    this.showError = true;
    this._validate(); // Make sure validation message appears

    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      // Focus only if this is the first invalid element (top-down approach)
      const form = this._internals.form;
      if (form) {
        const elements = Array.from(form.elements) as Array<
          HTMLElement & { checkValidity?: () => boolean }
        >;
        // Find the first element in the form that is invalid
        const firstInvalidElement = elements.find(
          (element) =>
            typeof element.checkValidity === "function" &&
            !element.checkValidity(),
        );
        if (firstInvalidElement === this) {
          input.focus();
        }
      } else {
        // If not part of a form, simply focus.
        input.focus();
      }
    }
  }

  private _manageLabelClick = () => {
    const main = this.shadowRoot?.querySelector(
      ".nys-checkbox__main-container",
    );
    const inputEl = this.shadowRoot?.querySelector("input");

    if (!main || !inputEl) return;

    main.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      // Let native input behavior work. Avoid double toggling the checkbox.
      if (target.tagName.toLowerCase() === "input") return;

      if (!this.disabled) {
        inputEl.click();
        inputEl.focus();
      }
    });
  };

  get _hasDescription() {
    // This accounts for both description prop or slotted content. Used for styling text alignment.
    const slot = this.querySelector('[slot="description"]');
    return !!this.description || !!slot;
  }

  private _handleResize = () => {
    this.isMobile = window.innerWidth < 480;
  };

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

  // Handle checkbox change event
  private _handleChange(e: Event) {
    const { checked } = e.target as HTMLInputElement;
    const wasChecked = this.checked;

    this.checked = checked;

    if (this.other && wasChecked) {
      this.showOtherError = false;
      this._hasUserInteracted = false;
      this._dispatchClearError();
    }

    if (!this.groupExist) {
      this._internals.setFormValue(this.checked ? this.value : null);
    }
    this._validate();
    this._emitChangeEvent();
  }

  private _handleFocus() {
    this.dispatchEvent(new Event("nys-focus"));
  }

  private _handleBlur() {
    setTimeout(() => {
      if (!this._textInputHasFocus && this.other && this.checked) {
        this._hasUserInteracted = true;
        this._validateOtherAndEmitError();
      }
    }, 50);
  }

  private _handleTextInputBlur() {
    this._textInputHasFocus = false;
    this._hasUserInteracted = true;
    this._validateOtherAndEmitError();
  }

  private _handleTextInputFocus() {
    this._textInputHasFocus = true;
  }

  private async _handleKeydown(e: KeyboardEvent) {
    if (e.code === "Space") {
      e.preventDefault();
      if (!this.disabled) {
        this.checked = !this.checked;
        this._internals.setFormValue(this.checked ? this.value : null);

        // Wait for DOM updates before validating. This is necessary to ensure the native input validation state is updated before this.validate().
        await this.updateComplete;
        this._validate();

        this._emitChangeEvent();
      }
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

    // Prevent early validation of the "other" input before the user interacts with it.
    // Additionally clear validation when "other" checkbox is unchecked
    if (!this.checked || !this._hasUserInteracted) {
      this.showOtherError = false;

      this._dispatchClearError();
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
            sourceCheckbox: this,
          },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private _dispatchClearError() {
    this.dispatchEvent(
      new CustomEvent("nys-error-clear", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div class="nys-checkbox">
        <div
          class="nys-checkbox__main-container ${this._hasDescription
            ? "has-description"
            : ""}"
        >
          <div class="nys-checkbox__checkbox-wrapper">
            <input
              id=${this.id + "--native"}
              class="nys-checkbox__checkbox"
              type="checkbox"
              name="${ifDefined(this.name ? this.name : undefined)}"
              .checked=${this.checked}
              ?disabled=${this.disabled}
              .value=${this.value}
              ?required="${this.required}"
              form=${ifDefined(this.form || undefined)}
              aria-checked="${this.checked}"
              aria-disabled="${this.disabled ? "true" : "false"}"
              aria-required="${this.required}"
              aria-describedby="group-info"
              @change="${this._handleChange}"
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
              @keydown="${this._handleKeydown}"
              aria-label="${this.label}"
            />
            ${this.checked
              ? html`<nys-icon
                  name="check"
                  size="${this.size === "md"
                    ? "4xl"
                    : this.size === "sm"
                      ? "2xl"
                      : "4xl"}"
                  class="nys-checkbox__icon"
                ></nys-icon>`
              : ""}
          </div>
          ${(this.label || this.other) &&
          html`
            <nys-label
              tooltip=${this.tooltip}
              for=${this.id + "--native"}
              label="${this.label || (this.other ? "Other" : "")}"
              description=${ifDefined(this.description || undefined)}
              flag=${ifDefined(this.required ? "required" : undefined)}
              ?inverted=${this.inverted}
            >
              <slot name="description" slot="description"
                >${this.description}</slot
              >
            </nys-label>
          `}
        </div>
        <div class="nys-checkbox__other-container">
          ${this.other && this.checked
            ? html`
                <nys-textinput
                  .value=${this.value}
                  id=${"radiobutton-other-" + this.id}
                  @nys-input=${this._handleTextInput}
                  @nys-blur=${this._handleTextInputBlur}
                  @nys-focus=${this._handleTextInputFocus}
                  aria-invalid=${this.showOtherError ? "true" : "false"}
                  width=${this.isMobile ? "full" : "md"}
                ></nys-textinput>
              `
            : ""}
        </div>
      </div>
      ${this.parentElement?.tagName.toLowerCase() !== "nys-checkboxgroup"
        ? html`<nys-errormessage
            id="single-error-message"
            ?showError=${this.showError}
            errorMessage=${this._internals.validationMessage ||
            this.errorMessage}
            .showDivider=${!this.tile}
          ></nys-errormessage>`
        : ""}
    `;
  }
}

if (!customElements.get("nys-checkbox")) {
  customElements.define("nys-checkbox", NysCheckbox);
}

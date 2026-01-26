import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import "./nys-checkboxgroup";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-checkbox.scss?inline";

let checkboxIdCounter = 0; // Counter for generating unique IDs

/**
 * `<nys-checkbox>` is a form-associated, accessible checkbox component.
 * Supports validation, labels, error messages, and keyboard interaction.
 * Can exist independently or inside a `<nys-checkboxgroup>`.
 */
export class NysCheckbox extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) value = "";
  @property({ type: String, reflect: true }) form: string | null = null;
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: Boolean }) groupExist = false;
  @property({ type: Boolean, reflect: true }) tile = false;
  @property({ type: Boolean, reflect: true }) inverted = false;
  @property({ type: String }) tooltip = "";
  @property({ type: String, reflect: true }) size: "sm" | "md" = "md";
  @property({ type: Boolean, reflect: true }) other = false;
  @property({ type: Boolean }) showOtherError = false;

  private _hasUserInteracted = false; // need this flag for "eager mode"

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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("invalid", this._handleInvalid);
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
    const labelEl = this.shadowRoot?.querySelector("nys-label");
    const inputEl = this.shadowRoot?.querySelector("input");

    if (labelEl && inputEl) {
      labelEl.addEventListener("click", () => inputEl.click());
    }
  };

  get _hasDescription() {
    // This accounts for both description prop or slotted content. Used for styling text alignment.
    const slot = this.querySelector('[slot="description"]');
    return !!this.description || !!slot;
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

  // Handle checkbox change event
  private _handleChange(e: Event) {
    const { checked } = e.target as HTMLInputElement;
    this.checked = checked;
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
    this.dispatchEvent(new Event("nys-blur"));
    this._hasUserInteracted = true;
    this._validateOtherAndEmitError();
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

  render() {
    return html`
      <label class="nys-checkbox">
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
              label="${this.other ? "Other" : this.label}"
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
                  @nys-blur=${this._handleBlur}
                  aria-invalid=${this.showOtherError ? "true" : "false"}
                  width="md"
                ></nys-textinput>
              `
            : ""}
        </div>
      </label>
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

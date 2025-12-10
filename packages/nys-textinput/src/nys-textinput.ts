import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-textinput.scss?inline";

let textinputIdCounter = 0; // Counter for generating unique IDs

export class NysTextinput extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String, reflect: true }) type:
    | "email"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "url" = "text";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) optional = false;
  @property({ type: String }) tooltip = "";
  @property({ type: String, reflect: true }) form: string | null = null;
  @property({ type: String }) pattern = "";
  @property({ type: Number }) maxlength: number | null = null;
  @property({ type: String, reflect: true }) width:
    | "sm"
    | "md"
    | "lg"
    | "full" = "full";
  @property({ type: Number }) step: number | null = null;
  @property({ type: Number }) min: number | null = null;
  @property({ type: Number }) max: number | null = null;
  @property({ type: Boolean, reflect: true }) inverted = false;
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";
  @state() private showPassword = false;

  private _originalErrorMessage = "";
  private _hasUserInteracted = false; // need this flag for "eager mode"
  private _internals: ElementInternals;

  private _maskPatterns: Record<string, string> = {
    tel: "(___) ___-____",
  };

  // Lifecycle updates
  static formAssociated = true; // allows use of elementInternals' API

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-textinput-${Date.now()}-${textinputIdCounter++}`;
    }

    this._originalErrorMessage = this.errorMessage ?? "";
    this.addEventListener("invalid", this._handleInvalid);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("invalid", this._handleInvalid);
  }

  firstUpdated() {
    // This ensures our element always participates in the form
    this._setValue();
  }

  // Ensure the "width" property is valid after updates
  async updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("disabled")) {
      this._validateButtonSlot("startButton");
      this._validateButtonSlot("endButton");
    }

    if (changedProperties.has("type")) {
      const mask = this._maskPatterns[this.type];
      const input = this.shadowRoot?.querySelector("input");

      if (input) {
        if (mask) {
          input.maxLength = mask.length;
          this._updateOverlay(input.value, mask);
        } else {
          input.removeAttribute("maxLength");
          const overlay = this.shadowRoot?.querySelector(
            ".nys-textinput__mask-overlay",
          );
          if (overlay) overlay.textContent = "";
        }
      }
    }
  }

  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    this.value = "";
  }

  // Form Integration
  private _setValue() {
    this._internals.setFormValue(this.value);
    this._manageRequire(); // Update validation
  }

  private _manageRequire() {
    const input = this.shadowRoot?.querySelector("input");

    if (!input) return;

    const message = this.errorMessage || "This field is required";
    const isInvalid =
      this.required && (!this.value || this.value?.trim() === ""); // Check for blank as well

    if (isInvalid) {
      this._internals.ariaRequired = "true";
      this._internals.setValidity({ valueMissing: true }, message, input);
    } else {
      this._internals.ariaRequired = "false";
      this._internals.setValidity({});
      this._hasUserInteracted = false; // Reset eager/lazy checking
    }
  }

  private _setValidityMessage(message: string = "") {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    // Always show the visual error if there is a message
    this.showError = !!message;

    // Use the original errorMessage if defined, or keep the message from validation
    if (this._originalErrorMessage?.trim() && message !== "") {
      this.errorMessage = this._originalErrorMessage;
    } else {
      this.errorMessage = message;
    }

    const validityState = message ? { customError: true } : {};
    this._internals.setValidity(validityState, this.errorMessage, input);
  }

  private _validate() {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    // Get the native validation state
    const validity = input.validity;
    let message = "";

    // Check each possible validation error
    if (validity.valueMissing) {
      message = "This field is required";
    } else if (validity.typeMismatch) {
      message = "Invalid format for this type";
    } else if (validity.patternMismatch) {
      message = "Invalid format";
    } else if (validity.tooShort) {
      message = `Value is too short. Minimum length is ${input.minLength}`;
    } else if (validity.tooLong) {
      message = `Value is too long. Maximum length is ${input.maxLength}`;
    } else if (validity.rangeUnderflow) {
      message = `Value must be at least ${input.min}`;
    } else if (validity.rangeOverflow) {
      message = `Value must be at most ${input.max}`;
    } else if (validity.stepMismatch) {
      message = "Invalid step value";
    } else {
      message = input.validationMessage;
    }

    this._setValidityMessage(message);
  }

  // Functions
  // This helper function is called to perform the element's native validation.
  checkValidity(): boolean {
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.checkValidity() : true;
  }

  private _handleInvalid(event: Event) {
    event.preventDefault();
    this._hasUserInteracted = true; // Start aggressive mode due to form submission
    this._validate();

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

  private _togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private _updateOverlay(value: string, mask: string) {
    const overlay = this.shadowRoot?.querySelector(
      ".nys-textinput__mask-overlay",
    ) as HTMLElement;
    if (!overlay) return;

    const filled = value;
    const remaining = mask.slice(filled.length);
    overlay.textContent = filled + remaining;
  }

  private _applyMask(value: string, mask: string): string {
    const digits = value.replace(/\D/g, "");
    let result = "";

    // Special handling for tel to avoid trailing dash
    if (this.type === "tel") {
      if (digits.length > 0) {
        result = "(" + digits.substring(0, 3);
      }
      if (digits.length >= 4) {
        result += ") " + digits.substring(3, 6);
      }
      // Add dash if there are more than 6 digits
      if (digits.length > 6) {
        result += "-" + digits.substring(6, 10);
      }
      return result;
    }

    // Default generic masking logic
    let digitIndex = 0;
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === "_" || mask[i].match(/[d9]/i)) {
        if (digitIndex < digits.length) {
          result += digits[digitIndex++];
        } else {
          break;
        }
      } else {
        result += mask[i]; // keep formatting symbols
      }
    }

    return result;
  }

  // Event Handlers
  // Handle input event to check pattern validity
  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let newValue = input.value;

    const mask = this._maskPatterns[this.type];
    if (mask) {
      newValue = this._applyMask(newValue, mask);
      input.value = newValue; // ensure input reflects masked value
      this._updateOverlay(newValue, mask);
    }

    this.value = newValue;
    this._internals.setFormValue(this.value);

    // Field is invalid after unfocused, validate aggressively on each input (e.g. Eager mode: a combination of aggressive and lazy.)
    if (this._hasUserInteracted) {
      this._validate();
    }

    this.dispatchEvent(
      new CustomEvent("nys-input", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(new Event("nys-focus"));
  }

  // Handle blur event
  private _handleBlur() {
    if (!this._hasUserInteracted) {
      this._hasUserInteracted = true; // At initial unfocus: if input is invalid, start aggressive mode
    }
    this._validate();

    this.dispatchEvent(new Event("nys-blur"));
  }

  private _validateButtonSlot(slotName: string) {
    const slot = this.shadowRoot?.querySelector(
      'slot[name="' + slotName + '"]',
    ) as HTMLSlotElement;
    const container = this.shadowRoot?.querySelector(
      ".nys-textinput__buttoncontainer",
    );

    if (!slot || !container) return;

    const assignedElements = slot.assignedElements();

    let foundValidButton = false;

    assignedElements.forEach((node) => {
      const isNysButton =
        node instanceof HTMLElement &&
        node.tagName.toLowerCase() === "nys-button";

      if (isNysButton && !foundValidButton) {
        // First valid nys-button found
        foundValidButton = true;
        node.setAttribute("size", "sm");
        node.setAttribute("variant", "primary");
        //set button to be disabled if the input is disabled
        if (this.disabled) {
          node.setAttribute("disabled", "true");
        } else {
          node.removeAttribute("disabled");
        }
      } else {
        console.warn(
          "The '" +
            slotName +
            "' slot only accepts a single <nys-button> element. Removing invalid or extra node:",
          node,
        );
        node.remove();
      }
    });

    if (slotName === "startButton") {
      container.classList.toggle("has-start-button", foundValidButton);
    } else if (slotName === "endButton") {
      container.classList.toggle("has-end-button", foundValidButton);
    }
  }

  render() {
    return html`
      <div class="nys-textinput">
        <nys-label
          for=${this.id + "--native"}
          label=${this.label}
          description=${this.description}
          flag=${this.required ? "required" : this.optional ? "optional" : ""}
          tooltip=${this.tooltip}
          ?inverted=${this.inverted}
        >
          <slot name="description" slot="description">${this.description}</slot>
        </nys-label>
        <div class="nys-textinput__buttoncontainer">
          <slot
            name="startButton"
            @slotchange=${() => this._validateButtonSlot("startButton")}
          ></slot>
          <div class="nys-textinput__container">
            <span class="nys-textinput__mask-overlay"></span>
            <input
              class="nys-textinput__input"
              type=${this.type === "password"
                ? this.showPassword
                  ? "text"
                  : "password"
                : this.type}
              name=${this.name}
              id=${this.id + "--native"}
              ?disabled=${this.disabled}
              ?required=${this.required}
              ?readonly=${this.readonly}
              aria-required=${this.required}
              aria-disabled="${this.disabled}"
              aria-label="${[this.label, this.description]
                .filter(Boolean)
                .join(" ")}"
              .value=${this.value}
              placeholder=${ifDefined(
                this.placeholder ? this.placeholder : undefined,
              )}
              pattern=${ifDefined(this.pattern ? this.pattern : undefined)}
              min=${ifDefined(this.min !== null ? this.min : undefined)}
              maxlength=${ifDefined(
                this.maxlength !== null ? this.maxlength : undefined,
              )}
              step=${ifDefined(this.step !== null ? this.step : undefined)}
              max=${ifDefined(this.max !== null ? this.max : undefined)}
              form=${ifDefined(this.form || undefined)}
              @input=${this._handleInput}
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
            />
            ${this.type === "password"
              ? html` <nys-button
                  class="eye-icon"
                  id="password-toggle"
                  suffixIcon="slotted"
                  ariaLabel="password toggle"
                  variant="ghost"
                  size="sm"
                  @nys-click=${() =>
                    !this.disabled && this._togglePasswordVisibility()}
                >
                  <nys-icon
                    slot="suffix-icon"
                    size="2xl"
                    name=${this.showPassword ? "visibility_off" : "visibility"}
                  ></nys-icon>
                </nys-button>`
              : ""}
          </div>
          <slot
            name="endButton"
            @slotchange=${() => this._validateButtonSlot("endButton")}
          ></slot>
        </div>
        <nys-errormessage
          ?showError=${this.showError}
          errorMessage=${this.errorMessage}
        ></nys-errormessage>
      </div>
    `;
  }
}

if (!customElements.get("nys-textinput")) {
  customElements.define("nys-textinput", NysTextinput);
}

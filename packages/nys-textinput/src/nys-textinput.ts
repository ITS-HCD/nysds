import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-textinput.styles";
import { ifDefined } from "lit/directives/if-defined.js";
import "@nysds/nys-icon";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

let textinputIdCounter = 0; // Counter for generating unique IDs

export class NysTextinput extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
  private static readonly VALID_TYPES = [
    "email",
    "number",
    "password",
    "search",
    "tel",
    "text",
    "url",
  ] as const;

  // Use `typeof` to dynamically infer the allowed types
  private _type: (typeof NysTextinput.VALID_TYPES)[number] = "text";

  // Getter and setter for the `type` property
  @property({ reflect: true })
  get type(): (typeof NysTextinput.VALID_TYPES)[number] {
    return this._type;
  }

  set type(value: string) {
    this._type = NysTextinput.VALID_TYPES.includes(
      value as (typeof NysTextinput.VALID_TYPES)[number],
    )
      ? (value as (typeof NysTextinput.VALID_TYPES)[number])
      : "text";
  }
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) optional = false;
  @property({ type: String }) form = "";
  @property({ type: String }) pattern = "";
  @property({ type: Number }) maxlength = null;
  private static readonly VALID_WIDTHS = ["sm", "md", "lg", "full"] as const;
  @property({ reflect: true })
  width: (typeof NysTextinput.VALID_WIDTHS)[number] = "full";

  // Ensure the "width" property is valid after updates
  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("width")) {
      this.width = NysTextinput.VALID_WIDTHS.includes(this.width)
        ? this.width
        : "full";
    }
  }

  @property({ type: Number }) step = null;
  @property({ type: Number }) min = null;
  @property({ type: Number }) max = null;
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";

  static styles = styles;

  private _hasUserInteracted = false; // need this flag for "eager mode"
  private _internals: ElementInternals;

  /********************** Lifecycle updates **********************/
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
  }

  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    this.value = "";
  }

  /********************** Form Integration **********************/
  private _setValue() {
    this._internals.setFormValue(this.value);
    this._manageRequire(); // Update validation
  }

  private _manageRequire() {
    const input = this.shadowRoot?.querySelector("input");

    if (!input) return;

    const message = this.errorMessage || "This field is required";
    const isInvalid =
      this.required && (!this.value || this.value.trim() === ""); // Check for blank as well

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

    // Toggle the HTML <div> tag error message
    this.showError = !!message;
    // If user sets errorMessage, this will always override the native validation message
    if (this.errorMessage.trim() && message !== "") {
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

  /********************** Functions **********************/
  private _handleInvalid() {
    this._hasUserInteracted = true; // Start aggressive mode due to form submission
    this._validate();
  }

  /******************** Event Handlers ********************/
  // Handle input event to check pattern validity
  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this._internals.setFormValue(this.value);

    // Field is invalid after unfocused, validate aggressively on each input (e.g. Eager mode: a combination of aggressive and lazy.)
    if (this._hasUserInteracted) {
      this._validate();
    }

    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: this.value },
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
    if (!this._hasUserInteracted) {
      this._hasUserInteracted = true; // At initial unfocus: if input is invalid, start aggressive mode
    }
    this._validate();

    this.dispatchEvent(new Event("blur"));
  }

  // Handle change event
  private _handleChange() {
    this.dispatchEvent(new Event("change"));
  }

  render() {
    return html`
      <div class="nys-textinput">
        <nys-label
          label=${this.label}
          description=${this.description}
          flag=${this.required ? "required" : this.optional ? "optional" : ""}
        >
          <slot name="description" slot="description">${this.description}</slot>
        </nys-label>
        <input
          class="nys-textinput__input"
          type=${this.type}
          name=${this.name}
          id=${this.id}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          aria-disabled="${this.disabled}"
          aria-label="${this.label} ${this.description}"
          .value=${this.value}
          placeholder=${ifDefined(
            this.placeholder ? this.placeholder : undefined,
          )}
          pattern=${ifDefined(this.pattern ? this.pattern : undefined)}
          min=${ifDefined(this.min !== "" ? this.min : undefined)}
          maxlength=${ifDefined(
            this.maxlength !== "" ? this.maxlength : undefined,
          )}
          step=${ifDefined(this.step !== "" ? this.step : undefined)}
          max=${ifDefined(this.max !== "" ? this.max : undefined)}
          form=${ifDefined(this.form ? this.form : undefined)}
          @input=${this._handleInput}
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
          @change="${this._handleChange}"
        />
        <nys-errormessage
          ?showError=${this.showError}
          errorMessage=${this._internals.validationMessage || this.errorMessage}
        ></nys-errormessage>
      </div>
    `;
  }
}

if (!customElements.get("nys-textinput")) {
  customElements.define("nys-textinput", NysTextinput);
}

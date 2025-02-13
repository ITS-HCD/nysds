import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-textinput.styles";
import { ifDefined } from "lit/directives/if-defined.js";
import "@nys-excelsior/nys-icon"; // references: "/packages/nys-icon/dist/nys-icon.es.js";

let textinputIdCounter = 0; // Counter for generating unique IDs

export class NysTextinput extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
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
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
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

  // private _hasReportedValidity = false;
  private _wasInvalid = false;
  private _internals: ElementInternals;

  /********************** Lifecycle updates **********************/
  static formAssociated = true; // allows use of elementInternals' API

  constructor() {
    super();
    this._internals = this.attachInternals();
    console.log(this._internals);
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-textinput-${Date.now()}-${textinputIdCounter++}`;
    }
  }

  firstUpdated() {
    // This ensures our element always participates in the form
    this._setValue();
    this._manageRequire();
  }

  /********************** Form Integration **********************/
  private _setValue() {
    this._internals.setFormValue(this.value);
  }

  private _manageRequire() {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    if (this.required) {
      this._internals.ariaRequired = "true";
      this._internals.setValidity({ valueMissing: true }, 'This field is required', input);
    } else {
      this._internals.setValidity({});
    }
    // Force revalidation to update the form's state
    input.checkValidity();
  }

  setCustomValidity(message: string = "") {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    // errorMessage overrides any native error message
    this.errorMessage = this.errorMessage.trim() ? this.errorMessage : message;
    this.showError = !!message;

    console.log("User value: ", this.value);
    console.log("The validity is: ", input.checkValidity());
    console.log("The message is: ", message);
    console.log("The errorMsg is: ", this.errorMessage);
    console.log("test: ", this.errorMessage || message);
    console.log("test2: ", !!message);
    console.log("test3: ", this.showError);

    this._internals.setValidity(message ? { customError: true } : {}, message);

    // Force revalidation to update the form's state
    input.checkValidity();
    // input.reportValidity();
  }

  private _validate() {
    const input = this.shadowRoot?.querySelector("input");
    const regexTest = new RegExp(this.pattern).test(this.value)
    if (!input) return;

    // Required and value is empty - validation fails
    if (this.required && !this.value) {
      this.setCustomValidity("This field is required");
      return;
    }

    // Pattern exist and regex match fails
    if (this.pattern && !regexTest) {
      this.setCustomValidity("Invalid format");
      return;
    }

    // Reset error if no validation errors
    this.setCustomValidity();
  }

  /******************** Event Handlers ********************/
  // Handle input event to check pattern validity
  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this._internals.setFormValue(this.value);

    // If the field was invalid, validate aggressively on each input (e.g. Eager mode: a combination of aggressive and lazy.)
    if (this._wasInvalid) {
      this._validate();
    }

    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );


    // DELETE BELOW ~~~~~!!!!!
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
    console.log('repeating?????')
    this._validate();
    if (this.showError) {
      this._wasInvalid = true; // If invalid, start aggressive mode
    }
    this.dispatchEvent(new Event("blur"));
  }

  // Handle change event
  private _handleChange() {
    // DELETE BELOW ~~~~~!!!!!
    // const select = e.target as HTMLSelectElement;
    // this.value = select.value;
    // this.setCustomValidity(); // Validate on change

    // this.dispatchEvent(
    //   new CustomEvent("change", {
    //     detail: { value: this.value },
    //     bubbles: true,
    //     composed: true,
    //   }),
    // );
    this.dispatchEvent(new Event("change"));
  }

  render() {
    return html`
      <div class="nys-textinput">
        ${this.label &&
        html` <div class="nys-textinput__text">
          <div class="nys-textinput__requiredwrapper">
            <label for=${this.id} class="nys-textinput__label"
              >${this.label}</label
            >
            ${this.required
              ? html`<label class="nys-textinput__required">*</label>`
              : ""}
          </div>

          <div class="nys-textinput__description">
            ${this.description}
            <slot name="description"> </slot>
          </div>
        </div>`}
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
          placeholder=${this.placeholder}
          maxlength=${ifDefined(this.maxlength ? this.maxlength : undefined)}
          pattern=${ifDefined(this.pattern ? this.pattern : undefined)}
          step=${ifDefined(this.step ? this.step : undefined)}
          min=${ifDefined(this.min ? this.min : undefined)}
          max=${ifDefined(this.max ? this.max : undefined)}
          form=${ifDefined(this.form ? this.form : undefined)}
          @input=${this._handleInput}
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
          @change="${this._handleChange}"
        />
        ${this.showError && this.errorMessage
          ? html`<div class="nys-textinput__error">
              <nys-icon name="error" size="xl"></nys-icon>
              ${this._internals.validationMessage}
            </div>`
          : ""}
      </div>
    `;
  }
}

if (!customElements.get("nys-textinput")) {
  customElements.define("nys-textinput", NysTextinput);
}

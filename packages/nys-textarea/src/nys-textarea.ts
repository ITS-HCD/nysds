import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-textarea.styles";
import { ifDefined } from "lit/directives/if-defined.js";

let textareaIdCounter = 0; // Counter for generating unique IDs

export class NysTextarea extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) optional = false;
  @property({ type: String, reflect: true }) form = "";
  @property({ type: Number }) maxlength = null;
  private static readonly VALID_WIDTHS = ["sm", "md", "lg", "full"] as const;
  @property({ reflect: true })
  width: (typeof NysTextarea.VALID_WIDTHS)[number] = "full";
  @property({ type: Number }) rows = 4;
  private static readonly VALID_RESIZE = ["vertical", "none"] as const;

  // Use `typeof` to dynamically infer the allowed types
  private _resize: (typeof NysTextarea.VALID_RESIZE)[number] = "vertical";

  // Getter and setter for the `resize` property
  @property({ reflect: true })
  get resize(): (typeof NysTextarea.VALID_RESIZE)[number] {
    return this._resize;
  }

  set resize(value: string) {
    this._resize = NysTextarea.VALID_RESIZE.includes(
      value as (typeof NysTextarea.VALID_RESIZE)[number],
    )
      ? (value as (typeof NysTextarea.VALID_RESIZE)[number])
      : "vertical";
  }
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";

  async updated(changedProperties: Map<string | number | symbol, unknown>) {
    await Promise.resolve();
    if (changedProperties.has("width")) {
      this.width = NysTextarea.VALID_WIDTHS.includes(this.width)
        ? this.width
        : "full";
    }
    if (changedProperties.has("rows")) {
      this.rows = this.rows ?? 4;
    }
  }

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
      this.id = `nys-textarea-${Date.now()}-${textareaIdCounter++}`;
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
  }

  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    this.value = "";
  }

  /********************** Form Integration **********************/
  private _setValue() {
    this._internals.setFormValue(this.value);
    this._manageRequire();
  }

  private _manageRequire() {
    const textarea = this.shadowRoot?.querySelector("textarea");

    if (!textarea) return;

    const message = this.errorMessage || "This field is required";
    const isInvalid = this.required && !this.value;

    if (isInvalid) {
      this._internals.ariaRequired = "true";
      this._internals.setValidity({ valueMissing: true }, message, textarea);
    } else {
      this._internals.ariaRequired = "false"; // Reset when valid
      this._internals.setValidity({});
      this._hasUserInteracted = false; // Reset lazy validation when valid
    }
  }

  private _setValidityMessage(message: string = "") {
    const textarea = this.shadowRoot?.querySelector("textarea");
    if (!textarea) return;

    // Toggle the HTML <div> tag error message
    this.showError = !!message;
    // If user sets errorMessage, this will always override the native validation message
    if (this.errorMessage?.trim() && message !== "") {
      message = this.errorMessage;
    }

    this._internals.setValidity(
      message ? { customError: true } : {},
      message,
      textarea,
    );
  }

  private _validate() {
    const textarea = this.shadowRoot?.querySelector("textarea");
    if (!textarea) return;

    // Get the native validation state
    let message = textarea.validationMessage;

    this._setValidityMessage(message);
  }

  /********************** Functions **********************/
  // This helper function is called to perform the element's native validation.
  checkValidity(): boolean {
    const textarea = this.shadowRoot?.querySelector("textarea");
    return textarea ? textarea.checkValidity() : true;
  }

  private _handleInvalid(event: Event) {
    event.preventDefault();
    this._hasUserInteracted = true; // Start aggressive mode due to form submission
    this._validate();

    const textarea = this.shadowRoot?.querySelector("textarea");
    if (textarea) {
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
          textarea.focus();
        }
      } else {
        // If not part of a form, simply focus.
        textarea.focus();
      }
    }
  }

  /******************** Event Handlers ********************/
  // Handle input event to check pattern validity
  private _handleInput(event: Event) {
    const textarea = event.target as HTMLInputElement;
    this.value = textarea.value;
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
      this._hasUserInteracted = true; // At initial unfocus: if textarea is invalid, start aggressive mode
    }

    this._validate();
    this.dispatchEvent(new Event("nys-blur"));
  }

  private _handleSelect(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this.dispatchEvent(
      new CustomEvent("nys-select", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleSelectionChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this.dispatchEvent(
      new CustomEvent("nys-selectionchange", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <label class="nys-textarea">
        <nys-label
          for=${this.id}
          label=${this.label}
          description=${this.description}
          flag=${this.required ? "required" : this.optional ? "optional" : ""}
        >
          <slot name="description" slot="description">${this.description}</slot>
        </nys-label>
        <textarea
          class="nys-textarea__textarea ${this.resize}"
          name=${this.name}
          id=${this.id}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          aria-disabled=${ifDefined(this.disabled ? "true" : undefined)}
          aria-required=${ifDefined(this.required ? "true" : undefined)}
          aria-label=${ifDefined(this.label || undefined)}
          aria-description=${ifDefined(this.description || undefined)}
          placeholder=${ifDefined(
            this.placeholder ? this.placeholder : undefined,
          )}
          maxlength=${ifDefined(
            this.maxlength !== "" ? this.maxlength : undefined,
          )}
          .rows=${this.rows}
          form=${ifDefined(this.form || undefined)}
          @input=${this._handleInput}
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
          @select="${this._handleSelect}"
          @selectionchange="${this._handleSelectionChange}"
        >
${this.value}</textarea
        >
        <nys-errormessage
          ?showError=${this.showError}
          errorMessage=${this._internals.validationMessage || this.errorMessage}
        ></nys-errormessage>
      </label>
    `;
  }
}

if (!customElements.get("nys-textarea")) {
  customElements.define("nys-textarea", NysTextarea);
}

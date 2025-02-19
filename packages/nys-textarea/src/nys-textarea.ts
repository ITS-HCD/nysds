import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-textarea.styles";
import { ifDefined } from "lit/directives/if-defined.js";
import "@nysds/nys-icon";

let textareaIdCounter = 0; // Counter for generating unique IDs

export class NysTextarea extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) form = "";
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

  updated(changedProperties: Map<string | number | symbol, unknown>) {
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
  }

  private _manageRequire() {
    const textarea = this.shadowRoot?.querySelector("textarea");
    const message = this.errorMessage
      ? this.errorMessage
      : "This field is required";
    if (!textarea) return;

    if (this.required && !this.value) {
      this._internals.ariaRequired = "true";
      this._internals.setValidity({ valueMissing: true }, message, textarea);
    } else {
      this._internals.setValidity({});
    }
  }

  private _setValidityMessage(message: string = "") {
    const textarea = this.shadowRoot?.querySelector("textarea");
    if (!textarea) return;

    // Toggle the HTML <div> tag error message
    this.showError = !!message;
    // If user sets errorMessage, this will always override the native validation message
    if (this.errorMessage.trim() && message !== "") {
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
    this._hasUserInteracted = true; // At initial unfocus: if textarea is invalid, start aggressive mode
    this._validate();

    this.dispatchEvent(new Event("blur"));
  }

  // Handle change event to bubble up selected value
  private _handleChange() {
    this.dispatchEvent(new Event("change"));
  }

  private _handleSelect(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this.dispatchEvent(
      new CustomEvent("select", {
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
      new CustomEvent("selectionchange", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <label class="nys-textarea">
        ${this.label &&
        html` <div class="nys-textarea__text">
          <div class="nys-textarea__requiredwrapper">
            <label for=${this.id} class="nys-textarea__label"
              >${this.label}</label
            >
            ${this.required
              ? html`<label class="nys-textarea__required">*</label>`
              : ""}
          </div>
          <div class="nys-textarea__description">
            ${this.description}
            <slot name="description"> </slot>
          </div>
        </div>`}
        <textarea
          class="nys-textarea__textarea ${this.resize}"
          name=${this.name}
          id=${this.id}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          aria-disabled="${this.disabled}"
          .value=${this.value}
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
          @change="${this._handleChange}"
          @select="${this._handleSelect}"
          @selectionchange="${this._handleSelectionChange}"
        ></textarea>
        ${this.showError
          ? html`<div class="nys-textarea__error">
              <nys-icon name="error" size="xl"></nys-icon>
              ${this._internals.validationMessage || this.errorMessage}
            </div>`
          : ""}
      </label>
    `;
  }
}

if (!customElements.get("nys-textarea")) {
  customElements.define("nys-textarea", NysTextarea);
}

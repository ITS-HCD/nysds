import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-textarea.styles";
import { ifDefined } from "lit/directives/if-defined.js";
import "@nys-excelsior/nys-icon";
import { FormControlController } from "@nys-excelsior/form-controller";

let textareaIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-textarea")
export class NysTextarea extends LitElement {
  // The form controls will automatically append the component's values to the FormData object that’s used to submit the form.
  private readonly formControlController = new FormControlController(this, {
    form: () =>
      this.form
        ? (document.getElementById(this.form) as HTMLFormElement)
        : this.closest("form"),
    value: () => this.value,
    defaultValue: () => "",
    reportValidity: () => this.reportValidity(),
    checkValidity: () => this.checkValidity(),
  });

  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) form = null;
  @property({ type: Number }) maxlength = null;
  @property({ type: String }) size = "";
  @property({ type: Number }) rows = null;
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
  @property({ type: String }) errorMessage = "";

  constructor() {
    super();
  }

  static styles = styles;

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-textarea-${Date.now()}-${textareaIdCounter++}`;
    }
  }

  // Set the form control custom validity message
  setCustomValidity(message: string) {
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.setCustomValidity(message);
      this.formControlController.updateValidity();
    }
  }

  // Check the form control validity
  checkValidity(): boolean {
    const textarea = this.shadowRoot?.querySelector("textarea");
    return textarea ? textarea.checkValidity() : false;
  }

  // Report the form control validity
  reportValidity(): boolean {
    const textarea = this.shadowRoot?.querySelector("textarea");
    return textarea ? textarea.reportValidity() : false;
  }

  // Handle input event to check pattern validity
  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;

    const checkValidity = input.checkValidity();
    this.dispatchEvent(
      new CustomEvent("nys-checkValidity", {
        detail: { checkValidity },
        bubbles: true,
        composed: true,
      }),
    );

    this.formControlController.updateValidity();
  }

  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(new Event("focus"));
  }

  // Handle blur event
  private _handleBlur() {
    this.dispatchEvent(new Event("blur"));
  }

  // This function is executed when loaded so we have at least pass info (even if empty) to the user
  // When called, reveal detail: {name: value} passed the shadowDom into the outer <nys-form> component.
  private _handleSubmitForm() {
    // Dispatch formSubmission event for integration with nys-form
    this.dispatchEvent(
      new CustomEvent("nys-submitForm", {
        detail: { name: [this.name], value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    this._handleSubmitForm();

    return html`
      <label class="nys-textarea">
        ${this.label &&
        html` <div class="nys-textarea__text">
          <div class="nys-textarea__requiredwrapper">
            <div class="nys-textarea__label">${this.label}</div>
            ${this.required
              ? html`<div class="nys-textarea__required">*</div>`
              : ""}
          </div>
          <slot class="nys-textarea__description" name="description">
            ${this.description}
          </slot>
        </div>`}
        <div class="nys-textarea__requiredwrapper">
          <textarea
            class="nys-textarea__textarea ${this.size} ${this.resize}"
            name=${this.name}
            id=${this.id}
            ?disabled=${this.disabled}
            ?required=${this.required}
            ?readonly=${this.readonly}
            aria-disabled="${this.disabled}"
            .value=${this.value}
            placeholder=${this.placeholder}
            maxlength=${ifDefined(this.maxlength)}
            rows=${ifDefined(this.rows)}
            form=${ifDefined(this.form)}
            @input=${this._handleInput}
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
          ></textarea>
          ${this.required && !this.label
            ? html`<div class="nys-textarea__required">*</div>`
            : ""}
        </div>
        ${this.errorMessage &&
        html`<div class="nys-textarea__error">
          <nys-icon name="error"></nys-icon>
          ${this.errorMessage}
        </div>`}
      </label>
    `;
  }
}

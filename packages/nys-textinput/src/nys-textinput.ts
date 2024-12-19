import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-textinput.styles";
import { FormControlController } from '../../nys-form/src/form-controller';

@customElement("nys-textinput")
export class NysTextinput extends LitElement {
  // The form controls will automatically append the component's values to the FormData object that’s used to submit the form.
  private readonly formControlController = new FormControlController(this, {
    value: input => this.value,
    defaultValue: input => "",
    reportValidity: input => this.reportValidity(),
    checkValidity: input => this.checkValidity(),
  });

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

  // Gets the validity property
  get validity() {
    const input = this.shadowRoot?.querySelector('input');
    return input ? input.validity : { valid: true };
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
  @property({ type: String }) size = "";
  @property({ type: Number }) step = null;
  @property({ type: Number }) min = null;
  @property({ type: Number }) max = null;

  constructor() {
    super();
  }

  static styles = styles;

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
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.checkValidity() : false;
  }

  // Report the form control validity
  reportValidity(): boolean {
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.reportValidity() : false;
  }

  // Handle input event to check pattern validity
  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    const checkValidity = input.checkValidity();
    this.formControlController.updateValidity();
    this.dispatchEvent(
      new CustomEvent("nys-checkValidity", {
        detail: { checkValidity },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Handle invalid event
  private handleInvalid() {
    this.formControlController.setValidity(false);
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
      })
    );
  }

  render() {
    this._handleSubmitForm();

    return html`
      <div class="nys-textinput">
        ${(this.label || this.description) &&
        html` <div class="nys-textinput__text">
          <div class="nys-textinput__label_labelwrapper">
            <label for=${this.id} class="nys-textinput__label"
              >${this.label}</label
            >
            <label for=${this.id} class="nys-textinput__description"
              >${this.description}</label
            >
          </div>
          ${this.required && (this.label || this.description)
            ? html`<label class="nys-textinput__required">*</label>`
            : ""}
        </div>`}
        <div class="nys-textinput__requiredwrapper">
          <input
            class="nys-textinput__input ${this.size}"
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
            maxlength=${this.maxlength}
            pattern=${this.pattern}
            step=${this.step}
            min=${this.min}
            max=${this.max}
            form=${this.form}
            @input=${this._handleInput}
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
            @invalid=${this.handleInvalid}
          />
          ${this.required && !this.label && !this.description
            ? html`<label class="nys-textinput__required">*</label>`
            : ""}
        </div>
      </div>
    `;
  }
}
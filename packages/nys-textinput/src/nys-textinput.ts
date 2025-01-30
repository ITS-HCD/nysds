import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-textinput.styles";
import "@nys-excelsior/nys-icon"; // references: "/packages/nys-icon/dist/nys-icon.es.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { FormControlController } from "@nys-excelsior/form-controller";

let textinputIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-textinput")
export class NysTextinput extends LitElement {
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
  @property({ reflect: true }) form = null;
  @property({ type: String }) pattern = null;
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

  constructor() {
    super();
  }

  static styles = styles;

  /********************** Form Control Integration **********************/
  /**
   * Handles the integration of the component with form behavior.
   * This includes managing form control state (checked value), validity checks,
   * and custom validity messages, ensuring the component works
   * with HTML forms and participates in form submission.
   */

  firstUpdated() {
    this.formControlController.updateValidity();
  }

  // Gets the associated form, if one exists.
  getForm(): HTMLFormElement | null {
    return this.formControlController.getForm();
  }

  // Gets the validity property
  get validity() {
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.validity : { valid: true };
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
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.checkValidity() : false;
  }

  // Report the form control validity
  reportValidity(): boolean {
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.reportValidity() : false;
  }

  /******************** Functions ********************/
  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-textinput-${Date.now()}-${textinputIdCounter++}`;
    }
  }

  // Handle invalid event
  private handleInvalid(event: Event) {
    this.formControlController.setValidity(false);
    this.formControlController.emitInvalidEvent(event);
  }

  // Handle input event to check pattern validity
  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
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

  // Handle change event
  private _handleChange() {
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
          maxlength=${ifDefined(this.maxlength)}
          pattern=${ifDefined(this.pattern)}
          step=${ifDefined(this.step)}
          min=${ifDefined(this.min)}
          max=${ifDefined(this.max)}
          form=${ifDefined(this.form)}
          @input=${this._handleInput}
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
          @change="${this._handleChange}"
          @invalid=${this.handleInvalid}
        />
        ${this.showError && this.errorMessage
          ? html`<div class="nys-textinput__error">
              <nys-icon name="error" size="xl"></nys-icon>
              ${this.errorMessage}
            </div>`
          : ""}
      </div>
    `;
  }
}

import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-radiobutton.styles";
import "@nys-excelsior/nys-icon"; // references: "/packages/nys-icon/dist/nys-icon.es.js";
import { FormControlController } from "@nys-excelsior/form-controller";

let radiogroupIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-radiogroup")
export class NysRadiogroup extends LitElement {
  // The form controls will automatically append the component's values to the FormData object that’s used to submit the form.
  private readonly formControlController = new FormControlController(this, {
    form: () =>
      this.form
        ? (document.getElementById(this.form) as HTMLFormElement)
        : this.closest("form"),
    name: () => this.selectedName,
    value: () => this.selectedValue,
    defaultValue: () => "",
    reportValidity: () => this.reportValidity(),
    checkValidity: () => this.checkValidity(),
  });

  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) form = null;
  // State for storing the selected name and value for form-controller use
  @state() private selectedName: string | null = null;
  @state() private selectedValue: string | null = null;
  private static readonly VALID_SIZES = ["sm", "md"] as const;
  private _size: (typeof NysRadiogroup.VALID_SIZES)[number] = "md";

  // Getter and setter for the `width` property.
  @property({ reflect: true })
  get size(): (typeof NysRadiogroup.VALID_SIZES)[number] {
    return this._size;
  }

  set size(value: string) {
    // Check if the provided value is in VALID_WIDTHS. If not, default to "full".
    this._size = NysRadiogroup.VALID_SIZES.includes(
      value as (typeof NysRadiogroup.VALID_SIZES)[number],
    )
      ? (value as (typeof NysRadiogroup.VALID_SIZES)[number])
      : "md";
  }

  static styles = styles;

  /********************** Form Control Integration **********************/
  /**
   * Handles the integration of the component with form behavior.
   * This includes managing form control state (checked value), validity checks,
   * and custom validity messages, ensuring the component works
   * with HTML forms and participates in form submission.
   */

  // Ensures the form control's validity state is updated after the first render.
  firstUpdated() {
    this.formControlController.updateValidity();
  }

  // Gets the validity property
  get validity() {
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.validity : { valid: true };
  }

  // Gets the associated form, if one exists.
  getForm(): HTMLFormElement | null {
    return this.formControlController.getForm();
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

  /******************** Functions ********************/
  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-radiogroup-${Date.now()}-${radiogroupIdCounter++}`;
    }
    this.addEventListener("change", this._handleRadioButtonChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("change", this._handleRadioButtonChange);
  }

  updated(changedProperties: Map<string | symbol, unknown>) {
    if (changedProperties.has("required")) {
      this.updateRadioButtonsRequire();
    }
    if (changedProperties.has("size")) {
      this.updateRadioButtonsSize();
    }
  }

  // Updates the "require" attribute of a radiobutton underneath a radiogroup to ensure requirement for all radiobutton under the same name/group
  private updateRadioButtonsRequire() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton, index) => {
      if (this.required && index === 0) {
        radioButton.setAttribute("required", "required");
      }
    });
  }

  // Updates the size of each radiobutton underneath a radiogroup to ensure size standardization
  private updateRadioButtonsSize() {
    console.log("we should be updating the radio size");
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton) => {
      radioButton.setAttribute("size", this.size);
    });
  }

  // Keeps radiogroup informed of the name and value of its current selected radiobutton
  private _handleRadioButtonChange(event: Event) {
    const customEvent = event as CustomEvent;
    const { name, value } = customEvent.detail;

    this.selectedName = name;
    this.selectedValue = value;
    console.log("you have selected:", this.selectedName, this.selectedValue);
  }

  render() {
    return html` <div role="radiogroup" class="nys-radiogroup">
      ${this.label &&
      html` <div class="nys-radiobutton__text">
        <div class="nys-radiobutton__requiredwrapper">
          <label for=${this.id} class="nys-radiogroup__label"
            >${this.label}</label
          >
          ${this.required
            ? html`<label class="nys-radiobutton__required">*</label>`
            : ""}
        </div>
        <div class="nys-radiogroup__description">
          ${this.description}
          <slot name="description"></slot>
        </div>
      </div>`}
      <div class="nys-radiogroup__content">
        <slot></slot>
      </div>
      ${this.showError && this.errorMessage
        ? html`<div class="nys-radiobutton__error">
            <nys-icon name="error" size="xl"></nys-icon>
            ${this.errorMessage}
          </div>`
        : ""}
    </div>`;
  }
}

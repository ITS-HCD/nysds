import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-datepicker.scss?inline";

import { WcDatepicker } from "wc-datepicker/dist/components/wc-datepicker";

// Register the WC datepicker
if (!customElements.get("wc-datepicker")) {
  customElements.define("wc-datepicker", WcDatepicker);
}

let componentIdCounter = 0; // Counter for generating unique IDs

export class NysDatepicker extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) optional = false;
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: String, reflect: true }) form: string | null = null;
  @property({ type: String }) tooltip = "";

  @property({ type: String }) type = "date";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) min = "";
  @property({ type: String }) max = "";
  @property({ type: Boolean, reflect: true }) inverted = false;
  private _internals: ElementInternals;

  /**************** Lifecycle Methods ****************/
  static formAssociated = true; // allows use of elementInternals' API

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-datepicker-${Date.now()}-${componentIdCounter++}`;
    }

    this.addEventListener("invalid", this._handleInvalid);
  }

  firstUpdated() {
    // This ensures our element always participates in the form
    this._setValue(this.value);
  }

  /***************** Form Integration *****************/
  /**
   * Form helper methods:
   * - _setValue: set internal value and trigger validation
   * - _manageRequire: handle required state
   * - _validate: actively validate and show errors
   * - checkValidity: passive boolean check without UI
   */

  // Performs element validation
  private _setValue(value: any) {
    // ...
    this.value = value;
    this._internals.setFormValue(value);

    this._manageRequire(); // Check validation when value is set
  }

  // Called to internally set the initial internalElement required flag.
  private _manageRequire() {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    const message = this.errorMessage || "This field is required.";
    const isInvalid = this.required && !this.value;

    if (isInvalid) {
      this._internals.ariaRequired = "true";
      this._internals.setValidity({ valueMissing: true }, message, input);
    } else {
      this._internals.ariaRequired = "false";
      this._internals.setValidity({});
    }
  }

  /**
   * Actively validates the component:
   * - Updates internal validity state
   * - Updates UI (e.g. showError)
   * - Called on blur/change or form submission
   */
  private _validate() {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    const message = input.validationMessage;
    this._manageRequire(); // check required
    this._setValidityMessage(message);
  }

  /**
   * Passive check of validity:
   * - Returns true/false
   * - Does NOT update UI or show errors
   * - Used in form submission checks
   */
  checkValidity(): boolean {
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.checkValidity() : true;
  }

  // Sets custom validity message
  private _setValidityMessage(message: string = "") {
    if (!this._internals) return;
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    this._internals.setValidity(
      message ? { customError: true } : {},
      message,
      input,
    );
  }

  // Handles native 'invalid' events
  private _handleInvalid(event: Event) {
    event.preventDefault();
    this._validate();

    const innerInput = this.shadowRoot?.querySelector("input");
    if (innerInput) {
      innerInput.focus();
    }
    this._setValidityMessage("This field is required.");
  }

  /******************** Functions ********************/
  private _handleButtonClick() {
    const dateInput = this.shadowRoot?.querySelector("wc-datepicker");
    dateInput?.classList.toggle("active");
  }

  // private _handleContainerKeyDown(event: KeyboardEvent) {
  //   const container = this.shadowRoot?.querySelector(
  //     ".nys-datepicker--container",
  //   );
  //   const dateInput = this.shadowRoot?.getElementById("nys-datepicker--input");

  //   if (event.key === "Tab" && !event.shiftKey) {
  //     container?.classList.add("active");
  //     dateInput?.focus();
  //   }
  // }

  /****************** Event Handlers ******************/
  // Placeholder for event handlers if needed

  render() {
    return html` <div class="nys-datepicker--container">
      <nys-label
        for=${this.id + "--native"}
        label=${this.label}
        description=${this.description}
        flag=${this.required ? "required" : this.optional ? "optional" : ""}
        tooltip=${this.tooltip}
        ?inverted=${this.inverted}
      ></nys-label>
      <div class="nys-datepicker--input-container">
        <input id="nys-datepicker--input" type="date" max="9999-12-31" />
        <button id="calendar-button" @click=${this._handleButtonClick}>
          <nys-icon name="calendar_month" size="24"></nys-icon>
        </button>
      </div>
      <div class="wc-datepicker--container">
        <wc-datepicker>
          <div class="wc-datepicker--button-container">
            <nys-button
              label="Today"
              size="sm"
              fullWidth
              variant="outline"
              ariaDescription="{ariaDescription}"
            ></nys-button>
            <nys-button
              label="Clear"
              size="sm"
              fullWidth
              variant="outline"
              ariaDescription="{ariaDescription}"
            ></nys-button>
          </div>
        </wc-datepicker>
      </div>
    </div>`;
  }
}

if (!customElements.get("nys-datepicker")) {
  customElements.define("nys-datepicker", NysDatepicker);
}

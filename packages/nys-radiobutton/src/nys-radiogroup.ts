import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-radiobutton.styles";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

let radiogroupIdCounter = 0; // Counter for generating unique IDs

export class NysRadiogroup extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = ""; // while not use by users, this prop is needed for internalElement form logic
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) optional = false;
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";

  @state() private selectedValue: string | null = null;
  private static readonly VALID_SIZES = ["sm", "md"] as const;
  private _size: (typeof NysRadiogroup.VALID_SIZES)[number] = "md";

  // Getter and setter for the `size` property.
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
      this.id = `nys-radiogroup-${Date.now()}-${radiogroupIdCounter++}`;
    }
    this.addEventListener("change", this._handleRadioButtonChange);
    this.addEventListener("invalid", this._handleInvalid);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("change", this._handleRadioButtonChange);
    this.removeEventListener("invalid", this._handleInvalid);
  }

  firstUpdated() {
    // Ensure checked state is respected
    this._initializeCheckedRadioValue();
    // This ensures our element always participates in the form
    this._setValue();
    this.setRadioButtonRequire();
  }

  updated(changedProperties: Map<string | symbol, unknown>) {
    if (
      changedProperties.has("required") ||
      changedProperties.has("selectedValue")
    ) {
      this._manageRequire();
    }
    if (changedProperties.has("size")) {
      this._updateRadioButtonsSize();
    }
  }

  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton) => {
      (radioButton as any).formResetUpdate();
    });
  }

  /********************** Form Integration **********************/
  private _setValue() {
    this._internals.setFormValue(this.selectedValue);
  }

  // Updates the "require" attribute of the first radiobutton underneath a radiogroup to ensure requirement for all radiobutton under the same name/group
  private setRadioButtonRequire() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton, index) => {
      if (this.required && index === 0) {
        radioButton.setAttribute("required", "required");
      }
    });
  }

  private async _manageRequire() {
    const message = this.errorMessage || "Please select an option.";

    const firstRadio = this.querySelector("nys-radiobutton");
    const firstRadioInput = firstRadio
      ? await (firstRadio as any).getInputElement()
      : null;

    if (firstRadioInput) {
      if (this.required && !this.selectedValue) {
        this._internals.setValidity(
          { valueMissing: true },
          message,
          firstRadioInput,
        );
      } else {
        this.showError = false;
        this._internals.setValidity({}, "", firstRadioInput);
      }
    }
  }

  // Need to account for if radiogroup already have a radiobutton checked at initialization
  private _initializeCheckedRadioValue() {
    const checkedRadio = this.querySelector("nys-radiobutton[checked]");
    if (checkedRadio) {
      this.selectedValue = checkedRadio.getAttribute("value");
      this._internals.setFormValue(this.selectedValue);
    }
  }

  /********************** Functions **********************/
  // Updates the size of each radiobutton underneath a radiogroup to ensure size standardization
  private _updateRadioButtonsSize() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton) => {
      radioButton.setAttribute("size", this.size);
    });
  }

  // Keeps radiogroup informed of the name and value of its current selected radiobutton at each change
  private _handleRadioButtonChange(event: Event) {
    const customEvent = event as CustomEvent;
    const { name, value } = customEvent.detail;

    this.name = name;
    this.selectedValue = value;
    this._internals.setFormValue(this.selectedValue);
  }

  private async _handleInvalid(event: Event) {
    event.preventDefault();

    // Check if the radio group is invalid and set `showError` accordingly
    if (this._internals.validity.valueMissing) {
      this.showError = true;
      this._manageRequire(); // Refresh validation message

      const firstRadio = this.querySelector("nys-radiobutton");
      const firstRadioInput = firstRadio
        ? await (firstRadio as any).getInputElement()
        : null;

      if (firstRadioInput) {
        // Focus only if this is the first invalid element (top-down approach)
        const form = this._internals.form;
        if (form) {
          const elements = Array.from(form.elements) as Array<
            HTMLElement & { checkValidity?: () => boolean }
          >;
          // Find the first element in the form that is invalid
          const firstInvalidElement = elements.find((element) => {
            // If element is radiogroup, we need to go down one level to find the 1st radiobutton in the group
            if (element.tagName.toLowerCase() === "nys-radiogroup") {
              const firstRadio = element.querySelector("nys-radiobutton");
              if (!(firstRadio as any).checkValidity()) {
                return element;
              }
            } else {
              return (
                typeof element.checkValidity === "function" &&
                !element.checkValidity()
              );
            }
          });

          if (firstInvalidElement === this) {
            firstRadioInput.focus();
          }
        } else {
          // If not part of a form, simply focus.
          firstRadioInput.focus();
        }
      }
    }
  }

  render() {
    return html` <div
      role="radiogroup"
      class="nys-radiogroup"
      aria-required="${this.required ? "true" : "false"}"
      aria-invalid="${this.showError ? "true" : "false"}"
    >
      <nys-label
        id=${this.id}
        label=${this.label}
        description=${this.description}
        flag=${this.required ? "required" : this.optional ? "optional" : ""}
      >
        <slot name="description" slot="description">${this.description}</slot>
      </nys-label>
      <div class="nys-radiogroup__content">
        <slot></slot>
      </div>
      <nys-errormessage
        ?showError=${this.showError}
        errorMessage=${this._internals.validationMessage || this.errorMessage}
        showDivider
      ></nys-errormessage>
    </div>`;
  }
}

if (!customElements.get("nys-radiogroup")) {
  customElements.define("nys-radiogroup", NysRadiogroup);
}

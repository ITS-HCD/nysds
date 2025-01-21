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
    defaultValue: () => undefined,
    reportValidity: () => this.reportValidity(),
    checkValidity: () => this.checkValidity(),
  });

  @property({ type: String }) id = "";
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

  // Get validity by aggregating the state of the radio buttons
  get validity() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    if (this.required) {
      // Ensure at least one radio button is checked
      const isValid = Array.from(radioButtons).some((radioButton: any) => {
        const input = radioButton.shadowRoot?.querySelector("input");
        return input?.checked ?? false;
      });
      return { valid: isValid };
    }
    return { valid: true };
  }

  // Gets the associated form, if one exists.
  getForm(): HTMLFormElement | null {
    return this.formControlController.getForm();
  }

  // Set the form control custom validity message
  setCustomValidity(message: string) {
    const radioButton = this.querySelector("nys-radiobutton");
    if (radioButton) {
      // Find the input inside the radiobutton
      const input = radioButton.shadowRoot?.querySelector("input");

      if (input) {
        input.setCustomValidity(message);
        this.formControlController.updateValidity();
      }
    }
  }

  // Check the form control validity
  checkValidity(): boolean {
    const radioButtons = this.querySelectorAll("nys-radiobutton");

    if (this.required) {
      // Check if at least one radiobutton is selected
      const isValid = Array.from(radioButtons).some((radioButton) => {
        const input = radioButton.shadowRoot?.querySelector("input");
        return input?.checked;
      });

      if (!isValid) {
        return false;
      }
    }
    return true;
  }

  // Report the form control validity
  reportValidity(): boolean {
    const radioButtons = this.querySelectorAll("nys-radiobutton");

    if (this.required) {
      // Check if at least one radiobutton is selected
      const isValid = Array.from(radioButtons).some((radioButton) => {
        const input = radioButton.shadowRoot?.querySelector("input");
        return input?.checked;
      });

      if (!isValid) {
        // Set the error state and custom error message
        this.showError = true;
        this.errorMessage = "Please select an option.";

        // Call native error message to appear on the first radiobutton in the radiogroup
        const firstRadioButton = radioButtons[0];
        if (firstRadioButton) {
          const input = firstRadioButton.shadowRoot?.querySelector("input");
          if (input) {
            input.setCustomValidity(this.errorMessage);
            input.reportValidity();
          }
        }

        return false;
      } else {
        // Clear error state if valid
        this.showError = false;
        this.errorMessage = "";

        // Clear error message on all radiobutton in the group
        radioButtons.forEach((radiobutton) => {
          const input = radiobutton.shadowRoot?.querySelector("input");
          if (input) {
            input.setCustomValidity(""); // Clear custom validity
          }
        });
      }
    }

    // Report validity for all inputs in the group
    let groupValid = true;
    radioButtons.forEach((radioButton) => {
      const input = radioButton.shadowRoot?.querySelector("input");
      if (input) {
        const valid = input.reportValidity();
        groupValid = groupValid && valid;
      }
    });

    return groupValid;
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
    if (changedProperties.has("size")) {
      this.updateRadioButtonsSize();
    }
  }

  // This function is needed to initially establish selectedName and selectedValue
  private handleSlotChange() {
    const checkedRadioButton = this.querySelector("nys-radiobutton[checked]");

    if (checkedRadioButton) {
      const input = checkedRadioButton.shadowRoot?.querySelector("input");
      if (input) {
        // Update selectedName and selectedValue with the currently checked radio button's values
        this.selectedName = input.name;
        this.selectedValue = input.value;
      }
    }
  }

  // Updates the size of each radiobutton underneath a radiogroup to ensure size standardization
  private updateRadioButtonsSize() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton) => {
      radioButton.setAttribute("size", this.size);
    });
  }

  /**
   * Updates the radiogroup's selected name and value based on the currently selected radiobutton.
   * Clears any error messages displayed if the selection satisfies the required condition.
   */
  private _handleRadioButtonChange(event: Event) {
    const customEvent = event as CustomEvent;
    const { name, value } = customEvent.detail;

    this.selectedName = name;
    this.selectedValue = value;

    const isValid = this.checkValidity();

    if (isValid) {
      this.showError = false;
      this.errorMessage = "";

      // Clear custom validity for all radio buttons
      const radioButtons = this.querySelectorAll("nys-radiobutton");
      radioButtons.forEach((radioButton) => {
        const input = radioButton.shadowRoot?.querySelector("input");
        if (input) {
          input.setCustomValidity(""); // Clear custom validity
        }
      });
    }
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
        <slot @slotchange=${this.handleSlotChange}></slot>
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

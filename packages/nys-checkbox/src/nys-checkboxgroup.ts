import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-checkbox.styles";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

let checkboxgroupIdCounter = 0; // Counter for generating unique IDs

export class NysCheckboxgroup extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) optional = false;
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  private static readonly VALID_SIZES = ["sm", "md"] as const;
  private _size: (typeof NysCheckboxgroup.VALID_SIZES)[number] = "md";

  // Getter and setter for the `size` property.
  @property({ reflect: true })
  get size(): (typeof NysCheckboxgroup.VALID_SIZES)[number] {
    return this._size;
  }

  set size(value: string) {
    // Check if the provided value is in VALID_WIDTHS. If not, default to "full".
    this._size = NysCheckboxgroup.VALID_SIZES.includes(
      value as (typeof NysCheckboxgroup.VALID_SIZES)[number],
    )
      ? (value as (typeof NysCheckboxgroup.VALID_SIZES)[number])
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
      this.id = `nys-checkbox-${Date.now()}-${checkboxgroupIdCounter++}`;
    }
    this.addEventListener("change", this._handleCheckboxChange);
    this.addEventListener("invalid", this._handleInvalid);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("change", this._handleCheckboxChange);
    this.removeEventListener("invalid", this._handleInvalid);
  }

  firstUpdated() {
    // This ensures our checkboxes sets the value only once for formData (not within the individual checkboxes)
    this._setGroupExist();
  }

  updated(changedProperties: Map<string | symbol, unknown>) {
    if (changedProperties.has("required")) {
      if (this.required) {
        this._setupCheckboxRequired();
      }
    }
    if (changedProperties.has("size")) {
      this.updateCheckboxSize();
    }
  }

  /********************** Functions **********************/
  private _setGroupExist() {
    const checkboxes = this.querySelectorAll("nys-checkbox");
    checkboxes.forEach((checkbox: any) => {
      checkbox.groupExist = true;
    });
  }

  private async _handleInvalid(event: Event) {
    event.preventDefault();

    this.showError = true;
    this._manageCheckboxRequired(); // Refresh validation message

    const firstCheckbox = this.querySelector("nys-checkbox");
    const firstCheckboxInput = firstCheckbox
      ? await (firstCheckbox as any).getInputElement()
      : null;

    if (firstCheckboxInput) {
      // Focus only if this is the first invalid element (top-down approach)
      const form = this._internals.form;
      if (form) {
        const elements = Array.from(form.elements) as Array<
          HTMLElement & { checkValidity?: () => boolean }
        >;
        // Find the first element in the form that is invalid
        const firstInvalidElement = elements.find((element) => {
          // If element is checkboxgroup, we see if anyone checkboxes within the group is checked to fulfill required constraint
          if (element.tagName.toLowerCase() === "nys-checkboxgroup") {
            const allCheckboxes = Array.from(
              this.querySelectorAll("nys-checkbox"),
            ) as any[];
            const hasCheckedCheckbox = allCheckboxes.filter(
              (checkbox) => checkbox.checked,
            );
            // Required constraint not met, continue logic to have this component be focused
            if (hasCheckedCheckbox.length === 0) {
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
          firstCheckboxInput.focus();
        }
      } else {
        // If not part of a form, simply focus.
        firstCheckboxInput.focus();
      }
    }
  }

  // Initial update on checkbox required attribute
  private async _setupCheckboxRequired() {
    const firstCheckbox = this.querySelector("nys-checkbox");
    const message = this.errorMessage || "This field is required";

    const firstCheckboxInput = firstCheckbox
      ? await (firstCheckbox as any).getInputElement()
      : null;

    this._internals.setValidity(
      { valueMissing: true },
      message,
      firstCheckboxInput ? firstCheckboxInput : this,
    );
  }

  // Similar to how native forms handle multiple same-name fields, we group the selected values into a list for FormData.
  private _handleCheckboxChange(event: Event) {
    const customEvent = event as CustomEvent;
    const { name } = customEvent.detail;
    const checkboxes = Array.from(this.querySelectorAll("nys-checkbox"));

    // Filter to only the checked ones and extract their values.
    const selectedValues = checkboxes
      .filter((checkbox: any) => checkbox.checked)
      .map((checkbox: any) => checkbox.value);

    this.name = name;

    this._internals.setFormValue(selectedValues.join(", "));

    this._manageCheckboxRequired();
  }

  // Updates the required attribute of each checkbox in the group
  private async _manageCheckboxRequired() {
    if (this.required) {
      const message = this.errorMessage || "Please select at least one option.";
      const firstCheckbox = this.querySelector("nys-checkbox");
      const firstCheckboxInput = firstCheckbox
        ? await (firstCheckbox as any).getInputElement()
        : null;

      let atLeastOneChecked = false;
      const checkboxes = this.querySelectorAll("nys-checkbox");
      // Loop through each child checkbox to see if one is checked.
      checkboxes.forEach((checkbox: any) => {
        if (checkbox.checked) {
          atLeastOneChecked = true;
        }
      });

      if (atLeastOneChecked) {
        this._internals.setValidity({});
        this.showError = false;
      } else {
        this._internals.setValidity(
          { valueMissing: true },
          message,
          firstCheckboxInput ? firstCheckboxInput : this,
        );
        this.showError = true;
      }
    }
  }

  // Updates the size of each checkbox in the group
  private updateCheckboxSize() {
    const checkboxes = this.querySelectorAll("nys-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.setAttribute("size", this.size);
    });
  }

  render() {
    return html` <div
      class="nys-checkboxgroup"
      aria-required="${this.required ? "true" : "false"}"
      role="group"
    >
      <nys-label
        label=${this.label}
        description=${this.description}
        flag=${this.required ? "required" : this.optional ? "optional" : ""}
      >
        <slot name="description" slot="description">${this.description}</slot>
      </nys-label>
      <div class="nys-checkboxgroup__content">
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

if (!customElements.get("nys-checkboxgroup")) {
  customElements.define("nys-checkboxgroup", NysCheckboxgroup);
}

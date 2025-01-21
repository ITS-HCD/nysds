import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./nys-checkbox.styles"; // Assuming styles are in a separate file
import { FormControlController } from "@nys-excelsior/form-controller";
import "@nys-excelsior/nys-icon"; // references: "/packages/nys-icon/dist/nys-icon.es.js";
import "./nys-checkboxgroup";

let checkboxIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-checkbox")
export class NysCheckbox extends LitElement {
  private formControlController: FormControlController | null = null;
  constructor() {
    super();

    // Determine if part of a group and initialize form controller
    const isPartOfGroup = !!this.closest("nys-checkboxgroup");
    if (!isPartOfGroup) {
      // The form controls will automatically append the component's values to the FormData object that’s used to submit the form.
      this.formControlController = new FormControlController(this, {
        form: () =>
          this.form
            ? (document.getElementById(this.form) as HTMLFormElement)
            : this.closest("form"),
        value: () => this.getGroupedValue(),
        defaultValue: () => this.getGroupedValue(),
        reportValidity: () => this.reportValidity(),
        checkValidity: () => this.checkValidity(),
      });
    }
    console.log(
      "FormControlController initialized!!!!:",
      this.formControlController,
    );
  }

  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: String }) value = "";
  @property({ type: String }) form = null;
  @property({ type: Boolean }) showError = false;
  @property({ type: String }) errorMessage = "";
  private static readonly VALID_SIZES = ["sm", "md"] as const;
  private _size: (typeof NysCheckbox.VALID_SIZES)[number] = "md";

  // Getter and setter for the `size` property.
  @property({ reflect: true })
  get size(): (typeof NysCheckbox.VALID_SIZES)[number] {
    return this._size;
  }

  set size(value: string) {
    // Check if the provided value is in VALID_WIDTHS. If not, default to "full".
    this._size = NysCheckbox.VALID_SIZES.includes(
      value as (typeof NysCheckbox.VALID_SIZES)[number],
    )
      ? (value as (typeof NysCheckbox.VALID_SIZES)[number])
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
    this.formControlController?.updateValidity();
  }

  // Gets the associated form, if one exists.
  getForm(): HTMLFormElement | null {
    return this.formControlController?.getForm() ?? null;
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
      this.formControlController?.updateValidity();
    }
  }

  // Check the form control validity
  checkValidity(): boolean {
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.checkValidity() : false;
  }

  // Report the form control validity
  reportValidity(): boolean {
    console.log("reporting validity inside checkbox");
    console.log("Grouped Value:", this.getGroupedValue());
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.reportValidity() : false;
  }

  /******************** Functions ********************/
  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-checkbox-${Date.now()}-${checkboxIdCounter++}`;
    }
  }

  // Group checkboxes by the same name and serialize as a string
  private getGroupedValue() {
    // Find the associated form
    const form = this.getForm();
    if (!form) return this.checked ? this.value || "on" : undefined;

    // Find all checkboxes with the same "name" in the same form
    const checkboxes = Array.from(
      form.querySelectorAll(`nys-checkbox[name="${this.name}"]`),
    ) as NysCheckbox[];

    if (checkboxes.length === 0) {
      // If no group found, return the single checkbox value
      return this.checked ? this.value || "on" : undefined;
    }

    // Collect checked values into an array
    const checkedValues = checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value || "on");

    // Return the array of checked values as JSON string
    return checkedValues.length > 0 ? checkedValues : undefined;
  }

  // Handle invalid event
  private handleInvalid(event: Event) {
    console.log("INVALID, need handling");
    this.formControlController?.setValidity(false);
    this.formControlController?.emitInvalidEvent(event);
  }

  // Handle checkbox change event
  private _handleChange(e: Event) {
    const { checked } = e.target as HTMLInputElement;
    this.checked = checked;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { name: this.name, value: this.value, checked: this.checked },
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
    this.dispatchEvent(new Event("blur"));
  }

  // Handle keydown for keyboard accessibility
  private _handleKeydown(e: KeyboardEvent) {
    if (e.code === "Space") {
      e.preventDefault();
      if (!this.disabled) {
        this.checked = !this.checked;
        this.dispatchEvent(
          new CustomEvent("change", {
            detail: {
              name: this.name,
              value: this.value,
              checked: this.checked,
            },
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
  }

  render() {
    return html`
      <div class="nys-checkbox">
        <label class="nys-checkbox__content">
          <div class="nys-checkbox__checkboxwrapper">
            <input
              id="${this.id}"
              class="nys-checkbox__checkbox"
              type="checkbox"
              name="${ifDefined(this.name ? this.name : undefined)}"
              .checked=${this.checked}
              ?disabled=${this.disabled}
              .value=${this.value}
              ?required="${this.required}"
              aria-checked="${this.checked}"
              aria-disabled="${this.disabled}"
              aria-required="${this.required}"
              @change="${this._handleChange}"
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
              @keydown="${this._handleKeydown}"
              @invalid=${this.handleInvalid}
            />
            ${this.checked
              ? html`<nys-icon
                  for="${this.id}"
                  name="check"
                  size="${this.size === "md"
                    ? "2xl"
                    : this.size === "sm"
                      ? "sm"
                      : "md"}"
                  class="nys-checkbox__icon"
                ></nys-icon>`
              : ""}
          </div>
          ${this.label &&
          html` <div class="nys-checkbox__text">
            <div class="nys-checkbox__requiredwrapper">
              <label for=${this.id} class="nys-checkbox__label"
                >${this.label}</label
              >
              ${this.required
                ? html`<label class="nys-checkbox__required">*</label>`
                : ""}
            </div>
            <label for=${this.id} class="nys-checkbox__description">
              ${this.description}
              <slot name="description"></slot>
            </label>
          </div>`}
        </label>
        ${this.showError && this.errorMessage
          ? html`<div class="nys-checkbox__error">
              <nys-icon name="error" size="xl"></nys-icon>
              ${this.errorMessage}
            </div>`
          : ""}
      </div>
    `;
  }
}

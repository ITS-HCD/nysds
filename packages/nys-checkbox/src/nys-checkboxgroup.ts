import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-checkbox.scss?inline";

let checkboxgroupIdCounter = 0;

/**
 * A container for grouping multiple `nys-checkbox` components as a single form control.
 * Handles validation, required constraints, and submits comma-separated values.
 *
 * Use to allow users to select multiple options from a list. Apply `tile`, `size`, and `inverted` to the group
 * and all children inherit these styles automatically.
 *
 * @summary Container for grouping checkboxes as a single form control.
 * @element nys-checkboxgroup
 *
 * @slot - Default slot for `nys-checkbox` elements.
 * @slot description - Custom HTML description content.
 *
 * @example Basic checkbox group
 * ```html
 * <nys-checkboxgroup label="Select landmarks" required>
 *   <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
 *   <nys-checkbox name="landmarks" value="niagara" label="Niagara Falls"></nys-checkbox>
 * </nys-checkboxgroup>
 * ```
 */

export class NysCheckboxgroup extends LitElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Name for form submission. Set on group, not individual checkboxes. */
  @property({ type: String, reflect: true }) name = "";

  /** Requires at least one checkbox to be checked. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Shows "Optional" flag. */
  @property({ type: Boolean, reflect: true }) optional = false;

  /** Shows error message when true. */
  @property({ type: Boolean, reflect: true }) showError = false;

  /** Error message text. Shown only when `showError` is true. */
  @property({ type: String }) errorMessage = "";

  /** Visible label text for the group. */
  @property({ type: String }) label = "";

  /** Helper text below label. Use slot for custom HTML. */
  @property({ type: String }) description = "";

  /** Renders all checkboxes as tiles with larger clickable area. */
  @property({ type: Boolean, reflect: true }) tile = false;

  /** Tooltip text shown on hover/focus of info icon. */
  @property({ type: String }) tooltip = "";

  /** Adjusts colors for dark backgrounds. Applied to all children. */
  @property({ type: Boolean, reflect: true }) inverted = false;

  /** Form `id` to associate with. Applied to all children. */
  @property({ type: String, reflect: true }) form: string | null = null;

  /**
   * Checkbox size for all children: `sm` (24px) or `md` (32px, default).
   * @default "md"
   */
  @property({ type: String, reflect: true }) size: "sm" | "md" = "md";

  @state() private _slottedDescriptionText = "";

  private _internals: ElementInternals;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

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
    this.addEventListener("nys-change", this._handleCheckboxChange);
    this.addEventListener("invalid", this._handleInvalid);
    this.addEventListener("nys-error", this._handleChildError);
    this.addEventListener("nys-error-clear", this._handleChildErrorClear);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("nys-change", this._handleCheckboxChange);
    this.removeEventListener("invalid", this._handleInvalid);
    this.removeEventListener("nys-error", this._handleChildError);
    this.removeEventListener("nys-error-clear", this._handleChildErrorClear);
  }

  firstUpdated() {
    // This ensures our checkboxes sets the value only once for formData (not within the individual checkboxes)
    this._setGroupExist();
    this._updateCheckboxSize();
    this._updateCheckboxTile();
    this._updateCheckboxShowError();
    this._getSlotDescriptionForAria();
  }

  updated(changedProperties: Map<string | symbol, unknown>) {
    if (changedProperties.has("required")) {
      if (this.required) {
        this._setupCheckboxRequired();
      }
    }
    if (changedProperties.has("size")) {
      this._updateCheckboxSize();
    }
    if (changedProperties.has("tile")) {
      this._updateCheckboxTile();
    }
    if (changedProperties.has("inverted")) {
      this._updateCheckboxInvert();
    }
    if (changedProperties.has("showError")) {
      this._updateCheckboxShowError();
    }
    if (changedProperties.has("form")) {
      this._updateCheckboxForm();
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _setGroupExist() {
    const checkboxes = this.querySelectorAll("nys-checkbox");
    checkboxes.forEach((checkbox: any) => {
      checkbox.groupExist = true;
    });
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

  // Updates the required attribute of each checkbox in the group
  private async _manageRequire() {
    if (!this.required) return;

    const message = this.errorMessage || "Please select at least one option.";
    const checkboxes = Array.from(
      this.querySelectorAll("nys-checkbox"),
    ) as any[];

    // Loop through each child checkbox to see if one is checked.
    const atLeastOneChecked = checkboxes.some(
      (checkbox: any) => checkbox.checked,
    );

    const firstCheckboxInput = checkboxes
      ? await checkboxes[0].getInputElement().catch(() => null)
      : null;

    //const validity = this._internals.validity;

    if (!atLeastOneChecked) {
      // No checkboxes check is automatic validation fail when "required" prop is present
      this._internals.setValidity(
        { valueMissing: true },
        message,
        firstCheckboxInput ? firstCheckboxInput : this,
      );
      this.showError = true;
    } else {
      this._internals.setValidity({});
      this.showError = false;
    }
  }

  // Updates the size of each checkbox in the group
  private _updateCheckboxSize() {
    const checkboxes = this.querySelectorAll("nys-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.setAttribute("size", this.size);
    });
  }

  private _updateCheckboxTile() {
    const checkboxes = this.querySelectorAll("nys-checkbox");
    checkboxes.forEach((checkbox) => {
      if (this.tile) {
        checkbox.toggleAttribute("tile", true);
      } else {
        checkbox.removeAttribute("tile");
      }
    });
  }

  private _updateCheckboxInvert() {
    const checkboxes = this.querySelectorAll("nys-checkbox");
    checkboxes.forEach((checkbox) => {
      if (this.inverted) {
        checkbox.toggleAttribute("inverted", true);
      } else {
        checkbox.removeAttribute("inverted");
      }
    });
  }

  private _updateCheckboxShowError() {
    const checkboxes = this.querySelectorAll("nys-checkbox");
    checkboxes.forEach((checkbox) => {
      if (this.showError) {
        checkbox.setAttribute("showError", "");
      } else {
        checkbox.removeAttribute("showError");
      }
    });
  }

  private _updateCheckboxForm() {
    const checkboxes = this.querySelectorAll("nys-checkbox");
    checkboxes.forEach((checkbox) => {
      if (this.showError) {
        if (this.form !== null) {
          checkbox.setAttribute("form", this.form);
        } else {
          checkbox.removeAttribute("form");
        }
      } else {
        checkbox.removeAttribute("form");
      }
    });
  }

  // Get the slotted text contents so native VO can attempt to announce it within the legend in the fieldset
  private _getSlotDescriptionForAria() {
    const slot = this.shadowRoot?.querySelector(
      'slot[name="description"]',
    ) as HTMLSlotElement;
    const nodes = slot?.assignedNodes({ flatten: true }) || [];

    this._slottedDescriptionText = nodes
      .map((node) => node.textContent?.trim())
      .filter(Boolean)
      .join(", ");
  }

  private async _handleInvalid(event: Event) {
    event.preventDefault();

    // Focus "other" text input when customError is set
    if (this._internals.validity.customError) {
      const checkboxes = Array.from(
        this.querySelectorAll("nys-checkbox"),
      ) as any[];

      const otherCheckbox = checkboxes.find(
        (checkbox) => checkbox.other && checkbox.checked,
      );

      if (otherCheckbox) {
        const textInput =
          otherCheckbox.shadowRoot?.querySelector("nys-textinput");

        if (textInput) {
          await (textInput as any).updateComplete;
          (textInput as HTMLElement).focus();
          return;
        }
      }
    }

    if (this._internals.validity.valueMissing) {
      this.showError = true;
      this._manageRequire(); // Refresh validation message

      // Fallback behavior
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
            // If element is <nys-checkboxgroup>, we see if anyone checkboxes within the group is checked to fulfill required constraint
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
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

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

    // Normal required validation
    this._manageRequire();

    // Check if any "other" checkbox is checked but empty
    this._checkOtherInputs(checkboxes);
  }

  private async _handleChildError(event: Event) {
    event.stopPropagation();

    const { message, sourceCheckbox } = (event as CustomEvent).detail;
    if (!sourceCheckbox) return;

    this.showError = true;

    this._internals.setValidity(
      { customError: true },
      message || "Please complete this field.",
      sourceCheckbox as HTMLElement,
    );
  }

  private _handleChildErrorClear() {
    if (this._internals.validity.customError) {
      this._internals.setValidity({});
      this.showError = false;
    }
  }

  private async _checkOtherInputs(checkboxes: any[]) {
    for (const checkbox of checkboxes) {
      if (checkbox.checked && checkbox.other) {
        const value = checkbox.value.trim();
        const textInput = checkbox.shadowRoot?.querySelector("nys-textinput");

        if (!value || value === "") {
          const message = "Please enter a value for this option.";
          this._internals.setValidity(
            { customError: true },
            message,
            textInput || checkbox,
          );

          this.showError = true;

          await (textInput as any).updateComplete;
          (textInput as HTMLElement).focus();
          return;
        }
      }
    }
  }

  render() {
    return html`
      <div class="nys-checkboxgroup">
        <nys-label
          for=${this.id + "--native"}
          label=${this.label}
          description=${this.description}
          flag=${this.required ? "required" : this.optional ? "optional" : ""}
          tooltip=${this.tooltip}
          ?inverted=${this.inverted}
        >
          <slot name="description" slot="description">${this.description}</slot>
        </nys-label>
        <div class="nys-checkboxgroup__content">
          <fieldset>
            <legend class="sr-only">
              ${this.label}${this._slottedDescriptionText
                ? ` ${this._slottedDescriptionText}`
                : this.description
                  ? ` ${this.description}`
                  : ""}
            </legend>
            <slot></slot>
          </fieldset>
        </div>
        <nys-errormessage
          ?showError=${this.showError}
          errorMessage=${this._internals.validationMessage || this.errorMessage}
          .showDivider=${!this.tile}
        ></nys-errormessage>
      </div>
    `;
  }
}

if (!customElements.get("nys-checkboxgroup")) {
  customElements.define("nys-checkboxgroup", NysCheckboxgroup);
}

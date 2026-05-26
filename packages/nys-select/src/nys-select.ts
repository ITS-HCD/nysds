import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { NysOption } from "./nys-option";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-select.scss?inline";

let selectIdCounter = 0;

/**
 * A dropdown for selecting a single option from a list. Supports native `<option>` and `<optgroup>` elements.
 * Form-associated with validation via ElementInternals. A unique ID is auto-generated if not provided.
 *
 * **Status:** Stable | **WCAG:** 2.2 AA
 *
 * Use when users must choose one option from 7+ items. For fewer options, consider `nys-radiobutton`.
 * For multiple selections, use `nys-checkbox` group instead. Keyboard accessible with Tab, Space/Enter, and arrow keys.
 *
 * ## When to use
 * - When you need to collect data from a dropdown menu.
 * - When you need to provide a list of options for users to select a single option from.
 * - When there are more than 7 options (consider radio buttons for fewer options to keep all choices visible).
 * - For form fields that require single-select from a predefined list.
 * - Use the native `<option>` element to define options in the dropdown.
 * - Use the native `<optgroup>` element to group related options in the dropdown.
 *
 * ## When to consider something else
 * - When users need to select multiple items from a list, use a `nys-checkbox` group instead.
 * - For fewer than 7 options where visibility matters, use `nys-radiobutton` with `nys-radiogroup`.
 * - Do not use the custom `<nys-option>` element; it is deprecated and will be removed in version 2.0.
 * - Do not use `<nys-select multiple>` for multi-select functionality; use a checkbox group instead.
 * - If you need a searchable/filterable dropdown, that functionality is not currently supported.
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Use the `<nys-select>` component when you need the user to select a single item from a list.
 * - Use the `<option>` component to define the options in the dropdown.
 * - Use the native `<optgroup>` to group options in the dropdown.
 *
 * **Don't:**
 * - Use the custom `<nys-option>` element in the `<nys-select>` component (deprecated, will be removed in 2.0).
 * - Use `<nys-select multiple>` for multi-select (use a checkbox group instead).
 *
 * ## Width variants
 * Control the select's width with the `width` prop:
 * - `sm` (Small): 88px, ideal for compact layouts or narrow sidebars
 * - `md` (Medium): 200px, ideal for balanced form designs
 * - `lg` (Large): 384px, suitable for displaying longer option labels
 * - `full` (Full Width): default size, expands to fill the available space
 *
 * ## Options and default values
 * - Use the native `<option>` element for each choice. Add the `selected` attribute to one option to set it as the default.
 * - Organize many options with `<optgroup>` elements to create labeled groups (e.g., "Transportation", "Health Services").
 * - Avoid empty options; if you need a placeholder, use an option with empty value (e.g., `<option value="">-- Select an option --</option>`).
 *
 * ## Error handling and validation
 * To display an error message:
 * - Set the `showError` prop to `true` on the select component.
 * - Set the `errorMessage` prop with your error text.
 * - Setting `errorMessage` alone does not display the error; both `showError` and `errorMessage` are required.
 * - The component validates on blur when `required` is true.
 *
 * ## Dark mode and inverted styling
 * Set the `inverted` prop to `true` when the select is on a dark background to adjust colors for better contrast.
 *
 * ## Description and helper text
 * Provide additional context or instructions via the `description` prop for plain text.
 * For more complex descriptions with HTML (links, formatting, etc.), use the description slot with `slot="description"`.
 *
 * ## Form association
 * The select is form-associated via ElementInternals:
 * - Set the `name` prop to associate with form submission.
 * - Set the `form` prop to associate with a form by ID (useful when the select is outside the form element).
 * - The `value` property holds the currently selected option's value.
 *
 * ## Content guidelines
 * - Provide clear, concise option labels that accurately describe each choice.
 * - Use option groups to organize many options into logical, easily-scannable categories.
 * - Avoid overly long labels; truncate or use descriptions if needed.
 * - Supply a helpful description below the label to clarify the purpose of the select.
 * - Use placeholders sparingly; a meaningful default selection is often better.
 *
 * ## Accessibility
 * The `nys-select` component includes the following accessibility-focused features:
 * - **Label Association**: Label text is automatically associated with the select via `aria-labelledby`.
 * - **ARIA Attributes**: Proper roles and attributes ensure screen readers can interpret the select correctly.
 * - **Keyboard Navigation**: Users can tab to the select, use Space/Enter to open the dropdown, and arrow keys to navigate options.
 * - **Visual Focus Indicators**: Clear focus state on the select and within the dropdown.
 * - **Required/Optional Indicators**: Visual flags ("Required" or "Optional") and ARIA attributes clearly indicate the field's status.
 * - **Error Announcement**: Error messages are properly associated with the select for screen reader users.
 *
 * @summary Dropdown select for choosing one option from a list with native options/optgroups.
 * @element nys-select
 *
 * @slot - Default slot for `<option>` and `<optgroup>` elements.
 * @slot description - Custom HTML description content below the label.
 *
 * @fires nys-change - Fired when selection changes. Detail: `{id, value}`.
 * @fires nys-focus - Fired when select gains focus.
 * @fires nys-blur - Fired when select loses focus. Triggers validation.
 *
 * @example Basic select
 * ```html
 * <nys-select label="Select borough">
 *   <option value="bronx">The Bronx</option>
 *   <option value="brooklyn">Brooklyn</option>
 *   <option value="manhattan">Manhattan</option>
 * </nys-select>
 * ```
 *
 * @example With option groups
 * ```html
 * <nys-select label="Select service">
 *   <optgroup label="Transportation">
 *     <option value="mta">MTA</option>
 *     <option value="dmv">DMV</option>
 *   </optgroup>
 * </nys-select>
 * ```
 *
 * @example Listen for change events
 * ```js
 * const select = document.querySelector('nys-select');
 * select.addEventListener('nys-change', (event) => {
 *   const { id, value } = event.detail;
 *   console.log(`Select (${id}) changed to: ${value}`);
 * });
 * select.addEventListener('nys-focus', () => {
 *   console.log('Select is focused');
 * });
 * select.addEventListener('nys-blur', () => {
 *   console.log('Select lost focus');
 * });
 * ```
 *
 * @example With validation and error message
 * ```html
 * <nys-select
 *   label="Select an option"
 *   required
 *   showError
 *   errorMessage="This field is required"
 * >
 *   <option value="">-- Select --</option>
 *   <option value="option1">Option 1</option>
 *   <option value="option2">Option 2</option>
 * </nys-select>
 * ```
 */

export class NysSelect extends LitElement {
  static styles = unsafeCSS(styles);
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Name for form submission. */
  @property({ type: String, reflect: true }) name = "";

  /** Visible label text. Required for accessibility. */
  @property({ type: String }) label = "";

  /** Helper text below label. Use slot for custom HTML. */
  @property({ type: String }) description = "";

  /** Currently selected option value. */
  @property({ type: String }) value = "";

  /** Prevents interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Marks as required. Shows "Required" flag and validates on blur. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Shows "Optional" flag. Use when most fields are required. */
  @property({ type: Boolean, reflect: true }) optional = false;

  /** Tooltip text shown on hover/focus of info icon. */
  @property({ type: String }) tooltip = "";

  /** Form `id` to associate with when select is outside form element. */
  @property({ type: String, reflect: true }) form: string | null = null;

  /** Adjusts colors for dark backgrounds. */
  @property({ type: Boolean, reflect: true }) inverted = false;

  /** Shows error message when true. Set by validation or manually. */
  @property({ type: Boolean, reflect: true }) showError = false;

  /** Error message text. Shown only when `showError` is true. */
  @property({ type: String }) errorMessage = "";

  /**
   * Select width: `sm` (88px), `md` (200px), `lg` (384px), `full` (100%, default).
   * @default "full"
   */
  @property({ type: String, reflect: true }) width:
    | "sm"
    | "md"
    | "lg"
    | "full" = "full";

  private _originalErrorMessage = "";

  private _hasUserInteracted = false; // need this flag for "eager mode"
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
      this.id = `nys-select-${Date.now()}-${selectIdCounter++}`;
    }

    this._originalErrorMessage = this.errorMessage ?? "";
    this.addEventListener("invalid", this._handleInvalid);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("invalid", this._handleInvalid);
  }

  firstUpdated() {
    //read in slotted options
    const slot = this.shadowRoot?.querySelector(
      'slot:not([name="description"])',
    ) as HTMLSlotElement | null;

    if (slot) {
      this._handleSlotChange();
    }

    // This ensures our element always participates in the form
    this._setValue();
  }

  private _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector(
      'slot:not([name="description"])',
    ) as HTMLSlotElement | null;
    const select = this.shadowRoot?.querySelector("select");

    if (!slot || !select) return;

    // Clean up any previously cloned <option> or <optgroup> elements so we don't get duplicates
    Array.from(select.children).forEach((child) => {
      if (!(child as HTMLElement).hasAttribute("data-native")) {
        child.remove();
      }
    });

    const assignedElements = slot.assignedElements({ flatten: true });

    assignedElements.forEach((node) => {
      // ---- Handle <nys-option> ---- (May consider removing this since depreciated since 2.0 release)
      if (node instanceof NysOption) {
        const optionElement = document.createElement("option");
        optionElement.value = node.value;
        optionElement.textContent =
          node.label || node.textContent?.trim() || "";
        optionElement.disabled = node.disabled;
        optionElement.selected = node.selected;
        select.appendChild(optionElement);
        return;
      }

      // ---- Handle native <option> ----
      if (node.tagName === "OPTION") {
        const original = node as HTMLOptionElement;
        const optionClone = original.cloneNode(true) as HTMLOptionElement;

        optionClone.setAttribute("data-native", "true");
        optionClone.disabled = original.disabled;
        optionClone.selected = original.selected;

        select.appendChild(optionClone);
        return;
      }

      // ---- Handle <optgroup> ----
      if (node.tagName === "OPTGROUP") {
        const groupClone = document.createElement("optgroup");
        groupClone.label = (node as HTMLOptGroupElement).label;
        if ((node as HTMLOptGroupElement).disabled) {
          groupClone.disabled = true;
        }

        // iterate children inside optgroup (could be nys-option or native option)
        Array.from(node.children).forEach((child) => {
          if (child instanceof NysOption) {
            const option = document.createElement("option");
            option.value = child.value;
            option.textContent = child.label || child.textContent?.trim() || "";
            option.disabled = child.disabled;
            option.selected = child.selected;
            groupClone.appendChild(option);
          } else if (child.tagName === "OPTION") {
            const optionClone = child.cloneNode(true) as HTMLOptionElement;
            groupClone.appendChild(optionClone);
          }
        });

        select.appendChild(groupClone);
        return;
      }
    });

    // Sync initial selected state into component value
    const selectedOption = Array.from(select.options).find((o) => o.selected);

    if (selectedOption) {
      this.value = selectedOption.value;
      this._internals.setFormValue(this.value);
    }
  }

  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */

  private _setValue() {
    this._internals.setFormValue(this.value);
    this._manageRequire(); // Check validation when value is set
  }

  private _manageRequire() {
    const select = this.shadowRoot?.querySelector("select");
    if (!select) return;

    const message = this.errorMessage || "This field is required.";
    const isInvalid = this.required && !this.value;

    if (isInvalid) {
      this._internals.ariaInvalid = "true"; // Screen readers should announce error
      this._internals.setValidity({ valueMissing: true }, message, select);
    } else {
      this._internals.ariaInvalid = "false"; // Reset when valid
      this._internals.setValidity({});
      this._hasUserInteracted = false; // Reset the interaction flag, make lazy again
    }
  }

  private _setValidityMessage(message: string = "") {
    const select = this.shadowRoot?.querySelector("select");
    if (!select) return;

    // Toggle the HTML <div> tag error message
    this.showError = !!message;

    // If user sets errorMessage, this will always override the native validation message
    if (this._originalErrorMessage?.trim() && message !== "") {
      this.errorMessage = this._originalErrorMessage;
    } else {
      this.errorMessage = message;
    }

    const validityState = message ? { customError: true } : {};
    this._internals.setValidity(validityState, this.errorMessage, select);
  }

  private _validate() {
    const select = this.shadowRoot?.querySelector("select");
    if (!select) return;

    // Get the native validation state
    let message = select.validationMessage;
    this._manageRequire(); // Makes sure the required state is checked

    this._setValidityMessage(message);
  }

  // This callback is automatically called when the parent form is reset.
  public formResetCallback() {
    this.value = "";
    const select = this.shadowRoot?.querySelector("select");
    if (select) {
      select.value = "";
      Array.from(select.options).forEach((other) => (other.selected = false));
    }

    // Reset validation UI
    this.showError = false;
    this.errorMessage = "";
    this._internals.setValidity({});

    // Re-render UI
    this.requestUpdate();
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  // This helper function is called to perform the element's native validation.
  checkValidity(): boolean {
    const select = this.shadowRoot?.querySelector("select");
    return select ? select.checkValidity() : true;
  }

  private _handleInvalid(event: Event) {
    event.preventDefault();
    this._hasUserInteracted = true; // Start aggressive mode due to form submission
    this._validate();
    this.showError = true;

    const select = this.shadowRoot?.querySelector("select");
    if (select) {
      // Focus only if this is the first invalid element (top-down approach)
      const form = this._internals.form;
      if (form) {
        const elements = Array.from(form.elements) as Array<
          HTMLElement & { checkValidity?: () => boolean }
        >;
        // Find the first element in the form that is invalid
        const firstInvalidElement = elements.find(
          (element) =>
            typeof element.checkValidity === "function" &&
            !element.checkValidity(),
        );
        if (firstInvalidElement === this) {
          select.focus();
        }
      } else {
        // If not part of a form, simply focus.
        select.focus();
      }
    }
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  // Handle change event to bubble up selected value
  private _handleChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this._internals.setFormValue(this.value);

    // Clear error immediately if value is now valid
    if (this.required && this.value) {
      this.showError = false;
      this.errorMessage = "";
      this._internals.setValidity({});
    }

    // Validate aggressively if the user has already interacted
    if (this._hasUserInteracted) {
      this._validate();
    }

    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(
      new Event("nys-focus", { bubbles: true, composed: true }),
    );
  }

  // Handle blur event
  private _handleBlur() {
    if (!this._hasUserInteracted) {
      this._hasUserInteracted = true;
    }
    this._validate();
    this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true }),
    );
  }

  // Check if the current value matches any option, and if so, set it as selected
  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    // This ensures the value is set correctly after the component renders
    if (changedProperties.has("value")) {
      const selectElement = this.shadowRoot?.querySelector("select");
      if (selectElement) {
        selectElement.value = this.value;
      }
      this._setValue();
    }
  }

  render() {
    return html`
      <div class="nys-select">
        <nys-label
          label=${this.label}
          description=${this.description}
          flag=${this.required ? "required" : this.optional ? "optional" : ""}
          tooltip=${this.tooltip}
          ?inverted=${this.inverted}
        >
          <slot name="description" slot="description">${this.description}</slot>
        </nys-label>
        <div class="nys-select__selectwrapper">
          <select
            class="nys-select__select"
            name=${this.name}
            id=${this.id + "--native"}
            form=${ifDefined(this.form || undefined)}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-disabled="${this.disabled}"
            aria-label="${[this.label, this.description]
              .filter(Boolean)
              .join(" ")}"
            .value=${this.value}
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
            @change="${this._handleChange}"
          >
            <option data-native hidden disabled value=""></option>
          </select>
          <slot style="display: none;"></slot>
          <nys-icon
            name="chevron_down"
            size="2xl"
            class="nys-select__icon"
          ></nys-icon>
        </div>
        <nys-errormessage
          ?showError=${this.showError}
          errorMessage=${this.errorMessage}
        ></nys-errormessage>
      </div>
    `;
  }
}

if (!customElements.get("nys-select")) {
  customElements.define("nys-select", NysSelect);
}

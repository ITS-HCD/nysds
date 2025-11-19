import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { NysOption } from "./nys-option";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-select.scss?inline";

let selectIdCounter = 0; // Counter for generating unique IDs

export class NysSelect extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) optional = false;
  @property({ type: String }) _tooltip = "";
  @property({ type: String, reflect: true }) form: string | null = null;
  @property({ type: Boolean, reflect: true }) inverted = false;
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";
  private static readonly VALID_WIDTHS = ["sm", "md", "lg", "full"] as const;
  private _width: (typeof NysSelect.VALID_WIDTHS)[number] = "full";

  // Getter and setter for the `width` property.
  @property({ reflect: true })
  get width(): (typeof NysSelect.VALID_WIDTHS)[number] {
    return this._width;
  }

  set width(value: string) {
    // Check if the provided value is in VALID_WIDTHS. If not, default to "full".
    this._width = NysSelect.VALID_WIDTHS.includes(
      value as (typeof NysSelect.VALID_WIDTHS)[number],
    )
      ? (value as (typeof NysSelect.VALID_WIDTHS)[number])
      : "full";
  }

  private _hasUserInteracted = false; // need this flag for "eager mode"
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
      this.id = `nys-select-${Date.now()}-${selectIdCounter++}`;
    }
    this.addEventListener("invalid", this._handleInvalid);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("invalid", this._handleInvalid);
  }

  firstUpdated() {
    // This ensures our element always participates in the form
    this._setValue();
  }

  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    this.value = "";
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
      // ---- Handle <nys-option> ----
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
        const optionClone = node.cloneNode(true) as HTMLOptionElement;
        optionClone.setAttribute("data-native", "true");
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
  }

  /********************** Form Integration **********************/
  private _setValue() {
    this._internals.setFormValue(this.value);
    this._manageRequire(); // Check validation when value is set
  }

  private _manageRequire() {
    const select = this.shadowRoot?.querySelector("select");
    if (!select) return;

    const message = this.errorMessage || "Please select an option.";
    const isInvalid = this.required && !this.value;

    if (isInvalid) {
      this._internals.ariaRequired = "true"; // Screen readers should announce error
      this._internals.setValidity({ valueMissing: true }, message, select);
    } else {
      this._internals.ariaRequired = "false"; // Reset when valid
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
    if (this.errorMessage?.trim() && message !== "") {
      message = this.errorMessage;
    }

    this._internals.setValidity(
      message ? { customError: true } : {},
      message,
      select,
    );
  }

  private _validate() {
    const select = this.shadowRoot?.querySelector("select");
    if (!select) return;

    // Get the native validation state
    let message = select.validationMessage;
    this._manageRequire(); // Makes sure the required state is checked

    this._setValidityMessage(message);
  }

  /********************** Functions **********************/
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

  /******************** Event Handlers ********************/
  // Handle change event to bubble up selected value
  private _handleChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this._internals.setFormValue(this.value);

    // Field is invalid after unfocused, validate aggressively on each change (e.g. Eager mode: a combination of aggressive and lazy.)
    if (this._hasUserInteracted) {
      this._validate(); // Validate immediately if an error was found before
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
    this.dispatchEvent(new Event("nys-focus"));
  }

  // Handle blur event
  private _handleBlur() {
    if (!this._hasUserInteracted) {
      this._hasUserInteracted = true;
    }
    this._validate();
    this.dispatchEvent(new Event("nys-blur"));
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
    }
  }

  render() {
    return html`
      <div class="nys-select">
        <nys-label
          for=${this.id + "--native"}
          label=${this.label}
          description=${this.description}
          flag=${this.required ? "required" : this.optional ? "optional" : ""}
          _tooltip=${this._tooltip}
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
            <option data-native hidden disabled selected value=""></option>
          </select>
          <slot
            @slotchange="${this._handleSlotChange}"
            style="display: none;"
          ></slot>
          <nys-icon
            name="expand_all"
            size="2xl"
            class="nys-select__icon"
          ></nys-icon>
        </div>
        <nys-errormessage
          ?showError=${this.showError}
          errorMessage=${this._internals.validationMessage || this.errorMessage}
        ></nys-errormessage>
      </div>
    `;
  }
}

if (!customElements.get("nys-select")) {
  customElements.define("nys-select", NysSelect);
}

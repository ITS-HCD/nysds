import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-radiobutton.styles";
import type { NysRadiobutton } from "./nys-radiobutton";

let radiogroupIdCounter = 0; // Counter for generating unique IDs

export class NysRadiogroup extends LitElement {
  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = ""; // while not use by users, this prop is needed for internalElement form logic
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) optional = false;
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: Boolean, reflect: true }) tile = false;
  @property({ type: String }) tooltip = "";
  @property({ type: Boolean, reflect: true }) inverted = false;
  @property({ type: String, reflect: true }) form: string | null = null;

  @state() private selectedValue: string | null = null;
  @state() private _slottedDescriptionText = "";
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
    this.addEventListener("nys-change", this._handleRadioButtonChange);
    this.addEventListener("invalid", this._handleInvalid);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("nys-change", this._handleRadioButtonChange);
    this.removeEventListener("invalid", this._handleInvalid);
  }

  async firstUpdated() {
    await this.updateComplete;
    this._initializeCheckedRadioValue();
    this._setValue(); // This ensures our element always participates in the form
    this._setRadioButtonRequire();
    this._updateRadioButtonsSize();
    this._updateRadioButtonsTile();
    this._updateRadioButtonsShowError();
    this._getSlotDescriptionForAria();

    this._initializeChildAttributes();
    this._updateGroupTabIndex();
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
    if (changedProperties.has("tile")) {
      this._updateRadioButtonsTile();
    }
    if (changedProperties.has("inverted")) {
      this._updateRadioButtonsInvert();
    }
    if (changedProperties.has("showError")) {
      this._updateRadioButtonsShowError();
    }
    if (changedProperties.has("form")) {
      this._updateRadioButtonsForm();
    }
  }

  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton) => {
      (radioButton as NysRadiobutton).formResetUpdate();
    });
  }

  /********************** Form Integration **********************/
  private _setValue() {
    this._internals.setFormValue(this.selectedValue);
  }

  // Updates the "require" attribute of the first radiobutton underneath a radiogroup.
  // This will make sure there's a requirement for all radiobutton under the same name/group
  private _setRadioButtonRequire() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton, index) => {
      if (this.required && index === 0) {
        radioButton.setAttribute("required", "required");
      }
    });
  }

  private async _manageRequire() {
    const message = this.errorMessage || "Please select an option.";

    const radioButtons = Array.from(this.querySelectorAll("nys-radiobutton"));
    const firstRadio = radioButtons[0] as HTMLElement;

    if (firstRadio) {
      if (this.required && !this.selectedValue) {
        this._internals.setValidity(
          { valueMissing: true },
          message,
          firstRadio, // pass the custom element, not shadow input
        );
      } else {
        this.showError = false;
        this._internals.setValidity({}, "", firstRadio);
      }
    }
  }

  checkValidity() {
    const radioButtons = Array.from(this.querySelectorAll("nys-radiobutton"));
    const valid =
      !this.required ||
      radioButtons.some((radio) => (radio as NysRadiobutton).checked);
    return valid;
  }

  // Need to account for if radiogroup already have a radiobutton checked at initialization
  private _initializeCheckedRadioValue() {
    const checkedRadio = this.querySelector("nys-radiobutton[checked]");
    if (checkedRadio) {
      this.selectedValue = checkedRadio.getAttribute("value");
      this._internals.setFormValue(this.selectedValue);
    }
  }

  /********************** Core Keyboard & Click Logic **********************/
  private _getAllRadios() {
    return Array.from(
      this.querySelectorAll("nys-radiobutton"),
    ) as NysRadiobutton[];
  }

  // Arrow / Space / Enter navigation at group level
  private async _handleKeyDown(event: KeyboardEvent) {
    const keys = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      " ",
      "Enter",
    ];

    if (!keys.includes(event.key)) return;
    event.preventDefault();

    const radioBtns = this._getAllRadios().filter((radio) => !radio.disabled);
    const checkedRadio =
      radioBtns.find((radio) => radio.checked) || radioBtns[0];

    // Computing the new index based on the keydown event
    const increment =
      event.key === " " || event.key === "Enter"
        ? 0
        : ["ArrowUp", "ArrowLeft"].includes(event.key)
          ? -1
          : 1;

    let index = radioBtns.indexOf(checkedRadio) + increment;
    // Handles the wrap around ends if user is at first or last radiobutton
    if (index < 0) {
      index = radioBtns.length - 1;
    }
    if (index >= radioBtns.length) {
      index = 0;
    }

    // The target is the new radiobutton the user want to choose given the keydown type.
    // We let the target's <input/> dispatch the clickEvent and call _handleRadioButtonChange() directly to make form integration work
    const target = radioBtns[index];
    const input = await target.getInputElement();
    input?.click();

    this._updateGroupTabIndex();
    target.focus();
  }

  private _updateGroupTabIndex() {
    const radios = this._getAllRadios();
    const active = radios.find((radio) => radio.checked) || radios[0]; // If none checked, make first radiobutton tabbable

    radios.forEach((radio) => {
      if (radio.disabled) {
        radio.tabIndex = -1;
      } else {
        radio.tabIndex = radio === active ? 0 : -1;
      }

      // Need to update ARIA state due to the new tabindex
      radio.setAttribute("aria-checked", radio.checked ? "true" : "false");
      radio.setAttribute("aria-disabled", radio.disabled ? "true" : "false");
      radio.setAttribute("aria-required", this.required ? "true" : "false");
    });
  }

  /********************** Functions **********************/
  // Apply ARIA & initial tabindex to each child radio
  private _initializeChildAttributes() {
    const radios = this._getAllRadios();
    radios.forEach((radio) => {
      radio.setAttribute("role", "radio");
      radio.setAttribute("aria-checked", String(radio.checked));
      radio.setAttribute("aria-required", String(radio.required));
      radio.setAttribute("aria-disabled", String(radio.disabled));
      radio.setAttribute("tabindex", "-1");
    });
  }

  // Updates the size of each radiobutton underneath a radiogroup to ensure size standardization
  private _updateRadioButtonsSize() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton) => {
      radioButton.setAttribute("size", this.size);
    });
  }

  private _updateRadioButtonsTile() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton) => {
      if (this.tile) {
        radioButton.toggleAttribute("tile", true);
      } else {
        radioButton.removeAttribute("tile");
      }
    });
  }

  private _updateRadioButtonsInvert() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton) => {
      if (this.inverted) {
        radioButton.toggleAttribute("inverted", true);
      } else {
        radioButton.removeAttribute("inverted");
      }
    });
  }

  private _updateRadioButtonsShowError() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton) => {
      if (this.showError) {
        radioButton.setAttribute("showError", "");
      } else {
        radioButton.removeAttribute("showError");
      }
    });
  }

  private _updateRadioButtonsForm() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton) => {
      if (this.showError) {
        if (this.form !== null) {
          radioButton.setAttribute("form", this.form);
        } else {
          radioButton.removeAttribute("form");
        }
      } else {
        radioButton.removeAttribute("form");
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

  /******************** Event Handlers ********************/
  // Keeps radiogroup informed of the name and value of its current selected radiobutton at each change
  private _handleRadioButtonChange(event: Event) {
    const customEvent = event as CustomEvent;
    const { name, value } = customEvent.detail;

    this.name = name;
    this.selectedValue = value;
    this._internals.setFormValue(this.selectedValue);

    // Accounts for tabindex & ARIA on every click/space select
    this._updateGroupTabIndex();
  }

  private async _handleInvalid(event: Event) {
    event.preventDefault();

    // Check if the radio group is invalid and set `showError` accordingly
    if (this._internals.validity.valueMissing) {
      this.showError = true;
      this._manageRequire(); // Refresh validation message

      const firstRadio = this.querySelector(
        "nys-radiobutton",
      ) as NysRadiobutton;

      if (firstRadio) {
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
            firstRadio.focus();
            firstRadio.classList.add("active-focus"); // Needed to show focus outline; will be removed if user clicks to select
          }
        } else {
          // If not part of a form, simply focus.
          firstRadio.focus();
          firstRadio.classList.add("active-focus");
        }
      }
    }
  }

  render() {
    return html`<div class="nys-radiogroup">
      <nys-label
        label=${this.label}
        description=${this.description}
        flag=${this.required ? "required" : this.optional ? "optional" : ""}
        tooltip=${this.tooltip}
        ?inverted=${this.inverted}
      >
        <slot name="description" slot="description">${this.description}</slot>
      </nys-label>
      <div class="nys-radiogroup__content">
        <fieldset role="radiogroup" @keydown=${this._handleKeyDown}>
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
    </div>`;
  }
}

if (!customElements.get("nys-radiogroup")) {
  customElements.define("nys-radiogroup", NysRadiogroup);
}

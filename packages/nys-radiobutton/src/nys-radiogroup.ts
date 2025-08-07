import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-radiobutton.styles";

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
  @property({ type: Boolean, reflect: true }) tile = false;

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
    // this.addEventListener("click", this._handleRadioClick);
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-radiogroup-${Date.now()}-${radiogroupIdCounter++}`;
    }
    this.addEventListener("nys-change", this._handleRadioButtonChange);
    this.addEventListener("invalid", this._handleInvalid);
    this.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("nys-change", this._handleRadioButtonChange);
    this.removeEventListener("invalid", this._handleInvalid);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  async firstUpdated() {
    this._initializeCheckedRadioValue();
    this._setValue(); // This ensures our element always participates in the form
    this._setRadioButtonRequire();
    this._updateRadioButtonsSize();
    this._updateRadioButtonsTile();
    this._updateRadioButtonsShowError();
    this._getSlotDescriptionForAria();

    await this.updateComplete;
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
    if (changedProperties.has("showError")) {
      this._updateRadioButtonsShowError();
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

  /********************** Core Keyboard & Click Logic **********************/
  private _getAllRadios() {
    return Array.from(this.querySelectorAll("nys-radiobutton")) as any[];
  }

  //// Click anywhere on a radio -> select it
  // private _handleRadioClick = (e: MouseEvent) => {
  //   const btn = e
  //     .composedPath()
  //     .find(
  //       (node) =>
  //         (node as Element).tagName?.toLowerCase?.() === "nys-radiobutton",
  //     ) as any;
  //   if (btn && !btn.disabled) {
  //     // this._selectButton(btn);
  //     this._updateGroupTabIndex();
  //   }
  // };

  /** Arrow / Space / Enter navigation at group level */
  private _handleKeyDown = (event: KeyboardEvent) => {
    console.log("WE HANDLE KEY");
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

    const radios = this._getAllRadios().filter((r) => !r.disabled);
    const checked = radios.find((r) => r.checked) || radios[0];
    const delta =
      event.key === " " || event.key === "Enter"
        ? 0
        : ["ArrowUp", "ArrowLeft"].includes(event.key)
          ? -1
          : 1;

    let idx = radios.indexOf(checked) + delta;
    if (idx < 0) idx = radios.length - 1;
    if (idx >= radios.length) idx = 0;

    // flip checked state
    radios.forEach((r) => (r.checked = false));
    const target = radios[idx];
    target.checked = true;

    // update your form value
    this.selectedValue = target.value;
    this._internals.setFormValue(this.selectedValue);
    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: { name: this.name, value: this.selectedValue },
        bubbles: true,
        composed: true,
      }),
    );

    // roving tabindex + ARIA
    this._updateGroupTabIndex();

    // finally focus the host
    target.focus();
  };

  /** Centralized selection + form value + change event */
  // private _selectButton(btn: any) {
  //   console.log("SELECTING");
  //   this._getAllRadios().forEach((r) => (r.checked = false));
  //   btn.checked = true;
  //   this.selectedValue = btn.value;
  //   this._internals.setFormValue(this.selectedValue);
  //   this.dispatchEvent(
  //     new CustomEvent("nys-change", {
  //       detail: { name: this.name, value: this.selectedValue },
  //       bubbles: true,
  //       composed: true,
  //     }),
  //   );
  // }

  private _updateGroupTabIndex() {
    const radios = this._getAllRadios();
    const active = radios.find((radio) => radio.checked) || radios[0];

    radios.forEach((radio) => {
      // If none checked, make first radiobutton tabbable
      radio.tabIndex = radio === active ? 0 : -1;

      // Need to update ARIA state due to the new tabindex
      radio.setAttribute("aria-checked", String(radio.checked));
      radio.setAttribute("aria-required", String(this.required));
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
    console.log("CHANGE IS HERE");
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
    return html` <div>
      <nys-label
        id=${this.id}
        label=${this.label}
        description=${this.description}
        flag=${this.required ? "required" : this.optional ? "optional" : ""}
      >
        <slot name="description" slot="description">${this.description}</slot>
      </nys-label>
      <div class="nys-radiogroup__content">
        <fieldset class="nys-radiogroup" role="radiogroup">
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

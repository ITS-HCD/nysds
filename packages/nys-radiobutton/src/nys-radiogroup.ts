import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { NysFormControlElement } from "@nysds/internals";
import type { NysRadiobutton } from "./nys-radiobutton";
// These internal elements are rendered inside this component's shadow DOM, so
// they must be registered whenever nys-radiogroup is used. Importing them here
// (intentional side effect) guarantees the visible label and error message —
// which the accessible name/error association depends on — always render.
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-radiobutton.scss?inline";

/**
 * A container for grouping `nys-radiobutton` elements as a single form control with enforced single selection.
 * Handles keyboard navigation (arrow keys), validation, required constraints, and form integration.
 *
 * Use to let users select exactly one option from 2-6 choices. Apply `tile` and `size` to the group
 * and all children inherit these styles automatically. For 7+ options, use `nys-select`.
 *
 * @summary Container for grouping radio buttons as a single form control.
 * @element nys-radiogroup
 *
 * @slot - Default slot for `nys-radiobutton` elements.
 * @slot description - Custom HTML description content.
 *
 * @example Basic radio group
 * ```html
 * <nys-radiogroup label="Select borough" required>
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="manhattan" label="Manhattan"></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 */

export class NysRadiogroup extends NysFormControlElement {
  static styles = unsafeCSS(styles);
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Name for form submission. Auto-populated from child radiobuttons. */
  @property({ type: String, reflect: true }) name = "";

  /** Requires a selection before form submission. */
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

  /** Renders all radiobuttons as tiles with larger clickable area. */
  @property({ type: Boolean, reflect: true }) tile = false;

  /** Tooltip text shown on hover/focus of info icon. */
  @property({ type: String }) tooltip = "";

  /** Form `id` to associate with. Applied to all children. */
  @property({ type: String, reflect: true }) form: string | null = null;

  /**
   * Radio size for all children: `sm` (24px) or `md` (32px, default).
   * @default "md"
   */
  @property({ type: String, reflect: true }) size: "sm" | "md" = "md";
  @property({ type: Boolean }) _showOtherError = false;

  @state() private selectedValue: string | null = null;
  @state() private _slottedDescriptionText = "";
  @state() private _radios: NysRadiobutton[] = [];

  private _mobileQuery!: MediaQueryList;
  @state() private isMobile = false;

  private _hasUserInteracted = false; // need this flag for "eager mode"

  private _childObserver?: MutationObserver;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals). super.connectedCallback()
   * assigns an id (prefix = localName) when one is not provided.
   */

  connectedCallback() {
    super.connectedCallback();

    this._mobileQuery = window.matchMedia("(max-width: 479px)");
    this.isMobile = this._mobileQuery.matches;
    this._mobileQuery.addEventListener("change", this._handleMobileQuery);

    this.addEventListener("invalid", this._handleInvalid);

    this._childObserver = new MutationObserver(() => {
      this._radios = this._getAllRadios();
      this.requestUpdate();
    });
    this._childObserver.observe(this, { childList: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("invalid", this._handleInvalid);
    this._mobileQuery.removeEventListener("change", this._handleMobileQuery);

    this._childObserver?.disconnect();
  }

  async firstUpdated() {
    await this.updateComplete;

    this._radios = this._getAllRadios();

    this._initializeCheckedRadioValue();
    this._setValue(); // This ensures our element always participates in the form
    this._setRadioButtonRequire();
    this._updateRadioButtonsSize();
    this._getSlotDescriptionForAria();
    this._initializeChildAttributes();

    this._updateGroupTabIndex();
  }

  updated(changedProperties: Map<string | symbol, unknown>) {
    if (
      changedProperties.has("required") ||
      changedProperties.has("selectedValue")
    ) {
      if (!this.showError) {
        this._manageRequire();
      }
    }
    if (changedProperties.has("size")) {
      this._updateRadioButtonsSize();
    }
    this._updateGroupTabIndex();
  }

  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */

  private _setValue() {
    this.setFormValue(this.selectedValue);
  }

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
      const shadowInput = this.shadowRoot?.querySelector<HTMLElement>(
        `#input-${(firstRadio as NysRadiobutton).id}`,
      );
      if (this.required && !this.selectedValue) {
        this.setValidityFromState(
          { valueMissing: true },
          message,
          shadowInput ?? firstRadio, // pass the custom element, not shadow input
        );
      } else {
        this.showError = false;
        this.clearValidity();
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
      this.setFormValue(this.selectedValue);
    }
  }

  // Core Keyboard & Click Logic
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
    // Prevent arrow left/right from switching to next radiobutton when focus is within "other" textinput
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const inTextInput = event
        .composedPath()
        .some((el) => (el as HTMLElement).tagName === "NYS-TEXTINPUT");
      if (inTextInput) return;
    }

    event.preventDefault();

    const radioBtns = this._getAllRadios().filter((radio) => !radio.disabled);
    const focusedInput = event.target as HTMLElement;
    const currentRadio =
      radioBtns.find(
        (radio) =>
          this.shadowRoot?.querySelector(`#input-${radio.id}`) === focusedInput,
      ) ||
      radioBtns.find((radio) => radio.checked) ||
      radioBtns[0];

    let increment = 0;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) {
      increment = -1;
    } else if (["ArrowDown", "ArrowRight"].includes(event.key)) {
      increment = 1;
    }

    let index = radioBtns.indexOf(currentRadio) + increment;

    // Handles the wrap around ends if user is at first or last radiobutton
    if (index < 0) {
      index = radioBtns.length - 1;
    }
    if (index >= radioBtns.length) {
      index = 0;
    }

    const target = radioBtns[index];

    this._selectRadio(target);
    await this.updateComplete;
    this._updateGroupTabIndex();
    this.shadowRoot?.querySelector<HTMLElement>(`#input-${target.id}`)?.focus();
  }

  private _updateGroupTabIndex() {
    const radios = this._getAllRadios();

    // Pick active: look for what's selected first, otherwise choose the first enabled radiobutton
    const active =
      radios.find((radio) => radio.checked && !radio.disabled) ||
      radios.find((radio) => !radio.disabled);

    radios.forEach((radio) => {
      const input = this.shadowRoot?.querySelector(
        `#input-${radio.id}`,
      ) as HTMLInputElement;

      // Only one radiobutton can be focusable at all times.
      // Due to this, we calculate logic to determine an active radiobutton and call all other as tabindex="-1"
      if (input) {
        input.tabIndex = radio === active ? 0 : -1;
      }
    });
  }

  // This callback is automatically called when the parent form is reset.
  public formResetCallback() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radio) => {
      (radio as NysRadiobutton).checked = false;
    });

    this.selectedValue = null;
    this.setFormValue(null);
    this.showError = false;
    this.errorMessage = "";
    this.clearValidity();
    this._hasUserInteracted = false;
    this.requestUpdate();
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _handleMobileQuery = () => {
    this.isMobile = this._mobileQuery.matches;
  };

  private _handleSlotChange() {
    this._radios = Array.from(this.querySelectorAll("nys-radiobutton"));
    this.requestUpdate();
  }

  // Apply ARIA & initial tabindex to each child radio
  private _initializeChildAttributes() {
    const radios = this._getAllRadios();
    radios.forEach((radio) => {
      if (radio.getAttribute("tabindex") !== "-1") {
        radio.setAttribute("tabindex", "-1");
      }
    });
  }

  private _updateRadioButtonsSize() {
    const radioButtons = this.querySelectorAll("nys-radiobutton");
    radioButtons.forEach((radioButton) => {
      if (radioButton.getAttribute("size") !== this.size) {
        radioButton.setAttribute("size", this.size);
      }
    });
  }

  private _selectRadio(radiobtn: NysRadiobutton) {
    if (radiobtn.checked || radiobtn.disabled) return;

    const radios = this._getAllRadios();
    radios.forEach((radio) => {
      radio.checked = false;
    });

    radiobtn.checked = true;

    this._showOtherError = false;
    this._hasUserInteracted = false;

    this.name = radiobtn.name;
    this.selectedValue = radiobtn.value;
    this.setFormValue(this.selectedValue);
    this.clearValidity();
    this.showError = false;

    this._updateGroupTabIndex();
    this.requestUpdate();

    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: {
          id: radiobtn.id,
          checked: radiobtn.checked,
          name: radiobtn.name,
          value: radiobtn.value,
        },
        bubbles: true,
        composed: true,
      }),
    );
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

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private async _handleInvalid(event: Event) {
    event.preventDefault();

    const radios = this._getAllRadios();
    const otherRadio = radios.find((radio) => radio.other && radio.checked);

    if (otherRadio && otherRadio.value.trim() === "") {
      this.showError = true;
      this._hasUserInteracted = true;
      this._validateOtherAndEmitError(otherRadio);

      await this.updateComplete;
      const textInput = this.shadowRoot?.querySelector("nys-textinput");

      if (textInput) {
        await (textInput as any).updateComplete;
        (textInput as HTMLElement).focus();
        return;
      }
    }

    // Check if the radio group is invalid and set `showError` accordingly
    this.showError = true;
    await this._manageRequire(); // Refresh validation message

    const firstEnabledRadio = this._getAllRadios().find(
      (radio) => !radio.disabled,
    );
    if (firstEnabledRadio) {
      const focusFirstInput = () => {
        this.shadowRoot
          ?.querySelector<HTMLElement>(`#input-${firstEnabledRadio.id}`)
          ?.focus();
      };

      // Focus only if this is the first invalid element (top-down approach)
      const form = this.internals?.form;
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
          focusFirstInput();
        }
      } else {
        // If not part of a form, simply focus.
        focusFirstInput();
      }
    }
  }

  private _handleTextInput(radiobtn: NysRadiobutton, event: Event) {
    const input = event.target as HTMLInputElement;
    radiobtn.value = input.value;
    this.selectedValue = input.value;
    this.setFormValue(input.value);

    if (this._hasUserInteracted) {
      this._validateOtherAndEmitError(radiobtn);
    }

    this.dispatchEvent(
      new CustomEvent("nys-other-input", {
        detail: { id: radiobtn.id, name: radiobtn.name, value: radiobtn.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleTextInputBlur(radiobtn: NysRadiobutton) {
    this._hasUserInteracted = true;
    this._validateOtherAndEmitError(radiobtn);
  }

  private _validateOtherAndEmitError(radiobtn: NysRadiobutton) {
    if (!radiobtn.other) return;

    if (!radiobtn.checked || !this._hasUserInteracted) {
      this._showOtherError = false;
      return;
    }

    const isInvalid = radiobtn.value.trim() === "";
    this._showOtherError = isInvalid;
    const shadowInput = this.shadowRoot?.querySelector<HTMLElement>(
      `#input-${radiobtn.id}`,
    );

    if (isInvalid) {
      this.setValidityFromState(
        {
          customError: true,
        },
        "Please enter a value for this option.",
        shadowInput ?? (radiobtn as HTMLElement),
      );
      this.showError = true;
    } else {
      this.clearValidity();
      this.showError = false;
    }
  }

  private _handleOtherKeydown(e: KeyboardEvent) {
    if (e.key == "Space" || e.key === " ") {
      e.stopPropagation();
    }
  }

  private _handleGroupFocusout(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && this.shadowRoot?.contains(relatedTarget)) return;

    const otherRadio = this._getAllRadios().find(
      (radio) => radio.other && radio.checked,
    );
    if (otherRadio && otherRadio.value.trim() === "") {
      this._hasUserInteracted = true;
      this._validateOtherAndEmitError(otherRadio);
    }
  }

  private _handleRadiobtnClick = (radiobtn: NysRadiobutton) => {
    if (!radiobtn.disabled) {
      this.shadowRoot
        ?.querySelector<HTMLInputElement>(`#input-${radiobtn.id}`)
        ?.click();
    }
  };

  private _handleRadiobtnFocus(radiobtn: NysRadiobutton) {
    radiobtn.dispatchEvent(
      new CustomEvent("nys-focus", { bubbles: true, composed: true }),
    );
  }

  private _handleRadiobtnBlur(radiobtn: NysRadiobutton) {
    radiobtn.dispatchEvent(
      new CustomEvent("nys-blur", { bubbles: true, composed: true }),
    );
  }

  render() {
    return html` <slot
        style="display:none"
        @slotchange=${this._handleSlotChange}
      ></slot>
      <fieldset
        aria-label="${this.label}${this._slottedDescriptionText
          ? ` ${this._slottedDescriptionText}`
          : this.description
            ? ` ${this.description}`
            : ""}"
        role="radiogroup"
        aria-required=${this.required ? "true" : "false"}
        class="nys-radiogroup"
        @focusout=${this._handleGroupFocusout}
      >
        <legend>
          <nys-label
            label=${this.label}
            description=${this.description}
            flag=${this.required ? "required" : this.optional ? "optional" : ""}
            tooltip=${this.tooltip}
          >
            <slot name="description" slot="description"
              >${this.description}</slot
            >
          </nys-label>
        </legend>
        <div class="nys-radiogroup__content" @keydown=${this._handleKeyDown}>
          ${this._radios.map(
            (radiobtn, index) => html`
              <div
                class="nys-radiobutton"
                @click=${() => this._handleRadiobtnClick(radiobtn)}
              >
                <div class="nys-radiobutton__main-container">
                  <!-- <span class="nys-radiobutton__radio" tabindex="-1"></span> -->
                  <input
                    id="input-${radiobtn.id}"
                    type="radio"
                    class="nys-radiobutton__radio"
                    name="${ifDefined(radiobtn.name || undefined)}"
                    .checked=${radiobtn.checked}
                    ?disabled=${radiobtn.disabled}
                    .value=${radiobtn.value}
                    ?required=${this.required && index === 0}
                    form=${ifDefined(radiobtn.form || undefined)}
                    aria-labelledby=${ifDefined(
                      radiobtn.label || radiobtn.other
                        ? `${radiobtn.id}-label`
                        : undefined,
                    )}
                    aria-errormessage=${`${this.id}--error`}
                    @change=${() => this._selectRadio(radiobtn)}
                    @focus=${() => this._handleRadiobtnFocus(radiobtn)}
                    @blur=${() => this._handleRadiobtnBlur(radiobtn)}
                  />
                  ${(radiobtn.label || radiobtn.other) &&
                  html`<nys-label
                    id="${radiobtn.id}-label"
                    label="${radiobtn.label || (radiobtn.other ? "Other" : "")}"
                    description=${ifDefined(radiobtn.description || undefined)}
                  >
                    <slot name="description" slot="description"
                      >${radiobtn.description}</slot
                    >
                  </nys-label> `}
                </div>
                <div class="nys-radiobutton__other-container">
                  ${radiobtn.other && radiobtn.checked
                    ? html`
                        <nys-textinput
                          .value=${radiobtn.value}
                          id=${"radiobutton-other-" + radiobtn.id}
                          @nys-input=${(e: Event) =>
                            this._handleTextInput(radiobtn, e)}
                          @nys-blur=${() => this._handleTextInputBlur(radiobtn)}
                          @keydown=${this._handleOtherKeydown}
                          @nys-focus=${() =>
                            radiobtn.classList.remove("focused")}
                          ariaLabel="Other"
                          aria-invalid=${radiobtn.showOtherError
                            ? "true"
                            : "false"}
                          width=${this.isMobile ? "full" : "md"}
                          ?disabled=${radiobtn.disabled}
                        ></nys-textinput>
                      `
                    : ""}
                </div>
              </div>
            `,
          )}
        </div>
        <nys-errormessage
          id="${this.id}--error"
          ?showError=${this.showError}
          errorMessage=${this.internals!.validationMessage || this.errorMessage}
          .showDivider=${!this.tile}
        ></nys-errormessage>
      </fieldset>`;
  }
}

if (!customElements.get("nys-radiogroup")) {
  customElements.define("nys-radiogroup", NysRadiogroup);
}

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-datepicker.scss?inline";

import { WcDatepicker } from "wc-datepicker/dist/components/wc-datepicker";

// Register the WC datepicker
if (!customElements.get("wc-datepicker")) {
  customElements.define("wc-datepicker", WcDatepicker);
}

let componentIdCounter = 0; // Counter for generating unique IDs

export class NysDatepicker extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean }) showTodayButton = false;
  @property({ type: Boolean }) showClearButton = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) optional = false;
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: String, reflect: true }) form: string | null = null;
  @property({ type: String }) tooltip = "";

  @property({ type: String }) type = "date";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) min = "";
  @property({ type: String }) max = "";
  @property({ type: String }) startDate = "";
  @property({ type: Boolean, reflect: true }) inverted = false;
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
      this.id = `nys-datepicker-${Date.now()}-${componentIdCounter++}`;
    }

    this.addEventListener("invalid", this._handleInvalid);
  }

  firstUpdated() {
    // This ensures our element always participates in the form
    this._setValue(this.value);

    // setTimeout is needed because the wc-datepicker needs to be rendered in first for the logics to work
    setTimeout(() => this._replaceButtonSVG(), 0);
    setTimeout(() => this._addMonthDropdownIcon(), 0);
    setTimeout(() => this._handleDateChange(), 0);
    setTimeout(() => this._onDocumentClick(), 0);
  }

  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */

  /**
   * Form helper methods:
   * - _setValue: set internal value and trigger validation
   * - _manageRequire: handle required state
   * - _validate: actively validate and show errors
   * - checkValidity: passive boolean check without UI
   */

  // Performs element validation
  private _setValue(value: Date | string | undefined) {
    if (!value) {
      this.value = "";
      this._internals.setFormValue("");
      return;
    }

    const date = value instanceof Date ? value : this._parseLocalDate(value);

    const yyyyMmDd = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    this.value = yyyyMmDd;
    this._internals.setFormValue(yyyyMmDd);

    const datepicker = this.shadowRoot?.querySelector("wc-datepicker");
    if (datepicker) {
      datepicker.value = date;
    }

    this._manageRequire();
  }

  // Called to internally set the initial internalElement required flag.
  private _manageRequire() {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    const message = this.errorMessage || "This field is required.";
    const isInvalid = this.required && !this.value;
    console.log("THE VALUE", this.value, isInvalid);

    if (isInvalid) {
      this._internals.ariaRequired = "true";
      this._internals.setValidity({ valueMissing: true }, message, input);
    } else {
      this._internals.ariaRequired = "false";
      this._internals.setValidity({});
    }
  }

  /**
   * Actively validates the component:
   * - Updates internal validity state
   * - Updates UI (e.g. showError)
   * - Called on blur/change or form submission
   */
  private _validate() {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    const message = input.validationMessage;
    this._manageRequire(); // check required
    this._setValidityMessage(message);
  }

  /**
   * Passive check of validity:
   * - Returns true/false
   * - Does NOT update UI or show errors
   * - Used in form submission checks
   */
  checkValidity(): boolean {
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.checkValidity() : true;
  }

  // Sets custom validity message
  private _setValidityMessage(message: string = "") {
    if (!this._internals) return;
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    // Toggle the HTML <div> tag error message
    this.showError = !!message;
    // If user sets errorMessage, this will always override the native validation message
    if (this.errorMessage?.trim() && message !== "") {
      message = this.errorMessage;
    }

    this._internals.setValidity(
      message ? { customError: true } : {},
      message,
      input,
    );
  }

  // Handles native 'invalid' events
  private _handleInvalid(event: Event) {
    event.preventDefault();
    this._validate();

    const innerInput = this.shadowRoot?.querySelector("input");
    if (innerInput) {
      innerInput.focus();
    }
    this._setValidityMessage("This field is required.");
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  /**
   * Replaces the default wc-datepicker month navigation buttons
   * with NYS icon components for previous and next month.
   */
  private _replaceButtonSVG() {
    const datePicker = this.shadowRoot?.querySelector("wc-datepicker");
    if (!datePicker) return;

    const nextBtn = datePicker.querySelector(
      ".wc-datepicker__next-month-button",
    ) as HTMLButtonElement;

    const prevBtn = datePicker.querySelector(
      ".wc-datepicker__previous-month-button",
    ) as HTMLButtonElement;

    if (!nextBtn || !prevBtn) return;
    prevBtn.innerHTML = `
    <nys-icon name="arrow_back" size="18"></nys-icon>
  `;
    nextBtn.innerHTML = `
    <nys-icon name="arrow_forward" size="18"></nys-icon>
  `;
  }

  private _addMonthDropdownIcon() {
    const datePicker = this.shadowRoot?.querySelector("wc-datepicker");
    if (!datePicker) return;

    const select = datePicker.querySelector(
      ".wc-datepicker__month-select",
    ) as HTMLSelectElement;

    if (select && !select.parentElement?.classList.contains("month-wrapper")) {
      const wrapper = document.createElement("span");
      wrapper.className = "month-wrapper";
      select.parentNode?.insertBefore(wrapper, select);
      wrapper.appendChild(select);

      const icon = document.createElement("nys-icon");
      icon.setAttribute("name", "chevron_down");
      icon.setAttribute("id", "wc-month-dropdown-icon");
      icon.setAttribute("size", "20");
      wrapper.appendChild(icon);
    }
  }

  // Creates a Date at local midnight to avoid UTC timezone shifting
  private _parseLocalDate(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    // month is 0-indexed
    return new Date(year, month - 1, day);
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  // Handle blur event
  private _handleBlur() {
    // if (!this._hasUserInteracted) {
    //   this._hasUserInteracted = true; // At initial unfocus: if textarea is invalid, start aggressive mode
    // }

    this._validate();
    this.dispatchEvent(new Event("nys-blur"));
  }

  private _onDocumentClick() {
    const onClick = (event: MouseEvent) => {
      const path = event.composedPath();

      const input = this.shadowRoot?.querySelector(
        ".nys-datepicker--input-container",
      );
      const container = this.shadowRoot?.querySelector(
        ".wc-datepicker--container",
      );
      const datepicker = this.shadowRoot?.querySelector("wc-datepicker");

      const clickedInside =
        (input && path.includes(input)) ||
        (container && path.includes(container)) ||
        (datepicker && path.includes(datepicker));

      if (!clickedInside) {
        datepicker?.classList.remove("active");
      }
    };

    document.addEventListener("click", onClick);
  }

  private _toggleDatepicker() {
    if (!this.disabled) {
      const dateInput = this.shadowRoot?.querySelector("wc-datepicker");
      dateInput?.classList.toggle("active");
    }
  }

  private _openDatepicker() {
    if (!this.disabled) {
      const dateInput = this.shadowRoot?.querySelector("wc-datepicker");
      dateInput?.classList.add("active");
    }
  }

  private _handleDateChange() {
    const datepicker = this.shadowRoot?.querySelector("wc-datepicker");
    if (!datepicker) return;

    datepicker.addEventListener("selectDate", (event: Event) => {
      const dateString = (event as CustomEvent).detail; // format: YYYY-MM-DD
      const dateValue = this._parseLocalDate(dateString);
      this._setValue(dateValue);
    });
  }

  private _handleTodayClick() {
    if (this.disabled) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // force midnight consistency. Setting date start time is at 00:00:00
    // const iso = today.toISOString().split("T")[0];
    this._setValue(today);
  }

  private _handleClearClick() {
    if (this.disabled) return;

    this.value = "";
    this._internals.setFormValue("");
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.value = "";
    }
  }

  private _handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input) return;

    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = dateRegex.exec(input.value);
    if (!match) return;

    const year = Number(match[1]);

    // Due to how autocomplete happens for typing in the 1st digit of the datepicker YYYY (i.e. 0002)
    // We reject any partial / nonsense years (like 0002, 0190, etc)
    if (year < 1000) return;

    this._setValue(this._parseLocalDate(input.value));
  }

  render() {
    return html` <div class="nys-datepicker--container">
        <nys-label
          for=${this.id + "--native"}
          label=${this.label}
          description=${this.description}
          flag=${this.required ? "required" : this.optional ? "optional" : ""}
          tooltip=${this.tooltip}
          ?inverted=${this.inverted}
        ></nys-label>
        <div
          class="nys-datepicker--input-container ${this.disabled
            ? "disabled"
            : ""}"
        >
          <input
            id="nys-datepicker--input"
            type="date"
            max="9999-12-31"
            ?required=${this.required}
            .value=${this.value || ""}
            .min=${this.min || ""}
            .max=${this.max || ""}
            ?disabled=${this.disabled}
            @click=${this._openDatepicker}
            @input=${this._handleInputChange}
            @blur=${this._handleBlur}
          />
          <button
            id="calendar-button"
            @click=${this._toggleDatepicker}
            tabindex=${this.disabled ? "-1" : "0"}
            ?disabled=${this.disabled}
          >
            <nys-icon name="calendar_month" size="24"></nys-icon>
          </button>
        </div>

        <div class="wc-datepicker--container">
          <wc-datepicker
            .value=${this.value ? this._parseLocalDate(this.value) : undefined}
            ?disabled=${this.disabled}
            start-date=${ifDefined(this.startDate ? this.startDate : undefined)}
          >
            ${this.showTodayButton || this.showClearButton
              ? html`
                  <div class="wc-datepicker--button-container">
                    ${this.showTodayButton
                      ? html`
                          <nys-button
                            label="Today"
                            size="sm"
                            fullWidth
                            variant="outline"
                            ?disabled=${this.disabled}
                            @click=${this._handleTodayClick}
                          ></nys-button>
                        `
                      : null}
                    ${this.showClearButton
                      ? html`
                          <nys-button
                            label="Clear"
                            size="sm"
                            fullWidth
                            variant="outline"
                            ?disabled=${this.disabled}
                            @click=${this._handleClearClick}
                          ></nys-button>
                        `
                      : null}
                  </div>
                `
              : null}
          </wc-datepicker>
        </div>
      </div>
      <nys-errormessage
        ?showError=${this.showError}
        errorMessage=${this._internals.validationMessage || this.errorMessage}
      ></nys-errormessage>`;
  }
}

if (!customElements.get("nys-datepicker")) {
  customElements.define("nys-datepicker", NysDatepicker);
}

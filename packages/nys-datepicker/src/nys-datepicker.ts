import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import {
  NysFormControlElement,
  dispatchNysEvent,
  dispatchNysFocusBlur,
} from "@nysds/internals";
// These internal elements are rendered inside this component's shadow DOM, so
// they must be registered whenever nys-datepicker is used. Importing them here
// (intentional side effect) guarantees the visible label and error message —
// which the accessible name/error association depends on — always render.
// nys-icon renders the calendar trigger and nav arrows; nys-button renders
// the "Today"/"Clear" calendar-popup actions.
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-icon";
import "@nysds/nys-button";

// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-datepicker.scss?inline";

import { WcDatepicker } from "wc-datepicker/dist/components/wc-datepicker";

// Register the WC datepicker
if (!customElements.get("wc-datepicker")) {
  customElements.define("wc-datepicker", WcDatepicker);
}

/** Detail payload for the `nys-input` event. */
export interface NysDatepickerInputDetail {
  id: string;
  name: string;
  /** The current `value` property: a `Date`, a `YYYY-MM-DD` string, or `undefined`. */
  value: string | Date | undefined;
}

/** The `nys-input` event, fired as the date value updates. */
export type NysDatepickerInputEvent = CustomEvent<NysDatepickerInputDetail>;

/** Detail payload for the `nys-change` event. */
export interface NysDatepickerChangeDetail {
  id: string;
  name: string;
  /** The committed date, always a `YYYY-MM-DD` string. Empty string when cleared. */
  value: string;
}

/** The `nys-change` event, fired on a committed selection. */
export type NysDatepickerChangeEvent = CustomEvent<NysDatepickerChangeDetail>;

/**
 * Date picker with calendar popup and form validation. Falls back to native date input
 * on Safari and mobile.
 *
 * @summary Date picker with calendar popup and native fallback.
 * @element nys-datepicker
 *
 * @formControl value nys-change nys-input
 *
 * @fires {NysDatepickerInputEvent} nys-input - Fired as the date value updates (valid typed date, calendar pick, Today, Clear). Detail: `{id, name, value}` where `value` is the current `value` property.
 * @fires {NysDatepickerChangeEvent} nys-change - Fired on committed selection: calendar pick, valid typed date on blur, Today, Clear. Detail: `{id, name, value}` where `value` is always the `YYYY-MM-DD` string, empty string when cleared.
 * @fires {Event} nys-focus - Fired when focus enters the component from outside.
 * @fires {Event} nys-blur - Fired when input or calendar loses focus. Triggers validation.
 *
 * @example Basic
 * ```html
 * <nys-datepicker
 *  id="my-datepicker"
 *  name="my-datepicker"
 *  label="Schedule an appointment"
 *  description="Enter in MM/DD/YYYY format"
 * ></nys-datepicker>
 * ```
 *
 * @example Width Large
 * ```html
 * <nys-datepicker
 *   label="Event Date"
 *   description="Select the date of your event"
 *   width="lg">
 * </nys-datepicker>
 * ```
 *
 * @example Width Full
 * ```html
 * <nys-datepicker
 *   label="Event Date"
 *   description="Select the date of your event"
 *   width="full">
 * </nys-datepicker>
 * ```
 *
 * @example Custom Start Date
 * ```html
 * <nys-datepicker
 *   label="Appointment"
 *   startDate="2024-01-01">
 * </nys-datepicker>
 * ```
 *
 * @example Without Buttons
 * ```html
 * <nys-datepicker
 *   label="Appointment"
 *   hideTodayButton
 *   hideClearButton>
 * </nys-datepicker>
 * ```
 *
 * @example Error Message
 * ```html
 * <nys-datepicker
 *   label="Start Date"
 *   showError
 *   errorMessage="Please select a valid start date">
 * </nys-datepicker>
 * ```
 *
 * @example Date Range
 * ```html
 * <nys-datepicker
 *   label="Select a date"
 *   description="Only dates within April 4/5/2026 - 7/15/2026 are selectable"
 *   minDate="2026-04-05"
 *   maxDate="2026-07-15">
 * </nys-datepicker>
 * ```
 *
 * @example Disabled
 * ```html
 * <nys-datepicker
 *   label="Disabled datepicker"
 *   disabled
 *   value="2025-01-15">
 * </nys-datepicker>
 * ```
 *
 * @example Required
 * ```html
 * <nys-datepicker
 *   label="Start Date"
 *   required>
 * </nys-datepicker>
 * ```
 *
 * @example Optional
 * ```html
 * <nys-datepicker
 *   label="Start Date"
 *   optional>
 * </nys-datepicker>
 * ```
 */

export class NysDatepicker extends NysFormControlElement {
  static styles = unsafeCSS(styles);
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Name for form submission. */
  @property({ type: String, reflect: true }) name = "";

  /**
   * Input width: `md` (200px), `lg` (384px), `full` (100%).
   * @default "full"
   */
  @property({ type: String, reflect: true }) width: "md" | "lg" | "full" =
    "full";

  /** Hide the "Today" button in calendar popup. */
  @property({ type: Boolean }) hideTodayButton = false;

  /** Hide the "Clear" button in calendar popup. */
  @property({ type: Boolean }) hideClearButton = false;

  /** Disable interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Mark as required. Shows "Required" flag and validates on blur. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Show "Optional" flag. Use when most fields are required. */
  @property({ type: Boolean, reflect: true }) optional = false;

  /** Show error state. */
  @property({ type: Boolean, reflect: true }) showError = false;

  /** Error message text. */
  @property({ type: String }) errorMessage = "";

  /** Form `id` to associate with when input is outside form. */
  @property({ type: String, reflect: true }) form: string | null = null;

  /** Tooltip text on info icon hover. */
  @property({ type: String }) tooltip = "";

  /** Input type. Currently only supports `date`. */
  @property({ type: String }) type = "date";

  /** Label text. Required for accessibility. */
  @property({ type: String }) label = "";

  /** Helper text below label. */
  @property({ type: String }) description = "";

  /** Initial date when calendar opens (YYYY-MM-DD). */
  @property({ type: String }) startDate = "";

  /** The earliest selectable date (YYYY-MM-DD). */
  @property({ type: String }) minDate = "";

  /** The latest selectable date (YYYY-MM-DD). */
  @property({ type: String }) maxDate = "";

  /** Dark background mode. */
  @property({ type: Boolean, reflect: true }) inverted = false;

  /** Selected date. Accepts Date object or ISO string (YYYY-MM-DD). */
  @property({
    type: Object,
    converter: {
      fromAttribute: (value: string | null) =>
        value ? NysDatepicker.prototype._parseLocalDate(value) : undefined,
      toAttribute: (value: Date | string | undefined) => {
        if (!value) return "";
        if (typeof value === "string") return value; // accept ISO string directly
        return value.toISOString().split("T")[0];
      },
    },
  })
  value: string | Date | undefined = undefined;

  @state() private datepickerIsOpen = false;

  private readonly DATEPICKER_GAP = 4;
  // private _calendarResizeObserver: ResizeObserver | null = null;
  private _hasUserInteracted = false; // need this flag for "eager mode"
  // True when the user edited the value (typing) since the last committed
  // nys-change; lets blur commit typed dates exactly once. Never set by
  // programmatic `value` writes.
  private _dirtySinceCommit = false;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals).
   */

  connectedCallback() {
    // super.connectedCallback() (NysFormControlElement) assigns an id when one
    // is not provided and reflects default semantics.
    super.connectedCallback();

    this.addEventListener("invalid", this._handleInvalid);
    this.addEventListener("focusin", this._handleFocus);
    this.addEventListener("focusout", this._handleBlur);
    this.addEventListener("keydown", this._onKeydownEsc);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopDatepickerPositioning();
    this.removeEventListener("invalid", this._handleInvalid);
    this.removeEventListener("focusin", this._handleFocus);
    this.removeEventListener("focusout", this._handleBlur);
    this.removeEventListener("keydown", this._onKeydownEsc);
  }

  async firstUpdated() {
    // This ensures our element always participates in the form
    this._setValue(this.value);

    if (this._shouldUseNativeDatepicker()) return;

    const datepicker = await this._whenWcDatepickerReady();
    if (!datepicker) return;

    // setTimeout is needed because the wc-datepicker needs to be rendered in first for the logics to work
    setTimeout(() => this._replaceButtonSVG(), 0);
    setTimeout(() => this._addMonthDropdownIcon(), 0);
    setTimeout(() => this._handleDateChange(), 0);
    setTimeout(() => this._onDocumentClick(), 0);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("value")) {
      const prev = changedProperties.get("value");
      const current = this.value;

      if (!current && prev !== current) {
        this.setFormValue("");
        this._manageRequire();
      } else if (current) {
        this._setValue(current); // handles both Date and string
      }
    }

    // Re-sync ElementInternals: `required` can arrive as a late property
    // write (e.g. a framework wrapper setting it post-hydration) with no
    // accompanying `value` change, so the branch above alone wouldn't catch
    // it. The `?required=${...}` template binding already keeps the native
    // <input>'s attribute in sync declaratively; without this,
    // ElementInternals would still report valid, the native `invalid` event
    // would never fire on submit, and showError would never flip even
    // though the field is genuinely required and empty.
    if (changedProperties.has("required") && !changedProperties.has("value")) {
      this._manageRequire();
    }
  }

  private async _whenWcDatepickerReady(): Promise<WcDatepicker | null> {
    await customElements.whenDefined("wc-datepicker");

    const datepicker = this.shadowRoot?.querySelector(
      "wc-datepicker",
    ) as WcDatepicker | null;

    if (!datepicker) return null;

    if ("updateComplete" in datepicker) {
      await (datepicker as any).updateComplete;
    }

    // Wait one frame to ensure layout and slot text are painted
    await new Promise((resolve) => requestAnimationFrame(resolve));

    return datepicker;
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
   * - _setValidityMessage: sync validation message with UI and internals
   * - _handleInvalid: handle form invalid event and focus first invalid field
   */

  private _setValue(value: Date | string | undefined) {
    if (!value) {
      this.value = undefined;
      this.setFormValue("");
      this._manageRequire();
      return;
    }

    const date = value instanceof Date ? value : this._parseLocalDate(value);

    const yyyyMmDd = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    this.value = date;
    this.setFormValue(yyyyMmDd);

    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.value = yyyyMmDd;
    }

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

    const isInvalid = this.required && !this.value;

    if (isInvalid) {
      // Store the component's own validation text; a consumer-supplied
      // errorMessage always wins via resolvedErrorMessage().
      this.internalValidationMessage = "This field is required.";
      this.setValidityFromState(
        { valueMissing: true },
        this.resolvedErrorMessage(),
        input,
      );
    } else {
      this.internalValidationMessage = "";
      this.clearValidity();
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

    this._manageRequire();

    let message = "";
    if (input.validity.valueMissing) {
      message = "This field is required.";
    } else {
      message = input.validationMessage;
    }
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
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    // Keep a manually-forced error visible when validation passes.
    if (!message && this.showError && this.errorMessage?.trim()) return;

    // Toggle the HTML <div> tag error message
    this.showError = !!message;
    // Store the component's own validation text; a consumer-supplied
    // errorMessage always wins via resolvedErrorMessage().
    this.internalValidationMessage = message;

    if (message) {
      this.setValidityFromState(
        { customError: true },
        this.resolvedErrorMessage(),
        input,
      );
    } else {
      this.clearValidity();
    }
  }

  // Handles native 'invalid' events
  private _handleInvalid(event: Event) {
    event.preventDefault();
    this._hasUserInteracted = true; // Start aggressive mode due to form submission
    this._validate();

    const innerInput = this.shadowRoot?.querySelector("input");
    if (innerInput) {
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
          innerInput.focus();
        }
      } else {
        // If not part of a form, simply focus.
        innerInput.focus();
      }
    }
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
  private _parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    // month is 0-indexed
    return new Date(year, month - 1, day);
  }

  private _setTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // force midnight consistency. Setting date start time is at 00:00:00
    this._setValue(today);
    this._setFocusOnTodayDate();
  }

  private async _setFocusOnTodayDate(visualFocusOnly = false) {
    if (this.minDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const min = this._parseLocalDate(this.minDate);
      if (today < min) return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // force midnight consistency. Setting date start time is at 00:00:00

    const yyyyMmDd = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const datepicker = this.shadowRoot?.querySelector("wc-datepicker");
    if (!datepicker) return;

    const todayCell = datepicker.querySelector(
      `td[data-date="${yyyyMmDd}"]`,
    ) as HTMLElement | null;
    if (!todayCell) return;

    if (!visualFocusOnly) {
      todayCell.focus();
    }
  }

  private _isOutOfRange(date: Date): boolean {
    if (this.minDate) {
      const min = this._parseLocalDate(this.minDate);
      if (date < min) return true;
    }
    if (this.maxDate) {
      const max = this._parseLocalDate(this.maxDate);
      if (date > max) return true;
    }
    return false;
  }

  // The current value normalized to a YYYY-MM-DD string (local time, no UTC
  // shift). Empty string when no date is set. This is the shape nys-change
  // always carries, regardless of whether `value` holds a Date or a string.
  private _valueAsString(): string {
    if (!this.value) return "";
    if (typeof this.value === "string") return this.value;
    return [
      this.value.getFullYear(),
      String(this.value.getMonth() + 1).padStart(2, "0"),
      String(this.value.getDate()).padStart(2, "0"),
    ].join("-");
  }

  private _dispatchInputEvent() {
    dispatchNysEvent<NysDatepickerInputDetail>(this, "nys-input", {
      id: this.id,
      name: this.name,
      value: this.value,
    });
  }

  // Commit the current value: fires nys-change and clears the dirty flag so
  // a later blur doesn't re-commit the same selection.
  private _dispatchChangeEvent() {
    this._dirtySinceCommit = false;
    dispatchNysEvent<NysDatepickerChangeDetail>(this, "nys-change", {
      id: this.id,
      name: this.name,
      value: this._valueAsString(),
    });
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private _handleInputKeydown(event: KeyboardEvent) {
    if (this.disabled || this._shouldUseNativeDatepicker()) return;

    if (event.key == " " || event.code == "Space") {
      event.preventDefault();
      this._openDatepicker();
    }

    if (event.key === "Escape" || event.code === "Escape") {
      event.preventDefault();
      const datepicker = this.shadowRoot?.querySelector("wc-datepicker");
      datepicker?.classList.remove("active");
    }
  }

  // Fires nys-focus only when focus enters the component from outside;
  // internal focus moves (input <-> calendar popup) don't re-fire it.
  private _handleFocus(event: FocusEvent) {
    const previous = event.relatedTarget as Node | null;
    const fromInside =
      previous &&
      (this.contains(previous) || this.shadowRoot?.contains(previous));
    if (fromInside) return;

    dispatchNysFocusBlur(this, "focus");
  }

  private _handleBlur(event: FocusEvent) {
    const nextFocused = event.relatedTarget as Node | null;

    const stillInside =
      nextFocused &&
      (this.contains(nextFocused) || this.shadowRoot?.contains(nextFocused));

    if (stillInside) return;

    // When datepicker has min/max range, the wc-datepicker nav button re-renders
    // at the boundary month and loses focus. Return early to prevent wc-datepicker from calling handleBlur again
    if (this.datepickerIsOpen && !nextFocused) {
      return;
    }

    if (!this._hasUserInteracted) {
      this._hasUserInteracted = true;
    }

    const datepicker = this.shadowRoot?.querySelector("wc-datepicker");
    datepicker?.classList.remove("active");
    this.datepickerIsOpen = false;

    this._validate();

    // A typed edit (valid date or cleared text) commits on blur.
    if (this._dirtySinceCommit) {
      this._dispatchChangeEvent();
    }

    dispatchNysFocusBlur(this, "blur");
    this.removeEventListener("keydown", this._handleFocusTrap);
  }

  // For when users click outside of the datepicker, we remove the calendar popup
  private _onDocumentClick() {
    if (this._shouldUseNativeDatepicker()) return;

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

  private _onKeydownEsc = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || event.code !== "Escape") return;
    if (!this.datepickerIsOpen) return;

    event.preventDefault();
    event.stopPropagation();

    const datepicker = this.shadowRoot?.querySelector("wc-datepicker");
    datepicker?.classList.remove("active");
    this.datepickerIsOpen = false;
    this.removeEventListener("keydown", this._handleFocusTrap);

    // Return focus to input
    const input = this.shadowRoot?.querySelector("input");
    input?.focus();
  };

  private _toggleDatepicker() {
    if (this.disabled) return;
    if (this._shouldUseNativeDatepicker()) {
      const input = this.shadowRoot?.querySelector(
        "input",
      ) as HTMLInputElement | null;

      if (input) input.focus();
      return;
    }

    const dateInput = this.shadowRoot?.querySelector("wc-datepicker");
    const isActive = dateInput?.classList.toggle("active");
    this.datepickerIsOpen = !!isActive;

    if (isActive) {
      if (!this.value) {
        this._setFocusOnTodayDate();
      }
      this._startDatepickerPositioning();
      this.addEventListener("keydown", this._handleFocusTrap);
    } else {
      this._stopDatepickerPositioning();
    }
  }

  private _openDatepicker() {
    if (this.disabled || this._shouldUseNativeDatepicker()) return;

    const datepicker = this.shadowRoot?.querySelector("wc-datepicker");
    if (!datepicker) return;

    // Following native focus behaviors where if no date is set on input, the calendar popup will focus on today's date
    if (!this.value) {
      this._setFocusOnTodayDate(true);
    }

    datepicker?.classList.add("active");
    this.datepickerIsOpen = true;
    this._startDatepickerPositioning();
    this.addEventListener("keydown", this._handleFocusTrap);
  }

  private _handleDateChange() {
    const datepicker = this.shadowRoot?.querySelector("wc-datepicker");
    if (!datepicker) return;

    // The "selectDate" event is a custom event from the wc-datepicker
    datepicker.addEventListener("selectDate", (event: Event) => {
      const dateString = (event as CustomEvent).detail; // format: YYYY-MM-DD
      const dateValue = this._parseLocalDate(dateString);

      if (this._isOutOfRange(dateValue)) {
        datepicker.classList.add("active");
        return;
      }

      this._setValue(dateValue);
      this._validate();

      this._dispatchInputEvent();
      this._dispatchChangeEvent();
      datepicker.classList.remove("active");
      this.datepickerIsOpen = false;
      this.removeEventListener("keydown", this._handleFocusTrap);
    });
  }

  private _handleTodayClick() {
    if (this.disabled) return;

    this._setTodayDate();
    this._hasUserInteracted = true;
    this._validate();
    this._dispatchInputEvent();
    this._dispatchChangeEvent();
  }

  private _handleClearClick() {
    if (this.disabled) return;

    this.value = undefined;
    this.setFormValue("");
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.value = "";
    }

    this._hasUserInteracted = true;
    this._validate();
    this._dispatchInputEvent();
    this._dispatchChangeEvent();
  }

  private _handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input) return;

    // Native datepicker sets incomplete or empty input to default the calendar popup focus as today's date.
    const date = this._getValidDateFromInput(input.value);
    if (!date) {
      // If input is completely empty, clear value
      if (!input.value) {
        if (this.value !== undefined) {
          this._dirtySinceCommit = true;
        }
        this.value = undefined;
        this.setFormValue("");
        if (this._hasUserInteracted) {
          this._validate();
        }
      }
      return;
    }

    if (input.value !== this._valueAsString()) {
      this._dirtySinceCommit = true;
    }
    this._setValue(date);

    // Much like nys-textinput, we validate with eager mode for user's input
    if (this._hasUserInteracted) {
      this._validate();
    }

    this._dispatchInputEvent();
  }

  private _getValidDateFromInput(value: string): Date | null {
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = dateRegex.exec(value);
    if (!match) return null;

    const year = Number(match[1]);

    // Reject partial / nonsense years caused by autocomplete (like 0002, 0190, etc).
    // Reasoning: without this check, autocomplete will occur for the 1st digit of the datepicker YYYY
    // (i.e. user starts typing 20.. but autocompletes as YYYY = 0002)
    if (year < 1000) return null;

    return this._parseLocalDate(value);
  }

  private _handleFocusTrap(event: KeyboardEvent) {
    if (!this.datepickerIsOpen) return;
    if (event.key !== "Tab") return;

    const calendarPopup = this.shadowRoot?.querySelector(
      ".wc-datepicker--container",
    ) as HTMLElement | null;

    if (!calendarPopup) return;

    const focusableSelectors = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ];

    const focusableElements: HTMLElement[] = [];

    // Add the "Today" and "Clear" <nys-button> if they exist
    calendarPopup.querySelectorAll<HTMLElement>("nys-button").forEach((btn) => {
      focusableElements.push(btn);
    });

    // Populating the focusableElements list in order of focus of the elements in wc-datepicker
    focusableElements.push(
      ...Array.from<HTMLElement>(
        calendarPopup.querySelectorAll(focusableSelectors.join(",")),
      ).filter((el) => el.offsetParent !== null),
    );

    if (focusableElements.length === 0) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = this.shadowRoot?.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab (go straight to last if we're at currently focus at first)
      if (activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      // Tab (go back to first focusable element if we're at last)
      if (activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  private _isSafari(): boolean {
    const ua = navigator.userAgent;
    return /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua);
  }

  /**
   * Determines whether the current device uses a coarse pointer.
   * A coarse pointer usually means touch-based input where precise pointing
   * is not expected, such as fingers on phones and most tablets.
   *
   * Note: This is not a guarantee of a mobile device.
   * Some non-mobile devices may also report a coarse pointer,
   * and some mobile devices may not.
   *
   * @returns `true` if the device reports a coarse pointer, otherwise `false`.
   */
  private _isMobile(): boolean {
    return window.matchMedia("(pointer: coarse)").matches;
  }

  private _shouldUseNativeDatepicker(): boolean {
    return this._isSafari() || this._isMobile();
  }

  /**
   * Auto-Positioning
   * --------------------------------------------------------------------------
   * Opens the calendar below the input by default. If there isn't enough
   * room below (and there's more room above), it opens above instead.
   */
  private _positionDatepicker() {
    const datepicker = this.shadowRoot?.querySelector("wc-datepicker");
    const inputContainer = this.shadowRoot?.querySelector(
      ".nys-datepicker--input-container",
    );

    const container = this.shadowRoot?.querySelector(
      ".nys-datepicker--container",
    );

    if (!datepicker || !inputContainer || !container) return;

    // Reset to default position
    datepicker.classList.remove("position-top"); // Used to flip the box-shadow direction.
    datepicker.style.top = "";

    const popupCalendarRect = datepicker?.getBoundingClientRect();
    const spaceBelow = window.innerHeight - popupCalendarRect?.bottom;

    // Popup runs past the bottom of the screen, then move it above the input instead.
    if (spaceBelow < this.DATEPICKER_GAP) {
      const inputRect = inputContainer.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const topAboveInput =
        inputRect.top -
        containerRect.top -
        popupCalendarRect.height -
        this.DATEPICKER_GAP;

      datepicker.style.top = `${topAboveInput}px`;
      datepicker.classList.add("position-top");
    }
  }

  private _handleScrollReposition = () => {
    if (this.datepickerIsOpen) {
      this._positionDatepicker();
    }
  };

  private _startDatepickerPositioning() {
    this._positionDatepicker();
    window.addEventListener("scroll", this._handleScrollReposition, true);
  }

  private _stopDatepickerPositioning() {
    window.removeEventListener("scroll", this._handleScrollReposition, true);
  }

  render() {
    const useNative = this._shouldUseNativeDatepicker();

    return html` <div class="nys-datepicker--container">
        <nys-label
          id="${this.id}--label"
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
            id=${this.id}
            class="nys-datepicker--input"
            type="date"
            min=${ifDefined(this.minDate || undefined)}
            max=${this.maxDate || "9999-12-31"}
            ?required=${this.required}
            .value=${this.value instanceof Date
              ? this.value.toISOString().split("T")[0]
              : this.value || ""}
            ?disabled=${this.disabled}
            aria-labelledby=${ifDefined(
              this.label ? this.id + "--label" : undefined,
            )}
            aria-label=${ifDefined(
              !this.label && this.ariaLabel ? this.ariaLabel : undefined,
            )}
            aria-disabled=${ifDefined(this.disabled ? "true" : undefined)}
            aria-required=${ifDefined(this.required ? "true" : undefined)}
            aria-invalid=${this.showError ? "true" : "false"}
            aria-errormessage=${this.id + "--error"}
            aria-describedby=${ifDefined(
              this.showError ? this.id + "--error" : undefined,
            )}
            @click=${this._openDatepicker}
            @input=${this._handleInputChange}
            @blur=${this._handleBlur}
            @keydown=${this._handleInputKeydown}
          />
          ${!useNative
            ? html`
                <button
                  id="calendar-button"
                  @click=${this._toggleDatepicker}
                  tabindex=${this.disabled ? "-1" : "0"}
                  ?disabled=${this.disabled}
                  aria-label="Open calendar"
                  aria-haspopup="dialog"
                  aria-controls="wc-datepicker-popup"
                  aria-expanded=${this.datepickerIsOpen ? "true" : "false"}
                >
                  <nys-icon name="calendar_month" size="24"></nys-icon>
                </button>
              `
            : null}
        </div>

        <div class="wc-datepicker--container">
          <wc-datepicker
            id="wc-datepicker-popup"
            locale="en-US"
            .value=${this.value instanceof Date
              ? this.value
              : this.value
                ? this._parseLocalDate(this.value)
                : undefined}
            ?disabled=${this.disabled}
            start-date=${ifDefined(this.startDate ? this.startDate : undefined)}
            min-date=${ifDefined(this.minDate || undefined)}
            max-date=${ifDefined(this.maxDate || undefined)}
            role="dialog"
            aria-modal=${this.datepickerIsOpen ? "true" : "false"}
          >
            ${!this.hideTodayButton || !this.hideClearButton
              ? html`
                  <div class="wc-datepicker--button-container">
                    ${!this.hideTodayButton
                      ? html`
                          <nys-button
                            label="Today"
                            size="sm"
                            fullWidth
                            variant="outline"
                            ?disabled=${this.disabled}
                            @nys-click=${this._handleTodayClick}
                          ></nys-button>
                        `
                      : null}
                    ${!this.hideClearButton
                      ? html`
                          <nys-button
                            label="Clear"
                            size="sm"
                            fullWidth
                            variant="outline"
                            ?disabled=${this.disabled}
                            @nys-click=${this._handleClearClick}
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
        id=${this.id + "--error"}
        ?showError=${this.showError}
        errorMessage=${this.resolvedErrorMessage()}
      ></nys-errormessage>`;
  }
}

if (!customElements.get("nys-datepicker")) {
  customElements.define("nys-datepicker", NysDatepicker);
}

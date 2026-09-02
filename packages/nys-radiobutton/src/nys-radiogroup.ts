import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import {
  NysFormControlElement,
  dispatchNysEvent,
  dispatchNysFocusBlur,
} from "@nysds/internals";
import type { NysRadiobutton } from "./nys-radiobutton";
// These internal elements are rendered inside this component's shadow DOM, so
// they must be registered whenever nys-radiogroup is used. Importing them here
// (intentional side effect) guarantees the visible label and error message —
// which the accessible name/error association depends on — always render.
// nys-textinput renders the "other" free-text field for a checked "other" radio.
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-textinput";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-radiobutton.scss?inline";

/** Detail payload for the `nys-change` event fired by `nys-radiogroup`. */
export interface NysRadiogroupChangeDetail {
  /** Id of the selected child radiobutton (kept for 1.x compatibility). */
  id: string;
  /** Checked state of the selected child radiobutton (always `true`). */
  checked: boolean;
  /** Name of the selected child radiobutton, which the group adopts. */
  name: string;
  /** The group's selected value. */
  value: string;
}

/** The `nys-change` event fired by `nys-radiogroup`. */
export type NysRadiogroupChangeEvent = CustomEvent<NysRadiogroupChangeDetail>;

/** Detail payload for the `nys-other-input` event fired by `nys-radiogroup`. */
export interface NysRadiogroupOtherInputDetail {
  /** Id of the "other" child radiobutton. */
  id: string;
  name: string;
  /** Current text of the "other" free-text field. */
  value: string;
}

/** The `nys-other-input` event fired by `nys-radiogroup`. */
export type NysRadiogroupOtherInputEvent =
  CustomEvent<NysRadiogroupOtherInputDetail>;

/**
 * A container for grouping `nys-radiobutton` elements as a single form control with enforced single selection.
 * Handles keyboard navigation (arrow keys), validation, required constraints, and form integration.
 *
 * Use to let users select exactly one option from 2-6 choices. Apply `tile` and `size` to the group
 * and all children inherit these styles automatically. For 7+ options, use `nys-select`.
 *
 * @summary Container for grouping radio buttons as a single form control.
 * @element nys-radiogroup
 * @formControl value nys-change
 *
 * @slot - Default slot for `nys-radiobutton` elements.
 * @slot description - Custom HTML description content.
 *
 * @fires {NysRadiogroupChangeEvent} nys-change - Fired when the selection changes. Detail: `{id, checked, name, value}` — `value` is the selected value; `id`, `checked`, and `name` echo the selected child radio for compatibility. Bubbles and composed.
 * @fires {NysRadiogroupOtherInputEvent} nys-other-input - Fired as the "other" free-text input changes. Detail: `{id, name, value}`. Bubbles and composed.
 * @fires {Event} nys-focus - Fired on the group when focus enters it from outside; also re-dispatched targeted at the focused child radio for compatibility. Bubbles and composed.
 * @fires {Event} nys-blur - Fired on the group when focus leaves it; also re-dispatched targeted at the blurred child radio for compatibility. Bubbles and composed.
 *
 * @example Basic
 * ```html
 * <nys-radiogroup label="Select borough" required>
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="manhattan" label="Manhattan"></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 *
 * @example Tile
 * ```html
 * <nys-radiogroup label="Select borough" tile>
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 *
 * @example Required
 * ```html
 * <nys-radiogroup label="Select borough" required>
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 *
 * @example Optional
 * ```html
 * <nys-radiogroup label="Select borough" optional>
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 *
 * @example Disabled
 * ```html
 * <nys-radiogroup label="Select borough">
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx" disabled></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn" disabled></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 *
 * @example Size Small
 * ```html
 * <nys-radiogroup label="Select borough" size="sm">
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 *
 * @example Other Option
 * ```html
 * <nys-radiogroup label="Select borough">
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="" label="Other" other></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 *
 * @example Error Message
 * ```html
 * <nys-radiogroup label="Select borough" showError errorMessage="Please select a borough">
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 *
 * @example Description
 * ```html
 * <nys-radiogroup label="Select borough" description="Your primary residence in NYC.">
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 *
 * @example Description Slot
 * ```html
 * <nys-radiogroup label="What is your primary work location?">
 *  <label slot="description">This is the location you use for your <a href="https://www.ny.gov/" target="__blank">in office days.</a></label>
 *  <nys-radiobutton name="office" label="Albany" value="albany">
 *    <label slot="description">A part of <a href="https://www.ny.gov/" target="__blank">Upstate New York</a></label>
 *   </nys-radiobutton>
 *  <nys-radiobutton name="office" label="Manhattan" value="manhattan">
 *    <label slot="description">A part of <a href="https://www.ny.gov/" target="__blank">New York City</a></label>
 *   </nys-radiobutton>
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

  // Whether the "other" free-text field is in an error state. Internal
  // coordination state, not a consumer input.
  @state() private _showOtherError = false;

  private _value: string | null = null;

  // Guards the value accessor: true while the group syncs `value` from a
  // child selection, so the setter doesn't push the same state back down.
  private _syncingValueFromChildren = false;

  /**
   * Value of the selected child radiobutton, or `""` when none is selected.
   * Setting it programmatically checks the matching child and updates the
   * form value without firing `nys-change`. Setting `""` clears the selection.
   */
  @property({ attribute: false })
  get value(): string {
    return this._value ?? "";
  }

  set value(next: string) {
    const old = this._value ?? "";
    this._value = next === "" || next == null ? null : next;
    if (!this._syncingValueFromChildren) {
      this._applyValueToChildren();
    }
    this.requestUpdate("value", old);
  }
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

  // The host is the semantic grouping element: expose role="radiogroup" on the
  // host's accessibility node via the shared ReflectsAriaMixin instead of a
  // hand-attached ElementInternals.
  protected get defaultRole(): string | null {
    return "radiogroup";
  }

  connectedCallback() {
    super.connectedCallback();

    this._mobileQuery = window.matchMedia("(max-width: 479px)");
    this.isMobile = this._mobileQuery.matches;
    this._mobileQuery.addEventListener("change", this._handleMobileQuery);

    this.addEventListener("invalid", this._handleInvalid);
    this.addEventListener("focusin", this._handleHostFocusIn);
    this.addEventListener("focusout", this._handleHostFocusOut);

    this._childObserver = new MutationObserver(() => {
      this._radios = this._getAllRadios();
      this.requestUpdate();
    });
    this._childObserver.observe(this, { childList: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("invalid", this._handleInvalid);
    this.removeEventListener("focusin", this._handleHostFocusIn);
    this.removeEventListener("focusout", this._handleHostFocusOut);
    this._mobileQuery.removeEventListener("change", this._handleMobileQuery);

    this._childObserver?.disconnect();
  }

  async firstUpdated() {
    await this.updateComplete;

    this._radios = this._getAllRadios();

    this._syncValueFromChildren();
    this._setValue(); // This ensures our element always participates in the form
    this._setRadioButtonRequire();
    this._updateRadioButtonsSize();
    this._getSlotDescriptionForAria();
    this._initializeChildAttributes();

    this._updateGroupTabIndex();
  }

  updated(changedProperties: Map<string | symbol, unknown>) {
    if (changedProperties.has("required") || changedProperties.has("value")) {
      if (!this.showError) {
        this._manageRequire();
      }
    }
    if (changedProperties.has("size")) {
      this._updateRadioButtonsSize();
    }
    this._updateGroupTabIndex();
    this._forwardRadioDescriptions();
  }

  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */

  private _setValue() {
    this.setFormValue(this._value);
  }

  /**
   * Set `value` from a child selection without pushing the same state back
   * down (and without firing `nys-change`).
   */
  private _setValueFromChild(next: string | null) {
    this._syncingValueFromChildren = true;
    this.value = next ?? "";
    this._syncingValueFromChildren = false;
  }

  /**
   * Apply a programmatically set `value` to the child radiobuttons and the
   * form value. Setting `checked` on a child never fires `nys-change` (only
   * user interaction does), so no change events echo back.
   */
  private _applyValueToChildren() {
    this._getAllRadios().forEach((radio) => {
      radio.checked = this._value !== null && radio.value === this._value;
    });
    this.setFormValue(this._value);
  }

  /**
   * Derive `value` from the currently checked child. Runs off the default
   * slot's `slotchange`, so it covers first render and dynamically added
   * radios without scheduling work inside the update cycle.
   */
  private _syncValueFromChildren() {
    const checkedRadio = this._getAllRadios().find(
      (radio) => radio.checked || radio.hasAttribute("checked"),
    );
    this._setValueFromChild(checkedRadio ? checkedRadio.value : null);
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
    const radioButtons = Array.from(this.querySelectorAll("nys-radiobutton"));
    const firstRadio = radioButtons[0] as HTMLElement;

    if (firstRadio) {
      const shadowInput = this.shadowRoot?.querySelector<HTMLElement>(
        `#input-${(firstRadio as NysRadiobutton).id}`,
      );
      if (this.required && !this._value) {
        this.internalValidationMessage = "Please select an option.";
        this.setValidityFromState(
          { valueMissing: true },
          this.resolvedErrorMessage(),
          shadowInput ?? firstRadio, // pass the custom element, not shadow input
        );
      } else {
        this.showError = false;
        this.internalValidationMessage = "";
        this.clearValidity();
      }
    }
  }

  // checkValidity()/reportValidity() come from NysFormControlElement and
  // consult ElementInternals, matching the sibling form controls. The
  // internals validity is kept current by _manageRequire and
  // _validateOtherAndEmitError.

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

    this._setValueFromChild(null);
    this.setFormValue(null);

    // Reset validation UI. Clears only the component-owned validation text; a
    // consumer-supplied errorMessage is never overwritten.
    this.showError = false;
    this.internalValidationMessage = "";
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
    this._syncValueFromChildren();
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
    this._setValueFromChild(radiobtn.value);
    this.setFormValue(radiobtn.value);
    this.internalValidationMessage = "";
    this.clearValidity();
    this.showError = false;

    this._updateGroupTabIndex();
    this.requestUpdate();

    dispatchNysEvent<NysRadiogroupChangeDetail>(this, "nys-change", {
      id: radiobtn.id,
      checked: radiobtn.checked,
      name: radiobtn.name,
      value: radiobtn.value,
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

  private _forwardRadioDescriptions() {
    // Note to self: future rework to "eat our own dog food"
    // for the new revamp radiobutton (1.19..4) will render this function useless.
    this._radios.forEach((radiobtn) => {
      const slotted = radiobtn.querySelector<HTMLElement>(
        ':scope > [slot="description"]',
      );
      if (!slotted) return;

      const label = this.shadowRoot?.querySelector(`#${radiobtn.id}-label`);
      if (!label) return;

      // appendChild is a no-op move if it's already there — safe to call every render
      if (slotted.parentElement !== label) {
        label.appendChild(slotted);
      }
    });
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
        const input = this.shadowRoot?.querySelector<HTMLElement>(
          `#input-${firstEnabledRadio.id}`,
        );
        input?.focus();
        input?.classList.add("nys-radiobutton__radio--invalid-focus");
      };

      // Focus only if this is the first invalid element (top-down approach)
      const form = this.internals?.form;
      if (form) {
        const elements = Array.from(form.elements) as Array<
          HTMLElement & { checkValidity?: () => boolean }
        >;

        // Find the first element in the form that is invalid. Radiogroups are
        // evaluated from their children instead of via checkValidity():
        // checkValidity() consults ElementInternals, which re-dispatches
        // `invalid` and would re-enter this handler.
        const firstInvalidElement = elements.find((element) => {
          if (element.tagName.toLowerCase() === "nys-radiogroup") {
            const group = element as NysRadiogroup;
            const radios = Array.from(
              group.querySelectorAll("nys-radiobutton"),
            ) as NysRadiobutton[];
            return group.required && !radios.some((radio) => radio.checked);
          }
          return (
            typeof element.checkValidity === "function" &&
            !element.checkValidity()
          );
        });
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
    this._setValueFromChild(input.value);
    this.setFormValue(input.value);

    if (this._hasUserInteracted) {
      this._validateOtherAndEmitError(radiobtn);
    }

    dispatchNysEvent<NysRadiogroupOtherInputDetail>(this, "nys-other-input", {
      id: radiobtn.id,
      name: radiobtn.name,
      value: radiobtn.value,
    });
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
      this.internalValidationMessage = "Please enter a value for this option.";
      this.setValidityFromState(
        {
          customError: true,
        },
        this.resolvedErrorMessage(),
        shadowInput ?? (radiobtn as HTMLElement),
      );
      this.showError = true;
    } else {
      this.internalValidationMessage = "";
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

  /** True when `node` is inside this group, including its shadow DOM. */
  private _containsFocus(node: Node | null): boolean {
    return (
      !!node &&
      (node === this ||
        this.contains(node) ||
        !!this.shadowRoot?.contains(node))
    );
  }

  /**
   * Group-level focus: fired only when focus enters from outside the group,
   * so moving between the radios stays silent. The per-radio `nys-focus`
   * re-dispatches (targeted at the child) are kept for compatibility.
   */
  private _handleHostFocusIn = (event: FocusEvent) => {
    if (!this._containsFocus(event.relatedTarget as Node | null)) {
      dispatchNysFocusBlur(this, "focus");
    }
  };

  /** Group-level blur: fired only when focus leaves the group entirely. */
  private _handleHostFocusOut = (event: FocusEvent) => {
    if (!this._containsFocus(event.relatedTarget as Node | null)) {
      dispatchNysFocusBlur(this, "blur");
    }
  };

  private _handleRadiobtnFocus(radiobtn: NysRadiobutton) {
    radiobtn.dispatchEvent(
      new CustomEvent("nys-focus", { bubbles: true, composed: true }),
    );
  }

  private _handleRadiobtnBlur(radiobtn: NysRadiobutton) {
    const input = this.shadowRoot?.querySelector<HTMLElement>(
      `#input-${radiobtn.id}`,
    );
    input?.classList.remove("nys-radiobutton__radio--invalid-focus");

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
                    aria-invalid=${this.showError ? "true" : "false"}
                    aria-errormessage=${`${this.id}--error`}
                    aria-describedby=${ifDefined(
                      this.showError ? `${this.id}--error` : undefined,
                    )}
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
                  </nys-label>`}
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
                          aria-invalid=${radiobtn.showOtherError ||
                          this._showOtherError
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
          errorMessage=${this.resolvedErrorMessage()}
          .showDivider=${!this.tile}
        ></nys-errormessage>
      </fieldset>`;
  }
}

if (!customElements.get("nys-radiogroup")) {
  customElements.define("nys-radiogroup", NysRadiogroup);
}

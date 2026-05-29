import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import "./nys-radiogroup";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-radiobutton.scss?inline";

let radiobuttonIdCounter = 0;

/**
 * A radio button for single selection within a `nys-radiogroup`. Only one radio with the same `name` can be checked.
 *
 * **Must be used within `nys-radiogroup`** to function properly. Use for 2-6 mutually exclusive options. For 7+ options, use `nys-select`.
 * For multiple selections, use `nys-checkbox` group. A unique ID is auto-generated if not provided.
 *
 * ## When to use
 * - When the user needs to select only one option from a list of mutually exclusive choices.
 * - When there are 2-6 options to choose from (for better usability and visibility).
 * - Group radio buttons vertically for easier scanning, especially when labels are lengthy.
 * - Use a clear default selection if applicable (e.g., the most common or recommended choice).
 * - Provide descriptive and concise labels for each option.
 * - Group related radio buttons with a heading or contextual instructions to clarify the choice.
 *
 * ## When to consider something else
 * - When users need to select multiple options, use `nys-checkbox` group instead.
 * - When there are more than 7 options, use `nys-select` (dropdown) for better space utilization.
 * - Do not use radio buttons for yes/no questions; use a toggle or single checkbox instead.
 * - Do not overload the user with too many radio button options; simplify or use a dropdown if needed.
 * - Do not leave all radio buttons unselected if a default selection would help guide users.
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Always wrap a group of `<nys-radiobutton>` with a `<nys-radiogroup>`.
 * - Group radio buttons vertically for easier scanning, especially when labels are lengthy.
 * - Set a clear default when one choice is recommended or most common.
 * - Use concise, descriptive labels for each option.
 * - Group related options under a heading or instruction to provide context.
 *
 * **Don't:**
 * - Use radio buttons for yes/no questions (consider using `<nys-toggle>` or `<nys-checkbox>`).
 * - Overload users with too many options; simplify or use a dropdown instead.
 * - Leave all options unselected if a helpful default can guide users.
 *
 * ## Size variants
 * Radio button sizes are controlled by the `size` prop on the parent `nys-radiogroup`:
 * - `sm`: 24px in width and height (compact, for dense layouts)
 * - `md`: 32px in width and height (default, standard size)
 *
 * ## Tile variant
 * The `tile` prop on `nys-radiogroup` changes all radio buttons to a tile style with a larger clickable area.
 * Useful when you want to make each option more visually distinct and easier to click.
 * Note: The `tile` prop is applied to the `nys-radiogroup` component, not individual `nys-radiobutton` elements.
 *
 * ## Other option
 * The `other` prop on a `nys-radiobutton` allows users to enter a custom value when none of the listed choices apply.
 * When selected, a text input appears below the radio button, and the radio's `value` is set to the entered text.
 * - If no `label` is provided, the default label is "Other".
 * - You may optionally supply a custom `label` to better match the context (e.g., "Something else", "Other (please specify)").
 * - Place the "other" option as the **last** `<nys-radiobutton>` within `<nys-radiogroup>`.
 * - The text input validates on blur; empty text is invalid and emits an `nys-error` event.
 *
 * ## Partial editable options
 * Disable specific radio options while keeping others interactive by setting the `disabled` prop on individual `nys-radiobutton` elements.
 * Disabled radios cannot be selected but remain visible to the user.
 *
 * ## Error handling
 * Validation and error messages are managed by the parent `nys-radiogroup`. To display an error:
 * - Pass `showError` to the `nys-radiogroup` component.
 * - Setting `errorMessage` alone does not display the error; `showError` must be true.
 *
 * ## Important rules
 * - **All `<nys-radiobutton>` elements of the same group must be wrapped in a `<nys-radiogroup>`** component in order to work properly.
 * - Radio buttons share a `name` attribute within a group, making them mutually exclusive at the HTML level.
 * - If `checked="true"` is assigned to multiple options in a `radiogroup`, only the **last** option will take the `true` state.
 * - Each radio button requires a unique `id`; if not provided, a unique ID is auto-generated.
 *
 * ## Content guidelines
 * - Provide clear, concise labels that describe each option.
 * - Use descriptions for additional context or examples (via the `description` prop or description slot).
 * - Keep labels short; use descriptions for longer explanations.
 * - Use the "other" option sparingly; offer specific choices whenever possible.
 *
 * @accessibility
 * The `nys-radiobutton` component includes the following accessibility-focused features:
 * - **ARIA Attributes**: Proper ARIA roles and attributes to ensure screen readers can interpret the radio button correctly:
 *   - `role="radio"` on the visual radio control
 *   - `aria-checked` indicates selection state
 *   - `aria-disabled` indicates disabled state
 *   - `aria-required` indicates if the group is required
 *   - `aria-labelledby` links to the label
 * - **Keyboard Navigation**: Arrow keys to move between radios in a group, Space/Enter to select, Tab to navigate to/from the group.
 * - **Visual Focus Indicators**: Clear focus state on the selected radio button.
 * - **Label Association**: Labels are automatically associated with the radio button via the `aria-labelledby` attribute.
 *
 * ## Dependencies
 *
 * This component depends on the following NYS Design System components:
 *
 *   - `nys-label`
 *   - `nys-errormessage`
 *
 * @summary Radio button for single selection from mutually exclusive options within a radiogroup.
 * @element nys-radiobutton
 *
 * @slot description - Custom HTML description content.
 *
 * @fires nys-change - Fired when selection changes. Detail: `{id, checked, name, value}`.
 * @fires nys-focus - Fired when radio gains focus.
 * @fires nys-blur - Fired when radio loses focus.
 * @fires nys-other-input - Fired when "other" text input value changes. Detail: `{id, name, value}`.
 *
 * @example Radio group
 * ```html
 * <nys-radiogroup label="Select borough" required>
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 *
 * @example Listen for change events
 * ```js
 * const radiobutton = document.querySelector('nys-radiobutton');
 * radiobutton.addEventListener('nys-change', (event) => {
 *   const { id, checked, name, value } = event.detail;
 *   console.log(`Radiobutton (${id}) in group "${name}" is ${value}, checked: ${checked}`);
 * });
 * radiobutton.addEventListener('nys-focus', () => {
 *   console.log('Radiobutton is focused');
 * });
 * radiobutton.addEventListener('nys-blur', () => {
 *   console.log('Radiobutton lost focus');
 * });
 * ```
 *
 * @example Radio group with "other" option
 * ```html
 * <nys-radiogroup label="Select an option">
 *   <nys-radiobutton name="choice" value="option1" label="Option 1"></nys-radiobutton>
 *   <nys-radiobutton name="choice" value="option2" label="Option 2"></nys-radiobutton>
 *   <nys-radiobutton name="choice" other label="Other (please specify)"></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 */

export class NysRadiobutton extends LitElement {
  static styles = unsafeCSS(styles);
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Whether this radio is selected. Only one per group can be checked. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Prevents interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Marks group as required. Set on radiogroup, not individual radios. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Visible label text. Required for accessibility. */
  @property({ type: String }) label = "";

  /** Helper text below label. Use slot for custom HTML. */
  @property({ type: String }) description = "";

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Group name. Radios with same name are mutually exclusive. */
  @property({ type: String, reflect: true }) name = "";

  /** Value submitted when this radio is selected. */
  @property({ type: String }) value = "";

  /** Form `id` to associate with. */
  @property({ type: String, reflect: true }) form: string | null = null;

  /**
   * Radio size: `sm` (24px) or `md` (32px, default).
   * @default "md"
   */
  @property({ type: String, reflect: true }) size: "sm" | "md" = "md";

  /** Renders as tile with larger clickable area. */
  @property({ type: Boolean, reflect: true }) tile = false;
  @property({ type: Boolean, reflect: true }) other = false;
  @property({ type: Boolean }) showOtherError = false;

  @state() private isMobile = window.innerWidth < 480;

  private _hasUserInteracted = false; // need this flag for "eager mode"

  static buttonGroup: Record<string, NysRadiobutton> = {};

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-radiobutton-${Date.now()}-${radiobuttonIdCounter++}`;
    }

    // If this button is initially checked, set it as the current button in its group
    if (this.checked) {
      if (NysRadiobutton.buttonGroup[this.name]) {
        NysRadiobutton.buttonGroup[this.name].checked = false;
        NysRadiobutton.buttonGroup[this.name].requestUpdate();
      }
      NysRadiobutton.buttonGroup[this.name] = this;
    }

    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
    this.addEventListener("click", this._handleChange);
    window.addEventListener("resize", this._handleResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener("focus", this._handleFocus);
    this.removeEventListener("blur", this._handleBlur);
    window.removeEventListener("resize", this._handleResize);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    // When "checked" changes, update the internals.
    if (changedProperties.has("checked")) {
      const wasChecked = changedProperties.get("checked") as
        | boolean
        | undefined;

      // If this radio was unchecked, clear "other" error state
      if (wasChecked && !this.checked) {
        this._clearOtherState();
      }

      // Ensure only one radiobutton per group is checked.
      if (this.checked && NysRadiobutton.buttonGroup[this.name] !== this) {
        if (NysRadiobutton.buttonGroup[this.name]) {
          NysRadiobutton.buttonGroup[this.name].checked = false;
          NysRadiobutton.buttonGroup[this.name].requestUpdate();
        }
        NysRadiobutton.buttonGroup[this.name] = this;
      }
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  public async getInputElement(): Promise<HTMLInputElement | null> {
    await this.updateComplete; // Wait for the component to finish rendering
    return this.shadowRoot?.querySelector("input") || null;
  }

  // This callback is automatically called when the parent form is reset.
  public formResetUpdate() {
    this.checked = false;
    this._clearOtherState();

    if (NysRadiobutton.buttonGroup[this.name] === this) {
      delete NysRadiobutton.buttonGroup[this.name];
    }

    // Re-render UI
    this.requestUpdate();
  }

  private _handleResize = () => {
    this.isMobile = window.innerWidth < 480;
  };

  private _clearOtherState() {
    if (!this.other) return;

    this.showOtherError = false;
    this._hasUserInteracted = false;

    // Optional: clear error at the group level
    this._dispatchClearErrorEvent();
  }

  private _dispatchClearErrorEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-error-clear", {
        detail: {
          id: this.id,
          name: this.name,
          type: "other",
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private _emitChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: {
          id: this.id,
          checked: this.checked,
          name: this.name,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _emitOtherInputEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-other-input", {
        detail: {
          id: this.id,
          name: this.name,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Handle radiobutton change event & un-selection of other radio options in group
  private async _handleChange() {
    this.showOtherError = false;

    if (!this.checked && !this.disabled) {
      if (NysRadiobutton.buttonGroup[this.name]) {
        NysRadiobutton.buttonGroup[this.name].checked = false;
        NysRadiobutton.buttonGroup[this.name].requestUpdate();
      }
      NysRadiobutton.buttonGroup[this.name] = this;

      this.checked = true;
      this._validateOtherAndEmitError();
      this._emitChangeEvent();
    }
  }

  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(
      new Event("nys-focus", { bubbles: true, composed: true }),
    );
  }

  // Handle blur event
  private _handleBlur() {
    this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true }),
    );

    setTimeout(() => {
      // Only validate if we're blurring away from the component entirely
      // and this is an "other" radio that's checked
      if (this.other && this.checked) {
        this._hasUserInteracted = true;
        this._validateOtherAndEmitError();
      }
    }, 50);
  }

  private _callInputHandling() {
    if (this.disabled) return;

    // Find the hidden input and trigger a click to toggle selection
    const input = this.shadowRoot?.querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
    const span = this.shadowRoot?.querySelector(
      ".nys-radiobutton__radio",
    ) as HTMLElement;

    if (input) {
      input.click();
      span?.focus();
    }
  }

  private _handleTextInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let newValue = input.value;
    this.value = newValue;

    if (this._hasUserInteracted) {
      this._validateOtherAndEmitError();
    }

    this._emitOtherInputEvent();
  }

  private _handleTextInputBlur() {
    this._hasUserInteracted = true;
    this._validateOtherAndEmitError();
  }

  private _validateOtherAndEmitError() {
    if (!this.other) return;

    if (!this.checked || !this._hasUserInteracted) {
      this.showOtherError = false;
      return;
    }

    const isInvalid = this.value.trim() === "";
    this.showOtherError = isInvalid;

    if (isInvalid) {
      this.dispatchEvent(
        new CustomEvent("nys-error", {
          detail: {
            id: this.id,
            name: this.name,
            type: "other",
            message: "Please enter a value for this option.",
            sourceRadio: this,
          },
          bubbles: true,
          composed: true,
        }),
      );
    } else {
      this._dispatchClearErrorEvent();
    }
  }

  private _handleOtherKeydown(e: KeyboardEvent) {
    if (e.key == "Space" || e.key === " ") {
      e.stopPropagation();
    }
  }

  render() {
    return html`
      <input
        type="radio"
        name="${ifDefined(this.name ? this.name : undefined)}"
        .checked=${this.checked}
        ?disabled=${this.disabled}
        .value=${this.value}
        ?required="${this.required}"
        form=${ifDefined(this.form || undefined)}
        @change="${this._handleChange}"
        aria-hidden="true"
        hidden
        class="sr-only"
      />
      <div class="nys-radiobutton" @click="${this._callInputHandling}">
        <div class="nys-radiobutton__main-container">
          <span
            role="radio"
            class="nys-radiobutton__radio"
            tabindex="0"
            aria-labelledby="${this.id}-label"
            aria-checked="${this.checked}"
            aria-required="${this.required}"
            aria-disabled="${this.disabled}"
            title="${this.label}"
          ></span>
          ${(this.label || this.other) &&
          html`<nys-label
            aria-hidden="true"
            id="${this.id}-label"
            label="${this.label || (this.other ? "Other" : "")}"
            description=${ifDefined(this.description || undefined)}
          >
            <slot name="description" slot="description"
              >${this.description}</slot
            >
          </nys-label> `}
        </div>
        <div class="nys-radiobutton__other-container">
          ${this.other && this.checked
            ? html`
                <nys-textinput
                  .value=${this.value}
                  id=${"radiobutton-other-" + this.id}
                  @nys-input=${this._handleTextInput}
                  @nys-blur=${this._handleTextInputBlur}
                  @keydown=${this._handleOtherKeydown}
                  @nys-focus=${() => this.classList.remove("focused")}
                  ariaLabel="Other"
                  aria-invalid=${this.showOtherError ? "true" : "false"}
                  width=${this.isMobile ? "full" : "md"}
                  ?disabled=${this.disabled}
                ></nys-textinput>
              `
            : ""}
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-radiobutton")) {
  customElements.define("nys-radiobutton", NysRadiobutton);
}

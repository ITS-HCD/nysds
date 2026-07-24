import { LitElement, html } from "lit";
import { property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-radiobutton.light.scss?inline";

let radiobuttonIdCounter = 0;

let _lightSheet: CSSStyleSheet | null = null;
// Injects the lightDOM styling for the scss for
// styling CSS into the adopted/constructed stylesheet.
function adoptLightStyles() {
  if (_lightSheet || typeof document === "undefined") return;
  _lightSheet = new CSSStyleSheet();
  _lightSheet.replaceSync(lightStyles);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, _lightSheet];
}

/**
 * A radio button for single selection within a `nys-radiogroup`. Only one radio with the same `name` can be selected.
 *
 * Use within `nys-radiogroup` for 2-6 mutually exclusive options. For 7+ options, use `nys-select`.
 * For multiple selections, use `nys-checkbox`.
 *
 * @summary Radio button for single selection from mutually exclusive options.
 * This is a READONLY data component when there is no `nys-radiogroup` wrapping the `nys-radiobutton`.
 * Otherwise this radiobutton mockup the native grouping of radio buttons via "name" attribute.
 * Since we can't do that naturally, we have supporting functions to keep track of keyboard navigation, a11y VO, and single radiobutton checked at all times.
 *
 * @element nys-radiobutton
 *
 * @slot description - Custom HTML description content.
 *
 * @fires nys-change - Fired when selection changes. Detail: `{id, checked, name, value}`.
 * @fires nys-focus - Fired when radio gains focus.
 * @fires nys-blur - Fired when radio loses focus.
 * @fires nys-other-input - Fired when "other" text input value changes. Detail: `{id, name, value}`.
 *
 *
 * @example Pre-selected
 * ```html
 * <nys-radiogroup label="Select borough">
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx" checked></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 *
 * @example No group
 * ```html
 *   <nys-radiobutton name="borough" value="queens" label="Queens" checked description="Includes Flushing and Astoria"></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="manhattan" label="Manhattan" checked>
 *     <span slot="description">Home to <strong>Central Park</strong></span>
 *   </nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
 * ```
 *
 * @example Pre-selected
 * ```html
 * <nys-radiogroup label="Select borough">
 *   <nys-radiobutton name="borough" value="bronx" label="The Bronx" checked></nys-radiobutton>
 *   <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
 * </nys-radiogroup>
 * ```
 *
 * /**
 * @example Standalone, one per table row
 * ```html
 * <nys-table striped bordered>
 *   <table>
 *     <caption>
 *       Select the highest priority application for review
 *     </caption>
 *     <tr>
 *       <th>Application</th>
 *       <th>Priority</th>
 *     </tr>
 *     <tr>
 *       <td>SNAP Benefits</td>
 *       <td>
 *         <nys-radiobutton
 *           name="priority-application"
 *           value="snap"
 *           label="Select SNAP Benefits"
 *         ></nys-radiobutton>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>Child Care Assistance</td>
 *       <td>
 *         <nys-radiobutton
 *           name="priority-application"
 *           value="child-care"
 *           label="Select Child Care Assistance"
 *         ></nys-radiobutton>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>HEAP</td>
 *       <td>
 *         <label>Brooklyn</label>
 *         <input type="radio" name="group" value="Brooklyn"></input>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>Medicaid</td>
 *       <td>
 *         <label>Manhattan</label>
 *         <input type="radio" name="group" value="Manhattan"></input>
 *       </td>
 *     </tr>
 *   </table>
 * </nys-table>
 * ```
 */

export class NysRadiobutton extends LitElement {
  // static styles = unsafeCSS(styles);
  // static shadowRootOptions = {
  //   ...LitElement.shadowRootOptions,
  //   delegatesFocus: true,
  // };

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

  @query("input") private _inputEl!: HTMLInputElement;

  private _internals: ElementInternals;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  static formAssociated = true;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  protected createRenderRoot() {
    return this; // render() output lands directly in light DOM, no shadow root at all
  }

  connectedCallback() {
    super.connectedCallback();
    adoptLightStyles();

    if (!this.id) {
      this.id = `nys-radiobutton-${Date.now()}-${radiobuttonIdCounter++}`;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("invalid", this._handleInvalid);
  }

  firstUpdated() {
    if (!this._isGrouped()) {
      this._updateGroupValidity();
      this._forwardDescriptionSlot();
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("checked")) {
      this._internals.ariaChecked = String(this.checked);
    }

    if (changedProperties.has("disabled")) {
      this._internals.ariaDisabled = String(this.disabled);
    }

    if (changedProperties.has("required")) {
      this._internals.ariaRequired = String(this.required);
    }

    if (
      changedProperties.has("checked") ||
      changedProperties.has("value") ||
      changedProperties.has("disabled")
    ) {
      if (this.checked && !this.disabled) {
        this._internals.setFormValue(this.value);
      } else {
        this._internals.setFormValue(null);
      }
    }

    if (
      changedProperties.has("checked") ||
      changedProperties.has("required") ||
      changedProperties.has("disabled")
    ) {
      this._updateGroupValidity();
    }
    if (changedProperties.has("description")) {
      if (!this._isGrouped()) this._forwardDescriptionSlot();
    }
  }

  /**
   * Public validation API (Form Association)
   * --------------------------------------------------------------------------
   */
  get validity() {
    return this._internals.validity;
  }

  get validationMessage(): string {
    return this._internals.validationMessage;
  }

  checkValidity(): boolean {
    return this._internals.checkValidity();
  }

  reportValidity(): boolean {
    return this._internals.reportValidity();
  }

  // Check if any radios in the individual "name" group is checked.
  private _isGroupChecked(): boolean {
    return this._getGroupMembers().some((radio) => radio.checked);
  }

  // Invalid only when required AND no member of the group is checked.
  // Grouped instances defer to nys-radiogroup.
  private _updateValidity() {
    if (this._isGrouped() || !this._inputEl) return;

    if (this.required && !this.disabled && !this._isGroupChecked()) {
      this._internals.setValidity(
        { valueMissing: true },
        "Please select an option.",
        this._inputEl,
      );
    } else {
      this._internals.setValidity({});
    }
  }

  private _updateGroupValidity() {
    if (this._isGrouped()) return;
    this._getGroupMembers().forEach((radio) => radio._updateValidity());
  }

  private _handleInvalid = () => {
    this._inputEl?.classList.add("nys-radiobutton__radio--force-outline");
  };

  private _handleFocusOut = () => {
    this._inputEl?.classList.remove("nys-radiobutton__radio--force-outline");
  };

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _isGrouped(): boolean {
    return !!this.closest("nys-radiogroup");
  }

  private _getGroupMembers(): NysRadiobutton[] {
    const root = this.getRootNode() as Document | ShadowRoot;
    const all = Array.from(
      root.querySelectorAll<NysRadiobutton>(
        `nys-radiobutton[name="${this.name}"]`,
      ),
    );

    return all.filter((radio) => !radio.closest("nys-radiogroup")); // grouped ones manage themselves
  }

  // Unchecks every group member except the one just selected
  private _uncheckOtherRadios(target: NysRadiobutton) {
    this._getGroupMembers()
      .filter((radio) => radio !== target)
      .forEach((radio) => (radio.checked = false));
  }

  public focus(options?: FocusOptions) {
    this._inputEl?.focus(options);
  }

  private _forwardDescriptionSlot() {
    const slottedDescription = this.querySelector('[slot="description"]');
    const label = this.querySelector("nys-label");
    if (slottedDescription && label) {
      label.appendChild(slottedDescription);
    }
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  private async _handleChange() {
    if (this.checked || this.disabled) return;

    this._inputEl?.classList.remove("nys-radiobutton__radio--force-outline");
    this.checked = true;

    if (!this._isGrouped()) {
      this._uncheckOtherRadios(this);
    }

    this._internals.setFormValue(this.value);
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

  // Note to self:
  // Theoretically this function is no longer needed with the new change. But account for future revamp to "eat our own dog food"
  // within the radiogroup, we may need this function to keep track of navigation into the "other option". So keeping function until then.
  private async _handleKeydown(e: KeyboardEvent) {
    if (this._isGrouped()) return;
    const step = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 }[
      e.key
    ];
    if (step === undefined || this.closest("nys-radiogroup")) return;
    e.preventDefault();

    const members = this._getGroupMembers().filter((radio) => !radio.disabled);
    if (members.length <= 1) return;

    const nextIndex =
      (members.indexOf(this) + step + members.length) % members.length;
    const target = members[nextIndex];

    target.checked = true;
    this._uncheckOtherRadios(target);

    await target.updateComplete;
    target.focus();
  }

  private _handleWrapperClick = () => {
    if (!this.disabled) {
      this._inputEl?.click();
    }
  };

  private _computeAccessibleLabel() {
    const radioLabel = this.label || (this.other ? "Other" : "");
    if (this._isGrouped()) return radioLabel;
    return `${radioLabel}`;
  }

  render() {
    return html`
      <div class="nys-radiobutton" @click=${this._handleWrapperClick}>
        <div class="nys-radiobutton__main-container">
          <input
            id="input-${this.id}"
            type="radio"
            class="nys-radiobutton__radio"
            name="${ifDefined(this.name ? this.name : undefined)}"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            .value=${this.value}
            ?required="${this.required}"
            form=${ifDefined(this.form || undefined)}
            @change="${this._handleChange}"
            @keydown="${this._handleKeydown}"
            @blur="${this._handleFocusOut}"
            aria-label=${this._computeAccessibleLabel()}
          />
          ${(this.label || this.other) &&
          html`<nys-label
            aria-hidden="true"
            id="${this.id}-label"
            label="${this.label || (this.other ? "Other" : "")}"
            description=${ifDefined(this.description || undefined)}
          >
          </nys-label>`}
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-radiobutton")) {
  customElements.define("nys-radiobutton", NysRadiobutton);
}

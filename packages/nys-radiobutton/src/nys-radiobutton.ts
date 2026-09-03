import { html, nothing } from "lit";
import { NysFormControlElement } from "@nysds/internals";
import { property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// The input's accessible name is an aria-labelledby reference to this element
// (intentional side-effect import). An un-upgraded <nys-label> exposes no name,
// so the reference would resolve to nothing and leave the radio unnamed.
import "@nysds/nys-label";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-radiobutton.light.scss?inline";

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
 *         <label for="rg-bk1">Brooklyn</label>
 *         <input id="rg-bk1" type="radio" name="group" value="Brooklyn"></input>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>Medicaid</td>
 *       <td>
 *         <label for="rg-bk2">Manhattan</label>
 *         <input id="rg-bk2" type="radio" name="group" value="Manhattan"></input>
 *       </td>
 *     </tr>
 *   </table>
 * </nys-table>
 * ```
 *
 * @example Labelled by a table row header
 * ```html
 * <nys-table striped bordered>
 *   <table>
 *     <caption>
 *       Select the highest priority application for review
 *     </caption>
 *     <tr>
 *       <th scope="col">Application</th>
 *       <th scope="col">Priority</th>
 *     </tr>
 *     <tr>
 *       <th scope="row" id="row-snap">SNAP Benefits</th>
 *       <td>
 *         <nys-radiobutton
 *           name="priority-application"
 *           value="snap"
 *           labelledby="row-snap"
 *           hideLabel
 *         ></nys-radiobutton>
 *       </td>
 *     </tr>
 *     <tr>
 *       <th scope="row" id="row-heap">HEAP</th>
 *       <td>
 *         <nys-radiobutton
 *           name="priority-application"
 *           value="heap"
 *           labelledby="row-heap"
 *           hideLabel
 *         ></nys-radiobutton>
 *       </td>
 *     </tr>
 *   </table>
 * </nys-table>
 * ```
 */

// Light-DOM component: no shadow root (see createRenderRoot), so no static
// styles / delegatesFocus. Form association, ElementInternals, validity
// helpers, and id generation come from NysFormControlElement.
export class NysRadiobutton extends NysFormControlElement {
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

  /**
   * Id of an element in the host's light-DOM tree to borrow the accessible name
   * from (e.g. a table row `<th>`). Enables labelling a radio button that has no
   * visible label of its own.
   *
   * Standalone radios only: inside a `nys-radiogroup` the group renders the
   * native inputs and names them from the group's own labels.
   */
  @property({ type: String }) labelledby = "";

  /**
   * Suppress the internal visible `<nys-label>` (use with `labelledby` for
   * table cells). Without `labelledby` there is no visible element left to name
   * the radio from, so the accessible name falls back to the `label` string —
   * pair `hideLabel` with `labelledby` wherever a visible element exists.
   */
  @property({ type: Boolean }) hideLabel = false;

  @query("input") private _inputEl!: HTMLInputElement;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  protected createRenderRoot() {
    return this; // render() output lands directly in light DOM, no shadow root at all
  }

  connectedCallback() {
    super.connectedCallback(); // assigns an auto id when none is provided
    adoptLightStyles();
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
      this.setHostAria("ariaChecked", String(this.checked));
    }

    if (changedProperties.has("disabled")) {
      this.setHostAria("ariaDisabled", String(this.disabled));
    }

    if (changedProperties.has("required")) {
      this.setHostAria("ariaRequired", String(this.required));
    }

    if (
      changedProperties.has("checked") ||
      changedProperties.has("value") ||
      changedProperties.has("disabled")
    ) {
      this.setFormValue(null);
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
  get validity(): ValidityState | undefined {
    return this.internals?.validity;
  }

  get validationMessage(): string {
    return this.internals?.validationMessage ?? "";
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
      this.setValidityFromState(
        { valueMissing: true },
        "Please select an option.",
        this._inputEl,
      );
    } else {
      this.clearValidity();
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

  /** The text the internal `<nys-label>` shows, and the last-resort name. */
  private get _labelText(): string {
    return this.label || (this.other ? "Other" : "");
  }

  /**
   * This component renders into the light DOM (see createRenderRoot), so the
   * native <input>, the internal <nys-label>, and any external labelling element
   * all share one tree scope: a plain aria-labelledby IDREF resolves natively and
   * needs none of the cross-shadow machinery (associateControlRefs) that
   * nys-checkbox requires.
   *
   * When the referenced element is a <nys-label>, its text lives in ITS shadow
   * root; the reference still names the input because nys-label mirrors `label`
   * onto its host via ElementInternals.ariaLabel — do not remove that mirror.
   * That mirror is also why the internal label must NOT be aria-hidden: the name
   * is read from the element the user can see, which is the whole point.
   */
  private get _hasExternalLabel(): boolean {
    return !!this.labelledby;
  }

  // The internal <nys-label> is dropped when hidden, when an external label
  // supersedes it, or when there is nothing to label with. `nothing` (not a
  // boolean) so lit never renders the literal string "false".
  private get _renderInternalLabel(): boolean {
    return !this.hideLabel && !this._hasExternalLabel && !!this._labelText;
  }

  /** Id of the internal `<nys-label>`, which is also what names the input. */
  private get _internalLabelId(): string {
    return `${this.id}-label`;
  }

  /**
   * The `aria-labelledby` IDREF for the native input, resolved in priority order:
   * an author-supplied `labelledby` first, then the visible internal label.
   *
   * Naming the input from the element the user can actually see is what keeps the
   * accessible name and the visible text identical (WCAG 2.5.3 Label in Name).
   * The old path built a separate `aria-label` string from the same `label` prop,
   * which is a copy that can drift and that voice-control users cannot rely on
   * (#1820). This component renders into the light DOM, so a plain IDREF resolves
   * natively in one tree scope.
   */
  private get _labelledById(): string | undefined {
    if (this._hasExternalLabel) return this.labelledby;
    if (this._renderInternalLabel) return this._internalLabelId;
    return undefined;
  }

  /**
   * Last-resort accessible name, used only when `hideLabel` suppressed the visible
   * label and no external `labelledby` was given. There is no element left to point
   * at, and a nameless radio is worse than a duplicated string.
   */
  private get _fallbackAriaLabel(): string | undefined {
    return this._labelledById ? undefined : this._labelText || undefined;
  }

  render() {
    return html`
      <div class="nys-radiobutton" @click=${this._handleWrapperClick}>
        <div class="nys-radiobutton__main-container">
          <input
            id="input-${this.id}"
            type="radio"
            class="nys-radiobutton__radio"
            name="${ifDefined(
              this.name && !this._isGrouped() ? this.name : undefined,
            )}"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            .value=${this.value}
            ?required="${this.required}"
            form=${ifDefined(this.form || undefined)}
            @change="${this._handleChange}"
            @keydown="${this._handleKeydown}"
            @blur="${this._handleFocusOut}"
            aria-labelledby=${ifDefined(this._labelledById)}
            aria-label=${ifDefined(this._fallbackAriaLabel)}
          />
          ${this._renderInternalLabel
            ? html`<nys-label
                id="${this._internalLabelId}"
                label="${this._labelText}"
                description=${ifDefined(this.description || undefined)}
              >
              </nys-label>`
            : nothing}
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-radiobutton")) {
  customElements.define("nys-radiobutton", NysRadiobutton);
}

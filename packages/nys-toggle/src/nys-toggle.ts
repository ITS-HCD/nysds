import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-toggle.scss?inline";

let toggleIdCounter = 0;

/**
 * A toggle switch for binary settings with immediate effect. Form-associated via ElementInternals.
 *
 * Use when changing a setting takes effect immediately (e.g., dark mode, notifications).
 * For binary choices in forms that submit later, use `nys-checkbox` instead.
 *
 * @summary Toggle switch for binary settings with immediate effect.
 * @element nys-toggle
 *
 * @slot description - Custom HTML description content.
 *
 * @fires nys-change - Fired when toggle state changes. Detail: `{id, checked}`.
 * @fires nys-focus - Fired when toggle gains focus.
 * @fires nys-blur - Fired when toggle loses focus.
 *
 * @example Basic
 * ```html
 * <nys-toggle label="Enable notifications" name="notifications" value="enabled-notifications"></nys-toggle>
 * ```
 *
 * @example Checked
 * ```html
 * <nys-toggle label="Dark Mode" name="theme" value="dark" checked></nys-toggle>
 * ```
 *
 * @example Disabled
 * ```html
 * <nys-toggle label="Opt Out of emails" name="toggle-switch" value="emails" disabled></nys-toggle>
 * ```
 *
 * @example Hide Icon
 * ```html
 * <nys-toggle label="No icon on the toggle knob" name="icon" value="no-icon" noIcon></nys-toggle>
 * ```
 *
 * @example Size small
 * ```html
 *  <nys-toggle label="Tiny but mighty" name="sm-size" value="sm-size" size="sm"></nys-toggle>
 * ```
 *
 * @example Description
 * ```html
 * <nys-toggle
 *   label="Opt Out of emails"
 *   description="An email address is recommended to be on file for contact information."
 *   name="toggle-switch"
 *   value="emails"
 * ></nys-toggle>
 * ```
 *
 * @example Rich Description
 * ```html
 * <nys-toggle
 *   label="Opt Out of emails"
 *   name="toggle-switch"
 *   value="emails"
 * >
 *   <p slot="description">We <strong>REALLY</strong> encourage you to keep emails enabled for contact purposes.</p>
 * </nys-toggle>
 * ```
 */

export class NysToggle extends LitElement {
  static styles = unsafeCSS(styles);
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Name for form submission. */
  @property({ type: String, reflect: true }) name = "";

  /** Value submitted when toggle is on. */
  @property({ type: String }) value = "";

  /** Visible label text. */
  @property({ type: String }) label = "";

  /** Helper text below label. Use slot for custom HTML. */
  @property({ type: String }) description = "";

  /** Form `id` to associate with. */
  @property({ type: String, reflect: true }) form: string | null = null;

  /** Whether toggle is on. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Prevents interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Hides check/close icon inside toggle knob. */
  @property({ type: Boolean }) noIcon = false;

  /** Adjusts colors for dark backgrounds. */
  @property({ type: Boolean, reflect: true }) inverted = false;

  /**
   * Toggle size: `sm` or `md` (default).
   * @default "md"
   */
  @property({ type: String, reflect: true }) size: "sm" | "md" = "md";

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
      this.id = `nys-toggle-${Date.now()}-${toggleIdCounter++}`;
    }
  }

  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */

  // Update the internals whenever `checked` or `value` changes.
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("checked") || changedProperties.has("value")) {
      this._internals.setFormValue(this.checked ? this.value : null);
    }
  }

  public formResetCallback() {
    this.checked = false;

    this._internals.setFormValue(this.checked ? this.value : null);

    // Re-render UI
    this.requestUpdate();
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private _emitChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: { id: this.id, checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
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
  }

  private _handleClick() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this._emitChangeEvent();
  }

  private _handleSliderClick(e: Event) {
    e.stopPropagation();
    this._handleClick();
  }

  private _handleKeyDown(event: KeyboardEvent) {
    if (!this.disabled && (event.key === " " || event.key === "Enter")) {
      event.preventDefault();

      // Manually toggle the checked state
      this.checked = !this.checked;

      this._emitChangeEvent();
    }
  }

  render() {
    return html`
      <div class="nys-toggle">
        <div class="nys-toggle__content">
          <div class="nys-toggle__toggle">
            <input
              id=${this.id}
              type="checkbox"
              name="${ifDefined(this.name ? this.name : undefined)}"
              .value=${this.value}
              form=${ifDefined(this.form || undefined)}
              .checked=${this.checked}
              ?disabled=${this.disabled}
              role="switch"
              aria-checked="${this.checked ? "true" : "false"}"
              aria-disabled="${this.disabled ? "true" : "false"}"
              aria-label="${this.label || "Toggle switch"}"
              @click=${this._handleClick}
              @focus=${this._handleFocus}
              @blur=${this._handleBlur}
              @keydown=${this._handleKeyDown}
            />
            <span class="slider" @click=${this._handleSliderClick}>
              <div class="knob">
                ${this.noIcon
                  ? ""
                  : html`<nys-icon
                      class="toggle-icon"
                      name="${this.checked ? "check" : "close"}"
                      size="2xl"
                    ></nys-icon>`}
              </div>
            </span>
          </div>
          ${this.label &&
          html`<nys-label
            label=${this.label}
            description=${ifDefined(this.description || undefined)}
            ?inverted=${this.inverted}
            @nys-label-click=${this._handleClick}
          >
            <slot name="description" slot="description"
              >${this.description}</slot
            >
          </nys-label> `}
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-toggle")) {
  customElements.define("nys-toggle", NysToggle);
}

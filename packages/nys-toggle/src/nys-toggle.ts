import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-toggle.scss?inline";

let toggleIdCounter = 0;

/**
 * A toggle switch for binary on/off settings with immediate UI effect. Form-associated via ElementInternals.
 * Ideal for feature toggles, user preferences, and settings that take effect immediately.
 *
 * Use for settings where the change takes immediate effect (e.g., dark mode, notifications, feature toggles).
 * For binary choices in forms that submit later, use `nys-checkbox` instead. Never use toggles for complex multi-state options.
 *
 * ## When to use
 * - Settings with immediate effect (dark mode, notifications, features).
 * - User preferences and feature toggles.
 * - When the on/off state is visually distinct and immediately apparent.
 *
 * ## When not to use
 * - Complex multi-state options (use other form controls).
 * - Binary form choices submitted with form data (use `nys-checkbox` instead).
 * - Trivial settings that don't impact user experience significantly.
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Provide a clear label and optional description to explain what the toggle controls.
 * - Use `<nys-checkbox>` for forms, especially when you're not expecting immediate action.
 * - Ensure the page clearly reflects the toggle's on/off state through visible changes (e.g., switching to dark mode).
 *
 * **Don't:**
 * - Use toggles for complex or multi-state choices.
 * - Overuse for minor settings that don't affect the user experience.
 * - Hide labels unless an accessible alternative is in place.
 *
 * ## Features
 * - **Visual state** – Clear on/off positions with check/close icons (removable with `noIcon`).
 * - **Sizes** – `sm` or `md` (default).
 * - **Label and description** – Optional label for accessibility; optional description below.
 * - **Icons** – Check icon when on, close icon when off (can be hidden with `noIcon`).
 * - **Form association** – Associates with form via `form` attribute if outside form element.
 *
 * @accessibility
 * - Proper ARIA roles and attributes: `role="switch"` with `aria-checked`.
 * - Keyboard navigation: Tab to focus; Space or Enter to toggle.
 * - Screen readers announce toggle state (on/off) and label correctly.
 * - Visual focus indicators meet WCAG 2.2 AA standards.
 * - Disabled state prevents interaction and is announced by assistive technologies.
 * - Label must be provided for all toggles (visible or via `aria-label`).
 *
 * @summary Toggle switch for binary on/off settings with immediate effect and keyboard support.
 * @element nys-toggle
 *
 * @slot description - Custom HTML description content below the label. Use for rich formatting or links.
 *
 * @fires nys-change - Fired when toggle state changes. Detail: `{id, checked}`.
 * @fires nys-focus - Fired when toggle gains focus.
 * @fires nys-blur - Fired when toggle loses focus.
 *
 * @example Basic toggle
 * ```html
 * <nys-toggle label="Enable notifications" name="notifications"></nys-toggle>
 * ```
 *
 * @example Dark mode toggle with description
 * ```html
 * <nys-toggle label="Dark mode" description="Adjust display for low light environments" checked></nys-toggle>
 * ```
 *
 * @example Small toggle without icons
 * ```html
 * <nys-toggle label="Feature enabled" size="sm" noIcon></nys-toggle>
 * ```
 *
 * ## Dependencies
 *
 * This component depends on the following NYS Design System components:
 *
 *   - `nys-icon`
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

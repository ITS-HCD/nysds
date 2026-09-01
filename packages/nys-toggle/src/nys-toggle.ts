import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import {
  NysFormControlElement,
  dispatchNysEvent,
  dispatchNysFocusBlur,
} from "@nysds/internals";
// These internal elements are rendered inside this component's shadow DOM, so
// they must be registered whenever nys-toggle is used. Importing them here
// (intentional side effect) guarantees the visible label — which the
// accessible name association depends on — always renders, along with the
// check/close knob icon.
import "@nysds/nys-label";
import "@nysds/nys-icon";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-toggle.scss?inline";

/** Detail for the `nys-change` event. */
export interface NysToggleChangeDetail {
  /** The component's `id`. */
  id: string;
  /** The component's `name`. */
  name: string;
  /** Whether the toggle is on. */
  checked: boolean;
  /** The component's `value` (submitted when the toggle is on). */
  value: string;
}

/** Fired when the user toggles the switch. */
export type NysToggleChangeEvent = CustomEvent<NysToggleChangeDetail>;

/**
 * A toggle switch for binary settings with immediate effect. Form-associated via ElementInternals.
 *
 * Use when changing a setting takes effect immediately (e.g., dark mode, notifications).
 * For binary choices in forms that submit later, use `nys-checkbox` instead.
 *
 * A toggle has no validation surface: it exposes no `required`, `showError`,
 * or `errorMessage` and never reports invalid state. Framework adapters (for
 * example an Angular ControlValueAccessor) must not try to sync errors to it.
 *
 * Setting `checked` programmatically updates the form value but does not fire
 * `nys-change`; the event fires only on user interaction.
 *
 * @summary Toggle switch for binary settings with immediate effect.
 * @element nys-toggle
 *
 * @formControl checked nys-change
 *
 * @slot description - Custom HTML description content.
 *
 * @fires nys-change {NysToggleChangeEvent} Fired when the user toggles the switch. Detail: `{id, name, checked, value}`.
 * @fires nys-focus {Event} Fired when toggle gains focus.
 * @fires nys-blur {Event} Fired when toggle loses focus.
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
 * @example Description Slot
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

export class NysToggle extends NysFormControlElement {
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

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals). super.connectedCallback() assigns
   * an id (prefix = localName) when one is not provided.
   */

  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */

  // Update the internals whenever `checked` or `value` changes. This is an
  // ElementInternals side effect, not derived reactive state, so it belongs in
  // updated() (it sets no reactive property, so no second update is scheduled).
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("checked") || changedProperties.has("value")) {
      this.setFormValue(this.checked ? this.value : null);
    }
  }

  public formResetCallback() {
    this.checked = false;

    this.setFormValue(this.checked ? this.value : null);

    // Re-render UI
    this.requestUpdate();
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private _emitChangeEvent() {
    dispatchNysEvent<NysToggleChangeDetail>(this, "nys-change", {
      id: this.id,
      name: this.name,
      checked: this.checked,
      value: this.value,
    });
  }

  // Handle focus event
  private _handleFocus() {
    dispatchNysFocusBlur(this, "focus");
  }

  // Handle blur event
  private _handleBlur() {
    dispatchNysFocusBlur(this, "blur");
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
              aria-labelledby=${ifDefined(
                this.label ? this.id + "--label" : undefined,
              )}
              aria-label=${ifDefined(!this.label ? "Toggle switch" : undefined)}
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
            id="${this.id}--label"
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

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-toggle.scss?inline";

let toggleIdCounter = 0;

/**
 * `<nys-toggle>` is a form-associated toggle switch with label, description,
 * size variants, inverted styles, and optional icons. Supports keyboard
 * interaction and integrates with forms via ElementInternals.
 *
 * @slot description - Optional slot to provide additional description below the label.
 *
 * @fires nys-change - Fired when toggle changes state. Detail: `{ id, checked }`.
 * @fires nys-focus - Fired when toggle receives focus.
 * @fires nys-blur - Fired when toggle loses focus.
 */

export class NysToggle extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) value = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String, reflect: true }) form: string | null = null;
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) noIcon = false;
  @property({ type: Boolean, reflect: true }) inverted = false;
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
    this.dispatchEvent(new Event("nys-focus"));
  }

  // Handle blur event
  private _handleBlur() {
    this.dispatchEvent(new Event("nys-blur"));
  }

  private _handleChange(e: Event) {
    const { checked } = e.target as HTMLInputElement;
    this.checked = checked;
    this._emitChangeEvent();
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
      <label class="nys-toggle">
        <div class="nys-toggle__content">
          <div class="nys-toggle__toggle">
            <input
              type="checkbox"
              name="${ifDefined(this.name ? this.name : undefined)}"
              .value=${this.value}
              form=${ifDefined(this.form || undefined)}
              .checked=${this.checked}
              ?disabled=${this.disabled}
              role="switch"
              aria-checked="${this.checked ? "true" : "false"}"
              aria-disabled="${this.disabled ? "true" : "false"}"
              @change=${this._handleChange}
              @focus=${this._handleFocus}
              @blur=${this._handleBlur}
              @keydown=${this._handleKeyDown}
            />
            <span class="slider">
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
          <div class="nys-toggle__text ${this.inverted ? "invert" : ""}">
            <div class="nys-toggle__label">${this.label}</div>
            <slot name="description">${this.description}</slot>
          </div>
        </div>
      </label>
    `;
  }
}

if (!customElements.get("nys-toggle")) {
  customElements.define("nys-toggle", NysToggle);
}

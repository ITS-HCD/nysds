import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-radiobutton.scss?inline";

let radiobuttonIdCounter = 0;

/**
 * A radio button for single selection within a `nys-radiogroup`. Only one radio with the same `name` can be checked.
 *
 * **Must be used within `nys-radiogroup`** to function properly. Use for 2-6 mutually exclusive options. For 7+ options, use `nys-select`.
 * For multiple selections, use `nys-checkbox` group. A unique ID is auto-generated if not provided.
 *
 * @summary Radio button for single selection from mutually exclusive options. This is a READONLY data component.
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
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-radiobutton-${Date.now()}-${radiobuttonIdCounter++}`;
    }
  }

  render() {
    return html``;
  }
}

if (!customElements.get("nys-radiobutton")) {
  customElements.define("nys-radiobutton", NysRadiobutton);
}

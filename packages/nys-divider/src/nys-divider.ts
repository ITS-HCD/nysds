import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-divider.scss?inline";

let dividerIdCounter = 0;

/**
 * A horizontal rule for visual separation between content sections. Renders a semantic `<hr>` element.
 *
 * ## When to use
 * - To separate content displayed vertically
 * - Use `inverted` property when placing the component on a dark background
 *
 * Avoid for:
 * - When content is horizontally formatted
 *
 * ## Accessibility
 * - Uses native `<hr>` element to ensure ARIA compliance
 * - Recognized as a separator by assistive technologies
 *
 * @summary Horizontal divider for visual separation of content sections.
 * @element nys-divider
 *
 * @example Basic divider
 * ```html
 * <p>Section one content</p>
 * <nys-divider></nys-divider>
 * <p>Section two content</p>
 * ```
 *
 * @example Inverted on dark background
 * ```html
 * <div style="background-color: var(--nys-color-navy);">
 *   <p>Dark content area</p>
 *   <nys-divider inverted></nys-divider>
 *   <p>More dark content</p>
 * </div>
 * ```
 */

export class NysDivider extends LitElement {
  static styles = unsafeCSS(styles);

  /** Adjusts colors for dark backgrounds. */
  @property({ type: Boolean, reflect: true }) inverted = false;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    // Generate a unique ID if not provided
    if (!this.id) {
      this.id = this._generateUniqueId();
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _generateUniqueId() {
    return `nys-divider-${Date.now()}-${dividerIdCounter++}`;
  }

  render() {
    return html`<hr class="nys-divider" />`;
  }
}

if (!customElements.get("nys-divider")) {
  customElements.define("nys-divider", NysDivider);
}

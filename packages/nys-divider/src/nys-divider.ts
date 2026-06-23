import { html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { NysReflectsAriaElement } from "@nysds/internals";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-divider.scss?inline";

/**
 * A horizontal rule for visual separation between content sections. The host
 * element carries `role="separator"` via ElementInternals.
 *
 * Use to separate distinct content areas within a page. Set `inverted` for use on dark backgrounds.
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
 */

export class NysDivider extends NysReflectsAriaElement {
  static styles = unsafeCSS(styles);

  /** Adjusts colors for dark backgrounds. */
  @property({ type: Boolean, reflect: true }) inverted = false;

  /** If true, the divider will use a lighter color. */
  @property({ type: Boolean, reflect: true }) subtle = false;

  /**
   * The host element IS the separator, so reflect role="separator" onto the host
   * via internals. A horizontal separator's implicit aria-orientation is
   * "horizontal", which matches this component, so no explicit orientation is set.
   */
  protected get defaultRole(): string | null {
    return "separator";
  }

  connectedCallback() {
    // super.connectedCallback() (NysReflectsAriaElement) assigns an id when one
    // is not provided and reflects the default role onto the host.
    super.connectedCallback();
  }

  render() {
    // The host carries role="separator"; the inner <hr> is purely presentational
    // so the separator is not announced twice in the accessibility tree.
    return html`<hr
      class="nys-divider"
      role="presentation"
      aria-hidden="true"
    />`;
  }
}

if (!customElements.get("nys-divider")) {
  customElements.define("nys-divider", NysDivider);
}

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-iconlistitem.scss?inline";

/**
 * A single item in a `<nys-iconlist>`. Renders as a list item containing an icon and one or two lines of text.
 *
 * The default slot holds the primary label. Use `<span slot="secondary">` for a second line of text;
 * when present the icon aligns to the top rather than centering against the full block.
 *
 * @summary An icon-paired list item for use inside `<nys-iconlist>`.
 * @element nys-iconlistitem
 *
 * @prop {string} icon - Material Symbols icon name passed to `<nys-icon>`.
 *
 * @slot - Primary label text.
 * @slot secondary - Optional second line of text rendered below the primary label.
 *
 * @example Basic item
 * ```html
 * <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
 * ```
 *
 * @example Item with a secondary label
 * ```html
 * <nys-iconlistitem icon="location_on">
 *   Central Park West
 *   <span slot="secondary">New York, NY</span>
 * </nys-iconlistitem>
 * ```
 */
export class NysIconlistitem extends LitElement {
  static styles = unsafeCSS(styles);

  /**
   * Material Symbols icon name displayed beside the label.
   */
  @property({ type: String }) icon = "";

  /**
   * Draws a rule below the item. Set by the parent `<nys-iconlist divider>`; not intended to be
   * set directly.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) divider = false;

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "listitem");
    }
  }

  private _handleSecondarySlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const hasSecondary = slot.assignedNodes({ flatten: true }).length > 0;
    this.toggleAttribute("data-has-secondary", hasSecondary);
  }

  render() {
    return html`
      <li class="nys-iconlistitem">
        <nys-icon
          name=${this.icon}
          size="20"
          class="nys-iconlistitem__icon"
        ></nys-icon>
        <div class="nys-iconlistitem__label">
          <slot></slot>
          <slot
            name="secondary"
            @slotchange=${this._handleSecondarySlotChange}
          ></slot>
        </div>
      </li>
    `;
  }
}

if (!customElements.get("nys-iconlistitem")) {
  customElements.define("nys-iconlistitem", NysIconlistitem);
}

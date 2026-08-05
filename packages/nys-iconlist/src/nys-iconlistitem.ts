import { html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
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
 */
export class NysIconlistitem extends NysElement {
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
    // super.connectedCallback() (NysElement) assigns an auto id when
    // one is not provided, preserving the `nys-iconlistitem-<ts>-<n>` shape.
    super.connectedCallback();
    // Only expose the listitem role when actually inside a list, so a
    // standalone item isn't announced as an orphan listitem.
    if (
      !this.hasAttribute("role") &&
      this.parentElement?.tagName.toLowerCase() === "nys-iconlist"
    ) {
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
      <div class="nys-iconlistitem">
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
      </div>
    `;
  }
}

if (!customElements.get("nys-iconlistitem")) {
  customElements.define("nys-iconlistitem", NysIconlistitem);
}

import { LitElement, html, unsafeCSS, PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import "./nys-iconlistitem";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-iconlist.scss?inline";

const DIVIDER_MARKER = "data-nys-iconlist-divider";

let componentIdCounter = 0;

/**
 * An icon list is a component that displays a collection of items paired with visual icons, making it easy to create structured, scannable lists across web projects. Commonly used in the card component.
 *
 * Add `<nys-iconlistitem>` elements as children. Each item accepts an `icon` attribute and uses its
 * default slot for the primary label. A second line can be added with `<span slot="secondary">`.
 * Set `divider` to draw a rule between items; no divider is drawn after the last item.
 *
 * @summary A scannable list of icon + text items, with an optional divider between rows.
 * @element nys-iconlist
 *
 * @slot - One or more `<nys-iconlistitem>` elements.
 *
 * @example Basic list
 * ```html
 * <nys-iconlist id="event-details">
 *   <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
 *   <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
 *   <nys-iconlistitem icon="location_on">Central Park West</nys-iconlistitem>
 * </nys-iconlist>
 * ```
 *
 * @example With a divider between items
 * ```html
 * <nys-iconlist id="event-details" divider>
 *   <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
 *   <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
 *   <nys-iconlistitem icon="location_on">Central Park West</nys-iconlistitem>
 * </nys-iconlist>
 * ```
 *
 * @example Item with a secondary label
 * ```html
 * <nys-iconlist id="event-details" divider>
 *   <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
 *   <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
 *   <nys-iconlistitem icon="location_on">
 *     Central Park West
 *     <span slot="secondary">New York, NY</span>
 *   </nys-iconlistitem>
 * </nys-iconlist>
 * ```
 *
 * @example Checklist without dividers
 * ```html
 * <nys-iconlist id="requirements">
 *   <nys-iconlistitem icon="check_circle">Recent pay stubs</nys-iconlistitem>
 *   <nys-iconlistitem icon="check_circle">Current rent/mortgage statement</nys-iconlistitem>
 *   <nys-iconlistitem icon="check_circle">Current property tax bill</nys-iconlistitem>
 *   <nys-iconlistitem icon="check_circle">Current homeowner's insurance bill</nys-iconlistitem>
 *   <nys-iconlistitem icon="check_circle">Social Security card</nys-iconlistitem>
 * </nys-iconlist>
 * ```
 */

export class NysIconlist extends LitElement {
  static styles = unsafeCSS(styles);

  /**
   * Unique identifier. Auto-generated if not provided.
   */
  @property({ type: String, reflect: true }) id = "";

  /**
   * Draws a divider between items. No divider is drawn after the last item.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) divider = false;

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-iconlist-${Date.now()}-${componentIdCounter++}`;
    }
  }

  private _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector("slot");
    if (!slot) return;

    slot.assignedElements({ flatten: true }).forEach((el) => {
      if (
        el.tagName.toLowerCase() !== "nys-iconlistitem" &&
        !el.hasAttribute(DIVIDER_MARKER)
      ) {
        console.warn(
          "nys-iconlist: only <nys-iconlistitem> elements are allowed as direct children. Removing:",
          el,
        );
        el.remove();
      }
    });

    this._syncDividers();
  }

  updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (changedProperties.has("divider")) {
      this._syncDividers();
    }
  }

  private _createDividerItem(): HTMLElement {
    const dividerItem = document.createElement("li");
    dividerItem.setAttribute(DIVIDER_MARKER, "");
    dividerItem.setAttribute("role", "separator");
    dividerItem.className = "nys-iconlist__divider";

    const dividerEl = document.createElement("nys-divider");
    dividerEl.style.setProperty(
      "--_nys-divider-color",
      "var(--_nys-iconlist-divider-color)",
    );
    dividerEl.style.setProperty(
      "--_nys-divider-width",
      "var(--_nys-iconlist-divider-width)",
    );
    dividerItem.append(dividerEl);
    return dividerItem;
  }

  // Reconciles divider elements in place rather than clearing and rebuilding,
  // since a remove/append pair here would itself trigger another slotchange.
  private _syncDividers() {
    const items = Array.from(this.children).filter(
      (el) => el.tagName.toLowerCase() === "nys-iconlistitem",
    );

    items.forEach((item, index) => {
      const wantsDivider = this.divider && index < items.length - 1;
      const next = item.nextElementSibling;
      const hasDivider = !!next?.hasAttribute(DIVIDER_MARKER);

      if (wantsDivider && !hasDivider) {
        item.after(this._createDividerItem());
      } else if (!wantsDivider && hasDivider) {
        next!.remove();
      }
    });
  }

  render() {
    return html`
      <ul class="nys-iconlist" role="list">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </ul>
    `;
  }
}

if (!customElements.get("nys-iconlist")) {
  customElements.define("nys-iconlist", NysIconlist);
}

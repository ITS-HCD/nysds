import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-iconlist.scss?inline";

let componentIdCounter = 0;

/**
 * An icon list is a component that displays a collection of items paired with visual icons, making it easy to create structured, scannable lists across web projects. Commonly used in the card component.
 *
 * Add native `<li>` elements as children. Each `<li>` should contain one `<nys-icon>` followed by one or
 * two `<span>` elements — a single `<span>` renders as one line of text, a second `<span>` renders as a
 * secondary line below the first (e.g. a street address followed by city/state). Set `divider` to draw a
 * rule between items; no divider is drawn after the last item.
 *
 * Consumers must also load `@nysds/nys-icon` since items are authored with `<nys-icon>`.
 *
 * @summary A scannable list of icon + text items, with an optional divider between rows.
 * @element nys-iconlist
 *
 * @slot - One or more `<li>` elements, each containing a `<nys-icon>` and one or two `<span>` labels.
 *
 * @example Basic list
 * ```html
 * <nys-iconlist id="event-details">
 *   <li>
 *     <nys-icon name="calendar_month"></nys-icon>
 *     <span>July 4, 2026</span>
 *   </li>
 *   <li>
 *     <nys-icon name="schedule"></nys-icon>
 *     <span>5:00</span>
 *   </li>
 *   <li>
 *     <nys-icon name="location_on"></nys-icon>
 *     <span>Central Park West</span>
 *   </li>
 * </nys-iconlist>
 * ```
 *
 * @example With a divider between items
 * ```html
 * <nys-iconlist id="event-details" divider>
 *   <li>
 *     <nys-icon name="calendar_month"></nys-icon>
 *     <span>July 4, 2026</span>
 *   </li>
 *   <li>
 *     <nys-icon name="schedule"></nys-icon>
 *     <span>5:00</span>
 *   </li>
 *   <li>
 *     <nys-icon name="location_on"></nys-icon>
 *     <span>Central Park West</span>
 *   </li>
 * </nys-iconlist>
 * ```
 *
 * @example Item with a secondary label
 * A second `<span>` renders on its own line below the first, with the icon aligned to the top line.
 * ```html
 * <nys-iconlist id="event-details" divider>
 *   <li>
 *     <nys-icon name="calendar_month"></nys-icon>
 *     <span>July 4, 2026</span>
 *   </li>
 *   <li>
 *     <nys-icon name="schedule"></nys-icon>
 *     <span>5:00</span>
 *   </li>
 *   <li>
 *     <nys-icon name="location_on"></nys-icon>
 *     <span>Central Park West</span>
 *     <span>New York, NY</span>
 *   </li>
 * </nys-iconlist>
 * ```
 *
 * @example Checklist without dividers
 * ```html
 * <nys-iconlist id="requirements">
 *   <li>
 *     <nys-icon name="check_circle"></nys-icon>
 *     <span>Recent pay stubs</span>
 *   </li>
 *   <li>
 *     <nys-icon name="check_circle"></nys-icon>
 *     <span>Current rent/mortgage statement</span>
 *   </li>
 *   <li>
 *     <nys-icon name="check_circle"></nys-icon>
 *     <span>Current property tax bill</span>
 *   </li>
 *   <li>
 *     <nys-icon name="check_circle"></nys-icon>
 *     <span>Current homeowner's insurance bill</span>
 *   </li>
 *   <li>
 *     <nys-icon name="check_circle"></nys-icon>
 *     <span>Social Security card</span>
 *   </li>
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

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  constructor() {
    super();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-iconlist-${Date.now()}-${componentIdCounter++}`;
    }
  }

  firstUpdated() {
    this._handleSlotChange();
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _getSlot(): HTMLSlotElement | null {
    return this.shadowRoot?.querySelector("slot") ?? null;
  }

  // Places the icon and the (optional) second label on a two-row grid so the
  // icon lines up with the first line of text instead of the block's center.
  // This can't be done via ::slotted() alone since it only reaches the <li>
  // itself, not its <nys-icon>/<span> children.
  private _enhanceItem(li: HTMLLIElement) {
    if (li.dataset.nysEnhanced) return;
    li.dataset.nysEnhanced = "true";

    const icon = li.querySelector(":scope > nys-icon") as HTMLElement | null;
    const labels = Array.from(
      li.querySelectorAll(":scope > span"),
    ) as HTMLElement[];

    if (icon && labels.length > 1) {
      icon.style.gridRow = `1 / span ${labels.length}`;
      labels.forEach((label, index) => {
        label.style.gridColumn = "2";
        label.style.gridRow = `${index + 1}`;
      });
    }
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private _handleSlotChange() {
    const slot = this._getSlot();
    if (!slot) return;

    const assigned = slot.assignedElements({ flatten: true });

    assigned.forEach((el) => {
      if (el.tagName !== "LI") {
        console.warn(
          "nys-iconlist: only <li> elements are allowed as direct children. Removing:",
          el,
        );
        el.remove();
      }
    });

    assigned
      .filter((el): el is HTMLLIElement => el.tagName === "LI")
      .forEach((li) => this._enhanceItem(li));
  }

  render() {
    return html`
      <ul class="nys-iconlist">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </ul>
    `;
  }
}

if (!customElements.get("nys-iconlist")) {
  customElements.define("nys-iconlist", NysIconlist);
}

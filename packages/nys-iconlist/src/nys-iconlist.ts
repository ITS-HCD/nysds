import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import "./nys-iconlistitem";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-iconlist.scss?inline";

let componentIdCounter = 0;

// The list renders in light DOM, so its styles are adopted into whichever
// root (document or containing shadow root) the element lives in — once per root.
const lightSheet = new CSSStyleSheet();
lightSheet.replaceSync(styles);
const styledRoots = new WeakSet<Document | ShadowRoot>();

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
 * Children: one or more `<nys-iconlistitem>` elements, kept in light DOM so the
 * `list`/`listitem` roles stay directly related in the accessibility tree.
 *
 * @example Basic
 * ```html
 * <nys-iconlist id="event-details">
 *   <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
 *   <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
 *   <nys-iconlistitem icon="location_on">Central Park West</nys-iconlistitem>
 * </nys-iconlist>
 * ```
 *
 * @example Divider
 * ```html
 * <nys-iconlist id="event-details2" divider>
 *   <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
 *   <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
 *   <nys-iconlistitem icon="location_on">Central Park West</nys-iconlistitem>
 * </nys-iconlist>
 * ```
 *
 * @example Secondary label
 * ```html
 * <nys-iconlist id="event-details3">
 *   <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
 *   <nys-iconlistitem icon="schedule">
 *     5:00 PM
 *     <span slot="secondary">Eastern Standard Time</span>
 *   </nys-iconlistitem>
 *   <nys-iconlistitem icon="location_on">
 *     Central Park West
 *     <span slot="secondary">New York, NY</span>
 *   </nys-iconlistitem>
 * </nys-iconlist>
 * ```
 *
 * @example Checklist
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
  /**
   * Unique identifier. Auto-generated if not provided.
   */
  @property({ type: String, reflect: true }) id = "";

  /**
   * Draws a divider between items. No divider is drawn after the last item.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) divider = false;

  private _childObserver = new MutationObserver(() => this._syncDividers());

  // The host must not be a shadow host: Chrome ≥150 demotes role="listitem"
  // on elements slotted into a shadow-host list, so the items have to be
  // direct DOM children of the element carrying role="list".
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-iconlist-${Date.now()}-${componentIdCounter++}`;
    }
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "list");
    }

    const root = this.getRootNode() as Document | ShadowRoot;
    if (!styledRoots.has(root)) {
      styledRoots.add(root);
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, lightSheet];
    }

    this._childObserver.observe(this, { childList: true });
    this._syncDividers();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._childObserver.disconnect();
  }

  updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (changedProperties.has("divider")) {
      this._syncDividers();
    }
  }

  private _syncDividers() {
    const items = Array.from(this.children).filter(
      (el) => el.tagName.toLowerCase() === "nys-iconlistitem",
    );

    items.forEach((item, index) => {
      item.toggleAttribute("divider", this.divider && index < items.length - 1);
    });
  }
}

if (!customElements.get("nys-iconlist")) {
  customElements.define("nys-iconlist", NysIconlist);
}

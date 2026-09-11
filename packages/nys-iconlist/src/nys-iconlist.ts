import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
import "./nys-iconlistitem";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-iconlist.light.scss?inline";

let _lightSheet: CSSStyleSheet | null = null;
// Injects the light-DOM styling for <nys-iconlist> into a single constructed
// stylesheet adopted on the document. Guarded so it runs once regardless of how
// many lists mount, and skipped during SSR where `document` is undefined.
function adoptLightStyles() {
  if (_lightSheet || typeof document === "undefined") return;
  _lightSheet = new CSSStyleSheet();
  _lightSheet.replaceSync(lightStyles);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, _lightSheet];
}

// Resolves once the browser has had a real chance to finish hydrating an
// SSR'd page (e.g. a React/Next.js host) before a light-DOM component
// performs its first render. A single requestAnimationFrame isn't reliable
// here: with streamed/RSC payloads, the segment containing this element can
// hydrate more than one frame after its module (and thus this custom
// element) registers. requestIdleCallback waits for the main thread to
// actually go quiet, which covers that case; a capped timeout keeps a busy
// page from deferring indefinitely. Safari has no requestIdleCallback, so it
// falls back to a double rAF (one frame is what MDN/Web.dev document as the
// minimum "next paint" proxy; two gives hydration a second frame of margin).
function waitPastHydration(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => resolve(), { timeout: 300 });
    } else if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    } else {
      resolve();
    }
  });
}

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
 * `list`/`listitem` roles stay directly related in the accessibility tree. The
 * host itself is the `role="list"` container and renders in the light DOM, so
 * its styling comes from `nys-iconlist.light.scss` adopted once onto
 * `document.adoptedStyleSheets` rather than from a shadow-DOM stylesheet.
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
 * @example Accessible Name
 * A list carries no accessible name of its own. Because the host renders in the light DOM,
 * `aria-label` works natively with zero component code — set it directly when the surrounding
 * content does not already make the list's purpose obvious.
 * ```html
 * <nys-iconlist id="event-details-labelled" aria-label="Event details">
 *   <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
 *   <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
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

export class NysIconlist extends NysElement {
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

  // Tracks children we've already warned about so a MutationObserver churn
  // (or repeated updated() calls) doesn't spam the console for the same node.
  private _warnedChildren = new WeakSet<Element>();

  // The host must not be a shadow host: Chrome ≥150 demotes role="listitem"
  // on elements slotted into a shadow-host list, so the items have to be
  // direct DOM children of the element carrying role="list".
  createRenderRoot() {
    return this;
  }

  // Guards only the first update. This component renders into the light DOM
  // (see createRenderRoot), so connectedCallback would otherwise set the
  // host's `role` attribute and sync divider attributes on its children
  // synchronously during custom-element upgrade — before a framework's SSR
  // hydration (e.g. Next.js) finishes walking this same subtree, which reads
  // as a hydration mismatch (React error #418). Deferring the first update
  // until the main thread goes quiet (see waitPastHydration above) lets
  // hydration settle against the SSR-rendered markup first — Lit's own
  // documented pattern for retiming an update (see ReactiveElement.
  // scheduleUpdate). Later updates are unaffected.
  private _firstUpdatePending = true;

  protected async scheduleUpdate() {
    if (this._firstUpdatePending) {
      this._firstUpdatePending = false;
      await waitPastHydration();
    }
    super.scheduleUpdate();
  }

  connectedCallback() {
    // super.connectedCallback() (NysElement) assigns an auto id when
    // one is not provided, preserving the `nys-iconlist-<ts>-<n>` shape.
    super.connectedCallback();
    adoptLightStyles();
    this._childObserver.observe(this, { childList: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._childObserver.disconnect();
  }

  firstUpdated(changedProperties: PropertyValues<this>) {
    super.firstUpdated(changedProperties);
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "list");
    }
    this._syncDividers();
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

    // light.scss hides any non-nys-iconlistitem child with display:none,
    // which silently drops author content from the accessibility tree
    // (WCAG 1.3.1). Warn so the mistake is visible in dev.
    Array.from(this.children).forEach((el) => {
      if (
        el.tagName.toLowerCase() !== "nys-iconlistitem" &&
        !this._warnedChildren.has(el)
      ) {
        this._warnedChildren.add(el);
        console.warn(
          `nys-iconlist: <${el.tagName.toLowerCase()}> is not a <nys-iconlistitem> and will be hidden (display: none), removing it from the accessibility tree. Only <nys-iconlistitem> elements are supported as children.`,
          el,
        );
      }
    });

    items.forEach((item, index) => {
      item.toggleAttribute("divider", this.divider && index < items.length - 1);
    });
  }
}

if (!customElements.get("nys-iconlist")) {
  customElements.define("nys-iconlist", NysIconlist);
}

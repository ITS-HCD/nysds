import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import { NysProcesslistitem } from "./nys-processlistitem";
import "./nys-processlistitem";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-processlist.light.scss?inline";

let componentIdCounter = 0;

let _lightSheet: CSSStyleSheet | null = null;
// Injects the light-DOM styling for <nys-processlist> into a single constructed
// stylesheet adopted on the document. Guarded so it runs once regardless of how
// many lists mount, and skipped during SSR where `document` is undefined.
function adoptLightStyles() {
  if (_lightSheet || typeof document === "undefined") return;
  _lightSheet = new CSSStyleSheet();
  _lightSheet.replaceSync(lightStyles);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, _lightSheet];
}

/**
 * A process list is a component that displays a sequence of numbered steps, making it easy to communicate a multi-step process across web projects.
 *
 * Add `<nys-processlistitem>` elements as children. Each item takes a `label` and an optional
 * `description`. Steps are numbered from 1 by the list, so items never set their own number.
 *
 * @summary An ordered list of numbered process steps.
 * @element nys-processlist
 *
 * Children: one or more `<nys-processlistitem>` elements, kept in light DOM so the
 * `list`/`listitem` roles stay directly related in the accessibility tree. The
 * host itself is the `role="list"` container and renders in the light DOM, so
 * its styling comes from `nys-processlist.light.scss` adopted once onto
 * `document.adoptedStyleSheets` rather than from a shadow-DOM stylesheet.
 *
 * @example Basic
 * ```html
 * <nys-processlist id="application-steps">
 *   <nys-processlistitem label="Gather your documents"></nys-processlistitem>
 *   <nys-processlistitem label="Complete the application"></nys-processlistitem>
 *   <nys-processlistitem label="Submit and await review"></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Description
 * ```html
 * <nys-processlist id="application-steps2">
 *   <nys-processlistitem
 *     label="Gather your documents"
 *     description="Recent pay stubs and a current property tax bill."
 *   ></nys-processlistitem>
 *   <nys-processlistitem
 *     label="Complete the application"
 *     description="Most applicants finish in about 20 minutes."
 *   ></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Description Slot
 * ```html
 * <nys-processlist id="application-steps-desc-slot">
 *   <nys-processlistitem label="Gather your documents">
 *     <div slot="description">Recent pay stubs and a <strong>current</strong> property tax bill.</div>
 *   </nys-processlistitem>
 *   <nys-processlistitem label="Complete the application">
 *     <div slot="description">Most applicants finish in about <a href="https://www.ny.gov">20 minutes</a>.</div>
 *   </nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Size Small
 * ```html
 * <nys-processlist id="application-steps-sm" size="sm">
 *   <nys-processlistitem label="Gather your documents"></nys-processlistitem>
 *   <nys-processlistitem label="Complete the application"></nys-processlistitem>
 *   <nys-processlistitem label="Submit and await review"></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Strong
 * ```html
 * <nys-processlist id="application-steps-strong" strong>
 *   <nys-processlistitem label="Gather your documents"></nys-processlistitem>
 *   <nys-processlistitem label="Complete the application"></nys-processlistitem>
 *   <nys-processlistitem label="Submit and await review"></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Neutral
 * ```html
 * <nys-processlist id="application-steps-neutral" neutral>
 *   <nys-processlistitem label="Gather your documents"></nys-processlistitem>
 *   <nys-processlistitem label="Complete the application"></nys-processlistitem>
 *   <nys-processlistitem label="Submit and await review"></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Strong Neutral
 * ```html
 * <nys-processlist id="application-steps-strong-neutral" strong neutral>
 *   <nys-processlistitem label="Gather your documents"></nys-processlistitem>
 *   <nys-processlistitem label="Complete the application"></nys-processlistitem>
 *   <nys-processlistitem label="Submit and await review"></nys-processlistitem>
 * </nys-processlist>
 * ```
 */

export class NysProcesslist extends LitElement {
  /**
   * Unique identifier. Auto-generated if not provided.
   */
  @property({ type: String, reflect: true }) id = "";

  /**
   * Renders each step number in a bolder, higher-emphasis color.
   */
  @property({ type: Boolean, reflect: true }) strong = false;

  /**
   * Renders each step number using neutral (grayscale) coloring instead of the theme color.
   */
  @property({ type: Boolean, reflect: true }) neutral = false;

  /**
   * Step marker size: `sm` (smaller) or `md` (default).
   */
  @property({ type: String, reflect: true }) size: "md" | "sm" = "md";

  private _childObserver = new MutationObserver(() => this._syncSteps());

  // The host must not be a shadow host: Chrome ≥150 demotes role="listitem"
  // on elements slotted into a shadow-host list, so the items have to be
  // direct DOM children of the element carrying role="list".
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    adoptLightStyles();
    if (!this.id) {
      this.id = `nys-processlist-${Date.now()}-${componentIdCounter++}`;
    }
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "list");
    }

    this._childObserver.observe(this, { childList: true });
    this._syncSteps();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._childObserver.disconnect();
  }

  // Ordering lives on the list, not the item, so numbers stay correct when
  // items are added, removed, or reordered.
  private _syncSteps() {
    const items = Array.from(this.children).filter(
      (el): el is NysProcesslistitem =>
        el.tagName.toLowerCase() === "nys-processlistitem",
    );

    items.forEach((item, index) => {
      item.setStep(index + 1);
    });
  }
}

if (!customElements.get("nys-processlist")) {
  customElements.define("nys-processlist", NysProcesslist);
}

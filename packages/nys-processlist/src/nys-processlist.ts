import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import "./nys-processlistitem";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-processlist.scss?inline";

let componentIdCounter = 0;

// The list renders in light DOM, so its styles are adopted into whichever
// root (document or containing shadow root) the element lives in — once per root.
const lightSheet = new CSSStyleSheet();
lightSheet.replaceSync(styles);
const styledRoots = new WeakSet<Document | ShadowRoot>();

/**
 * A process list is a component that displays a sequence of numbered steps, making it easy to communicate a multi-step process across web projects.
 *
 * Add `<nys-processlistitem>` elements as children. Each item uses its default slot for the step
 * label and `<span slot="description">` for supporting copy. Step numbers are assigned by the list,
 * so items never set their own number; use `start` to begin the sequence at a value other than 1.
 *
 * @summary An ordered list of numbered process steps.
 * @element nys-processlist
 *
 * Children: one or more `<nys-processlistitem>` elements, kept in light DOM so the
 * `list`/`listitem` roles stay directly related in the accessibility tree.
 *
 * @example Basic
 * ```html
 * <nys-processlist id="application-steps">
 *   <nys-processlistitem>Gather your documents</nys-processlistitem>
 *   <nys-processlistitem>Complete the application</nys-processlistitem>
 *   <nys-processlistitem>Submit and await review</nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Description
 * ```html
 * <nys-processlist id="application-steps2">
 *   <nys-processlistitem>
 *     Gather your documents
 *     <span slot="description">Recent pay stubs and a current property tax bill.</span>
 *   </nys-processlistitem>
 *   <nys-processlistitem>
 *     Complete the application
 *     <span slot="description">Most applicants finish in about 20 minutes.</span>
 *   </nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Custom start
 * ```html
 * <nys-processlist id="application-steps3" start="3">
 *   <nys-processlistitem>Submit and await review</nys-processlistitem>
 *   <nys-processlistitem>Receive your determination</nys-processlistitem>
 * </nys-processlist>
 * ```
 */

export class NysProcesslist extends LitElement {
  /**
   * Unique identifier. Auto-generated if not provided.
   */
  @property({ type: String, reflect: true }) id = "";

  /**
   * Number the first step starts at, matching `<ol start>`. Subsequent items increment from here.
   * @default 1
   */
  @property({ type: Number, reflect: true }) start = 1;

  private _childObserver = new MutationObserver(() => this._syncSteps());

  // The host must not be a shadow host: Chrome ≥150 demotes role="listitem"
  // on elements slotted into a shadow-host list, so the items have to be
  // direct DOM children of the element carrying role="list".
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-processlist-${Date.now()}-${componentIdCounter++}`;
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
    this._syncSteps();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._childObserver.disconnect();
  }

  updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (changedProperties.has("start")) {
      this._syncSteps();
    }
  }

  // Ordering lives on the list, not the item, so numbers stay correct when
  // items are added, removed, or reordered.
  private _syncSteps() {
    const items = Array.from(this.children).filter(
      (el) => el.tagName.toLowerCase() === "nys-processlistitem",
    );

    const start = Number.isFinite(this.start) ? Math.trunc(this.start) : 1;

    items.forEach((item, index) => {
      item.setAttribute("step", String(start + index));
    });
  }
}

if (!customElements.get("nys-processlist")) {
  customElements.define("nys-processlist", NysProcesslist);
}

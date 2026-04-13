import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tab.scss?inline";

/** @internal Monotonically increasing counter used to generate unique element IDs. */
let componentIdCounter = 0;

/**
 * `<nys-tabpanel>` is a content panel paired with a `<nys-tab>` inside a
 * `<nys-tabgroup>`.
 *
 * Pairing is determined by render order: the Nth `<nys-tabpanel>` child of a
 * `<nys-tabgroup>` corresponds to the Nth `<nys-tab>` child.
 * `aria-labelledby` and the `hidden` attribute are managed externally by
 * `<nys-tabgroup>` via `_applySelection`; do not set them directly.
 *
 * @element nys-tabpanel
 *
 * @slot - Default slot for panel content. Rendered inside a wrapper `<div>`
 *   with the `.nys-tabpanel` class for styling.
 */
export class NysTabpanel extends LitElement {
  static styles = unsafeCSS(styles);

  /**
   * Unique identifier for the panel element.
   * If not provided, one is auto-generated in `connectedCallback`.
   * Reflected to the DOM attribute so `aria-controls` references on sibling
   * `<nys-tab>` elements resolve correctly.
   *
   * @attr id
   */
  @property({ type: String, reflect: true }) id = "";

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Called when the element is inserted into the document.
   * Auto-generates a unique `id` if one was not provided, then sets
   * `role="tabpanel"` on the host so the ARIA role is visible outside the
   * shadow DOM.
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-tabpanel-${Date.now()}-${componentIdCounter++}`;
    }
    this.setAttribute("role", "tabpanel");
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  render() {
    return html`
      <div class="nys-tabpanel">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get("nys-tabpanel")) {
  customElements.define("nys-tabpanel", NysTabpanel);
}

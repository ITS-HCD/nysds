import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tab.scss?inline";

let componentIdCounter = 0;

/**
 * `<nys-tabpanel>` is a content panel paired with a `<nys-tab>` inside a `<nys-tabgroup>`.
 * Pairing is done by matching tab id if provided, otherwise by render order.
 * ARIA wiring (aria-labelledby) is applied externally by `<nys-tabgroup>`.
 */
export class NysTabpanel extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: Boolean, reflect: true }) hidden = false;

  // Lifecycle Methods
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-tabpanel-${Date.now()}-${componentIdCounter++}`;
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  render() {
    return html`
      <div class="nys-tabpanel" role="tabpanel" ?hidden=${this.hidden}>
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get("nys-tabpanel")) {
  customElements.define("nys-tabpanel", NysTabpanel);
}

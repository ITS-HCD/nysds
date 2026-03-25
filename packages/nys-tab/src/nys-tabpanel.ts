import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tab.scss?inline";

let componentIdCounter = 0;

/**
 * `<nys-tabpanel>` is a content panel paired with a `<nys-tab>` inside a `<nys-tabgroup>`.
 * Pairing is by render order. ARIA wiring (aria-labelledby) is applied externally by `<nys-tabgroup>`.
 */
export class NysTabpanel extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-tabpanel-${Date.now()}-${componentIdCounter++}`;
    }
    this.setAttribute("role", "tabpanel");
  }

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

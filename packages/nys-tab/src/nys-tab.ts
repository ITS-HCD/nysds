import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tab.scss?inline";

let componentIdCounter = 0;

/**
 * `<nys-tab>` is a single tab within a `<nys-tabgroup>`.
 * Paired with a `<nys-tabpanel>` by render order.
 * ARIA wiring (aria-controls, tabindex, selected) is applied by `<nys-tabgroup>`.
 */
export class NysTab extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String }) label = "";
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-tab-${Date.now()}-${componentIdCounter++}`;
    }
    this.setAttribute("role", "tab");
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */


  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private _handleClick() {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent("nys-tab-select", {
        bubbles: true,
        composed: true,
        detail: { id: this.id, label: this.label },
      }),
    );
  }

  private _handleFocus() {
    this.dispatchEvent(
      new CustomEvent("nys-tab-focus", {
        bubbles: true,
        composed: true,
        detail: { id: this.id },
      }),
    );
  }

  private _handleBlur() {
    this.dispatchEvent(
      new CustomEvent("nys-tab-blur", {
        bubbles: true,
        composed: true,
        detail: { id: this.id },
      }),
    );
  }

  render() {
    return html`
      <nys-button
        class="nys-tab"
        type="button"
        label=${this.label}
        ?disabled=${this.disabled}
        ariaControls=${this.getAttribute("aria-controls") ?? ""}
        @nys-click=${this._handleClick}
        @nys-focus=${this._handleFocus}
        @nys-blur=${this._handleBlur}
      ></nys-button>
    `;
  }
}

if (!customElements.get("nys-tab")) {
  customElements.define("nys-tab", NysTab);
}

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tab.scss?inline";

let componentIdCounter = 0;

/**
 * `<nys-tab>` is a single tab within a `<nys-tabgroup>`.
 * Paired with a `<nys-tabpanel>` by render order or matching id.
 */
export class NysTab extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String }) label = "";
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  // Lifecycle Methods
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-tab-${Date.now()}-${componentIdCounter++}`;
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
      <div class="nys-tab">
        <nys-button
          type="button"
          label=${this.label}
          ?disabled=${this.disabled}
          role="tab"
          aria-selected=${this.selected ? "true" : "false"}
          aria-disabled=${this.disabled ? "true" : "false"}
          tabindex="0"
          @nys-click=${this._handleClick}
          @nys-focus=${this._handleFocus}
          @nys-blur=${this._handleBlur}
        ></nys-button>
      </div>
    `;
  }
}

if (!customElements.get("nys-tab")) {
  customElements.define("nys-tab", NysTab);
}

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-card.scss?inline";

let componentIdCounter = 0;

/**
 * A card component is a reusable, self-contained element that groups related content and actions about a single subject into a distinct, flexible container.
 */

export class NysCard extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";

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
      this.id = `nys-card-${Date.now()}-${componentIdCounter++}`;
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  // Placeholder for generic functions (component-specific)

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  // Placeholder for event handlers if needed

  render() {
    return html`<div class="nys-card">
      <slot name="header-slot" class="nys-card__header-slot"></slot>
      <slot></slot>
      <slot name="footer-slot" class="nys-card__footer-slot"></slot>
    </div>`;
  }
}

if (!customElements.get("nys-card")) {
  customElements.define("nys-card", NysCard);
}

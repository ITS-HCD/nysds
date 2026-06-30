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

  /**
   * Unique identifier. Auto-generated if not provided.
   */
  @property({ type: String, reflect: true }) id = "";

  /**
   * Appears above the heading text.
   */
  @property({ type: String }) preheading = "";

  /**
   * Heading text in the card.
   */
  @property({ type: String }) heading = "";

  /**
   * Appears below the heading text.
   */
  @property({ type: String }) subheading = "";

  /**
   * Appears below the subheading text. Takes in plain text. Use the main slot if the description requires rich text or more content.
   */
  @property({ type: String }) description = "";

  /**
   * Visual content for the card. Supported types are images: png, jpg, etc.
   */
  @property({ type: String }) media = "";

  /**
   * When true, adds padding around the media to visually contain it.
   */
  @property({ type: Boolean }) inset = false;

  /**
   * When true, adds a drop shadow to the card, giving it a raised appearance.
   */
  @property({ type: Boolean, reflect: true }) elevated = false;

  /**
   * Accent appearing on the media. Only supports date in v1
   */
  @property({ type: String }) mediaAccent = "";

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
    return html` <div class="nys-card">
      ${this.media
        ? html`<div>
            <p>there is media: ${this.media}</p>
            <p>there is mediaAccent: ${this.mediaAccent}</p>
          </div>`
        : ""}
      <slot name="top-slot" class="nys-card__top-slot"></slot>
      <div>
        <p class="nys-card__preheading">${this.preheading}</p>
        <h2 class="nys-card__heading">${this.heading}</h2>
        <p class="nys-card__subheading">${this.subheading}</p>
      </div>
      <p class="nys-card__description">${this.description}</p>
      <slot></slot>
      <slot name="footer-slot" class="nys-card__footer-slot"></slot>
    </div>`;
  }
}

if (!customElements.get("nys-card")) {
  customElements.define("nys-card", NysCard);
}

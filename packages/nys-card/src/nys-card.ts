import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-card.scss?inline";

let componentIdCounter = 0;

/**
 * A reusable, self-contained container that groups related content and actions
 * about a single subject into a distinct, flexible container.
 *
 * Text content is supplied through the `preheading`, `heading`, `subheading`, and
 * `description` properties. For richer content, use the `top`, default, and
 * `footer` slots to project custom markup such as buttons, lists, or links.
 *
 * @summary Flexible container that groups related content and actions about a single subject.
 * @element nys-card
 *
 * @slot top - Content rendered above the heading block (e.g. a badge or label).
 * @slot - Default slot for the card's main body. Use for rich content when the `description` property is not enough.
 * @slot footer - Content rendered at the bottom of the card, typically actions like buttons or links.
 *
 * @example Basic
 * ```html
 * <nys-card
 *  heading="Heading"
 *  subheading="Subheading"
 *  description="A short description of the card's subject."
 * ></nys-card>
 * ```
 *
 * @example Preheading
 * ```html
 * <nys-card
 *  preheading="Preheading"
 *  heading="Heading"
 *  subheading="Subheading"
 * ></nys-card>
 * ```
 *
 * @example Media
 * ```html
 * <nys-card
 *  media="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
 *  heading="Heading"
 *  subheading="Subheading"
 *  description="A card with a media image at the top."
 * ></nys-card>
 * ```
 *
 * @example Inset Media
 * ```html
 * <nys-card
 *  media="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
 *  heading="Heading"
 *  description="Inset adds padding around the media to visually contain it."
 *  inset
 * ></nys-card>
 * ```
 *
 * @example Elevated
 * ```html
 * <nys-card
 *  heading="Heading"
 *  subheading="Subheading"
 *  description="Elevated adds a drop shadow to give the card a raised appearance."
 *  elevated
 * ></nys-card>
 * ```
 *
 * @example Footer Slot
 * ```html
 * <nys-card heading="Heading" description="A card with actions in the footer slot.">
 *  <nys-button slot="footer" label="Learn more"></nys-button>
 * </nys-card>
 * ```
 *
 * @example Top Slot
 * ```html
 * <nys-card heading="Heading" subheading="Subheading">
 *  <nys-badge slot="top" label="New" intent="success"></nys-badge>
 * </nys-card>
 * ```
 *
 * @example Rich Content
 * ```html
 * <nys-card heading="What's included">
 *  <nys-iconlist divider>
 *    <nys-iconlistitem icon="check">First item</nys-iconlistitem>
 *    <nys-iconlistitem icon="check">Second item</nys-iconlistitem>
 *    <nys-iconlistitem icon="check">Third item</nys-iconlistitem>
 *  </nys-iconlist>
 *  <nys-button slot="footer" label="Get started"></nys-button>
 * </nys-card>
 * ```
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
        ? html`<div class="nys-card__media-container">
            <img class="nys-card__media" src=${this.media} />
            <div class="nys-card--media-accent">
              <p class="nys-card--media-accent-month">Oct</p>
              <p class="nys-card--media-accent-day">16</p>
            </div>
          </div>`
        : ""}
      <div class="nys-card__main-content">
        <slot name="top" class="nys-card__top"></slot>
        <div>
          ${this.preheading
            ? html`<p class="nys-card__preheading">${this.preheading}</p>`
            : ""}
          ${this.heading
            ? html`<h2 class="nys-card__heading">${this.heading}</h2>`
            : ""}
          ${this.subheading
            ? html`<p class="nys-card__subheading">${this.subheading}</p>`
            : ""}
        </div>
        ${this.description
          ? html`<p class="nys-card__description">${this.description}</p>`
          : ""}
        <slot></slot>
      </div>
      <slot name="footer" class="nys-card__footer"></slot>
    </div>`;
  }
}

if (!customElements.get("nys-card")) {
  customElements.define("nys-card", NysCard);
}

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-card.scss?inline";

let componentIdCounter = 0;

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

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
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *  <nys-card
 *   heading="Heading"
 *   description="A short description of the card's subject."
 *  ></nys-card>
 * </div>
 * ```
 *
 * @example Preheading
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *  <nys-card
 *   preheading="Preheading"
 *   heading="Heading"
 *   description="A short description of the card's subject."
 *  ></nys-card>
 * </div>
 * ```
 *
 * @example Heading Level
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *  <nys-card
 *   heading="Heading"
 *   headingLevel="h3"
 *   description="Set the heading level to fit the page's heading hierarchy."
 *  ></nys-card>
 * </div>
 * ```
 *
 * @example Subheading
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *  <nys-card
 *   heading="Heading"
 *   subheading="Subheading"
 *   description="A short description of the card's subject."
 *  ></nys-card>
 * </div>
 * ```
 *
 * @example Media
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *   <nys-card
 *     heading="Heading"
 *     description="A card with a media image."
 *   >
 *     <img slot="media" src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop" />
 *   </nys-card>
 * </div>
 * ```
 *
 * @example Inset Media
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *   <nys-card
 *    heading="Heading"
 *    description="Inset adds padding around the media to visually contain it."
 *    inset
 *   >
 *     <img slot="media" src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop" />
 *   </nys-card>
 * </div>
 * ```
 *
 * @example Media Accent
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *   <nys-card
 *     heading="Heading"
 *     description="A card with a media image and a date accent."
 *   >
 *     <img slot="media" src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop" />
 *     <span slot="media-accent">Oct 16</span>
 *   </nys-card>
 * </div>
 * ```
 *
 * @example Inset Media Accent
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *   <nys-card
 *     heading="Heading"
 *     description="A card with a media image and a date accent."
 *     inset
 *   >
 *     <img slot="media" src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop" />
 *     <span slot="media-accent">10/16</span>
 *   </nys-card>
 * </div>
 * ```
 *
 * @example Elevated
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *   <nys-card
 *     heading="Heading"
 *     description="Elevated adds a drop shadow to give the card a raised appearance."
 *     elevated
 *   ></nys-card>
 * </div>
 * ```
 *
 * @example Footer Slot
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *   <nys-card heading="Heading" description="A card with actions in the footer slot.">
 *     <nys-button slot="footer" label="Learn more"></nys-button>
 *   </nys-card>
 * </div>
 * ```
 *
 * @example Top Slot
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *   <nys-card heading="Heading" description="A card with content in the top slot.">
 *     <nys-badge slot="top" label="New" intent="success"></nys-badge>
 *   </nys-card>
 * </div>
 * ```
 *
 * @example Icon List
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *   <nys-card heading="What's included">
 *     <nys-iconlist divider>
 *       <nys-iconlistitem icon="check">First item</nys-iconlistitem>
 *       <nys-iconlistitem icon="check">Second item</nys-iconlistitem>
 *       <nys-iconlistitem icon="check">Third item</nys-iconlistitem>
 *     </nys-iconlist>
 *   </nys-card>
 * </div>
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
   * Heading level used for the card heading (`h1` through `h6`).
   */
  @property({ type: String, reflect: true })
  headingLevel: HeadingLevel = "h2";

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
   * A date accent displayed over the media, in `M/D` format (e.g. `"10/16"`).
   * The month is shown as a three-letter abbreviation and the day as a number
   * (e.g. "Oct 16"). Only renders when `media` is set and the value is a valid
   * date. Only supports dates in v1.
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

  private static readonly MONTH_ABBREVIATIONS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Parse the `mediaAccent` "M/D" string into a month abbreviation and day.
  // Returns null when empty or not a valid date so the accent is not rendered.
  private parseMediaAccent(): { month: string; day: string } | null {
    const parts = this.mediaAccent.split("/");
    if (parts.length !== 2) return null;

    const month = Number(parts[0]);
    const day = Number(parts[1]);
    if (!Number.isInteger(month) || month < 1 || month > 12) return null;
    if (!Number.isInteger(day) || day < 1 || day > 31) return null;

    return {
      month: NysCard.MONTH_ABBREVIATIONS[month - 1],
      day: String(day),
    };
  }

  private renderHeading() {
    if (!this.heading) return "";

    const headingTag = {
      h1: html`<h1 class="nys-card__heading">${this.heading}</h1>`,
      h2: html`<h2 class="nys-card__heading">${this.heading}</h2>`,
      h3: html`<h3 class="nys-card__heading">${this.heading}</h3>`,
      h4: html`<h4 class="nys-card__heading">${this.heading}</h4>`,
      h5: html`<h5 class="nys-card__heading">${this.heading}</h5>`,
      h6: html`<h6 class="nys-card__heading">${this.heading}</h6>`,
    };

    return headingTag[this.headingLevel];
  }

  private renderMediaAccent() {
    const accent = this.parseMediaAccent();
    if (!accent) return "";

    return html`<div class="nys-card--media-accent">
      <p class="nys-card--media-accent-month">${accent.month}</p>
      <p class="nys-card--media-accent-day">${accent.day}</p>
    </div>`;
  }

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
            ${this.renderMediaAccent()}
          </div>`
        : ""}
      <div class="nys-card__main-content">
        <slot name="top" class="nys-card__top"></slot>
        <div>
          ${this.preheading
            ? html`<p class="nys-card__preheading">${this.preheading}</p>`
            : ""}
          ${this.renderHeading()}
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

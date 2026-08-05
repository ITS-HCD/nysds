import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-card.scss?inline";

let componentIdCounter = 0;

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * A reusable, self-contained container that groups related content and actions
 * about a single subject into a distinct, flexible container.
 *
 * Text content is supplied through the `preheading`, `heading`, `subheading`, and
 * `description` properties. For richer content, use the `preheading`, default, and
 * `footer` slots to project custom markup such as buttons, lists, or links.
 *
 * @summary Flexible container that groups related content and actions about a single subject.
 * @element nys-card
 *
 * @slot preheading - Content rendered above the heading block (e.g. a badge or label).
 * @slot - Default slot for the card's main body. Use for rich content when the `description` property is not enough.
 * @slot footer - Content rendered at the footer of the card, typically actions like buttons or links.
 * @slot media - Visual content displayed at the top of the card, typically an `<img>`.
 * @slot media-accent - Text for the accent badge displayed over the media, typically a date. Pass a wrapper holding two elements: the first is rendered as the month line, the second as the day line. Only renders when the `media` slot has content.
 *
 * The card becomes a single interactive control when it is given something to do:
 * an `href` renders it as an `<a>`, a click handler (`onClick` or an inline
 * `onclick`) renders it as a `<button>`.
 *
 * @cssprop [--nys-card-height=fit-content] - Height of the card. Set to `100%` to stretch the card to its container's height, so a row of cards renders at an equal height. The extra height is absorbed by the main content area, keeping the `footer` slot pinned to the bottom of the card. Requires the container to give the card a height to fill (e.g. a grid column with `nys-display-flex`).
 *
 * @fires nys-click - Fired when an interactive card is activated (mouse or keyboard).
 * @fires nys-focus - Fired when an interactive card receives focus.
 * @fires nys-blur - Fired when an interactive card loses focus.
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
 *     <img slot="media"
 *       src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
 *       role="presentation"
 *     />
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
 *     <img slot="media"
 *       src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
 *       role="presentation"
 *     />
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
 *     <img slot="media"
 *       src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
 *       role="presentation"
 *     />
 *     <div slot="media-accent">
 *       <span>Oct</span>
 *       <span>16</span>
 *     </div>
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
 *     <img slot="media"
 *       src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
 *       role="presentation"
 *     />
 *     <div slot="media-accent">
 *       <span>Oct</span>
 *       <span>16</span>
 *     </div>
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
 * @example Clickable
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *   <nys-card
 *     onclick="alert('you clicked me')"
 *     heading="Heading"
 *     description="The whole card is one button. To visually indicate this you should add the arrow icon to the footer slot."
 *   >
 *     <nys-icon slot="footer" name="arrow_forward" size="5xl"></nys-icon>
 *   </nys-card>
 * </div>
 * ```
 *
 * @example Clickable Link
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *   <nys-card
 *     href="https://www.ny.gov/"
 *     target="_blank"
 *     heading="Visit NY.gov"
 *     description="The whole card is one link.  To visually indicate this you should add the arrow icon to the footer slot."
 *   >
 *     <nys-icon slot="footer" name="open_in_new" size="5xl" style="justify-content: end;"></nys-icon>
 *   </nys-card>
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
 * @example Preheading Slot
 * ```html
 * <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
 *   <nys-card heading="Heading" description="A card with content in the preheading slot.">
 *     <nys-badge slot="preheading" label="New" intent="success"></nys-badge>
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
 *
 * @example Stretch to Fill Column Height
 * ```html
 * <div class="nys-grid-row nys-grid-gap" style="--nys-card-height: 100%">
 *   <div
 *     class="nys-mobile-lg:nys-grid-col-6 nys-tablet:nys-grid-col-4 nys-display-flex"
 *   >
 *     <nys-card
 *       heading="Roosevelt Island Four Freedoms State Park"
 *       description="A memorial park on Roosevelt Island dedicated to Franklin D. Roosevelt, featuring sweeping lawns, formal gardens, and panoramic views of the Manhattan and Queens waterfronts on all sides."
 *     >
 *       <img slot="media" src="/assets/images/card/manhatten.png" role="presentation" />
 *       <nys-button slot="footer" label="Visit Manhattan" fullWidth></nys-button>
 *     </nys-card>
 *   </div>
 *   <div
 *     class="nys-mobile-lg:nys-grid-col-6 nys-tablet:nys-grid-col-4 nys-display-flex"
 *   >
 *     <nys-card heading="Astoria Park" description="A waterfront park.">
 *       <img slot="media" src="/assets/images/card/astoria.jpg" role="presentation" />
 *       <nys-button slot="footer" label="Visit Queens" fullWidth></nys-button>
 *     </nys-card>
 *   </div>
 *   <div
 *     class="nys-mobile-lg:nys-grid-col-6 nys-tablet:nys-grid-col-4 nys-display-flex"
 *   >
 *     <nys-card heading="Brooklyn Bridge Park" description="A park.">
 *       <img slot="media" src="/assets/images/card/brooklynbridge.png" role="presentation" />
 *       <nys-button slot="footer" label="Visit Brooklyn" fullWidth></nys-button>
 *     </nys-card>
 *   </div>
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
   * When true, adds padding around the media to visually contain it.
   */
  @property({ type: Boolean }) inset = false;

  /**
   * When true, adds a drop shadow to the card, giving it a raised appearance.
   */
  @property({ type: Boolean, reflect: true }) elevated = false;

  /**
   * URL to navigate to. Makes the whole card a single `<a>`. Keep the card's slots
   * free of other interactive elements when using this — nesting them inside the
   * card control is invalid HTML and unreachable for keyboard and screen reader users.
   */
  @property({ type: String }) href = "";

  /**
   * Link target: `_self` (same tab), `_blank` (new tab), `_parent`, `_top`, or frame name. Only used with `href`.
   */
  @property({ type: String, reflect: true }) target:
    | "_self"
    | "_blank"
    | "_parent"
    | "_top"
    | "framename" = "_self";

  /**
   * Click handler. Makes the whole card a single `<button>`. Use instead of
   * `@click` to ensure keyboard accessibility.
   */
  @property({ attribute: false }) onClick: ((event: Event) => void) | null =
    null;

  // Whether the media and accent slots have assigned content, so the media
  // container and accent badge are only rendered when they are used.
  @state() private _hasMedia = false;

  // Whether the preheading slot has assigned content, so the preheading block
  // renders for slotted markup as well as for the `preheading` property.
  @state() private _hasPreheadingSlot = false;

  // Month and day text read from the `media-accent` slot's two lines.
  @state() private _accentMonth = "";
  @state() private _accentDay = "";

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

  // A card is interactive when it has somewhere to go or something to run:
  // `href` makes it a link, a click handler makes it a button. `onclick` is the
  // native handler, set by an inline `onclick="…"` attribute on the host.
  private get isClickable() {
    return !!this.href || !!this.onClick || !!this.onclick;
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

  // The accent's two lines live in the light DOM, so the shadow stylesheet
  // cannot reach them. Read their text instead and render it into the badge,
  // where the month and day styles apply: first line is the month, second the day.
  private readMediaAccent(slot: HTMLSlotElement) {
    const assigned = slot.assignedElements({ flatten: true });
    // Support both a single wrapper holding the two lines and two sibling elements.
    const lines =
      assigned.length > 1 ? assigned : Array.from(assigned[0]?.children ?? []);

    this._accentMonth = lines[0]?.textContent?.trim() ?? "";
    this._accentDay = lines[1]?.textContent?.trim() ?? "";
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private hasSlotContent(e: Event) {
    const slot = e.target as HTMLSlotElement;
    return slot.assignedNodes({ flatten: true }).length > 0;
  }

  private handleMediaSlotChange(e: Event) {
    this._hasMedia = this.hasSlotContent(e);
  }

  private handlePreheadingSlotChange(e: Event) {
    this._hasPreheadingSlot = this.hasSlotContent(e);
  }

  private handleMediaAccentSlotChange(e: Event) {
    this.readMediaAccent(e.target as HTMLSlotElement);
  }

  private handleClick(e: Event) {
    this.onClick?.(e);
    this.dispatchEvent(
      new Event("nys-click", { bubbles: true, composed: true }),
    );
  }

  private handleFocus() {
    this.dispatchEvent(
      new Event("nys-focus", { bubbles: true, composed: true }),
    );
  }

  private handleBlur() {
    this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true }),
    );
  }

  render() {
    const hasMediaAccent = !!(this._accentMonth || this._accentDay);
    // The preheading block accepts either the property or slotted rich content.
    const hasPreheading = !!this.preheading || this._hasPreheadingSlot;

    // The card's inner markup is identical in all three cases; only the element
    // wrapping it changes based on how the card was made interactive.
    const content = html`
      <div class="nys-card__media-container" ?hidden=${!this._hasMedia}>
        <slot
          name="media"
          class="nys-card__media"
          @slotchange=${this.handleMediaSlotChange}
        ></slot>
        <div class="nys-card--media-accent" ?hidden=${!hasMediaAccent}>
          <p class="nys-card--media-accent-month">${this._accentMonth}</p>
          <p class="nys-card--media-accent-day">${this._accentDay}</p>
        </div>
        <div class="nys-card__media-accent-source" hidden>
          <slot
            name="media-accent"
            @slotchange=${this.handleMediaAccentSlotChange}
          ></slot>
        </div>
      </div>
      <div class="nys-card__main-content">
        <div>
          <p class="nys-card__preheading" ?hidden=${!hasPreheading}>
            <slot
              name="preheading"
              @slotchange=${this.handlePreheadingSlotChange}
              >${this.preheading}</slot
            >
          </p>
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
    `;

    if (!this.isClickable) {
      return html`<div class="nys-card">${content}</div>`;
    }

    if (this.href) {
      return html`<a
        class="nys-card nys-card--clickable"
        href=${this.href}
        target=${this.target}
        @click=${this.handleClick}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
        >${content}</a
      >`;
    }

    return html`<button
      class="nys-card nys-card--clickable"
      type="button"
      @click=${this.handleClick}
      @focus=${this.handleFocus}
      @blur=${this.handleBlur}
    >
      ${content}
    </button>`;
  }
}

if (!customElements.get("nys-card")) {
  customElements.define("nys-card", NysCard);
}

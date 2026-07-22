import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-verticalnav.scss?inline";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-verticalnav.light.scss?inline";
import "./nys-verticalnavgroup";

let verticalNavIdCounter = 0;

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

let _lightSheet: CSSStyleSheet | null = null;
// Injects the lightDOM styling for the scss for
// styling CSS into the adopted/constructed stylesheet.
function adoptLightStyles() {
  if (_lightSheet || typeof document === "undefined") return;
  _lightSheet = new CSSStyleSheet();
  _lightSheet.replaceSync(lightStyles);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, _lightSheet];
}

/**
 * Vertical navigation component with responsive desktop/mobile behavior.
 *
 * Renders as a side navigation on desktop and collapses into a
 * `<nys-accordion>` on tablet and mobile. The default slot accepts a
 * `<ul>` of links with optional section headings (`<h2>` to `<h6>`) or
 * `<nys-verticalnavgroup>` elements. Use the `heading` slot to replace the
 * generated heading and the `footer` slot for additional content below the
 * navigation.
 *
 * @summary Responsive navigation that becomes an accordion on smaller screens.
 * @element nys-verticalnav
 *
 * @example Basic
 * ```html
 * <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
 *   <ul>
 *     <li><a href="/">Home</a></li>
 *     <li><a href="/services">Services</a></li>
 *     <li>
 *       <h3>Freshwater Fishing Regulations</h3>
 *       <ul>
 *         <li><a href="">Places to Fish</a></li>
 *         <li><a href="">Learn to Fish</a></li>
 *         <li><a href="">Ice Fishing</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example Heading slot
 * ```html
 * <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
 *   <div slot="heading">
 *     <h2>Freshwater Fishing</h2>
 *     <p>2026 Season Open</p>
 *   </div>
 *
 *   <ul>
 *     <li><a href="/">Home</a></li>
 *     <li><a href="/services">Services</a></li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example Footer slot
 * ```html
 * <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
 *   <ul>
 *     <li><a href="/">Home</a></li>
 *     <li><a href="/services">Services</a></li>
 *   </ul>
 *
 *   <div slot="footer">
 *     <nys-divider></nys-divider>
 *     <p>Regulations last updated: January 2026</p>
 *     <a href="/contact-dec">Contact the DEC for fishing inquiries</a>
 *   </div>
 * </nys-verticalnav>
 * ```
 *
 * @example Heading and footer
 * ```html
 * <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
 *   <div slot="heading">
 *     <h2>Freshwater Fishing</h2>
 *     <p>2026 Season Open</p>
 *   </div>
 *
 *   <ul>
 *     <li><a href="/">Home</a></li>
 *     <li><a href="/services">Services</a></li>
 *   </ul>
 *
 *   <div slot="footer">
 *     <nys-divider></nys-divider>
 *     <p>Regulations last updated: January 2026</p>
 *     <a href="/contact-dec">Contact the DEC for fishing inquiries</a>
 *   </div>
 * </nys-verticalnav>
 * ```
 *
 * @example Dropdown group
 * ```html
 * <nys-verticalnav heading="NYS Design System" headingLevel="h2">
 *   <ul>
 *     <li><a href="/">Foundations</a></li>
 *     <li><a href="/components">Components</a></li>
 *     <li>
 *       <nys-verticalnavgroup label="Accessibility">
 *         <ul>
 *           <li><a href="">WCAG Guidelines</a></li>
 *           <li><a href="">Screen Readers</a></li>
 *           <li><a href="">Color Contrast</a></li>
 *         </ul>
 *       </nys-verticalnavgroup>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example Active state
 * ```html
 * <nys-verticalnav heading="NYS Design System" headingLevel="h2">
 *   <ul>
 *     <li><a href="/">Foundations</a></li>
 *     <li>
 *       <nys-verticalnavgroup label="Accessibility">
 *         <ul>
 *           <li>
 *             <a aria-current="page" href="">
 *               WCAG Guidelines
 *             </a>
 *           </li>
 *           <li><a href="">Screen Readers</a></li>
 *           <li><a href="">Color Contrast</a></li>
 *         </ul>
 *       </nys-verticalnavgroup>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example Disabled state
 * ```html
 * <nys-verticalnav heading="NYS Design System" headingLevel="h2">
 *   <ul>
 *     <li><a href="/">Foundations</a></li>
 *     <li>
 *       <nys-verticalnavgroup disabled label="Accessibility">
 *         <ul>
 *           <li><a aria-disabled="true">WCAG Guidelines</a></li>
 *           <li><a href="">Screen Readers</a></li>
 *         </ul>
 *       </nys-verticalnavgroup>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example Hidden heading
 * ```html
 * <nys-verticalnav heading="Section navigation" hideHeading>
 *   <ul>
 *     <li><a href="/home">Home</a></li>
 *     <li><a href="/service">Service</a></li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example Page layout
 * ```html
 * <nys-globalheading
 *   homepageLink="https://ny.gov"
 *   agencyName="Office of Information Technology Services"
 * ></nys-globalheading>
 *
 * <nys-verticalnav heading="NYS Design System" headingLevel="h2">
 *   <ul>
 *     <li><a href="/">Foundations</a></li>
 *     <li><a href="/components" aria-current="page">Components</a></li>
 *     <li>
 *       <nys-verticalnavgroup label="Accessibility">
 *         <ul>
 *           <li><a href="">WCAG Guidelines</a></li>
 *           <li><a href="">Screen Readers</a></li>
 *           <li><a href="">Color Contrast</a></li>
 *         </ul>
 *       </nys-verticalnavgroup>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 *
 * <main>
 *   <p>Place content here.</p>
 * </main>
 *
 * <nys-globalfooter></nys-globalfooter>
 * ```
 *
 * @example Mobile controls
 * ```html
 * <nys-verticalnav id="my-nav">
 *   <ul>
 *     <li><a href="/">Home</a></li>
 *     <li><a href="/services">Services</a></li>
 *   </ul>
 * </nys-verticalnav>
 *
 * <nys-button
 *   label="Toggle navigation"
 *   onclick="document.querySelector('#my-nav').toggle()"
 * ></nys-button>
 * ```
 */

export class NysVerticalnav extends LitElement {
  static styles = unsafeCSS(styles);

  /** ID for the navigation. Generated automatically if not provided. */
  @property({ type: String, reflect: true })
  id = "";

  /** Heading text displayed at the top of the navigation. Defaults to "Page navigation". */
  @property({ type: String, reflect: true })
  heading = "Page navigation";

  /** Hides the visible heading while keeping an accessible label for the navigation. */
  @property({ type: Boolean, reflect: true })
  hideHeading = false;

  /** Heading level used for the navigation heading (`h1` through `h6`). */
  @property({ type: String, reflect: true })
  headingLevel: HeadingLevel = "h2";

  /** Expands or collapses the navigation on mobile. */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  @state() private _isMobile = false;
  private _mediaQuery: MediaQueryList | null = null;

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

    adoptLightStyles();

    if (!this.id) {
      this.id = `nys-verticalnav-${Date.now()}-${verticalNavIdCounter++}`;
    }

    this._mediaQuery = window.matchMedia("(max-width: 1023px)") ?? null; // Tablet size and below
    this._isMobile = this._mediaQuery.matches ?? false;
    this._mediaQuery.addEventListener("change", this._handleResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._mediaQuery?.removeEventListener("change", this._handleResize);
  }

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector(
      "slot:not([name])",
    ) as HTMLSlotElement;

    slot?.addEventListener("slotchange", () => {
      this._applyActiveState();
    });
  }

  /**
   * Public API for controlling the mobile accordion from outside the component
   * --------------------------------------------------------------------------
   */
  public open() {
    this.expanded = true;
  }

  public close() {
    this.expanded = false;
  }

  public toggle() {
    this.expanded = !this.expanded;
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  private _handleAccordionToggle = (e: CustomEvent) => {
    this.expanded = e.detail.expanded;
    this.dispatchEvent(
      new CustomEvent("nys-verticalnav-toggle", {
        detail: { id: this.id, expanded: this.expanded },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _handleResize = (e: MediaQueryListEvent) => {
    this._isMobile = e.matches;
  };

  private _applyActiveState() {
    this.querySelectorAll('a[aria-current="page"]').forEach((a) => {
      a.classList.add("nys-verticalnav__link--active");
    });

    // Auto-expand any group that contains an active link
    this.querySelectorAll("nys-verticalnavgroup").forEach((group) => {
      if (group.querySelector('a[aria-current="page"]')) {
        group.setAttribute("expanded", "");
        group.setAttribute("active", "");
      }
    });
  }

  /**
   * Helper Render Functions
   * --------------------------------------------------------------------------
   */
  private _renderHeading() {
    if (this.hideHeading) return html``;

    const headingId = `${this.id}-heading`;

    const headingTag = {
      h1: html`<h1 id=${headingId} class="nys-verticalnav__heading">
        ${this.heading}
      </h1>`,
      h2: html`<h2 id=${headingId} class="nys-verticalnav__heading">
        ${this.heading}
      </h2>`,
      h3: html`<h3 id=${headingId} class="nys-verticalnav__heading">
        ${this.heading}
      </h3>`,
      h4: html`<h4 id=${headingId} class="nys-verticalnav__heading">
        ${this.heading}
      </h4>`,
      h5: html`<h5 id=${headingId} class="nys-verticalnav__heading">
        ${this.heading}
      </h5>`,
      h6: html`<h6 id=${headingId} class="nys-verticalnav__heading">
        ${this.heading}
      </h6>`,
    };

    return html`<slot name="heading">${headingTag[this.headingLevel]}</slot>`;
  }

  private renderContentDesktop() {
    const headingId = `${this.id}-heading`;

    return html` <nav
      class="nys-verticalnav nys-verticalnav--desktop"
      aria-labelledby=${ifDefined(!this.hideHeading ? headingId : undefined)}
      aria-label=${ifDefined(this.hideHeading ? "Page navigation" : undefined)}
    >
      ${this._renderHeading()}
      <slot></slot>
      <slot name="footer"></slot>
    </nav>`;
  }

  private renderContentMobile() {
    return html` <nav class="nys-verticalnav nys-verticalnav--mobile">
      <nys-accordion bordered>
        <nys-accordionitem
          id="${this.id}-accordion"
          heading="${this.heading}"
          ?expanded=${this.expanded}
          @nys-accordionitem-toggle=${this._handleAccordionToggle}
        >
          <slot></slot>
          <slot name="footer"></slot>
        </nys-accordionitem>
      </nys-accordion>
    </nav>`;
  }

  render() {
    return this._isMobile
      ? this.renderContentMobile()
      : this.renderContentDesktop();
  }
}

if (!customElements.get("nys-verticalnav")) {
  customElements.define("nys-verticalnav", NysVerticalnav);
}

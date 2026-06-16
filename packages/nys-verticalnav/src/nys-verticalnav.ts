import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-verticalnav.scss?inline";
import "./nys-verticalnavgroup";

let componentIdCounter = 0;

type HeaderLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * Vertical navigation component with responsive desktop/mobile behavior.
 *
 * Renders as a side vertical navigation with heading and slotted link list on desktop. On tablet/mobile
 * it collapses into a `<nys-accordion>`. The default slot accepts a
 * `<ul>` of links; subheader `<li>` items (containing `<h2>`-`<h6>`). Use the `header` slot to replace the
 * auto-generated heading, and the `footer` slot for metadata or extra actions
 * below the link list.
 *
 * @summary Responsive vertical navigation — nav on desktop, accordion on mobile.
 * @element nys-verticalnav
 *
 * @example Basic usage
 * ```html
 * <nys-verticalnav header="Freshwater Fishing" headerLevel="h2">
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
 * @example With custom header slot
 * ```html
 * <nys-verticalnav header="Freshwater Fishing" headerLevel="h2">
 *   <div slot="header">
 *     <h2>Freshwater Fishing</h2>
 *     <p>2026 Season Open</p>
 *   </div>
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
 * @example With footer slot
 * ```html
 * <nys-verticalnav header="Freshwater Fishing" headerLevel="h2">
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
 *   <div slot="footer">
 *     <nys-divider></nys-divider>
 *     <p>Regulations last updated: January 2024</p>
 *     <a href="/contact-dec">Contact the DEC for fishing inquiries</a>
 *   </div>
 * </nys-verticalnav>
 * ```
 *
 * @example With dropdown group
 * ```html
 * <nys-verticalnav header="NYS Design System" headerLevel="h2">
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
 *     <li>
 *       <h3>Resources</h3>
 *       <ul>
 *         <li><a href="">Design Tokens</a></li>
 *         <li><a href="">Utilities</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example With active link (aria-current="page")
 * ```html
 * <nys-verticalnav header="NYS Design System" headerLevel="h2">
 *   <ul>
 *     <li><a href="/">Foundations</a></li>
 *     <li><a href="/components">Components</a></li>
 *     <li>
 *       <nys-verticalnavgroup label="Accessibility">
 *         <ul>
 *           <li><a aria-current="page" href="">WCAG Guidelines</a></li>
 *           <li><a href="">Screen Readers</a></li>
 *           <li><a href="">Color Contrast</a></li>
 *         </ul>
 *       </nys-verticalnavgroup>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example With disabled links and group
 * ```html
 * <nys-verticalnav header="NYS Design System" headerLevel="h2">
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
 *     <li>
 *       <h3>Resources</h3>
 *       <ul>
 *         <li><a aria-disabled="true">Design Tokens</a></li>
 *         <li><a href="">Utilities</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example Hidden header (aria-label used instead)
 * ```html
 * <nys-verticalnav header="Section nav" hideHeader>
 *   <ul>
 *     <li><a href="/home">Home</a></li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 */

export class NysVerticalnav extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) header = "Page navigation";
  @property({ type: Boolean, reflect: true }) hideHeader = false;
  @property({ type: String, reflect: true }) headerLevel: HeaderLevel = "h2";

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
    if (!this.id) {
      this.id = `nys-verticalnav-${Date.now()}-${componentIdCounter++}`;
    }

    this._mediaQuery = window.matchMedia("(max-width: 1023px)"); // Tablet size and below
    this._isMobile = this._mediaQuery.matches;
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
      this._removeDividers();
      this._applyActiveState();
      if (this._isMobile) this._injectDividers();
      else this._injectSubheaderDividers();
    });
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _handleResize = (e: MediaQueryListEvent) => {
    this._isMobile = e.matches;
    this._removeDividers();
    if (this._isMobile) this._injectDividers();
    else this._injectSubheaderDividers();
  };

  private _removeDividers() {
    this.querySelectorAll(
      "nys-divider.nys-verticalnav__divider--injected",
    ).forEach((divider) => divider.remove());
  }

  private _injectDividers() {
    this.querySelectorAll("ul > li").forEach((li) => {
      if (li.parentElement?.closest("nys-verticalnavgroup")) return;
      if (li.nextElementSibling?.tagName.toLowerCase() === "nys-divider")
        return;
      if (li.nextElementSibling) {
        const divider = document.createElement("nys-divider");
        divider.setAttribute("subtle", "");
        divider.classList.add("nys-verticalnav__divider--injected");
        li.insertAdjacentElement("afterend", divider);
      }
    });
  }

  private _injectSubheaderDividers() {
    this.querySelectorAll("ul > li").forEach((li) => {
      const hasSubheader = li.querySelector(
        ":scope > :is(h1, h2, h3, h4, h5, h6)",
      );

      if (!hasSubheader) return;

      // Prevent double-up if previous sibling is already a divider
      const prev = li.previousElementSibling;
      if (!prev) return;

      const prevIsDivider = prev.tagName.toLowerCase() === "nys-divider";
      const prevIsDividerLi =
        prev.tagName === "LI" &&
        prev.children.length === 1 &&
        prev.children[0].tagName.toLowerCase() === "nys-divider";
      if (prevIsDivider || prevIsDividerLi) return;

      const divider = document.createElement("nys-divider");
      divider.setAttribute("subtle", "");
      divider.classList.add("nys-verticalnav__divider--injected");
      li.insertAdjacentElement("beforebegin", divider);
    });
  }

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
  private _renderHeader() {
    if (this.hideHeader) return html``;

    const headingId = `${this.id}-heading`;

    const headingTag = {
      h1: html`<h1 id=${headingId} class="nys-verticalnav__header">
        ${this.header}
      </h1>`,
      h2: html`<h2 id=${headingId} class="nys-verticalnav__header">
        ${this.header}
      </h2>`,
      h3: html`<h3 id=${headingId} class="nys-verticalnav__header">
        ${this.header}
      </h3>`,
      h4: html`<h4 id=${headingId} class="nys-verticalnav__header">
        ${this.header}
      </h4>`,
      h5: html`<h5 id=${headingId} class="nys-verticalnav__header">
        ${this.header}
      </h5>`,
      h6: html`<h6 id=${headingId} class="nys-verticalnav__header">
        ${this.header}
      </h6>`,
    };

    return html`<slot name="header">${headingTag[this.headerLevel]}</slot>`;
  }

  private renderContentDesktop() {
    const headingId = `${this.id}-heading`;

    return html` <nav
      class="nys-verticalnav nys-verticalnav--desktop"
      aria-labelledby=${ifDefined(!this.hideHeader ? headingId : undefined)}
      aria-label=${ifDefined(this.hideHeader ? "Page navigation" : undefined)}
    >
      ${this._renderHeader()}
      <slot></slot>
      <slot name="footer"></slot>
    </nav>`;
  }

  private renderContentMobile() {
    return html` <nav class="nys-verticalnav nys-verticalnav--mobile">
      <nys-accordion bordered>
        <nys-accordionitem id="${this.id}-accordion" heading="${this.header}">
          <slot></slot>
          <slot name="footer"></slot>
        </nys-accordionitem>
      </nys-accordion>
    </nav>`;
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  // Placeholder for event handlers if needed

  render() {
    return this._isMobile
      ? this.renderContentMobile()
      : this.renderContentDesktop();
  }
}

if (!customElements.get("nys-verticalnav")) {
  customElements.define("nys-verticalnav", NysVerticalnav);
}

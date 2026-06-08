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
 * <nys-verticalnav navHeader="Freshwater Fishing">
 *   <ul>
 *     <li><a href="/home">Home</a></li>
 *     <li>
 *       <h3>Regulations</h3>
 *       <ul>
 *         <li><a href="/places">Places to Fish</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example With custom header and footer slots
 * ```html
 * <nys-verticalnav navHeader="Freshwater Fishing">
 *   <div slot="header">
 *     <h2>🎣 Freshwater Fishing</h2>
 *     <p>2024 Season Guide</p>
 *   </div>
 *   <ul>
 *     <li><a href="/home">Home</a></li>
 *   </ul>
 *   <div slot="footer">
 *     <nys-divider></nys-divider>
 *     <p>Last updated: January 2024</p>
 *   </div>
 * </nys-verticalnav>
 * ```
 *
 * @example Hidden header (aria-label used instead)
 * ```html
 * <nys-verticalnav navHeader="Section nav" hideHeader>
 *   <ul>
 *     <li><a href="/home">Home</a></li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 */

export class NysVerticalnav extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) navHeader = "Page navigation";
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

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const container = this.shadowRoot?.querySelector(
      ".nys-verticalnav__content",
    );
    if (!container) return;

    container.innerHTML = "";

    // Clone assigned node into the vertical nav's shadow DOM
    slot.assignedNodes({ flatten: true }).forEach((node) => {
      container.appendChild(node.cloneNode(true));
    });

    if (this._isMobile) {
      this._injectDividers(container);
    }

    if (!this._isMobile) {
      this._injectSubheaderDividers(container);
    }
  }

  private _handleResize = (e: MediaQueryListEvent) => {
    this._isMobile = e.matches;
  };

  /**
   * Helper Render Functions
   * --------------------------------------------------------------------------
   */
  private _renderHeader() {
    if (this.hideHeader) return html``;

    const headingId = `${this.id}-heading`;

    const headingTag = {
      h1: html`<h1 id=${headingId} class="nys-verticalnav__header">
        ${this.navHeader}
      </h1>`,
      h2: html`<h2 id=${headingId} class="nys-verticalnav__header">
        ${this.navHeader}
      </h2>`,
      h3: html`<h3 id=${headingId} class="nys-verticalnav__header">
        ${this.navHeader}
      </h3>`,
      h4: html`<h4 id=${headingId} class="nys-verticalnav__header">
        ${this.navHeader}
      </h4>`,
      h5: html`<h5 id=${headingId} class="nys-verticalnav__header">
        ${this.navHeader}
      </h5>`,
      h6: html`<h6 id=${headingId} class="nys-verticalnav__header">
        ${this.navHeader}
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
      <slot @slotchange=${this._handleSlotChange} style="display:none"></slot>
      <div class="nys-verticalnav__content"></div>
      <slot name="footer"></slot>
    </nav>`;
  }

  private renderContentMobile() {
    return html` <nav class="nys-verticalnav nys-verticalnav--mobile">
      <nys-accordion bordered>
        <nys-accordionitem
          id="${this.id}-accordion"
          heading="${this.navHeader}"
        >
          <slot
            @slotchange=${this._handleSlotChange}
            style="display:none"
          ></slot>
          <div class="nys-verticalnav__content"></div>
          <slot name="footer"></slot>
        </nys-accordionitem>
      </nys-accordion>
    </nav>`;
  }

  private _injectDividers(container: Element) {
    container.querySelectorAll("ul > li").forEach((li) => {
      // Skip if this <li> lives inside a subheader's sub-list
      const parentLi = li.parentElement?.closest("li");
      if (parentLi?.querySelector(":scope > :is(h1,h2,h3,h4,h5,h6)")) return;

      if (li.nextElementSibling) {
        const divider = document.createElement("nys-divider");
        li.insertAdjacentElement("afterend", divider);
      }
    });
  }

  private _injectSubheaderDividers(container: Element) {
    container.querySelectorAll("ul > li").forEach((li) => {
      const hasSubheader = li.querySelector(
        ":scope > :is(h1, h2, h3, h4, h5, h6)",
      );

      if (!hasSubheader) return;

      // Don't double-up if previous sibling is already a divider
      const prev = li.previousElementSibling;
      if (!prev) return;
      const prevIsDivider = prev.tagName.toLowerCase() === "nys-divider";
      const prevIsDividerLi =
        prev.tagName === "LI" &&
        prev.children.length === 1 &&
        prev.children[0].tagName.toLowerCase() === "nys-divider";
      if (prevIsDivider || prevIsDividerLi) return;

      li.insertAdjacentElement(
        "beforebegin",
        document.createElement("nys-divider"),
      );
    });
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

import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-verticalnav.scss?inline";

let componentIdCounter = 0;

type HeaderLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * `<nys-verticalnav>` is ...
 */

export class NysVerticalnav extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) label = "";
  @property({ type: String, reflect: true }) ariaLabel = "";
  @property({ type: String, reflect: true }) headerLevel: HeaderLevel = "h2";
  @property({ type: String, reflect: true }) accordionHeading = "On this page";

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

    this._mediaQuery = window.matchMedia("(max-width: 767px)"); // Tablet size and below
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

  private _handleResize = (e: MediaQueryListEvent) => {
    this._isMobile = e.matches;
  };

  private renderContentDesktop() {
    return html` <nav
      class="nys-verticalnav nys-verticalnav--desktop"
      aria-label=${this.ariaLabel || this.label || "Page navigation"}
    >
      <!-- <slot name="verticalnav__header"></slot> -->
      <slot></slot>
    </nav>`;
  }

  private renderContentMobile() {
    return html` <div class="nys-verticalnav nys-verticalnav--mobile">
      <nys-accordion>
        <nys-accordionitem
          id="${this.id}-accordion"
          heading="${this.accordionHeading}"
        >
          <slot name="verticalnav__header"></slot>
          <slot></slot>
        </nys-accordionitem>
      </nys-accordion>
    </div>`;
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

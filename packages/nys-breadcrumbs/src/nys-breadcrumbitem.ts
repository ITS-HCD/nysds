import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-breadcrumbs.scss?inline";

let breadcrumbItemIdCounter = 0;

/**
 * `<nys-breadcrumbitem>` is ...
 */

export class NysBreadcrumbItem extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) label = "";
  @property({ type: String, reflect: true }) link = "";

  /** Private property used by nys-breadcrumbs to indicate this breadcrumb item is the last in the trail **/
  @property({ type: Boolean }) isLast = false;
  @property({ type: Boolean }) isBackToParent = false;

  @state() private _isCurrentPage = false;

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
      this.id = `nys-breadcrumbitem-${Date.now()}-${breadcrumbItemIdCounter++}`;
    }
  }

  firstUpdated() {
    if (this.link.trim().length == 0) {
      this._isCurrentPage = true;
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private breadcrumbRender() {
    const isCurrentPage = this._isCurrentPage;

    if (this.isBackToParent) {
      return html`<li class="nys-breadcrumbitem">
        <nys-icon name="arrow_back" size="16"></nys-icon>
        <a href=${this.link}>${this.label}</a>
      </li>`;
    }

    if (isCurrentPage) {
      return html`<li class="nys-breadcrumbitem">${this.label}</li>`;
    }

    return html`<li class="nys-breadcrumbitem">
      <a href=${this.link} class="${this._isCurrentPage ? "current" : ""}"
        >${this.label}</a
      >
      ${!this.isLast
        ? html`<nys-icon name="chevron_right" size="14"></nys-icon>`
        : ""}
    </li>`;
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  // Placeholder for event handlers if needed

  render() {
    return this.breadcrumbRender();
  }
}

if (!customElements.get("nys-breadcrumbitem")) {
  customElements.define("nys-breadcrumbitem", NysBreadcrumbItem);
}

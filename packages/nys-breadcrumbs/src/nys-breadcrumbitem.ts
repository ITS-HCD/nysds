import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-breadcrumbs.scss?inline";

let breadcrumbItemIdCounter = 0;

/**
 * A single item in a `nys-breadcrumbs` navigation trail. Renders as a link
 * followed by a chevron separator, or as plain text when it represents the current page
 * (no `link` provided). When used as the only item inside `nys-breadcrumbs`, renders
 * as a back-to-parent link with a back arrow icon.
 *
 * For use as a direct child of `nys-breadcrumbs` only. Do not use standalone.
 *
 * @summary Single breadcrumb trail item with chevron separator and current page support.
 * @element nys-breadcrumbitem
 *
 * @fires nys-breadcrumbitem-click - Fired when the link is clicked. Detail: `{id, link}`.
 *
 * @example Linked crumb
 * ```html
 * <nys-breadcrumbitem link="/services" label="Services"></nys-breadcrumbitem>
 * ```
 *
 * @example Current page (no link — always last in trail)
 * ```html
 * <nys-breadcrumbitem label="Current Page"></nys-breadcrumbitem>
 * ```
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
        <a href=${this.link} @click=${this._handleClick}>${this.label}</a>
      </li>`;
    }

    if (isCurrentPage) {
      return html`<li class="nys-breadcrumbitem">${this.label}</li>`;
    }

    return html`<li class="nys-breadcrumbitem">
      <a
        href=${this.link}
        class="${this._isCurrentPage ? "current" : ""}"
        @click=${this._handleClick}
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
  private _handleClick() {
    this.dispatchEvent(
      new CustomEvent("nys-breadcrumbitem-click", {
        detail: { id: this.id, link: this.link },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return this.breadcrumbRender();
  }
}

if (!customElements.get("nys-breadcrumbitem")) {
  customElements.define("nys-breadcrumbitem", NysBreadcrumbItem);
}

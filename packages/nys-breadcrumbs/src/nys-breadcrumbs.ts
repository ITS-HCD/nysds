import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-breadcrumbs.scss?inline";

let componentIdCounter = 0;

/**
 * A breadcrumb navigation trail composed of `nys-breadcrumbitem` elements.
 * Collapses when the trail exceeds 5 items on desktop or 3 items on mobile,
 * showing the first, last, and item before the current page, with an ellipsis to expand.
 * A single item renders as a back-to-parent link instead of a trail.
 *
 * @summary Breadcrumb navigation trail with responsive collapse support.
 * @element nys-breadcrumbs
 *
 * @slot - One or more `nys-breadcrumbitem` elements defining the trail.
 *
 * @fires nys-breadcrumbs-expand - Fired when the user clicks the ellipsis to expand the trail.
 *
 * @example Full trail with current page
 * ```html
 * <nys-breadcrumbs>
 *  <ol>
 *   <li><a href="/">Home</a></li>
 *   <li><a href="/services">Services</a></li>
 *   <li>Current Page</li>
 *  </ol>
 * </nys-breadcrumbs>
 * ```
 *
 * @example Trail without current page
 * ```html
 * <nys-breadcrumbs>
 *  <ol>
 *   <li><a href="/">Home</a></li>
 *   <li><a href="/services">Services</a></li>
 *  </ol>
 * </nys-breadcrumbs>
 * ```
 *
 * @example Single item renders as back-to-parent
 * ```html
 * <nys-breadcrumbs>
 *  <ol>
 *   <li><a href="/services">Services</a></li>
 *  </ol>
 * </nys-breadcrumbs>
 * ```
 */

export class NysBreadcrumbs extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String }) ariaLabel = "";
  @property({ type: String, reflect: true }) size: "sm" | "md" | "" = "md";
  // @property({ type: String }) itemsBeforeCollapse = "1";
  // @property({ type: String }) itemsAfterCollapse = "2";
  /** Property overrides default maxItem of 5 breadcrumbs for desktop only **/
  // @property({ type: String }) maxItems = "5";
  @property({ type: Boolean }) backToParent = false;
  @property({ type: Boolean }) collapsed = false;
  @property({ type: Boolean }) backgroundBar = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _collapseThreshold = 5; // default for desktop
  private _manuallyExpanded = false;

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
      this.id = `nys-breadcrumbs-${Date.now()}-${componentIdCounter++}`;
    }

    window.addEventListener("resize", this._updateCollapseThreshold);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this._updateCollapseThreshold);
  }

  firstUpdated() {
    this._updateCollapseThreshold();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (
      changedProperties.has("collapsed") ||
      changedProperties.has("backToParent") ||
      changedProperties.has("disabled") ||
      changedProperties.has("itemsBeforeCollapse") ||
      changedProperties.has("itemsAfterCollapse")
    ) {
      this._handleSlotChange();
    }

    // if (changedProperties.has("maxItems")) {
    //   this._updateCollapseThreshold();
    // }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _updateCollapseThreshold = () => {
    const isMobile = window.innerWidth < 768; // NYSDS sets anything below 768px as mobile. Desktop and Tablet is above 768px.
    // const newThreshold = isMobile ? 3 : Number(this.maxItems) || 5;
    const newThreshold = isMobile ? 3 : 5;

    if (newThreshold !== this._collapseThreshold) {
      this._collapseThreshold = newThreshold;
      this._manuallyExpanded = false;

      this._handleSlotChange();
    }
  };

  private _getSlottedOl(): HTMLOListElement | null {
    const slot = this.shadowRoot?.querySelector(
      "slot",
    ) as HTMLSlotElement | null;
    const assigned = slot?.assignedElements({ flatten: true }) ?? [];
    return (
      (assigned.find((el) => el.tagName === "OL") as HTMLOListElement) ?? null
    );
  }

  private _getSlottedItems(): HTMLLIElement[] {
    const ol = this._getSlottedOl();
    if (!ol) return [];
    return Array.from(ol.children).filter(
      (el) => el.tagName === "LI",
    ) as HTMLLIElement[];
  }

  private _getAnchor(li: HTMLLIElement): HTMLAnchorElement | null {
    return li.querySelector("a");
  }

  private _isCurrentPage(li: HTMLLIElement): boolean {
    const a = this._getAnchor(li);
    if (!a) return true;
    return false;
  }

  private _createBackToParentElement(li: HTMLLIElement) {
    const anchor = this._getAnchor(li);
    const link = anchor?.getAttribute("href") ?? "";
    const label = anchor?.textContent?.trim() ?? li.textContent?.trim();

    const liEL = document.createElement("li");
    liEL.className = "nys-breadcrumbitem";

    const icon = document.createElement("nys-icon");
    icon.setAttribute("name", "arrow_back");
    icon.setAttribute("size", "16");

    const a = document.createElement("a");
    if (!this.disabled) {
      a.href = link;
    }
    a.textContent = label;
    if (this.disabled) {
      a.setAttribute("aria-disabled", "true");
    }

    liEL.appendChild(icon);
    liEL.appendChild(a);

    return liEL;
  }

  private _createCrumbElement(li: HTMLLIElement, isCurrentPage: boolean) {
    const anchor = this._getAnchor(li);
    const link = anchor?.getAttribute("href") ?? "";
    const label = anchor?.textContent?.trim() ?? li.textContent?.trim() ?? "";

    const liEl = document.createElement("li");
    liEl.className = "nys-breadcrumbitem";

    if (isCurrentPage) {
      liEl.textContent = label;
      return liEl;
    }

    const a = document.createElement("a");
    if (!this.disabled) {
      a.href = link;
    }
    a.textContent = label;
    if (this.disabled) {
      a.setAttribute("aria-disabled", "true");
    }

    const icon = document.createElement("nys-icon");
    icon.setAttribute("name", "chevron_right");
    icon.setAttribute("size", "14");

    liEl.appendChild(a);
    liEl.appendChild(icon);
    return liEl;
  }

  /**
   * Main logic for cloning and handling user slots.
   * New <ol>, <li>, and <a> tags are created and rendered out as crumbs for the breadcrumbs trail.
   */
  private _handleSlotChange() {
    const isMobile = window.innerWidth < 768;
    const ol = this.shadowRoot?.getElementById("crumb-list");
    if (!ol) return;

    const items = this._getSlottedItems();
    if (items.length === 0) return;

    ol.innerHTML = "";

    // ---------------------------------------------------------

    const setCrumbAsBackToParentBtn = (index = 0) => {
      const clone = items[index].cloneNode(true) as HTMLLIElement;

      const backToParentBtn = this._createBackToParentElement(clone);
      ol.appendChild(backToParentBtn);
    };

    // Single breadcrumb item OR backToParent=true for mobile - render as backToParent button
    if (items.length === 1) {
      setCrumbAsBackToParentBtn();
      return;
    }

    if (isMobile && this.backToParent) {
      const currentPageExist = this._isCurrentPage(items[items.length - 1]);

      if (currentPageExist) {
        setCrumbAsBackToParentBtn(items.length - 2);
      } else {
        setCrumbAsBackToParentBtn(items.length - 1);
      }
      return;
    }

    // ---------------------------------------------------------
    const shouldAutoCollapse =
      !this._manuallyExpanded && items.length > this._collapseThreshold;
    const collapseTrail = this.collapsed || shouldAutoCollapse;

    // const itemsBeforeCollapse = Math.min(
    //   Number(this.itemsBeforeCollapse) || 1,
    //   items.length - 1,
    // );
    // const itemsAfterCollapse = Math.min(
    //   Number(this.itemsAfterCollapse) || hasCurrentPage ? 2 : 1,
    //   items.length - itemsBeforeCollapse,
    // );

    const lastItem = items[items.length - 1];
    const hasCurrentPage = this._isCurrentPage(lastItem);
    const itemsBeforeCollapse = Math.min(1, items.length - 1);
    const itemsAfterCollapse = Math.min(
      hasCurrentPage ? 2 : 1,
      items.length - itemsBeforeCollapse,
    );

    // Normal multi-item breadcrumb trail
    items.forEach((crumb, index) => {
      const crumbIsBeforeCollapse = index < itemsBeforeCollapse;
      const crumbIsAfterCollapse = index >= items.length - itemsAfterCollapse;
      const isAlwaysVisible = crumbIsBeforeCollapse || crumbIsAfterCollapse;
      const shouldHide = collapseTrail && !isAlwaysVisible; // Determines which of the crumbs is hidden

      const liEl = this._createCrumbElement(crumb, this._isCurrentPage(crumb));
      liEl.setAttribute("data-cloned", "true");

      if (shouldHide) {
        liEl.classList.add("hide");
      }

      if (!isAlwaysVisible) {
        // Assigning which crumb is an intermediate item (aka hidable) allows us to later redirect focus on the first of these intermediates.
        liEl.classList.add("intermediate");
      }

      ol.appendChild(liEl);

      // Insert ellipsis before the first hidden cloned item when collapsed
      if (
        index === itemsBeforeCollapse - 1 &&
        collapseTrail &&
        items.length > 2
      ) {
        const ellipsis = document.createElement("li");
        ellipsis.classList.add("nys-breadcrumbs__ellipsis");

        // Ellipse button
        const button = document.createElement("button");
        button.classList.add("ellipsis-btn");
        button.setAttribute("aria-label", "Show more links");
        button.textContent = "…";
        button.addEventListener("click", () => {
          this._manuallyExpanded = true;
          this.collapsed = false;
          this._handleSlotChange();
          this._dispatchExpandEvent();
          this._moveFocusToFirstExpandCrumb();
        });

        // Chevron Icon
        const icon = document.createElement("nys-icon");
        icon.setAttribute("name", "chevron_right");
        icon.setAttribute("size", "14");

        ellipsis.appendChild(button);
        ellipsis.appendChild(icon);
        ol.appendChild(ellipsis);
      }
    });
  }

  private _moveFocusToFirstExpandCrumb() {
    setTimeout(() => {
      const crumbNavigation = this.shadowRoot?.getElementById("crumb-list");
      const ol = crumbNavigation?.querySelector("ol");
      const firstClone = ol?.querySelector("li[data-cloned].intermediate");
      firstClone?.shadowRoot?.querySelector<HTMLAnchorElement>("a")?.focus();
    }, 0);
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  private _dispatchExpandEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-breadcrumbs-expand", {
        detail: { id: this.id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`<nav
      class="nys-breadcrumbs ${this.backgroundBar
        ? "nys-breadcrumbs--background-bar"
        : ""}"
      aria-label=${this.ariaLabel || "path to this page"}
    >
      <ol id="crumb-list"></ol>
      <slot style="display: none;" @slotchange=${this._handleSlotChange}></slot>
    </nav>`;
  }
}

if (!customElements.get("nys-breadcrumbs")) {
  customElements.define("nys-breadcrumbs", NysBreadcrumbs);
}

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import "./nys-breadcrumbitem";
import { NysBreadcrumbItem } from "./nys-breadcrumbitem";
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
 *   <nys-breadcrumbitem href="/" label="Home"></nys-breadcrumbitem>
 *   <nys-breadcrumbitem href="/services" label="Services"></nys-breadcrumbitem>
 *   <nys-breadcrumbitem label="Current Page"></nys-breadcrumbitem>
 * </nys-breadcrumbs>
 * ```
 *
 * @example Trail without current page
 * ```html
 * <nys-breadcrumbs>
 *   <nys-breadcrumbitem href="/" label="Home"></nys-breadcrumbitem>
 *   <nys-breadcrumbitem href="/services" label="Services"></nys-breadcrumbitem>
 * </nys-breadcrumbs>
 * ```
 *
 * @example Single item renders as back-to-parent
 * ```html
 * <nys-breadcrumbs>
 *   <nys-breadcrumbitem href="/services" label="Services"></nys-breadcrumbitem>
 * </nys-breadcrumbs>
 * ```
 */

export class NysBreadcrumbs extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String }) ariaLabel = "";
  @property({ type: String, reflect: true }) size: "sm" | "md" | "" = "md";
  @property({ type: String }) itemsBeforeCollapse = "1";
  @property({ type: String }) itemsAfterCollapse = "2";
  /** Property overrides default maxItem of 5 breadcrumbs for desktop only **/
  @property({ type: String }) maxItems = "5";
  @property({ type: Boolean }) backToParentMobile = false;
  @property({ type: Boolean }) collapsed = false;
  @property({ type: Boolean }) backgroundBar = false;

  // private _resizeObserver: ResizeObserver | null = null;
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
      changedProperties.has("backToParentMobile") ||
      changedProperties.has("itemsBeforeCollapse") ||
      changedProperties.has("itemsAfterCollapse")
    ) {
      this._handleSlotChange();
    }

    if (changedProperties.has("maxItems")) {
      this._updateCollapseThreshold();
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _updateCollapseThreshold = () => {
    const isMobile = window.innerWidth < 768; // NYSDS sets anything below 768px as mobile. Desktop and Tablet is above 768px.
    const newThreshold = isMobile ? 3 : Number(this.maxItems) || 5;

    if (newThreshold !== this._collapseThreshold) {
      this._collapseThreshold = newThreshold;
      this._manuallyExpanded = false;

      this._handleSlotChange();
    }
  };

  private _handleSlotChange() {
    const isMobile = window.innerWidth < 768;
    const slot = this.shadowRoot?.querySelector(
      "slot",
    ) as HTMLSlotElement | null;
    const ol = this.shadowRoot?.getElementById("crumb-list");

    if (!slot || !ol) return;

    // --- Remove previous cloned child to avoid duplicates ---
    const removeClone = () => {
      Array.from(ol.children).forEach((child) => {
        if ((child as HTMLElement).hasAttribute("data-cloned")) {
          child.remove();
        }
      });

      ol.querySelector(".ellipsis-item")?.remove();
    };

    removeClone();

    // ---------------------------------------------------------

    const assignedElements = slot
      .assignedElements({ flatten: true })
      .filter(
        (el) => el.tagName.toLowerCase() === "nys-breadcrumbitem",
      ) as NysBreadcrumbItem[];

    if (assignedElements.length === 0) return;

    const setCrumbAsBackToParentBtn = (index = 0) => {
      const clone = assignedElements[index].cloneNode(
        true,
      ) as NysBreadcrumbItem;
      clone.setAttribute("data-cloned", "true");

      clone.isBackToParent = true;
      ol.appendChild(clone);
    };

    // Single breadcrumb item OR backToParentMobile=true for mobile - render as backToParent button
    if (assignedElements.length === 1) {
      setCrumbAsBackToParentBtn();
      return;
    }

    if (isMobile && this.backToParentMobile) {
      const currentPageExist =
        assignedElements[assignedElements.length - 1].link.trim().length === 0;
      if (currentPageExist) {
        setCrumbAsBackToParentBtn(assignedElements.length - 2);
      } else {
        setCrumbAsBackToParentBtn(assignedElements.length - 1);
      }
      return;
    }

    // ---------------------------------------------------------
    const shouldAutoCollapse =
      !this._manuallyExpanded &&
      assignedElements.length > this._collapseThreshold;
    const collapseTrail = this.collapsed || shouldAutoCollapse;

    const itemsBeforeCollapse = Math.min(
      Number(this.itemsBeforeCollapse) || 1,
      assignedElements.length - 1,
    );
    const itemsAfterCollapse = Math.min(
      Number(this.itemsAfterCollapse) || 2,
      assignedElements.length - itemsBeforeCollapse,
    );

    // Normal multi-item breadcrumb trail
    assignedElements.forEach((crumb, index) => {
      const crumbIsBeforeCollapse = index < itemsBeforeCollapse;
      const crumbIsAfterCollapse =
        index >= assignedElements.length - itemsAfterCollapse;

      const isAlwaysVisible = crumbIsBeforeCollapse || crumbIsAfterCollapse;

      const shouldHide = collapseTrail && !isAlwaysVisible; // Determines which of the crumbs is hidden

      const clone = crumb.cloneNode(true) as NysBreadcrumbItem;
      clone.setAttribute("data-cloned", "true");

      if (shouldHide) {
        clone.classList.add("hide");
      }

      if (!isAlwaysVisible) {
        // Assigning which crumb is an intermediate item (aka hidable) allows us to later redirect focus on the first of these intermediates.
        clone.classList.add("intermediate");
      }

      ol.appendChild(clone);

      // Insert ellipsis before the first hidden cloned item when collapsed
      if (
        index === itemsBeforeCollapse - 1 &&
        collapseTrail &&
        assignedElements.length > 2
      ) {
        const ellipsis = document.createElement("li");
        ellipsis.classList.add("ellipsis-item");

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
      const ol = this.shadowRoot?.getElementById("crumb-list");
      const firstClone = ol?.querySelector<NysBreadcrumbItem>(
        "nys-breadcrumbitem[data-cloned].intermediate",
      );
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
      <ol id="crumb-list">
        <slot
          style="display: none;"
          @slotchange=${this._handleSlotChange}
        ></slot>
      </ol>
    </nav>`;
  }
}

if (!customElements.get("nys-breadcrumbs")) {
  customElements.define("nys-breadcrumbs", NysBreadcrumbs);
}

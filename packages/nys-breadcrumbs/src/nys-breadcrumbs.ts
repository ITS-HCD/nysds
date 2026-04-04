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
  @property({ type: Boolean }) collapsed = false;
  @property({ type: String }) itemsBeforeCollapse = "";
  @property({ type: String }) itemsAfterCollapse = "";
  @property({ type: String }) maxItems = "";

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
    if (changedProperties.has("collapsed")) {
      this._handleSlotChange();
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _updateCollapseThreshold = () => {
    const isMobile = window.innerWidth < 768; // NYSDS sets anything below 768px as mobile. Desktop and Tablet is above 768px.
    const newThreshold = isMobile ? 3 : 5;

    if (newThreshold !== this._collapseThreshold) {
      this._collapseThreshold = newThreshold;
      this._manuallyExpanded = false;
      this._handleSlotChange();
    }
  };

  private _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector(
      "slot",
    ) as HTMLSlotElement | null;
    const ol = this.shadowRoot?.getElementById("crumb-list");

    if (!slot || !ol) return;

    // --- Remove previous cloned child to avoid duplicates ---
    Array.from(ol.children).forEach((child) => {
      if ((child as HTMLElement).hasAttribute("data-cloned")) {
        child.remove();
      }
    });

    ol.querySelector(".ellipsis-item")?.remove();
    // ---------------------------------------------------------

    const assignedElements = slot
      .assignedElements({ flatten: true })
      .filter(
        (el) => el.tagName.toLowerCase() === "nys-breadcrumbitem",
      ) as NysBreadcrumbItem[];

    // Single breadcrumb item - render as backToParent button
    if (assignedElements.length === 1) {
      const clone = assignedElements[0].cloneNode(true) as NysBreadcrumbItem;
      clone.setAttribute("data-cloned", "true");

      clone.isBackToParent = true;
      ol.appendChild(clone);
      return;
    }

    // ---------------------------------------------------------
    // Current page is always the last item when present (no link).
    // currentIndex is -1 if the user omitted the current page from the trail.
    const currentIndex = assignedElements.findIndex(
      (crumb) => crumb.link.trim().length === 0,
    );

    const shouldAutoCollapse =
      !this._manuallyExpanded &&
      assignedElements.length > this._collapseThreshold;
    const collapseTrail = this.collapsed || shouldAutoCollapse;

    // Normal multi-item breadcrumb trail
    assignedElements.forEach((crumb, index) => {
      const isFirst = index === 0;
      const isLast = index === assignedElements.length - 1;

      const isBeforeCurrent = index === currentIndex - 1;
      const isAlwaysVisible = isFirst || isLast || isBeforeCurrent;

      const shouldHide = collapseTrail && !isAlwaysVisible; // Determines which of the crumbs is hidden

      const clone = crumb.cloneNode(true) as NysBreadcrumbItem;
      clone.setAttribute("data-cloned", "true");

      if (isLast) {
        clone.isLast = true;
      }

      if (shouldHide) {
        clone.classList.add("hide");
      }

      ol.appendChild(clone);

      // Insert ellipsis after first cloned item when collapsed
      if (isFirst && collapseTrail && assignedElements.length > 2) {
        const ellipsis = document.createElement("li");
        ellipsis.classList.add("ellipsis-item");

        // Ellipse button
        const button = document.createElement("button");
        button.classList.add("ellipsis-btn");
        button.setAttribute("aria-label", "Show all breadcrumbs");
        button.textContent = "…";
        button.addEventListener("click", () => {
          this._manuallyExpanded = true;
          this.collapsed = false;
          this._handleSlotChange();
          this._dispatchExpandEvent();
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
    return html`<nav class="nys-breadcrumbs" aria-label="A set of breadcrumbs">
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

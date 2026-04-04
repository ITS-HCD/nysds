import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import "./nys-breadcrumbitem";
import { NysBreadcrumbItem } from "./nys-breadcrumbitem";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-breadcrumbs.scss?inline";

let componentIdCounter = 0;

/**
 * `<nys-breadcrumbs>` is ...
 */

export class NysBreadcrumbs extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: Boolean }) collapsed = false;
  @property({ type: String }) itemsBeforeCollapse = "";
  @property({ type: String }) itemsAfterCollapse = "";
  @property({ type: String }) maxItems = "";

  private _resizeObserver: ResizeObserver | null = null;
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

    this._resizeObserver = new ResizeObserver(() => {
      this._updateCollapseThreshold();
    });
    this._resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
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

  private _updateCollapseThreshold() {
    const isMobile = this.offsetWidth < 768;
    const newThreshold = isMobile ? 3 : 5;

    if (newThreshold !== this._collapseThreshold) {
      this._collapseThreshold = newThreshold;
      this._manuallyExpanded = false;
      this._handleSlotChange();
    }
  }

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

  // private _applyCollapseState() {
  //   const breadCrumbItems =
  //     this.querySelectorAll<NysBreadcrumbItem>("nys-breadcrumbitem");

  //   breadCrumbItems.forEach((crumb, index) => {
  //     const isCurrent = crumb.link.trim().length == 0;
  //     if (
  //       this.collapsed &&
  //       index !== 0 &&
  //       index !== breadCrumbItems.length - 1 &&
  //       !isCurrent
  //     ) {
  //       crumb.classList.add("hide");
  //     } else {
  //       crumb.classList.remove("hide");
  //     }
  //   });

  //   this._addEllipsisButton();
  // }

  // private _addEllipsisButton() {
  //   this.querySelector(".ellipsis-item")?.remove();

  //   const breadCrumbItems =
  //     this.querySelectorAll<NysBreadcrumbItem>("nys-breadcrumbitem");

  //   if (this.collapsed && breadCrumbItems.length > 2) {
  //     const ellipsis = document.createElement("li");
  //     ellipsis.classList.add("ellipsis-item");

  //     ellipsis.innerHTML = `<button class="ellipsis-btn" aria-label="Show all breadcrumbs">…</button>`;
  //     ellipsis.querySelector("button")!.addEventListener("click", () => {
  //       this.collapsed = false;
  //     });
  //     breadCrumbItems[0].insertAdjacentElement("afterend", ellipsis);
  //   }
  // }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

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

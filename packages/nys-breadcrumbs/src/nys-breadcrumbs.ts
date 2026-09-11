import { html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
// This element is created imperatively (document.createElement) for the
// back-to-parent arrow, the trailing chevrons, and the collapsed-trail
// ellipsis, so it must be registered whenever nys-breadcrumbs is used.
// Importing it here (intentional side effect) guarantees it always renders.
import "@nysds/nys-icon";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-breadcrumbs.scss?inline";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-breadcrumbs.light.scss?inline";

let _lightSheet: CSSStyleSheet | null = null;
// Injects the lightDOM styling for the scss into the adopted/constructed stylesheet.
function adoptLightStyles() {
  if (_lightSheet || typeof document === "undefined") return;
  _lightSheet = new CSSStyleSheet();
  _lightSheet.replaceSync(lightStyles);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, _lightSheet];
}

const INJECTED_ATTR = "data-nys-injected";

/**
 * A breadcrumb navigation trail composed of `li` elements.
 * Collapses when the trail exceeds 5 items on desktop or 3 items on mobile,
 * showing the first, last, and item before the current page, with an ellipsis to expand.
 * A single item renders as a back-to-parent link instead of a trail.
 *
 * @summary Breadcrumb navigation trail with responsive collapse support.
 * @element nys-breadcrumbs
 *
 * @slot - One or more `li` elements defining the trail.
 *
 * @fires nys-breadcrumbs-expand - Fired when the user clicks the ellipsis to expand the trail.
 *
 * @example Basic
 * ```html
 * <nys-breadcrumbs>
 *  <ol>
 *   <li><a href="/">Home</a></li>
 *   <li><a href="/services">Services</a></li>
 *  </ol>
 * </nys-breadcrumbs>
 * ```
 *
 * @example Current page
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
 * @example Single item list
 * ```html
 * <nys-breadcrumbs>
 *  <ol>
 *   <li><a href="/services">Services</a></li>
 *  </ol>
 * </nys-breadcrumbs>
 * ```
 *
 * @example Long list
 * ```html
 * <nys-breadcrumbs>
 *   <ol>
 *     <li><a href="/">Home</a></li>
 *     <li><a href="/government">Government</a></li>
 *     <li><a href="/government/agencies">Agencies</a></li>
 *     <li><a href="/government/agencies/parks">Parks & Recreation</a></li>
 *     <li><a href="/parks/state-parks">State Parks</a></li>
 *     <li><a href="/parks/state-parks/delaware">Delaware Region</a></li>
 *     <li><a href="/parks/state-parks/delaware/water-gap">Delaware Water Gap</a></li>
 *     <li>Trail Conditions</li>
 *   </ol>
 * </nys-breadcrumbs>
 * ```
 *
 * @example Size small
 * ```html
 * <nys-breadcrumbs size="sm">
 *  <ol>
 *   <li><a href="/">Home</a></li>
 *   <li><a href="/government">Government</a></li>
 *   <li><a href="/government/agencies">Agencies</a></li>
 *   <li>Parks & Recreation</li>
 *  </ol>
 * </nys-breadcrumbs>
 * ```
 *
 * @example Back to parent (mobile)
 * ```html
 * <nys-breadcrumbs backToParent>
 *  <ol>
 *   <li><a href="/">Home</a></li>
 *   <li><a href="/government">Government</a></li>
 *   <li><a href="/government/agencies">Agencies</a></li>
 *   <li><a href="/government/agencies/parks">Parks & Recreation</a></li>
 *   <li><a href="/parks/state-parks">State Parks</a></li>
 *   <li><a href="/parks/state-parks/delaware">Delaware Region</a></li>
 *   <li><a href="/parks/state-parks/delaware/water-gap">Delaware Water Gap</a></li>
 *   <li>Trail Conditions</li>
 *  </ol>
 * </nys-breadcrumbs>
 * ```
 *
 * @example Background bar
 * ```html
 * <nys-breadcrumbs backgroundBar>
 *  <ol>
 *   <li><a href="/">Home</a></li>
 *   <li><a href="/services">Services</a></li>
 *   <li><a href="/tickets">Ticket System</a></li>
 *   <li>Del Water Gap</li>
 *  </ol>
 * </nys-breadcrumbs>
 * ```
 *
 * @example Disabled
 * ```html
 * <nys-breadcrumbs disabled>
 *  <ol>
 *   <li><a href="/">Home</a></li>
 *   <li><a href="/services">Services</a></li>
 *   <li><a href="/tickets">Ticket System</a></li>
 *   <li>Del Water Gap</li>
 *  </ol>
 * </nys-breadcrumbs>
 * ```
 */

export class NysBreadcrumbs extends NysElement {
  static styles = unsafeCSS(styles);

  /**
   * Unique identifier. Auto-generated if not provided.
   */
  @property({ type: String, reflect: true }) id = "";

  /**
   * Accessible label for the `<nav>` landmark. Defaults to "Breadcrumb" if not set.
   * Override when multiple crumbs exist on the same page.
   */
  @property({ type: String }) ariaLabel = "";

  /**
   * Controls the visual size of the breadcrumb text and spacing: `sm` for dense layouts, `md` (default) for standard use.
   * @default "md"
   */
  @property({ type: String, reflect: true }) size: "sm" | "md" = "md";

  /**
   * On mobile, renders the trail as a single back-to-parent link pointing to the item before the current page.
   * Has no effect on desktop or when only one item is present (which always renders as a back link).
   * @default false
   */
  @property({ type: Boolean }) backToParent = false;

  /**
   * Forces the trail into its collapsed state.
   * It shows only the first item, an ellipsis, and the last two items.
   * The user can still expand the trail by clicking the ellipsis.
   * @default false
   */
  @property({ type: Boolean }) collapsed = false;

  /**
   * Renders a filled light theme background bar behind the breadcrumb trail.
   * @default false
   */
  @property({ type: Boolean }) backgroundBar = false;

  /**
   * Prevents interaction.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _collapseThreshold = 5; // default for desktop
  private _manuallyExpanded = false;
  private _mediaQuery: MediaQueryList | null = null;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  constructor() {
    super();
  }

  connectedCallback() {
    // super.connectedCallback() (NysElement) auto-assigns an id when
    // one is not provided (prefix = localName, shape "nys-breadcrumbs-<ts>-<n>").
    // The breadcrumb's navigation role lives on the inner <nav> landmark (with an
    // accessible name), so defaultRole stays null and no host role is reflected.
    super.connectedCallback();

    adoptLightStyles();

    this._mediaQuery = window.matchMedia("(max-width: 767px)");
    this._mediaQuery.addEventListener("change", this._updateCollapseThreshold);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._mediaQuery?.removeEventListener(
      "change",
      this._updateCollapseThreshold,
    );
    this._mediaQuery = null;
  }

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    slot?.addEventListener("slotchange", () => this._handleSlotChange());
    slot?.addEventListener("click", this._boundDisabledClickGuard);
    this._handleSlotChange();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (
      changedProperties.has("collapsed") ||
      changedProperties.has("backToParent") ||
      changedProperties.has("disabled")
    ) {
      this._handleSlotChange();
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _updateCollapseThreshold = () => {
    const isMobile = this._mediaQuery?.matches ?? window.innerWidth < 768; // NYSDS sets anything below 768px as mobile. Desktop and Tablet is above 768px.
    const newThreshold = isMobile ? 3 : 5;

    if (newThreshold !== this._collapseThreshold) {
      this._collapseThreshold = newThreshold;
      this._manuallyExpanded = false;
      this._handleSlotChange();
    }
  };

  private _boundDisabledClickGuard = (e: Event) => {
    const a = (e.target as HTMLElement)?.closest?.("a");
    if (a?.getAttribute("aria-disabled") === "true") {
      e.preventDefault();
    }
  };

  private _getSlottedOl(): HTMLOListElement | null {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    const assigned = slot?.assignedElements({ flatten: true }) ?? [];
    return (
      (assigned.find((el) => el.tagName === "OL") as HTMLOListElement) ?? null
    );
  }

  private _getSlottedItems(ol: HTMLOListElement): HTMLLIElement[] {
    // const ol = this._getSlottedOl();
    // if (!ol) return [];
    // return Array.from(ol.children).filter(
    //   (el) => el.tagName === "LI",
    // ) as HTMLLIElement[];
    return Array.from(ol.children).filter(
      (el) => el.tagName === "LI" && !el.hasAttribute(INJECTED_ATTR),
    ) as HTMLLIElement[];
  }

  private _getAnchor(li: HTMLLIElement): HTMLAnchorElement | null {
    return li.querySelector("a");
  }

  private _isCurrentPage(li: HTMLLIElement): boolean {
    return !this._getAnchor(li);
  }

  private _createIcon(name: string, size: string): HTMLElement {
    const icon = document.createElement("nys-icon");
    icon.setAttribute("name", name);
    icon.setAttribute("size", size);
    icon.setAttribute(INJECTED_ATTR, "true");
    return icon;
  }

  private _resetItem(li: HTMLLIElement) {
    li.className = "";
    li.removeAttribute("aria-current");

    li.querySelectorAll(`[${INJECTED_ATTR}]`).forEach((el) => el.remove());

    const a = this._getAnchor(li);
    if (a) {
      a.removeAttribute("aria-disabled");
      a.removeAttribute("tabindex");
    }
  }

  private _applyDisabledState(a: HTMLAnchorElement) {
    if (!this.disabled) return;
    a.setAttribute("aria-disabled", "true");
    a.setAttribute("tabindex", "-1");
  }

  private _applyBackToParentStyle(li: HTMLLIElement) {
    li.classList.add("nys-breadcrumbitem", "back-to-parent");
    const a = this._getAnchor(li);
    if (a) {
      this._applyDisabledState(a);
      a.insertAdjacentElement(
        "beforebegin",
        this._createIcon("arrow_back", "16"),
      );
    }
  }

  private _applyCrumbStyle(li: HTMLLIElement, isCurrentPage: boolean) {
    li.classList.add("nys-breadcrumbitem");

    if (isCurrentPage) {
      // WCAG 4.1.2 / WAI-ARIA breadcrumb pattern: the current page must be
      // programmatically identified so assistive tech announces "current page".
      li.setAttribute("aria-current", "page");
      return;
    }

    const a = this._getAnchor(li);
    if (a) {
      this._applyDisabledState(a);
      a.insertAdjacentElement(
        "afterend",
        this._createIcon("chevron_right", "14"),
      );
    }
  }

  private _insertEllipsis(referenceLi: HTMLLIElement) {
    const ellipsis = document.createElement("li");
    ellipsis.classList.add("nys-breadcrumbs__ellipsis");
    ellipsis.setAttribute(INJECTED_ATTR, "true");

    const button = document.createElement("a");
    button.classList.add("ellipsis-btn");
    button.setAttribute("aria-label", "Show more links");
    button.setAttribute("role", "button");
    button.setAttribute("href", "#");
    button.textContent = "…";

    const expandTrail = (e: Event) => {
      e.preventDefault();
      this._manuallyExpanded = true;
      this.collapsed = false;
      this._handleSlotChange();
      this._dispatchExpandEvent();
      this._moveFocusToFirstExpandCrumb();
    };

    button.addEventListener("click", expandTrail);
    button.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === " ") expandTrail(e);
    });

    ellipsis.appendChild(button);
    ellipsis.appendChild(this._createIcon("chevron_right", "14"));

    referenceLi.insertAdjacentElement("afterend", ellipsis);
  }

  /**
   * Main logic for cloning and handling user slots.
   * New <ol>, <li>, and <a> tags are created and rendered out as crumbs for the breadcrumbs trail.
   */
  private _handleSlotChange() {
    const isMobile = this._mediaQuery?.matches ?? window.innerWidth < 768;
    const ol = this._getSlottedOl();
    if (!ol) return;

    // Reset to remove injected elements
    ol.querySelectorAll(`li[${INJECTED_ATTR}]`).forEach((el) => el.remove());

    const items = this._getSlottedItems(ol);
    if (items.length === 0) return;

    items.forEach((li) => this._resetItem(li));

    // ---------------------------------------------------------

    // Single breadcrumb item - always render as backToParent style
    if (items.length === 1) {
      this._applyBackToParentStyle(items[0]);
      return;
    }

    // The backToParent=true for mobile - render as backToParent button
    if (isMobile && this.backToParent) {
      const currentPageExists = this._isCurrentPage(items[items.length - 1]);
      const targetIndex = currentPageExists
        ? items.length - 2
        : items.length - 1;

      items.forEach((li, index) => {
        if (index === targetIndex) {
          this._applyBackToParentStyle(li);
        } else {
          this._applyCrumbStyle(li, this._isCurrentPage(li));
          li.classList.add("hide");
        }
      });
      return;
    }

    // ---------------------------------------------------------
    const shouldAutoCollapse =
      !this._manuallyExpanded && items.length > this._collapseThreshold;
    const collapseTrail = this.collapsed || shouldAutoCollapse;

    const lastItem = items[items.length - 1];
    const hasCurrentPage = this._isCurrentPage(lastItem);
    const itemsBeforeCollapse = Math.min(1, items.length - 1);
    const itemsAfterCollapse = Math.min(
      hasCurrentPage ? 2 : 1,
      items.length - itemsBeforeCollapse,
    );

    // Normal multi-item breadcrumb trail
    items.forEach((li, index) => {
      const isBeforeCollapse = index < itemsBeforeCollapse;
      const isAfterCollapse = index >= items.length - itemsAfterCollapse;
      const isAlwaysVisible = isBeforeCollapse || isAfterCollapse;
      const shouldHide = collapseTrail && !isAlwaysVisible; // Determines which of the crumbs is hidden

      this._applyCrumbStyle(li, this._isCurrentPage(li));

      if (shouldHide) li.classList.add("hide");
      if (!isAlwaysVisible) li.classList.add("intermediate");

      // Insert ellipsis before the first hidden cloned item when collapsed
      if (
        index === itemsBeforeCollapse - 1 &&
        collapseTrail &&
        items.length > 2
      ) {
        this._insertEllipsis(li);
      }
    });
  }

  private _moveFocusToFirstExpandCrumb() {
    setTimeout(() => {
      const ol = this._getSlottedOl();
      const firstIntermediate = ol?.querySelector("li.intermediate");
      firstIntermediate?.querySelector<HTMLAnchorElement>("a")?.focus();
    }, 0);
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  private _dispatchExpandEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-expand", {
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
      aria-label=${this.ariaLabel || "Breadcrumb"}
    >
      <slot @slotchange=${this._handleSlotChange}></slot>
    </nav>`;
  }
}

if (!customElements.get("nys-breadcrumbs")) {
  customElements.define("nys-breadcrumbs", NysBreadcrumbs);
}

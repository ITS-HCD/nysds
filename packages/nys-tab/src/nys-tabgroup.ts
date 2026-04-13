import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tab.scss?inline";

/** @internal Monotonically increasing counter used to generate unique element IDs. */
let componentIdCounter = 0;

/**
 * `<nys-tabgroup>` is the container for `<nys-tab>` and `<nys-tabpanel>`
 * elements.
 *
 * Accepts tabs and panels as flat light-DOM children in any order (interleaved
 * or grouped). On slot change, children are sorted into dedicated shadow-DOM
 * containers, ARIA relationships are wired, and the first selected (or first)
 * tab is activated.
 *
 * Scroll shadows are rendered on either side of the tab list and toggled via
 * `ResizeObserver` and a `scroll` listener so they accurately reflect whether
 * overflow content exists in each direction.
 *
 * Keyboard navigation follows the
 * {@link https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ ARIA Tabs Pattern}:
 * - Arrow keys move focus without changing selection.
 * - Enter / Space confirm selection on the focused tab.
 *
 * @element nys-tabgroup
 *
 * @slot - Accepts `<nys-tab>` and `<nys-tabpanel>` children. Elements are
 *   moved into internal shadow-DOM containers on `slotchange`; the slot
 *   itself is not rendered visibly.
 */
export class NysTabgroup extends LitElement {
  static styles = unsafeCSS(styles);

  /**
   * Unique identifier for the tabgroup element.
   * If not provided, one is auto-generated in `connectedCallback`.
   * Reflected to the DOM attribute.
   *
   * @attr id
   */
  @property({ type: String, reflect: true }) id = "";

  /**
   * Accessible label for the tab list (`aria-label` on the inner
   * `[role="tablist"]`). Should describe the purpose of the tab set
   * (e.g. `"Account settings"`).
   *
   * @attr name
   */
  @property({ type: String }) name = "";

  /**
   * Reference to the `[role="tablist"]` scroll container in the shadow DOM.
   * Cached in `firstUpdated` and used by `_updateScrollShadows` to read
   * scroll position and dimensions.
   */
  private _tabsEl!: HTMLElement;

  /**
   * Reference to the left scroll-shadow overlay element.
   * Receives the `is-visible` class when the tab list is scrolled away from
   * its leftmost position.
   */
  private _shadowLeft!: HTMLElement;

  /**
   * Reference to the right scroll-shadow overlay element.
   * Receives the `is-visible` class when overflow content exists to the right
   * of the current scroll position.
   */
  private _shadowRight!: HTMLElement;

  /**
   * `ResizeObserver` instance watching `_tabsEl` for size changes.
   * Re-evaluates scroll shadow visibility whenever the tab list is resized
   * (e.g. viewport resize, dynamic tab additions).
   * Stored so it can be disconnected if needed.
   */
  private _resizeObserver?: ResizeObserver;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Called when the element is inserted into the document.
   * Auto-generates a unique `id` if one was not provided.
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-tabgroup-${Date.now()}-${componentIdCounter++}`;
    }
  }

  /**
   * Called after the element's shadow DOM has been rendered for the first time.
   *
   * Caches references to the tab list and scroll-shadow elements, performs an
   * initial scroll-shadow evaluation, and attaches:
   * - A `scroll` event listener on `_tabsEl` to update shadows on scroll.
   * - A `ResizeObserver` on `_tabsEl` to update shadows when the container
   *   is resized.
   */
  firstUpdated() {
    const root = this.shadowRoot!;
    this._tabsEl = root.querySelector(".nys-tabgroup__tabs")!;
    this._shadowLeft = root.querySelector(".scroll-shadow--left")!;
    this._shadowRight = root.querySelector(".scroll-shadow--right")!;

    this._updateScrollShadows();

    this._tabsEl.addEventListener("scroll", this._updateScrollShadows);

    this._resizeObserver = new ResizeObserver(() =>
      this._updateScrollShadows(),
    );
    this._resizeObserver.observe(this._tabsEl);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * Reads the current scroll state of `_tabsEl` and toggles the `is-visible`
   * class on the left and right shadow overlays accordingly.
   *
   * - Left shadow is visible when `scrollLeft > 0`.
   * - Right shadow is visible when `scrollLeft + clientWidth < scrollWidth`
   *   (i.e. content exists beyond the right edge).
   *
   * Defined as an arrow function so it can be passed directly as an event
   * listener without losing `this` context.
   *
   * @returns void
   */
  private _updateScrollShadows = (): void => {
    const { scrollLeft, scrollWidth, clientWidth } = this._tabsEl;

    const canScrollLeft = scrollLeft > 0;
    const canScrollRight = scrollLeft + clientWidth < scrollWidth;

    this._shadowLeft.classList.toggle("is-visible", canScrollLeft);
    this._shadowRight.classList.toggle("is-visible", canScrollRight);
  };

  /**
   * Returns all `<nys-tab>` elements currently residing in the shadow-DOM
   * tabs container, in DOM order.
   *
   * @returns An array of `HTMLElement` references to every `<nys-tab>` child.
   */
  private _getTabs(): HTMLElement[] {
    return Array.from(
      this.shadowRoot
        ?.querySelector(".nys-tabgroup__tabs")
        ?.querySelectorAll("nys-tab") ?? [],
    ) as HTMLElement[];
  }

  /**
   * Returns all `<nys-tabpanel>` elements currently residing in the
   * shadow-DOM panels container, in DOM order.
   *
   * @returns An array of `HTMLElement` references to every `<nys-tabpanel>` child.
   */
  private _getPanels(): HTMLElement[] {
    return Array.from(
      this.shadowRoot
        ?.querySelector(".nys-tabgroup__panels")
        ?.querySelectorAll("nys-tabpanel") ?? [],
    ) as HTMLElement[];
  }

  /**
   * Single source of truth for ARIA wiring, `tabindex`, and panel visibility.
   *
   * For each index `i`:
   * - Sets `selected` / removes `selected` attribute on `tabs[i]`.
   * - Sets `aria-controls` on `tabs[i]` to the `id` of `panels[i]`.
   * - Sets `aria-labelledby` on `panels[i]` to the `id` of `tabs[i]`.
   * - Removes `hidden` from `panels[selectedIndex]`; adds it to all others.
   *
   * Must be called any time the selected tab changes (initial render and
   * subsequent user interactions).
   *
   * @param tabs - Ordered array of `<nys-tab>` elements to update.
   * @param panels - Ordered array of `<nys-tabpanel>` elements to update.
   *   Must be the same length as `tabs` for correct pairing.
   * @param selectedIndex - Zero-based index of the tab/panel pair to activate.
   * @returns void
   */
  private _applySelection(
    tabs: HTMLElement[],
    panels: HTMLElement[],
    selectedIndex: number,
  ): void {
    tabs.forEach((tab, i) => {
      const isSelected = i === selectedIndex;
      tab.setAttribute("aria-selected", isSelected ? "true" : "false");
      if (isSelected) {
        tab.setAttribute("selected", "");
      } else {
        tab.removeAttribute("selected");
      }
    });

    panels.forEach((panel, i) => {
      const isSelected = i === selectedIndex;
      const tab = tabs[i];
      // Wire aria-labelledby → matching tab id
      if (tab) {
        panel.setAttribute("aria-labelledby", tab.id);
      }
      if (isSelected) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------

  /**
   * Handles `slotchange` on the default slot.
   *
   * Iterates over all assigned elements and moves each `<nys-tab>` into
   * `.nys-tabgroup__tabs` and each `<nys-tabpanel>` into
   * `.nys-tabgroup__panels`, preserving relative order. After sorting,
   * calls `_applySelection` using the first element that already has a
   * `selected` attribute, or index `0` if none is found.
   *
   * @param e - The `Event` fired by the `<slot>` element on slot change.
   * @returns void
   */
  private _sortChildren(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedElements();

    const tabsContainer = this.shadowRoot?.querySelector(".nys-tabgroup__tabs");
    const panelsContainer = this.shadowRoot?.querySelector(
      ".nys-tabgroup__panels",
    );
    if (!tabsContainer || !panelsContainer) return;

    const tabs: HTMLElement[] = [];
    const panels: HTMLElement[] = [];

    assigned.forEach((child) => {
      const tag = child.tagName.toLowerCase();
      if (tag === "nys-tab") {
        tabsContainer.appendChild(child);
        tabs.push(child as HTMLElement);
      } else if (tag === "nys-tabpanel") {
        panelsContainer.appendChild(child);
        panels.push(child as HTMLElement);
      }
    });

    // Honor the first selected tab; ignore any others
    const declaredSelectedIndex = tabs.findIndex((t) =>
      t.hasAttribute("selected"),
    );
    const selectedIndex =
      declaredSelectedIndex !== -1 ? declaredSelectedIndex : 0;

    this._applySelection(tabs, panels, selectedIndex);
  }

  /**
   * Handles the `nys-tab-select` custom event bubbled up from a child
   * `<nys-tab>`.
   *
   * Resolves the originating `<nys-tab>` via `composedPath()` (required
   * because the event crosses shadow DOM boundaries), determines its index
   * among the current tab list, and delegates to `_applySelection`.
   *
   * @param e - The `Event` (cast to `CustomEvent`) dispatched by `<nys-tab>`.
   * @returns void
   */
  private _handleTabSelect(e: Event): void {
    const selectedTab = (e as CustomEvent)
      .composedPath()
      .find(
        (el) => (el as HTMLElement).tagName?.toLowerCase() === "nys-tab",
      ) as HTMLElement | undefined;
    if (!selectedTab) return;

    const tabs = this._getTabs();
    const panels = this._getPanels();
    const selectedIndex = tabs.indexOf(selectedTab);
    if (selectedIndex === -1) return;

    this._applySelection(tabs, panels, selectedIndex);
  }

  /**
   * Handles `keydown` events on the `[role="tablist"]` container.
   *
   * Implements the ARIA radio-button keyboard pattern:
   * - `ArrowRight` — moves focus to the next enabled tab (wraps).
   * - `ArrowLeft` — moves focus to the previous enabled tab (wraps).
   *
   * Focus is moved without changing selection; Enter / Space on the newly
   * focused tab (handled by `<nys-tab>._handleKeydown`) confirm selection.
   *
   * The currently focused tab is resolved via `composedPath()` because focus
   * may sit on a shadow-DOM descendant of `<nys-tab>` rather than the host
   * itself.
   *
   * Disabled tabs are excluded from navigation and will never receive focus
   * via arrow keys.
   *
   * @param e - The `KeyboardEvent` from the tablist `keydown` listener.
   * @returns void
   */
  private _handleKeydown(e: KeyboardEvent): void {
    const tabs = this._getTabs().filter((t) => !t.hasAttribute("disabled"));
    if (tabs.length === 0) return;

    const focusedTab = (e.composedPath() as HTMLElement[]).find(
      (el) => el.tagName?.toLowerCase() === "nys-tab",
    );
    const currentIndex = focusedTab ? tabs.indexOf(focusedTab) : -1;

    if (currentIndex === -1) return;

    const prevKey = "ArrowLeft";
    const nextKey = "ArrowRight";

    let newIndex = currentIndex;

    switch (e.key) {
      case prevKey:
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case nextKey:
        newIndex = (currentIndex + 1) % tabs.length;
        break;
      default:
        return;
    }

    e.preventDefault();

    if (newIndex === currentIndex) return;

    // Move focus only — do not change selection
    (tabs[newIndex] as HTMLElement & { focus?: () => void }).focus?.();
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  render() {
    return html`
      <div class="nys-tabgroup" @nys-tab-select=${this._handleTabSelect}>
        <div class="nys-tabgroup__tabs-container">
          <div class="nys-tabgroup__tabs-background"></div>
          <div class="scroll-shadow scroll-shadow--left"></div>
          <div
            class="nys-tabgroup__tabs"
            role="tablist"
            aria-orientation="horizontal"
            aria-label=${this.name}
            @keydown=${this._handleKeydown}
          ></div>
          <div class="scroll-shadow scroll-shadow--right"></div>
        </div>
        <div class="nys-tabgroup__panels"></div>
        <slot @slotchange=${this._sortChildren}></slot>
      </div>
    `;
  }
}

if (!customElements.get("nys-tabgroup")) {
  customElements.define("nys-tabgroup", NysTabgroup);
}

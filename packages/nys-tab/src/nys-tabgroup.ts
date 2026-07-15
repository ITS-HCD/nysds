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
 * or grouped). On slot change, each child is assigned `slot="tab"` or
 * `slot="panel"` so it is projected into the correct shadow-DOM container
 * while remaining in the light DOM, ARIA relationships are wired, and the
 * first selected (or first) tab is activated.
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
 * @slot - Accepts `<nys-tab>` and `<nys-tabpanel>` children. On `slotchange`
 *   they are assigned `slot="tab"` / `slot="panel"` and projected into the
 *   tablist and panel containers; they stay in the light DOM. Any other
 *   children remain in the default slot, rendered below the panels.
 *
 * @example Basic
 * ```html
 * <nys-tabgroup>
 *   <nys-tab label="Marcy"></nys-tab>
 *   <nys-tab label="Algonquin"></nys-tab>
 *   <nys-tab label="Haystack"></nys-tab>
 *   // rest of tabs
 *   <nys-tabpanel
 *     >Mount Marcy is the tallest peak in the Adirondacks. It has an elevation
 *     of 5344 feet with 3166 feet of elevation gain. The roundtrip hike to the
 *     top is 14.8 miles and is an out-and-back route.
 *   </nys-tabpanel>
 *   <nys-tabpanel
 *     >Algonquin Peak is the 2nd tallest peak in the Adirondacks. It has an
 *     elevation of 5114 feet with 3050 feet of elevation gain. The roundtrip
 *     hike to the top is 7.8 miles and is an out-and-back route.</nys-tabpanel
 *   >
 *   <nys-tabpanel
 *     >Mount Haystack is the 3rd tallest peak in the Adirondacks. It has an
 *     elevation of 4960 feet with 4000 feet of elevation gain. The roundtrip
 *     hike to the top is 16.4 miles and is an out-and-back
 *     route.</nys-tabpanel
 *   >
 *   // rest of tab panel content
 *  </nys-tabgroup>
 * ```
 *
 * @render Basic
 * ```html
 * <nys-tabgroup>
 *   <nys-tab label="Marcy"></nys-tab>
 *   <nys-tab label="Algonquin"></nys-tab>
 *   <nys-tab label="Haystack"></nys-tab>
 *   <nys-tab label="Skylight" id="tab4"></nys-tab>
 *   <nys-tab label="Whiteface" id="tab5"></nys-tab>
 *   <nys-tabpanel
 *     >Mount Marcy is the tallest peak in the Adirondacks. It has an elevation
 *     of 5344 feet with 3166 feet of elevation gain. The roundtrip hike to the
 *     top is 14.8 miles and is an out-and-back route.
 *   </nys-tabpanel>
 *   <nys-tabpanel
 *     >Algonquin Peak is the 2nd tallest peak in the Adirondacks. It has an
 *     elevation of 5114 feet with 3050 feet of elevation gain. The roundtrip
 *     hike to the top is 7.8 miles and is an out-and-back route.</nys-tabpanel
 *   >
 *   <nys-tabpanel
 *     >Mount Haystack is the 3rd tallest peak in the Adirondacks. It has an
 *     elevation of 4960 feet with 4000 feet of elevation gain. The roundtrip
 *     hike to the top is 16.4 miles and is an out-and-back
 *     route.</nys-tabpanel
 *   >
 *   <nys-tabpanel
 *     >Mount Skylight is the 4th tallest peak in the Adirondacks. It has an
 *     elevation of 4926 feet with 5100 feet of elevation gain. The roundtrip
 *     hike to the top is 16 miles and is an out-and-back route.</nys-tabpanel
 *    >
 *    <nys-tabpanel
 *      >Whiteface is the 5th tallest peak in the Adirondacks. It has an
 *      elevation of 4867 feet with 3050 feet of elevation gain. The roundtrip
 *      hike to the top is 7.2 miles and is an out-and-back route.</nys-tabpanel
 *    >
 *    <p style="padding: 1rem;">
 *      <strong>Note:</strong> The content in the tab panels was gathered from
 *      <a href="https://www.lakeplacid.com/do/outdoors/summerfall/hiking"
 *        >lakeplacid.com</a
 *      >
 *      and may not be completely accurate. This is meant to be a demo of how
 *      the component works, not a hiking guide.
 *    </p>
 *  </nys-tabgroup>
 * ```
 *
 * @example Explicit Ordering
 * ```html
 * <nys-tabgroup id="explicit-ordering">
 *   <nys-tab label="1st Tab" id="tab1"></nys-tab>
 *   <nys-tab label="2nd Tab" id="tab2"></nys-tab>
 *   <nys-tab label="3rd Tab" id="tab3"></nys-tab>
 *   <nys-tabpanel aria-labelledby="tab2">Content for tab 2</nys-tabpanel>
 *   <nys-tabpanel aria-labelledby="tab3">Content for tab 3</nys-tabpanel>
 *   <nys-tabpanel aria-labelledby="tab1">Content for tab 1</nys-tabpanel>
 * </nys-tabgroup>
 * ```
 *
 * @example JS in tabpanel
 * ```html
 * <nys-tabgroup>
 *   <nys-tab label="Tab 1"></nys-tab>
 *   <nys-tab label="Tab 2"></nys-tab>
 *   <nys-tabpanel>
 *     <p>Content for tab 1</p>
 *   </nys-tabpanel>
 *   <nys-tabpanel>
 *     <p>Content for tab 2</p>
 *   </nys-tabpanel>
 * </nys-tabgroup>
 * <script>
 *   const tabgroup = document.querySelector("nys-tabgroup");
 *   const panels = tabgroup.querySelectorAll("nys-tabpanel");
 *   panels[0].innerHTML += "<p>Added via JS</p>";
 * </script>
 * ```
 *
 * @example Custom Styling
 * ```html
 * <style>
 *   nys-tabpanel {
 *     --_nys-tabpanel-background-color: var(--nys-color-theme-faint);
 *     border: solid 2px var(--nys-color-theme-strong);
 *     --nys-button-background-color: var(--nys-color-success);
 *   }
 * </style>
 * <nys-tabgroup>
 *   <nys-tab label="Tab 1"></nys-tab>
 *   <nys-tab label="Tab 2"></nys-tab>
 *   <nys-tabpanel>
 *     <p>Content for tab 1</p>
 *     <nys-button>Click me</nys-button>
 *   </nys-tabpanel>
 *   <nys-tabpanel>
 *     <p>Content for tab 2</p>
 *   </nys-tabpanel>
 * </nys-tabgroup>
 * ```
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
   * The name of the tab group.
   * Used for form submission and accessibility purposes.
   *
   * @attr name
   */
  @property({ type: String }) name = "";

  /**
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
    this._tabsEl.addEventListener("wheel", this._handleWheel, {
      passive: false,
    });

    this._resizeObserver = new ResizeObserver(() =>
      this._updateScrollShadows(),
    );
    this._resizeObserver.observe(this._tabsEl);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._tabsEl?.removeEventListener("scroll", this._updateScrollShadows);
    this._tabsEl?.removeEventListener("wheel", this._handleWheel);

    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
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
   * Returns all `<nys-tab>` light-DOM children in DOM order.
   *
   * Tabs are projected into the shadow-DOM tablist via the `tab` slot but
   * remain light-DOM children of the group, so they stay reachable by consumer
   * CSS and JavaScript.
   *
   * @returns An array of `HTMLElement` references to every `<nys-tab>` child.
   */
  private _getTabs(): HTMLElement[] {
    return Array.from(this.children).filter(
      (c) => c.tagName.toLowerCase() === "nys-tab",
    ) as HTMLElement[];
  }

  /**
   * Returns the `<nys-tabpanel>` light-DOM children ordered to align with
   * `_getTabs()` — i.e. `panels[i]` is the panel paired with `tabs[i]`.
   *
   * Pairing honors explicit `aria-labelledby` references first, then falls
   * back to source order for the remaining panels. See {@link _pairPanels}.
   *
   * @returns An array of `HTMLElement` references to every `<nys-tabpanel>`,
   *   in tab-paired order.
   */
  private _getPanels(): HTMLElement[] {
    const panels = Array.from(this.children).filter(
      (c) => c.tagName.toLowerCase() === "nys-tabpanel",
    ) as HTMLElement[];
    return this._pairPanels(this._getTabs(), panels);
  }

  /**
   * Orders `panels` to align 1:1 with `tabs`.
   *
   * A panel is paired with a tab when its `aria-labelledby` matches that tab's
   * `id`; explicit references win over position. Panels without a reference
   * fill the remaining tab slots in source order. Any panels whose reference
   * does not resolve to a tab are appended at the end.
   *
   * Idempotent: after `_applySelection` writes `aria-labelledby` onto every
   * panel, re-running this yields the same order.
   *
   * @param tabs - Ordered `<nys-tab>` elements.
   * @param panels - `<nys-tabpanel>` elements in source order.
   * @returns The panels reordered to tab-paired order.
   */
  private _pairPanels(
    tabs: HTMLElement[],
    panels: HTMLElement[],
  ): HTMLElement[] {
    const panelsByRef = new Map<string, HTMLElement>();
    const panelsWithoutRef: HTMLElement[] = [];

    panels.forEach((panel) => {
      const ref = panel.getAttribute("aria-labelledby");
      if (ref) {
        panelsByRef.set(ref, panel);
      } else {
        panelsWithoutRef.push(panel);
      }
    });

    const ordered: HTMLElement[] = [];
    tabs.forEach((tab) => {
      if (tab.id && panelsByRef.has(tab.id)) {
        ordered.push(panelsByRef.get(tab.id)!);
        panelsByRef.delete(tab.id);
      } else if (panelsWithoutRef.length > 0) {
        ordered.push(panelsWithoutRef.shift()!);
      }
    });

    // Append any panels whose aria-labelledby did not resolve to a tab.
    panelsByRef.forEach((panel) => ordered.push(panel));

    return ordered;
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
      const panel = panels[i];
      tab.setAttribute("aria-selected", isSelected ? "true" : "false");
      tab.setAttribute("tabindex", isSelected ? "0" : "-1");
      if (panel?.id) {
        tab.setAttribute("aria-controls", panel.id);
      }
      if (isSelected) {
        tab.setAttribute("selected", "");
      } else {
        tab.removeAttribute("selected");
      }
    });

    panels.forEach((panel, i) => {
      const isSelected = i === selectedIndex;
      const tab = tabs[i];
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
   * Handles `slotchange` and keeps the tabs/panels wired without ever removing
   * them from the light DOM.
   *
   * Consumers author `<nys-tab>` / `<nys-tabpanel>` as flat children with no
   * `slot` attribute. This assigns `slot="tab"` / `slot="panel"` so each is
   * projected into the correct shadow-DOM container while remaining a
   * light-DOM child of the group (reachable by consumer CSS/JS). Any other
   * children (e.g. a footnote `<p>`) are left untouched in the default slot.
   *
   * Reads all current light-DOM children on every call (rather than a single
   * slot's assigned nodes), so it is robust to dynamic additions/removals and
   * idempotent: setting the `slot` attributes triggers further `slotchange`
   * events, but once the attributes are stable no more mutations occur and the
   * cascade settles.
   *
   * After (re)assignment, `_applySelection` is called honoring the first tab
   * that already has a `selected` attribute, or index `0` if none is found.
   *
   * @returns void
   */
  private _syncChildren = (): void => {
    const tabs = this._getTabs();
    const panelEls = Array.from(this.children).filter(
      (c) => c.tagName.toLowerCase() === "nys-tabpanel",
    ) as HTMLElement[];

    tabs.forEach((tab) => {
      if (tab.getAttribute("slot") !== "tab") tab.setAttribute("slot", "tab");
    });
    panelEls.forEach((panel) => {
      if (panel.getAttribute("slot") !== "panel") {
        panel.setAttribute("slot", "panel");
      }
    });

    const panels = this._pairPanels(tabs, panelEls);

    // Honor the first selected tab; ignore any others
    const declaredSelectedIndex = tabs.findIndex((t) =>
      t.hasAttribute("selected"),
    );
    const selectedIndex =
      declaredSelectedIndex !== -1 ? declaredSelectedIndex : 0;

    this._applySelection(tabs, panels, selectedIndex);
  };

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

    if (newIndex === currentIndex) return;

    // Move focus only — do not change selection
    (tabs[newIndex] as HTMLElement & { focus?: () => void }).focus?.();
  }

  /*
   * handles the horizontal scroll of the tab list when the user scrolls on the mouse wheel.
   */
  private _handleWheel = (e: WheelEvent): void => {
    if (e.deltaY === 0) return;
    e.preventDefault();
    this._tabsEl.scrollLeft += e.deltaY;
  };

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
            aria-label=${this.name}
            @keydown=${this._handleKeydown}
          >
            <slot name="tab" @slotchange=${this._syncChildren}></slot>
          </div>
          <div class="scroll-shadow scroll-shadow--right"></div>
        </div>
        <div class="nys-tabgroup__panels">
          <slot name="panel" @slotchange=${this._syncChildren}></slot>
        </div>
        <slot @slotchange=${this._syncChildren}></slot>
      </div>
    `;
  }
}

if (!customElements.get("nys-tabgroup")) {
  customElements.define("nys-tabgroup", NysTabgroup);
}

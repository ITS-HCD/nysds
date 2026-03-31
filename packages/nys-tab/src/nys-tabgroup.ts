import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tab.scss?inline";

let componentIdCounter = 0;

/**
 * `<nys-tabgroup>` is the container for `<nys-tab>` and `<nys-tabpanel>` elements.
 * Accepts tabs and panels as flat children in any order (interleaved or grouped).
 * Sorts them into __tabs and __panels divs, wires ARIA, and manages selection
 * and keyboard navigation per the ARIA Tabs Pattern.
 */
export class NysTabgroup extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String }) name = "";
  @property({ type: String, reflect: true }) orientation:
    | "horizontal"
    | "vertical" = "horizontal";

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-tabgroup-${Date.now()}-${componentIdCounter++}`;
    }
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private _getTabs(): HTMLElement[] {
    return Array.from(
      this.shadowRoot
        ?.querySelector(".nys-tabgroup__tabs")
        ?.querySelectorAll("nys-tab") ?? [],
    ) as HTMLElement[];
  }

  private _getPanels(): HTMLElement[] {
    return Array.from(
      this.shadowRoot
        ?.querySelector(".nys-tabgroup__panels")
        ?.querySelectorAll("nys-tabpanel") ?? [],
    ) as HTMLElement[];
  }

  /**
   * Single source of truth for ARIA wiring and panel visibility.
   * Call any time the selected tab changes.
   */
  private _applySelection(
    tabs: HTMLElement[],
    panels: HTMLElement[],
    selectedIndex: number,
  ) {
    tabs.forEach((tab, i) => {
      const isSelected = i === selectedIndex;
      if (isSelected) {
        tab.setAttribute("selected", "");
      } else {
        tab.removeAttribute("selected");
      }
      (tab as any).tabIndex = isSelected ? 0 : -1;
      // Wire aria-controls → matching panel id
      const panel = panels[i];
      if (panel) {
        tab.setAttribute("aria-controls", panel.id);
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

  // -------------------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------------------

  private _sortChildren(e: Event) {
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

  private _handleTabSelect(e: Event) {
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

  private _handleKeydown(e: KeyboardEvent) {
    console.log("testing keydown call: ", e.key);
    const tabs = this._getTabs().filter((t) => !t.hasAttribute("disabled"));
    if (tabs.length === 0) return;

    const focusedTab = (e.composedPath() as HTMLElement[]).find(
      (el) => el.tagName?.toLowerCase() === "nys-tab",
    );
    console.log((e.composedPath() as HTMLElement[]).map((el) => el.tagName));
    const currentIndex = focusedTab ? tabs.indexOf(focusedTab) : -1;

    console.log("focusedTab", focusedTab);
    console.log("tabs", tabs);
    console.log("currentIndex", currentIndex);
    if (currentIndex === -1) return;

    const isHorizontal = this.orientation === "horizontal";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";

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

  render() {
    return html`
      <div class="nys-tabgroup" @nys-tab-select=${this._handleTabSelect}>
        <div
          class="nys-tabgroup__tabs"
          role="tablist"
          aria-label=${this.name}
          aria-orientation=${this.orientation}
          @keydown=${this._handleKeydown}
        ></div>
        <div class="nys-tabgroup__panels"></div>
        <slot @slotchange=${this._sortChildren}></slot>
      </div>
    `;
  }
}

if (!customElements.get("nys-tabgroup")) {
  customElements.define("nys-tabgroup", NysTabgroup);
}

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tab.scss?inline";

let componentIdCounter = 0;

/**
 * `<nys-tabgroup>` is the container for `<nys-tab>` and `<nys-tabpanel>` elements.
 * It parses slotted tabs and panels, wires ARIA relationships, manages selection
 * state, and handles keyboard navigation per the ARIA Tabs Pattern.
 */
export class NysTabgroup extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String }) name = "";
  @property({ type: String, reflect: true }) orientation:
    | "horizontal"
    | "vertical" = "horizontal";

  // private _tabs: HTMLElement[] = [];
  // private _panels: HTMLElement[] = [];

  // Lifecycle Methods
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-tabgroup-${Date.now()}-${componentIdCounter++}`;
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _getTabs(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>(":scope > nys-tab"));
  }

  private _getPanels(): HTMLElement[] {
    return Array.from(
      this.querySelectorAll<HTMLElement>(":scope > nys-tabpanel"),
    );
  }

  /**
   * Pairs tabs to panels by matching tab id to panel aria-labelledby if set,
   * falling back to render order.
   */
  private _wireAria() {
    const tabs = this._getTabs();
    const panels = this._getPanels();

    tabs.forEach((tab, index) => {
      const tabId = tab.id;
      // Find a panel explicitly labelled by this tab's id, else use render order
      const panel =
        panels.find((p) => p.getAttribute("aria-labelledby") === tabId) ??
        panels[index];

      if (!panel) return;

      const panelId = panel.id;

      // Group sets aria-controls on tab and aria-labelledby on panel
      tab.setAttribute("aria-controls", panelId);
      panel.setAttribute("aria-labelledby", tabId);
    });
  }

  private _initializeSelection() {
    const tabs = this._getTabs();

    // Respect first tab marked selected; default to first tab if none
    const firstSelected =
      tabs.find((t) => t.hasAttribute("selected")) ?? tabs[0];

    tabs.forEach((tab) => {
      const isSelected = tab === firstSelected;
      if (isSelected) {
        tab.setAttribute("selected", "");
      } else {
        tab.removeAttribute("selected");
      }
    });

    this._syncPanelVisibility();
  }

  private _syncPanelVisibility() {
    const tabs = this._getTabs();
    const panels = this._getPanels();

    tabs.forEach((tab, index) => {
      const isSelected = tab.hasAttribute("selected");
      const panelId = tab.getAttribute("aria-controls");
      const panel =
        (panelId && panels.find((p) => p.id === panelId)) ?? panels[index];

      if (!panel) return;

      if (isSelected) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  }

  private _selectTab(targetTab: HTMLElement) {
    const tabs = this._getTabs();

    tabs.forEach((tab) => {
      if (tab === targetTab) {
        tab.setAttribute("selected", "");
      } else {
        tab.removeAttribute("selected");
      }
    });

    this._syncPanelVisibility();
  }

  private _focusTab(index: number) {
    const tabs = this._getTabs().filter((t) => !t.hasAttribute("disabled"));
    const target = tabs[index];
    if (target) (target as HTMLElement).focus();
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private _handleTabSelect(event: Event) {
    const tab = (event as CustomEvent).composedPath()[0] as HTMLElement;
    this._selectTab(tab.closest("nys-tab") as HTMLElement);

    this.dispatchEvent(
      new CustomEvent("nys-tab-select", {
        bubbles: true,
        composed: true,
        detail: { id: (event as CustomEvent).detail?.id },
      }),
    );
  }

  private _handleKeyDown(event: KeyboardEvent) {
    const tabs = this._getTabs().filter((t) => !t.hasAttribute("disabled"));
    const currentIndex = tabs.findIndex(
      (t) => t === document.activeElement || t.contains(document.activeElement),
    );

    const isHorizontal = this.orientation === "horizontal";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";

    if (event.key === nextKey) {
      event.preventDefault();
      this._focusTab((currentIndex + 1) % tabs.length);
    } else if (event.key === prevKey) {
      event.preventDefault();
      this._focusTab((currentIndex - 1 + tabs.length) % tabs.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      this._focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      this._focusTab(tabs.length - 1);
    }
  }

  private _handleSlotChange() {
    this._wireAria();
    this._initializeSelection();

    this.dispatchEvent(
      new CustomEvent("nys-tab-added", { bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <div
        class="nys-tabgroup"
        @nys-tab-select=${this._handleTabSelect}
        @keydown=${this._handleKeyDown}
      >
        <div
          class="nys-tabgroup__tabs"
          role="tablist"
          aria-label=${this.name}
          aria-orientation=${this.orientation}
        >
          <slot name="tabs" @slotchange=${this._handleSlotChange}></slot>
        </div>
        <div class="nys-tabgroup__panels">
          <slot name="panels"></slot>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-tabgroup")) {
  customElements.define("nys-tabgroup", NysTabgroup);
}

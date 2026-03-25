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

  private _sortChildren(e: Event) {
    console.log("Sorting children");
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedElements();

    const tabsContainer = this.shadowRoot?.querySelector(".nys-tabgroup__tabs");
    const panelsContainer = this.shadowRoot?.querySelector(
      ".nys-tabgroup__panels",
    );

    if (!tabsContainer || !panelsContainer) return;

    const tabs: Element[] = [];

    assigned.forEach((child) => {
      if (child.tagName.toLowerCase() === "nys-tab") {
        tabsContainer.appendChild(child);
        tabs.push(child);
      } else if (child.tagName.toLowerCase() === "nys-tabpanel") {
        panelsContainer.appendChild(child);
      }
    });

    // Only honor the first selected tab; remove selected from all others
    let selectedTab = tabs.find((t) => t.hasAttribute("selected"));
    tabs.forEach((t) => t.removeAttribute("selected"));

    if (selectedTab) {
      selectedTab.setAttribute("selected", "");
    }
    // If no tabs are selected, select the first one by default
    else if (tabs.length > 0) {
      tabs[0].setAttribute("selected", "");
      selectedTab = tabs[0];
    }

    console.log("First Selected is: ", selectedTab?.getAttribute("id"));

    // Show the panel that matches the selected tab index
    const panels = panelsContainer.querySelectorAll("nys-tabpanel");
    panels.forEach((panel, index) => {
      if (index === tabs.indexOf(selectedTab!)) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private _getTabs(): HTMLElement[] {
    const tabsContainer = this.shadowRoot?.querySelector(".nys-tabgroup__tabs");
    return Array.from(
      tabsContainer?.querySelectorAll("nys-tab") ?? [],
    ) as HTMLElement[];
  }

  private _getPanels(): HTMLElement[] {
    const panelsContainer = this.shadowRoot?.querySelector(
      ".nys-tabgroup__panels",
    );
    return Array.from(
      panelsContainer?.querySelectorAll("nys-tabpanel") ?? [],
    ) as HTMLElement[];
  }

  private _handleTabSelect(e: Event) {
    const selectedTab = (e as CustomEvent)
      .composedPath()
      .find(
        (el) => (el as HTMLElement).tagName?.toLowerCase() === "nys-tab",
      ) as HTMLElement | undefined;

    if (!selectedTab) return;
    const selectedId = selectedTab.id;

    this._getTabs().forEach((tab) => {
      if (tab === selectedTab) {
        tab.setAttribute("selected", "");
      } else {
        tab.removeAttribute("selected");
      }
    });

    //hide all panels except the one with matching id or index
    const panels = this._getPanels();
    panels.forEach((panel, index) => {
      const panelId = panel.getAttribute("aria-labelledby");
      if (panelId === selectedId || index === this._getTabs().indexOf(selectedTab)) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  }

  render() {
    return html`
      <div class="nys-tabgroup" @nys-tab-select=${this._handleTabSelect}>
        <div
          class="nys-tabgroup__tabs"
          role="tablist"
          aria-label=${this.name}
          aria-orientation=${this.orientation}
        ></div>
        <div class="nys-tabgroup__panels" style="border: blue solid;"></div>
        <slot
          @slotchange=${this._sortChildren}
          style="border: red solid;"
        ></slot>
      </div>
    `;
  }
}

if (!customElements.get("nys-tabgroup")) {
  customElements.define("nys-tabgroup", NysTabgroup);
}

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
    const firstSelected = tabs.find((t) => t.hasAttribute("selected"));
    tabs.forEach((t) => t.removeAttribute("selected"));

    if (firstSelected) {
      firstSelected.setAttribute("selected", "");
    } else if (tabs.length > 0) {
      tabs[0].setAttribute("selected", "");
    }
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

  private _handleTabSelect(e: Event) {
    const selectedTab = (e as CustomEvent)
      .composedPath()
      .find(
        (el) => (el as HTMLElement).tagName?.toLowerCase() === "nys-tab",
      ) as HTMLElement | undefined;

    if (!selectedTab) return;

    this._getTabs().forEach((tab) => {
      if (tab === selectedTab) {
        tab.setAttribute("selected", "");
      } else {
        tab.removeAttribute("selected");
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
        <div class="nys-tabgroup__panels"></div>
        <slot @slotchange=${this._sortChildren} style="display:none"></slot>
      </div>
    `;
  }
}

if (!customElements.get("nys-tabgroup")) {
  customElements.define("nys-tabgroup", NysTabgroup);
}

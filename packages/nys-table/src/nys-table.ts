import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-table.scss?inline";

let componentIdCounter = 0; // Counter for generating unique IDs

export class NysTable extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: Boolean, reflect: true }) striped = false;
  @property({ type: Boolean, reflect: true }) sortable = false;
  @property({ type: String, reflect: true }) download = "";

  //@state() private _sortColumn: string | null = null;
  //@state() private _sortDirection: "asc" | "desc" | "none" = "none";

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-table-${Date.now()}-${componentIdCounter++}`;
    }
  }

  /******************** Functions ********************/
  // Placeholder for generic functions (component-specific)

  firstUpdated() {
    this._handleSlotChange();

    const slot = this.shadowRoot?.querySelector("slot");
    slot?.addEventListener("slotchange", () => this._handleSlotChange());
  }

  _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector(
      "slot",
    ) as HTMLSlotElement | null;
    const wrapper = this.shadowRoot?.querySelector(
      ".nys-table",
    ) as HTMLElement | null;
    if (!slot || !wrapper) return;

    wrapper.innerHTML = "";

    const assigned = slot.assignedElements({ flatten: true });

    assigned.forEach((node) => {
      if (node.tagName === "TABLE") {
        const table = node.cloneNode(true) as HTMLTableElement;
        this._normalizeTable(table);
        if (this.sortable) {
          this._addSortIcons(table);
        }
        wrapper.appendChild(table);
        return;
      }
    });
  }

  _normalizeTable(table: HTMLTableElement) {
    const hasThead = table.querySelector("thead");
    const hasTbody = table.querySelector("tbody");

    if (hasThead && hasTbody) return;

    // Pull caption first
    const caption = table.querySelector(
      "caption",
    ) as HTMLTableCaptionElement | null;

    // Collect all rows
    const rows = Array.from(table.querySelectorAll("tr"));
    if (rows.length === 0) return;

    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Find first row containing th
    const headerRowIndex = rows.findIndex((r) => r.querySelector("th"));

    if (headerRowIndex === -1) {
      rows.forEach((r) => tbody.appendChild(r));
    } else {
      const headerRow = rows[headerRowIndex];

      // Wrap text nodes in <p> for each <th>
      headerRow.querySelectorAll("th").forEach((th) => {
        // Only wrap text nodes, leave icons or other children
        Array.from(th.childNodes).forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            const p = document.createElement("p");
            p.textContent = node.textContent;
            th.replaceChild(p, node);
          }
        });
      });

      thead.appendChild(headerRow);

      // Move remaining rows to tbody
      rows.forEach((r, i) => {
        if (i !== headerRowIndex) tbody.appendChild(r);
      });
    }

    // Wipe original table content
    table.innerHTML = "";

    // Insert caption first if it existed
    if (caption) table.appendChild(caption);

    table.appendChild(thead);
    table.appendChild(tbody);
  }

  _addSortIcons(table: HTMLTableElement) {
    const ths = Array.from(table.querySelectorAll("thead th"));
    if (ths.length === 0) return;

    ths.forEach((th) => {
      // Prevent duplicates on slotchange or re-render
      if (th.querySelector("nys-icon[part='sort-indicator']")) return;

      // Wrap existing text nodes in <p> if not already wrapped
      let p = th.querySelector("p");
      if (p) {
        const icon = document.createElement("nys-icon");
        icon.setAttribute("part", "sort-indicator");
        icon.setAttribute("name", "height");
        icon.setAttribute("size", "24");

        p.appendChild(icon);
      }
    });
  }

  /****************** Event Handlers ******************/
  // Placeholder for event handlers if needed

  render() {
    return html`
      <div class="nys-table"></div>
      <slot style="display:none"></slot>
    `;
  }
}

if (!customElements.get("nys-table")) {
  customElements.define("nys-table", NysTable);
}

import { html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-table.scss?inline";

/**
 * `<nys-table>` is a responsive table component that can display native HTML tables,
 * supports striped and bordered styling, sortable columns, and CSV download.
 *
 * @slot - Accepts a `<table>` element. Only the first table is rendered.
 *
 * @fires nys-click - Fired when the download button or sortable headers are clicked.
 * @fires nys-column-sort - Fired when a sortable column header is clicked.  Can be prevented by calling `event.preventDefault()` to override default sort behavior.
 *   Detail: { columnIndex: number, columnLabel: string, sortDirection: "asc" | "desc" | "none" }
 *
 * @method downloadFile - Triggers download of the CSV file if `download` is set.
 */
export class NysTable extends NysElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: Boolean, reflect: true }) striped = false;
  @property({ type: Boolean, reflect: true }) sortable = false;
  @property({ type: Boolean, reflect: true }) bordered = false;
  @property({ type: String, reflect: true }) download = "";

  @state() private _sortColumn: number | null = null;
  @state() private _sortDirection: "asc" | "desc" | "none" = "none";
  @state() private _captionText = "";

  private _observer: MutationObserver | null = null;

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }

  connectedCallback() {
    // super.connectedCallback() (NysElement) assigns a unique id
    // (prefixed with the element's localName) when one is not provided. The host
    // is a presentational wrapper: native table semantics live on the inner
    // cloned <table>, so this component keeps defaultRole = null and never moves
    // a role onto the host.
    super.connectedCallback();
  }

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector("slot");
    slot?.addEventListener("slotchange", () => this._handleSlotChange());
    this._handleSlotChange();
    this._setupMutationObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer?.disconnect();
  }

  willUpdate() {
    const table = Array.from(this.children).find(
      (el) => el.tagName === "TABLE",
    ) as HTMLTableElement | undefined;

    if (!table) return;

    const caption = table.querySelector("caption");
    const nextCaption = caption?.textContent?.trim() ?? "";

    if (this._captionText !== nextCaption) {
      this._captionText = nextCaption;
    }
  }

  /******************** Functions ********************/

  private _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector(
      "slot",
    ) as HTMLSlotElement | null;
    const container = this.shadowRoot?.querySelector(
      ".table-container",
    ) as HTMLElement | null;

    if (!slot || !container) return;

    container.innerHTML = "";

    const assigned = slot.assignedElements({ flatten: true });
    const tableEl = assigned.find((el) => el.tagName === "TABLE") as
      | HTMLTableElement
      | undefined;

    if (!tableEl) return;

    const table = tableEl.cloneNode(true) as HTMLTableElement;

    this._normalizeTableDOM(table);

    // WCAG 1.3.1 (Info and Relationships): ensure column header cells carry
    // scope="col" so assistive tech reliably associates each data cell with its
    // header. Applied after normalization so it covers both pre-structured
    // (thead/tbody) and auto-normalized tables.
    this._applyHeaderScopes(table);

    if (this.sortable) {
      this._addSortIcons(table);
    }

    container.appendChild(table);
  }

  private _setupMutationObserver() {
    const slot = this.shadowRoot?.querySelector(
      "slot",
    ) as HTMLSlotElement | null;
    if (!slot) return;

    this._observer = new MutationObserver(() => {
      this._handleSlotChange();
    });

    const observeSlottedContent = () => {
      const assigned = slot.assignedElements({ flatten: true });
      const tableEl = assigned.find(
        (el) => el.tagName === "TABLE",
      ) as HTMLTableElement;

      if (tableEl) {
        this._observer?.observe(tableEl, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }
    };

    observeSlottedContent(); // initial observation
    slot.addEventListener("slotchange", observeSlottedContent);
  }

  private _normalizeTableDOM(table: HTMLTableElement) {
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

    // Handle caption and sortable message
    if (caption) {
      table.appendChild(caption);
    }

    if (this.sortable) {
      const srOnly = document.createElement("span");
      srOnly.setAttribute("class", "sr-only");
      srOnly.textContent = "Column headers with buttons are sortable.";

      if (caption) {
        caption.appendChild(srOnly);
      } else {
        const nextCaption = document.createElement("caption");
        nextCaption.appendChild(srOnly);
        table.appendChild(nextCaption);
      }
    }

    table.appendChild(thead);
    table.appendChild(tbody);
  }

  /**
   * Adds scope="col" to every column-header cell in the table head. Header cells
   * inside the body (row headers) are left untouched so authors can still mark
   * them scope="row" themselves; we only set a scope where one is missing.
   */
  private _applyHeaderScopes(table: HTMLTableElement) {
    const headerCells = table.querySelectorAll("thead th");
    headerCells.forEach((th) => {
      if (!th.hasAttribute("scope")) {
        th.setAttribute("scope", "col");
      }
    });
  }

  private _addSortIcons(table: HTMLTableElement) {
    const ths = Array.from(table.querySelectorAll("thead th"));
    if (ths.length === 0) return;

    ths.forEach((th, index) => {
      // Prevent duplicates on slotchange or re-render
      if (th.querySelector("nys-button[part='sort-button']")) return;

      // Get existing text content
      const label = th.textContent?.trim();
      if (!label) return;

      // Clear existing content
      th.textContent = "";

      const button = document.createElement("nys-button");
      button.setAttribute("part", "sort-button");
      button.setAttribute("variant", "ghost");
      button.setAttribute("label", label);
      button.setAttribute("fullWidth", "true");

      const icon = document.createElement("nys-icon");
      icon.setAttribute("slot", "suffix-icon");
      icon.setAttribute("name", "height");
      icon.setAttribute("size", "24");
      icon.setAttribute("color", "var(--nys-color-text-weak, #4a4d4f)");

      button.appendChild(icon);

      button.addEventListener("nys-click", (e) => {
        e.stopPropagation();
        this._onSortClick(index, table);
      });

      th.appendChild(button);
    });
  }

  private _updateSortIcons(table: HTMLTableElement) {
    const ths = table.querySelectorAll("thead th");

    ths.forEach((th, index) => {
      const button = th.querySelector("nys-button[part='sort-button']");
      const icon = button?.querySelector(
        "nys-icon[slot='suffix-icon']",
      ) as HTMLElement | null;

      if (!button || !icon) return;

      if (index === this._sortColumn) {
        th.classList.add("nys-table__sortedcolumn");
        switch (this._sortDirection) {
          case "asc":
            icon.setAttribute("name", "straight");
            icon.setAttribute("color", "var(--nys-color-ink, #1b1b1b)");
            icon.style.transform = "rotate(0deg)";
            th.setAttribute("aria-sort", "ascending");
            break;
          case "desc":
            icon.setAttribute("name", "straight");
            icon.setAttribute("color", "var(--nys-color-ink, #1b1b1b)");
            icon.style.transform = "rotate(180deg)";
            th.setAttribute("aria-sort", "descending");
            break;
        }
      } else {
        // Reset for all other columns
        th.classList.remove("nys-table__sortedcolumn");
        icon.setAttribute("name", "height");
        icon.setAttribute("color", "var(--nys-color-text-weak, #4a4d4f)");
        icon.style.transform = "";
        th.removeAttribute("aria-sort");
      }
    });
  }

  private _onSortClick(columnIndex: number, table: HTMLTableElement) {
    const ths = Array.from(table.querySelectorAll("thead th"));
    const columnLabel =
      ths[columnIndex]
        ?.querySelector("nys-button[part='sort-button']")
        ?.getAttribute("label") ?? "";

    const nextDirection: "asc" | "desc" =
      this._sortColumn !== columnIndex
        ? "asc"
        : this._sortDirection === "asc"
          ? "desc"
          : "asc";

    const prevented = this._emitColumnSortEvent(
      columnIndex,
      columnLabel,
      nextDirection,
    );

    if (prevented) return;

    this._sortColumn = columnIndex;
    this._sortDirection = nextDirection;

    this._updateSortIcons(table);
    this._sortTable(table, columnIndex, this._sortDirection);
  }

  private _sortTable(
    table: HTMLTableElement,
    columnIndex: number,
    direction: "asc" | "desc",
  ) {
    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a, b) => {
      const aText = a.children[columnIndex]?.textContent?.trim() ?? "";
      const bText = b.children[columnIndex]?.textContent?.trim() ?? "";

      const aNum = Number(aText);
      const bNum = Number(bText);

      let result;

      if (!isNaN(aNum) && !isNaN(bNum)) {
        result = aNum - bNum;
      } else {
        result = aText.localeCompare(bText);
      }

      return direction === "asc" ? result : -result;
    });

    // Re-append sorted rows
    rows.forEach((r) => tbody.appendChild(r));
    this._updateSortedColumnStyles(table);
  }

  private _updateSortedColumnStyles(table: HTMLTableElement) {
    const rows = table.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      Array.from(row.children).forEach((cell, index) => {
        if (index === this._sortColumn) {
          cell.classList.add("nys-table__sortedcolumn");
        } else {
          cell.classList.remove("nys-table__sortedcolumn");
        }
      });
    });
  }

  public downloadFile() {
    // read file from this.download and trigger download
    const link = document.createElement("a");
    link.href = this.download;
    link.download = this.download.split("/").pop() || "table-data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /****************** Event Handlers ******************/

  /**
   * Dispatches the `nys-column-sort` custom event.
   *
   * @param columnIndex - Zero-based index of the sorted column.
   * @param columnLabel - The text label of the sorted column header.
   * @param sortDirection - The new sort direction: "asc", "desc", or "none".
   */
  private _emitColumnSortEvent(
    columnIndex: number,
    columnLabel: string,
    sortDirection: "asc" | "desc" | "none",
  ): boolean {
    const event = new CustomEvent("nys-column-sort", {
      detail: { columnIndex, columnLabel, sortDirection },
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    this.dispatchEvent(event);
    return event.defaultPrevented;
  }

  /****************** Render ******************/

  render() {
    return html`
      <div class="nys-table">
        <div class="table-container"></div>
      </div>
      ${this.download
        ? html` <nys-button
            id="${this.id}-download-button"
            label="Download table"
            aria-label=${this._captionText
              ? `Download ${this._captionText}`
              : "Download table"}
            size="sm"
            variant="outline"
            prefixIcon="download"
            @nys-click=${this.downloadFile}
          ></nys-button>`
        : ""}
      <slot style="display:none"></slot>
    `;
  }
}

if (!customElements.get("nys-table")) {
  customElements.define("nys-table", NysTable);
}

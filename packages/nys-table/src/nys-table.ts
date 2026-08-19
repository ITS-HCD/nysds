import { html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
// These elements are rendered inside this component's shadow DOM, so they must
// be registered whenever nys-table is used. Importing them here (intentional
// side effect) guarantees the sort icons and download button always upgrade —
// the download button's accessible name lands on nys-button's real inner
// <button>, which only exists once nys-button renders.
import "@nysds/nys-icon";
import "@nysds/nys-button";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-table.scss?inline";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-table.light.scss?inline";

let _lightSheet: CSSStyleSheet | null = null;
// Injects the light-DOM styling for <nys-table> into a single constructed
// stylesheet adopted on the document. Guarded so it runs once regardless of how
// many tables mount, and skipped during SSR where `document` is undefined.
function adoptLightStyles() {
  if (_lightSheet || typeof document === "undefined") return;
  _lightSheet = new CSSStyleSheet();
  _lightSheet.replaceSync(lightStyles);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, _lightSheet];
}

/**
 * `<nys-table>` is a responsive table component that can display native HTML tables,
 * supports striped and bordered styling, sortable columns, and CSV download.
 *
 * @slot - Accepts a `<table>` element. Only the first table is used. The table
 *   is enhanced in place and stays in the light DOM (projected through a slot,
 *   never cloned), so embedded components remain interactive and reachable by
 *   consumer CSS/JS. Its cell styling is applied from `nys-table.light.scss`,
 *   adopted once onto `document.adoptedStyleSheets`.
 *
 * @fires nys-click - Fired when the download button or sortable headers are clicked.
 * @fires nys-column-sort - Fired when a sortable column header is clicked.  Can be prevented by calling `event.preventDefault()` to override default sort behavior.
 *   Detail: { columnIndex: number, columnLabel: string, sortDirection: "asc" | "desc" | "none" }
 *
 * @method downloadFile - Triggers download of the CSV file if `download` is set.
 *
 * @example Basic
 * ```html
 * <nys-table id="table1" name="table1">
 *   <table>
 *     <caption>New York State High Peaks and Popular Hikes</caption>
 *     <tr><th>Mountain</th><th>Peak Height (ft)</th><th>Hike Name</th></tr>
 *     <tr><td>Marcy</td><td>5,344</td><td>Van Hoevenberg Trail</td></tr>
 *     <tr><td>Algonquin</td><td>5,114</td><td>Northeast Trail</td></tr>
 *     <tr><td>Haystack</td><td>4,960</td><td>Johns Brook Trail</td></tr>
 *     <tr><td>Skylight</td><td>4,926</td><td>Lake Tear Trail</td></tr>
 *     <tr><td>Whiteface</td><td>4,867</td><td>Whiteface Mountain Trail</td></tr>
 *   </table>
 * </nys-table>
 * ```
 *
 * @example Striped
 * ```html
 * <nys-table id="table2" name="table2" striped>
 *   <table>
 *     <caption>New York State High Peaks and Popular Hikes</caption>
 *     <tr><th>Mountain</th><th>Peak Height (ft)</th><th>Hike Name</th></tr>
 *     <tr><td>Marcy</td><td>5,344</td><td>Van Hoevenberg Trail</td></tr>
 *     <tr><td>Haystack</td><td>4,960</td><td>Johns Brook Trail</td></tr>
 *     <tr><td>Skylight</td><td>4,926</td><td>Lake Tear Trail</td></tr>
 *     <tr><td>Whiteface</td><td>4,867</td><td>Whiteface Mountain Trail</td></tr>
 *   </table>
 * </nys-table>
 * ```
 *
 * @example Bordered
 * ```html
 * <nys-table id="table3" name="table3" bordered>
 *   <table>
 *     <caption>New York State High Peaks and Popular Hikes</caption>
 *     <tr><th>Mountain</th><th>Peak Height (ft)</th><th>Hike Name</th></tr>
 *     <tr><td>Marcy</td><td>5,344</td><td>Van Hoevenberg Trail</td></tr>
 *     <tr><td>Haystack</td><td>4,960</td><td>Johns Brook Trail</td></tr>
 *     <tr><td>Skylight</td><td>4,926</td><td>Lake Tear Trail</td></tr>
 *     <tr><td>Whiteface</td><td>4,867</td><td>Whiteface Mountain Trail</td></tr>
 *   </table>
 * </nys-table>
 * ```
 *
 * @example Sortable
 * ```html
 * <nys-table id="table4" name="table4" sortable>
 *   <table>
 *     <caption>New York State High Peaks and Popular Hikes</caption>
 *     <tr><th>Mountain</th><th>Peak Height (ft)</th><th>Hike Name</th></tr>
 *     <tr><td>Marcy</td><td>5,344</td><td>Van Hoevenberg Trail</td></tr>
 *     <tr><td>Haystack</td><td>4,960</td><td>Johns Brook Trail</td></tr>
 *     <tr><td>Skylight</td><td>4,926</td><td>Lake Tear Trail</td></tr>
 *     <tr><td>Whiteface</td><td>4,867</td><td>Whiteface Mountain Trail</td></tr>
 *   </table>
 * </nys-table>
 * ```
 *
 * @example Downloadable
 * ```html
 * <nys-table id="table5" name="table5" download="path/to/downloadable/version/of/table.filetype">
 *   <table>
 *     <caption>New York State High Peaks and Popular Hikes</caption>
 *     <tr><th>Mountain</th><th>Peak Height (ft)</th><th>Hike Name</th></tr>
 *     <tr><td>Marcy</td><td>5,344</td><td>Van Hoevenberg Trail</td></tr>
 *     <tr><td>Haystack</td><td>4,960</td><td>Johns Brook Trail</td></tr>
 *     <tr><td>Skylight</td><td>4,926</td><td>Lake Tear Trail</td></tr>
 *     <tr><td>Whiteface</td><td>4,867</td><td>Whiteface Mountain Trail</td></tr>
 *   </table>
 * </nys-table>
 * ```
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
  // Guards against the MutationObserver re-entering while we mutate the table
  // ourselves (normalize / sort-icon / sort). See `_withObserverPaused`.
  private _enhancing = false;

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }

  connectedCallback() {
    // super.connectedCallback() (NysElement) assigns a unique id
    // (prefixed with the element's localName) when one is not provided. The host
    // is a presentational wrapper: native table semantics live on the slotted
    // <table>, enhanced in place, so this component keeps defaultRole = null and
    // never moves a role onto the host.
    super.connectedCallback();
    adoptLightStyles();
  }

  firstUpdated() {
    // The <slot>'s own slotchange (wired in render()) drives re-enhancement.
    this._setupMutationObserver();
    this._handleSlotChange();
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

  // Returns the real slotted <table>. It stays a light-DOM child of the host
  // (projected through the <slot>, never cloned), so it remains reachable by
  // consumer CSS/JS and any embedded components stay interactive.
  private _getSlottedTable(): HTMLTableElement | undefined {
    const slot = this.shadowRoot?.querySelector(
      "slot",
    ) as HTMLSlotElement | null;
    const assigned = slot?.assignedElements({ flatten: true }) ?? [];
    return assigned.find((el) => el.tagName === "TABLE") as
      | HTMLTableElement
      | undefined;
  }

  private _observeTable(table: HTMLTableElement) {
    this._observer?.observe(table, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  // Runs `fn` (which mutates the slotted table) with the MutationObserver
  // detached, then re-attaches it. Because we now enhance the real table in
  // place, our own writes would otherwise re-trigger the observer and loop.
  private _withObserverPaused(table: HTMLTableElement, fn: () => void) {
    if (this._enhancing) {
      fn();
      return;
    }
    this._enhancing = true;
    this._observer?.disconnect();
    try {
      fn();
    } finally {
      this._observeTable(table);
      this._enhancing = false;
    }
  }

  private _handleSlotChange() {
    const table = this._getSlottedTable();
    if (!table || this._enhancing) return;

    this._withObserverPaused(table, () => {
      this._normalizeTableDOM(table);

      // WCAG 1.3.1 (Info and Relationships): ensure column header cells carry
      // scope="col" so assistive tech reliably associates each data cell with
      // its header. Applied after normalization so it covers both
      // pre-structured (thead/tbody) and auto-normalized tables.
      this._applyHeaderScopes(table);

      if (this.sortable) {
        this._addSortIcons(table);
      }
    });
  }

  private _setupMutationObserver() {
    this._observer = new MutationObserver(() => this._handleSlotChange());

    const table = this._getSlottedTable();
    if (table) this._observeTable(table);
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

    // Sorting reorders tbody rows and rewrites icon attributes on the real
    // table, so pause the observer to avoid re-triggering enhancement.
    this._withObserverPaused(table, () => {
      this._updateSortIcons(table);
      this._sortTable(table, columnIndex, nextDirection);
    });
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
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
      ${this.download
        ? html` <nys-button
            id="${this.id}-download-button"
            label=${this._captionText
              ? `Download ${this._captionText}`
              : "Download table"}
            size="sm"
            variant="outline"
            prefixIcon="download"
            @nys-click=${this.downloadFile}
          ></nys-button>`
        : ""}
    `;
  }
}

if (!customElements.get("nys-table")) {
  customElements.define("nys-table", NysTable);
}

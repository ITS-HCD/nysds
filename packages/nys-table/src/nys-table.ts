import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-table.scss?inline";

let componentIdCounter = 0; // Counter for generating unique IDs

export class NysTable extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";

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

  private _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector(
      'slot',
    ) as HTMLSlotElement | null;
    const table = this.shadowRoot?.querySelector("table");

    if (!slot || !table) return;

    const assignedElements = slot.assignedElements({ flatten: true });

     assignedElements.forEach((node) => {

      // ---- Handle native <tr> ----
      if (node.tagName === "TR") {
        const trClone = node.cloneNode(true) as HTMLTableRowElement;
        table.appendChild(trClone);
        return;
      }

      // ---- Handle native <td> ----
      if (node.tagName === "TD") {
        const tdClone = node.cloneNode(true) as HTMLTableCellElement;
        table.appendChild(tdClone);
        return;
      }

      // ---- Handle native <th> ----
      if (node.tagName === "TH") {
        const thClone = node.cloneNode(true) as HTMLTableCellElement;
        table.appendChild(thClone);
        return;
      }

      // ---- Handle <tbody> ----
      if (node.tagName === "TBODY") {
        const tbodyClone = node.cloneNode(true) as HTMLTableSectionElement;
        table.appendChild(tbodyClone);
        return;
      }

      // ---- Handle <thead> ----
      if (node.tagName === "THEAD") {
        const theadClone = node.cloneNode(true) as HTMLTableSectionElement;
        table.appendChild(theadClone);
        return;
      }

      // ---- Handle <tfoot> ----
      if (node.tagName === "TFOOT") {
        const tfootClone = node.cloneNode(true) as HTMLTableSectionElement;
        table.appendChild(tfootClone);
        return;
      }

      // ---- Handle <table> ----
      if (node.tagName === "TABLE") {
        const tableClone = node.cloneNode(true) as HTMLTableElement;
        // Append all child nodes of the cloned table to the main table
        Array.from(tableClone.children).forEach((child) => {
          table.appendChild(child);
        });
        return;
      }

      // Handle <caption>
      if (node.tagName === "CAPTION") {
        const captionClone = node.cloneNode(true) as HTMLTableCaptionElement;
        table.appendChild(captionClone);
        return;
      }

      // handle colgroup
      if (node.tagName === "COLGROUP") {
        const colgroupClone = node.cloneNode(true) as HTMLTableColElement;
        table.appendChild(colgroupClone);
        return;
      }

      // handle col
      if (node.tagName === "COL") {
        const colClone = node.cloneNode(true) as HTMLTableColElement;
        table.appendChild(colClone);
        return;
      }
    });
  }

  /******************** Functions ********************/
  // Placeholder for generic functions (component-specific)

  /****************** Event Handlers ******************/
  // Placeholder for event handlers if needed

  render() {
    return html` <div class="nys-table">
      <table class="nys-table__table"></table>
      <slot @slotchange=${this._handleSlotChange} style="display: none">
      </slot>
    </div>`;
  }
}

if (!customElements.get("nys-table")) {
  customElements.define("nys-table", NysTable);
}

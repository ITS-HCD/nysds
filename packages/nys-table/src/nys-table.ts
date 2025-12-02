import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-table.scss?inline";

let componentIdCounter = 0; // Counter for generating unique IDs

export class NysTable extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: Boolean }) striped = false;
  @property({ type: Boolean }) sortable = false;
  @property({ type: String }) download = "";

  @state() private _sortColumn: string | null = null;
  @state() private _sortDirection: "asc" | "desc" | "none" = "none";

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
        wrapper.appendChild(table);
        return;
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

import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-pagination.styles";

let componentIdCounter = 0; // Counter for generating unique IDs

export class NysPagination extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: Number }) currentPage = 4;
  @property({ type: Number }) totalPages = 6;

  static styles = styles;

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-pagination-${Date.now()}-${componentIdCounter++}`;
    }
  }

  /******************** Functions ********************/
  private renderPageButtons() {
    const buttons = [];
    for (let i = 1; i <= this.totalPages; i++) {
      buttons.push(html`
        <nys-button
          label=${String(i)}
          variant=${this.currentPage === i ? "filled" : "outline"}
          .onClick="${() => this._handlePageClick(i)}"
        ></nys-button>
      `);
    }
    return buttons;
  }
  /****************** Event Handlers ******************/
  private _handlePageClick(page: number) {
    this.currentPage = page;
    this.dispatchEvent(
      new CustomEvent("page-change", {
        detail: { page },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`<div class="nys-pagination">
      ${this.currentPage > 1
        ? html`
            <nys-button
              id="previous"
              label="Previous"
              prefixIcon="chevron_left"
              variant="outline"
              .onClick="${() => this._handlePageClick(this.currentPage - 1)}"
            ></nys-button>
          `
        : null}
      ${this.renderPageButtons()}
      ${this.currentPage < this.totalPages
        ? html`
            <nys-button
              id="next"
              label="Next"
              suffixIcon="chevron_right"
              variant="outline"
              .onClick="${() => this._handlePageClick(this.currentPage + 1)}"
            ></nys-button>
          `
        : null}
    </div>`;
  }
}

if (!customElements.get("nys-pagination")) {
  customElements.define("nys-pagination", NysPagination);
}

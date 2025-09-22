import { LitElement, TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-pagination.styles";

let componentIdCounter = 0; // Counter for generating unique IDs

export class NysPagination extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: Number }) currentPage = 4;
  @property({ type: Number }) totalPages = 10;

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
    const buttons: TemplateResult[] = [];

    const addPageButton = (page: number) => {
      buttons.push(html`
        <nys-button
          label=${String(page)}
          variant=${this.currentPage === page ? "filled" : "outline"}
          .onClick="${() => this._handlePageClick(page)}"
        ></nys-button>
      `);
    };

    const addSpacer = () => {
      buttons.push(
        html`<nys-button
          label="..."
          class="spacer"
          tabindex="-1"
        ></nys-button>`,
      );
    };

    const firstPage = 1;
    const lastPage = this.totalPages;
    const prev = this.currentPage - 1;
    const next = this.currentPage + 1;

    // Always show first page
    addPageButton(firstPage);

    // Add spacer if current is beyond 3
    if (this.currentPage > 3) {
      addSpacer();
    }

    // Show previous if greater than first
    if (prev > firstPage) {
      addPageButton(prev);
    }

    // Show current (only if not first/last, since they’re already handled)
    if (this.currentPage !== firstPage && this.currentPage !== lastPage) {
      addPageButton(this.currentPage);
    }

    // Show next if less than last
    if (next < lastPage) {
      addPageButton(next);
    }

    // Add spacer if current is at least 3 away from last
    if (this.currentPage < lastPage - 2) {
      addSpacer();
    }

    // Always show last page if there’s more than one
    if (lastPage > firstPage) {
      addPageButton(lastPage);
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

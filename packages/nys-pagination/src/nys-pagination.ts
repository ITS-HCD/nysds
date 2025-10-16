import { LitElement, TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-pagination.styles";
import { ifDefined } from "lit/directives/if-defined.js";

let componentIdCounter = 0; // Counter for generating unique IDs

export class NysPagination extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: Number, reflect: true }) currentPage = 1;
  @property({ type: Number, reflect: true }) totalPages = 1;
  @property({ type: Boolean, reflect: true }) _twoBeforeLast = false;

  static styles = styles;

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }

  updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);
    // Clamp currentPage whenever it or totalPages changes
    this.currentPage = this._clampPage(this.currentPage);
    this._twoBeforeLast = this.currentPage === this.totalPages - 2;
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-pagination-${Date.now()}-${componentIdCounter++}`;
    }
  }

  /******************** Functions ********************/
  private _clampPage(page: number): number {
    if (page < 1) return 1;
    if (page > this.totalPages) return this.totalPages;
    return page;
  }

  private renderPageButtons() {
    const buttons: TemplateResult[] = [];

    const addPageButton = (page: number, id?: string) => {
      buttons.push(html`
        <nys-button
          label=${String(page)}
          ariaLabel="Page ${page}"
          id=${ifDefined(id)}
          variant=${this.currentPage === page ? "filled" : "outline"}
          @nys-click="${() => this._handlePageClick(page)}"
        ></nys-button>
      `);
    };

    const addSpacer = (id: string) => {
      buttons.push(
        html`<nys-button
          label="..."
          class="spacer"
          tabindex="-1"
          id=${id}
        ></nys-button>`,
      );
    };

    const firstPage = 1;
    const lastPage = this.totalPages;
    const prev = this.currentPage - 1;
    const next = this.currentPage + 1;

    // Always show first page
    addPageButton(firstPage);

    // Spacer if there's a gap between first and current/prev
    if (this.currentPage > 2) {
      addSpacer("first-spacer");
    }

    // Show prev neighbor (desktop; can be hidden via CSS at mobile)
    if (prev > firstPage) {
      addPageButton(prev, "prev-page");
    }

    // Show current (only if not first/last, since they’re already rendered)
    if (this.currentPage !== firstPage && this.currentPage !== lastPage) {
      addPageButton(this.currentPage, "current-page");
    }

    // Show next neighbor (desktop; can be hidden via CSS at mobile)
    if (next < lastPage) {
      addPageButton(next, "next-page");
    }

    // Spacer if there's a gap between current/next and last
    if (this.currentPage < lastPage - 1) {
      addSpacer("last-spacer");
    }

    // Always show last page if more than one
    if (lastPage > firstPage) {
      addPageButton(lastPage);
    }

    return buttons;
  }

  /****************** Event Handlers ******************/
  private _handlePageClick(page: number) {
    this.currentPage = this._clampPage(page);
    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: { page: this.currentPage },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    // If only one page, render nothing
    if (this.totalPages <= 1) {
      return null;
    }

    return html`<div class="nys-pagination">
      <nys-button
        id="previous"
        label="Previous"
        prefixIcon="chevron_left"
        variant="outline"
        ?disabled=${this.currentPage === 1}
        @nys-click="${() => this._handlePageClick(this.currentPage - 1)}"
      ></nys-button>
      <nys-button
        id="previous--mobile"
        prefixIcon="chevron_left"
        ariaLabel="Previous Page"
        variant="outline"
        ?disabled=${this.currentPage === 1}
        @nys-click="${() => this._handlePageClick(this.currentPage - 1)}"
      ></nys-button>
      ${this.renderPageButtons()}
      <nys-button
        id="next"
        label="Next"
        suffixIcon="chevron_right"
        variant="outline"
        ?disabled=${this.currentPage === this.totalPages}
        @nys-click="${() => this._handlePageClick(this.currentPage + 1)}"
      ></nys-button>
      <nys-button
        id="next--mobile"
        suffixIcon="chevron_right"
        ariaLabel="Next Page"
        variant="outline"
        ?disabled=${this.currentPage === this.totalPages}
        @nys-click="${() => this._handlePageClick(this.currentPage + 1)}"
      ></nys-button>
    </div>`;
  }
  /****************** 🪡 for 1.10.1 ******************/
  /****************** designsystem@its.ny.gov ********/
}

if (!customElements.get("nys-pagination")) {
  customElements.define("nys-pagination", NysPagination);
}

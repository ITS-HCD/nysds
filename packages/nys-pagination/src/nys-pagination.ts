import { LitElement, TemplateResult, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-pagination.scss?inline";

let componentIdCounter = 0;

/**
 * Page navigation control for stepping through paginated content. Displays Previous/Next buttons, numbered page links,
 * and automatically collapses with ellipses for many pages.
 *
 * **Status:** Stable | **WCAG:** 2.2 AA
 *
 * Set `totalPages` and `currentPage` to control state. Listen to `nys-change` event for page changes.
 * Automatically hidden when `totalPages` is 1. Responsive: shows compact icon-only buttons on mobile, full labels on desktop.
 * A unique ID is auto-generated if not provided.
 *
 * ## When to use
 * - When displaying large data sets or search results that would be overwhelming to display all at once.
 * - When users need control and orientation to navigate to a specific part of the content (e.g., page 5 of search results).
 * - When performance and load times matter, since pagination lets you fetch and render smaller chunks of data instead of everything at once.
 * - For tables, search results, and other paginated lists.
 * - When you want to allow users to jump to a specific page number.
 *
 * ## When to consider something else
 * - If the collection is shorter than 3-4 screen lengths, display all items at once rather than using pagination.
 * - When you need to show progress through a series of tasks that must be completed in order (such as an onboarding process), use the `<nys-stepper>` component instead.
 * - For infinite scroll or continuous load-more patterns, pagination is not the right choice.
 * - If the displayed collection can fit on less than 3 or 4 pages, consider displaying all items at once.
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Set `totalPages` based on your data set and page size. Update `currentPage` in response to `nys-change` events.
 * - Position the pagination component below the content it controls, so users see results before navigating.
 * - Scroll users to the top of the results area when they change pages, so they start reading from the beginning.
 *
 * **Don't:**
 * - Use pagination when content fits on a single scrollable page.
 * - Use pagination for step-based workflows where users complete tasks in order (use `<nys-stepper>` instead).
 * - Set `currentPage` to a value greater than `totalPages` (the component clamps it automatically).
 *
 * ## Navigation structure and behavior
 * - **Previous Button**: Navigates to the previous page. Disabled on the first page.
 * - **Page Buttons**: Numbered links for direct page navigation. Current page is highlighted with the `filled` variant.
 * - **Next Button**: Navigates to the next page. Disabled on the last page.
 * - **Ellipses (...)**: Collapse long page ranges to keep the UI compact. Shown when there's a gap between page numbers.
 * - **Responsive Behavior**: On mobile (< 480px), shows Previous and Next buttons only (no page numbers). On desktop, shows full navigation.
 *
 * ## Props and behavior
 * - **`totalPages`**: The total number of pages. Must be at least 1. If set to 1, the component does not render.
 * - **`currentPage`**: The currently active page number (1-indexed). If a value larger than `totalPages` is passed, it is clamped to the last page.
 * If a value less than 1 is passed, it is clamped to page 1.
 * - **`name`**: Optional name attribute for form association.
 *
 * ## Compact rendering
 * The component automatically adjusts rendering based on the number of pages:
 * - **1 page**: Component is hidden (does not render).
 * - **2-3 pages**: Shows all page numbers.
 * - **4+ pages**: Shows first, last, current, and neighboring page numbers; uses ellipses (...) to collapse ranges.
 *
 * ## Accessibility
 * The `nys-pagination` component includes the following accessibility-focused features:
 * - **Keyboard Navigation**: All pagination buttons are reachable and operable via keyboard (Tab, Enter, Space).
 * - **Focus Indicators**: Provide a clear, visible focus indicator so users can see the currently focused button.
 * - **ARIA Labels**: Each page button has an `ariaLabel` indicating the page number and whether it is current (e.g., "Page 5 - Current Page").
 * - **Button States**: Previous/Next buttons are properly disabled when at page boundaries, preventing invalid navigation.
 * - **Semantic HTML**: Uses `<nys-button>` components for proper semantics and interaction.
 *
 * ## Dependencies
 *
 * This component depends on the following NYS Design System components:
 *
 *   - `nys-button`
 *
 * @summary Page navigation with numbered links, Previous/Next buttons, and responsive mobile-first layout.
 * @element nys-pagination
 *
 * @fires nys-change - Fired when page changes. Detail: `{page}`.
 *
 * @example Basic pagination
 * ```html
 * <nys-pagination currentPage="1" totalPages="10"></nys-pagination>
 * ```
 *
 * @example Listen for page changes
 * ```js
 * const pagination = document.querySelector("nys-pagination");
 * pagination.addEventListener("nys-change", (event) => {
 *   console.log(`Page changed to ${event.detail.page}`);
 *   // Fetch data for the new page
 * });
 * ```
 */

export class NysPagination extends LitElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Name attribute for form association. */
  @property({ type: String, reflect: true }) name = "";

  /** Currently active page (1-indexed). Clamped to valid range. */
  @property({ type: Number, reflect: true }) currentPage = 1;

  /** Total number of pages. Must be at least 1. */
  @property({ type: Number, reflect: true }) totalPages = 1;

  /** Internal state for layout adjustments near the end. */
  @property({ type: Boolean, reflect: true }) _twoBeforeLast = false;

  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */

  constructor() {
    super();
  }

  willUpdate(changedProps: Map<string, unknown>) {
    if (this.totalPages < 1) this.totalPages = 1; //ensure totalPages is at least 1

    if (changedProps.has("currentPage") || changedProps.has("totalPages")) {
      const clamped = this._clampPage(this.currentPage);
      if (clamped !== this.currentPage) {
        this.currentPage = clamped;
      }

      const twoBefore = this.currentPage === this.totalPages - 2;
      if (twoBefore !== this._twoBeforeLast) {
        this._twoBeforeLast = twoBefore;
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-pagination-${Date.now()}-${componentIdCounter++}`;
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

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
          ariaLabel="Page ${page}${page === this.currentPage
            ? " - Current Page"
            : ""}"
          id=${ifDefined(id)}
          variant=${this.currentPage === page ? "filled" : "outline"}
          size="sm"
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
          size="sm"
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

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

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
        ariaLabel="Previous Page"
        prefixIcon="chevron_left"
        variant="outline"
        size="sm"
        ?disabled=${this.currentPage === 1}
        @nys-click="${() => this._handlePageClick(this.currentPage - 1)}"
      ></nys-button>
      <nys-button
        id="previous--mobile"
        prefixIcon="chevron_left"
        ariaLabel="Previous Page"
        variant="outline"
        size="sm"
        ?disabled=${this.currentPage === 1}
        @nys-click="${() => this._handlePageClick(this.currentPage - 1)}"
      ></nys-button>
      ${this.renderPageButtons()}
      <nys-button
        id="next"
        label="Next"
        ariaLabel="Next Page"
        suffixIcon="chevron_right"
        variant="outline"
        size="sm"
        ?disabled=${this.currentPage === this.totalPages}
        @nys-click="${() => this._handlePageClick(this.currentPage + 1)}"
      ></nys-button>
      <nys-button
        id="next--mobile"
        suffixIcon="chevron_right"
        ariaLabel="Next Page"
        variant="outline"
        size="sm"
        ?disabled=${this.currentPage === this.totalPages}
        @nys-click="${() => this._handlePageClick(this.currentPage + 1)}"
      ></nys-button>
    </div>`;
  }
  /****************** 🪡 in the Haystack Release ******/
  /****************** designsystem@its.ny.gov ********/
}

if (!customElements.get("nys-pagination")) {
  customElements.define("nys-pagination", NysPagination);
}

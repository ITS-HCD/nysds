import { TemplateResult, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { NysElement } from "@nysds/internals";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-pagination.scss?inline";

/** All the focus restore needs of a rendered child: when has it finished updating. */
type LitLikeElement = HTMLElement & { updateComplete: Promise<unknown> };

/**
 * Page navigation with Previous/Next buttons and numbered page links. Auto-collapses with ellipses for many pages.
 *
 * Set `totalPages` and `currentPage` to control state. Listen to `nys-change` for page selection.
 * Hidden automatically when `totalPages` is 1. Responsive: shows compact controls on mobile.
 *
 * ## Accessibility
 * - The controls sit in a `navigation` landmark named "Pagination".
 * - The current page's button carries `aria-current="page"` so assistive technology
 *   announces which page the user is on.
 * - Keyboard focus follows the user across a page change: it stays on the page they
 *   activated, and moves to the current page's button when Previous or Next disables
 *   itself on the first or last page rather than falling back to the document.
 * - The ellipsis between non-adjacent page numbers is inert text, not a control, and is
 *   hidden from assistive technology.
 *
 * @summary Page navigation with numbered links, prev/next buttons, and responsive layout.
 * @element nys-pagination
 *
 * @fires nys-change - Fired when page changes. Detail: `{page}`.
 *
 * @example Basic
 * ```html
 * <nys-pagination currentPage="5" totalPages="10"></nys-pagination>
 * ```
 *
 * @example First Page
 * ```html
 * <nys-pagination currentPage="1" totalPages="10"></nys-pagination>
 * ```
 *
 * @example Last Page
 * ```html
 * <nys-pagination currentPage="10" totalPages="10"></nys-pagination>
 * ```
 */

export class NysPagination extends NysElement {
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
   * Logical identity of the control that held focus when this update was scheduled,
   * captured before the re-render that invalidates it. Null whenever focus was outside
   * the component, which is what keeps a programmatic page change from stealing focus.
   */
  private _focusKeyBeforeUpdate: string | null = null;

  /** Guards against an older, still-pending focus restore overriding a newer one. */
  private _focusRestoreToken = 0;

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

    // Record what the user was on while the old DOM is still standing; render() is
    // about to reshuffle which page each button navigates to.
    this._focusKeyBeforeUpdate = this._focusKeyOf(
      this.shadowRoot?.activeElement ?? null,
    );
  }

  updated() {
    const key = this._focusKeyBeforeUpdate;
    this._focusKeyBeforeUpdate = null;
    if (key) this._restoreFocus(key);
  }

  connectedCallback() {
    // super.connectedCallback() (NysElement) assigns an auto-generated
    // id (prefix = localName "nys-pagination") when one is not provided. The
    // navigation landmark role lives on the inner <nav> element (so it carries the
    // accessible name), so this component intentionally keeps defaultRole = null
    // and does not move a role onto the host.
    super.connectedCallback();
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

  /**
   * Stable identity for a control in the shadow root, one that survives a re-render.
   *
   * DOM position is not that identity: the window of visible page numbers slides as the
   * user pages through, and Lit reuses the element sitting at a given position, so the
   * button under the user's focus silently starts navigating to a different page. Page
   * buttons are therefore identified by the page they navigate to, and the fixed
   * Previous/Next controls by their id.
   */
  private _focusKeyOf(el: Element | null): string | null {
    if (!el) return null;
    const page = el.getAttribute("data-page");
    if (page) return `page:${page}`;
    return el.id ? `control:${el.id}` : null;
  }

  /** Resolve a focus key back to the control that now carries that identity. */
  private _controlForKey(key: string): HTMLElement | null {
    const root = this.shadowRoot;
    if (!root) return null;

    const separator = key.indexOf(":");
    const kind = key.slice(0, separator);
    const value = key.slice(separator + 1);

    return kind === "page"
      ? root.querySelector<HTMLElement>(`nys-button[data-page="${value}"]`)
      : (root.getElementById(value) as HTMLElement | null);
  }

  /**
   * A control has to be both enabled and rendered to take focus. `getClientRects()`
   * covers the responsive rules that swap the desktop Previous/Next for their
   * icon-only mobile twins, and hide the page neighbors on narrow screens.
   */
  private _isFocusable(el: Element | null): el is HTMLElement {
    return (
      !!el && !el.hasAttribute("disabled") && el.getClientRects().length > 0
    );
  }

  /**
   * Where focus goes when the control the user was on is gone or has just been
   * disabled: the current page's button. It is always rendered, it is never disabled,
   * and it announces the page the user just landed on.
   */
  private _fallbackFocusTarget(): HTMLElement | null {
    const root = this.shadowRoot;
    if (!root) return null;

    const current = root.querySelector<HTMLElement>(
      `nys-button[data-page="${this.currentPage}"]`,
    );
    if (this._isFocusable(current)) return current;

    const controls = Array.from(
      root.querySelectorAll<HTMLElement>("nys-button"),
    );
    return controls.find((btn) => this._isFocusable(btn)) ?? null;
  }

  /**
   * Keep keyboard focus on the control the user was operating.
   *
   * Two things pull focus out from under them otherwise. Reaching the first or last page
   * disables Previous/Next while it still holds focus, which drops focus to `<body>` and
   * ends the keyboard journey. And activating a page slides the window of page numbers,
   * so the button that keeps focus by DOM position is now a different, non-current page.
   */
  private async _restoreFocus(key: string) {
    const root = this.shadowRoot;
    if (!root) return;

    // Every control here is a `nys-button`. Ones this update just created have not
    // rendered their internal <button> yet, so until they have they can neither be
    // focused nor measured — and the ones going disabled have not dropped focus yet.
    // allSettled, not all: whether a child rendered cleanly is its own business,
    // and a rejection here would surface as an unhandled one.
    const controls = Array.from(root.querySelectorAll("nys-button"));
    const token = ++this._focusRestoreToken;
    await Promise.allSettled(
      controls.map((btn) => (btn as LitLikeElement).updateComplete),
    );
    if (token !== this._focusRestoreToken || !this.isConnected) return;

    const target = this._controlForKey(key);
    const next = this._isFocusable(target)
      ? target
      : this._fallbackFocusTarget();

    if (next && next !== root.activeElement) next.focus();
  }

  private renderPageButtons() {
    const buttons: TemplateResult[] = [];

    const addPageButton = (page: number, id?: string) => {
      const isCurrent = page === this.currentPage;
      buttons.push(html`
        <nys-button
          label=${String(page)}
          ariaLabel="Page ${page}${isCurrent ? " - Current Page" : ""}"
          ariaCurrent=${ifDefined(isCurrent ? "page" : undefined)}
          data-page=${page}
          id=${ifDefined(id)}
          variant=${isCurrent ? "filled" : "outline"}
          size="sm"
          @nys-click="${() => this._handlePageClick(page)}"
        ></nys-button>
      `);
    };

    // The gap between two non-adjacent page numbers. It navigates nowhere, so it is
    // not a control: as a `nys-button` it was a tab stop that did nothing, and the
    // host's tabindex="-1" could not take it out of the tab order because the button
    // it was really landing on lives in that component's shadow root. Inert text now,
    // and hidden from assistive technology.
    const addSpacer = (id: string) => {
      buttons.push(
        html`<span class="nys-pagination__ellipsis" id=${id} aria-hidden="true"
          >...</span
        >`,
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

    return html`<nav class="nys-pagination" aria-label="Pagination">
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
    </nav>`;
  }
  /****************** 🪡 in the Haystack Release ******/
  /****************** designsystem@its.ny.gov ********/
}

if (!customElements.get("nys-pagination")) {
  customElements.define("nys-pagination", NysPagination);
}

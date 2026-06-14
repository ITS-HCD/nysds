import { html, unsafeCSS } from "lit";
import nysLogo from "./nys-brand.logo";
import { property, state } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-globalheader.scss?inline";

/**
 * Agency-branded header with app/agency name, navigation, and responsive mobile menu.
 *
 * Place below `nys-unavheader`. Slot navigation links as `<ul><li><a>` elements; active links
 * are auto-highlighted based on current URL. Mobile menu toggles automatically on narrow screens.
 *
 * @summary Agency header with navigation, mobile menu, and active link highlighting.
 * @element nys-globalheader
 *
 * @slot - Navigation content (typically `<ul>` with `<li><a>` links). Auto-sanitized.
 *
 * @example Basic header
 * ```html
 * <nys-globalheader appName="My App" agencyName="Department of Health" homepageLink="/">
 *   <ul><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li></ul>
 * </nys-globalheader>
 * ```
 */

export class NysGlobalHeader extends NysElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Application name displayed prominently. */
  @property({ type: String }) appName = "";

  /** Agency name displayed below app name (or as main title if no appName). */
  @property({ type: String }) agencyName = "";

  /** URL for the header title link. If empty, title is not clickable. */
  @property({ type: String }) homepageLink = "";

  /** Toggles the NYS brand mark */
  @property({ type: Boolean }) nysLogo = false;

  /** Internal state to track mobile menu open/closed status. */
  @state() private _isMobileMenuOpen = false;

  /** Internal state to track if any navigation links are present in the slot. */
  @state() private _hasLinkContent = false;

  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */

  connectedCallback() {
    // NysElement assigns an auto-generated id (prefixed with the
    // element's localName) when the consumer does not supply one. The banner
    // landmark intentionally stays on the inner <header> element and the
    // navigation landmark on the inner <nav> elements, so this component keeps
    // defaultRole = null and never moves a landmark role onto the host.
    super.connectedCallback();
  }

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    slot?.addEventListener("slotchange", () => this._handleListSlotChange());
    this._handleListSlotChange(); // run once at startup

    this._listenLinkClicks();
    document.addEventListener("click", this._boundClickOutside);
    document.addEventListener("keydown", this._boundKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this._boundClickOutside);
    document.removeEventListener("keydown", this._boundKeyDown);
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _highlightActiveLink(container: HTMLElement) {
    const links = Array.from(container.querySelectorAll("a"));
    const currentUrl = window.location.pathname.replace(/\/+$/, "") || "/";

    let bestMatch: { li: HTMLElement | null; length: number } = {
      li: null,
      length: 0,
    };

    links.forEach((a) => {
      const linkPath = this._normalizePath(a.getAttribute("href"));
      if (!linkPath) return;

      if (linkPath === "/" && currentUrl === "/") {
        bestMatch = { li: a.closest("li"), length: 1 };
      } else if (
        currentUrl.startsWith(linkPath) &&
        linkPath.length > bestMatch.length
      ) {
        bestMatch = {
          li: a.closest("li"),
          length: linkPath.length,
        };
      }
    });

    // Clear all previous actives (visual class + programmatic current state)
    links.forEach((a) => {
      a.closest("li")?.classList.remove("active");
      a.removeAttribute("aria-current");
    });

    // Apply best match. aria-current="page" communicates the current page to
    // assistive tech so the active state is not conveyed by color/style alone
    // (WCAG 1.3.1 Info and Relationships, 1.4.1 Use of Color).
    bestMatch.li?.classList.add("active");
    bestMatch.li?.querySelector("a")?.setAttribute("aria-current", "page");
  }

  // Gets called when the slot content changes and directly appends the slotted elements into the shadow DOM
  private async _handleListSlotChange() {
    const slot = this.shadowRoot?.querySelector(
      'slot:not([name="user-actions"])',
    ) as HTMLSlotElement | null;

    if (!slot) return;

    const assignedNodes = slot
      .assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE) as Element[]; // Filter to elements only

    // Get the containers to append the slotted elements
    const containers = [
      this.shadowRoot?.querySelector(".nys-globalheader__content"),
      this.shadowRoot?.querySelector(".nys-globalheader__content-mobile"),
    ] as (HTMLElement | null)[];

    // If any container is missing, abort
    if (containers.some((c) => !c)) return;

    // Rebuild each container with cloned slotted elements
    for (const container of containers) {
      container!.innerHTML = "";
      assignedNodes.forEach((node) => {
        container!.appendChild(node.cloneNode(true));
      });
      this._highlightActiveLink(container!);
    }

    // Update reactive state AFTER the current update cycle has fully completed
    await this.updateComplete;
    this._hasLinkContent = assignedNodes.length > 0;
  }

  // Normalize paths so that links like "name", "/name/", and "/" match window.location.pathname.
  // This ensures consistent active-link behavior regardless of how hrefs are written.
  private _normalizePath(href: string | null): string | null {
    if (!href) return null;

    try {
      const url = new URL(href, window.location.origin);
      return url.pathname.replace(/\/+$/, "") || "/";
    } catch {
      return null;
    }
  }

  private _toggleMobileMenu() {
    this._isMobileMenuOpen = !this._isMobileMenuOpen;
  }

  // Listens for click events on links to mark them active
  private _listenLinkClicks() {
    const containers = this.shadowRoot?.querySelectorAll(
      ".nys-globalheader__content, .nys-globalheader__content-mobile",
    );

    containers?.forEach((container) => {
      container?.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const ahref = target.closest("a");

        if (!ahref) return;

        // Clear all existing active <li> (visual class + aria-current)
        container.querySelectorAll("li.active").forEach((li) => {
          li.classList.remove("active");
          li.querySelector("a")?.removeAttribute("aria-current");
        });

        // Set active on the clicked link's <li>
        const li = ahref.closest("li");
        if (li) {
          li.classList.add("active");
          ahref.setAttribute("aria-current", "page");
        }
      });
    });
  }

  private _renderBrandMark() {
    return this.nysLogo ? html`${this._getNysLogo()}` : "";
  }

  private _getNysLogo() {
    if (!nysLogo) return null;

    // Parse the SVG string into an actual SVG DOM element
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(nysLogo, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
    svgElement.id = "nys-unavheader__logo";

    return svgElement;
  }

  private _boundClickOutside = (event: Event) => {
    if (!this._isMobileMenuOpen) return;

    const path = event.composedPath();
    if (!path.includes(this)) {
      this._isMobileMenuOpen = false;
    }
  };

  private _boundKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !this._isMobileMenuOpen) return;
    if (window.matchMedia("pointer: coarse").matches) return; // skip touch devices

    this._isMobileMenuOpen = false;
  };

  render() {
    return html`
      <header class="nys-globalheader">
        <div class="nys-globalheader__main-container">
          ${this._hasLinkContent
            ? html` <div class="nys-globalheader__button-container">
                <button
                  type="button"
                  class="nys-globalheader__mobile-menu-button"
                  aria-expanded="${this._isMobileMenuOpen}"
                  aria-controls="${this.id}-mobile-nav"
                  @click="${this._toggleMobileMenu}"
                >
                  <nys-icon
                    name="${this._isMobileMenuOpen ? "close" : "menu"}"
                    size="32"
                    aria-hidden="true"
                  ></nys-icon>
                  <span class="nys-globalheader__mobile-menu-button-text"
                    >${this._isMobileMenuOpen ? "CLOSE" : "MENU"}</span
                  >
                </button>
              </div>`
            : ""}
          ${this._renderBrandMark()}
          ${!this.homepageLink?.trim()
            ? html`
                <div class="nys-globalheader__name-container">
                  ${this.appName?.trim().length > 0
                    ? html`<div
                        class="nys-globalheader__appName nys-globalheader__name"
                      >
                        ${this.appName}
                      </div> `
                    : ""}
                  ${this.agencyName?.trim().length > 0
                    ? html`<div
                        class="nys-globalheader__agencyName nys-globalheader__name ${this.appName?.trim()
                          .length > 0
                          ? ""
                          : "main"}"
                      >
                        ${this.agencyName}
                      </div> `
                    : ""}
                </div>
              `
            : html`<a
                class="nys-globalheader__name-container-link"
                href=${this.homepageLink?.trim()}
              >
                <div class="nys-globalheader__name-container">
                  ${this.appName?.trim().length > 0
                    ? html`<div
                        class="nys-globalheader__appName nys-globalheader__name"
                      >
                        ${this.appName}
                      </div> `
                    : ""}
                  ${this.agencyName?.trim().length > 0
                    ? html`<div
                        class="nys-globalheader__agencyName nys-globalheader__name ${this.appName?.trim()
                          .length > 0
                          ? ""
                          : "main"}"
                      >
                        ${this.agencyName}
                      </div> `
                    : ""}
                </div>
              </a>`}
          <nav
            class="nys-globalheader__content"
            aria-label="Primary"
            ?hidden="${!this._hasLinkContent}"
          ></nav>
          <slot
            style="display: none;"
            @slotchange="${this._handleListSlotChange}"
          ></slot>
          <slot name="user-actions"></slot>
        </div>
      </header>
      <nav
        id="${this.id}-mobile-nav"
        class="nys-globalheader__content-mobile ${this._isMobileMenuOpen
          ? ""
          : "close"}"
        aria-label="Primary mobile"
        ?hidden="${!this._hasLinkContent}"
      ></nav>
    `;
  }
}

if (!customElements.get("nys-globalheader")) {
  customElements.define("nys-globalheader", NysGlobalHeader);
}

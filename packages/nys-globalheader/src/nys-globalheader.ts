import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-globalheader.scss?inline";
import nysLogo from "./nys-global.logo";

/**
 * `<nys-globalheader>` renders a New York State–style global header.
 * Supports an optional app name, agency name, homepage link, and slotted navigation elements.
 * Highlights active links based on current URL and handles a mobile menu toggle.
 */
export class NysGlobalHeader extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String }) appName = "";
  @property({ type: String }) agencyName = "";
  @property({ type: String }) homepageLink = "";
  @property({ type: Boolean }) showlogo = false;
  @state() private isMobileMenuOpen = false;

  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    slot?.addEventListener("slotchange", () => this._handleListSlotChange());
    this._handleListSlotChange(); // run once at startup

    this._listenLinkClicks();
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _getNysLogo() {
    if (!nysLogo) return null;

    // Parse the SVG string into an actual SVG DOM element
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(nysLogo, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    return svgElement;
  }

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

    // Clear all previous actives
    links.forEach((a) => a.closest("li")?.classList.remove("active"));

    // Apply best match
    bestMatch.li?.classList.add("active");
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

    await Promise.resolve(); // Wait for current update cycle to complete before modifying reactive state (solves the lit issue "scheduled an update")

    // Get the containers to append the slotted elements
    const container = this.shadowRoot?.querySelector(
      ".nys-globalheader__content",
    ) as HTMLElement | null;

    const containerMobile = this.shadowRoot?.querySelector(
      ".nys-globalheader__content-mobile",
    ) as HTMLElement | null;

    if (!container || !containerMobile) return;

    // Clear existing children in the container
    container.innerHTML = "";
    containerMobile.innerHTML = "";

    // Clone and append slotted elements into the shadow DOM container
    assignedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        // need to clone the node because cannot have same node in two places in DOM
        const nodeInline = node.cloneNode(true) as HTMLElement;
        const nodeMobile = node.cloneNode(true) as HTMLElement;

        container.appendChild(nodeInline);
        containerMobile.appendChild(nodeMobile);
      }
    });

    // Highlight active links AFTER DOM is finalized
    this._highlightActiveLink(container);
    this._highlightActiveLink(containerMobile);
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
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
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

        // Clear all existing active <li>
        container
          .querySelectorAll("li.active")
          .forEach((li) => li.classList.remove("active"));

        // Set active on the clicked link's <li>
        const li = ahref.closest("li");
        if (li) li.classList.add("active");
      });
    });
  }

  render() {
    return html`
      <header class="nys-globalheader">
        <div class="nys-globalheader__main-container">
          <div class="nys-globalheader__button-container">
            <button
              class="nys-globalheader__mobile-menu-button"
              @click="${this._toggleMobileMenu}"
            >
              <nys-icon
                name="${this.isMobileMenuOpen ? "close" : "menu"}"
                size="32"
                label="${this.isMobileMenuOpen ? "close" : "menu"} icon"
              ></nys-icon>
              <span class="nys-globalheader__mobile-menu-button-text"
                >${this.isMobileMenuOpen ? "CLOSE" : "MENU"}</span
              >
            </button>
          </div>
          ${
            this.showlogo
              ? html`<a
                  href="https://www.ny.gov"
                  id="nys-globalheader__logolink"
                  aria-label="Visit the NY.gov homepage"
                >
                  <div class="nys-globalheader__logo">
                    ${this._getNysLogo()}
                  </div>
                </a>`
              : ""
          }
          </a>
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
          <div class="nys-globalheader__content"></div>
          <slot
            style="display: none;"
            @slotchange="${this._handleListSlotChange}"
          ></slot>
          <slot name="user-actions"></slot>
        </div>
      </header>
      <div
        class="nys-globalheader__content-mobile ${this.isMobileMenuOpen
          ? ""
          : "close"}"
      ></div>
    `;
  }
}

if (!customElements.get("nys-globalheader")) {
  customElements.define("nys-globalheader", NysGlobalHeader);
}

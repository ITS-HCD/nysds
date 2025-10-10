import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-globalheader.styles";

export class NysGlobalHeader extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) appName = "";
  @property({ type: String }) agencyName = "";
  @property({ type: String }) homepageLink = "";
  @state() private slotHasContent = true;
  @state() private isMobileMenuOpen = false;

  /**************** Lifecycle Methods ****************/

  firstUpdated() {
    // Check for slot content after rendering
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    slot?.addEventListener("slotchange", () => this._handleSlotChange());
    this._handleSlotChange(); // run once at startup

    this._activateLinkOnClick();
    this._enableDropdownMenus();
  }

  /******************** Functions ********************/
  /**
   * Handles when the slot content changes and rebuilds
   * the global header's desktop and mobile menus.
   */
  private async _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    if (!slot) return;

    const assignedNodes = slot
      ?.assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE) as Element[]; // Filter to elements only

    await Promise.resolve(); // Wait for current update cycle to complete before modifying reactive state (solves the lit issue "scheduled an update")

    this.slotHasContent = assignedNodes.length > 0;

    const container = this.shadowRoot?.querySelector(
      ".nys-globalheader__content",
    );
    const containerMobile = this.shadowRoot?.querySelector(
      ".nys-globalheader__content-mobile",
    );
    if (!container || !containerMobile) return;

    this._clearContainers(container, containerMobile);

    const currentUrl = this._normalizePath(
      window.location.pathname + window.location.hash,
    );

    if (!currentUrl) return;

    // Clone and append slotted elements into the shadow DOM container
    assignedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const cleanNode = node.cloneNode(true) as HTMLElement;
        const cleanNodeMobile = node.cloneNode(true) as HTMLElement;

        this._highlightActiveLink(cleanNode, currentUrl);
        this._highlightActiveLink(cleanNodeMobile, currentUrl);

        container.appendChild(cleanNode);
        containerMobile.appendChild(cleanNodeMobile);
        node.remove(); // Remove from light DOM to avoid duplication
      }
    });
  }
  
  /** Removes all children from containers */
  private _clearContainers(...containers: (Element | null)[]) {
    containers.forEach((container) => {
      if (container) container.innerHTML = "";
    });
  }

  /**
   * Highlights the most relevant link based on the current URL.
   * Uses the "longest prefix match" rule.
   */
  private _highlightActiveLink(node: HTMLElement, currentUrl: string) {
    const links = Array.from(node.querySelectorAll("a"));
    let bestMatch: { li: HTMLElement | null; length: number } = {
      li: null,
      length: 0,
    };

    links.forEach((a) => {
      const href = a.getAttribute("href");
      const linkPath = this._normalizePath(href);
      if (!linkPath) return;

      if (linkPath === "/" && currentUrl === "/") {
        bestMatch = { li: a.closest("li"), length: 1 };
      } else if (
        currentUrl.startsWith(linkPath) &&
        linkPath.length > bestMatch.length
      ) {
        bestMatch = { li: a.closest("li"), length: linkPath.length };
      }
    });

    // Clear all old actives
    links.forEach((a) => a.closest("li")?.classList.remove("active"));

    // Set best match
    bestMatch.li?.classList.add("active");
  }

  // Normalize paths so that links like "name", "/name/", and "/" match window.location.pathname.
  // This ensures consistent active-link behavior regardless of how hrefs are written.
  private _normalizePath(path: string | null) {
    if (!path) return;

    // Checks path always starts with "/"
    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    // Strip trailing slash except for root "/"
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }

    return path.toLowerCase();
  }

  private _toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  /**
   * Sets up client-side link click handling to prevent full page reloads.
   * Ensures that only the clicked link's <li> is marked as active in both
   * desktop and mobile navigation menus.
   */
  private _activateLinkOnClick() {
    const containers = this.shadowRoot?.querySelectorAll(
      ".nys-globalheader__content, .nys-globalheader__content-mobile",
    );

    containers?.forEach((container) => {
      container?.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const a = target.closest("a");

        if (!a) return;

        // Clear all existing active <li>
        container
          .querySelectorAll("li.active")
          .forEach((li) => li.classList.remove("active"));

        // Set active on the clicked link's <li>
        const li = a.closest("li");
        if (li) {
          li.classList.add("active");
        }
      });
    });
  }

  /**
   * Handles dropdown button toggling for submenus
   */
  private _enableDropdownMenus() {
    const containers = this.shadowRoot?.querySelectorAll(
      ".nys-globalheader__content, .nys-globalheader__content-mobile",
    );

    containers?.forEach((container) => {
      container?.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const button = target.closest("button");

        if (!button) return;

        if (button.closest("li")?.classList.contains("active")) {
          button.closest("li")?.classList.remove("active");
        } else {
          // Clear all existing active <li> buttons  and dropdowns
          container
            .querySelectorAll("li.active")
            .forEach((li) => li.classList.remove("active"));

          // CSS will take care of showing the subLink container based on active button
          button.closest("li")?.classList.add("active");
        }
      });
    });
  }

  render() {
    return html`
      <header class="nys-globalheader">
        <div class="nys-globalheader__main-container">
          ${this.slotHasContent
            ? html` <div class="nys-globalheader__button-container">
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
              </div>`
            : ""}
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
          ${this.slotHasContent
            ? html`<div class="nys-globalheader__content">
                <slot
                  style="display: hidden"
                  @slotchange="${this._handleSlotChange}"
                ></slot>
              </div>`
            : ""}
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

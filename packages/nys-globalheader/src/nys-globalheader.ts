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

    this._listenLinkClicks();
  }

  /******************** Functions ********************/
  // Gets called when the slot content changes and directly appends the slotted elements into the shadow DOM
  private async _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    if (!slot) return;

    const assignedNodes = slot
      ?.assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE) as Element[]; // Filter to elements only

    await Promise.resolve(); // Wait for current update cycle to complete before modifying reactive state (solves the lit issue "scheduled an update")

    // Update slotHasContent for styling content
    this.slotHasContent = assignedNodes.length > 0;

    // Get the container to append the slotted elements
    const container = this.shadowRoot?.querySelector(
      ".nys-globalheader__content",
    );
    const containerMobile = this.shadowRoot?.querySelector(
      ".nys-globalheader__content-mobile",
    );

    if (container && containerMobile) {
      // Clear existing children in the container
      container.innerHTML = "";
      containerMobile.innerHTML = "";

      const currentUrl = this._normalizePath(
        window.location.pathname + window.location.hash,
      );

      // Clone and append slotted elements into the shadow DOM container
      assignedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const cleanNode = node.cloneNode(true) as HTMLElement;
          const cleanNodeMobile = node.cloneNode(true) as HTMLElement;

          // Remove <script>, <iframe>, <object>, and any potentially dangerous elements XSS
          const dangerousTags = ["script", "iframe", "object", "embed, img"];
          dangerousTags.forEach((tag) => {
            (cleanNode as Element)
              .querySelectorAll(tag)
              .forEach((element) => element.remove());
          });

          /**
           * Get all user slotted ahref links and for each link, determine the best matching link via the pattern of
           * prioritize the link with the longest match.
           * @param node
           */
          const highlightActiveLink = (node: HTMLElement) => {
            const links = Array.from(node.querySelectorAll("a"));

            // Because we can only have one active link at all times, we
            let bestMatch: { li: HTMLElement | null; length: number } = {
              li: null,
              length: 0,
            };

            links.forEach((a) => {
              const hrefAttr = a.getAttribute("href");
              const linkPath = this._normalizePath(hrefAttr);

              if (!linkPath) return;

              // Exact homepage match
              if (linkPath === "/" && currentUrl === "/") {
                bestMatch = { li: a.closest("li"), length: 1 };
              } else if (
                currentUrl?.startsWith(linkPath) &&
                linkPath.length > bestMatch.length
              ) {
                bestMatch = { li: a.closest("li"), length: linkPath.length };
              }

              // Clear old actives
              links.forEach((a) => a.closest("li")?.classList.remove("active"));

              // Set the best matched link to active
              bestMatch.li?.classList.add("active");
            });
          };

          highlightActiveLink(cleanNode);
          highlightActiveLink(cleanNodeMobile);

          container.appendChild(cleanNode);
          containerMobile.appendChild(cleanNodeMobile);
          node.remove(); // Remove from light DOM to avoid duplication
        }
      });
    }
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
   * Handles client-side navigation when links are clicked (no full page refresh).
   */
  // Ensures only the clicked link's <li> is marked active in both desktop and mobile menus.
  private _listenLinkClicks() {
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
        if (li) li.classList.add("active");
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

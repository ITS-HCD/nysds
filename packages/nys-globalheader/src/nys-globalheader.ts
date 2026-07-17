import { LitElement, html, unsafeCSS } from "lit";
import nysLogo from "./nys-brand.logo";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-globalheader.scss?inline";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-globalheader.light.scss?inline";

let _lightSheet: CSSStyleSheet | null = null;

// Injects the lightDOM styling for the scss for
// styling CSS into the adopted/constructed stylesheet.
function adoptLightStyles() {
  if (_lightSheet || typeof document === "undefined") return;
  _lightSheet = new CSSStyleSheet();
  _lightSheet.replaceSync(lightStyles);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, _lightSheet];
}

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
 * @slot user-actions - User-account controls (e.g. profile link, settings, log-out button) shown in the header.
 *
 *
 * @example Basic
 * ```html
 * <nys-globalheader appName="User Registration Form" agencyName="Office of Information Technology Services"></nys-globalheader>
 * ```
 *
 * @example Homepage Link
 * ```html
 * <nys-globalheader
 *   agencyName="Office of Information Technology Services"
 *   homepageLink="https://its.ny.gov"
 * ></nys-globalheader>
 * ```
 *
 * @example Only Agency Name
 * ```html
 * <nys-globalheader agencyName="Office of Information Technology Services"></nys-globalheader>
 * ```
 *
 * @example Only App Name
 * ```html
 * <nys-globalheader appName="User Registration Form"></nys-globalheader>
 * ```
 *
 * @example With Links
 * ```html
 * <nys-globalheader agencyName="Office of Information Technology Services">
 *   <ul>
 *     <li><a href="https://its.ny.gov/services">Services</a></li>
 *     <li><a href="https://its.ny.gov/get-help">Help Center</a></li>
 *     <li><a href="https://its.ny.gov/cybersecurity">Cybersecurity</a></li>
 *     <li><a href="https://its.ny.gov/policies">Policies and Laws</a></li>
 *     <li><a href="https://its.ny.gov/procurement">Procurement</a></li>
 *     <li><a href="https://its.ny.gov/about-us">About Us</a></li>
 *   </ul>
 * </nys-globalheader>
 * ```
 * @example User Actions
 * ```html
 * <nys-globalheader agencyName="Office of Information Technology Services">
 *   <nys-button id="my-action-slot" slot="user-actions" label="Log out">
 *     <nys-avatar
 *       slot="prefix-icon"
 *       ariaLabel="User avatar"
 *       initials="NY"
 *     ></nys-avatar>
 *   </nys-button>
 * </nys-globalheader>
 * <nys-dropdownmenu id="dropdownmenu" for="my-action-slot">
 *   <nys-dropdownmenuitem label="Profile" href="/profile"></nys-dropdownmenuitem>
 *   <nys-dropdownmenuitem label="Repositories & Github Pages" href="/repos"></nys-dropdownmenuitem>
 *   <nys-dropdownmenuitem label="Organizations" href="/organizations" disabled></nys-dropdownmenuitem>
 *   <nys-dropdownmenuitem label="Sign out" href="/logout"></nys-dropdownmenuitem>
 * </nys-dropdownmenu>
 * ```
 *
 * @example With NYS Logo
 * ```html
 * <nys-globalheader nysLogo appName="Admin Dashboard"></nys-globalheader>
 * ```
 */

export class NysGlobalHeader extends LitElement {
  static styles = unsafeCSS(styles);

  /** Application name displayed prominently. */
  @property({ type: String }) appName = "";

  /** Agency name displayed below app name (or as main title if no appName). */
  @property({ type: String }) agencyName = "";

  /** URL for the header title link. If empty, title is not clickable. */
  @property({ type: String }) homepageLink = "";

  /**
   * Displays the NYS brand mark in the header. Off by default.
   *
   * Enable only for internal, state-employee (back-office) applications that omit
   * `nys-unavheader`. Any resident-facing app — even one requiring login — should
   * keep `nys-unavheader` for trust and leave this off.
   */
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
    super.connectedCallback();

    adoptLightStyles();
  }

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    slot?.addEventListener("slotchange", () => this._handleListSlotChange());
    this._handleListSlotChange(); // run once at startup

    // this._listenLinkClicks();
    this._navSlot?.addEventListener("click", this._boundLinkClick);
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

  private get _navSlot(): HTMLSlotElement | null {
    return (
      this.shadowRoot?.querySelector('slot:not([name="user-actions"])') ?? null
    );
  }

  private _getAssignedLinks(): HTMLAnchorElement[] {
    const slot = this._navSlot;
    if (!slot) return [];

    return slot
      .assignedElements({ flatten: true })
      .flatMap((el) => Array.from(el.querySelectorAll<HTMLAnchorElement>("a")));
  }

  private _highlightActiveLink() {
    const links = this._getAssignedLinks();

    const ariaCurrentExist = links.some((a) => a.hasAttribute("aria-current"));
    if (ariaCurrentExist) {
      links.forEach((a) => {
        a.closest("li")?.classList.toggle(
          "active",
          a.hasAttribute("aria-current"),
        );
      });
      return;
    }

    const currentUrl = window.location.pathname.replace(/\/+$/, "") || "/";

    let bestMatch: { a: HTMLAnchorElement | null; length: number } = {
      a: null,
      length: 0,
    };

    links.forEach((a) => {
      const linkPath = this._normalizePath(a.getAttribute("href"));
      if (!linkPath) return;

      if (linkPath === "/" && currentUrl === "/") {
        bestMatch = { a, length: 1 };
      } else if (
        currentUrl.startsWith(linkPath) &&
        linkPath.length > bestMatch.length
      ) {
        bestMatch = { a, length: linkPath.length };
      }
    });

    // Apply "active" styling to best match link
    links.forEach((a) => {
      const isMatch = a === bestMatch.a;
      a.closest("li")?.classList.toggle("active", isMatch);
      isMatch
        ? a.setAttribute("aria-current", "page")
        : a.removeAttribute("aria-current");
    });
  }

  // Gets called when the slot content changes and directly appends the slotted elements into the shadow DOM
  private async _handleListSlotChange() {
    const links = this._getAssignedLinks();
    this._highlightActiveLink();

    await this.updateComplete;
    this._hasLinkContent = links.length > 0;
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

  private _setMobileMenuOpen(open: boolean) {
    this._isMobileMenuOpen = open;
    this.toggleAttribute("mobile-menu-open", open);
  }

  private _toggleMobileMenu() {
    this._setMobileMenuOpen(!this._isMobileMenuOpen);
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
      this._setMobileMenuOpen(false);
    }
  };

  private _boundLinkClick = (event: Event) => {
    const links = this._getAssignedLinks();
    if (links.some((a) => a.hasAttribute("aria-current"))) return; // User set "aria-current" automatically takes priority

    const ahref = (event.target as HTMLElement).closest("a");
    if (!ahref) return;

    links.forEach((a) => {
      const isMatch = a === ahref;
      a.closest("li")?.classList.toggle("active", isMatch);
      isMatch
        ? a.setAttribute("aria-current", "page")
        : a.removeAttribute("aria-current");
    });
  };

  private _boundKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !this._isMobileMenuOpen) return;
    if (window.matchMedia("pointer: coarse").matches) return; // skip touch devices

    this._setMobileMenuOpen(false);
  };

  render() {
    return html`
      <header class="nys-globalheader">
        <div class="nys-globalheader__main-container">
          ${this._hasLinkContent
            ? html` <div class="nys-globalheader__button-container">
                <button
                  class="nys-globalheader__mobile-menu-button"
                  @click="${this._toggleMobileMenu}"
                >
                  <nys-icon
                    name="${this._isMobileMenuOpen ? "close" : "menu"}"
                    size="32"
                    label="${this._isMobileMenuOpen ? "close" : "menu"} icon"
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
          <slot @slotchange="${this._handleListSlotChange}"></slot>
          <slot name="user-actions"></slot>
        </div>
      </header>
    `;
  }
}

if (!customElements.get("nys-globalheader")) {
  customElements.define("nys-globalheader", NysGlobalHeader);
}

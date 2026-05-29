import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import nysLogo from "./nys-unav.logo";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-unavheader.scss?inline";

/**
 * Universal NYS header with trust indicator, logo, site search, and 14-language translation. Required on all NYS sites.
 * Provides consistent identification of legitimate NY.gov sites and enables search/translation across all state digital properties.
 *
 * Place as the first element in `<body>`, before all other page content. Includes:
 * - Trust bar with "official site" indicator and details about ny.gov legitimacy and HTTPS security.
 * - NY.gov logo (links to https://www.ny.gov).
 * - Site search (default: searches ny.gov via Google Search Appliance; customize with `searchUrl`).
 * - Language translation dropdown (supports 14 languages; hides via Smartling subdomains or custom URLs).
 *
 * Complies with NYS Information Technology Standard (NYS-S16-001) on universal web navigation.
 *
 * ## When to use
 * - Required on ALL New York State digital products and websites.
 * - Placed only at the top of the page as the topmost header element.
 * - Conveys that this is a legitimate ny.gov site.
 *
 * ## When not to use
 * - Do not place anywhere other than the top of the page.
 * - Do not modify, remove, or customize header links (except search URL and language options).
 * - Do not duplicate—use exactly once per page.
 *
 * ## Features
 * - **Trust bar** – Expandable panel explaining official site indicators and HTTPS security.
 * - **Search** – Searches ny.gov by default; customize with `searchUrl` prop (include query param).
 * - **Translation** – 14-language dropdown (English, Spanish, Chinese, Yiddish, Russian, Bengali, Korean, Haitian, Italian, Arabic, Polish, French, Urdu).
 * - **Responsive design** – Desktop shows "Translate" button; mobile shows icon. Search adapts to screen size.
 *
 * ## Customization options
 * - `hideSearch` – Removes search if your site has its own search.
 * - `hideTranslate` – Removes translation if your site uses a different translation service.
 * - `searchUrl` – Custom search endpoint. Example: `"https://example.com/search?q="` (must include query param).
 * - `languages` – Override language list (default: 14 languages with Smartling subdomain redirect).
 *
 * @accessibility
 * - Semantic `<header>` element ensures assistive technology recognition.
 * - Trust bar button: `role="button"`, `aria-expanded`, descriptive `aria-label`.
 * - All links and buttons are keyboard-navigable via Tab.
 * - Language dropdown announces current language and list on focus.
 * - Search input announces field purpose and keyboard shortcuts (Enter to submit, Escape to dismiss).
 * - Visual focus indicators meet WCAG 2.2 AA standards.
 * - All text has sufficient color contrast (4.5:1 minimum).
 * - Icons have text labels or `aria-label` attributes.
 *
 * ## Events
 * - `nys-language-select` – Fires when user selects a language. Detail: `{ language }`. Prevent default to suppress navigation.
 * - `nys-search-submit` – Fires when user submits search. Detail: `{ query }`. Prevent default to suppress navigation.
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Place it only at the top of the page as the first header element.
 * - Toggle search (`hideSearch`) and translate (`hideTranslate`) on/off depending on your needs.
 *
 * **Don't:**
 * - Place it anywhere other than the top of the page.
 * - Modify the universal header.
 *
 * @summary Universal NYS header with trust bar, search, and 14-language translation. Required site-wide.
 * @element nys-unavheader
 *
 * @example Standard usage
 * ```html
 * <body>
 *   <nys-unavheader></nys-unavheader>
 *   <nys-globalheader>...</nys-globalheader>
 *   <main id="main-content">...</main>
 * </body>
 * ```
 *
 * @example Without search (your site has its own)
 * ```html
 * <nys-unavheader hideSearch></nys-unavheader>
 * ```
 *
 * @example Custom search URL for site-specific search
 * ```html
 * <nys-unavheader searchUrl="https://example.com/search?q="></nys-unavheader>
 * ```
 *
 * @example Without translation (using different service)
 * ```html
 * <nys-unavheader hideTranslate></nys-unavheader>
 * ```
 *
 * ## Dependencies
 *
 * This component depends on the following NYS Design System components:
 *
 *   - `nys-icon`
 *   - `nys-button`
 *   - `nys-textinput`
 */

interface Language {
  code: string;
  label: string;
  url?: string;
}

export class NysUnavHeader extends LitElement {
  static styles = unsafeCSS(styles);

  /** Internal: Whether trust bar panel is expanded. */
  @property({ type: Boolean }) trustbarVisible = false;

  /** Internal: Whether search dropdown is visible (mobile). */
  @property({ type: Boolean }) searchDropdownVisible = false;

  /** Internal: Whether language dropdown is visible. */
  @property({ type: Boolean }) languageVisible = false;

  /** Internal: Whether search input is focused. */
  @property({ type: Boolean }) isSearchFocused = false;

  /** Hides the translation dropdown. */
  @property({ type: Boolean }) hideTranslate = false;

  /** Hides the search functionality. */
  @property({ type: Boolean }) hideSearch = false;

  /** The URL endpoint of the search, make sure to include the query param. */
  @property({ type: String }) searchUrl = "";

  /** The list of languages this site can be translated to, default to use Smartling */
  @property({ type: Array })
  languages: Language[] = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "zh", label: "中文" },
    { code: "zh-traditional", label: "繁體中文" },
    { code: "yi", label: "יידיש" },
    { code: "ru", label: "Русский" },
    { code: "bn", label: "বাংলা" },
    { code: "ko", label: "한국어" },
    { code: "ht", label: "Kreyòl Ayisyen" },
    { code: "it", label: "Italiano" },
    { code: "ar", label: "العربية" },
    { code: "pl", label: "Polski" },
    { code: "fr", label: "Français" },
    { code: "ur", label: "اردو" },
  ];

  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
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

  private _toggleTrustbar(clickID?: string) {
    this.trustbarVisible = !this.trustbarVisible;

    if (this.trustbarVisible) {
      this.languageVisible = false;
      this.searchDropdownVisible = false;
    }

    if (clickID === "no focus") return;

    const shouldMoveFocus =
      clickID === "nys-unavheader__know--inline" || !clickID;

    if (shouldMoveFocus) {
      const targetId = this.trustbarVisible
        ? "nys-unavheader__closetrustbar"
        : "nys-unavheader__know--inline";

      this.updateComplete.then(() => {
        const target = this.shadowRoot?.getElementById(targetId);
        target?.focus();
      });
    }
  }

  private _toggleLanguageList() {
    this.languageVisible = !this.languageVisible;
    if (this.languageVisible) {
      this.trustbarVisible = false;
      this.searchDropdownVisible = false;
    }
  }

  private _toggleSearchDropdown() {
    this.searchDropdownVisible = !this.searchDropdownVisible;
    if (this.searchDropdownVisible) {
      this.trustbarVisible = false;
      this.languageVisible = false;
    }
  }

  private _handleLanguageSelect(language: Language) {
    this.languageVisible = false;

    const event = new CustomEvent("nys-language-select", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { language },
    });

    this.dispatchEvent(event);

    if (!event.defaultPrevented) {
      if (language.url) {
        // Use the provided URL override
        window.location.href = language.url;
      } else {
        // Default behavior: redirect to Smartling subdomain
        const subdomain = language.code === "en" ? "" : `${language.code}.`;
        window.location.href = `https://${subdomain}${window.location.hostname}`;
      }
    }
  }

  private _handleSearchFocus() {
    this.isSearchFocused = true;
    this.trustbarVisible = false;
    this.languageVisible = false;
  }

  private _handleSearchBlur() {
    this.isSearchFocused = false;
  }

  private _handleSearchKeyup(e: KeyboardEvent) {
    if (e.key === "Escape") {
      this._handleSearchBlur();
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === "Enter") {
      // Handle search
      const searchValue = (e.target as HTMLInputElement).value?.trim();
      if (searchValue !== "") this._handleSearch(searchValue);
    }
  }

  private _handleSearchButton(searchID: string) {
    const searchInput = this.shadowRoot?.getElementById(
      searchID,
    ) as HTMLInputElement;
    const searchValue = searchInput.value?.trim();
    if (searchValue !== "") this._handleSearch(searchValue);
  }

  private _handleSearch(searchValue: string) {
    const event = new CustomEvent("nys-search-submit", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { query: searchValue },
    });

    this.dispatchEvent(event);

    if (!event.defaultPrevented) {
      if (this.searchUrl) {
        // Custom search URL
        window.location.href = `${this.searchUrl}${encodeURIComponent(searchValue)}`;
      } else {
        // Default Google Search Appliance
        window.location.href = `https://search.its.ny.gov/search/search.html?q=${encodeURIComponent(searchValue)}+inurl:${window.location.hostname}&site=default_collection`;
      }
    }
  }

  render() {
    return html`
      <header class="nys-unavheader">
        <div
          class="nys-unavheader__trustbar wrapper"
          @click="${(e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Ignore clicks that originated within a nys-button
            if (target.closest("nys-button")) return;

            // Only handle direct wrapper clicks (outside of buttons)
            this._toggleTrustbar("no focus");
          }}"
        >
          <div class="content">
            <label id="nys-unavheader__official"
              >An official website of New York State</label
            >
            <nys-button
              id="nys-unavheader__know"
              label="Here's how you know"
              variant="ghost"
              size="sm"
              suffixIcon="slotted"
              @nys-click="${(e: CustomEvent) => {
                e.preventDefault();
                e.stopPropagation();
                this._toggleTrustbar("nys-unavheader__know");
              }}"
            >
              <nys-icon
                slot="suffix-icon"
                size="12"
                name="${this.trustbarVisible ? "chevron_up" : "chevron_down"}"
              ></nys-icon>
            </nys-button>
          </div>
        </div>
        <div
          class="nys-unavheader__trustpanel wrapper ${this.trustbarVisible
            ? "show"
            : "hide"}"
        >
          <div class="nys-unavheader__trustpanel content">
            <nys-button
              id="nys-unavheader__closetrustbar"
              class="nys-unavheader__iconbutton"
              variant="ghost"
              circle
              icon="close"
              size="sm"
              ariaLabel="Close this notice"
              aria-expanded="${this.trustbarVisible}"
              @nys-click="${() =>
                this._toggleTrustbar("nys-unavheader__know--inline")}"
            ></nys-button>
            <div class="nys-unavheader__messagewrapper">
              <div
                class="nys-unavheader__trustcontentmessage"
                id="trust_official"
              >
                <nys-icon size="3xl" name="account_balance_filled"></nys-icon>
                <label><b>Official websites use ny.gov</b></label>
                <label
                  >A <b>ny.gov</b> website belongs to an official New York State
                  government organization.</label
                >
              </div>
              <div
                class="nys-unavheader__trustcontentmessage"
                id="trust_secure"
              >
                <nys-icon size="3xl" name="lock_filled"></nys-icon>
                <label><b>Secure ny.gov websites use HTTPS</b></label>
                <label
                  >A <b>lock icon</b> or <b>https://</b> means you've safely
                  connected to the ny.gov website. Share sensitive information
                  only on official, secure websites.</label
                >
              </div>
            </div>
          </div>
        </div>
        <div class="nys-unavheader__main wrapper" id="nys-universal-navigation">
          <div class="nys-unavheader__main content">
            <a
              href="https://www.ny.gov"
              id="nys-unavheader__logolink"
              aria-label="Visit the NY.gov homepage"
            >
              <div class="nys-unavheader__logo">${this._getNysLogo()}</div></a
            >
            <div class="nys-unavheader__trustbar inline">
              <label id="nys-unavheader__official"
                >An official website of New York State</label
              >
              <nys-button
                id="nys-unavheader__know--inline"
                label="Here's how you know"
                aria-controls="nys-unavheader__closetrustbar"
                aria-expanded="${this.trustbarVisible}"
                variant="ghost"
                size="sm"
                suffixIcon="slotted"
                @nys-click="${() =>
                  this._toggleTrustbar("nys-unavheader__know--inline")}"
              >
                <nys-icon
                  slot="suffix-icon"
                  size="12"
                  name="${this.trustbarVisible ? "chevron_up" : "chevron_down"}"
                ></nys-icon>
              </nys-button>
            </div>
            <div class="nys-unavheader__spacer"></div>
            ${!this.hideTranslate
              ? html`<div class="nys-unavheader__translatewrapper">
                  <nys-button
                    variant="ghost"
                    circle
                    icon="slotted"
                    ariaLabel="Translate"
                    aria-expanded="${this.languageVisible}"
                    id="nys-unavheader__translate--mobile"
                    class="nys-unavheader__iconbutton"
                    @nys-click=${this._toggleLanguageList}
                  >
                    <nys-icon
                      slot="circle-icon"
                      name="language"
                      size="16"
                    ></nys-icon>
                  </nys-button>
                  ${!this.isSearchFocused
                    ? html`
                        <nys-button
                          variant="ghost"
                          label="Translate"
                          aria-expanded="${this.languageVisible}"
                          size="sm"
                          prefixIcon="language"
                          suffixIcon=${this.languageVisible
                            ? "chevron_up"
                            : "chevron_down"}
                          id="nys-unavheader__translate--desktop"
                          @nys-click="${this._toggleLanguageList}"
                        ></nys-button>
                      `
                    : null}
                  <div
                    class="nys-unavheader__languagelist ${this.languageVisible
                      ? "show"
                      : "hide"}"
                  >
                    ${this.languages.map(
                      (lang) =>
                        html`<nys-button
                          variant="ghost"
                          fullWidth
                          label="${lang.label}"
                          class="nys-unavheader__languagelink"
                          @click="${() => this._handleLanguageSelect(lang)}"
                        ></nys-button>`,
                    )}
                  </div>
                </div>`
              : null}
            ${!this.hideSearch
              ? html`
                  <nys-button
                    variant="ghost"
                    circle
                    icon="search"
                    ariaLabel="Search"
                    aria-expanded="${this.searchDropdownVisible}"
                    id="nys-unavheader__searchbutton"
                    class="nys-unavheader__iconbutton"
                    @nys-click=${this._toggleSearchDropdown}
                  >
                    <nys-icon
                      slot="circle-icon"
                      name="search"
                      size="16"
                    ></nys-icon>
                  </nys-button>
                  <nys-textinput
                    class="nys-unavheader__search"
                    id="nys-unavheader__searchbar"
                    placeholder="Search"
                    type="search"
                    @focus="${this._handleSearchFocus}"
                    @blur="${this._handleSearchBlur}"
                    @keyup="${this._handleSearchKeyup}"
                  >
                    <nys-button
                      id="nys-unavheader__searchbar--button"
                      slot="endButton"
                      type="submit"
                      prefixIcon="search"
                      ariaLabel="Search"
                      @nys-click=${() => {
                        this._handleSearchButton("nys-unavheader__searchbar");
                      }}
                    ></nys-button>
                  </nys-textinput>
                `
              : null}
          </div>
        </div>
        <div
          class="nys-unavheader__searchdropdown wrapper ${this
            .searchDropdownVisible
            ? "show"
            : "hide"}"
        >
          <div class="content">
            <nys-textinput
              class="nys-unavheader__search"
              id="nys-unavheader__searchbardropdown"
              placeholder="Search"
              type="search"
              @focus="${this._handleSearchFocus}"
              @blur="${this._handleSearchBlur}"
              @keyup="${this._handleSearchKeyup}"
            >
              <nys-button
                id="nys-unavheader__searchbardropdown--button"
                slot="endButton"
                type="submit"
                prefixIcon="search"
                ariaLabel="Search"
                @nys-click=${() => {
                  this._handleSearchButton("nys-unavheader__searchbardropdown");
                }}
              ></nys-button
            ></nys-textinput>
          </div>
        </div>
      </header>
    `;
  }
}

if (!customElements.get("nys-unavheader")) {
  customElements.define("nys-unavheader", NysUnavHeader);
}

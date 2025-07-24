import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-unavheader.styles";
import nysLogo from "./nys-unav.logo";

export class NysUnavHeader extends LitElement {
  @property({ type: Boolean }) trustbarVisible = false;
  @property({ type: Boolean }) searchDropdownVisible = false;
  @property({ type: Boolean }) languageVisible = false;
  @property({ type: Boolean }) isSearchFocused = false;
  @property({ type: Boolean }) hideTranslate = false;
  @property({ type: Boolean }) hideSearch = false;
  @property({ type: String, reflect: true })
  private languages: [string, string][] = [
    ["English", ""],
    ["Español", "es"],
    ["中文", "zh"],
    ["繁體中文", "zh-traditional"],
    ["Русский", "ru"],
    ["יידיש", "yi"],
    ["বাংলা", "bn"],
    ["한국어", "ko"],
    ["Kreyòl Ayisyen", "ht"],
    ["Italiano", "it"],
    ["العربية", "ar"],
    ["Polski", "pl"],
    ["Français", "fr"],
    ["اردو", "ur"],
  ];

  static styles = styles;

  private _getNysLogo() {
    if (!nysLogo) return null;

    // Parse the SVG string into an actual SVG DOM element
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(nysLogo, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    return svgElement;
  }

  private _toggleTrustbar() {
    this.trustbarVisible = !this.trustbarVisible;

    if (this.trustbarVisible) {
      this.languageVisible = false;
      this.searchDropdownVisible = false;
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
    window.location.href = `https://search.its.ny.gov/search/search.html?btnG=Search&client=default_frontend&output=xml_no_dtd&proxystylesheet=default_frontend&ulang=en&sort=date:D:L:d1&entqr=3&entqrm=0&wc=200&wc_mc=1&oe=UTF-8&ie=UTF-8&ud=1&site=default_collection&q=${searchValue}+inurl:${window.location.hostname}&site=default_collection`;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <header class="nys-unavheader">
        <div class="nys-unavheader__trustbarwrapper">
          <div
            class="nys-unavheader__toptrustbar"
            @click="${this._toggleTrustbar}"
            @keydown="${(e: KeyboardEvent) => {
              if (
                e.code === "Enter" ||
                e.code === "Space" ||
                e.key === "Enter" ||
                e.key === " "
              ) {
                this._toggleTrustbar();
              }
            }}"
          >
            <div class="nys-unavheader__officialmessage">
              <label id="nys-unavheader__official"
                >An official website of New York State</label
              >
              <nys-button
                id="nys-unavheader__know"
                label="Here's how you know"
                ariaLabel=${this.trustbarVisible
                  ? "Here's how you know expanded"
                  : "Here's how you know collapsed"}
                variant="ghost"
                size="sm"
                suffixIcon="slotted"
              >
                <nys-icon
                  slot="suffix-icon"
                  size="12"
                  name=${this.trustbarVisible ? "chevron_up" : "chevron_down"}
                ></nys-icon>
              </nys-button>
            </div>
          </div>
          <div
            class="nys-unavheader__trustbar ${this.trustbarVisible
              ? "show"
              : "hide"}"
          >
            <div class="nys-unavheader__trustcontent">
              <div class="nys-unavheader__trustcontentmessage">
                <nys-icon size="3xl" name="account_balance_filled"></nys-icon>
                <label><b>Official websites use ny.gov</b></label>
                <label
                  >A <b>ny.gov</b> website belongs to an official New York State
                  government organization.</label
                >
              </div>
              <div class="nys-unavheader__trustcontentmessage">
                <nys-icon size="3xl" name="lock_filled"></nys-icon>
                <label><b>Secure ny.gov websites use HTTPS</b></label>
                <label
                  >A <b>lock icon</b> or <b>https://</b> means you've safely
                  connected to the ny.gov website. Share sensitive information
                  only on official, secure websites.</label
                >
              </div>
            </div>
            <nys-button
              id="nys-unavheader__closetrustbar"
              class="nys-unavheader__iconbutton"
              variant="ghost"
              circle
              icon="close"
              size="sm"
              ariaLabel="Close this notice"
              .onClick="${() => this._toggleTrustbar()}"
            ></nys-button>
          </div>
        </div>
        <div class="nys-unavheader__mainwrapper" id="nys-universal-navigation">
          <div class="nys-unavheader__maincontent">
            <div class="nys-unavheader__left">
              <a
                href="https://www.ny.gov"
                id="nys-unavheader__logolink"
                aria-label="Visit the NY.gov homepage"
              >
                <div class="nys-unavheader__logo">${this._getNysLogo()}</div></a
              >
              <div
                class="nys-unavheader--md nys-unavheader--lg nys-unavheader--xl"
              >
                <div class="nys-unavheader__officialmessage">
                  <label id="nys-unavheader__official"
                    >An official website of New York State</label
                  >
                  <nys-button
                    id="nys-unavheader__know"
                    label="Here's how you know"
                    ariaLabel=${this.trustbarVisible
                      ? "Here's how you know expanded"
                      : "Here's how you know collapsed"}
                    variant="ghost"
                    size="sm"
                    suffixIcon="slotted"
                    .onClick="${() => this._toggleTrustbar()}"
                  >
                    <nys-icon
                      slot="suffix-icon"
                      size="12"
                      name="${this.trustbarVisible
                        ? "chevron_up"
                        : "chevron_down"}"
                    ></nys-icon>
                  </nys-button>
                </div>
              </div>
            </div>
            <div class="nys-unavheader__right">
              ${!this.hideTranslate
                ? html`<div class="nys-unavheader__translatewrapper">
                    <div
                      class="nys-unavheader--xs nys-unavheader--sm nys-unavheader--md"
                    >
                      <nys-button
                        variant="ghost"
                        circle
                        icon="slotted"
                        ariaLabel=${this.languageVisible
                          ? "Translate expanded"
                          : "Translate collapsed"}
                        id="nys-unavheader__translate"
                        class="nys-unavheader__iconbutton"
                        .onClick="${() => this._toggleLanguageList()}"
                      >
                        <nys-icon
                          slot="circle-icon"
                          name="language"
                          size="16"
                        ></nys-icon>
                      </nys-button>
                    </div>
                    ${!this.isSearchFocused
                      ? html`<div class="nys-unavheader--lg nys-unavheader--xl">
                          <nys-button
                            variant="ghost"
                            label="Translate"
                            prefixIcon="language_filled"
                            suffixIcon=${this.languageVisible
                              ? "chevron_up"
                              : "chevron_down"}
                            ariaLabel=${this.languageVisible
                              ? "Translate expanded"
                              : "Translate collapsed"}
                            id="nys-unavheader__translate"
                            .onClick="${() => this._toggleLanguageList()}"
                          ></nys-button>
                        </div>`
                      : null}
                    <div
                      class="nys-unavheader__languagelist ${this.languageVisible
                        ? "show"
                        : "hide"}"
                    >
                      ${this.languages.map(
                        ([label, code]) =>
                          html`<a
                            class="nys-unavheader__languagelink"
                            target="_self"
                            href="https://${code ? code + "." : ""}${window
                              .location.hostname}"
                            >${label}</a
                          >`,
                      )}
                    </div>
                  </div>`
                : null}
              ${!this.hideSearch
                ? html` <div
                      class="nys-unavheader--xs nys-unavheader--sm nys-unavheader--md"
                    >
                      <nys-button
                        variant="ghost"
                        circle
                        icon="search"
                        ariaLabel=${this.searchDropdownVisible
                          ? "Search expanded"
                          : "Search collapsed"}
                        id="nys-unavheader__searchbutton"
                        class="nys-unavheader__iconbutton"
                        .onClick="${() => this._toggleSearchDropdown()}"
                      >
                        <nys-icon
                          slot="circle-icon"
                          name="search"
                          size="16"
                        ></nys-icon>
                      </nys-button>
                    </div>
                    <div class="nys-unavheader--lg nys-unavheader--xl">
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
                          slot="endButton"
                          type="submit"
                          prefixIcon="search"
                          ariaLabel="Search Button"
                          .onClick="${() =>
                            this._handleSearchButton(
                              "nys-unavheader__searchbar",
                            )}"
                        ></nys-button
                      ></nys-textinput>
                    </div>`
                : null}
            </div>
          </div>
        </div>
        <div class="nys-unavheader--xs nys-unavheader--sm nys-unavheader--md">
          <div
            class="nys-unavheader__searchdropdown ${this.searchDropdownVisible
              ? "show"
              : "hide"}"
          >
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
                slot="endButton"
                type="submit"
                prefixIcon="search"
                ariaLabel="Search Button"
                .onClick="${() =>
                  this._handleSearchButton(
                    "nys-unavheader__searchbardropdown",
                  )}"
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

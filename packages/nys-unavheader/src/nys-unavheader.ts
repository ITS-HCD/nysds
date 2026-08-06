import { html, unsafeCSS, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";

// These elements are rendered inside this component's shadow DOM, so they must
// be registered whenever nys-unavheader is used. Importing them here
// (intentional side effect) guarantees the buttons, icons, search input, and
// statewide alerts always upgrade — the translate trigger's ARIA state lands on
// nys-button's real inner <button>, which only exists once nys-button renders.
import "@nysds/nys-button";
import "@nysds/nys-icon";
import "@nysds/nys-textinput";
import "@nysds/nys-alert";
import nysLogo from "./nys-unav.logo";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-unavheader.scss?inline";

interface Language {
  code: string;
  label: string;
  url?: string;
}

/**
 * Statewide alert endpoint, read once per page load. Sites don't opt in or out and
 * never author the content, so an alert reads identically everywhere it appears.
 *
 * Production is https://alerts-cta.static-assets.ny.gov/alerts.json.
 * For dev testing use: https://alerts-cta-dev.static-assets.ny.gov/alerts.json
 */
export const NYS_ALERT_URL =
  "https://alerts-cta.static-assets.ny.gov/alerts.json";

/** An `alert` entry in the feed. */
interface FeedAlert {
  /** "on" publishes the alert; any other value (or absence) hides it. */
  status?: string;
  /** "high" | "medium" | "low" — maps to a `nys-alert` type. */
  severity?: string;
  /** Alert heading. */
  headline?: string;
  /** Alert body copy. */
  description?: string;
  /** Accessible name for the link, when the visible label isn't descriptive enough. */
  linkAriaLabel?: string;
  /** Destination of the alert's link. */
  link?: string;
  /** Visible label for the link. */
  linkTitle?: string;
  /** Feed-side icon name (e.g. "Virus"), mapped to a `nys-icon` name. */
  icon?: string;
}

/** `alerts.json` — one alert, or several once the feed starts sending them. */
interface AlertFeed {
  alert?: FeedAlert | FeedAlert[];
}

type AlertType =
  | "base"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "emergency";

/** Feed severity → `nys-alert` type. Unrecognized severities fall back to `info`. */
const SEVERITY_TYPES: Record<string, AlertType> = {
  high: "emergency",
  medium: "warning",
  low: "info",
  // Feed authors may also use the design system's own vocabulary
  emergency: "emergency",
  danger: "danger",
  warning: "warning",
  success: "success",
  info: "info",
  base: "base",
};

/**
 * Feed icon name → `nys-icon` name. Deliberately a closed list: an icon the library
 * doesn't have would render as a blank square, so anything unrecognized falls back
 * to the alert type's own default icon.
 */
const FEED_ICONS: Record<string, string> = {
  virus: "coronavirus",
  coronavirus: "coronavirus",
  snow: "ac_unit",
  snowflake: "ac_unit",
  winter: "ac_unit",
  ac_unit: "ac_unit",
  wind: "air",
  air: "air",
  sun: "clear_day",
  heat: "clear_day",
  clear_day: "clear_day",
  rain: "rainy",
  flood: "rainy",
  rainy: "rainy",
  alert: "warning",
  warning: "warning",
  emergency: "emergency_home",
  emergency_home: "emergency_home",
  error: "error",
  info: "info",
  notifications: "notifications",
  schedule: "schedule",
  location_on: "location_on",
};

/** `true` only for the feed's explicit "on" switch. */
const isPublished = (status?: string) => status?.trim().toLowerCase() === "on";

/** The element the translate menu is rendered into, referenced by `aria-controls`. */
const LANGUAGE_LIST_ID = "nys-unavheader__languagelist";

/** Both translate triggers — only one is visible at a time, depending on width. */
const TRANSLATE_TRIGGER_IDS = [
  "nys-unavheader__translate--desktop",
  "nys-unavheader__translate--mobile",
] as const;

/**
 * Language code → BCP 47 tag for the option's `lang` attribute.
 *
 * The codes double as Smartling subdomains, so they aren't all valid language tags.
 * Only the ones that differ need an entry; everything else already is a valid tag
 * and is used as written. Without a correct `lang`, a screen reader reads each
 * option in the page's own voice — "Español" announced as English.
 */
const LANGUAGE_TAGS: Record<string, string> = {
  zh: "zh-Hans",
  "zh-traditional": "zh-Hant",
};

const languageTag = (code: string) => LANGUAGE_TAGS[code] ?? code;

/**
 * Universal NYS header with trust bar, logo, search, and language translation. Required on all NYS sites.
 *
 * Place as the first element in `<body>`. Includes "official site" trust indicator, NY.gov logo,
 * site search (searches ny.gov), and 14-language translation dropdown. Use `hideSearch` or `hideTranslate`
 * to remove features if not applicable.
 *
 * @accessibility
 * - Semantic `<header>` element ensures assistive technology recognition.
 * - Trust bar button: `role="button"`, `aria-expanded`, descriptive `aria-label`.
 * - All links and buttons are keyboard-navigable via Tab.
 * - Translate trigger: a real button carrying `aria-expanded`, `aria-haspopup`, and
 *   `aria-controls` pointing at the language menu. The menu is display-hidden when
 *   closed, so its options only enter the tab order once it opens; Escape closes it
 *   and returns focus to the trigger.
 * - Each language option carries the BCP 47 `lang` of the language it names, so its
 *   label is announced in that language rather than the page's.
 * - Search input announces field purpose and keyboard shortcuts (Enter to submit, Escape to dismiss).
 * - Visual focus indicators meet WCAG 2.2 AA standards.
 * - All text has sufficient color contrast (4.5:1 minimum).
 * - Icons have text labels or `aria-label` attributes.
 *
 * @summary Universal NYS header with trust bar, search, and translation. Required site-wide.
 * @element nys-unavheader
 *
 * @remarks Statewide alerts are not configurable. On load the header reads the statewide
 * alert endpoint and renders whatever is currently published, so an emergency message
 * reaches every NYS site with no per-site work. If the endpoint is unreachable or nothing
 * is published, the header renders normally. It takes no children.
 *
 * @fires nys-language-select - Fired when a language is selected. Detail: `{language: {code, label, url?}}`. Cancelable; `preventDefault()` overrides the default Smartling redirect.
 * @fires nys-search-submit - Fired when a search is submitted. Detail: `{query}`. Cancelable; `preventDefault()` overrides the default search redirect.
 *
 * @example Basic
 * ```html
 * <nys-unavheader></nys-unavheader>
 * ```
 *
 * @example Hide search
 * ```html
 * <nys-unavheader hideSearch></nys-unavheader>
 * ```
 *
 *  @example Hide translate
 * ```html
 * <nys-unavheader hideTranslate></nys-unavheader>
 * ```
 *
 * @example Custom Search URL
 * ```html
 * <nys-unavheader searchUrl="https://designsystem.ny.gov/search/?q="></nys-unavheader>
 * ```
 *
 * @example Custom Language List
 * ```html
 * <nys-unavheader id="my-header"></nys-unavheader>
 * <script>
 *   const header = document.querySelector('#my-header');
 *   header.languages = [
 *   { code: 'en', label: 'English' },
 *   { code: 'es', label: 'Español' , url: '"https://ny.gov/?lang=es"'},
 *   { code: 'fr', label: 'Français', url: '"https://ny.gov/?lang=fr"'},
 *   ];
 * </script>
 * ```
 *
 * @example Custom Language List JS
 * ```html
 * <nys-unavheader id="my-header2"></nys-unavheader>
 * <script>
 *   document.querySelector('#my-header2').addEventListener('nys-language-select', (event) => {
 *   event.preventDefault();
 *   const selectedLanguage = event.detail.language.label;
 *   });
 * </script>
 * ```
 */

export class NysUnavHeader extends NysElement {
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
   * connectedCallback is inherited from NysElement, which assigns an
   * auto-generated host id (prefix "nys-unavheader") when none is provided. The
   * banner landmark intentionally lives on the inner <header> element, so this
   * component keeps defaultRole = null and does not move a role onto the host.
   */

  connectedCallback() {
    super.connectedCallback();
    // Also covers re-attachment, where the pending request was aborted on the way out
    this._loadAlerts();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Don't leave a pending request pointed at a detached element
    this._alertRequest?.abort();
    this._alertRequest = null;
  }

  protected updated(changed: PropertyValues) {
    super.updated(changed);
    if (!this.hideTranslate) this._syncTranslateTriggerAria();
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

  /** Which translate trigger opened the menu, so Escape can return focus to it. */
  private _translateTrigger: string = TRANSLATE_TRIGGER_IDS[0];

  private _toggleLanguageList(triggerId?: string) {
    if (triggerId) this._translateTrigger = triggerId;

    this.languageVisible = !this.languageVisible;
    if (this.languageVisible) {
      this.trustbarVisible = false;
      this.searchDropdownVisible = false;
    }
  }

  /**
   * Closes the menu and puts focus back on the trigger. The open list is the only
   * thing keeping the language buttons focusable, so closing it while focus sits on
   * one would drop focus to the top of the page (WCAG 2.4.3).
   */
  private _closeLanguageList() {
    if (!this.languageVisible) return;
    this.languageVisible = false;

    this.updateComplete.then(() => {
      const trigger =
        this.shadowRoot?.getElementById(this._translateTrigger) ??
        this.shadowRoot?.getElementById(TRANSLATE_TRIGGER_IDS[1]);
      trigger?.focus();
    });
  }

  /**
   * `nys-button` renders the real `<button>` inside its own shadow root, so an
   * `aria-expanded` written on the host never reaches the element that carries the
   * button role — assistive tech was never told the translate menu collapses. Mirror
   * the state onto the inner control, the same way `nys-dropdownmenu` does for its
   * trigger (WCAG 4.1.2).
   */
  private async _syncTranslateTriggerAria() {
    for (const id of TRANSLATE_TRIGGER_IDS) {
      const trigger = this.shadowRoot?.getElementById(id) as
        | (HTMLElement & { updateComplete?: Promise<unknown> })
        | null;
      if (!trigger) continue;

      // The inner button only exists once nys-button has rendered. aria-expanded
      // and aria-controls travel through nys-button's ariaExpanded/ariaControls
      // props; only aria-haspopup has no prop equivalent yet.
      await trigger.updateComplete;
      const control = trigger.shadowRoot?.querySelector("button") ?? trigger;
      control.setAttribute("aria-haspopup", "true");
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

  /** Escape dismisses the translate menu, matching the search field's Escape. */
  private _handleTranslateKeydown(e: KeyboardEvent) {
    if (e.key !== "Escape" || !this.languageVisible) return;
    e.stopPropagation();
    this._closeLanguageList();
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

  /**
   * Statewide alerts
   * --------------------------------------------------------------------------
   * Content comes from the alert feed, never from the consuming page, so the same
   * message renders identically everywhere it is shown. A missing, malformed, or
   * unreachable feed leaves the header untouched — an alert failing to load must
   * never take a site's navigation down with it.
   */

  /** The published alerts, in feed order. Empty when nothing is published. */
  @state() private _alerts: FeedAlert[] = [];

  /** In-flight feed request, aborted if the header leaves the page first. */
  private _alertRequest: AbortController | null = null;

  private async _loadAlerts() {
    if (typeof fetch !== "function") return;

    this._alertRequest?.abort();
    const request = new AbortController();
    this._alertRequest = request;

    const feed = await this._readFeed(request);
    if (!feed) return;

    const alerts = Array.isArray(feed.alert)
      ? feed.alert
      : feed.alert
        ? [feed.alert]
        : [];
    this._alerts = alerts.filter((alert) => isPublished(alert?.status));
  }

  /** Fetches the alert feed. Resolves to null on any failure. */
  private async _readFeed(request: AbortController) {
    try {
      const response = await fetch(NYS_ALERT_URL, {
        signal: request.signal,
        credentials: "omit",
        // An alert that is switched off must go away everywhere on the next page
        // load, so never read (or write) the HTTP cache for this
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Responded with ${response.status}`);
      }

      const feed = (await response.json()) as AlertFeed;
      // A late response for a header that has since been detached is dead weight
      return request.signal.aborted ? null : feed;
    } catch {
      return null;
    }
  }

  /** Feed severity → `nys-alert` type. */
  private _alertType(severity?: string): AlertType {
    return SEVERITY_TYPES[severity?.trim().toLowerCase() ?? ""] ?? "info";
  }

  /**
   * Feed icon name → `nys-icon` name. Unknown names resolve to "", which leaves
   * `nys-alert` to draw the default icon for the alert's type.
   */
  private _alertIcon(icon?: string) {
    const name = icon?.trim().toLowerCase().replace(/\s+/g, "_");
    return (name && FEED_ICONS[name]) || "";
  }

  /**
   * One full-bleed band per published alert, so alerts of different severities keep
   * their own background instead of sharing one. The body is slotted rather than
   * passed as `text`/`primaryAction` so the link can carry the feed's `linkAriaLabel`.
   */
  private _renderAlerts() {
    return this._alerts.map((alert) => this._renderAlert(alert));
  }

  private _renderAlert(alert: FeedAlert) {
    // An entry switched on with nothing to say would render an empty band
    if (!alert.headline?.trim() && !alert.description?.trim()) return nothing;

    const type = this._alertType(alert.severity);
    const icon = this._alertIcon(alert.icon);
    const linkLabel = alert.linkTitle?.trim() || "Learn more";

    return html`
      <div class="nys-unavheader__alert wrapper" data-type=${type}>
        <nys-alert
          class="content"
          type=${type}
          heading=${alert.headline ?? ""}
          icon=${icon}
        >
          ${alert.description
            ? html`<p class="nys-unavheader__alert-text">
                ${alert.description}
              </p>`
            : nothing}
          ${alert.link
            ? html`<a
                class="nys-unavheader__alert-link"
                href=${alert.link}
                aria-label=${alert.linkAriaLabel?.trim() || nothing}
                >${linkLabel}</a
              >`
            : nothing}
        </nys-alert>
      </div>
    `;
  }

  render() {
    // The statewide header sits above an agency's own `nys-globalheader`, so a page
    // normally carries two banner landmarks. Naming this one "New York State" keeps
    // landmark navigation meaningful instead of announcing "banner, banner" (axe
    // `landmark-unique`); the agency banner is named after the agency.
    return html`
      <header class="nys-unavheader" aria-label="New York State">
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
            <span class="nys-unavheader__official"
              >An official website of New York State</span
            >
            <nys-button
              id="nys-unavheader__know"
              label="Here's how you know"
              variant="text"
              size="sm"
              ariaControls="nys-unavheader__trustpanel"
              ariaExpanded="${this.trustbarVisible}"
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
          id="nys-unavheader__trustpanel"
          id="nys-unavheader__trustpanel"
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
              label="Close this notice"
              ariaControls="nys-unavheader__trustpanel"
              ariaExpanded="${this.trustbarVisible}"
              @nys-click="${() =>
                this._toggleTrustbar("nys-unavheader__know--inline")}"
            ></nys-button>
            <div class="nys-unavheader__messagewrapper">
              <div
                class="nys-unavheader__trustcontentmessage"
                id="trust_official"
              >
                <nys-icon size="3xl" name="account_balance_filled"></nys-icon>
                <span><b>Official websites use ny.gov</b></span>
                <span
                  >A <b>ny.gov</b> website belongs to an official New York State
                  government organization.</span
                >
              </div>
              <div
                class="nys-unavheader__trustcontentmessage"
                id="trust_secure"
              >
                <nys-icon size="3xl" name="lock_filled"></nys-icon>
                <span><b>Secure ny.gov websites use HTTPS</b></span>
                <span
                  >A <b>lock icon</b> or <b>https://</b> means you've safely
                  connected to the ny.gov website. Share sensitive information
                  only on official, secure websites.</span
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
              <span id="nys-unavheader__official"
                >An official website of New York State</span
              >
              <nys-button
                id="nys-unavheader__know--inline"
                label="Here's how you know"
                ariaControls="nys-unavheader__trustpanel"
                ariaExpanded="${this.trustbarVisible}"
                variant="text"
                size="sm"
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
              ? html`<div
                  class="nys-unavheader__translatewrapper"
                  @keydown=${this._handleTranslateKeydown}
                >
                  <nys-button
                    variant="ghost"
                    circle
                    label="Translate"
                    ariaControls="${LANGUAGE_LIST_ID}"
                    ariaExpanded="${this.languageVisible}"
                    id="nys-unavheader__translate--mobile"
                    class="nys-unavheader__iconbutton"
                    @nys-click=${() =>
                      this._toggleLanguageList(TRANSLATE_TRIGGER_IDS[1])}
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
                          ariaControls="${LANGUAGE_LIST_ID}"
                          ariaExpanded="${this.languageVisible}"
                          size="sm"
                          prefixIcon="language"
                          suffixIcon=${this.languageVisible
                            ? "chevron_up"
                            : "chevron_down"}
                          id="nys-unavheader__translate--desktop"
                          @nys-click="${() =>
                            this._toggleLanguageList(TRANSLATE_TRIGGER_IDS[0])}"
                        ></nys-button>
                      `
                    : null}
                  <div
                    id="${LANGUAGE_LIST_ID}"
                    class="nys-unavheader__languagelist ${this.languageVisible
                      ? "show"
                      : "hide"}"
                  >
                    ${this.languages.map(
                      (lang) =>
                        html`<nys-button
                          variant="ghost"
                          fullWidth
                          lang="${languageTag(lang.code)}"
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
                    label="Search"
                    ariaControls="nys-unavheader__searchdropdown"
                    ariaExpanded="${this.searchDropdownVisible}"
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
                      @nys-click=${() => {
                        this._handleSearchButton("nys-unavheader__searchbar");
                      }}
                      ><span class="sr-only">Search</span></nys-button
                    >
                  </nys-textinput>
                `
              : null}
          </div>
        </div>
        <div
          id="nys-unavheader__searchdropdown"
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
                @nys-click=${() => {
                  this._handleSearchButton("nys-unavheader__searchbardropdown");
                }}
                ><span class="sr-only">Search</span></nys-button
            ></nys-textinput>
          </div>
        </div>
        ${this._renderAlerts()}
      </header>
    `;
  }
}

if (!customElements.get("nys-unavheader")) {
  customElements.define("nys-unavheader", NysUnavHeader);
}

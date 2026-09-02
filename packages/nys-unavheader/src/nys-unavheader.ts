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
  nativeText: string;
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

/** Accessible name of the menu, matching the name of the trigger that opens it. */
const LANGUAGE_MENU_LABEL = "Translate";

/** Marks each language option, so the menu can collect them for roving focus. */
const LANGUAGE_OPTION_CLASS = "nys-unavheader__languagelink";

/** Both translate triggers — only one is visible at a time, depending on width. */
const TRANSLATE_TRIGGER_IDS = [
  "nys-unavheader__translate--desktop",
  "nys-unavheader__translate--mobile",
] as const;

/**
 * A rendered `nys-button`. Its real `<button>` — the element that actually carries
 * the button role, the tab stop, and any ARIA — lives in its own shadow root.
 */
type ButtonElement = HTMLElement & { updateComplete?: Promise<unknown> };

/** The real control inside a `nys-button`, once it has rendered. */
const innerControl = (button: ButtonElement): HTMLElement =>
  button.shadowRoot?.querySelector("button") ?? button;

/**
 * Language code → BCP 47 tag for the option's `lang` attribute.
 *
 * The codes double as Localize language codes, so they aren't all valid language tags.
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
 * Accessible name for the `banner` landmark, used when the consumer does not
 * override it. Pairs with the agency `nys-globalheader`'s own banner name, so
 * landmark navigation can tell the statewide chrome from the site's own header.
 */
const DEFAULT_LANDMARK_LABEL = "New York State";

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
 * - Translate control: the WAI-ARIA APG menu button pattern. A real button carries
 *   `aria-expanded`, `aria-haspopup="menu"`, and `aria-controls` pointing at a
 *   `role="menu"` list of `role="menuitem"` options. The menu is display-hidden when
 *   closed, so its options only enter the tab order once it opens.
 * - Translate keyboard model: Down/Up on the trigger open the menu on its first/last
 *   option; inside the menu Down/Up step and wrap, Home/End jump to either end,
 *   Enter/Space pick an option, and Escape closes the menu and returns focus to the
 *   trigger. A roving tabindex keeps the open menu to a single tab stop.
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
 * @fires nys-language-select - Fired when a language is selected. Detail: `{language: {code, label, url?}}`. Cancelable; `preventDefault()` overrides the default Localize integration.
 * @fires nys-search-submit - Fired when a search is submitted. Detail: `{query}`. Cancelable; `preventDefault()` overrides the default search redirect.
 *
 * @example Basic
 * ```html
 * <nys-unavheader translateKey="NEf4Y5qMb9PGP"></nys-unavheader>
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
 * @example Custom landmark label
 * ```html
 * <!-- Renames the banner landmark. Keep it distinct from the agency header's. -->
 * <nys-unavheader landmarkLabel="Statewide"></nys-unavheader>
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

  /** Localize project key. If provided, the component will load and initialize LocalizeJS automatically. */
  @property({ type: String }) translateKey = "";

  /**
   * Accessible name for the `banner` landmark this header renders.
   * Defaults to `"New York State"`.
   *
   * A page pairing this header with `nys-globalheader` carries two `banner`
   * landmarks; distinct names are what keep landmark navigation useful instead of
   * announcing "banner, banner". Override only when your wording is clearer for
   * your audience — and keep it distinct from the agency header's name, which
   * comes from that header's visible title.
   *
   * A blank value falls back to the default rather than leaving the landmark
   * unnamed.
   *
   * @default "New York State"
   */
  @property({ type: String }) landmarkLabel = DEFAULT_LANDMARK_LABEL;

  /** The list of languages this site can be translated to, default to use Localize */
  @property({ type: Array })
  languages: Language[] = [
    { code: "en", label: "English", nativeText: "English" },
    { code: "es", label: "Español", nativeText: "Spanish" },
    { code: "zh", label: "中文", nativeText: "Chinese" },
    {
      code: "zh-traditional",
      label: "繁體中文",
      nativeText: "Traditional Chinese",
    },
    { code: "yi", label: "יידיש", nativeText: "Yiddish" },
    { code: "ru", label: "Русский", nativeText: "Russian" },
    { code: "bn", label: "বাংলা", nativeText: "Bengali" },
    { code: "ko", label: "한국어", nativeText: "Korean" },
    { code: "ht", label: "Kreyòl Ayisyen", nativeText: "Haitian Creole" },
    { code: "it", label: "Italiano", nativeText: "Italian" },
    { code: "ar", label: "العربية", nativeText: "Arabic" },
    { code: "pl", label: "Polski", nativeText: "Polish" },
    { code: "fr", label: "Français", nativeText: "French" },
    { code: "ur", label: "اردو", nativeText: "Urdu" },
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
    this._initLocalize();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Don't leave a pending request pointed at a detached element
    this._alertRequest?.abort();
    this._alertRequest = null;
  }

  willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);

    if (!this.translateKey) {
      this.hideTranslate = true;
    } else {
      if (
        changedProperties.has("translateKey") &&
        !this.hasAttribute("hideTranslate") &&
        !changedProperties.has("hideTranslate")
      ) {
        this.hideTranslate = false;
      }
    }
  }

  protected updated(changed: PropertyValues) {
    super.updated(changed);
    if (this.hideTranslate) return;

    if (changed.has("translateKey")) {
      this._initLocalize();
    } else {
      console.log("Unable to translate. No key given");
    }

    // Both of these write ARIA into nys-button's shadow root, so they have to run
    // after every render — a new `languages` array renders brand new buttons.
    this._syncTranslateTriggerAria();
    this._syncLanguageMenuAria();

    if (!changed.has("languageVisible")) return;

    if (!this.languageVisible) {
      // The next open starts at the top of the list
      this._openWithFocus = null;
      this._activeOption = 0;
      return;
    }

    // Only a keyboard open moves focus into the menu, and only once it has rendered
    const edge = this._openWithFocus;
    this._openWithFocus = null;
    if (edge) this._focusOption(edge === "first" ? 0 : -1);
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

  /**
   * The translate menu — WAI-ARIA APG "Menu Button"
   * --------------------------------------------------------------------------
   * The options are actions, not links: picking one fires a cancelable
   * `nys-language-select` and, unless the page handles it, redirects. That, plus a
   * trigger already declaring `aria-haspopup`/`aria-expanded`/`aria-controls`, makes
   * this a menu button rather than a disclosure navigation menu — and it is the same
   * shape `nys-dropdownmenu` uses, so #1412's eventual move onto that component
   * won't change a single ARIA attribute.
   *
   * Focus moves by roving tabindex, not `aria-activedescendant`. Each option's
   * `role="menuitem"` sits on the real `<button>` inside a `nys-button`'s shadow
   * root, and `aria-activedescendant` is an IDREF — it cannot reach across a shadow
   * boundary.
   */

  /** Which translate trigger opened the menu, so Escape can return focus to it. */
  private _translateTrigger: string = TRANSLATE_TRIGGER_IDS[0];

  /** Index of the option holding the menu's single tab stop. */
  private _activeOption = 0;

  /**
   * Where focus lands when the menu opens, set only by a keyboard activation. A
   * mouse open leaves focus on the trigger: moving it would put a focus ring on an
   * option the pointer user never asked for.
   */
  private _openWithFocus: "first" | "last" | null = null;

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
      const trigger = this.shadowRoot?.getElementById(
        id,
      ) as ButtonElement | null;
      if (!trigger) continue;

      // The inner button only exists once nys-button has rendered. aria-expanded
      // and aria-controls travel through nys-button's ariaExpanded/ariaControls
      // props; only aria-haspopup has no prop equivalent yet.
      await trigger.updateComplete;
      innerControl(trigger).setAttribute("aria-haspopup", "menu");
    }
  }

  /** The language options, in the order they are rendered. */
  private _languageOptions(): ButtonElement[] {
    return Array.from(
      this.shadowRoot?.querySelectorAll<ButtonElement>(
        `.${LANGUAGE_OPTION_CLASS}`,
      ) ?? [],
    );
  }

  /**
   * Menu semantics for the options, and the same shadow-root problem as the trigger:
   * `role="menuitem"` and the tab stop have to land on the real `<button>`, not on
   * the `nys-button` host. The hosts carry `role="presentation"` in the template so
   * they don't sit between the menu and its items in the accessibility tree.
   */
  private async _syncLanguageMenuAria() {
    const options = this._languageOptions();
    if (!options.length) return;

    // A shorter `languages` array can leave the tab stop past the end of the menu
    if (this._activeOption > options.length - 1) this._activeOption = 0;

    await Promise.all(options.map((option) => option.updateComplete));

    options.forEach((option, index) => {
      const control = innerControl(option);
      control.setAttribute("role", "menuitem");
      // Exactly one tab stop: Tab enters and leaves the menu, arrows move within it
      control.setAttribute(
        "tabindex",
        index === this._activeOption ? "0" : "-1",
      );
    });
  }

  /**
   * Moves both focus and the tab stop to an option, wrapping at either end. Index
   * -1 is the last option, so "previous from the first" and "End" are the same call.
   */
  private async _focusOption(index: number) {
    const options = this._languageOptions();
    if (!options.length) return;

    const count = options.length;
    this._activeOption = ((index % count) + count) % count;
    await this._syncLanguageMenuAria();
    options[this._activeOption]?.focus();
  }

  private _initLocalize() {
    if (this.hideTranslate) return;

    if (!this.translateKey) {
      this.hideTranslate = true;
      return;
    }

    const setup = () => {
      if (typeof (window as any).Localize !== "undefined") {
        (window as any).Localize.initialize({
          key: this.translateKey,
          rememberLanguage: true,
          autoApprove: true,
        });
        // Fires for every language change, including the remembered language
        // Localize re-applies on page load — so a returning visitor sees the
        // disclaimer without re-selecting a language.
        (window as any).Localize.on("setLanguage", (data: any) => {
          this._updateTranslateDisclaimer(data?.to ?? data?.language);
        });
      }
    };

    if (typeof (window as any).Localize !== "undefined") {
      setup();
    } else {
      let script = document.getElementById(
        "nys-localize-api",
      ) as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.id = "nys-localize-api";
        script.src = "https://global.localizecdn.com/localize.js";
        document.head.appendChild(script);
      }
      script.addEventListener("load", setup);
    }
  }

  private _toggleSearchDropdown() {
    this.searchDropdownVisible = !this.searchDropdownVisible;
    if (this.searchDropdownVisible) {
      this.trustbarVisible = false;
      this.languageVisible = false;
    }
  }

  /**
   * Shows, replaces, or removes the translation disclaimer banner for the given
   * language code. Called from the Localize "setLanguage" listener — which also
   * fires on page load for a remembered language — and directly from
   * `_handleLanguageSelect` when the Localize API isn't available.
   */
  private _updateTranslateDisclaimer(languageCode: string) {
    const disclaimerContent: Record<string, string> = {
      es: `Las traducciones automáticas no son perfectas y no pretenden reemplazar a los traductores humanos. Es posible que algunas páginas o parte del contenido no estén traducidos de forma precisa debido a las limitaciones del software de traducción. <a href="https://ny.gov/web-translation-services">Lea la exención de responsabilidad completa</a>`,
      fr: `Aucune traduction automatique n’est parfaite, ni n'est destinée à remplacer les traducteurs humains. Certaines pages ou du contenu peuvent ne pas être traduits exactement en raison des limitations du logiciel de traduction. <a href="https://ny.gov/web-translation-services">Lire entièrement la clause de non-responsabilité</a>`,
      ar: `الترجمة الآلية لا تكون مثالية بأي حال من الأحوال، ولا يقصد بها أن تحل محل المترجمين من بني البشر. قد تكون ترجمة بعض المحتويات أو الصفحات غير دقيقة بسبب محددات برمجية الترجمة. <a href="https://ny.gov/web-translation-services">اقرأ بيان إخلاء المسؤولية بالكامل</a>`,
      bn: `কোন স্বয়ংক্রিয় অনুবাদ নিখুঁত নয়, না এর উদ্দেশ্য মানুষ অনুবাদকদের প্রতিস্থাপন করা। অনুবাদ সফ্টওয়্যারের সীমাবদ্ধতার কারণে কিছু পৃষ্ঠা বা বিষয়বস্তু সঠিকভাবে অনুবাদ নাও করা হতে পারে। <a href="https://ny.gov/web-translation-services">اসম্পূর্ণ দায়-পরিত্যাগকারী বিজ্ঞপ্তিটি পড়ুন</a>`,
      zh: `自動翻譯並不完美、也不是為了取代人工翻譯。由於翻譯軟體限制、某些頁面或內容可能無法準確翻譯。<a href="https://ny.gov/web-translation-services">閱讀完整的免責聲明</a>`,
      "zh-traditional": `自動翻譯並不完美、也不是為了取代人工翻譯。由於翻譯軟體限制、某些頁面或內容可能無法準確翻譯。<a href="https://ny.gov/web-translation-services">閱讀完整的免責聲明</a>`,
      ht: `Okenn tradiksyon otomatik pa pafè, ni pa gen entansyon pou ranplase tradiktè imen. Gen kèk paj oswa kontni ki ka pa tradui avèk presizyon akòz limit nan lojisyèl tradiksyon an. <a href="https://ny.gov/web-translation-services">Li Tout Avi sou Dechaj Responsabilite a</a>`,
      it: `Nessuna traduzione automatica è perfetta, né è destinata a sostituire i traduttori umani. Alcune pagine o contenuti potrebbero non essere tradotti accuratamente a causa delle limitazioni del software di traduzione. <a href="https://ny.gov/web-translation-services">Leggere l’intera liberatoria</a>`,
      ko: `자동 번역은 완벽하지 않으며, 번역가를 대체하기 위해 의도된 것도 아닙니다. 번역 소프트웨어의 한계로 인해 일부 페이지 또는 내용이 정확하게 번역되지 않을 수 있습니다 <a href="https://ny.gov/web-translation-services">면책 조항 전문 읽기</a>`,
      pl: `Żadne tłumaczenie automatyczne nie jest doskonałe, ani też nie ma na celu zastąpienia tłumaczeń wykonywanych przez ludzi. Niektóre strony lub treści mogą być niedokładnie przetłumaczone z powodu ograniczeń oprogramowania do wykonywania tłumaczeń <a href="https://ny.gov/web-translation-services">Przeczytaj pełną klauzulę wyłączenia odpowiedzialności</a>`,
      ru: `Автоматический перевод не является безупречным и не может заменить переводчика-человека. Некоторые страницы или их содержимое могут быть переведены неточно из-за ограничений программного обеспечения для перевода. <a href="https://ny.gov/web-translation-services">Ознакомьтесь с полным текстом отказа от ответственности</a>`,
      ur: `کوئی بھی خود کار ترجمہ بالکل درست نہیں ہوتا ہے، نہ ہی اس کا مقصد انسانی ترجمہ نگاروں کی جگہ لینا ہوتا ہے۔ ممکن ہے کہ ترجمہ سافٹ ویئر کی محدود صلاحیتوں کی وجہ سے کچھ صفحات یا مواد کا ترجمہ بالکل درست نہ ہو پائے۔ <a href="https://ny.gov/web-translation-services">مکمل براءت نامہ پڑھیں</a>`,
      yi: `קיין איין אויטאמאטישע איבערזעצונג איז נישט אינגאנצן פארלעסליך, און עס איז נישט געמאכט צו ערזעצן א מענטשליכע איבערזעצער. טייל בלעטער אדער אינהאלט זענען מעגליך נישט פונקטליך איבערגעזעצט צוליב די באגרעניצטע מעגליכקייטן פון די איבערזעצונג טעכנאלאגיע. <a href="https://ny.gov/web-translation-services">לייענט די פולע אויסקלארונג</a>`,
    };

    // Remove any existing translate disclaimer to prevent piling up
    const existingDisclaimer = document.body.querySelector(
      "nys-alert[data-translate-disclaimer='true']",
    );
    if (existingDisclaimer) {
      existingDisclaimer.remove();
    }

    // Show disclaimer only for non-English languages
    if (languageCode !== "en") {
      const translateDisclaimer = document.createElement("nys-alert");
      // translateDisclaimer.setAttribute("heading", "Translation Alert!");
      translateDisclaimer.setAttribute("notranslate", "true");
      translateDisclaimer.setAttribute("dismissible", "true");
      translateDisclaimer.setAttribute("data-translate-disclaimer", "true");
      translateDisclaimer.innerHTML = disclaimerContent[languageCode];

      Object.assign(translateDisclaimer.style, {
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100%",
        zIndex: "9999",
      });
      document.body.appendChild(translateDisclaimer);

      const RTL_LANGUAGES = ["yi", "ar", "ur"];
      const baseLang = (document.documentElement.lang || "")
        .toLowerCase()
        .split("-")[0];

      document.documentElement.dir = RTL_LANGUAGES.includes(baseLang)
        ? "rtl"
        : "ltr";
    } else {
      // Reset the document direction to left-to-right for English
      document.documentElement.dir = "ltr";
    }
  }

  private _handleLanguageSelect(language: Language) {
    // Focus goes back to the trigger, which matters when a page cancels the event
    // and nothing navigates — otherwise focus would be dropped with the menu
    this._closeLanguageList();

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
        // Default behavior: use Localize API instead of subdomain redirect
        if (typeof (window as any).Localize !== "undefined") {
          // The "setLanguage" listener registered in _initLocalize shows the
          // disclaimer once Localize confirms the change
          (window as any).Localize.setLanguage(language.code);
        } else {
          this._updateTranslateDisclaimer(language.code);
        }
      }
    }
  }

  /**
   * Keyboard model for the translate menu (APG menu button):
   * - on the trigger: Down/Up open the menu on its first/last option, Enter/Space
   *   open it on the first option, Escape closes it
   * - in the menu: Down/Up step and wrap, Home/End jump to either end, Enter/Space
   *   pick the option (native `<button>` activation), Escape closes the menu and
   *   returns focus to the trigger
   *
   * Type-ahead is deliberately left out. Each label is written in its own script, so
   * matching typed characters would mean transliteration plus an IME to be usable —
   * "e" finds nothing in "Español" for anyone who would need it. The pattern lists
   * type-ahead as optional.
   */
  private _handleTranslateKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    if (e.key === "Escape") {
      if (!this.languageVisible) return;
      e.stopPropagation();
      this._closeLanguageList();
      return;
    }

    if ((TRANSLATE_TRIGGER_IDS as readonly string[]).includes(target.id)) {
      this._handleTriggerKeydown(e, target.id);
    } else if (target.classList.contains(LANGUAGE_OPTION_CLASS)) {
      this._handleOptionKeydown(e);
    }
  }

  private _handleTriggerKeydown(e: KeyboardEvent, triggerId: string) {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        // No click follows an arrow key, so the menu has to be opened here — and
        // the page must not scroll out from under it
        e.preventDefault();
        const edge = e.key === "ArrowDown" ? "first" : "last";
        if (this.languageVisible) {
          this._focusOption(edge === "first" ? 0 : -1);
        } else {
          this._openWithFocus = edge;
          this._toggleLanguageList(triggerId);
        }
        break;
      }
      case "Enter":
      case " ":
      case "Spacebar":
        // The button's own click follows and does the toggling. All this has to do
        // is say where focus goes if that click is the one that opens the menu.
        this._openWithFocus = this.languageVisible ? null : "first";
        break;
      default:
        break;
    }
  }

  private _handleOptionKeydown(e: KeyboardEvent) {
    const current = this._languageOptions().indexOf(e.target as ButtonElement);
    if (current < 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this._focusOption(current + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        this._focusOption(current - 1);
        break;
      case "Home":
        e.preventDefault();
        this._focusOption(0);
        break;
      case "End":
        e.preventDefault();
        this._focusOption(-1);
        break;
      default:
        break;
    }
  }

  /**
   * Focus leaving the menu closes it — that is what Tab and Shift+Tab do under the
   * menu button pattern, and it also covers clicking away. Closing without touching
   * focus is the point here: the browser is already moving it somewhere else.
   */
  private _handleTranslateFocusout(e: FocusEvent) {
    if (!this.languageVisible) return;

    const wrapper = e.currentTarget as HTMLElement;
    const next = e.relatedTarget as Node | null;
    // relatedTarget is retargeted to the host of any shadow root focus moved into,
    // so a plain `contains` is enough to tell "still inside the menu" apart
    if (next && wrapper.contains(next)) return;

    this.languageVisible = false;
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

  /**
   * The banner's accessible name. A blank override would put the page back where
   * #1795 found it — two unnamed banners — so it falls back to the default.
   */
  private get _landmarkLabel(): string {
    return this.landmarkLabel?.trim() || DEFAULT_LANDMARK_LABEL;
  }

  private get _locale() {
    const browserLang = new Intl.Locale(navigator.language);
    const currentLang = document.documentElement.lang;

    if (currentLang === browserLang.language) {
      return currentLang;
    } else if (currentLang !== browserLang.language) {
      return currentLang;
    }
  }

  render() {
    // The statewide header sits above an agency's own `nys-globalheader`, so a page
    // normally carries two banner landmarks. Naming this one keeps landmark
    // navigation meaningful instead of announcing "banner, banner" (axe
    // `landmark-unique`); the agency banner is named after the agency.
    // `landmarkLabel` lets a consumer reword this one without giving up the
    // distinction.
    return html`
      <header class="nys-unavheader" aria-label=${this._landmarkLabel}>
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
                  @focusout=${this._handleTranslateFocusout}
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
                    role="menu"
                    aria-label="${LANGUAGE_MENU_LABEL}"
                    class="nys-unavheader__languagelist ${this.languageVisible
                      ? "show"
                      : "hide"}"
                  >
                    ${this.languages.map(
                      (lang) =>
                        // role="presentation" drops the nys-button host out of the
                        // accessibility tree, so the menu owns the menuitem inside
                        // it directly instead of a generic wrapper. The menuitem
                        // role and the roving tabindex are written onto that inner
                        // button by _syncLanguageMenuAria.
                        html`<nys-button
                          role="presentation"
                          variant="ghost"
                          fullWidth
                          lang="${languageTag(lang.code)}"
                          class="${LANGUAGE_OPTION_CLASS}"
                          @click="${() => this._handleLanguageSelect(lang)}"
                        >
                          <span notranslate>${lang.label}</span>
                          <span lang="${this._locale}"
                            >&nbsp;(${lang.nativeText})</span
                          >
                        </nys-button>`,
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
              ></nys-textinput
            >
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

import { html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { NysElement, associateControlRefs } from "@nysds/internals";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-verticalnav.scss?inline";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-verticalnav.light.scss?inline";
import "./nys-verticalnavgroup";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

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
 * Vertical navigation component with responsive desktop/mobile behavior.
 *
 * Renders as a side navigation on desktop and collapses into a
 * `<nys-accordion>` on tablet and mobile. The default slot accepts a
 * `<ul>` of links with optional section headings (`<h2>` to `<h6>`) or
 * `<nys-verticalnavgroup>` elements. Use the `heading` slot to replace the
 * generated heading and the `footer` slot for additional content below the
 * navigation.
 *
 * @summary Responsive navigation that becomes an accordion on smaller screens.
 * @element nys-verticalnav
 *
 * @example Basic
 * ```html
 *  <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
 *    <ul>
 *      <li><a href="/">Home</a></li>
 *      <li><a href="/services">Services</a></li>
 *      <li>
 *        <h3>Freshwater Fishing Regulations</h3>
 *        <ul>
 *          <li><a href="">Places to Fish</a></li>
 *          <li><a href="">Learn to Fish</a></li>
 *          <li><a href="">Ice Fishing</a></li>
 *        </ul>
 *      </li>
 *    </ul>
 *  </nys-verticalnav>
 * ```
 *
 * @example Header slot
 * ```html
 *  <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
 *    <div slot="header">
 *      <h2>Freshwater Fishing</h2>
 *      <p>2026 Season Open</p>
 *    </div>
 *    <ul>
 *      <li><a href="/">Home</a></li>
 *      <li><a href="/services">Services</a></li>
 *      <li>
 *        <h3>Freshwater Fishing Regulations</h3>
 *        <ul>
 *          <li><a href="">Places to Fish</a></li>
 *          <li><a href="">Learn to Fish</a></li>
 *          <li><a href="">Ice Fishing</a></li>
 *        </ul>
 *      </li>
 *    </ul>
 *  </nys-verticalnav>
 * ```
 *
 * @render Header slot
 * ```html
 * <style>
 *   [slot="header"] p {
 *     margin: 0;
 *     font-size: var(--nys-font-size-xs, 0.75rem);
 *     font-weight: 500;
 *     letter-spacing: 0.08em;
 *     color: var(--nys-color-success, #2e7d32);
 *   }
 *   [slot="header"] h2 {
 *     margin: 0;
 *     font-size: var(--nys-font-size-h4, 1.25rem);
 *     color: var(--nys-color-theme, #154973);
 *   }
 * </style>
 *
 * <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
 *   <div slot="header">
 *     <h2>Freshwater Fishing</h2>
 *     <p>2026 Season Open</p>
 *   </div>
 *   <ul>
 *     <li><a href="/">Home</a></li>
 *     <li><a href="/services">Services</a></li>
 *     <li>
 *       <h3>Freshwater Fishing Regulations</h3>
 *       <ul>
 *         <li><a href="">Places to Fish</a></li>
 *         <li><a href="">Learn to Fish</a></li>
 *         <li><a href="">Ice Fishing</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example Footer slot
 * ```html
 *  <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
 *    <ul>
 *      <li><a href="/">Home</a></li>
 *      <li><a href="/services">Services</a></li>
 *      <li>
 *        <h3>Freshwater Fishing Regulations</h3>
 *        <ul>
 *          <li><a href="">Places to Fish</a></li>
 *          <li><a href="">Learn to Fish</a></li>
 *          <li><a href="">Ice Fishing</a></li>
 *        </ul>
 *      </li>
 *    </ul>
 *    <div slot="footer" style="font-size:0.875rem;color:#555;padding-top:0.5rem">
 *      <nys-divider></nys-divider>
 *      <p>Regulations last updated: January 2026</p>
 *      <a href="/contact-dec">Contact the DEC for fishing inquiries</a>
 *    </div>
 *  </nys-verticalnav>
 * ```
 *
 * @render Footer slot
 * ```html
 * <style>
 *   [slot="footer"] {
 *     display: flex;
 *     flex-direction: column;
 *     gap: var(--nys-space-100, 8px);
 *   }
 *   [slot="footer"] p {
 *     margin: 0;
 *     font-size: var(--nys-font-size-xs, 0.75rem);
 *     color: var(--nys-color-text-weak, #4a4d4f);
 *   }
 *   [slot="footer"] a {
 *     font-size: var(--nys-font-size-sm, 0.875rem);
 *     color: var(--nys-color-theme, #154973);
 *   }
 * </style>
 *
 * <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
 *   <ul>
 *     <li><a href="/">Home</a></li>
 *     <li><a href="/services">Services</a></li>
 *     <li>
 *       <h3>Freshwater Fishing Regulations</h3>
 *       <ul>
 *         <li><a href="">Places to Fish</a></li>
 *         <li><a href="">Learn to Fish</a></li>
 *         <li><a href="">Ice Fishing</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 *
 *   <div slot="footer" style="font-size:0.875rem;color:#555;padding-top:0.5rem">
 *     <nys-divider></nys-divider>
 *     <p>Regulations last updated: January 2026</p>
 *     <a href="/contact-dec">Contact the DEC for fishing inquiries</a>
 *   </div>
 * </nys-verticalnav>
 * ```
 *
 * @example Header and footer slot
 * ```html
 *  <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
 *    <div slot="header">
 *      <h2>Freshwater Fishing</h2>
 *      <p>2026 Season Open</p>
 *    </div>
 *    <ul>
 *      <li><a href="/">Home</a></li>
 *      <li><a href="/services">Services</a></li>
 *      <li>
 *        <h3>Freshwater Fishing Regulations</h3>
 *        <ul>
 *          <li><a href="">Places to Fish</a></li>
 *          <li><a href="">Learn to Fish</a></li>
 *          <li><a href="">Ice Fishing</a></li>
 *        </ul>
 *      </li>
 *    </ul>
 *    <div slot="footer">
 *      <nys-divider></nys-divider>
 *      <p>Regulations last updated: January 2026</p>
 *      <a href="/contact-dec">Contact the DEC for fishing inquiries</a>
 *    </div>
 *  </nys-verticalnav>
 * ```
 *
 * @render Header and footer slot
 * ```html
 * <style>
 *   [slot="header"] p {
 *     margin: 0;
 *     font-size: var(--nys-font-size-xs, 0.75rem);
 *     letter-spacing: 0.08em;
 *     color: var(--nys-color-success, #2e7d32);
 *     font-weight: 500;
 *   }
 *   [slot="header"] h2 {
 *     margin: 0;
 *     font-size: var(--nys-font-size-h4, 1.25rem);
 *     color: var(--nys-color-theme, #154973);
 *   }
 *   [slot="footer"] {
 *     display: flex;
 *     flex-direction: column;
 *     gap: var(--nys-space-100, 8px);
 *   }
 *   [slot="footer"] p {
 *     margin: 0;
 *     font-size: var(--nys-font-size-xs, 0.75rem);
 *     color: var(--nys-color-text-weak, #4a4d4f);
 *   }
 *   [slot="footer"] a {
 *     font-size: var(--nys-font-size-sm, 0.875rem);
 *     color: var(--nys-color-theme, #154973);
 *   }
 * </style>
 *
 * <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
 *   <div slot="header">
 *     <h2>Freshwater Fishing</h2>
 *     <p>2026 Season Open</p>
 *   </div>
 *   <ul>
 *     <li><a href="/">Home</a></li>
 *     <li><a href="/services">Services</a></li>
 *     <li>
 *       <h3>Freshwater Fishing Regulations</h3>
 *       <ul>
 *         <li><a href="">Places to Fish</a></li>
 *         <li><a href="">Learn to Fish</a></li>
 *         <li><a href="">Ice Fishing</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 *
 *   <div slot="footer">
 *     <nys-divider></nys-divider>
 *     <p>Regulations last updated: January 2026</p>
 *     <a href="/contact-dec">Contact the DEC for fishing inquiries</a>
 *   </div>
 * </nys-verticalnav>
 * ```
 *
 * @example Dropdown group
 * ```html
 * <nys-verticalnav heading="NYS Design System" headingLevel="h2">
 *   <ul>
 *     <li><a href="/">Foundations</a></li>
 *     <li><a href="/components">Components</a></li>
 *     <li>
 *       <nys-verticalnavgroup label="Accessibility">
 *         <ul>
 *           <li><a href="">WCAG Guidelines</a></li>
 *           <li><a href="">Screen Readers</a></li>
 *           <li><a href="">Color Contrast</a></li>
 *         </ul>
 *       </nys-verticalnavgroup>
 *     </li>
 *     <li>
 *       <h3>Resources</h3>
 *       <ul>
 *         <li><a href="">Design Tokens</a></li>
 *         <li><a href="">Utilities</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example Active state
 * ```html
 * <nys-verticalnav heading="NYS Design System" headingLevel="h2">
 *   <ul>
 *     <li><a href="/">Foundations</a></li>
 *     <li><a href="/components">Components</a></li>
 *     <li>
 *       <nys-verticalnavgroup label="Accessibility">
 *         <ul>
 *           <li>
 *             <a aria-current="page" href="">
 *               WCAG Guidelines
 *             </a>
 *           </li>
 *           <li><a href="">Screen Readers</a></li>
 *           <li><a href="">Color Contrast</a></li>
 *         </ul>
 *       </nys-verticalnavgroup>
 *     </li>
 *     <li>
 *       <h3>Resources</h3>
 *       <ul>
 *         <li><a href="">Design Tokens</a></li>
 *         <li><a href="">Utilities</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example Disabled state
 * An `<a>` without `href` is not a link and is not focusable, so a disabled item
 * marked only with `aria-disabled` would be conveyed by color alone and skipped by
 * keyboard users. Author disabled items with `role="link"` and `tabindex="0"` so the
 * state is reachable and announced; the component adds both automatically if omitted.
 * ```html
 * <nys-verticalnav heading="NYS Design System" headingLevel="h2">
 *   <ul>
 *     <li><a href="/">Foundations</a></li>
 *     <li><a href="/components">Components</a></li>
 *     <li>
 *       <nys-verticalnavgroup disabled label="Accessibility">
 *         <ul>
 *           <li>
 *             <a role="link" tabindex="0" aria-disabled="true">WCAG Guidelines</a>
 *           </li>
 *           <li><a href="">Screen Readers</a></li>
 *           <li><a href="">Color Contrast</a></li>
 *         </ul>
 *       </nys-verticalnavgroup>
 *     </li>
 *     <li>
 *       <h3>Resources</h3>
 *       <ul>
 *         <li>
 *           <a role="link" tabindex="0" aria-disabled="true">Design Tokens</a>
 *         </li>
 *         <li><a href="">Utilities</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example Hidden heading
 * ```html
 * <nys-verticalnav heading="NYS Design System" hideHeading>
 *   <ul>
 *     <li><a href="/">Foundations</a></li>
 *     <li><a href="/components">Components</a></li>
 *     <li>
 *       <nys-verticalnavgroup disabled label="Accessibility">
 *         <ul>
 *           <li>
 *             <a role="link" tabindex="0" aria-disabled="true">WCAG Guidelines</a>
 *           </li>
 *           <li><a href="">Screen Readers</a></li>
 *           <li><a href="">Color Contrast</a></li>
 *         </ul>
 *       </nys-verticalnavgroup>
 *     </li>
 *     <li>
 *       <h3>Resources</h3>
 *       <ul>
 *         <li>
 *           <a role="link" tabindex="0" aria-disabled="true">Design Tokens</a>
 *         </li>
 *         <li><a href="">Utilities</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example Page layout
 * ```html
 *  <div class="story-page">
 *    <nys-unavheader></nys-unavheader>
 *
 *    <nys-globalheader
 *      homepageLink="https://ny.gov"
 *      agencyName="Office of Information Technology Services"
 *    >
 *      <ul>
 *        <li><a href="https://its.ny.gov/services">Services</a></li>
 *        <li><a href="https://its.ny.gov/get-help">Help Center</a></li>
 *        <li><a href="https://its.ny.gov/cybersecurity">Cybersecurity</a></li>
 *        <li><a href="https://its.ny.gov/policies">Policies and Laws</a></li>
 *        <li><a href="https://its.ny.gov/procurement">Procurement</a></li>
 *        <li><a href="https://its.ny.gov/about-us">About Us</a></li>
 *      </ul>
 *    </nys-globalheader>
 *
 *    <div class="story-page__body">
 *      <div class="story-page__body--side">
 *        <nys-verticalnav heading="NYS Design System" headingLevel="h2">
 *          <ul>
 *            <li><a href="/">Foundations</a></li>
 *            <li><a href="/components" aria-current="page">Components</a></li>
 *            <li>
 *              <nys-verticalnavgroup label="Accessibility">
 *                <ul>
 *                  <li><a href="">WCAG Guidelines</a></li>
 *                  <li><a href="">Screen Readers</a></li>
 *                  <li><a href="">Color Contrast</a></li>
 *                </ul>
 *              </nys-verticalnavgroup>
 *            </li>
 *            <li>
 *              <h3>Resources</h3>
 *              <ul>
 *                <li><a href="">Design Tokens</a></li>
 *                <li><a href="">Utilities</a></li>
 *                <li><a href="">Learn</a></li>
 *                <li><a href="">What's New</a></li>
 *              </ul>
 *            </li>
 *          </ul>
 *        </nys-verticalnav>
 *      </div>
 *
 *      <main class="story-page__body--main">
 *        <p>Place content here.</p>
 *        <nys-button
 *          label="Toggle Expand/Collapse for vertical nav (mobile)"
 *          onclick="document.querySelector('nys-verticalnav').toggle()"
 *        ></nys-button>
 *      </main>
 *    </div>
 *
 *    <nys-globalfooter agencyName="{agencyName}" homepageLink="https://">
 *      <ul>
 *        <li><a href="https://">Privacy Policy</a></li>
 *        <li><a href="https://">Terms of Service</a></li>
 *      </ul>
 *    </nys-globalfooter>
 *
 *    <nys-unavfooter></nys-unavfooter>
 *  </div>
 * ```
 *
 * @render Page layout
 * <style>
 *  .page-layout__body {
 *    background-color: var(--nys-color-white, #ffffff);
 *  }
 *  .page-layout__nav {
 *    padding: var(--nys-space-300, 24px) var(--nys-space-50, 4px) var(--nys-space-300, 24px) 0;
 *  }
 *  .page-layout__main {
 *    padding: var(--nys-space-400, 32px);
 *  }
 *</style>
 *<div>
 *  <nys-unavheader></nys-unavheader>
 *  <nys-globalheader homepageLink="https://ny.gov" agencyName="Office of Information Technology Services">
 *    <ul>
 *      <li><a href="https://its.ny.gov/services">Services</a></li>
 *      <li><a href="https://its.ny.gov/get-help">Help Center</a></li>
 *    </ul>
 *  </nys-globalheader>
 *  <div class="page-layout__body">
 *    <div class="nys-grid-container nys-grid-gap-400">
 *      <div class="nys-grid-row">
 *        <div class="nys-desktop:nys-grid-col page-layout__nav">
 *          <nys-verticalnav heading="NYS Design System" headingLevel="h2">
 *            <ul>
 *              <li><a href="/">Foundations</a></li>
 *              <li><a href="/components">Components</a></li>
 *              <li>
 *                <nys-verticalnavgroup label="Accessibility">
 *                  <ul>
 *                    <li><a href="">WCAG Guidelines</a></li>
 *                    <li><a href="">Screen Readers</a></li>
 *                    <li><a href="">Color Contrast</a></li>
 *                  </ul>
 *                </nys-verticalnavgroup>
 *              </li>
 *              <li>
 *                <h3>Resources</h3>
 *                <ul>
 *                  <li><a href="">Design Tokens</a></li>
 *                  <li><a href="">Utilities</a></li>
 *                </ul>
 *              </li>
 *            </ul>
 *          </nys-verticalnav>
 *        </div>
 *        <main class="nys-desktop:nys-grid-col page-layout__main">
 *          <p>Place content here.</p>
 *        </main>
 *      </div>
 *    </div>
 *  </div>
 *  <nys-globalfooter agencyName="Agency Name" homepageLink="https://ny.gov">
 *    <ul>
 *      <li><a href="https://"> Privacy Policy </a></li>
 *      <li><a href="https://"> Terms of Service </a></li>
 *    </ul>
 *  </nys-globalfooter>
 *  <nys-unavfooter></nys-unavfooter>
 *</div>
 * ```
 */

export class NysVerticalnav extends NysElement {
  static styles = unsafeCSS(styles);

  /** ID for the navigation. Generated automatically if not provided. */
  @property({ type: String, reflect: true })
  id = "";

  /** Heading text displayed at the top of the navigation. Defaults to "Page navigation". */
  @property({ type: String, reflect: true })
  heading = "Page navigation";

  /** Hides the visible heading while keeping an accessible label for the navigation. */
  @property({ type: Boolean, reflect: true })
  hideHeading = false;

  /** Heading level used for the navigation heading (`h1` through `h6`). */
  @property({ type: String, reflect: true })
  headingLevel: HeadingLevel = "h2";

  /** Expands or collapses the navigation on mobile. */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  @state() private _isMobile = false;
  private _mediaQuery: MediaQueryList | null = null;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  connectedCallback() {
    // super.connectedCallback() (NysElement) auto-assigns an id when one is not
    // provided (prefix = localName, shape "nys-verticalnav-<ts>-<n>"). The
    // navigation role lives on the inner <nav> landmark, which carries the
    // accessible name, so defaultRole stays null and no host role is reflected.
    super.connectedCallback();

    adoptLightStyles();

    this._mediaQuery = window.matchMedia("(max-width: 1023px)") ?? null; // Tablet size and below
    this._isMobile = this._mediaQuery.matches ?? false;
    this._mediaQuery.addEventListener("change", this._handleResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._mediaQuery?.removeEventListener("change", this._handleResize);
  }

  updated() {
    // Crossing the 1024px breakpoint swaps the desktop and mobile templates, which
    // destroys and re-creates the <nav>. The landmark's accessible name is therefore
    // wired after EVERY render rather than once in firstUpdated().
    this._syncNavLabel();
  }

  /**
   * Public API for controlling the mobile accordion from outside the component
   * --------------------------------------------------------------------------
   */
  public open() {
    this.expanded = true;
  }

  public close() {
    this.expanded = false;
  }

  public toggle() {
    this.expanded = !this.expanded;
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  private _handleAccordionToggle = (e: CustomEvent) => {
    this.expanded = e.detail.expanded;
    this.dispatchEvent(
      new CustomEvent("nys-verticalnav-toggle", {
        detail: { id: this.id, expanded: this.expanded },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _handleResize = (e: MediaQueryListEvent) => {
    this._isMobile = e.matches;
  };

  private _handleSlotChange = () => {
    this._applyActiveState();
  };

  private _handleHeaderSlotChange = () => {
    this._syncNavLabel();
  };

  /**
   * The element a consumer supplied to the `header` slot, or null when the slot is
   * empty (in which case the generated heading renders as the slot's fallback).
   */
  private _slottedHeader(): HTMLElement | null {
    const slot = this.shadowRoot?.querySelector(
      'slot[name="header"]',
    ) as HTMLSlotElement | null;
    const assigned = (slot?.assignedElements({ flatten: false }) ??
      []) as HTMLElement[];
    return assigned[0] ?? null;
  }

  /**
   * Give the <nav> landmark an accessible name.
   *
   * The generated heading is the header slot's FALLBACK content, so it does not
   * exist once a consumer fills that slot — an `aria-labelledby` IDREF pointing at
   * it would dangle and leave the landmark unnamed (WCAG 4.1.2 / 2.4.1). When the
   * slot is filled, the name comes from the consumer's heading, which lives in the
   * light DOM and cannot be reached by an IDREF from inside the shadow root:
   * `associateControlRefs` sets the nav's own `ariaLabelledByElements` (element
   * references may point into an enclosing scope) plus a string fallback for engines
   * that do not yet honor them. The `heading` property is the intended name, so it
   * overrides the fallback string derived from the slotted content's full text.
   *
   * When the slot is empty the same-root IDREF to the generated heading is used, and
   * a hidden heading falls back to `aria-label`. All of this is applied imperatively
   * (never as template bindings) so Lit cannot fight the attributes written here.
   */
  private _syncNavLabel() {
    const nav = this.shadowRoot?.querySelector("nav");
    if (!nav) return;

    const header = this._slottedHeader();
    if (header) {
      nav.removeAttribute("aria-labelledby");
      associateControlRefs(nav, "labelledby", [header]);
      if (this.heading) nav.setAttribute("aria-label", this.heading);
      return;
    }

    // Clears any element references (and their derived string fallback) left behind
    // by a previously filled slot before the IDREF path is restored.
    associateControlRefs(nav, "labelledby", []);

    const heading = this.shadowRoot?.querySelector(
      ".nys-verticalnav__heading",
    ) as HTMLElement | null;

    if (heading && !this.hideHeading) {
      nav.setAttribute("aria-labelledby", heading.id);
      nav.removeAttribute("aria-label");
    } else {
      // Hidden heading, or the mobile template, which renders no heading of its own.
      nav.removeAttribute("aria-labelledby");
      nav.setAttribute("aria-label", this.heading);
    }
  }

  private _applyActiveState() {
    // An <a> without href exposes no link role and is not focusable, so
    // aria-disabled on it is ignored and the disabled state reads as color alone
    // (WCAG 1.4.1 / 4.1.2). Normalize it into a focusable, announced link.
    this.querySelectorAll('a[aria-disabled="true"]:not([href])').forEach(
      (a) => {
        if (!a.hasAttribute("role")) a.setAttribute("role", "link");
        if (!a.hasAttribute("tabindex")) a.setAttribute("tabindex", "0");
      },
    );

    // Auto-expand any group that contains an active link
    this.querySelectorAll("nys-verticalnavgroup").forEach((group) => {
      if (group.querySelector('a[aria-current="page"]')) {
        group.setAttribute("expanded", "");
        group.setAttribute("active", "");
      }
    });
  }

  /**
   * Helper Render Functions
   * --------------------------------------------------------------------------
   */
  private _renderHeading() {
    if (this.hideHeading) return html``;

    const headingId = `${this.id}-heading`;

    const headingTag = {
      h1: html`<h1 id=${headingId} class="nys-verticalnav__heading">
        ${this.heading}
      </h1>`,
      h2: html`<h2 id=${headingId} class="nys-verticalnav__heading">
        ${this.heading}
      </h2>`,
      h3: html`<h3 id=${headingId} class="nys-verticalnav__heading">
        ${this.heading}
      </h3>`,
      h4: html`<h4 id=${headingId} class="nys-verticalnav__heading">
        ${this.heading}
      </h4>`,
      h5: html`<h5 id=${headingId} class="nys-verticalnav__heading">
        ${this.heading}
      </h5>`,
      h6: html`<h6 id=${headingId} class="nys-verticalnav__heading">
        ${this.heading}
      </h6>`,
    };

    return html`<slot name="header" @slotchange=${this._handleHeaderSlotChange}>
      ${headingTag[this.headingLevel]}
    </slot>`;
  }

  // The <nav> landmark's accessible name is applied imperatively in
  // _syncNavLabel(); see the note there on why it is not bound in the template.
  private renderContentDesktop() {
    return html` <nav class="nys-verticalnav nys-verticalnav--desktop">
      ${this._renderHeading()}
      <slot @slotchange=${this._handleSlotChange}></slot>
      <slot name="footer"></slot>
    </nav>`;
  }

  private renderContentMobile() {
    return html` <nav class="nys-verticalnav nys-verticalnav--mobile">
      <nys-accordion bordered>
        <nys-accordionitem
          id="${this.id}-accordion"
          heading="${this.heading}"
          ?expanded=${this.expanded}
          @nys-accordionitem-toggle=${this._handleAccordionToggle}
        >
          <!-- The header slot is rendered here too: omitting it below 1024px made a
          consumer's custom header vanish entirely (WCAG 1.3.1). No fallback heading
          is needed — the accordion's own header already shows the heading text. -->
          <slot
            name="header"
            @slotchange=${this._handleHeaderSlotChange}
          ></slot>
          <slot @slotchange=${this._handleSlotChange}></slot>
          <slot name="footer"></slot>
        </nys-accordionitem>
      </nys-accordion>
    </nav>`;
  }

  render() {
    return this._isMobile
      ? this.renderContentMobile()
      : this.renderContentDesktop();
  }
}

if (!customElements.get("nys-verticalnav")) {
  customElements.define("nys-verticalnav", NysVerticalnav);
}

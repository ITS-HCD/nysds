import { html, unsafeCSS, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { NysElement } from "@nysds/internals";
// nys-button renders the CTA's call-to-action link; it's rendered inside this
// component's shadow DOM, so it must be registered whenever nys-unavfooter is
// used. Importing it here (intentional side effect) guarantees it upgrades.
import "@nysds/nys-button";
import nysLogo from "./nys-unav.logo";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-unavfooter.scss?inline";

/**
 * Accessible name for the `contentinfo` landmark, used when the consumer does not
 * override it. Pairs with the agency `nys-globalfooter`'s own name, so landmark
 * navigation can tell the statewide chrome from the site's own footer.
 */
const DEFAULT_LANDMARK_LABEL = "New York State";

/**
 * Statewide CTA endpoint, read once per page load. Sites don't opt in or out and
 * never author the content, so a CTA reads identically everywhere it appears.
 *
 * PRODUCTION: https://alerts-cta.static-assets.ny.gov/cta.json
 *
 * DEVELOPMENT: https://alerts-cta-dev.static-assets.ny.gov/cta.json
 *
 */
export const NYS_CTA_URL = "https://alerts-cta.static-assets.ny.gov/cta.json";

/** The `cta` entry in the feed. */
interface FeedCta {
  /** "on" publishes the CTA; any other value (or absence) hides it. Never rendered. */
  status?: string;
  /** Visible label of the call-to-action button. */
  buttonText?: string;
  /** Accessible name for the button, read by assistive tech instead of `buttonText`. */
  textAria?: string;
  /** Short description shown alongside the button. */
  description?: string;
  /** Destination the button links to. */
  link?: string;
}

/** `cta.json` — a single call to action, or nothing when the feed has none to show. */
interface CtaFeed {
  cta?: FeedCta;
}

/** `true` only for the feed's explicit "on" switch. */
const isPublished = (status?: string) => status?.trim().toLowerCase() === "on";

/** Identifies the CTA's `nys-button`, so its real inner control can be found after render. */
const CTA_BUTTON_ID = "nys-unavfooter__cta-button";

/**
 * Universal NYS footer with logo and statewide navigation links. Required on all NYS sites.
 *
 * Place as the last element before `</body>`. Displays NY.gov logo and links to Agencies,
 * App Directory, Counties, Events, Programs, and Services. No configuration needed.
 *
 * @accessibility
 * - Uses semantic `<footer>` element for assistive technology recognition.
 * - All links are keyboard-navigable via Tab.
 * - Proper link text for screen reader users.
 * - Links open in same window (no target="_blank") unless external policy requires otherwise.
 * - Visual design meets WCAG 2.2 AA contrast and focus indicator standards.
 * - Footer is not hidden from screen readers and is announced as navigation.
 *
 * @remarks Statewide CTA is not configurable. On load the footer reads the statewide
 * CTA endpoint and renders whatever is currently published, so a call to action
 * reaches every NYS site with no per-site work. If the endpoint is unreachable or
 * nothing is published, the footer renders normally.
 *
 * @summary Universal NYS footer with logo and statewide links. Required site-wide.
 * @element nys-unavfooter
 *
 * @example Basic
 * ```html
 * <nys-unavfooter></nys-unavfooter>
 * ```
 *
 * @example Custom landmark label
 * ```html
 * <!-- Renames the contentinfo landmark. Keep it distinct from the agency footer's. -->
 * <nys-unavfooter landmarkLabel="Statewide"></nys-unavfooter>
 * ```
 */

export class NysUnavFooter extends NysElement {
  static styles = unsafeCSS(styles);

  /**
   * Accessible name for the `contentinfo` landmark this footer renders.
   * Defaults to `"New York State"`.
   *
   * A page pairing this footer with `nys-globalfooter` carries two `contentinfo`
   * landmarks; distinct names are what keep landmark navigation useful instead of
   * announcing "content information" twice. Override only when your wording is
   * clearer for your audience — and keep it distinct from the agency footer's
   * name, which comes from that footer's visible heading.
   *
   * A blank value falls back to the default rather than leaving the landmark
   * unnamed.
   *
   * @default "New York State"
   */
  @property({ type: String }) landmarkLabel = DEFAULT_LANDMARK_LABEL;

  /** The published CTA, or `null` when nothing is published (or the feed failed). */
  @state() private _cta: FeedCta | null = null;

  /** In-flight feed request, aborted if the footer leaves the page first. */
  private _ctaRequest: AbortController | null = null;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  connectedCallback() {
    // super.connectedCallback() (NysElement) assigns an auto-
    // generated id when one is not provided. The contentinfo/navigation
    // landmarks stay on the inner <footer>/<nav> elements, so this component
    // intentionally keeps defaultRole = null and does not move a role to the
    // host.
    super.connectedCallback();
    // Also covers re-attachment, where the pending request was aborted on the way out
    this._loadCta();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Don't leave a pending request pointed at a detached element
    this._ctaRequest?.abort();
    this._ctaRequest = null;
  }

  protected updated(changed: PropertyValues) {
    super.updated(changed);
    // Writes ARIA into nys-button's shadow root, so it has to run after every
    // render — a newly published CTA renders a brand new button.
    this._syncCtaButtonAria();
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

    // The logo is decorative; the surrounding link already carries an
    // accessible name, so hide the SVG from the accessibility tree.
    svgElement.setAttribute("aria-hidden", "true");
    svgElement.setAttribute("focusable", "false");

    return svgElement;
  }

  /**
   * The contentinfo's accessible name. A blank override would put the page back
   * where #1795 found it — two unnamed contentinfo landmarks — so it falls back
   * to the default.
   */
  private get _landmarkLabel(): string {
    return this.landmarkLabel?.trim() || DEFAULT_LANDMARK_LABEL;
  }

  /**
   * Statewide CTA
   * --------------------------------------------------------------------------
   * Content comes from the CTA feed, never from the consuming page, so the same
   * call to action renders identically everywhere it is shown. A missing,
   * malformed, or unreachable feed leaves the footer untouched — a CTA failing
   * to load must never take a site's navigation down with it.
   */

  private async _loadCta() {
    if (typeof fetch !== "function") return;

    this._ctaRequest?.abort();
    const request = new AbortController();
    this._ctaRequest = request;

    const feed = await this._readCtaFeed(request);
    if (!feed?.cta || !isPublished(feed.cta.status)) return;

    this._cta = feed.cta;
  }

  /** Fetches the CTA feed. Resolves to null on any failure. */
  private async _readCtaFeed(request: AbortController) {
    try {
      const response = await fetch(NYS_CTA_URL, {
        signal: request.signal,
        credentials: "omit",
        // A CTA that is switched off must go away everywhere on the next page
        // load, so never read (or write) the HTTP cache for this
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Responded with ${response.status}`);
      }

      const feed = (await response.json()) as CtaFeed;
      // A late response for a footer that has since been detached is dead weight
      return request.signal.aborted ? null : feed;
    } catch {
      return null;
    }
  }

  /**
   * `nys-button` has no `ariaLabel` prop, and the host itself carries no role
   * (ARIA placed there never reaches the real control) — so a `textAria` that
   * differs from the button's visible `buttonText` has to be written directly
   * onto the real inner `<button>`/`<a>` once nys-button renders, the same way
   * `nys-unavheader` syncs ARIA onto its own buttons.
   */
  private async _syncCtaButtonAria() {
    const textAria = this._cta?.textAria?.trim();
    if (!textAria) return;

    const button = this.shadowRoot?.getElementById(CTA_BUTTON_ID) as
      | (HTMLElement & { updateComplete?: Promise<unknown> })
      | null;
    if (!button) return;

    // The inner button/link only exists once nys-button has rendered.
    await button.updateComplete;
    const control = button.shadowRoot?.querySelector(".nys-button") ?? button;
    control.setAttribute("aria-label", textAria);
  }

  private _renderCta() {
    if (!this._cta) return nothing;

    const { buttonText, description, link } = this._cta;

    return html`
      <div class="nys-unavfooter__cta">
        ${buttonText?.trim()
          ? html`<nys-button
              id="${CTA_BUTTON_ID}"
              class="nys-unavfooter__cta-button"
              label="${buttonText}"
              href="${ifDefined(link || undefined)}"
              style="
              --nys-button-background-color: var(--nys-color-ink-reverse, #ffffff);
              --nys-button-color: var(--nys-color-ink, #b1b1b1);
              --nys-button-background-color--hover: var(--nys-color-accent, #face00);
              --nys-button-color--hover: var(--nys-color-ink, #b1b1b1);"
            ></nys-button>`
          : nothing}
        ${description
          ? html`<p class="nys-unavfooter__cta-text">${description}</p>`
          : nothing}
      </div>
    `;
  }

  render() {
    // The statewide footer sits below an agency's own `nys-globalfooter`, so a page
    // normally carries two contentinfo landmarks. Naming this one keeps landmark
    // navigation meaningful instead of announcing "content information" twice (axe
    // `landmark-unique`); the agency footer is named after the agency. `landmarkLabel`
    // lets a consumer reword this one without giving up the distinction.
    return html`
      <footer class="nys-unavfooter" aria-label=${this._landmarkLabel}>
        <div class="nys-unavfooter__main-container">
          <div class="nys-unavfooter__container_menu">
            <div class="nys-unavfooter__logo">
              <a
                href="https://www.ny.gov"
                target="_blank"
                rel="noopener noreferrer"
                id="nys-unavheader__logolink"
                aria-label="New York State home page (opens in a new tab)"
                >${this._getNysLogo()}</a
              >
            </div>
            <nav class="nys-unavfooter__content" aria-label="New York State">
              <ul>
                <li><a href="https://www.ny.gov/agencies">Agencies</a></li>
                <li>
                  <a href="https://www.ny.gov/mobileapps">App Directory</a>
                </li>
                <li><a href="https://www.ny.gov/counties">Counties</a></li>
                <li><a href="https://www.ny.gov/events">Events</a></li>
                <li><a href="https://www.ny.gov/programs">Programs</a></li>
                <li><a href="https://www.ny.gov/services">Services</a></li>
              </ul>
            </nav>
          </div>
          ${this._renderCta()}
        </div>
      </footer>
    `;
  }
}

if (!customElements.get("nys-unavfooter")) {
  customElements.define("nys-unavfooter", NysUnavFooter);
}

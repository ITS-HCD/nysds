import { html, unsafeCSS, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { NysElement } from "@nysds/internals";
// This element is created imperatively (document.createElement) after each
// slotted <span> section heading, so it must be registered whenever
// nys-globalfooter is used. Importing it here (intentional side effect)
// guarantees it always renders.
import "@nysds/nys-divider";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-globalfooter.scss?inline";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-globalfooter.light.scss?inline";

/**
 * Accessible name for the `contentinfo` landmark when the footer carries no
 * agency name to reference and the consumer supplied no override.
 */
const DEFAULT_LANDMARK_LABEL = "Site";

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
 * Agency-branded footer with agency name and slotted content sections. Auto-layouts based on content structure.
 *
 * Place above `nys-unavfooter`. Slot contact info, links, or other content. Use `<h4>` elements
 * to create multi-column layouts; without `<h4>`, renders as compact single section.
 *
 * @summary Agency footer with auto-layout for contact info and link sections.
 * @element nys-globalfooter
 *
 * @slot - Footer content (links, contact info). Use `<h4>` for column headings.
 *
 * @example Basic
 * ```html
 * <nys-globalfooter agencyName="Office of Information Technology Services"></nys-globalfooter>
 * ```
 *
 * @example Homepage Link
 * ```html
 * <nys-globalfooter
 *   agencyName="Office of Information Technology Services"
 *   homepageLink="https://its.ny.gov"
 * ></nys-globalfooter>
 * ```
 *
 * @example Menu Links
 * ```html
 * <nys-globalfooter agencyName="Office of Information Technology Services">
 *   <ul>
 *     <li><a href="https://its.ny.gov">ITS Home</a></li>
 *     <li><a href="https://its.ny.gov/about-us">About ITS</a></li>
 *   </ul>
 * </nys-globalfooter>
 * ```
 *
 * @example Column Links
 * ```html
 * <nys-globalfooter agencyName="Office of Information Technology Services">
 *   <ul>
 *     <li>
 *       <span>About</span>
 *       <ul>
 *         <li><a href="https://its.ny.gov/about-us">About ITS</a></li>
 *         <li><a href="https://its.ny.gov/contact-us">Contact</a></li>
 *         <li><a href="https://its.ny.gov/policies">Policies</a></li>
 *       </ul>
 *     </li>
 *     <li>
 *       <span>Resources</span>
 *       <ul>
 *         <li><a href="https://its.ny.gov/resources">Developer Tools</a></li>
 *         <li><a href="https://its.ny.gov/accessibility">Accessibility</a></li>
 *         <li><a href="https://its.ny.gov/privacy">Privacy</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 * </nys-globalfooter>
 * ```
 *
 * @example Subheading
 * ```html
 * <nys-globalfooter
 *   agencyName="Office of Information Technology Services"
 *   agencySubheading="Innovating Technology for a Better New York"
 * ></nys-globalfooter>
 * ```
 *
 * @example Custom landmark label
 * ```html
 * <!-- Names the contentinfo landmark directly instead of from the visible
 *      heading. Keep it distinct from nys-unavfooter's ("New York State"). -->
 * <nys-globalfooter
 *   agencyName="Office of Information Technology Services"
 *   landmarkLabel="ITS"
 * ></nys-globalfooter>
 * ```
 */

export class NysGlobalFooter extends NysElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Agency name displayed as the footer heading. */
  @property({ type: String }) agencyName = "";

  /** Optional subheading displayed below the agency name. */
  @property({ type: String }) agencySubheading = "";

  /** URL for the agency name link. If empty, name is not clickable. */
  @property({ type: String }) homepageLink = "";

  /**
   * Accessible name for the `contentinfo` landmark this footer renders.
   *
   * Leave it unset and the landmark is named after the visible `agencyName`
   * heading, which cannot drift out of sync and is translated with the rest of
   * the page. Falls back to `"Site"` when there is no agency name to reference.
   *
   * Set this only when the agency name is not right for your audience. A page
   * pairing this with `nys-unavfooter` carries two `contentinfo` landmarks, so
   * the name must stay distinct from that footer's (`"New York State"` by
   * default) or landmark navigation stops distinguishing them.
   *
   * An explicit name replaces the reference to the visible heading.
   */
  @property({ type: String }) landmarkLabel = "";

  @state() private slotHasContent = true;

  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */

  connectedCallback() {
    super.connectedCallback();
    adoptLightStyles();
  }

  firstUpdated() {
    // Check for slot content after rendering
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    slot?.addEventListener("slotchange", () => this._handleSlotChange());
    this._handleSlotChange(); // Initial check
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  // Gets called when the slot content changes.
  // Slotted elements stay in the light DOM (styled via adoptLightStyles) and projected in the <slot>.
  private async _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    if (!slot) return;

    const assignedNodes = slot
      ?.assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE) as Element[]; // Filter to elements only

    await Promise.resolve(); // Wait for current update cycle to complete before modifying reactive state (solves the lit issue "scheduled an update")

    this.slotHasContent = assignedNodes.length > 0;

    // Determine layout based on content structure
    const container = this.shadowRoot?.querySelector(
      ".nys-globalfooter__content",
    );
    const hasMultipleGroups = assignedNodes?.some(
      (node) => node.tagName === "H4",
    );

    this.classList.toggle("columns", hasMultipleGroups);
    this.classList.toggle("small", !hasMultipleGroups);

    container?.classList.toggle("columns", hasMultipleGroups);
    container?.classList.toggle("small", !hasMultipleGroups);

    assignedNodes.forEach((node) => {
      const spans =
        node.tagName === "SPAN"
          ? [node]
          : Array.from(node.querySelectorAll("span"));

      spans.forEach((span) => {
        if (span.nextElementSibling?.tagName !== "NYS-DIVIDER") {
          const divider = document.createElement("nys-divider");
          divider.classList.add("divider");
          span.insertAdjacentElement("afterend", divider);
        }
      });
    });
  }

  /**
   * Id of the heading that names the contentinfo landmark, or undefined when no
   * agency name was given.
   *
   * The documented pairing puts this footer above `nys-unavfooter`, which leaves a
   * page with two `contentinfo` landmarks. Pointing at the visible heading rather
   * than repeating the agency name in an `aria-label` keeps the two in sync and lets
   * the name be translated along with the rest of the page.
   */
  private get _contentinfoLabelledBy(): string | undefined {
    // An explicit name is the author saying the visible heading is not the right
    // one; pointing at it anyway would put both on the landmark.
    if (this._landmarkLabelOverride) return undefined;
    return this.agencyName?.trim() ? `${this.id}-name` : undefined;
  }

  /** The author's landmark name, or undefined when they gave none. */
  private get _landmarkLabelOverride(): string | undefined {
    return this.landmarkLabel?.trim() || undefined;
  }

  /**
   * Literal name for the contentinfo: the author's override, or the "Site"
   * default when there is no agency heading to reference. Undefined whenever
   * `_contentinfoLabelledBy` has something to point at, so the landmark never
   * carries both.
   */
  private get _contentinfoLabel(): string | undefined {
    if (this._landmarkLabelOverride) return this._landmarkLabelOverride;
    return this._contentinfoLabelledBy ? undefined : DEFAULT_LANDMARK_LABEL;
  }

  render() {
    const heading = html`<h2
      id="${this.id}-name"
      class="nys-globalfooter__name"
    >
      ${this.agencyName}
    </h2>`;

    return html`
      <footer
        class="nys-globalfooter"
        aria-labelledby=${ifDefined(this._contentinfoLabelledBy)}
        aria-label=${ifDefined(this._contentinfoLabel)}
      >
        <div class="nys-globalfooter__main-container">
          <div class="nys-globalfooter__heading-container">
            ${!this.homepageLink?.trim()
              ? heading
              : html`<a href=${this.homepageLink?.trim()}>${heading}</a>`}
            ${this.agencySubheading
              ? html`<p class="nys-globalfooter__subheading">
                  ${this.agencySubheading}
                </p>`
              : nothing}
          </div>
          ${this.slotHasContent
            ? html`<div class="nys-globalfooter__content">
                <slot @slotchange="${this._handleSlotChange}"></slot>
              </div>`
            : ""}
        </div>
      </footer>
    `;
  }
}

if (!customElements.get("nys-globalfooter")) {
  customElements.define("nys-globalfooter", NysGlobalFooter);
}

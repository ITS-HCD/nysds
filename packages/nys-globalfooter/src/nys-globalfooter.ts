import { LitElement, html, unsafeCSS, nothing } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-globalfooter.scss?inline";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-globalfooter.light.scss?inline";

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
 */

export class NysGlobalFooter extends LitElement {
  static styles = unsafeCSS(styles);

  /** Agency name displayed as the footer heading. */
  @property({ type: String }) agencyName = "";

  /** Optional subheading displayed below the agency name. */
  @property({ type: String }) agencySubheading = "";

  /** URL for the agency name link. If empty, name is not clickable. */
  @property({ type: String }) homepageLink = "";
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

  render() {
    return html`
      <footer class="nys-globalfooter">
        <div class="nys-globalfooter__main-container">
          <div class="nys-globalfooter__heading-container">
            ${!this.homepageLink?.trim()
              ? html`<h2 class="nys-globalfooter__name">${this.agencyName}</h2>`
              : html`<a href=${this.homepageLink?.trim()}>
                  <h2 class="nys-globalfooter__name">${this.agencyName}</h2>
                </a>`}
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

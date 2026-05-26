import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-globalfooter.scss?inline";

/**
 * Agency-branded footer with agency name and slotted content sections. Auto-layouts based on content structure.
 *
 * **Status:** Stable | **WCAG:** 2.2 AA
 *
 * Place above `nys-unavfooter`. Slot contact info, links, or other content. Use `<h4>` elements
 * to create multi-column layouts; without `<h4>`, renders as compact single section.
 * All slotted content is auto-sanitized to remove dangerous elements (script, iframe, object, embed, img).
 *
 * ## When to use
 * - Use `nys-globalfooter` to provide consistent access to essential links (contact details, privacy,
 *   terms of use) across all pages
 * - Ideal for displaying organizational information and secondary navigation
 *
 * Avoid for:
 * - Don't use the global footer for primary navigation or highly interactive features
 * - Avoid adding content that is not relevant or essential for all pages
 *
 * ## Content structure
 * For a simple footer without columns, slot plain content (text, links).
 * For multi-column layout, use `<h4>` headings to define column groups. Each `<h4>` signals
 * a new column. Content between headings becomes that column's content.
 *
 * Place a `<ul>` with `<li><a>` elements inside the footer for link lists.
 * Minimize the number of links to keep users focused and avoid distractions.
 *
 * ## Agency name linking
 * Use the `homepageLink` prop to make the `agencyName` clickable and link to your homepage.
 *
 * ## Accessibility
 * - Proper use of `<footer>` and `<a>` elements ensures compatibility with assistive technologies
 * - Keyboard navigation: Users can tab through all links in the footer
 * - All slotted content is validated and sanitized before rendering
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Set `agencyName` to your agency's full official name (e.g., "Office of Information Technology Services").
 * - Set `homepageLink` to make the agency name a clickable link back to your site's homepage.
 * - Keep footer link lists concise. Group related links under `<span>` headings when you have more than 5-6 links.
 * - Place `<nys-globalfooter>` above `<nys-unavfooter>` and below your page content and `<nys-backtotop>`.
 *
 * **Don't:**
 * - Use the Global Footer for primary navigation or interactive features. Use `<nys-globalheader>` for primary navigation.
 * - Include page-specific content that only applies to certain sections of your site.
 * - Embed `<script>`, `<iframe>`, `<object>`, or `<img>` elements in slotted content. These are sanitized and removed by the component for security.
 *
 * @summary Agency footer with auto-layout for contact info and link sections.
 * @element nys-globalfooter
 *
 * @slot - Footer content (links, contact info). Use `<h4>` for column headings.
 *
 * @example Simple footer
 * ```html
 * <nys-globalfooter agencyName="Department of Health" homepageLink="/">
 *   <span>123 Main St, Albany NY</span>
 *   <span>info@health.ny.gov</span>
 * </nys-globalfooter>
 * ```
 *
 * @example With menu links
 * ```html
 * <nys-globalfooter agencyName="Department of Health" homepageLink="/">
 *   <ul>
 *     <li><a href="/about">About Us</a></li>
 *     <li><a href="/contact">Contact</a></li>
 *     <li><a href="/privacy">Privacy Policy</a></li>
 *   </ul>
 * </nys-globalfooter>
 * ```
 *
 * @example With column links
 * ```html
 * <nys-globalfooter agencyName="Department of Health" homepageLink="/">
 *   <ul>
 *     <li>
 *       <span>Services</span>
 *       <ul>
 *         <li><a href="/licenses">Licenses</a></li>
 *         <li><a href="/permits">Permits</a></li>
 *       </ul>
 *     </li>
 *     <li>
 *       <span>Resources</span>
 *       <ul>
 *         <li><a href="/guides">Guides</a></li>
 *         <li><a href="/faq">FAQ</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 * </nys-globalfooter>
 * ```
 */

export class NysGlobalFooter extends LitElement {
  static styles = unsafeCSS(styles);

  /** Agency name displayed as the footer heading. */
  @property({ type: String }) agencyName = "";

  /** URL for the agency name link. If empty, name is not clickable. */
  @property({ type: String }) homepageLink = "";
  @state() private slotHasContent = true;

  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */

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

  // Gets called when the slot content changes and directly appends the slotted elements into the shadow DOM
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

    // Toggle layout classes
    if (container) {
      container.classList.toggle("columns", hasMultipleGroups);
      container.classList.toggle("small", !hasMultipleGroups);

      container.innerHTML = "";

      // Clone and append slotted elements into the shadow DOM container
      assignedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const cleanNode = node.cloneNode(true);

          // Remove <script>, <iframe>, <object>, and any potentially dangerous elements XSS
          const dangerousTags = ["script", "iframe", "object", "embed", "img"];
          dangerousTags.forEach((tag) => {
            (cleanNode as Element)
              .querySelectorAll(tag)
              .forEach((element) => element.remove());
          });
          container.appendChild(cleanNode);
          node.remove(); // Remove from light DOM to avoid duplication
        }
      });

      const spans = container.querySelectorAll("span");
      spans.forEach((span) => {
        const divider = document.createElement("nys-divider");
        divider.classList.add("divider");
        span.insertAdjacentElement("afterend", divider);
      });
    }
  }

  render() {
    return html`
      <footer class="nys-globalfooter">
        <div class="nys-globalfooter__main-container">
          ${!this.homepageLink?.trim()
            ? html`<h2 class="nys-globalfooter__name">${this.agencyName}</h2>`
            : html`<a href=${this.homepageLink?.trim()}>
                <h2 class="nys-globalfooter__name">${this.agencyName}</h2>
              </a>`}
          ${this.slotHasContent
            ? html`<div class="nys-globalfooter__content">
                <slot
                  style="display: hidden"
                  @slotchange="${this._handleSlotChange}"
                ></slot>
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

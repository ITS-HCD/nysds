import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-globalfooter.scss?inline";

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
 * @example Simple footer
 * ```html
 * <nys-globalfooter agencyName="Department of Health" homepageLink="/">
 *   <span>123 Main St, Albany NY</span>
 *   <span>info@health.ny.gov</span>
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

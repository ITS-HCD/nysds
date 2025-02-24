import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-globalfooter.styles";

export class NysGlobalFooter extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) agencyName = "";
  @property({ type: String }) homepageLink = "";
  @state() private slotHasContent = true;

  /**************** Lifecycle Methods ****************/

  firstUpdated() {
    // Check for slot content after rendering
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    slot?.addEventListener("slotchange", () => this._handleSlotChange());
    this._handleSlotChange(); // Initial check
  }

  /******************** Functions ********************/
  // Gets called when the slot content changes and directly appends the slotted elements into the shadow DOM
  private _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    if (!slot) return;

    const assignedNodes = slot
      ?.assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE) as Element[]; // Filter to elements only

    // Update slotHasContent based on assigned elements
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

      // Clear existing children in the container
      container.innerHTML = "";

      // Clone and append slotted elements into the shadow DOM container
      assignedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const cleanNode = node.cloneNode(true);

          // Remove <script>, <iframe>, <object>, and any potentially dangerous elements XSS
          const dangerousTags = ["script", "iframe", "object", "embed"];
          dangerousTags.forEach((tag) => {
            (cleanNode as Element)
              .querySelectorAll(tag)
              .forEach((element) => element.remove());
          });
          container.appendChild(cleanNode);
          node.remove(); // Remove from light DOM to avoid duplication
        }
      });
    }
  }

  render() {
    return html`
      <footer class="nys-globalfooter">
        <div class="nys-globalfooter__main-container">
          ${!this.homepageLink?.trim()
            ? html`<p class="nys-globalfooter__name">${this.agencyName}</p>`
            : html`<a
                href=${this.homepageLink?.trim()}
              >
                <p class="nys-globalfooter__name">${this.agencyName}</p>
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

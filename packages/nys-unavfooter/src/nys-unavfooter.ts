import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import styles from "./nys-unavfooter.styles";
import nysLogo from "./nys-unav.logo";

@customElement("nys-unavfooter")
export class NysUnavFooter extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @state() private slotHasContent = true;

  /**************** Lifecycle Methods ****************/
  firstUpdated() {
    // Check for slot content after rendering
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    slot?.addEventListener("slotchange", () => this._handleSlotChange());
    this._handleSlotChange(); // Initial check
  }

  private _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    const assignedNodes = slot
      ?.assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE) as Element[]; // Filter to elements only

    // Update slotHasContent based on assigned elements
    this.slotHasContent = assignedNodes.length > 0;

    // Determine layout based on content structure
    const container = this.shadowRoot?.querySelector(
      ".nys-unavfooter__content",
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

  private _getNysLogo() {
    if (!nysLogo) return null;

    // Parse the SVG string into an actual SVG DOM element
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(nysLogo, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    return svgElement;
  }

  render() {
    return html`
      <footer class="nys-unavfooter">
        <div class="nys-unavfooter__container_menu">
          <div class="nys-unavfooter__logo">${this._getNysLogo()}</div>
          ${this.slotHasContent
            ? html`<div class="nys-unavfooter__content">
                <slot
                  style="display: hidden"
                  @slotchange="${this._handleSlotChange}"
                ></slot>
              </div>`
          : ""}
        </div>
        <div class="nys-unavfooter__container_language">
          <div class="nys-unavfooter__translate">
          </div>
          <div class="nys-unavfooter__language_menu">
            <a href="https://www.ny.gov/" target="_blank">English</a>
            <a href="https://www.ny.gov/" target="_blank">Spanish</a>
      </footer>
    `;
  }
}

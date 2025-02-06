import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-globalheader.styles";

@customElement("nys-globalheader")
export class NysGlobalHeader extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) appName = "";
  @property({ type: String }) agencyName = "";
  @state() private slotHasContent = true;

  /**************** Lifecycle Methods ****************/

  firstUpdated() {
    // Check for slot content after rendering
    const slot =
      this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="text"]');
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

    // Get the container to append the slotted elements
    const container = this.shadowRoot?.querySelector(
      ".nys-globalheader__content",
    );

    if (container) {
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
      <header class="nys-globalheader">
        <div class="nys-globalheader__main-container">
          <div class="nys-globalheader__name-container">
            ${this.appName?.trim().length > 0
              ? html`<div
                  class="nys-globalheader__appName nys-globalheader__name"
                >
                  ${this.appName}
                </div>`
              : ""}
            ${this.agencyName?.trim().length > 0
              ? html`<div
                  class="nys-globalheader__agencyName nys-globalheader__name ${this.appName?.trim()
                    .length > 0
                    ? ""
                    : "main"}"
                >
                  ${this.agencyName}
                </div>`
              : ""}
          </div>
          ${this.slotHasContent
            ? html`<div class="nys-globalheader__content">
                <slot
                  style="display: hidden"
                  @slotchange="${this._handleSlotChange}"
                ></slot>
              </div>`
            : ""}
        </div>
      </header>
    `;
  }
}

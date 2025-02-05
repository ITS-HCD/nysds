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
    slot?.addEventListener("slotchange", () => this._checkSlotContent());
    this._checkSlotContent(); // Initial check
  }

  /******************** Functions ********************/
  private _checkSlotContent() {
    const slot =
      this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="text"]');
    if (slot) {
      const assignedNodes = (slot as HTMLSlotElement).assignedNodes({
        flatten: true,
      });
      this.slotHasContent = assignedNodes.length > 0; // Update state based on slot content
    } else {
      this.slotHasContent = false; // If no slot found, assume no content
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
                <slot name="text"></slot>
              </div>`
            : ""}
        </div>
      </header>
    `;
  }
}

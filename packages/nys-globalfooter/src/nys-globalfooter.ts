import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-globalfooter.styles";

@customElement("nys-globalfooter")
export class NyGlobalFooter extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
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
      <footer class="nys-globalfooter">
        <h1 class="nys-globalfooter__name">${this.agencyName}</h1>
        ${this.slotHasContent
          ? html`<div class="nys-globalfooter__content">
              <slot name="text"></slot>
            </div>`
          : ""}
      </footer>
    `;
  }
}

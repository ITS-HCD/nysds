import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-globalfooter.styles";

let globalFooterIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-globalfooter")
export class NyGlobalFooter extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) id = "";
  @property({ type: String }) agencyName = "";
  @state() private slotHasContent = true;

  /**************** Lifecycle Methods ****************/

  connectedCallback() {
    super.connectedCallback();

    // Generate a unique ID if not provided
    if (!this.id) {
      this.id = this._generateUniqueId();
    }
  }

  firstUpdated() {
    // Check for slot content after rendering
    this._checkSlotContent();
  }

  /******************** Functions ********************/
  private _generateUniqueId() {
    return `nys-globalfooter-${Date.now()}-${globalFooterIdCounter++}`;
  }

  private _checkSlotContent() {
    console.log("This is shadowRoot in global footer: ", this.shadowRoot);
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="text"]');
    console.log("This is slot in global footer: ", slot);
    if (slot) {
      const assignedNodes = (slot as HTMLSlotElement).assignedNodes({ flatten: true });
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

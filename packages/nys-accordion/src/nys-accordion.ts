import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-accordion.styles";
import "@nysds/nys-button";

let accordionIdCounter = 0; // Counter for generating unique IDs

export class NysAccordion extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: Boolean }) isOpen = false; // Property to track the open state

  static styles = styles;

  /**************** Lifecycle Methods ****************/
  static formAssociated = true; // allows use of elementInternals' API

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    // Generate a unique ID if not provided
    if (!this.id) {
      this.id = this._generateUniqueId();
    }
  }

  /******************** Functions ********************/
  private _generateUniqueId() {
    return `nys-accordion-${Date.now()}-${accordionIdCounter++}`;
  }

  private _toggleContent() {
    this.isOpen = !this.isOpen;
  }

  /******************** Event Handlers ********************/
  // Handle focus event
  // private _handleFocus() {
  //   this.dispatchEvent(new Event("focus"));
  // }

  // // Handle blur event
  // private _handleBlur() {
  //   this.dispatchEvent(new Event("blur"));
  // }

  // // Handle focus event
  // private _handleClick() {
  //   this.dispatchEvent(new Event("click"));
  // }

  render() {
    return html`
      <div class="nys-accordion">
        <button class="nys-accordion__header" @click="${this._toggleContent}">
          <label for="${this.id}">Accordion</label>
          <nys-icon name="chevron_down"></nys-icon>
        </button>
        <div class="nys-accordion__content" ?open="${this.isOpen}">content</div>
      </div>
    `;
  }
}

if (!customElements.get("nys-accordion")) {
  customElements.define("nys-accordion", NysAccordion);
}

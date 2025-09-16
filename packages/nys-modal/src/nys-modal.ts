import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-modal.styles";

let componentIdCounter = 0; // Counter for generating unique IDs

export class NysModal extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";

  static styles = styles;

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }


  /******************** Functions ********************/
  // Placeholder for generic functions (component-specific)

  /****************** Event Handlers ******************/
  // Placeholder for event handlers if needed

  render() {
    return html`<div class="nys-modal"></div>`;
  }
}

if (!customElements.get("nys-modal")) {
  customElements.define("nys-modal", NysModal);
}

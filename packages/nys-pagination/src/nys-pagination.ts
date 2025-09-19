import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-pagination.styles";

let componentIdCounter = 0; // Counter for generating unique IDs

export class NysPagination extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";

  static styles = styles;

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-pagination-${Date.now()}-${componentIdCounter++}`;
    }
  }

  /******************** Functions ********************/
  // Placeholder for generic functions (component-specific)

  /****************** Event Handlers ******************/
  // Placeholder for event handlers if needed

  render() {
    return html`<div class="nys-pagination">
      <nys-button
        id="previous"
        label="Previous"
        prefixIcon="chevron_left"
        variant="outline"
      ></nys-button>
      <nys-button label="1" variant="outline"></nys-button>
      <nys-button label="2" variant="outline"></nys-button>
      <nys-button label="3" variant="outline"></nys-button>
      <nys-button id="spacer" label="..." variant="ghost"></nys-button>
      <nys-button label="10" variant="outline"></nys-button>
      <nys-button
        id="next"
        label="Next"
        suffixIcon="chevron_right"
        variant="outline"
      ></nys-button>
    </div>`;
  }
}

if (!customElements.get("nys-pagination")) {
  customElements.define("nys-pagination", NysPagination);
}

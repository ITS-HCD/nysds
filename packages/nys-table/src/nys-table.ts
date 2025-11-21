import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-table.scss?inline";

let componentIdCounter = 0; // Counter for generating unique IDs

export class NysTable extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-table-${Date.now()}-${componentIdCounter++}`;
    }
  }

  /******************** Functions ********************/
  // Placeholder for generic functions (component-specific)

  /****************** Event Handlers ******************/
  // Placeholder for event handlers if needed

  render() {
    return html` <div class="nys-table">
      <slot></slot>
    </div>`;
  }
}

if (!customElements.get("nys-table")) {
  customElements.define("nys-table", NysTable);
}

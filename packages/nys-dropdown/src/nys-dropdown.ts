import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-dropdown.styles";
import "@nysds/nys-button";

let dropdownIdCounter = 0; // Counter for generating unique IDs

export class NysDropdown extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: String }) label = "";
  @property({ type: Boolean }) dropdownVisible = true;

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
    return `nys-dropdown-${Date.now()}-${dropdownIdCounter++}`;
  }

  private _toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
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
      <div class="nys-dropdown">
        <nys-button
          for="${this.id}"
          @click="${this._toggleDropdown}"
          label="${this.label}"
          variant="ghost"
          fullWidth
        ></nys-button>
        <div class="nys-dropdown__content" ?open="${this.dropdownVisible}">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-dropdown")) {
  customElements.define("nys-dropdown", NysDropdown);
}

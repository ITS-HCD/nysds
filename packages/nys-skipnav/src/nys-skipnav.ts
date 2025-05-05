import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-skipnav.styles";

let skipnavIdCounter = 0; // Counter for generating unique IDs

export class NysSkipnav extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) href = "";
  @property({ type: Boolean }) demoVisible = false; // For demo purposes only

  static styles = styles;

  constructor() {
    super();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-skipnav-${Date.now()}-${skipnavIdCounter++}`;
    }
  }

  /**************** Event Handlers ****************/
  private _handleFocus() {
    const linkElement = this.shadowRoot?.querySelector(".nys-skipnav__link");
    this.dispatchEvent(new Event("focus"));

    linkElement?.classList.add("show");
  }

  private _handleBlur() {
    const linkElement = this.shadowRoot?.querySelector(".nys-skipnav__link");
    this.dispatchEvent(new Event("blur"));

    if (!this.demoVisible) {
      linkElement?.classList.remove("show"); // Link is hidden whenever not focused unless the demoVisible is true (aka we're showing it for reference sites)
    }
  }

  render() {
    return html`
      <div class="nys-skipnav">
        <a
          id=${this.id}
          href=${this.href ? this.href : "#main-content"}
          tabindex="0"
          class="nys-skipnav__link ${this.demoVisible ? "demo" : ""}"
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
        >
          Skip to main content
        </a>
      </div>
    `;
  }
}

if (!customElements.get("nys-skipnav")) {
  customElements.define("nys-skipnav", NysSkipnav);
}

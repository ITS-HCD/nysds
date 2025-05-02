import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-skipnav.styles";

export class NysSkipnav extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) href = "";
  @property({ type: Boolean }) demoVisible = false; // For demo purposes only

  static styles = styles;

  constructor() {
    super();
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
          href=${this.href ? this.href : "#main-content"}
          tabindex="0"
          class="nys-skipnav__link ${this.demoVisible ? "show" : ""}"
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

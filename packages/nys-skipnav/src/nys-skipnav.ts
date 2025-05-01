import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-skipnav.styles";

export class NysSkipnav extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) href = "";

  static styles = styles;

  constructor() {
    super();
  }

  /**************** Event Handlers ****************/
  // Handle focus event
  private _handleFocus() {
    const linkElement = this.shadowRoot?.querySelector(".nys-skipnav__link");
    this.dispatchEvent(new Event("focus"));

    linkElement?.classList.add("show"); // Make link appear on focus
  }

  private _handleBlur() {
    const linkElement = this.shadowRoot?.querySelector(".nys-skipnav__link");
    this.dispatchEvent(new Event("blur"));

    linkElement?.classList.remove("show"); // Link is hidden whenever not focused
  }

  render() {
    return html`
      <div class="nys-skipnav">
        <a
          href=${this.href ? this.href : "#main-content"}
          tabindex="0"
          class="nys-skipnav__link"
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}">
          Skip to main content
        </a>
      </div>
    `;
  }
}

if (!customElements.get("nys-skipnav")) {
  customElements.define("nys-skipnav", NysSkipnav);
}

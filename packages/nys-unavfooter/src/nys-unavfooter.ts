import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import styles from "./nys-unavfooter.styles";
import nysLogo from "./nys-unav.logo";

@customElement("nys-unavfooter")
export class NysUnavFooter extends LitElement {
  static styles = styles;

  /**************** Functions ****************/
  private _getNysLogo() {
    if (!nysLogo) return null;

    // Parse the SVG string into an actual SVG DOM element
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(nysLogo, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    return svgElement;
  }

  render() {
    return html`
      <footer class="nys-unavfooter">
        <div class="nys-unavfooter__main-container">
          <div class="nys-unavfooter__container_menu">
            <div class="nys-unavfooter__logo">
              <a href="https://www.ny.gov">${this._getNysLogo()}</a>
            </div>
            <div class="nys-unavfooter__content">
              <ul>
                <li><a href="https://www.ny.gov/agencies">Agencies</a></li>
                <li>
                  <a href="https://www.ny.gov/mobileapps">App Directory</a>
                </li>
                <li><a href="https://www.ny.gov/counties">Counties</a></li>
                <li><a href="https://www.ny.gov/events">Events</a></li>
                <li><a href="https://www.ny.gov/programs">Programs</a></li>
                <li><a href="https://www.ny.gov/services">Services</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

if (!customElements.get("nys-unavfooter")) {
  customElements.define("nys-unavfooter", NysUnavFooter);
}

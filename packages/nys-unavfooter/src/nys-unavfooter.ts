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
        <div class="nys-unavfooter__container_menu">
          <div class="nys-unavfooter__logo">${this._getNysLogo()}</div>
            <div class="nys-unavfooter__content">
              <ul>
                <li><a href="https://its.ny.gov/agencies">Agencies</a></li>
                <li><a href="https://its.ny.gov/app-directory">App Directory</a></li>
                <li><a href="https://its.ny.gov/counties">Counties</a></li>
                <li><a href="https://its.ny.gov/events">Events</a></li>
                <li><a href="https://its.ny.gov/programs">Programs</a></li>
                <li><a href="https://its.ny.gov/services">Services</a></li>
              </ul>
            </div>
        </div>
      </footer>
    `;
  }
}

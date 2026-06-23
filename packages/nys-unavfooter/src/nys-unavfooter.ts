import { html, unsafeCSS } from "lit";
import { NysElement } from "@nysds/internals";
import nysLogo from "./nys-unav.logo";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-unavfooter.scss?inline";

/**
 * Universal NYS footer with logo and statewide navigation links. Required on all NYS sites.
 *
 * Place as the last element before `</body>`. Displays NY.gov logo and links to Agencies,
 * App Directory, Counties, Events, Programs, and Services. No configuration needed.
 *
 * @summary Universal NYS footer with logo and statewide links. Required site-wide.
 * @element nys-unavfooter
 *
 * @example Standard usage
 * ```html
 * <nys-globalfooter>...</nys-globalfooter>
 * <nys-unavfooter></nys-unavfooter>
 * ```
 */

export class NysUnavFooter extends NysElement {
  static styles = unsafeCSS(styles);

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  connectedCallback() {
    // super.connectedCallback() (NysElement) assigns an auto-
    // generated id when one is not provided. The contentinfo/navigation
    // landmarks stay on the inner <footer>/<nav> elements, so this component
    // intentionally keeps defaultRole = null and does not move a role to the
    // host.
    super.connectedCallback();
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _getNysLogo() {
    if (!nysLogo) return null;

    // Parse the SVG string into an actual SVG DOM element
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(nysLogo, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    // The logo is decorative; the surrounding link already carries an
    // accessible name, so hide the SVG from the accessibility tree.
    svgElement.setAttribute("aria-hidden", "true");
    svgElement.setAttribute("focusable", "false");

    return svgElement;
  }

  render() {
    return html`
      <footer class="nys-unavfooter">
        <div class="nys-unavfooter__main-container">
          <div class="nys-unavfooter__container_menu">
            <div class="nys-unavfooter__logo">
              <a
                href="https://www.ny.gov"
                target="_blank"
                rel="noopener noreferrer"
                id="nys-unavheader__logolink"
                aria-label="New York State home page (opens in a new tab)"
                >${this._getNysLogo()}</a
              >
            </div>
            <nav class="nys-unavfooter__content" aria-label="New York State">
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
            </nav>
          </div>
        </div>
      </footer>
    `;
  }
}

if (!customElements.get("nys-unavfooter")) {
  customElements.define("nys-unavfooter", NysUnavFooter);
}

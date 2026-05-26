import { LitElement, html, unsafeCSS } from "lit";
import nysLogo from "./nys-unav.logo";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-unavfooter.scss?inline";

/**
 * Universal NYS footer with logo and statewide navigation links. Required on all NYS sites to provide consistent access
 * to essential links across all state digital properties. Displays NY.gov logo and links to Agencies, App Directory,
 * Counties, Events, Programs, and Services.
 *
 * **Status:** Stable | **WCAG:** 2.2 AA
 *
 * ## When to use
 * - Required on ALL New York State digital products and websites.
 * - Placed only at the bottom of the page as the final footer element.
 * - Provides users with consistent access to essential statewide links.
 *
 * ## When not to use
 * - Do not place anywhere other than the bottom of the page.
 * - Do not modify, remove, or customize the footer links.
 * - Do not duplicate—use exactly once per page.
 *
 * ## Placement
 * Place as the last element in the `<body>`, after all page content and after any global footer (`nys-globalfooter`).
 * The component is non-configurable and displays the same content on all sites.
 *
 * ## Content
 * The footer displays:
 * - NY.gov logo (links to https://www.ny.gov)
 * - Agencies link
 * - App Directory link
 * - Counties link
 * - Events link
 * - Programs link
 * - Services link
 *
 * ## Accessibility
 * - Uses semantic `<footer>` element for assistive technology recognition.
 * - All links are keyboard-navigable via Tab.
 * - Proper link text for screen reader users.
 * - Links open in same window (no target="_blank") unless external policy requires otherwise.
 * - Visual design meets WCAG 2.2 AA contrast and focus indicator standards.
 * - Footer is not hidden from screen readers and is announced as navigation.
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Place the `<nys-unavfooter>` as the last element on every page, immediately after `<nys-globalfooter>`.
 * - Include it on every page of your site, including error pages, login screens, and landing pages.
 * - Use it as-is with no configuration. The component handles its own content and styling.
 *
 * **Don't:**
 * - Place the UNav Footer anywhere other than the absolute bottom of the page.
 * - Attempt to customize, restyle, or override the UNav Footer's content or appearance. Consistency across all state sites is the purpose of this component.
 * - Omit the UNav Footer from any page on your site.
 *
 * ## Dependencies
 *
 * This component has no dependencies on other NYS Design System components.
 *
 * @summary Universal NYS footer with logo and statewide links. Required on all sites.
 * @element nys-unavfooter
 *
 * @example Standard usage at end of page
 * ```html
 * <body>
 *   <nys-unavheader></nys-unavheader>
 *   <nys-globalheader>...</nys-globalheader>
 *   <main id="main-content">...</main>
 *   <nys-globalfooter>...</nys-globalfooter>
 *   <nys-unavfooter></nys-unavfooter>
 * </body>
 * ```
 */

export class NysUnavFooter extends LitElement {
  static styles = unsafeCSS(styles);

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
                id="nys-unavheader__logolink"
                aria-label="logo of New York State"
                >${this._getNysLogo()}</a
              >
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

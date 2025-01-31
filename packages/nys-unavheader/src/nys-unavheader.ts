import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-unavheader.styles";
import nysLogo from "./nys-unav.logo";
import "@nys-excelsior/nys-icon";

@customElement("nys-unavheader")
export class NysGlobalHeader extends LitElement {
  static styles = styles;

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
      <header class="nys-unavheader">
        <div class="nys-unavheader__left">
          <div class="nys-unavheader__logo">${this._getNysLogo()}</div>
          <label class="nys-unavheader__official"
            >An official website of New York State</label
          >
          <label class="nys-unavheader__know"
            >Here's how you know
            <nys-icon size="12" name="chevron_down"></nys-icon
          ></label>
        </div>
        <div class="nys-unavheader__right">
          <div class="nys-unavheader__translate"></div>
          <div class="nys-unavheader__search"></div>
        </div>
      </header>
      <div class="nys-unavheader__trustbar">
        <div class="nys-unavheader__trustcontent">
          <nys-icon size="3xl" name="account_balance_filled"></nys-icon>
          <label><b>Official websites use ny.gov</b></label>
          <label
            >A <b>ny.gov</b> website belongs to an official New York State
            government organization.</label
          >
        </div>
        <div class="nys-unavheader__trustcontent">
          <nys-icon size="3xl" name="lock_filled"></nys-icon>
          <label><b>Secure ny.gov websites use HTTPS</b></label>
          <label
            >A <b>lock icon</b> or <b>https://</b> means you've safely connected
            to the ny.gov website. Share sensitive information only on official,
            secure websites.</label
          >
        </div>
      </div>
    `;
  }
}

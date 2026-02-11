import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-dropdownmenu.scss?inline";

/**
 * **Slotted component.** Displays an individual dropdown item within `nys-dropdown` with label.
 *
 * The `nys-dropdownitem` is used as customizable item within the dropdown so users don't have to raw code <ul>, <li>, <a href>
 * and have the benefit of default customization.
 *
 * @summary Dropdown item to display label and provide href link.
 * @element nys-dropdownitem
 *
 */
export class NysDropdownItem extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String }) label = "";
  @property({ type: String }) link = "";
  @property({ type: String }) disabled = "";
  @property({ type: String }) divider = "";

  render() {
    return html` <li role="menuitem">
      <a href="${this.link}">${this.label}</a>
    </li>`;
  }
}

if (!customElements.get("nys-dropdownitem")) {
  customElements.define("nys-dropdownitem", NysDropdownItem);
}

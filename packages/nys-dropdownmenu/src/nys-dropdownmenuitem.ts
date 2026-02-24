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
 * @element nys-dropdownmenuitem
 *
 * @example Basic item
 * ```html
 * <nys-dropdownmenuitem label="Edit" link="/edit"></nys-dropdownmenuitem>
 * ```
 *
 * @example Disabled item
 * ```html
 * <nys-dropdownmenuitem label="Delete" link="/delete" disabled></nys-dropdownmenuitem>
 * ```
 */
export class NysDropdownMenuItem extends LitElement {
  static styles = unsafeCSS(styles);
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property({ type: String }) label = "";
  @property({ type: String }) link = "";
  @property({ type: String }) disabled = "";
  @property({ type: String }) divider = "";

  private _handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    this.dispatchEvent(
      new CustomEvent("nys-select", {
        bubbles: true,
        composed: true,
        detail: { label: this.label, link: this.link },
      }),
    );
  }

  render() {
    return html`<li class="nys-dropdownmenuitem" role="none">
      <a
        href="${this.link}"
        aria-disabled="${this.disabled ? "true" : "false"}"
        role="menuitem"
        @click="${this._handleClick}"
        >${this.label}</a
      >
    </li>`;
  }
}

if (!customElements.get("nys-dropdownmenuitem")) {
  customElements.define("nys-dropdownmenuitem", NysDropdownMenuItem);
}

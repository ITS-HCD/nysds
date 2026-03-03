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
  @property({ type: String }) href = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) divider = "";

  private _handleLinkClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    this.dispatchEvent(
      new CustomEvent("nys-dropdownmenuitem-select", {
        bubbles: true,
        composed: true,
        detail: { label: this.label, href: this.href },
      }),
    );
  }

  private _handleActionClick() {
    this.dispatchEvent(
      new CustomEvent("nys-dropdownmenuitem-action", {
        bubbles: true,
        composed: true,
        detail: { label: this.label },
      }),
    );
  }

  render() {
    const isLink = !!this.href;

    return html`<li class="nys-dropdownmenuitem" role="presentation">
      ${isLink
        ? html` <a
            class=${this.disabled ? "disabled" : ""}
            href=${this.disabled ? "" : this.href}
            role="menuitem"
            aria-disabled="${this.disabled ? "true" : "false"}"
            aria-label=${this.label}
            tabindex=${this.disabled ? "-1" : "0"}
            @click="${this._handleLinkClick}"
            >${this.label}</a
          >`
        : html`
            <button
              class=${this.disabled ? "disabled" : ""}
              type="button"
              role="menuitem"
              aria-disabled="${this.disabled ? "true" : "false"}"
              aria-label=${this.label}
              tabindex=${this.disabled ? "-1" : "0"}
              ?disabled=${this.disabled}
              @click="${this._handleActionClick}"
            >
              ${this.label}
            </button>
          `}
    </li>`;
  }
}

if (!customElements.get("nys-dropdownmenuitem")) {
  customElements.define("nys-dropdownmenuitem", NysDropdownMenuItem);
}

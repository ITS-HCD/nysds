import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-dropdownmenu.scss?inline";

let dropdownMenuItemIdCounter = 0;

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
  @property({ type: String }) target = "_self";
  @property({ type: String }) prefixIcon = "";
  @property({ type: String }) divider = "";

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-fileinput-${Date.now()}-${dropdownMenuItemIdCounter++}`;
    }
  }

  private _handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    this.dispatchEvent(
      new CustomEvent("nys-click", {
        bubbles: true,
        composed: true,
        detail: {
          id: this.id,
          label: this.label,
          ...(this.href && { href: this.href }),
        },
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
            @click="${this._handleClick}"
            target="${this.target}"
          >
            ${this.prefixIcon
              ? html`<nys-icon size="16" name=${this.prefixIcon}></nys-icon>`
              : ""}
            ${this.label}</a
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
              @click="${this._handleClick}"
            >
              ${this.prefixIcon
                ? html`<nys-icon size="16" name=${this.prefixIcon}></nys-icon>`
                : ""}
              ${this.label}
            </button>
          `}
    </li>`;
  }
}

if (!customElements.get("nys-dropdownmenuitem")) {
  customElements.define("nys-dropdownmenuitem", NysDropdownMenuItem);
}

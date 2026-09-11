import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
// This element is rendered inside this component's shadow DOM (the prefix
// icon), so it must be registered whenever nys-dropdownmenuitem is used.
// Importing it here (intentional side effect) guarantees it always renders.
import "@nysds/nys-icon";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-dropdownmenu.scss?inline";

/** Detail payload for the `nys-click` event fired by `nys-dropdownmenuitem`. */
export interface NysDropdownmenuitemClickDetail {
  id: string;
  label: string;
  href?: string;
}

/** The `nys-click` event fired by `nys-dropdownmenuitem`. */
export type NysDropdownmenuitemClickEvent =
  CustomEvent<NysDropdownmenuitemClickDetail>;

/**
 * **Slotted component.** Displays an individual dropdown item within `nys-dropdown` with label.
 *
 * The `nys-dropdownitem` is used as customizable item within the dropdown so users don't have to raw code <ul>, <li>, <a href>
 * and have the benefit of default customization.
 *
 * @summary Dropdown item to display label and provide href link.
 * @element nys-dropdownmenuitem
 *
 * @fires {NysDropdownmenuitemClickEvent} nys-click - Fired when the item is activated (unless disabled). Detail: `{id, label, href?}` — `href` is present only when set. Bubbles and composed.
 */
export class NysDropdownMenuItem extends NysElement {
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

  // super.connectedCallback() (NysElement) auto-assigns this.id when
  // one is not provided (prefix = localName, i.e. "nys-dropdownmenuitem-<ts>-<n>").
  // role="menuitem" intentionally stays on the inner <a>/<button>, so this
  // component keeps defaultRole = null and does not move a role onto the host.
  connectedCallback() {
    super.connectedCallback();
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

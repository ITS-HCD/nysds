import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-verticalnav.scss?inline";

/**
 * `<nys-verticalnavgroup>` is collapsible dropdown group within a vertical nav
 */

export class NysVerticalnavGroup extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String }) label = "";
  @property({ type: Boolean, reflect: true }) expanded = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _toggle() {
    if (this.disabled) return;

    this.expanded = !this.expanded;

    this.dispatchEvent(
      new CustomEvent("nys-child-resize", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <button
        class="nys-verticalnavgroup__trigger"
        @click=${this._toggle}
        aria-expanded=${this.expanded}
        ?disabled=${this.disabled}
      >
        <span class="nys-verticalnavgroup__label">${this.label}</span>
        <nys-icon
          name="chevron_down"
          class="nys-verticalnavgroup__chevron"
          size="16"
        ></nys-icon>
      </button>
      <div class="nys-verticalnavgroup__items">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get("nys-verticalnavgroup")) {
  customElements.define("nys-verticalnavgroup", NysVerticalnavGroup);
}

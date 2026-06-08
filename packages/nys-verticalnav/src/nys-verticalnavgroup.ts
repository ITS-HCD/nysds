import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-verticalnav.scss?inline";

/**
 * Collapsible dropdown group for use inside `<nys-verticalnav>`.
 *
 * Renders a toggle button and an expandable panel for a nested `<ul>` of links.
 * Designed to be placed as a direct child of a `<li>` inside the vertical nav's
 * default slot. Use `expanded` to open it by default, and `disabled` to prevent
 * interaction.
 *
 * @summary Collapsible link group for use within `<nys-verticalnav>`.
 * @element nys-verticalnavgroup
 *
 * @example Basic usage
 * ```html
 * <nys-verticalnav navHeader="NYS Design System">
 *   <ul>
 *     <li><a href="/foundations">Foundations</a></li>
 *     <li>
 *       <nys-verticalnavgroup label="Accessibility">
 *         <ul>
 *           <li><a href="/wcag">WCAG Guidelines</a></li>
 *           <li><a href="/screen-readers">Screen Readers</a></li>
 *         </ul>
 *       </nys-verticalnavgroup>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example Expanded by default
 * ```html
 * <nys-verticalnavgroup label="Resources" expanded>
 *   <ul>
 *     <li><a href="/tokens">Design Tokens</a></li>
 *   </ul>
 * </nys-verticalnavgroup>
 * ```
 *
 * @example Disabled
 * ```html
 * <nys-verticalnavgroup label="Coming Soon" disabled>
 *   <ul>
 *     <li><a href="/future">Future Feature</a></li>
 *   </ul>
 * </nys-verticalnavgroup>
 * ```
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

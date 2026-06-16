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
 * interaction. Set `aria-current="page"` on an `<a>` inside to automatically
 * expand the group and apply the active state.
 *
 * @summary Collapsible link group for use within `<nys-verticalnav>`.
 * @element nys-verticalnavgroup
 *
 * @example Basic usage
 * ```html
 * <nys-verticalnav header="NYS Design System">
 *   <ul>
 *     <li><a href="/foundations">Foundations</a></li>
 *     <li>
 *       <nys-verticalnavgroup label="Accessibility">
 *         <ul>
 *           <li><a href="">WCAG Guidelines</a></li>
 *           <li><a href="">Screen Readers</a></li>
 *           <li><a href="">Color Contrast</a></li>
 *         </ul>
 *       </nys-verticalnavgroup>
 *     </li>
 *   </ul>
 * </nys-verticalnav>
 * ```
 *
 * @example With active link — group auto-expands
 * ```html
 * <nys-verticalnavgroup label="Accessibility">
 *   <ul>
 *     <li><a aria-current="page" href="">WCAG Guidelines</a></li>
 *     <li><a href="">Screen Readers</a></li>
 *     <li><a href="">Color Contrast</a></li>
 *   </ul>
 * </nys-verticalnavgroup>
 * ```
 *
 * @example Expanded by default
 * ```html
 * <nys-verticalnavgroup label="Resources" expanded>
 *   <ul>
 *     <li><a href="">Design Tokens</a></li>
 *     <li><a href="">Utilities</a></li>
 *   </ul>
 * </nys-verticalnavgroup>
 * ```
 *
 * @example Disabled group with disabled links
 * ```html
 * <nys-verticalnavgroup disabled label="Accessibility">
 *   <ul>
 *     <li><a aria-disabled="true">WCAG Guidelines</a></li>
 *     <li><a href="">Screen Readers</a></li>
 *     <li><a href="">Color Contrast</a></li>
 *   </ul>
 * </nys-verticalnavgroup>
 * ```
 */

export class NysVerticalnavGroup extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String }) label = "";
  @property({ type: Boolean, reflect: true }) expanded = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) active = false;

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

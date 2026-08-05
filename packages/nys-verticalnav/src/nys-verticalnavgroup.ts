import { html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
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
 * */

export class NysVerticalnavGroup extends NysElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String }) label = "";
  @property({ type: Boolean, reflect: true }) expanded = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) active = false;

  // Ids come from NysElement (prefix = localName, shape
  // "nys-verticalnavgroup-<ts>-<n>"). The previous local counter generated ids
  // prefixed "nys-verticalnav-" from a counter that started at 0 independently of
  // the nav's, so a group and a nav created in the same millisecond could collide
  // and the group's aria-controls could resolve to the wrong element.

  private _toggle() {
    if (this.disabled) return;

    this.expanded = !this.expanded;

    // The `nys-accordionitem` listens for this event to resize the height
    this.dispatchEvent(
      new CustomEvent("nys-child-resize", {
        bubbles: true,
        composed: true,
      }),
    );

    this.dispatchEvent(
      new CustomEvent("nys-verticalnavgroup-toggle", {
        detail: { id: this.id, label: this.label, expanded: this.expanded },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const contentId = `${this.id}-content`;

    return html`
      <button
        class="nys-verticalnavgroup__trigger"
        @click=${this._toggle}
        aria-controls=${contentId}
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
      <div class="nys-verticalnavgroup__items" id=${contentId}>
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get("nys-verticalnavgroup")) {
  customElements.define("nys-verticalnavgroup", NysVerticalnavGroup);
}

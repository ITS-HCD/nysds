import { html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tab.scss?inline";

/**
 * `<nys-tabpanel>` is a content panel paired with a `<nys-tab>` inside a
 * `<nys-tabgroup>`.
 *
 * Pairing is determined by render order: the Nth `<nys-tabpanel>` child of a
 * `<nys-tabgroup>` corresponds to the Nth `<nys-tab>` child.
 * `aria-labelledby` and the `hidden` attribute are managed externally by
 * `<nys-tabgroup>` via `_applySelection`; do not set them directly.
 *
 * @element nys-tabpanel
 *
 * @slot - Default slot for panel content. Rendered inside a wrapper `<div>`
 *   with the `.nys-tabpanel` class for styling.
 *
 * @example Panel content is wrapped by `<nys-tabpanel>`.
 * ```html
 * <!-- Panels are paired by position with <nys-tab> elements in the same <nys-tabgroup>. -->
 * <nys-tabgroup name="Steps">
 *   <nys-tab label="Step 1"></nys-tab>
 *   <nys-tab label="Step 2"></nys-tab>
 *   <nys-tabpanel>
 *     <h2>Step 1: Enter your information</h2>
 *     <p>Fill out the form below.</p>
 *   </nys-tabpanel>
 *   <nys-tabpanel>
 *     <h2>Step 2: Review and submit</h2>
 *     <p>Confirm your details before submitting.</p>
 *   </nys-tabpanel>
 * </nys-tabgroup>
 * ```
 */
export class NysTabpanel extends NysElement {
  static styles = unsafeCSS(styles);

  /**
   * Unique identifier for the panel element.
   * If not provided, one is auto-generated in `connectedCallback`.
   * Reflected to the DOM attribute so `aria-controls` references on sibling
   * `<nys-tab>` elements resolve correctly.
   *
   * @attr id
   */
  @property({ type: String, reflect: true }) id = "";

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  connectedCallback() {
    // super.connectedCallback() (NysElement) auto-assigns an id
    // (prefix = localName "nys-tabpanel") when one is not provided so that
    // sibling <nys-tab> aria-controls references resolve. role="tabpanel" stays
    // on the host as a reflected attribute (defaultRole intentionally null) so
    // existing getAttribute("role") consumers/tests keep working.
    super.connectedCallback();
    this.setAttribute("role", "tabpanel");
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  render() {
    return html`
      <div class="nys-tabpanel" tabindex="0">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get("nys-tabpanel")) {
  customElements.define("nys-tabpanel", NysTabpanel);
}

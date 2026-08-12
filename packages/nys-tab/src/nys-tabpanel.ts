import { html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tabpanel.scss?inline";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-tabpanel.light.scss?inline";

let _lightSheet: CSSStyleSheet | null = null;
// Injects the light-DOM styling for <nys-tabpanel> into a single constructed
// stylesheet adopted on the document. Guarded so it runs once regardless of how
// many panels mount, and skipped during SSR where `document` is undefined.
function adoptLightStyles() {
  if (_lightSheet || typeof document === "undefined") return;
  _lightSheet = new CSSStyleSheet();
  _lightSheet.replaceSync(lightStyles);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, _lightSheet];
}

/**
 * `<nys-tabpanel>` is a content panel paired with a `<nys-tab>` inside a
 * `<nys-tabgroup>`.
 *
 * Pairing is determined by render order: the Nth `<nys-tabpanel>` child of a
 * `<nys-tabgroup>` corresponds to the Nth `<nys-tab>` child (or by explicit
 * `aria-labelledby`). `aria-labelledby` and the `hidden` attribute are managed
 * externally by `<nys-tabgroup>` via `_applySelection`; do not set them
 * directly.
 *
 * The panel container is styled from the light DOM (`nys-tabpanel.light.scss`,
 * adopted on the document) rather than a shadow-DOM wrapper. This keeps the
 * slotted panel content in the light DOM — reachable by consumer CSS and
 * JavaScript — and lets consumers override the panel's own styling (e.g.
 * `nys-tabpanel { padding: 0 }`), which a shadow wrapper would prevent.
 *
 * @element nys-tabpanel
 *
 * @slot - Default slot for panel content. Rendered directly under the host,
 *   which is the scrollable, focusable (`tabindex="0"`) `role="tabpanel"`
 *   region.
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
    adoptLightStyles();
    this.setAttribute("role", "tabpanel");
    // The host is the scrollable region (overflow is applied in the light
    // styles), so it must be keyboard-focusable for scroll access.
    this.setAttribute("tabindex", "0");
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  render() {
    return html`<slot></slot>`;
  }
}

if (!customElements.get("nys-tabpanel")) {
  customElements.define("nys-tabpanel", NysTabpanel);
}

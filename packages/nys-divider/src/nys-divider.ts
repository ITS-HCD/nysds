import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-divider.scss?inline";

/**
 * `<nys-divider>` renders a horizontal rule `<hr>` element with optional styling.
 * Can be inverted for dark backgrounds.
 */
export class NysDivider extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true }) inverted = false;

  constructor() {
    super();
  }

  render() {
    return html`<hr class="nys-divider" />`;
  }
}

if (!customElements.get("nys-divider")) {
  customElements.define("nys-divider", NysDivider);
}

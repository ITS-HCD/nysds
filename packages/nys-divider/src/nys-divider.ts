import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-divider.styles";

export class NysDivider extends LitElement {
  // size
  private static readonly VALID_SIZES = ["sm", "md", "lg"] as const;
  private _size: (typeof NysDivider.VALID_SIZES)[number] = "md";
  @property({ reflect: true })
  get size(): (typeof NysDivider.VALID_SIZES)[number] {
    return this._size;
  }
  set size(value: string) {
    this._size = NysDivider.VALID_SIZES.includes(
      value as (typeof NysDivider.VALID_SIZES)[number],
    )
      ? (value as (typeof NysDivider.VALID_SIZES)[number])
      : "md";
  }
  @property({ type: Boolean, reflect: true }) inverted = false;
  @property({ type: Boolean, reflect: true }) vertical = false;

  static styles = styles;

  constructor() {
    super();
  }

  render() {
    return html`<div class="nys-divider"></div>`;
  }
}

if (!customElements.get("nys-divider")) {
  customElements.define("nys-divider", NysDivider);
}

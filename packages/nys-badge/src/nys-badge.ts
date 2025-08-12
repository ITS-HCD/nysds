import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-badge.styles";

export class NysBadge extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
  //size prop
  private static readonly VALID_SIZES = ["sm", "md"] as const;
  private _size: (typeof NysBadge.VALID_SIZES)[number] = "md";
  @property({ reflect: true })
  get size(): (typeof NysBadge.VALID_SIZES)[number] {
    return this._size;
  }
  set size(value: string) {
    this._size = NysBadge.VALID_SIZES.includes(
      value as (typeof NysBadge.VALID_SIZES)[number],
    )
      ? (value as (typeof NysBadge.VALID_SIZES)[number])
      : "md";
  }
  // status prop
  private static readonly VALID_STATUS = [
    "info",
    "error",
    "success",
    "warning",
  ] as const;
  private _status: (typeof NysBadge.VALID_STATUS)[number] = "info";
  @property({ reflect: true })
  get status(): (typeof NysBadge.VALID_STATUS)[number] {
    return this._status;
  }
  set status(value: string) {
    this._status = NysBadge.VALID_STATUS.includes(
      value as (typeof NysBadge.VALID_STATUS)[number],
    )
      ? (value as (typeof NysBadge.VALID_STATUS)[number])
      : "info";
  }
  @property({ type: String }) prefix = "";
  @property({ type: String }) label = "";
  @property({ type: String }) prefixIcon = "";
  @property({ type: String }) suffixIcon = "";

  static styles = styles;

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="nys-badge">
        ${this.prefixIcon
          ? html` <nys-icon size="16" name=${this.prefixIcon}></nys-icon> `
          : ""}
        ${this.prefix
          ? html`<div class="nys-badge__prefix">${this.prefix}</div>`
          : ""}
        <div class="nys-badge__label">${this.label}</div>
        ${this.suffixIcon
          ? html` <nys-icon size="16" name=${this.suffixIcon}></nys-icon> `
          : ""}
      </div>
    `;
  }
}

if (!customElements.get("nys-badge")) {
  customElements.define("nys-badge", NysBadge);
}

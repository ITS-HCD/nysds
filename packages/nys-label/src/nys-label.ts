import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-label.scss?inline";

export class NysLabel extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String }) for = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) flag = "";
  @property({ type: Boolean, reflect: true }) inverted = false;
  @property({ type: String })
  get tooltip() {
    return this._tooltip;
  }
  set tooltip(value: string) {
    this._tooltip = value;
  }
  private _tooltip: string = "";

  render() {
    return html`
      <div class="nys-label ${this.inverted ? "invert" : ""}">
        <div class="nys-label__tooltip-wrapper">
          <label for=${this.for} class="nys-label__label"
            >${this.label}
            ${this.flag === "required"
              ? html`<div class="nys-label__required">*</div>`
              : ""}
            ${this.flag === "optional"
              ? html`<div class="nys-label__optional">(Optional)</div>`
              : ""}</label
          >
          ${this._tooltip
            ? html`<nys-tooltip
                text="${this._tooltip}"
                position="top"
                focusable
                ?inverted=${this.inverted}
              >
                <div class="nys-label__tooltip-icon">
                  <nys-icon name="info" size="4xl"></nys-icon>
                </div>
              </nys-tooltip>`
            : ""}
        </div>
        <label for=${this.for} class="nys-label__description">
          <slot name="description">${this.description}</slot>
        </label>
      </div>
    `;
  }
}

if (!customElements.get("nys-label")) {
  customElements.define("nys-label", NysLabel);
}

import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-stepper.styles";

export class NysStep extends LitElement {
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) current = false;
  @property({ type: String }) label = "";
  @property({ type: String }) href = "";

  @property({ type: Boolean }) isCompact = false;
  @property({ type: Boolean }) isCompactExpanded = false;

  static styles = styles;

  private _handleActivate() {
    // make sure isCompact is false first
    if (!this.isCompact)
      this.dispatchEvent(
        new Event("nys-step-click", {
          bubbles: true,
          composed: true,
        }),
      );
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._handleActivate();
    }
  }

  render() {
    return html`
      <div class="nys-step">
        <div class="nys-step__linewrapper">
          <div class="nys-step__line"></div>
        </div>
        <div
          class="nys-step__contentwrapper"
          tabindex=${this.hasAttribute("isCompact") ||
          !(this.selected || this.current || this.hasAttribute("previous"))
            ? "-1"
            : "0"}
          @click=${this._handleActivate}
          @keydown=${this._handleKeydown}
        >
          <div class="nys-step__number"></div>
          <div class="nys-step__content">
            ${this.current
              ? html`<div class="nys-step__currentflag">Current Step</div>`
              : ""}
            <div class="nys-step__label">${this.label}</div>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-step")) {
  customElements.define("nys-step", NysStep);
}

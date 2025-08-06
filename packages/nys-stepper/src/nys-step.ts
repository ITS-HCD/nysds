import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-stepper.styles";

export class NysStep extends LitElement {
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) current = false;
  @property({ type: String }) label = "";
  @property({ type: String }) href = "";
  @property({ type: Boolean }) isCompactExpanded = false;

  static styles = styles;

  private _handleActivate() {
    if ((this.hasAttribute("previous") || this.current) && !this.selected) {
      this.dispatchEvent(
        new Event("nys-step-click", {
          bubbles: true,
          composed: true,
        }),
      );
    }
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
          tabindex=${!(
            this.selected ||
            this.current ||
            this.hasAttribute("previous")
          )
            ? "-1"
            : "0"}
          @click=${this._handleActivate}
          @keydown=${this._handleKeydown}
          role="button"
          aria-label="${this.label} Step"
          ?disabled=${!(
            this.selected ||
            this.current ||
            this.hasAttribute("previous")
          )}
        >
          <div class="nys-step__number" tabindex="-1" aria-hidden="true"></div>
          <div class="nys-step__content" tabindex="-1" aria-hidden="true">
            <div class="nys-step__label" tabindex="-1" aria-hidden="true">
              ${this.label}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-step")) {
  customElements.define("nys-step", NysStep);
}

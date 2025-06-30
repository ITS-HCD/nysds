import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-stepper.styles";

export class NysStep extends LitElement {
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) current = false;
  @property({ type: String }) label = "";
  @property({ type: String }) href = "";

  static styles = styles;

  render() {
    return html` <div class="nys-step">${this.label}</div>
      <div class="nys-step__linewrapper">
        <div class="nys-step__line"></div>
      </div>`;
  }
}

if (!customElements.get("nys-step")) {
  customElements.define("nys-step", NysStep);
}

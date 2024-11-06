import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-input.styles"; // Assuming styles are in a separate file

@customElement("nys-input")
export class NysInput extends LitElement {
  @property({ type: Boolean }) disabled = false;
  //max
  // maxlength
  //min
  //pattern
  //readonly
  //required
  //size
  //step
  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";

  static styles = styles;

  render() {
    return html`
      <input
        class="nys-input"
        type="text"
        ?disabled=${this.disabled}
        aria-disabled="${this.disabled}"
        .value=${this.value}
        .placeholder=${this.placeholder}
      />
    `;
  }
}

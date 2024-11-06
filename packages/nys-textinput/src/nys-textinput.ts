import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-textinput.styles"; // Assuming styles are in a separate file

@customElement("nys-textinput")
export class NysTextinput extends LitElement {
  @property({ type: Boolean }) disabled = false;
  // maxlength
  //pattern
  //readonly
  @property({ type: Boolean }) required = false;
  //size
  //step
  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";

  static styles = styles;

  render() {
    return html`
      <!-- ${this.required
        ? html`<label class="nys-textinput__required">*</label>`
        : ""} -->
      <input
        class="nys-textinput"
        type="text"
        ?disabled=${this.disabled}
        ?required=${this.required}
        aria-disabled="${this.disabled}"
        .value=${this.value}
        .placeholder=${this.placeholder}
      />
    `;
  }
}

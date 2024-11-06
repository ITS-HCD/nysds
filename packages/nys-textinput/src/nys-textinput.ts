import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-textinput.styles"; // Assuming styles are in a separate file

@customElement("nys-textinput")
export class NysTextinput extends LitElement {
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
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
      <div class="nys-textinput">
        <!-- ${this.required
          ? html`<label class="nys-textinput__required">*</label>`
          : ""} -->
        <div class="nys-textinput__text">
          ${this.label != ""
            ? html` <div class="nys-textinput__label">${this.label}</div>`
            : ""}
          ${this.description != ""
            ? html` <div class="nys-textinput__description">
                ${this.description}
              </div>`
            : ""}
        </div>

        <input
          class="nys-textinput__input"
          type="text"
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-disabled="${this.disabled}"
          .value=${this.value}
          .placeholder=${this.placeholder}
        />
      </div>
    `;
  }
}

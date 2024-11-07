import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-textinput.styles"; // Assuming styles are in a separate file

@customElement("nys-textinput")
export class NysTextinput extends LitElement {
  @property({ reflect: true, type: String }) type:
    | "text"
    | "number"
    | "email"
    | "tel" = "text";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Number }) maxlength = null;
  @property({ type: String }) name = null;
  @property({ type: String }) id = null;
  @property({ type: String }) pattern = null;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
  @property({ type: Number }) size = null;
  @property({ type: Number }) step = null;
  @property({ type: Number }) min = null;
  @property({ type: Number }) max = null;
  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";

  constructor() {
    super();
    if (!NysTextinput.ALLOWED_TYPES.includes(this.type)) {
      console.warn(
        `Invalid initial type "${this.type}" for <nys-textinput>. Defaulting to "text".`,
      );
      this.type = "text";
    }
  }

  static styles = styles;
  render() {
    return html`
      <div class="nys-textinput">
        <!-- ${this.required
          ? html`<label class="nys-textinput__required">*</label>`
          : ""} -->
        <div class="nys-textinput__text">
          ${this.label &&
          html` <div class="nys-textinput__label">${this.label}</div>`}
          ${this.description &&
          html` <div class="nys-textinput__description">
            ${this.description}
          </div>`}
        </div>
        <input
          class="nys-textinput__input"
          type=${this.type}
          name=${this.name}
          id=${this.id}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          aria-disabled="${this.disabled}"
          .value=${this.value}
          .placeholder=${this.placeholder}
          maxlength=${this.maxlength}
          pattern=${this.pattern}
          size=${this.size}
          step=${this.step}
          min=${this.min}
          max=${this.max}
        />
        ${this.pattern &&
        html`<div class="nys-textinput__validation">The input is:</div>`}
      </div>
    `;
  }
}

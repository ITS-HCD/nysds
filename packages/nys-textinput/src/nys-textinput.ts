import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-textinput.styles"; // Assuming styles are in a separate file

@customElement("nys-textinput")
export class NysTextinput extends LitElement {
  private static readonly VALID_TYPES = [
    "email",
    "number",
    "password",
    "search",
    "tel",
    "text",
    "url",
  ] as const;

  // Use `typeof` to dynamically infer the allowed types
  private _type: (typeof NysTextinput.VALID_TYPES)[number] = "text";

  // Getter and setter for the `type` property
  @property({ reflect: true })
  get type(): (typeof NysTextinput.VALID_TYPES)[number] {
    return this._type;
  }

  set type(value: string) {
    this._type = NysTextinput.VALID_TYPES.includes(
      value as (typeof NysTextinput.VALID_TYPES)[number],
    )
      ? (value as (typeof NysTextinput.VALID_TYPES)[number])
      : "text";
  }
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Number }) minlength = null;
  @property({ type: Number }) maxlength = null;
  @property({ type: String }) name = null;
  @property({ type: String }) id = "";
  @property({ type: String }) pattern = null;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
  @property({ type: Number }) size = "";
  @property({ type: Number }) step = null;
  @property({ type: Number }) min = null;
  @property({ type: Number }) max = null;
  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) form = "";

  constructor() {
    super();
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
          placeholder=${this.placeholder}
          minlength=${this.minlength}
          maxlength=${this.maxlength}
          pattern=${this.pattern}
          size=${this.size}
          step=${this.step}
          min=${this.min}
          max=${this.max}
          form=${this.form}
        />
        ${this.pattern &&
        html`<div class="nys-textinput__validation">The input is:</div>`}
      </div>
    `;
  }
}

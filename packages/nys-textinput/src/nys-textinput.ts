import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-textinput.styles";
import "@nys-excelsior/nys-icon"; // references: "/packages/nys-icon/dist/nys-icon.es.js";

@customElement("nys-textinput")
export class NysTextinput extends LitElement {
  @property({ type: String, attribute: "id" }) id = "";
  @property({ type: String, attribute: "name" }) name = "";
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
  @property({ type: String, attribute: "label" }) label = "";
  @property({ type: String, attribute: "description" }) description = "";
  @property({ type: String, attribute: "placeholder" }) placeholder = "";
  @property({ type: String, attribute: "value" }) value = "";
  @property({ type: Boolean, attribute: "disabled" }) disabled = false;
  @property({ type: Boolean, attribute: "readonly" }) readonly = false;
  @property({ type: Boolean, attribute: "required" }) required = false;
  @property({ type: String, attribute: "form" }) form = "";
  @property({ type: String, attribute: "pattern" }) pattern = "";
  @property({ type: Number, attribute: "maxlength" }) maxlength = null;
  private static readonly VALID_WIDTHS = ["sm", "md", "lg", "full"] as const;
  @property({ reflect: true })
  width: (typeof NysTextinput.VALID_WIDTHS)[number] = "full";

  // Ensure the "width" property is valid after updates
  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("width")) {
      this.width = NysTextinput.VALID_WIDTHS.includes(this.width)
        ? this.width
        : "full";
    }
  }

  @property({ type: Number, attribute: "step" }) step = null;
  @property({ type: Number, attribute: "min" }) min = null;
  @property({ type: Number, attribute: "max" }) max = null;
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String, attribute: "error-message" }) errorMessage = "";

  constructor() {
    super();
  }

  static styles = styles;

  // Handle input event to check pattern validity
  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const checkValidity = input.checkValidity();
    this.dispatchEvent(
      new CustomEvent("nys-checkValidity", {
        detail: { checkValidity },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(new Event("focus"));
  }

  // Handle blur event
  private _handleBlur() {
    this.dispatchEvent(new Event("blur"));
  }

  render() {
    return html`
      <div class="nys-textinput">
        ${this.label &&
        html` <div class="nys-textinput__text">
          <div class="nys-textinput__requiredwrapper">
            <label for=${this.id} class="nys-textinput__label"
              >${this.label}</label
            >
            ${this.required
              ? html`<label class="nys-textinput__required">*</label>`
              : ""}
          </div>

          <div class="nys-textinput__description">
            ${this.description}
            <slot name="description"> </slot>
          </div>
        </div>`}
        <input
          class="nys-textinput__input"
          type=${this.type}
          name=${this.name}
          id=${this.id}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          aria-disabled="${this.disabled}"
          aria-label="${this.label} ${this.description}"
          .value=${this.value}
          placeholder=${this.placeholder}
          maxlength=${this.maxlength}
          pattern=${this.pattern}
          step=${this.step}
          min=${this.min}
          max=${this.max}
          form=${this.form}
          @input=${this._handleInput}
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
        />
        ${this.showError && this.errorMessage
          ? html`<div class="nys-textinput__error">
              <nys-icon name="error" size="xl"></nys-icon>
              ${this.errorMessage}
            </div>`
          : ""}
      </div>
    `;
  }
}

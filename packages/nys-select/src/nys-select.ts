import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-select.styles";

@customElement("nys-select")
export class NysSelect extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = null;
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
  private _type: (typeof NysSelect.VALID_TYPES)[number] = "text";

  // Getter and setter for the `type` property
  @property({ reflect: true })
  get type(): (typeof NysSelect.VALID_TYPES)[number] {
    return this._type;
  }

  set type(value: string) {
    this._type = NysSelect.VALID_TYPES.includes(
      value as (typeof NysSelect.VALID_TYPES)[number],
    )
      ? (value as (typeof NysSelect.VALID_TYPES)[number])
      : "text";
  }
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) form = "";
  @property({ type: String }) pattern = null;
  @property({ type: Number }) maxlength = null;
  @property({ type: String }) size = "";
  @property({ type: Number }) step = null;
  @property({ type: Number }) min = null;
  @property({ type: Number }) max = null;

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
      <div class="nys-select">
        ${(this.label || this.description) &&
        html` <div class="nys-select__text">
          <div class="nys-select__label_labelwrapper">
            <label for=${this.id} class="nys-select__label"
              >${this.label}</label
            >
            <label for=${this.id} class="nys-select__description"
              >${this.description}</label
            >
          </div>
          ${this.required && (this.label || this.description)
            ? html`<label class="nys-select__required">*</label>`
            : ""}
        </div>`}
        <div class="nys-select__requiredwrapper">
          <input
            class="nys-select__input ${this.size}"
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
          ${this.required && !this.label && !this.description
            ? html`<label class="nys-select__required">*</label>`
            : ""}
        </div>
      </div>
    `;
  }
}

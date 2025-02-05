import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-button.styles";
import "@nys-excelsior/nys-icon";
import { ifDefined } from "lit/directives/if-defined.js";

let buttonIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-button")
export class NysButton extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  // size
  private static readonly VALID_SIZES = ["sm", "md", "lg"] as const;
  private _size: (typeof NysButton.VALID_SIZES)[number] = "md";
  @property({ reflect: true })
  get size(): (typeof NysButton.VALID_SIZES)[number] {
    return this._size;
  }
  set size(value: string) {
    this._size = NysButton.VALID_SIZES.includes(
      value as (typeof NysButton.VALID_SIZES)[number],
    )
      ? (value as (typeof NysButton.VALID_SIZES)[number])
      : "md";
  }
  @property({ type: Boolean, reflect: true }) fullWidth = false;
  // variant
  private static readonly VALID_VARIANTS = [
    "filled",
    "outline",
    "ghost",
    "text",
  ] as const;
  private _variant: (typeof NysButton.VALID_VARIANTS)[number] = "filled";
  @property({ reflect: true })
  get variant(): (typeof NysButton.VALID_VARIANTS)[number] {
    return this._variant;
  }
  set variant(value: string) {
    this._variant = NysButton.VALID_VARIANTS.includes(
      value as (typeof NysButton.VALID_VARIANTS)[number],
    )
      ? (value as (typeof NysButton.VALID_VARIANTS)[number])
      : "filled";
  }
  @property({ type: Boolean, reflect: true }) inverted = false; //used on dark text
  @property({ type: String }) label = "";
  @property({ type: String }) prefixIcon = "";
  @property({ type: String }) suffixIcon = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) form = "";
  @property({ type: String }) value = "";
  // type
  private static readonly VALID_TYPES = ["submit", "reset", "button"] as const;
  private _type: (typeof NysButton.VALID_TYPES)[number] = "button";
  @property({ reflect: true })
  get type(): (typeof NysButton.VALID_TYPES)[number] {
    return this._type;
  }
  set type(value: string) {
    this._type = NysButton.VALID_TYPES.includes(
      value as (typeof NysButton.VALID_TYPES)[number],
    )
      ? (value as (typeof NysButton.VALID_TYPES)[number])
      : "button";
  }
  @property({ type: Function }) onClick: (event: Event) => void = () => {};
  @property({ type: String }) href = "";

  static styles = styles;

  /**************** Lifecycle Methods ****************/
  connectedCallback() {
    super.connectedCallback();

    // Generate a unique ID if not provided
    if (!this.id) {
      this.id = this._generateUniqueId();
    }
  }

  /******************** Functions ********************/
  private _generateUniqueId() {
    return `nys-button-${Date.now()}-${buttonIdCounter++}`;
  }

  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(new Event("focus"));
  }

  // Handle blur event
  private _handleBlur() {
    this.dispatchEvent(new Event("blur"));
  }

  private _handleClick(event: Event) {
    if (typeof this.onClick === "function") {
      this.onClick(event);
    }
  }

  render() {
    return html`
      ${this.href
        ? html`
            <div class="nys-button__linkwrapper">
              <a
                class="nys-button"
                id=${ifDefined(this.id)}
                name=${ifDefined(this.name)}
                ?disabled=${this.disabled}
                form=${ifDefined(this.form)}
                value=${ifDefined(this.value)}
                href=${this.href}
                target="_blank"
                @click=${this._handleClick}
                @focus="${this._handleFocus}"
                @blur="${this._handleBlur}"
              >
                ${this.prefixIcon && this.variant !== "text"
                  ? html`<nys-icon
                      size="16"
                      name=${this.prefixIcon}
                    ></nys-icon>`
                  : ""}
                ${this.label
                  ? html`<label class="nys-button__text">${this.label}</label>`
                  : ""}
                ${this.suffixIcon && this.variant !== "text"
                  ? html`<nys-icon
                      size="16"
                      name=${this.suffixIcon}
                    ></nys-icon>`
                  : ""}
              </a>
            </div>
          `
        : html`
            <button
              class="nys-button"
              id=${ifDefined(this.id)}
              name=${ifDefined(this.name)}
              ?disabled=${this.disabled}
              form=${ifDefined(this.form)}
              value=${ifDefined(this.value)}
              type=${this.type}
              @click=${this._handleClick}
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
            >
              ${this.prefixIcon && this.variant !== "text"
                ? html`<nys-icon size="16" name=${this.prefixIcon}></nys-icon>`
                : ""}
              ${this.label
                ? html`<label class="nys-button__text">${this.label}</label>`
                : ""}
              ${this.suffixIcon && this.variant !== "text"
                ? html`<nys-icon size="16" name=${this.suffixIcon}></nys-icon>`
                : ""}
            </button>
          `}
    `;
  }
}

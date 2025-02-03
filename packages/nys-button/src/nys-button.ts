import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-button.styles";
import "@nys-excelsior/nys-icon";
import { FormControlController } from "@nys-excelsior/form-controller";

@customElement("nys-button")
export class NysButton extends LitElement {
  // Form control controller
  private formControlController = new FormControlController(this, {
    form: (input) => input.closest("form"),
    name: (input) => input.getAttribute("name"),
    value: (input) => input.getAttribute("value"),
  });

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
  private _type: (typeof NysButton.VALID_TYPES)[number] = "submit";
  @property({ reflect: true })
  get type(): (typeof NysButton.VALID_TYPES)[number] {
    return this._type;
  }
  set type(value: string) {
    this._type = NysButton.VALID_TYPES.includes(
      value as (typeof NysButton.VALID_TYPES)[number],
    )
      ? (value as (typeof NysButton.VALID_TYPES)[number])
      : "submit";
  }
  @property({ type: Function }) onClick: ((event: Event) => void) | null = null;
  @property({ type: String }) href = "";

  static styles = styles;

  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(new Event("focus"));
  }

  // Handle blur event
  private _handleBlur() {
    this.dispatchEvent(new Event("blur"));
  }

  private _handleClick(event: Event) {
    // Call the external onClick function if it exists
    if (typeof this.onClick === "function") {
      this.onClick(event);
    }

    // Internal logic for form submission
    if (this.type === "submit") {
      event.preventDefault(); // Prevent default form submission
      const form = this.closest("form"); // Find the closest form
      if (form) {
        this.formControlController.submit(); // Submit the form
      }
    }
  }

  render() {
    return html`
      ${this.href
        ? html`
            <div class="nys-button__linkwrapper">
              <a
                class="nys-button"
                id=${this.id}
                name=${this.name}
                ?disabled=${this.disabled}
                form=${this.form}
                value=${this.value}
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
              id=${this.id}
              name=${this.name}
              ?disabled=${this.disabled}
              form=${this.form}
              value=${this.value}
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

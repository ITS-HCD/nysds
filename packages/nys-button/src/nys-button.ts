import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-button.styles";
import "@nys-excelsior/nys-icon";

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
  @property({ type: Boolean }) inverse = false; //used on dark text
  @property({ type: String }) label = "";
  @property({ type: String }) prefixIcon = "";
  @property({ type: String }) suffixIcon = "";
  @property({ type: Boolean }) disabled = false;
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
  @property({ type: Function }) onClick: (event: Event) => void = () => {};

  static styles = styles;

  render() {
    return html`
      <button
        class="nys-button"
        id=${this.id}
        name=${this.name}
        ?disabled=${this.disabled}
        form=${this.form}
        value=${this.value}
        type=${this.type}
        @click=${this.onClick}
      >
        ${this.prefixIcon
          ? html`<nys-icon size="16" name=${this.prefixIcon}></nys-icon>`
          : ""}
        ${this.label
          ? html`<label class="nys-button__text">${this.label}</label>`
          : ""}
        ${this.suffixIcon
          ? html`<nys-icon size="16" name=${this.suffixIcon}></nys-icon>`
          : ""}
      </button>
    `;
  }
}

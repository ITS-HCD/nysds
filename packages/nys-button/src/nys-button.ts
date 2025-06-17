import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-button.styles";
import "@nysds/nys-icon";
import { ifDefined } from "lit/directives/if-defined.js";

let buttonIdCounter = 0; // Counter for generating unique IDs

export class NysButton extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
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
  @property({ type: String }) ariaLabel = "";
  @property({ type: String }) prefixIcon = "";
  @property({ type: String }) suffixIcon = "";
  @property({ type: Boolean, reflect: true }) circle = false;
  @property({ type: String }) icon = "";
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
  // target
  private static readonly VALID_TARGETS = [
    "_self",
    "_blank",
    "_parent",
    "_top",
    "framename",
  ] as const;
  private _target: (typeof NysButton.VALID_TARGETS)[number] = "_self";
  @property({ reflect: true })
  get target(): (typeof NysButton.VALID_TARGETS)[number] {
    return this._target;
  }
  set target(value: string) {
    this._target = NysButton.VALID_TARGETS.includes(
      value as (typeof NysButton.VALID_TARGETS)[number],
    )
      ? (value as (typeof NysButton.VALID_TARGETS)[number])
      : "_self";
  }

  static styles = styles;
  private _internals: ElementInternals;

  /**************** Lifecycle Methods ****************/
  static formAssociated = true; // allows use of elementInternals' API

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

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

  private _manageFormAction(event: Event) {
    // If an onClick function is provided, call it
    if (typeof this.onClick === "function") {
      this.onClick(event);
    }

    // If part of a form, perform the corresponding action based on button's "type"
    const form = this._internals.form;

    if (form) {
      switch (this.type) {
        case "submit":
          form.requestSubmit();
          break;
        case "reset":
          form.reset();
          break;
        case "button":
      }
    }
  }

  /******************** Event Handlers ********************/
  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(new Event("nys-focus"));
  }

  // Handle blur event
  private _handleBlur() {
    this.dispatchEvent(new Event("nys-blur"));
  }

  private _handleClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    this._manageFormAction(event);
    this.dispatchEvent(new Event("nys-click"));
  }

  // Handle keydown for keyboard accessibility
  private _handleKeydown(e: KeyboardEvent) {
    if (
      e.code === "Space" ||
      e.code === "Enter" ||
      e.key === " " ||
      e.key === "Enter"
    ) {
      e.preventDefault();
      if (!this.disabled) {
        this._manageFormAction(e);
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
                id=${ifDefined(this.id)}
                name=${ifDefined(this.name ? this.name : undefined)}
                ?disabled=${this.disabled}
                aria-disabled="${this.disabled ? "true" : "false"}"
                form=${ifDefined(this.form ? this.form : undefined)}
                value=${ifDefined(this.value ? this.value : undefined)}
                href=${this.href}
                target=${this.target}
                aria-label=${this.ariaLabel ||
                this.label ||
                (this.circle ? this.icon : null) ||
                "button"}
                @click=${this._handleClick}
                @focus="${this._handleFocus}"
                @blur="${this._handleBlur}"
              >
                ${this.prefixIcon && this.variant !== "text"
                  ? html`<slot name="prefix-icon">
                      <nys-icon size="16" name=${this.prefixIcon}></nys-icon>
                    </slot>`
                  : ""}
                ${this.label && !this.circle
                  ? html`<label class="nys-button__text">${this.label}</label>`
                  : ""}
                ${this.suffixIcon && this.variant !== "text"
                  ? html`<slot name="suffix-icon">
                      <nys-icon size="16" name=${this.suffixIcon}></nys-icon>
                    </slot>`
                  : ""}
                ${this.circle && this.icon
                  ? html`<nys-icon size="24" name=${this.icon}></nys-icon>`
                  : ""}
              </a>
            </div>
          `
        : html`
            <button
              class="nys-button"
              id=${ifDefined(this.id)}
              name=${ifDefined(this.name ? this.name : undefined)}
              ?disabled=${this.disabled}
              form=${ifDefined(this.form ? this.form : undefined)}
              value=${ifDefined(this.value ? this.value : undefined)}
              type=${this.type}
              aria-label=${this.ariaLabel ||
              this.label ||
              (this.circle ? this.icon : null) ||
              "button"}
              @click=${this._handleClick}
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
              @keydown="${this._handleKeydown}"
            >
              ${this.prefixIcon && this.variant !== "text"
                ? html`<slot name="prefix-icon">
                    <nys-icon size="16" name=${this.prefixIcon}></nys-icon>
                  </slot>`
                : ""}
              ${this.label && !this.circle
                ? html`<label class="nys-button__text">${this.label}</label>`
                : ""}
              ${this.suffixIcon && this.variant !== "text"
                ? html`<slot name="suffix-icon">
                    <nys-icon size="16" name=${this.suffixIcon}></nys-icon>
                  </slot>`
                : ""}
              ${this.circle && this.icon
                ? html`<nys-icon
                    size=${this.size === "sm"
                      ? "24"
                      : this.size === "lg"
                        ? "40"
                        : "32"}
                    name=${this.icon}
                  ></nys-icon>`
                : ""}
            </button>
          `}
    `;
  }
}

if (!customElements.get("nys-button")) {
  customElements.define("nys-button", NysButton);
}

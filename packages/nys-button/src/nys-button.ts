import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-button.styles";
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
  @property({ type: String }) ariaControls = "";
  @property({ type: String }) prefixIcon = "";
  @property({ type: String }) suffixIcon = "";
  @property({ type: Boolean, reflect: true }) circle = false;
  @property({ type: String }) icon = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, reflect: true }) form: string | null = null;
  @property({ type: String }) value = "";
  @property({ type: String }) ariaDescription = "";
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
  @property({ attribute: false }) onClick: (event: Event) => void = () => {};
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

  public async getButtonElement(): Promise<HTMLElement | null> {
    await this.updateComplete; // Wait for the component to finish rendering

    // if it's a link button
    const linkEl =
      this.shadowRoot?.querySelector<HTMLAnchorElement>("a.nys-button") || null;
    if (linkEl) return linkEl;

    // Otherwise return the native button
    const btnEl =
      this.shadowRoot?.querySelector<HTMLButtonElement>("button.nys-button") ||
      null;
    if (btnEl) return btnEl;

    return null;
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

  private _manageFormAction() {
    // If an onClick function is provided, call it
    if (typeof this.onClick === "function") {
      this.onClick(new Event("click")); // Call user-provided onClick function with a fake click event
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
    const button = this.shadowRoot?.querySelector(".nys-button");
    button?.classList.remove("active-focus");
    this.dispatchEvent(new Event("nys-blur"));
  }

  private _handleClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    this._manageFormAction();
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
      if (this.disabled) return;

      e.preventDefault();

      if (this.href) {
        // Click the internal <a> so native navigation happens
        const linkEl = this.renderRoot.querySelector(
          "a.nys-button",
        ) as HTMLAnchorElement;
        if (linkEl) {
          linkEl.click();
        }
      } else {
        this._handleClick(e);
      }
    }
  }

  /******************** Public Methods ********************/
  public focus(options?: FocusOptions) {
    const innerEl = this.renderRoot.querySelector(
      this.href ? "a.nys-button" : "button.nys-button",
    ) as HTMLElement | null;

    if (innerEl) {
      innerEl.focus(options);
    } else {
      // fallback: focus host
      super.focus(options);
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
                value=${ifDefined(this.value ? this.value : undefined)}
                href=${this.href}
                target=${this.target}
                aria-label=${ifDefined(
                  this.ariaLabel ||
                    this.label ||
                    (this.circle ? this.icon : null) ||
                    "button",
                )}
                aria-description=${ifDefined(this.ariaDescription || undefined)}
                @click=${this._handleClick}
                @focus="${this._handleFocus}"
                @blur="${this._handleBlur}"
                @keydown="${this._handleKeydown}"
                role="button"
                tabindex="${this.disabled ? -1 : 0}"
              >
                ${this.prefixIcon && this.variant !== "text"
                  ? html`<slot name="prefix-icon">
                      <nys-icon size="16" name=${this.prefixIcon}></nys-icon>
                    </slot>`
                  : ""}
                ${this.label && !this.circle
                  ? html`<div class="nys-button__text">${this.label}</div>`
                  : ""}
                ${this.suffixIcon && this.variant !== "text"
                  ? html`<slot name="suffix-icon">
                      <nys-icon size="16" name=${this.suffixIcon}></nys-icon>
                    </slot>`
                  : ""}
                ${this.circle && this.icon
                  ? html`<slot name="circle-icon"
                      ><nys-icon
                        size=${this.size === "sm"
                          ? "24"
                          : this.size === "lg"
                            ? "40"
                            : "32"}
                        name=${this.icon}
                      ></nys-icon
                    ></slot>`
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
              form=${ifDefined(this.form || undefined)}
              value=${ifDefined(this.value ? this.value : undefined)}
              type=${this.type}
              aria-controls=${ifDefined(this.ariaControls || undefined)}
              aria-label=${ifDefined(
                this.ariaLabel ||
                  this.label ||
                  (this.circle ? this.icon : null) ||
                  this.prefixIcon ||
                  this.suffixIcon ||
                  "button",
              )}
              aria-description=${ifDefined(this.ariaDescription || undefined)}
              @click=${this._handleClick}
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
              @keydown="${this._handleKeydown}"
              role="button"
            >
              ${this.prefixIcon && this.variant !== "text"
                ? html`<slot name="prefix-icon">
                    <nys-icon size="16" name=${this.prefixIcon}></nys-icon>
                  </slot>`
                : ""}
              ${this.label && !this.circle
                ? html`<div class="nys-button__text">${this.label}</div>`
                : ""}
              ${this.suffixIcon && this.variant !== "text"
                ? html`<slot name="suffix-icon">
                    <nys-icon size="16" name=${this.suffixIcon}></nys-icon>
                  </slot>`
                : ""}
              ${this.circle && this.icon
                ? html`<slot name="circle-icon">
                    <nys-icon
                      size=${this.size === "sm"
                        ? "24"
                        : this.size === "lg"
                          ? "40"
                          : "32"}
                      name=${this.icon}
                    ></nys-icon>
                  </slot>`
                : ""}
            </button>
          `}
    `;
  }
}

if (!customElements.get("nys-button")) {
  customElements.define("nys-button", NysButton);
}

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-button.scss?inline";

let buttonIdCounter = 0; // Counter for generating unique IDs

/**
 * A button for actions like saving, submitting, or navigating. Form-associated with full keyboard support.
 *
 * Use `filled` for primary actions (one per section), `outline` for secondary, `ghost` for tertiary,
 * `text` for inline. Set `href` to render as a navigation link.
 *
 * @summary Button for actions and CTAs with variants, sizes, and icon support.
 * @element nys-button
 *
 * @slot prefix-icon - Icon before label. Not shown for `text` variant.
 * @slot suffix-icon - Icon after label. Not shown for `text` variant.
 * @slot circle-icon - Icon for circle mode. Overrides `icon` prop.
 *
 * @cssprop [--nys-button-color] - Text color of the button label.
 * @cssprop [--nys-button-color--hover] - Text color when hovered.
 * @cssprop [--nys-button-color--active] - Text color when active/pressed.
 * @cssprop [--nys-button-background-color] - Background color of the button.
 * @cssprop [--nys-button-background-color--hover] - Background color when hovered.
 * @cssprop [--nys-button-background-color--active] - Background color when active/pressed.
 * @cssprop [--nys-button-border-color] - Border color of the button.
 * @cssprop [--nys-button-border-color--hover] - Border color when hovered.
 * @cssprop [--nys-button-border-color--active] - Border color when active/pressed.
 *
 * @fires nys-click - Fired when the button is clicked (mouse or keyboard). Not fired when disabled.
 * @fires nys-focus - Fired when the button receives focus.
 * @fires nys-blur - Fired when the button loses focus.
 *
 * @example Basic filled button
 * ```html
 * <nys-button label="Submit" variant="filled"></nys-button>
 * ```
 *
 * @example Secondary outline button
 * ```html
 * <nys-button label="Cancel" variant="outline"></nys-button>
 * ```
 *
 * @example Button with icons
 * ```html
 * <nys-button label="Previous" prefixIcon="chevron_left"></nys-button>
 * <nys-button label="Next" suffixIcon="chevron_right"></nys-button>
 * ```
 *
 * @example Circle icon button
 * ```html
 * <nys-button circle icon="close" label="Close dialog"></nys-button>
 * ```
 *
 * @example Link-style button for navigation
 * ```html
 * <nys-button label="Visit NY.gov" href="https://www.ny.gov/" target="_blank" suffixIcon="open_in_new"></nys-button>
 * ```
 *
 * @example Form submit button
 * ```html
 * <nys-button type="submit" label="Save Changes" variant="filled"></nys-button>
 * ```
 */
export class NysButton extends LitElement {
  static styles = unsafeCSS(styles);

  /**
   * Unique identifier. Auto-generated if not provided.
   */
  @property({ type: String, reflect: true }) id = "";

  /**
   * Name for form submission.
   */
  @property({ type: String, reflect: true }) name = "";

  /**
   * Button height: `sm` (40px) for dense UIs, `md` (48px, default) for standard use, `lg` (56px) for prominent CTAs.
   * @default "md"
   */
  @property({ type: String, reflect: true }) size: "sm" | "md" | "lg" = "md";

  /**
   * Expands button to fill container width. Use for mobile layouts or stacked button groups.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) fullWidth = false;

  /**
   * Visual style: `filled` for primary (one per section), `outline` for secondary, `ghost` for tertiary, `text` for inline actions. Avoid `text` for navigation.
   * @default "filled"
   */
  @property({ type: String, reflect: true }) variant:
    | "filled"
    | "outline"
    | "ghost"
    | "text" = "filled";

  /**
   * Adjusts colors for dark backgrounds.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) inverted = false;

  /**
   * Visible button text. Use sentence case, action-oriented text (e.g., "Save Draft"). Becomes aria-label in `circle` mode.
   */
  @property({ type: String }) label = "";

  /**
   * Screen reader label. Required for icon-only buttons if `label` is not set.
   */
  @property({ type: String }) ariaLabel = "";

  /**
   * ID of controlled element (e.g., dropdown or modal). Sets `aria-controls`.
   */
  @property({ type: String }) ariaControls = "";

  /**
   * Material Symbol icon before label. Not shown for `text` variant or `circle` mode.
   */
  @property({ type: String }) prefixIcon = "";

  /**
   * Material Symbol icon after label. Use `chevron_down` for dropdowns, `open_in_new` for external links. Not shown for `text` variant or `circle` mode.
   */
  @property({ type: String }) suffixIcon = "";

  /**
   * Renders circular icon-only button. Requires `icon` prop. `label` becomes aria-label.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) circle = false;

  /**
   * Icon for circle mode. Required when `circle` is true. Scales with size (sm=24px, md=32px, lg=40px).
   */
  @property({ type: String }) icon = "";

  /**
   * Prevents interaction. Avoid disabling without explanation—show validation errors instead.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Form `id` to associate with. Use when button is outside the form element.
   */
  @property({ type: String, reflect: true }) form: string | null = null;

  /**
   * Value submitted with form data. Only used when `type="submit"`.
   */
  @property({ type: String }) value = "";

  /**
   * Additional screen reader description. Sets `aria-description`.
   */
  @property({ type: String }) ariaDescription = "";

  /**
   * Form behavior: `button` (default, no form action), `submit` (submits form), `reset` (resets form). Always set explicitly to avoid unintended submissions.
   * @default "button"
   */
  @property({ type: String, reflect: true }) type:
    | "submit"
    | "reset"
    | "button" = "button";

  /**
   * Click handler. Use instead of `@click` to ensure keyboard accessibility.
   */
  @property({ attribute: false }) onClick: ((event: Event) => void) | null =
    null;

  /**
   * URL to navigate to. Renders as `<a>` tag. Omit for action buttons.
   */
  @property({ type: String }) href = "";

  /**
   * Link target: `_self` (same tab), `_blank` (new tab—add `suffixIcon="open_in_new"`), `_parent`, `_top`, or frame name.
   * @default "_self"
   */
  @property({ type: String, reflect: true }) target:
    | "_self"
    | "_blank"
    | "_parent"
    | "_top"
    | "framename" = "_self";

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

  private _internals: ElementInternals;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

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

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _generateUniqueId() {
    return `nys-button-${Date.now()}-${buttonIdCounter++}`;
  }

  private _manageFormAction() {
    // If an onClick function is provided, call it
    if (typeof this.onClick === "function" && this.onClick !== null) {
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

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private _handleFocus() {
    this.dispatchEvent(new Event("nys-focus"));
  }

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
        this._handleAnyAttributeFunction();
        this._handleClick(e);
      }
    }
  }

  /**
   * Vanilla JS & Native HTML keydown solution:
   * The <nys-button onClick="doFunction();"></nys-button> onClick is an attribute here.
   * Thus, we call it here. Otherwise, at this point, this.onClick is null as it isn't props, but a string attribute
   * In vanilla HTML/JS, clicking with execute the attribute function, BUT now with keydown, hence this solution.
   */
  private _handleAnyAttributeFunction() {
    const onClickAttr = this.getAttribute("onClick");
    if (onClickAttr) {
      const callFunc = new Function("return " + onClickAttr);
      callFunc();
    }
  }

  // Public Methods
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
                name=${ifDefined(this.name ? this.name : undefined)}
                ?disabled=${this.disabled}
                aria-disabled="${this.disabled ? "true" : "false"}"
                value=${ifDefined(this.value ? this.value : undefined)}
                href=${this.href}
                target=${this.target}
                @click=${this._handleClick}
                @focus="${this._handleFocus}"
                @blur="${this._handleBlur}"
                @keydown="${this._handleKeydown}"
                tabindex="${this.disabled ? -1 : 0}"
                aria-label=${ifDefined(
                  this.ariaLabel ||
                    this.label ||
                    (this.circle ? this.icon : null) ||
                    "button",
                )}
                aria-description=${ifDefined(this.ariaDescription || undefined)}
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
              name=${ifDefined(this.name ? this.name : undefined)}
              ?disabled=${this.disabled}
              form=${ifDefined(this.form || undefined)}
              value=${ifDefined(this.value ? this.value : undefined)}
              type=${this.type}
              aria-controls=${ifDefined(this.ariaControls || undefined)}
              @click=${this._handleClick}
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
              @keydown="${this._handleKeydown}"
              tabindex="${this.disabled ? -1 : 0}"
              aria-label=${ifDefined(
                this.ariaLabel ||
                  this.label ||
                  (this.circle ? this.icon : null) ||
                  this.prefixIcon ||
                  this.suffixIcon ||
                  "button",
              )}
              aria-description=${ifDefined(this.ariaDescription || undefined)}
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

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-button.scss?inline";

let buttonIdCounter = 0;

/**
 * A button for actions like saving, submitting, or navigating. Form-associated with full keyboard support.
 *
 * **Status:** Stable | **WCAG:** 2.2 AA
 *
 * Use `filled` for primary actions (one per section), `outline` for secondary, `ghost` for tertiary,
 * `text` for inline. Set `href` to render as a navigation link.
 *
 * ## When to use
 * - Buttons for the most important actions users need to take, such as Download, Sign up, or Log out.
 * - Use `filled` for the primary action on the page (only one per section).
 * - Use `outline` for secondary actions alongside the primary action.
 * - Use `ghost` for additional actions beyond primary and secondary.
 * - Use `text` for inline actions within text blocks (not for external navigation—use links instead).
 * - Use `circle` for compact icon-only actions (like close, menu, or edit buttons).
 *
 * ## Variants
 * - `filled` (default): Primary action. Use sparingly, only one per page section.
 * - `outline`: Secondary action. Place next to or near the primary action.
 * - `ghost`: Tertiary or uncommon actions.
 * - `text`: Inline actions. Do NOT use for external navigation.
 *
 * ## Size and Layout
 * - `sm` (40px): Dense UIs or mobile layouts.
 * - `md` (48px, default): Standard button height.
 * - `lg` (56px): Prominent CTAs or touch targets.
 * - `fullWidth`: Expands button to fill container. Use for mobile stacks or single-button layouts.
 *
 * ## Icons
 * - `prefixIcon`: Icon before label (hidden for `text` variant). Use Material Symbol icon names.
 * - `suffixIcon`: Icon after label (hidden for `text` variant). Use `chevron_down` for dropdowns,
 *   `open_in_new` for external links (when href is set).
 * - `circle` mode: Renders a compact circular button. Requires `icon` prop. `label` is used as aria-label.
 *   Note: `prefixIcon` and `suffixIcon` are not supported in circle mode.
 * - Icon-only buttons without `label`: Always provide `ariaLabel` for screen reader users.
 *
 * ## Form behavior and accessibility
 * - **Always set `type` explicitly** to avoid unintended form submissions. Default is `button` (no submit).
 *   - `button`: Standard button, does not submit the form.
 *   - `submit`: Submits the nearest form when clicked.
 *   - `reset`: Resets form inputs to default values.
 * - **Use `onClick` prop, not `@click` or `@keydown`**: The `onClick` handler ensures both mouse and
 *   keyboard interactions (Enter, Space) are handled consistently, maintaining accessibility.
 * - `aria-label`: Auto-set to `label` prop if provided, or `ariaLabel` prop if set, or defaults to "button".
 * - Keyboard support: Enter and Space keys trigger the button.
 * - Visual focus indicators and disabled state handling built in.
 *
 * ## Navigation (Link mode)
 * - Set `href` to render as `<a>` tag instead of `<button>`.
 * - `target` prop controls link behavior: `_self` (default), `_blank` (new tab),
 *   `_parent`, `_top`, or a frame name.
 * - When `target="_blank"`, add `suffixIcon="open_in_new"` for visual clarity.
 *
 * ## Dark backgrounds
 * - Set `inverted` prop when the button is on a dark background to adjust colors.
 *
 * ## Content guidelines
 * - Use sentence case: capitalize first word only (unless it's a proper noun).
 * - Use action verbs: "Save", "Download", "Sign up", "Close", "Edit".
 * - Avoid unnecessary verbs like "View", "Go", "Read" (the button context is clear).
 * - No articles ("a", "an", "the") or punctuation.
 * - Keep labels short and predictable. Users should know what happens when they click.
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Always set the `type` attribute explicitly (`submit`, `reset`, or `button`).
 * - Use sentence case for button labels, capitalizing only the first word.
 * - Use `chevron_down` icon on the right for buttons that open a dropdown.
 * - Use `filled` variant for the primary action (one per page section only).
 * - Use `outline` variant for secondary actions.
 *
 * **Don't:**
 * - Use buttons for external navigation. Use an HTML `<a>` link or `text` variant instead.
 * - Use icons in buttons without a text label. Very few icons are universally understood.
 * - Create custom button styles (color, shape, size). Use only the defined variants and sizes.
 * - Use `inverted` buttons on light backgrounds—reserve for dark backgrounds only.
 *
 * ## Dependencies
 *
 * This component depends on the following NYS Design System components:
 *
 *   - `nys-icon`
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
 *
 * @example Listening to click events
 * ```js
 * const button = document.querySelector('nys-button');
 * button.addEventListener('nys-click', () => {
 *   console.log('Button clicked');
 * });
 * button.addEventListener('nys-focus', () => {
 *   console.log('Button focused');
 * });
 * button.addEventListener('nys-blur', () => {
 *   console.log('Button blurred');
 * });
 * ```
 */

export class NysButton extends LitElement {
  static styles = unsafeCSS(styles);
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

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
   * Material Symbol icon before label. Not shown for `circle` mode.
   */
  @property({ type: String }) prefixIcon = "";

  /**
   * Material Symbol icon after label. Use `chevron_down` for dropdowns, `open_in_new` for external links. Not shown for `circle` mode.
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
    this.dispatchEvent(
      new Event("nys-focus", { bubbles: true, composed: true }),
    );
  }

  private _handleBlur() {
    const button = this.shadowRoot?.querySelector(".nys-button");
    button?.classList.remove("active-focus");
    this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true }),
    );
  }

  private _handleClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    this._manageFormAction();
    this.dispatchEvent(
      new Event("nys-click", { bubbles: true, composed: true }),
    );
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
      const btn = this.renderRoot.querySelector(".nys-button");
      btn?.classList.add("active");
      setTimeout(() => btn?.classList.remove("active"), 150);

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

  private _handleKeyup(e: KeyboardEvent) {
    if (
      e.code === "Space" ||
      e.code === "Enter" ||
      e.key === " " ||
      e.key === "Enter"
    ) {
      this.renderRoot.querySelector(".nys-button")?.classList.remove("active");
    }
  }

  /**
   * A Solution to the Vanilla JS & Native HTML keydown:
   *
   * Handles inline onClick attributes set as strings in vanilla HTML
   * (e.g. <nys-button onClick="doSomething()">).
   *
   * When onClick is set this way, it is a DOM attribute (not a property)
   * so this.onClick remains null. Native clicks execute the attribute
   * automatically, but keydown events do not, so we invoke it manually here.
   */
  private _handleAnyAttributeFunction() {
    const onClickAttr = this.getAttribute("onClick");
    if (onClickAttr) {
      const callFunc = new Function("return " + onClickAttr);
      callFunc();
    }
  }

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
                @keyup="${this._handleKeyup}"
                tabindex="${this.disabled ? -1 : 0}"
                aria-label=${ifDefined(
                  this.ariaLabel ||
                    this.label ||
                    (this.circle ? this.icon : null) ||
                    "button",
                )}
                aria-description=${ifDefined(this.ariaDescription || undefined)}
              >
                ${this.prefixIcon
                  ? html`<slot name="prefix-icon">
                      <nys-icon size="16" name=${this.prefixIcon}></nys-icon>
                    </slot>`
                  : ""}
                ${this.label && !this.circle
                  ? html`<div class="nys-button__text">${this.label}</div>`
                  : ""}
                ${this.suffixIcon
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
              aria-disabled="${this.disabled ? "true" : "false"}"
              form=${ifDefined(this.form || undefined)}
              value=${ifDefined(this.value ? this.value : undefined)}
              type=${this.type}
              aria-controls=${ifDefined(this.ariaControls || undefined)}
              @click=${this._handleClick}
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
              @keydown="${this._handleKeydown}"
              @keyup="${this._handleKeyup}"
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
              ${this.prefixIcon
                ? html`<slot name="prefix-icon">
                    <nys-icon size="16" name=${this.prefixIcon}></nys-icon>
                  </slot>`
                : ""}
              ${this.label && !this.circle
                ? html`<div class="nys-button__text">${this.label}</div>`
                : ""}
              ${this.suffixIcon
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

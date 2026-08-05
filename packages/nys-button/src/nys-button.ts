import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { NysFormControlElement } from "@nysds/internals";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-button.scss?inline";

/**
 * A button for actions like saving, submitting, or navigating. Form-associated with full keyboard support.
 *
 * Use `filled` for primary actions (one per section), `outline` for secondary, `ghost` for tertiary,
 * `text` for inline. Set `href` to render as a navigation link.
 *
 * ARIA belongs on the component's props, not on the `<nys-button>` host. The host has no role,
 * so attributes placed there are not mapped into the accessibility tree and never reach the
 * internal `<button>`. For a disclosure trigger use `ariaExpanded` together with `ariaControls`.
 *
 * @summary Button for actions and CTAs with variants, sizes, and icon support.
 * @element nys-button
 *
 * @slot - Button label text. Use as fallback when `label` prop is not provided.
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
 * @example Basic
 * ```html
 * <nys-button label="Button" variant="filled"></nys-button>
 * ```
 *
 * @example Variant Outline
 * ```html
 * <nys-button label="Button" variant="outline"></nys-button>
 * ```
 *
 * @example Variant Ghost
 * ```html
 * <nys-button label="Button" variant="ghost"></nys-button>
 * ```
 *
 * @example Variant Text
 * ```html
 * <nys-button label="Button" variant="text"></nys-button>
 * ```
 *
 * @example Prefix Icon
 * ```html
 * <nys-button label="Previous" prefixIcon="chevron_left"></nys-button>
 * ```
 *
 * @example Suffix Icon
 * ```html
 * <nys-button label="Next" suffixIcon="chevron_right"></nys-button>
 * ```
 *
 * @example Slotted Icons
 * ```html
 * <nys-button label="Slotted icons">
 *   <nys-icon color="#db117d" slot="prefix-icon" name="chevron_left"></nys-icon>
 *   <nys-icon color="#db117d" slot="suffix-icon" name="chevron_right"></nys-icon>
 * </nys-button>
 * ```
 *
 * @example Circle icon button
 * ```html
 * <nys-button circle icon="close" label="Close dialog"></nys-button>
 * ```
 *
 * @example Size Small
 * ```html
 * <nys-button label="Small" size="sm"></nys-button>
 * ```
 * @example Size Large
 * ```html
 * <nys-button label="Large" size="lg"></nys-button>
 * ```
 *
 * @example Full width
 * ```html
 * <nys-button label="Full width" fullWidth></nys-button>
 * ```
 *
 * @example Inverted
 * ```html
 * <nys-button label="Inverted" inverted></nys-button>
 * ```
 * @render Inverted
 * ```html
 * <div style="background: #1b1b1b; padding: 1rem;">
 *   <nys-button label="Inverted" inverted></nys-button>
 * </div>
 * ```
 *
 * @example Disabled
 * ```html
 * <nys-button label="Disabled" disabled></nys-button>
 * ```
 *
 * @example Href
 * ```html
 * <nys-button label="Visit NY.gov" href="https://www.ny.gov/" target="_blank" suffixIcon="open_in_new"></nys-button>
 * ```
 *
 * @example Type
 * ```html
 * <nys-button type="submit" label="Save Changes" variant="filled"></nys-button>
 * ```
 *
 * @example Disclosure trigger
 * ```html
 * <nys-button
 *   label="Here's how you know"
 *   ariaExpanded="false"
 *   ariaControls="trust-bar"
 * ></nys-button>
 * ```
 */

export class NysButton extends NysFormControlElement {
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
   * Visible button text. Use sentence case, action-oriented text (e.g., "Save Draft"). In `circle` mode it is visually hidden but still exposed to assistive tech as the accessible name.
   */
  @property({ type: String }) label = "";

  /**
   * ID of controlled element (e.g., dropdown or modal). Sets `aria-controls`.
   *
   * Set this on `<nys-button>` rather than putting `aria-controls` on the host:
   * the host has no role, so ARIA placed there is not mapped into the
   * accessibility tree and never reaches the internal `<button>`.
   */
  @property({ type: String }) ariaControls = "";

  /**
   * Disclosure state for buttons that show/hide content. Sets `aria-expanded`
   * on the internal `<button>`/`<a>`.
   *
   * Use `"false"` when the controlled content is collapsed and `"true"` when it
   * is expanded, updating it every time the content toggles. Leave unset for
   * buttons that are not disclosure triggers — an `aria-expanded` that never
   * changes is worse than none. Pair with `ariaControls` pointing at the
   * element being shown or hidden.
   *
   * Setting `aria-expanded` directly on the `<nys-button>` host does nothing:
   * a custom element with no role does not map its ARIA attributes into the
   * accessibility tree, and host ARIA does not cross into the shadow root.
   *
   * @example
   * ```html
   * <nys-button
   *   label="Here's how you know"
   *   ariaExpanded="false"
   *   ariaControls="trust-bar"
   * ></nys-button>
   * ```
   */
  @property({ type: String }) ariaExpanded: "true" | "false" | "" = "";

  /**
   * Material Symbol icon before label. Not shown for `circle` mode.
   */
  @property({ type: String }) prefixIcon = "";

  /**
   * Material Symbol icon after label. Use `chevron_down` for dropdowns, `open_in_new` for external links. Not shown for `circle` mode.
   */
  @property({ type: String }) suffixIcon = "";

  /**
   * Renders circular icon-only button. Requires `icon` prop. `label` is rendered as visually-hidden text for the accessible name.
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
   * ID(s) of element(s) describing this button. Sets `aria-describedby`.
   */
  @property({ type: String }) ariaDescribedBy = "";

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

  @state() private _hasPrefixSlot = false;
  @state() private _hasSuffixSlot = false;
  @state() private _hasCircleSlot = false;

  /**
   * Functions
   * --------------------------------------------------------------------------
   *
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals). super.connectedCallback() assigns
   * an id when one is not provided (prefix = the element's localName).
   */

  private _onPrefixSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasPrefixSlot = slot.assignedElements({ flatten: true }).length > 0;
  }

  private _onSuffixSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasSuffixSlot = slot.assignedElements({ flatten: true }).length > 0;
  }

  private _onCircleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasCircleSlot = slot.assignedElements({ flatten: true }).length > 0;
  }

  private _manageFormAction() {
    // If an onClick function is provided, call it
    if (typeof this.onClick === "function" && this.onClick !== null) {
      this.onClick(new Event("click")); // Call user-provided onClick function with a fake click event
    }

    // If part of a form, perform the corresponding action based on button's "type"
    const form = this.internals?.form;

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
   * Handles inline onclick attributes for keyboard activation.
   *
   * Native clicks execute inline onclick attributes automatically, but
   * keyboard activation of the custom element does not trigger that native
   * behavior. Dispatching a synthetic click lets the browser's own inline
   * event handler mechanism execute any onclick attribute safely without
   * eval() or new Function().
   */
  private _handleAnyAttributeFunction() {
    this.click();
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
                aria-describedby=${ifDefined(this.ariaDescribedBy || undefined)}
                aria-expanded=${ifDefined(this.ariaExpanded || undefined)}
              >
                <slot
                  name="prefix-icon"
                  @slotchange=${this._onPrefixSlotChange}
                  ?hidden=${!this.prefixIcon && !this._hasPrefixSlot}
                >
                  ${this.prefixIcon
                    ? html`<nys-icon
                        size="16"
                        name=${this.prefixIcon}
                      ></nys-icon>`
                    : ""}
                </slot>
                ${this.circle
                  ? html`<div class="nys-button__text sr-only">
                      ${this.label}
                    </div>`
                  : this.label
                    ? html`<div class="nys-button__text">${this.label}</div>`
                    : html` <slot class="nys-button__default-slot"></slot> `}
                <slot
                  name="suffix-icon"
                  @slotchange=${this._onSuffixSlotChange}
                  ?hidden=${!this.suffixIcon && !this._hasSuffixSlot}
                >
                  ${this.suffixIcon
                    ? html`<nys-icon
                        size="16"
                        name=${this.suffixIcon}
                      ></nys-icon>`
                    : ""}
                </slot>
                <slot
                  name="circle-icon"
                  @slotchange=${this._onCircleSlotChange}
                  ?hidden=${!this.circle ||
                  (!this.icon && !this._hasCircleSlot)}
                >
                  ${this.icon
                    ? html`<nys-icon
                        size=${this.size === "sm"
                          ? "24"
                          : this.size === "lg"
                            ? "40"
                            : "32"}
                        name=${this.icon}
                      ></nys-icon>`
                    : ""}
                </slot>
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
              @focus=${this._handleFocus}
              @blur=${this._handleBlur}
              @keydown=${this._handleKeydown}
              @keyup=${this._handleKeyup}
              aria-describedby=${ifDefined(this.ariaDescribedBy || undefined)}
              aria-expanded=${ifDefined(this.ariaExpanded || undefined)}
            >
              <slot
                name="prefix-icon"
                @slotchange=${this._onPrefixSlotChange}
                ?hidden=${!this.prefixIcon && !this._hasPrefixSlot}
              >
                ${this.prefixIcon
                  ? html`<nys-icon
                      size="16"
                      name=${this.prefixIcon}
                    ></nys-icon>`
                  : ""}
              </slot>
              ${this.circle
                ? html`<div class="nys-button__text sr-only">
                    ${this.label}
                  </div>`
                : this.label
                  ? html`<div class="nys-button__text">${this.label}</div>`
                  : html` <slot class="nys-button__default-slot"></slot> `}
              <slot
                name="suffix-icon"
                @slotchange=${this._onSuffixSlotChange}
                ?hidden=${!this.suffixIcon && !this._hasSuffixSlot}
              >
                ${this.suffixIcon
                  ? html`<nys-icon
                      size="16"
                      name=${this.suffixIcon}
                    ></nys-icon>`
                  : ""}
              </slot>
              <slot
                name="circle-icon"
                @slotchange=${this._onCircleSlotChange}
                ?hidden=${!this.circle || (!this.icon && !this._hasCircleSlot)}
              >
                ${this.icon
                  ? html`<nys-icon
                      size=${this.size === "sm"
                        ? "24"
                        : this.size === "lg"
                          ? "40"
                          : "32"}
                      name=${this.icon}
                    ></nys-icon>`
                  : ""}
              </slot>
            </button>
          `}
    `;
  }
}

if (!customElements.get("nys-button")) {
  customElements.define("nys-button", NysButton);
}

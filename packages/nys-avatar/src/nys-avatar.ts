import { html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { NysElement } from "@nysds/internals";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-avatar.scss?inline";

/**
 * Displays a user representation as image, initials, or icon with automatic fallback chain.
 *
 * Priority: `image` > `initials` > `icon` > default icon. Set `color` to customize background;
 * foreground auto-adjusts for contrast. Use `interactive` for clickable avatars (e.g., profile menus).
 *
 * @summary User avatar with image, initials, or icon fallback and contrast-aware colors.
 * @element nys-avatar
 *
 * @slot - Custom icon content. Overrides default icon when no image or initials.
 *
 * @example Image avatar
 * ```html
 * <nys-avatar image="/path/to/photo.jpg" ariaLabel="Jane Smith"></nys-avatar>
 * ```
 *
 * @example Initials avatar with custom color
 * ```html
 * <nys-avatar initials="JS" color="var(--nys-color-theme)" ariaLabel="Jane Smith"></nys-avatar>
 * ```
 */

export class NysAvatar extends NysElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Accessible label for screen readers. Required when no image `alt` is available. */
  @property({ type: String }) ariaLabel = "";

  /** Image URL. Takes priority over initials and icon. */
  @property({ type: String }) image = "";

  /** 1-2 character initials. Used when no image is provided. */
  @property({ type: String }) initials = "";

  /** Custom icon name. Falls back to `account_circle` if not set. */
  @property({ type: String }) icon = "";

  /** Background color. Foreground auto-adjusts for contrast. Accepts CSS values or variables. */
  @property({ type: String }) color = "";

  /** Makes avatar clickable with button role and focus ring. */
  @property({ type: Boolean, reflect: true }) interactive = false;

  /** Prevents interaction when `interactive` is true. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Enables lazy loading for the image. */
  @property({ type: Boolean, reflect: true }) lazy = false;
  @state() private _slotHasContent = false;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  connectedCallback() {
    // super.connectedCallback() (NysElement) assigns an auto-generated
    // id (prefixed with the element's localName) when one is not provided. The
    // semantic role (img / button) intentionally lives on the inner
    // .nys-avatar__component element, so defaultRole stays null and no role is
    // moved onto the host.
    super.connectedCallback();
  }

  private async _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    if (!slot) {
      this._slotHasContent = false;
      return;
    }

    await Promise.resolve();

    const assignedNodes = slot
      .assignedNodes({ flatten: true })
      .filter(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE ||
          (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()),
      );

    this._slotHasContent = assignedNodes.length > 0;
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private get _cleanAriaLabel(): string {
    return (this.ariaLabel ?? "").replace(/[\s\u00a0]+/g, " ").trim();
  }

  private _colorStyle(): string {
    if (!this.color) return "";
    const fg = this.getContrastForeground() ?? "";
    return `--_nys-avatar-background-color: ${this.color}; --_nys-avatar-color: ${fg}; color: ${fg}`;
  }

  /**
   * Computes the appropriate foreground color (icon or initials)
   * based on the avatar's background color for sufficient contrast.
   *
   * @returns CSS color string for foreground
   */
  private getContrastForeground() {
    // Default NYSDS CSS vars for foreground.
    // Contrast must return =>
    // IF icon: "--nys-color-ink-reverse" or "--nys-color-ink"
    // If initials: "--nys-color-text-reverse" or "--nys-color-text"
    const fgIconDark = "var(--nys-color-ink, #000)";
    const fgIconLight = "var(--nys-color-ink-reverse, #fff)";
    const fgInitialDark = "var(--nys-color-text, #000)";
    const fgInitialLight = "var(--nys-color-text-reverse, #fff)";

    if (!this.color) return;

    // Create a temporary element to compute luminance (this is in case user pass in "var(--nys-color-stuff)")
    const div = document.createElement("div");
    div.style.color = this.color;
    document.body.appendChild(div);
    const computedColor = getComputedStyle(div).color;
    document.body.removeChild(div);

    // Parse RGB
    const match = computedColor.match(/\d+/g);
    if (!match) return;

    const r = Number(match[0]);
    const g = Number(match[1]);
    const b = Number(match[2]);

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    const isDark = luminance < 0.5;
    if (this.initials?.length > 0) {
      return isDark ? fgInitialLight : fgInitialDark;
    } else {
      return isDark ? fgIconLight : fgIconDark;
    }
  }

  render() {
    const label = this._cleanAriaLabel;
    const colorStyle = this._colorStyle();

    const avatarContent =
      this.image?.length > 0
        ? html`<img
            part="nys-avatar__image"
            class="nys-avatar__image"
            src=${this.image}
            alt=${label || ""}
            loading=${this.lazy ? "lazy" : "eager"}
          />`
        : this.initials?.length > 0
          ? html`<span
              part="nys-avatar__initials"
              class="nys-avatar__initials"
              aria-hidden="true"
              >${this.initials}</span
            >`
          : html`<div part="nys-avatar__icon">
              <slot @slotchange=${this._handleSlotChange}></slot>
              ${!this._slotHasContent
                ? html`<nys-icon
                    aria-hidden="true"
                    name=${this.icon?.length > 0 ? this.icon : "account_circle"}
                  ></nys-icon>`
                : null}
            </div>`;

    // An interactive avatar is a <button>, which must always have an accessible
    // name (WCAG 4.1.2 Name, Role, Value). The image alt / decorative icon do not
    // provide one, so fall back to a sensible default ("Avatar") when the consumer
    // did not supply an ariaLabel.
    const interactiveLabel = label || "Avatar";

    const container = this.interactive
      ? html`<button
          part="nys-avatar"
          class="nys-avatar__component"
          style=${ifDefined(colorStyle || undefined)}
          aria-label=${interactiveLabel}
          ?disabled=${this.disabled}
        >
          ${avatarContent}
        </button>`
      : html`<div
          part="nys-avatar"
          class="nys-avatar__component"
          style=${ifDefined(colorStyle || undefined)}
          role=${ifDefined(this.image ? undefined : label ? "img" : undefined)}
          aria-label=${ifDefined(this.image ? undefined : label || undefined)}
          aria-hidden=${ifDefined(this.image || label ? undefined : "true")}
        >
          ${avatarContent}
        </div>`;

    return html`
      <div class="nys-avatar">
        <div class="nys-avatar__content">${container}</div>
      </div>
    `;
  }
}

if (!customElements.get("nys-avatar")) {
  customElements.define("nys-avatar", NysAvatar);
}

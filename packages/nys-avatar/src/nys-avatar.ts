import { html, unsafeCSS, type PropertyValues } from "lit";
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
 * An avatar with no `ariaLabel` is treated as decorative and hidden from assistive
 * tech — correct beside a visible name, wrong for an `interactive` avatar, which
 * renders a `<button>` and warns in the console when left nameless.
 *
 * @summary User avatar with image, initials, or icon fallback and contrast-aware colors.
 * @element nys-avatar
 *
 * @slot - Custom icon content. Overrides default icon when no image or initials.
 *
 * @example Basic
 * ```html
 * <nys-avatar ariaLabel="User avatar"></nys-avatar>
 * ```
 *
 * @example Image
 * ```html
 * <nys-avatar
 *  image="path/to/img.png"
 *  ariaLabel="Jane Smith"
 * ></nys-avatar>
 * ```
 * @render Image
 * ```html
 * <nys-avatar
 *  image="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
 *  ariaLabel="Jane Smith"
 * ></nys-avatar>
 * ```
 *
 * @example Initials
 * ```html
 * <nys-avatar initials="JS" ariaLabel="Jane Smith"></nys-avatar>
 * ```
 *
 * @example Icon
 * ```html
 * <nys-avatar icon="account_circle"></nys-avatar>
 * ```
 *
 * @example Interactive
 * ```html
 * <!-- Interactive renders a <button>, so it always needs a name. -->
 * <nys-avatar interactive ariaLabel="Open account menu"></nys-avatar>
 * ```
 *
 * @example Decorative
 * ```html
 * <!-- No ariaLabel: hidden from assistive tech, for use beside a visible name. -->
 * <nys-avatar initials="JS"></nys-avatar>
 * <span>Jane Smith</span>
 * ```
 *
 * @example Disabled
 * ```html
 * <nys-avatar disabled></nys-avatar>
 * ```
 *
 * @example Custom Background Color
 * ```html
 * <nys-avatar
 *   color="var(--nys-color-red-500)"
 *   interactive
 *   ariaLabel="Open account menu"
 * ></nys-avatar>
 * ```
 *
 * @example Lazy Loading
 * ```html
 * <nys-avatar lazy></nys-avatar>
 * ```
 */

export class NysAvatar extends NysElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /**
   * Accessible name for the avatar — who or what it represents ("Jane Smith"),
   * not what it is ("avatar").
   *
   * Leave it unset for a decorative avatar and the whole thing is hidden from
   * assistive tech, which is the right outcome next to a visible name. Set it
   * whenever the avatar is the only thing identifying the person, and always when
   * `interactive` is set: that renders a `<button>`, and a nameless button cannot
   * be operated by screen reader or voice-control users (WCAG 4.1.2). An
   * interactive avatar without a name logs a console warning.
   *
   * Whitespace-only values — including a non-breaking space — count as no name.
   */
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

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    // Cheap enough to re-check every cycle, and the once-guard keeps a repeatedly
    // re-rendering avatar from filling the console.
    this._warnMissingInteractiveName();
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

  /**
   * The label with all whitespace — including the non-breaking space consumers
   * reach for when they want "no label but the prop is required" — collapsed and
   * trimmed. A name made only of blank characters is announced as an empty name,
   * so `" "` and `"&nbsp;"` must resolve to no label at all rather than to a
   * label the user can neither hear nor act on.
   */
  private get _cleanAriaLabel(): string {
    return (this.ariaLabel ?? "").replace(/[\s\u00a0]+/g, " ").trim();
  }

  /** One warning per gap, so a re-rendering avatar cannot flood the console. */
  private _warnedMissingName = false;

  /**
   * Warns when an interactive avatar has no accessible name.
   *
   * An interactive avatar renders a `<button>`, and a button with no name is
   * unusable by screen reader and voice-control users (WCAG 4.1.2). The component
   * used to paper over this with a captive default name of "Avatar", which told
   * the user nothing ("button, avatar") and hid the mistake from audits (#1093).
   * The name is the author's to supply, so the component surfaces the gap here
   * instead of inventing one. `ariaLabel` deliberately stays optional —
   * decorative avatars are legitimate, and making it required would break the
   * consumers already shipping without it.
   */
  private _warnMissingInteractiveName() {
    if (!this.interactive || this._cleanAriaLabel) {
      // A name arriving later clears the warning so a fresh gap is reported.
      this._warnedMissingName = false;
      return;
    }
    if (this._warnedMissingName) return;
    this._warnedMissingName = true;

    console.warn(
      `nys-avatar: interactive avatar "${this.id}" has no accessible name — ` +
        `set ariaLabel to describe who or what it represents (WCAG 4.1.2).`,
    );
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

    const container = this.interactive
      ? html`<button
          part="nys-avatar"
          class="nys-avatar__component"
          style=${ifDefined(colorStyle || undefined)}
          aria-label=${ifDefined(label || undefined)}
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

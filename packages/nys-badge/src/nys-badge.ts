import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-badge.scss?inline";

let badgeIdCounter = 0;

/**
 * A compact label for status, counts, or categorization. Supports semantic intents with auto-selected icons.
 *
 * Use badges to highlight metadata like status ("Approved"), counts ("3 new"), or categories.
 * Set `intent` to apply semantic meaning. Add `prefixIcon` or `suffixIcon` as boolean for default icons,
 * or pass icon name strings for custom icons.
 *
 * @summary Compact label for status, counts, or categorization with semantic styling.
 * @element nys-badge
 *
 * @example Basic
 * ```html
 * <nys-badge label="Basic badge"></nys-badge>
 * ```
 *
 * @example Intent
 * ```html
 * // -- render --
 * <div class="nys-display-flex nys-flex-gap-100">
 *   <nys-badge label="Neutral" prefixIcon></nys-badge>
 *   <nys-badge label="Error" intent="error" prefixIcon></nys-badge>
 *   <nys-badge label="Warning" intent="warning" prefixIcon></nys-badge>
 *   <nys-badge label="Success" intent="success" prefixIcon></nys-badge>
 * </div>
 * // -- code --
 * <nys-badge label="Neutral" prefixIcon></nys-badge>
 * <nys-badge label="Error" intent="error" prefixIcon></nys-badge>
 * <nys-badge label="Warning" intent="warning" prefixIcon></nys-badge>
 * <nys-badge label="Success" intent="success" prefixIcon></nys-badge>
 * ```
 *
 * @example Strong Variant
 * ```html
 * // -- render --
 * <div class="nys-display-flex nys-flex-gap-100">
 *   <nys-badge variant="strong" label="Neutral" prefixIcon></nys-badge>
 *   <nys-badge variant="strong" label="Error" intent="error" prefixIcon></nys-badge>
 *   <nys-badge variant="strong" label="Warning" intent="warning" prefixIcon></nys-badge>
 *   <nys-badge variant="strong" label="Success" intent="success" prefixIcon></nys-badge>
 * </div>
 * // -- code --
 * <nys-badge variant="strong" label="Neutral" prefixIcon></nys-badge>
 * <nys-badge variant="strong" label="Error" intent="error" prefixIcon></nys-badge>
 * <nys-badge variant="strong" label="Warning" intent="warning" prefixIcon></nys-badge>
 * <nys-badge variant="strong" label="Success" intent="success" prefixIcon></nys-badge>
 * ```
 *
 * @example Custom icons
 * ```html
 * // -- render --
 * <div class="nys-display-flex nys-flex-gap-100">
 *   <nys-badge label="Custom prefixIcon" prefixIcon="check"></nys-badge>
 *   <nys-badge label="Custom suffixIcon" suffixIcon="check"></nys-badge>
 * </div>
 * // -- code --
 * <nys-badge label="Custom prefixIcon" prefixIcon="check"></nys-badge>
 * <nys-badge label="Custom suffixIcon" suffixIcon="check"></nys-badge>
 * ```
 *
 * @example Size
 * ```html
 * <nys-badge label="Small" size="sm"></nys-badge>
 * ```
 *
 * @example Screen reader text
 * ```html
 * <nys-badge intent="warning" label="Caution" prefixIcon srText="concern"></nys-badge>
 * ```
 */

export class NysBadge extends LitElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. */
  @property({ type: String, reflect: true }) id = "";

  /** Name attribute for form association. */
  @property({ type: String, reflect: true }) name = "";

  /**
   * Badge size: `sm` (smaller text) or `md` (default).
   * @default "md"
   */
  @property({ type: String, reflect: true }) size: "sm" | "md" = "md";

  /**
   * Semantic intent affecting color: `neutral`, `error`, `success`, or `warning`.
   * @default "neutral"
   */
  @property({ type: String, reflect: true }) intent:
    | "neutral"
    | "error"
    | "success"
    | "warning" = "neutral";

  /** Secondary label displayed before the main label. */
  @property({ type: String }) prefixLabel = "";

  /** Primary label text displayed in the badge. */
  @property({ type: String }) label = "";

  /** Screen reader text appended after the label for additional context. */
  @property({ type: String }) srText = "";

  @property({ type: String, reflect: true }) variant: "strong" | "" = "";

  // Icons (string or boolean)
  private _prefixIcon: string | boolean = "";
  @property({ type: String, attribute: "prefixicon" })
  get prefixIcon(): string | boolean {
    return this._prefixIcon;
  }
  set prefixIcon(value: string | boolean) {
    if (value === "" || value === null) {
      // boolean attribute without value → true
      this._prefixIcon = true;
    } else if (value === "false" || value === false) {
      this._prefixIcon = "";
    } else {
      this._prefixIcon = value;
    }
  }

  private _suffixIcon: string | boolean = "";
  @property({ type: String, attribute: "suffixicon" })
  get suffixIcon(): string | boolean {
    return this._suffixIcon;
  }
  set suffixIcon(value: string | boolean) {
    if (value === "" || value === null) {
      this._suffixIcon = true;
    } else if (value === "false" || value === false) {
      this._suffixIcon = "";
    } else {
      this._suffixIcon = value;
    }
  }

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  connectedCallback() {
    super.connectedCallback();

    if (!this.id) {
      this.id = `nys-badge-${Date.now()}-${badgeIdCounter++}`;
    }

    const attr = this.getAttribute("prefixicon");
    if (attr !== null && this.prefixIcon === "") {
      this.prefixIcon = attr;
    }

    const suffixAttr = this.getAttribute("suffixicon");
    if (suffixAttr !== null && this.suffixIcon === "") {
      this.suffixIcon = suffixAttr;
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  // Map of default icons by intent
  private static readonly DEFAULT_ICONS: Record<string, string> = {
    neutral: "info",
    error: "emergency_home",
    success: "check_circle",
    warning: "warning",
  };

  /**
   * Resolves which icon should be rendered.
   * @param icon The icon property value (string or boolean)
   * @returns Icon name or null if no icon should be rendered
   */
  private resolveIcon(icon: string | boolean): string | null {
    if (icon === true) {
      return NysBadge.DEFAULT_ICONS[this.intent] ?? "info";
    }
    if (typeof icon === "string" && icon.trim() !== "") {
      return icon;
    }
    return null;
  }

  render() {
    const prefixIconName = this.resolveIcon(this.prefixIcon);
    const suffixIconName = this.resolveIcon(this.suffixIcon);

    return html`
      <mark class="nys-badge">
        ${prefixIconName
          ? html`<nys-icon size="16" name=${prefixIconName}></nys-icon>`
          : ""}
        ${this.prefixLabel
          ? html`<div class="nys-badge__prefix">${this.prefixLabel}</div>`
          : ""}
        <div class="nys-badge__label">
          ${this.label}
          ${this.srText
            ? html`<span class="nys-badge__sr-only"
                >${": " + this.srText}</span
              >`
            : ""}
        </div>

        ${suffixIconName
          ? html`<nys-icon size="16" name=${suffixIconName}></nys-icon>`
          : ""}
      </mark>
    `;
  }
}

if (!customElements.get("nys-badge")) {
  customElements.define("nys-badge", NysBadge);
}

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-badge.scss?inline";

let badgeIdCounter = 0;

/**
 * A compact label for status, counts, or categorization. Supports semantic intents with auto-selected icons.
 *
 * **Status:** Stable | **WCAG:** 2.2 AA
 *
 * Use badges to highlight metadata like status ("Approved"), counts ("3 new"), or categories.
 * Set `intent` to apply semantic meaning. Add `prefixIcon` or `suffixIcon` as boolean for default icons,
 * or pass icon name strings for custom icons. If an id is not passed, a unique id will be generated.
 *
 * ## When to use
 *
 * - To display a small piece of information that is related to another element
 * - To draw attention to new, important content
 * - To indicate the status of an item, such as "new", "updated", or "beta"
 * - To provide additional context or information about an item without cluttering the interface
 *
 * Do not use when the information is too complex to be conveyed in a small badge, when the badge would not add
 * significant value to the user experience, when the badge would clutter the interface or distract from more important
 * content, or as a link to another page or action (badges are not interactive elements).
 *
 * ## Variants
 *
 * Badge can include icons as either a prefix or suffix. The icons can be specified using the `prefixIcon` or `suffixIcon`
 * attributes. Pass in the attribute as a boolean to use the default icon, or pass in a string to use a specific icon.
 * Icons do not appear by default and must be explicitly specified.
 *
 * Badge is available in two sizes: medium (`md`, default) and small (`sm`). Do not mix sizes within a group of badges.
 *
 * Badge can include a prefix label, which is a short text that appears before the main label, specified using the
 * `prefixLabel` attribute.
 *
 * Intent options: `neutral`, `error`, `success`, or `warning`. The default intent is `neutral`.
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Keep badge labels short—one or two words like "New", "Beta", or "Updated".
 * - Use the `intent` property to match the badge's visual style to its meaning (e.g., `success` for positive statuses, `warning` for caution).
 * - Place badges near the element they describe so the relationship is clear.
 * - Use `prefixIcon` or `suffixIcon` to reinforce meaning when the label alone may be ambiguous.
 * - Apply the `strong` variant when the badge appears on a raised surface or needs extra emphasis.
 *
 * **Don't:**
 * - Use badges as interactive elements—they are not buttons or links.
 * - Pack long sentences or multiple values into a single badge label.
 * - Mix badge sizes within the same group; pick either `md` or `sm` and stay consistent.
 * - Rely on color alone to convey meaning; always include a text label.
 * - Stack multiple badges on a single element unless each communicates a distinct, necessary status.
 *
 * @summary Compact label for status, counts, or categorization with semantic styling.
 * @element nys-badge
 *
 * @example Status badge
 * ```html
 * <nys-badge intent="success" label="Approved" prefixIcon></nys-badge>
 * ```
 *
 * @example Count badge
 * ```html
 * <nys-badge prefixLabel="Messages" label="12"></nys-badge>
 * ```
 *
 * ## Dependencies
 *
 * This component depends on the following NYS Design System components:
 *
 *   - `nys-icon`
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

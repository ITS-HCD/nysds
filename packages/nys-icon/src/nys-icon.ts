import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import iconLibrary from "./nys-icon.library";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-icon.scss?inline";

/**
 * Renders SVG icons from the NYSDS icon library (Material Symbols). Decorative by default (`aria-hidden`).
 *
 * Pass `name` to select an icon from the library. Use `ariaLabel` to make the icon accessible
 * (removes `aria-hidden`). Supports size presets, rotation, flipping, and custom colors. Icons inherit
 * text color from their parent by default but can be customized with the `color` prop.
 *
 * ## When to use
 * - To provide recognizable visual representations for common actions or objects (e.g., search, download, social media links).
 * - Ideal for enhancing navigation menus, buttons, or other interactive elements with visual cues.
 * - Use icons to enhance user interfaces with clear, recognizable icons.
 * - Customize icon sizes and colors to match the design system.
 * - Combine icons with text labels when the icon's meaning is not universally recognized.
 *
 * ## When to consider something else
 * - If an icon does not add meaningful value to the context or might confuse users.
 * - When a descriptive label or plain text provides clearer communication.
 * - Do not use icons that lack clarity or context for their intended purpose.
 * - Do not replace meaningful text with an icon unless its meaning is universally recognized or accompanied by a text label.
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Include a visual text label paired with the icon. Few icons are universally understood alone.
 * - Use icons consistently: same icon and label for the same meaning throughout your app.
 * - Use `ariaLabel` when the icon is focusable and conveys meaning, so screen readers can announce its purpose.
 * - Align icons properly with text, both visually and semantically.
 * - Use icons from the NYS Design System library; if unavailable, use Google Material Symbols (rounded, unfilled).
 * - Match icon size and color to the design system.
 * - Test icon clarity with real users when possible.
 *
 * **Don't:**
 * - Use icons that lack clarity or context for their intended purpose.
 *
 * ## Icon name and selection
 * The `name` property is the only required attribute. Icons come from the Material Symbols library,
 * organized into categories: Core, Arrows, Chevrons, Environmental, Intent, Social, and Filled.
 * Examples include: `check_circle`, `error`, `warning`, `search`, `download`, `account_circle`.
 *
 * ## Size variants
 * ### Relative Sizing (scale based on parent font size)
 * Icons adjust to the relative font size of their parent element by default.
 * Preset relative sizes:
 * - `xs` (extra small): 75% of parent font size
 * - `sm` (small): 87.5% of parent font size
 * - `md` (medium): 100% of parent font size - **Default**
 * - `lg` (large): 112.5% of parent font size
 * - `xl` (extra large): 125% of parent font size
 * - `2xl` (double extra large): 150% of parent font size
 * - `3xl` (triple extra large): 187.5% of parent font size
 * - `4xl` (quadruple extra large): 225% of parent font size
 * - `5xl` (quintuple extra large): 300% of parent font size
 *
 * ### Literal Sizing (fixed pixel sizes in rem)
 * For fixed, predefined sizes independent of parent font size:
 * - `12`: 0.75rem = 12px
 * - `14`: 0.875rem = 14px
 * - `16`: 1rem = 16px (default fallback)
 * - `18`: 1.125rem = 18px
 * - `20`: 1.25rem = 20px
 * - `24`: 1.5rem = 24px
 * - `32`: 2rem = 32px
 * - `40`: 2.5rem = 40px
 * - `50`: 3.125rem = 50px
 *
 * By default, the icon's `font-size` is set to `1cap`, aligning it with the height of capital letters.
 * For browsers that do not support `1cap`, a fallback of `0.7em` is used.
 *
 * ## Color and styling
 * Icons inherit the current text color from their parent element by default. Override with the `color` prop
 * to apply a CSS color value (e.g., `color="var(--nys-color-success)"` or `color="red"`).
 * Use rotation with `rotate` (degrees as a number) and flipping with `flip` (horizontal, vertical, or both).
 *
 * @accessibility
 * **ARIA Hidden by Default:** If no `ariaLabel` is provided, the icon is hidden from screen readers by setting `aria-hidden="true"`.
 * This is appropriate for decorative icons or icons that accompany text labels.
 *
 * **Customizable ARIA Label:** If a `ariaLabel` is provided, the component automatically adds an `aria-label` attribute,
 * making the icon accessible to screen readers. This removes `aria-hidden` to announce the icon's purpose.
 * Always provide an `ariaLabel` if the icon conveys important information or is the sole indicator of an action.
 *
 * ## Dependencies
 *
 * This component has no dependencies on other NYS Design System components.
 *
 * @summary SVG icon from Material Symbols library with size, rotation, flip, and color options.
 * @element nys-icon
 *
 * @example Basic icon
 * ```html
 * <nys-icon name="check_circle" size="lg"></nys-icon>
 * ```
 *
 * @example Accessible icon with label
 * ```html
 * <nys-icon name="warning" ariaLabel="Warning" color="var(--nys-color-warning)"></nys-icon>
 * ```
 *
 * @example Icon with rotation
 * ```html
 * <nys-icon name="arrow_forward" rotate="90"></nys-icon>
 * ```
 *
 * @example Icon with flip
 * ```html
 * <nys-icon name="arrow_back" flip="horizontal"></nys-icon>
 * ```
 */

export class NysIcon extends LitElement {
  static styles = unsafeCSS(styles);

  /** Icon name from Material Symbols library. Required. */
  @property({ type: String, reflect: true }) name = "";

  /** Accessible label. When set, removes `aria-hidden` and adds `aria-label` to the SVG. */
  @property({ type: String }) ariaLabel = "";

  /** Rotation in degrees. Applied via CSS `rotate`. */
  @property({ type: String }) rotate = "0";

  /** Flip direction: `horizontal`, `vertical`, or empty for none. */
  @property({ type: String }) flip = "";

  /** Icon color. Accepts any CSS color value. Defaults to `currentcolor`. */
  @property({ type: String }) color = "";

  /**
   * Icon size. Semantic sizes: `xs`-`5xl`. Pixel sizes: `12`-`50`.
   * @default "md"
   */
  @property({ type: String }) size:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "12"
    | "14"
    | "16"
    | "18"
    | "20"
    | "24"
    | "32"
    | "40"
    | "50" = "md";

  /**
   * Retrieves the SVG element for the given icon name and applies
   * accessibility, rotation, flip, color, and size classes.
   * @returns SVGElement | null
   */
  private getIcon(): SVGElement | null {
    const iconSVG = iconLibrary[this.name];

    if (!iconSVG) return null;

    // Parse the SVG string into an actual SVG DOM element
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(iconSVG, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    // Ensure the parsed element is an SVGElement
    if (!(svgElement instanceof SVGElement)) {
      return null;
    }

    // Add accessibility attributes directly to the <svg>
    svgElement.setAttribute("role", "img");
    if (this.ariaLabel) {
      svgElement.setAttribute("aria-label", this.ariaLabel);
      svgElement.removeAttribute("aria-hidden");
    } else {
      svgElement.setAttribute("aria-hidden", "true");
      svgElement.removeAttribute("aria-label");
    }

    // Add styles
    svgElement.style.rotate = `${this.rotate}deg`;
    svgElement.style.color = this.color || "currentcolor";
    svgElement.classList.add(`nys-icon--${this.size}`);
    svgElement.classList.add(`nys-icon--svg`);

    if (this.flip) {
      svgElement.classList.add(`nys-icon--flip-${this.flip}`);
    }

    return svgElement;
  }

  render() {
    const icon = this.getIcon();
    return icon ? html`${icon}` : null;
  }
}

/*
 Conditionally register the custom element.
 This ensure the custom element is registered only once to avoid duplication, especially in environments like Storybook where this component may be used as a dependency.
 */
if (!customElements.get("nys-icon")) {
  customElements.define("nys-icon", NysIcon);
}

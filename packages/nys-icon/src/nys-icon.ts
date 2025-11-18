import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import iconLibrary from "./nys-icon.library";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-icon.scss?inline";

export class NysIcon extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) ariaLabel = "";
  @property({ type: String }) rotate = "0";
  @property({ type: String }) flip = "";
  @property({ type: String }) color = "";

  private static readonly VALID_TYPES = [
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "12",
    "14",
    "16",
    "18",
    "20",
    "24",
    "32",
    "40",
    "50",
  ] as const;

  // Private property to store the internal `size` value, restricted to the valid types. Default is "md".
  private _size: (typeof NysIcon.VALID_TYPES)[number] = "md";

  // Getter and setter for the `size` property.
  @property({ reflect: true })
  get size(): (typeof NysIcon.VALID_TYPES)[number] {
    return this._size;
  }

  set size(value: string) {
    // Check if the provided value is in VALID_TYPES. If not, default to "md".
    this._size = NysIcon.VALID_TYPES.includes(
      value as (typeof NysIcon.VALID_TYPES)[number],
    )
      ? (value as (typeof NysIcon.VALID_TYPES)[number])
      : "md";
  }

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

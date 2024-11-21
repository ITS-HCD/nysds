import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import iconLibrary from "./nys-icon.library";
import styles from "./nys-icon.styles";

@customElement("nys-icon")
export class NysIcon extends LitElement {
  @property({ type: String }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) rotate = "0";
  @property({ type: String }) flip = "";
  @property({ type: String }) color = "";

  static styles = styles;

  private static readonly VALID_TYPES = [
    "2xs",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "12",
    "16",
    "24",
    "32",
    "48",
    "64",
  ] as const;

  // Private property to store the internal `size` value, restricted to the valid types. Default is "md".
  private _size: (typeof NysIcon.VALID_TYPES)[number] = "sm";

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
      : "sm";
  }

  private getIcon(): SVGElement | null {
    const iconSVG = iconLibrary[this.name];
    const hasLabel = Boolean(this.label);

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
    svgElement.setAttribute("aria-label", hasLabel ? this.label : "");
    svgElement.setAttribute("aria-hidden", hasLabel ? "false" : "true");

    // Add styles
    svgElement.style.rotate = `${this.rotate}deg`;
    svgElement.style.color = this.color || "currentcolor";
    svgElement.classList.add(`nys-icon--${this.size}`);

    if (this.flip) {
      svgElement.classList.add(`nys-icon--flip-${this.flip}`);
    }

    return svgElement;
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("label") || changedProperties.has("name")) {
      this.requestUpdate(); // Ensure re-render if properties change
    }
  }

  render() {
    return this.getIcon();
  }
}

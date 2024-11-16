import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import iconLibrary from "./nys-alert-icon.library";
import styles from "./nys-alert.styles";

@customElement("nys-alert")
export class NysAlert extends LitElement {
  @property({ type: String }) title = "Title";
  @property({ type: String }) description =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.";

  static styles = styles;

  private static readonly VALID_TYPES = [
    "info",
    "warning",
    "success",
    "error",
    "emergency",
  ] as const;

  private _type: (typeof NysAlert.VALID_TYPES)[number] = "info";

  @property({ reflect: true })
  get type() {
    return this._type;
  }

  set type(value: string) {
    this._type = NysAlert.VALID_TYPES.includes(
      value as (typeof NysAlert.VALID_TYPES)[number],
    )
      ? (value as (typeof NysAlert.VALID_TYPES)[number])
      : "info";
  }

  getIcon() {
    const iconSVG = iconLibrary[this.type];

    if (!iconSVG) return null;

    // Parse the SVG string into an actual SVG DOM element
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(iconSVG, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    // Ensure the parsed element is an SVGElement
    if (!(svgElement instanceof SVGElement)) {
      return null;
    }

    return svgElement;
  }

  render() {
    return html`
      <div class="nys-alert-container">
        ${this.getIcon()}
        <h4>${this.title}</h4>
        <p>${this.description}</p>
      </div>
    `;
  }
}

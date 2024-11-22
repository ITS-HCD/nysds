import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
// import iconLibrary from "./nys-alert-icon.library";
import styles from "./nys-alert.styles";
import "@excelsior/nys-icon";

@customElement("nys-alert")
export class NysAlert extends LitElement {
  @property({ type: String }) title = "Title";
  @property({ type: String }) description =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.";
  @property({ type: Boolean }) noIcon = false;
  @property({ type: Boolean }) isSlim = false;
  @property({ type: Boolean }) dismissable = false;
  @state() private _alertClosed = false;

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

  // getIcon(type: string) {
  //   const iconSVG = iconLibrary[type];

  //   if (!iconSVG) return null;

  //   // Parse the SVG string into an actual SVG DOM element
  //   const parser = new DOMParser();
  //   const svgDoc = parser.parseFromString(iconSVG, "image/svg+xml");
  //   const svgElement = svgDoc.documentElement;

  //   // Ensure the parsed element is an SVGElement
  //   if (!(svgElement instanceof SVGElement)) {
  //     return null;
  //   }

  //   return svgElement;
  // }

  // Helper function to map 'success' to 'check-circle' (for svg naming)
  private getIconName(type: string) {
    return type === "success" ? "check-circle" : type;
  }

  // Check if description contains url anywhere in string using javascript and convert it to anchor tag
  convertUrlStrToAnchor() {
    let urlCheck = /https?:\/\/[^\s]+/g; // valid link tags start with /https
    const parts = [];
    let lastIndex = 0;

    // Find all url and wrap them in <a> tags
    this.description.replace(urlCheck, (match, index) => {
      // Push any non-URL part before the current URL
      if (index > lastIndex) {
        parts.push(this.description.slice(lastIndex, index));
      }

      // Push the anchor tag for the matched URL
      parts.push(html`<a href=${match} target="_blank">${match}</a>`);
      lastIndex = index + match.length;
      return match;
    });

    // push any remaining text after last URL match
    if (lastIndex < this.description.length) {
      parts.push(this.description.slice(lastIndex));
    }

    return parts;
  }

  closeAlert() {
    this._alertClosed = true;
  }
  
  render() {
    return html`
      ${!this._alertClosed
        ? html` <div class="nys-alert__container nys-alert--${this.type}">
            <div
              class="nys-alert__icon ${this.isSlim ? "nys-alert--slim" : ""}"
            >
              ${this.noIcon ? "" : html`<nys-icon name="${this.getIconName(this.type)}" size="2xl" label="${this.type} icon"></nys-icon>`}
            </div>
            <div class="nys-alert__heading">
              ${this.isSlim
                ? ""
                : html`<h4 class="nys-alert__title">${this.title}</h4>`}
              <p class="nys-alert__text">${this.convertUrlStrToAnchor()}</p>
            </div>
            ${this.dismissable
              ? html`<div class="close-container">
                  <button class="close-button" @click=${this.closeAlert}>
                    <nys-icon name="close" size="md" label="close icon"></nys-icon>
                  </button>
                </div>`
              : ""}
          </div>`
        : ""}
    `;
  }
}

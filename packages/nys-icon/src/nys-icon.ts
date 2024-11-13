import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import iconLibrary from "./nys-icon.library";
import styles from "./nys-icon.styles";

@customElement("nys-icon")
export class NysIcon extends LitElement {
  @property({ type: String }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) rotate = "0";
  @property({ type: String }) color = "";

  static styles = styles;

  private static readonly VALID_TYPES = ["xs", "sm", "md", "lg", "xl"] as const;
  
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

  getIcon() {
    const iconSVG = iconLibrary[this.name];
    return iconSVG
      ? html`
          <div
            class="icon-container ${this.size}"
            .innerHTML="${iconSVG}"
            style="
            rotate: ${this.rotate}deg;
            color: ${this.color};"
            role="img"
          ></div>
        `
      : "";
  }

  // Update accessibility attributes based on the label
  handleLabelChange() {
    const hasLabel = typeof this.label === "string" && this.label.length > 0;

    if (hasLabel) {
      this.setAttribute("role", "img");
      this.setAttribute("aria-label", this.label);
      this.removeAttribute("aria-hidden");
    } else {
      this.removeAttribute("role");
      this.removeAttribute("aria-label");
      this.setAttribute("aria-hidden", "true");
    }
  }

  // Watch for changes specifically to the `label` property
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("label")) {
      this.handleLabelChange();
    }
  }

  // Ensure label handling is set up when component first connects
  connectedCallback() {
    super.connectedCallback();
    this.handleLabelChange();
  }

  render() {
    return this.getIcon();
  }
}

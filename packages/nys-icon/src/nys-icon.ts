import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import iconLibrary from "./nys-icon.library";
import styles from "./nys-icon.styles";
import { getCssFilterFromHex } from "./colorFilter";

@customElement("nys-icon")
export class NysIcon extends LitElement {
  @property({ type: String }) name = "";
  @property({ type: String }) label = "";
  @property({ type: Boolean }) focusable = false;
  @property({ type: String }) width = "24px";
  @property({ type: String }) height = "24px";
  @property({ type: String }) rotate = "0";
  @property({ type: String }) color = "#00a4d6";

  static styles = styles;

  getColorFilter() {
    return getCssFilterFromHex(this.color);
  }

  getIcon() {
    const iconSVG = iconLibrary[this.name];
    return iconSVG
      ? html`
          <div
            class="icon-container"
            .innerHTML="${iconSVG}"
            style="width: ${this.width}; height: ${this.height}; rotate: ${this
              .rotate}deg; filter: ${this.getColorFilter()}"
          ></div>
        `
      : html`<span>Icon not found</span>`;
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

  render() {
    return this.getIcon();
  }
}

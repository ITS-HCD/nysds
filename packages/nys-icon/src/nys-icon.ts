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

  private static readonly VALID_TYPES = [
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "s1",
    "s2",
    "s3",
    "s4",
    "s5",
    "s6",
    "s7",
    "s8",
    "s9",
    "s10",
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

  getIcon() {
    const iconSVG = iconLibrary[this.name];
    const hasLabel = Boolean(this.label);

    return iconSVG
      ? html`
          <div
            class="icon-container ${this.size}"
            .innerHTML="${iconSVG}"
            style="
            rotate: ${this.rotate}deg;
            color: ${this.color || "currentcolor"};"
            role="img"
            aria-label="${hasLabel ? this.label : ""}"
            aria-hidden="${hasLabel ? "false" : "true"}"
          ></div>
        `
      : "";
  }

  // Watch for changes specifically to the `label` property
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("label")) {
      // Ensure attributes are updated when label changes
      this.requestUpdate();
    }
  }

  render() {
    return this.getIcon();
  }
}

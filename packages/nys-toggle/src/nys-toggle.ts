import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./nys-toggle.styles";

@customElement("nys-toggle")
export class NysToggle extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = true;
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  private static readonly VALID_SIZES = ["sm", "md", "lg"] as const;

  // Private property to store the internal `size` value, restricted to the valid types. Default is "md".
  private _size: (typeof NysToggle.VALID_SIZES)[number] = "md";

  // Getter and setter for the `size` property.
  @property({ reflect: true })
  get size(): (typeof NysToggle.VALID_SIZES)[number] {
    return this._size;
  }

  set size(value: string) {
    // Check if the provided value is in VALID_SIZES. If not, default to "md".
    this._size = NysToggle.VALID_SIZES.includes(
      value as (typeof NysToggle.VALID_SIZES)[number],
    )
      ? (value as (typeof NysToggle.VALID_SIZES)[number])
      : "md";
  }
  @property({ type: String }) value = "";
  @property({ type: String }) error = "";
  @property({ type: String }) form = "";

  static styles = styles;

  render() {
    return html`
      <div class="nys-toggle--main-container" role="switch" aria-label=${ifDefined(this.label ? this.label : undefined)}>
        <label class="switch" .size=${this.size}>
          <input
            type="checkbox"
            name="${ifDefined(this.name ? this.name : undefined)}"
            ?checked=${this.checked}
            ?disabled=${this.disabled}
          />
          <span class="slider"></span>
        </label>
        <div class="texts-right-container">
          <slot name="label"></slot>
          <slot name="description-right"></slot>
        </div>
      </div>
      <slot name="description-bottom"></slot>
    `;
  }
}

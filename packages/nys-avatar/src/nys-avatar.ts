import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
// import "@nys-excelsior/nys-icon";
import styles from "./nys-avatar.styles";

let avatarIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-avatar")
export class NysAvatar extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) id = "";
  @property({ type: String }) image = "";
  @property({ type: String }) initials = "";
  @property({ type: String }) icon = "";
  @property({ type: String }) name = "HI";
  private static readonly VALID_SIZES = ["sm", "md"] as const;
  private static readonly VALID_SHAPES = ["square", "rounded", "circle"] as const;

  // Private property to store the internal `size` value, restricted to the valid types. Default is "md".
  private _size: (typeof NysAvatar.VALID_SIZES)[number] = "md";

  // Private property to store the internal `shape` value, restricted to the valid types. Default is "rounded".
  private _shape: (typeof NysAvatar.VALID_SHAPES)[number] = "rounded";

  // Getter and setter for the `size` property.
  @property({ reflect: true })
  get size(): (typeof NysAvatar.VALID_SIZES)[number] {
    return this._size;
  }
  set size(value: string) {
    // Check if the provided value is in VALID_SIZES. If not, default to "md".
    this._size = NysAvatar.VALID_SIZES.includes(
      value as (typeof NysAvatar.VALID_SIZES)[number],
    )
      ? (value as (typeof NysAvatar.VALID_SIZES)[number])
      : "md";
  }

  // Getter and setter for the `size` property.
  @property({ reflect: true })
  get shape(): (typeof NysAvatar.VALID_SHAPES)[number] {
    return this._shape;
  }
  set shape(value: string) {
    // Check if the provided value is in VALID_SIZES. If not, default to "md".
    this._shape = NysAvatar.VALID_SHAPES.includes(
      value as (typeof NysAvatar.VALID_SHAPES)[number],
    )
      ? (value as (typeof NysAvatar.VALID_SHAPES)[number])
      : "rounded";
  }

  /******************** Functions ********************/

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-checkbox-${Date.now()}-${avatarIdCounter++}`;
    }
  }

  render() {
    return html`
      <label class="nys-avatar">
        <div class="nys-avatar__content">
          <h1 class="nys-avatar__name">${this.name}</h1>
        </div>
      </label>
    `;
  }
}

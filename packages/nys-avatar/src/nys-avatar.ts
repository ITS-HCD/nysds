import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@nys-excelsior/nys-icon";
import styles from "./nys-avatar.styles";

let avatarIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-avatar")
export class NysAvatar extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) id = "";
  @property({ type: String }) label = "";
  @property({ type: String }) image = "";
  @property({ type: String }) initials = "";
  @property({ type: String }) icon = "";
  @property({ type: String }) color = "";
  @property({ type: Boolean }) lazy = false;
  private static readonly VALID_SIZES = ["sm", "md", "lg"] as const;
  private static readonly VALID_SHAPES = [
    "square",
    "rounded",
    "circle",
  ] as const;

  // Private property to store the internal `size` value, restricted to the valid types. Default is "md".
  private _size: (typeof NysAvatar.VALID_SIZES)[number] = "lg";

  // Private property to store the internal `shape` value, restricted to the valid types. Default is "rounded".
  private _shape: (typeof NysAvatar.VALID_SHAPES)[number] = "rounded";

  // Getter for the `size` property.
  @property({ reflect: true })
  get size(): (typeof NysAvatar.VALID_SIZES)[number] {
    return this._size;
  }
  // Getter for the `size` property.
  @property({ reflect: true })
  get shape(): (typeof NysAvatar.VALID_SHAPES)[number] {
    return this._shape;
  }
  // Setter for the `size` property.
  set size(value: string) {
    this._size = NysAvatar.VALID_SIZES.includes(
      value as (typeof NysAvatar.VALID_SIZES)[number],
    )
      ? (value as (typeof NysAvatar.VALID_SIZES)[number])
      : "lg";
    this.requestUpdate("size");
  }
  // Setter for the `shape` property.
  set shape(value: string) {
    this._shape = NysAvatar.VALID_SHAPES.includes(
      value as (typeof NysAvatar.VALID_SHAPES)[number],
    )
      ? (value as (typeof NysAvatar.VALID_SHAPES)[number])
      : "circle";
    this.requestUpdate("shape");
  }

  /******************** Functions ********************/

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-avatar-${Date.now()}-${avatarIdCounter++}`;
    }
  }

  render() {
    return html`
      <label class="nys-avatar" id=${this.id}>
        <div class="nys-avatar__content">
          <div part="base" class="nys-component__component">
            ${this.image?.length > 0
              ? html`<img
                  part="image"
                  class="nys-avatar__image"
                  src=${this.image}
                  alt=${this.label}
                  loading=${this.lazy ? "lazy" : "eager"}
                />`
              : this.initials?.length > 0
                ? html`<span part="initials" class="nys-avatar__initials"
                    >${this.initials}</span
                  >`
                : this.icon?.length > 0
                  ? html`<div part="icon">
                      <nys-icon
                        label="nys-avatar__icon"
                        name=${this.icon}
                        size="md"
                      ></nys-icon>
                    </div>`
                  : html`<div part="icon">
                      <slot name="icon">
                        <nys-icon
                          part="icon"
                          label="nys-avatar__icon"
                          name="account_circle"
                          size="md"
                        ></nys-icon>
                      </slot>
                    </div>`}
          </div>
        </div>
      </label>
    `;
  }
}

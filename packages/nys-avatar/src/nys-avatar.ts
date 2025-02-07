import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import "@nys-excelsior/nys-icon";
import styles from "./nys-avatar.styles";
import { ifDefined } from "lit/directives/if-defined.js";

let avatarIdCounter = 0; // Counter for generating unique IDs

export class NysAvatar extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) id = "";
  @property({ type: String }) label = "";
  @property({ type: String }) image = "";
  @property({ type: String }) initials = "";
  @property({ type: String }) icon = "";
  @property({ type: String }) color = "#555";
  @property({ type: Boolean }) lazy = false;
  private static readonly VALID_SHAPES = [
    "square",
    "rounded",
    "circle",
  ] as const;

  // Private property to store the internal `shape` value, restricted to the valid types. Default is "rounded".
  private _shape: (typeof NysAvatar.VALID_SHAPES)[number] = "circle";

  // Getter for the `shape` property.
  @property({ reflect: true })
  get shape(): (typeof NysAvatar.VALID_SHAPES)[number] {
    return this._shape;
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
          <div
            part="nys-avatar"
            class="nys-component__component"
            style="background-color: ${this.color?.length > 0
              ? this.color
              : "#555"};"
            role=${ifDefined(this.image ? undefined : "img")}
            aria-label=${ifDefined(this.image ? undefined : this.label)}
          >
            ${this.image?.length > 0
              ? html`<img
                  part="nys-avatar__image"
                  class="nys-avatar__image"
                  src=${this.image}
                  alt=${this.label}
                  loading=${this.lazy ? "lazy" : "eager"}
                />`
              : this.initials?.length > 0
                ? html`<span
                    part="nys-avatar__initials"
                    class="nys-avatar__initials"
                    aria-hidden="true"
                    >${this.initials}</span
                  >`
                : this.icon?.length > 0
                  ? html`<div part="nys-avatar__icon">
                      <nys-icon
                        label="nys-avatar__icon"
                        name=${this.icon}
                        size="md"
                      ></nys-icon>
                    </div>`
                  : html`<div part="nys-avatar__icon">
                      <slot name="icon">
                        <nys-icon
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

if (!customElements.get("nys-avatar")) {
  customElements.define("nys-avatar", NysAvatar);
}

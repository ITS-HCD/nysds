import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-avatar.styles";
import { ifDefined } from "lit/directives/if-defined.js";

let avatarIdCounter = 0; // Counter for generating unique IDs

export class NysAvatar extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) id = "";
  @property({ type: String }) ariaLabel = "";
  @property({ type: String }) image = "";
  @property({ type: String }) initials = "";
  @property({ type: String }) icon = "";
  @property({ type: String }) color = "";
  @property({ type: Boolean, reflect: true }) interactive = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) lazy = false;
  @state() private _slotHasContent = true;

  /******************** Functions ********************/
  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-avatar-${Date.now()}-${avatarIdCounter++}`;
    }
  }

  firstUpdated() {
    this._checkSlotContent();
  }

  private async _checkSlotContent() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    if (!slot) {
      this._slotHasContent = false;
      return;
    }

    // Wait a tick to ensure slot assignment settled
    await Promise.resolve();

    const assignedNodes = slot
      .assignedNodes({ flatten: true })
      .filter(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE ||
          (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()),
      );

    this._slotHasContent = assignedNodes.length > 0;
  }

  // This function accounts for user set "color" prop and return the appropriate foreground contrast.
  private getContrastForeground() {
    /** Default NYSDS CSS vars for foreground.
     * Contrast must return =>
     * IF icon: "--nys-color-ink-reverse" or "--nys-color-ink"
     * If initials: "--nys-color-text-reverse" or "--nys-color-text"
     */
    const fgIconDark = "var(--nys-color-ink, #000)";
    const fgIconLight = "var(--nys-color-ink-reverse, #fff)";
    const fgInitialDark = "var(--nys-color-text, #000)";
    const fgInitialLight = "var(--nys-color-text-reverse, #fff)";

    if (!this.color) return;

    // Create a temporary element to compute luminance (this is in case user pass in "var(--nys-color-stuff)")
    const div = document.createElement("div");
    div.style.color = this.color;
    document.body.appendChild(div);
    const computedColor = getComputedStyle(div).color;
    document.body.removeChild(div);

    // Parse RGB
    const match = computedColor.match(/\d+/g);
    if (!match) return;

    const r = Number(match[0]);
    const g = Number(match[1]);
    const b = Number(match[2]);

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    const isDark = luminance < 0.5;
    if (this.initials?.length > 0) {
      return isDark ? fgInitialLight : fgInitialDark;
    } else {
      return isDark ? fgIconLight : fgIconDark;
    }
  }

  render() {
    return html`
      <label class="nys-avatar" id=${this.id}>
        <div class="nys-avatar__content">
          <div
            part="nys-avatar"
            class="nys-avatar__component"
            style=${this.color
              ? `--_nys-avatar-background: ${this.color}; color: ${this.getContrastForeground()}`
              : ""}
            role=${ifDefined(
              this.interactive ? "button" : this.image ? undefined : "img",
            )}
            aria-label=${ifDefined(
              this.image
                ? undefined
                : this.ariaLabel
                  ? this.ariaLabel
                  : "avatar",
            )}
            tabindex=${this.interactive && !this.disabled
              ? "0"
              : ifDefined(undefined)}
          >
            ${this.image?.length > 0
              ? html`<img
                  part="nys-avatar__image"
                  class="nys-avatar__image"
                  src=${this.image}
                  alt=${this.ariaLabel || "avatar"}
                  loading=${this.lazy ? "lazy" : "eager"}
                />`
              : this.initials?.length > 0
                ? html`<span
                    part="nys-avatar__initials"
                    class="nys-avatar__initials"
                    aria-hidden="true"
                    >${this.initials}</span
                  >`
                : this._slotHasContent
                  ? html`<div part="nys-avatar__icon">
                      <slot></slot>
                    </div>`
                  : html`<div part="nys-avatar__icon">
                      <nys-icon
                        label="nys-avatar__icon"
                        name=${this.icon?.length > 0
                          ? this.icon
                          : "account_circle"}
                      ></nys-icon>
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

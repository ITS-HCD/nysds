import { LitElement, html } from "lit";
import { property, query } from "lit/decorators.js";
import styles from "./nys-accordion.styles";

export class NysAccordion extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) heading = "";
  @property({ type: Boolean, reflect: true }) expanded = false;
  @property({ type: Boolean, reflect: true }) bordered = false;

  static styles = styles;

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("expanded")) {
      this._updateHeight();
    }
  }

  /******************** Functions ********************/
  private _handleExpand() {
    this.expanded = !this.expanded;
    this._updateHeight();
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault(); // prevent page scroll on space
      this._handleExpand();
    }
  }

  // Call this after first render and whenever expanded changes
  @query(".nys-accordion__content") private _contentContainer!: HTMLElement;
  private _updateHeight() {
    if (!this._contentContainer) return;

    if (this.expanded) {
      // Slide down the content by setting a calculated max-height, depending on the panel's height on different screen sizes
      const slotHeight = this._contentContainer.scrollHeight;
      this._contentContainer.style.height = `${slotHeight}px`;
    } else {
      // Collapse
      this._contentContainer.style.height = "0";
      this._contentContainer.style.overflow = "hidden";
    }
  }

  render() {
    return html`<div class="nys-accordion">
      <div
        class="nys-accordion__heading"
        tabindex="0"
        @click=${this._handleExpand}
        @keydown=${this._handleKeydown}
      >
        <p class="nys-accordion__heading-title">${this.heading}</p>
        <nys-icon
          class="expand-icon"
          name="chevron_down"
          size="24"
        ></nys-button>
      </div>
      <div class="nys-accordion__content">
        <div class="nys-accordion__content-slot-container">
          <slot></slot>
        </div>
      </div>
    </div>`;
  }
}

if (!customElements.get("nys-accordion")) {
  customElements.define("nys-accordion", NysAccordion);
}

import { LitElement, html, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-accordion.scss?inline";

let accordionItemIdCounter = 0; // Counter for generating unique IDs

export class NysAccordionItem extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true  }) id = "";
  @property({ type: String }) heading = "";
  @property({ type: Boolean, reflect: true }) expanded = false;
  @property({ type: Boolean, reflect: true }) bordered = false; // Code NEED this, don't delete this. This is due to how the <nys-accordion> group is applying bordered to each individual <nys-accordionitem>

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    // Generate a unique ID if not provided
    if (!this.id) {
      this.id = this._generateUniqueId();
    }
  }

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector("slot");

    /**
     * When the accordion starts expanded but the slot is empty,
     * _updateHeight runs too early and calculates height as 0.
     * Listening for slotchange ensures we recalc after the slot’s
     * content is rendered so the final height is correct.
     */
    if (this.expanded && slot) {
      slot.addEventListener("slotchange", () => {
        this._updateHeight();
      });
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("expanded")) {
      this._updateHeight();
    }
  }

  /******************** Functions ********************/
  private _generateUniqueId() {
    return `nys-accordionitem-${Date.now()}-${accordionItemIdCounter++}`;
  }

  private _dispatchEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-accordionitem-toggle", {
        detail: { id: this.id, heading: this.heading, expanded: this.expanded },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleExpand() {
    this.expanded = !this.expanded;
    this._updateHeight();
    this._dispatchEvent();
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault(); // prevent page scroll on space
      this._handleExpand();
    }
  }

  // Call this after first render and whenever expanded changes
  @query(".nys-accordionitem__content") private _contentContainer!: HTMLElement;
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
    const contentId = `${this.id}-content`;

    return html`
    <div class="nys-accordionitem">
      <button
        class="nys-accordionitem__heading"
        type="button"
        @click=${this._handleExpand}
        @keydown=${this._handleKeydown}
        aria-expanded=${this.expanded ? "true" : "false"}
        aria-controls=${contentId}
      >
        <p class="nys-accordionitem__heading-title">${this.heading}</p>
        <nys-icon class="expand-icon" name="chevron_down" size="24"></nys-icon>
      </button>
      </div>
      <div id=${contentId} class="nys-accordionitem__content ${this.expanded ? "expanded" : "collapsed"}" role="region">
        <div class="nys-accordionitem__content-slot-container">
          <div class="nys-accordionitem__content-slot-container-text">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>`;
  }
}

if (!customElements.get("nys-accordionitem")) {
  customElements.define("nys-accordionitem", NysAccordionItem);
}

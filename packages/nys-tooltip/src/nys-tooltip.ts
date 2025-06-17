import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-tooltip.styles";

let tooltipIdCounter = 0; // Counter for generating unique IDs

export class NysTooltip extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) text = "";
  @property({ type: Boolean }) inverted = false; // used on dark text
  @property({ type: String }) position: "top" | "bottom" | "left" | "right" =
    "top";

  static styles = styles;

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    // Generate a unique ID if not provided
    if (!this.id) {
      this.id = `nys-toggle-${Date.now()}-${tooltipIdCounter++}`;
    }

    if (!this.position) {
      this.setAttribute("position", "top");
    }
    this.addEventListener("mouseenter", this.handleHover);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("mouseenter", this.handleHover);
  }

  // Only when position not set do we perform dynamic positioning logic
  private handleHover = () => {
    if (!this.hasAttribute("position")) {
      this.autoPositionTooltip();
    }
  };

  // The tooltip will move automatically if it's near the edge of the screen.
  private autoPositionTooltip() {
    const tooltipWrapper = this.shadowRoot?.querySelector(
      ".nys-tooltip__wrapper",
    );

    if (!tooltipWrapper) return;

    // Get longest length of the surrounding space, make that the position where tooltip should go
    const triggerRect = tooltipWrapper.getBoundingClientRect();

    const spaceAvailable = {
      top: triggerRect.top,
      bottom: window.innerHeight - triggerRect.bottom,
      left: triggerRect.left,
      right: window.innerWidth - triggerRect.right,
    };

    const preferredOrder: Array<keyof typeof spaceAvailable> = [
      "top",
      "bottom",
      "right",
      "left",
    ];

    for (const position of preferredOrder) {
      const buffer = 100; // tooltip height/width estimate
      if (spaceAvailable[position] > buffer) {
        this.setAttribute("position", position);
        return;
      }
    }
  }

  render() {
    return html`
      <div class="nys-tooltip__wrapper">
        <slot></slot>
        <div
          class="nys-tooltip__content"
          role="tooltip"
          aria-hidden=${!this.text}
        >
          ${this.text}
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-tooltip")) {
  customElements.define("nys-tooltip", NysTooltip);
}

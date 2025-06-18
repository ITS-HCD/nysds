import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-tooltip.styles";

let tooltipIdCounter = 0; // Counter for generating unique IDs

export class NysTooltip extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) text = "";
  @property({ type: Boolean, reflect: true }) inverted = false;
  @property({ type: String, reflect: true }) position:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "" = "";

  // Track if user set position is set explicitly
  private _userHasSetPosition = false;
  // Track if tooltip is active (hovered or focused)
  private _active = false;

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

    // We will dynamically update the position property if user doesn't set one up.
    this._userHasSetPosition = this.position !== "";

    this.addEventListener("mouseenter", this._handleTooltipEnter);
    this.addEventListener("focusin", this._handleTooltipEnter);
    this.addEventListener("mousedown", this._handleTooltipEnter);

    this.addEventListener("mouseleave", this._handleBlurOrMouseLeave);
    this.addEventListener("focusout", this._handleBlurOrMouseLeave);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("mouseenter", this._handleTooltipEnter);
    this.removeEventListener("focusin", this._handleTooltipEnter);
    this.removeEventListener("mousedown", this._handleTooltipEnter);

    this.removeEventListener("mouseleave", this._handleBlurOrMouseLeave);
    this.removeEventListener("focusout", this._handleBlurOrMouseLeave);
  }

  // Check if user has set position. If not, perform dynamic positioning logic
  private _handleTooltipEnter = () => {
    this._active = true;

    if (!this._userHasSetPosition) {
      this.autoPositionTooltip();
    }
    this._addScrollListeners();
  };

  private _handleBlurOrMouseLeave = () => {
    this._active = false;
    this._removeScrollListeners();
  };

  // Listen to window scroll so a focus tooltip can auto position even when user move across the page
  private _addScrollListeners() {
    window.addEventListener("scroll", this._handleScrollOrResize, true);
    window.addEventListener("resize", this._handleScrollOrResize);
  }

  private _removeScrollListeners() {
    window.removeEventListener("scroll", this._handleScrollOrResize, true);
    window.removeEventListener("resize", this._handleScrollOrResize);
  }

  private _handleScrollOrResize = () => {
    if (this._active && !this._userHasSetPosition) {
      this.autoPositionTooltip();
    }
  };

  // Calculates the best placement based on available space (referencing popper code logic)
  private autoPositionTooltip() {
    const wrapper = this.shadowRoot?.querySelector(".nys-tooltip__wrapper");
    const tooltip = this.shadowRoot?.querySelector(".nys-tooltip__content");

    if (!wrapper || !tooltip) return;

    const triggerRect = wrapper.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Define some margin buffer between tooltip and trigger
    const margin = 8;

    // Available space on each side relative to trigger rect and viewport
    const spaceAvailable = {
      top: triggerRect.top - margin,
      bottom: window.innerHeight - triggerRect.bottom - margin,
      left: triggerRect.left - margin,
      right: window.innerWidth - triggerRect.right - margin,
    };

    // Check if tooltip fits on each side (compare available space vs tooltip size)
    const fits = {
      top: spaceAvailable.top >= tooltipRect.height,
      bottom: spaceAvailable.bottom >= tooltipRect.height,
      left: spaceAvailable.left >= tooltipRect.width,
      right: spaceAvailable.right >= tooltipRect.width,
    };

    // Preferred order to position the tooltip
    const preferredOrder: Array<keyof typeof fits> = [
      "top",
      "bottom",
      "right",
      "left",
    ];

    // Pick first side that fits tooltip fully
    for (const pos of preferredOrder) {
      if (fits[pos]) {
        this.position = pos;
        return;
      }
    }

    // If none fit fully, pick side with most space
    let maxSpace = 0;
    let bestPos: keyof typeof spaceAvailable = "top";
    for (const pos of preferredOrder) {
      if (spaceAvailable[pos] > maxSpace) {
        maxSpace = spaceAvailable[pos];
        bestPos = pos;
      }
    }
    this.position = bestPos;
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

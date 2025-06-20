import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-tooltip.styles";

let tooltipIdCounter = 0; // Counter for generating unique IDs

export class NysTooltip extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) text = "";
  @property({ type: Boolean, reflect: true }) inverted = false;

  // Track if user set position is set explicitly
  private _userHasSetPosition = false;
  // Internal flag to prevent falsely triggering user intent
  private _internallyUpdatingPosition = false;
  // Track if tooltip is active (hovered or focused)\
  @state()
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

  /********************* Position Logic *********************/
  private _position: "top" | "bottom" | "left" | "right" | "" = "";

  @property({ type: String, reflect: true })
  get position() {
    return this._position;
  }

  set position(value) {
    const oldVal = this._position;
    this._position = value;
    this.requestUpdate("position", oldVal);

    // There are two ways to set position.
    // This flag prevents auto-positioning from overriding user-defined values.
    if (!this._internallyUpdatingPosition) {
      this._userHasSetPosition = value !== "";
    }
  }

  /******************** Event Handlers ********************/
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

  /******************** Functions ********************/
  // Calculates the best placement based on available space (referencing popper code logic)
  private autoPositionTooltip() {
    const wrapper = this.shadowRoot?.querySelector(".nys-tooltip__wrapper");
    const tooltip = this.shadowRoot?.querySelector(".nys-tooltip__content");

    if (!wrapper || !tooltip) return;

    const triggerRect = wrapper.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Define some margin buffer between tooltip and trigger (to avoid touching the edges too tightly)
    const margin = 8;

    // Available space on each side relative to trigger rect and viewport
    const spaceAvailable = {
      top: triggerRect.top - margin,
      left: triggerRect.left - margin,
      bottom: window.innerHeight - triggerRect.bottom - margin,
      right: window.innerWidth - triggerRect.right - margin,
    };

    // Check if tooltip fits on each side (compare available space vs tooltip size)
    const fits = {
      top: spaceAvailable.top >= tooltipRect.height,
      bottom: spaceAvailable.bottom >= tooltipRect.height,
      left: spaceAvailable.left >= tooltipRect.width,
      right: spaceAvailable.right >= tooltipRect.width,
    };

    const preferredOrder: Array<keyof typeof fits> = [
      "top",
      "bottom",
      "right",
      "left",
    ];

    // Pick first side that fits tooltip fully
    for (const pos of preferredOrder) {
      if (fits[pos]) {
        this._setInternalPosition(pos);
        return;
      }
    }

    // If none fit fully, pick side with most space
    let maxSpace = 0;
    let bestPosition: keyof typeof spaceAvailable = "top";
    for (const pos of preferredOrder) {
      if (spaceAvailable[pos] > maxSpace) {
        maxSpace = spaceAvailable[pos];
        bestPosition = pos;
      }
    }
    this._setInternalPosition(bestPosition);
  }

  // Sets flag to distinguish to position's setter that we are updating "position" prop internally
  private _setInternalPosition(bestPosition: typeof this._position) {
    this._internallyUpdatingPosition = true;
    this.position = bestPosition;
    this._internallyUpdatingPosition = false;
  }

  render() {
    return html`
      <div class="nys-tooltip__wrapper">
        <slot></slot>
        <div
          class="nys-tooltip__content"
          role="tooltip"
          aria-hidden=${!this._active}
        >
          <div class="nys-tooltip__inner">${this.text}</div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-tooltip")) {
  customElements.define("nys-tooltip", NysTooltip);
}

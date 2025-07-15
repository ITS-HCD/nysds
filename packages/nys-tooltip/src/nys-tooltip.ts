import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-tooltip.styles";

let tooltipIdCounter = 0; // Counter for generating unique IDs

export class NysTooltip extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) text = "";
  @property({ type: Boolean, reflect: true }) inverted = false;

  // Track if tooltip is active (hovered or focused)
  @state()
  private _active = false;

  // Track if user set position is set explicitly
  private _userHasSetPosition = false;
  private _originalUserPosition: typeof this._position | null = null;
  // Internal flag to prevent dynamic positioning when not needed
  private _internallyUpdatingPosition = false;

  static styles = styles;

  /********************* Position Logic *********************/
  private _position: "top" | "bottom" | "left" | "right" | null = null;

  @property({ type: String, reflect: true })
  get position() {
    return this._position;
  }

  set position(value) {
    const oldVal = this._position;
    this._position = value;
    this.requestUpdate("position", oldVal);

    // The "_internallyUpdatingPosition" flag allows user's set position to take preference
    if (!this._internallyUpdatingPosition) {
      this._userHasSetPosition = value !== null;
      this._originalUserPosition = value;
    }
  }

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
  }

  // Giving the slot component the aria-describedby for voiceover to announce the tooltip
  firstUpdated() {
    const slot = this.shadowRoot?.querySelector("slot");
    const assigned = slot?.assignedElements({ flatten: true }) ?? [];

    if (assigned.length > 0 && assigned[0] instanceof HTMLElement) {
      assigned[0].setAttribute("aria-describedby", this.id);
    }
  }

  /******************** Event Handlers ********************/
  // When toggling tooltip, check if user has set position to give it preference it space allows. Otherwise dynamically position tooltip.
  private _handleTooltipEnter = () => {
    this._active = true;
    this._addScrollListeners();

    // Try to honor user's original preference first
    if (this._userHasSetPosition && this._originalUserPosition) {
      if (this._doesPositionFit(this._originalUserPosition)) {
        this.position = this._originalUserPosition;
        // Check if current tooltip position overflows to edge of screen
        this.updateComplete.then(() => {
          const tooltip = this.shadowRoot?.querySelector(
            ".nys-tooltip__content",
          ) as HTMLElement;
          if (tooltip) this._shiftTooltipIntoViewport(tooltip);
        });
        return;
      }
    }

    // Otherwise fall back to auto logic
    this.autoPositionTooltip();
  };

  private _handleBlurOrMouseLeave = () => {
    this._active = false;
    this._removeScrollListeners();

    const tooltip = this.shadowRoot?.querySelector(
      ".nys-tooltip__content",
    ) as HTMLElement;

    if (tooltip) {
      this._resetTooltipPositioningStyles(tooltip);
    }
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
    if (!this._active) return;

    if (this._userHasSetPosition && this._originalUserPosition) {
      if (this._doesPositionFit(this._originalUserPosition)) {
        this.position = this._originalUserPosition;
        // Check if current tooltip position overflows to edge of screen
        this.updateComplete.then(() => {
          const tooltip = this.shadowRoot?.querySelector(
            ".nys-tooltip__content",
          ) as HTMLElement;
          if (tooltip) this._shiftTooltipIntoViewport(tooltip);
        });
      } else {
        this.autoPositionTooltip();
      }
    } else {
      this.autoPositionTooltip();
    }
  };

  /******************** Functions ********************/
  // Checks if user's set position fit with current viewport (Does not account for overflow texts at this moment)
  private _doesPositionFit(position: typeof this._position) {
    const wrapper = this.shadowRoot?.querySelector(".nys-tooltip__wrapper");
    const tooltip = this.shadowRoot?.querySelector(".nys-tooltip__content");

    if (!wrapper || !tooltip || position == null) return;

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

    return fits[position];
  }

  // Calculates the best placement based on available space (flips placement if it doesn't fit)
  private async autoPositionTooltip() {
    const wrapper = this.shadowRoot?.querySelector(
      ".nys-tooltip__wrapper",
    ) as HTMLElement;
    const tooltip = this.shadowRoot?.querySelector(
      ".nys-tooltip__content",
    ) as HTMLElement;

    if (!wrapper || !tooltip) return;

    const triggerRect = wrapper.getBoundingClientRect();
    // const tooltipRect = tooltip.getBoundingClientRect();
    const margin = 8;
    const userPosition = this.position as keyof typeof spaceAvailable;

    const spaceAvailable = {
      top: triggerRect.top - margin,
      left: triggerRect.left - margin,
      bottom: window.innerHeight - triggerRect.bottom - margin,
      right: window.innerWidth - triggerRect.right - margin,
    };

    const preferredOrder: Array<keyof typeof spaceAvailable> = [
      "top",
      "bottom",
      "right",
      "left",
    ];

    // Custom order preference for when user requests a specific position like "left" -> fallback should be "right"
    let tryOrder = preferredOrder;

    if (userPosition === "left") {
      tryOrder = ["left", "right", "top", "bottom"];
    } else if (userPosition === "right") {
      tryOrder = ["right", "left", "top", "bottom"];
    } else if (userPosition === "top") {
      tryOrder = ["top", "bottom", "right", "left"];
    } else if (userPosition === "bottom") {
      tryOrder = ["bottom", "top", "right", "left"];
    }

    // 1) Decide best side
    for (const pos of tryOrder) {
      if (this._doesPositionFit(pos)) {
        // 2) Apply the side (CSS takes over base placement)
        this._setInternalPosition(pos);
        await this.updateComplete;
        this._shiftTooltipIntoViewport(tooltip);
        return;
      }
    }

    // Fallback: pick the side with the most space
    let bestPosition: keyof typeof spaceAvailable = "top";
    let maxSpace = spaceAvailable.top;

    for (const pos of preferredOrder) {
      if (spaceAvailable[pos] > maxSpace) {
        maxSpace = spaceAvailable[pos];
        bestPosition = pos;
      }
    }
    this._setInternalPosition(bestPosition);
    await this.updateComplete;
    this._shiftTooltipIntoViewport(tooltip);
  }

  // Sets flag to distinguish to position's setter that we are updating "position" prop internally
  private _setInternalPosition(bestPosition: typeof this._position) {
    this._internallyUpdatingPosition = true;
    this.position = bestPosition;
    this._internallyUpdatingPosition = false;
  }

  // Determines if text of tooltip over-extends outside of viewport edge and adjust tooltip for horizontal overflow
  private _shiftTooltipIntoViewport(tooltip: HTMLElement) {
    const tooltipRect = tooltip.getBoundingClientRect();
    const wrapper = this.shadowRoot?.querySelector(
      ".nys-tooltip__wrapper",
    ) as HTMLElement;

    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;

    const overflowLeft = tooltipRect.left < 0;
    const overflowRight = tooltipRect.right > window.innerWidth;

    this._resetTooltipPositioningStyles(tooltip);

    // Tooltip is past the viewport edge, shift it inwards
    if (overflowLeft) {
      tooltip.style.left = "0px";
      tooltip.style.transform = "none";
    } else if (overflowRight) {
      tooltip.style.right = "0px";
      tooltip.style.left = "auto";
      tooltip.style.transform = "none";
    }

    // Recalculate new tooltip position and adjust arrow
    const newTooltipRect = tooltip.getBoundingClientRect();
    const arrowOffset = wrapperCenter - newTooltipRect.left;

    tooltip.style.setProperty("--arrow-offset-x", `${arrowOffset}px`);
  }

  // Reposition tooltip back to original set position (e.g. top, left, bottom, right)
  private _resetTooltipPositioningStyles(tooltip: HTMLElement) {
    tooltip.style.left = "";
    tooltip.style.right = "";
    tooltip.style.transform = "";
  }

  render() {
    return html`
      <div class="nys-tooltip__main">
        <div
          class="nys-tooltip__wrapper"
          @mouseenter=${this._handleTooltipEnter}
          @mouseleave=${this._handleBlurOrMouseLeave}
          @focusin=${this._handleTooltipEnter}
          @focusout=${this._handleBlurOrMouseLeave}
        >
          <span class="nys-tooltip__trigger" aria-describedby=${this.id}>
            <slot></slot>
          </span>
        </div>
        ${this.text?.trim()
          ? html`<div
              id=${this.id}
              class="nys-tooltip__content"
              role="tooltip"
              aria-hidden=${!this._active}
              ?active=${this._active}
            >
              <div class="nys-tooltip__inner">${this.text}</div>
              <span class="nys-tooltip__arrow"></span>
            </div>`
          : ""}
      </div>
    `;
  }
}

if (!customElements.get("nys-tooltip")) {
  customElements.define("nys-tooltip", NysTooltip);
}

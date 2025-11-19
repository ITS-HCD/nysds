import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tooltip.scss?inline";

let tooltipIdCounter = 0; // Counter for generating unique IDs

export class NysTooltip extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String }) text = "";
  @property({ type: Boolean, reflect: true }) inverted = false;
  @property({ type: Boolean, reflect: true }) focusable = false;
  @property({ type: String }) for = "";

  // Track if tooltip is active (hovered or focused)
  @state()
  private _active = false;

  // Track if user set position is set explicitly
  private _userHasSetPosition = false;
  private _originalUserPosition: typeof this._position | null = null;
  // Internal flag to prevent dynamic positioning when not needed
  private _internallyUpdatingPosition = false;
  // Flag for hiding the timeout
  private _hideTimeout: number | null = null;

<<<<<<< HEAD
  static styles = styles;

  /*************************************** Position Logic ***************************************/
=======
  /********************* Position Logic *********************/
>>>>>>> 64d95dc7f1ca3f95119094b5dbdc2d0dd71b0ff1
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

  /*************************************** Lifecycle Methods ***************************************/
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    // Generate a unique ID if not provided
    if (!this.id) {
      this.id = `nys-tooltip-${Date.now()}-${tooltipIdCounter++}`;
    }

    window.addEventListener("keydown", this._handleEscapeKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const ref = this._getReferenceElement();
    const tooltip = this.shadowRoot?.querySelector(".nys-tooltip__content");

    if (ref && tooltip) {
      ref.removeEventListener("mouseenter", this._showTooltip);
      ref.removeEventListener("mouseenter", this._cancelFadeOut);
      ref.removeEventListener("mouseleave", this._handleBlurOrMouseLeave);
      ref.removeEventListener("focusin", this._showTooltip);
      ref.removeEventListener("focusout", this._handleBlurOrMouseLeave);
      tooltip.removeEventListener("mouseenter", this._cancelFadeOut);
      tooltip.removeEventListener("mouseleave", this._handleBlurOrMouseLeave);
    }
    window.removeEventListener("keydown", this._handleEscapeKey);
  }

  async firstUpdated() {
    await this.updateComplete;
    const ref = this._getReferenceElement();
    const tooltip = this.shadowRoot?.querySelector(".nys-tooltip__content");

    if (!ref || !tooltip) return;

    this.applyInverseTransform();
    this._applyTooltipPropToFormComponent(ref);

    if (
      ref.tagName.toLowerCase() === "nys-button" ||
      ref.tagName.toLowerCase() === "nys-icon"
    ) {
      this._applyFocusBehavior(ref);
      ref.addEventListener("mouseenter", this._showTooltip);
      ref.addEventListener("mouseenter", this._cancelFadeOut);
      ref.addEventListener("mouseleave", this._handleBlurOrMouseLeave);
      ref.addEventListener("focusin", this._showTooltip);
      ref.addEventListener("focusout", this._handleBlurOrMouseLeave);
      tooltip.addEventListener("mouseenter", this._cancelFadeOut);
      tooltip.addEventListener("mouseleave", this._handleBlurOrMouseLeave);
    }
  }

  updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);

    const ref = this._getReferenceElement();
    if (!ref) return;

    this._positionStartingBase();

    // Accounts for tooltip's text change (for code editor changes & VO)
    if (changedProps.has("text")) {
      this._applyTooltipPropToFormComponent(ref);
    }
    if (changedProps.has("focusable")) {
      const tag = ref.tagName.toLowerCase();
      if (tag === "nys-button" || tag === "nys-icon") {
        this._applyFocusBehavior(ref);
      }
    }
  }

  /*************************************** Event Handlers ***************************************/
  // When we show the tooltip, check if user has set position to give it preference it space allows.
  // Otherwise dynamically position tooltip.
  private _showTooltip = () => {
    this._active = true;
    this._addScrollListeners();

    // Try to honor user's original preference first
    if (this._userHasSetPosition && this._originalUserPosition) {
      if (this._doesPositionFit(this._originalUserPosition)) {
        this.position = this._originalUserPosition;
        // Check if current tooltip position overflows to edge of screen
        this.updateComplete.then(() => {
          this._userPositionTooltip();
        });
        return;
      }
    }

    // Otherwise fall back to auto logic
    this._autoPositionTooltip();
  };

  private _handleBlurOrMouseLeave = () => {
    const ref = this._getReferenceElement();
    const tooltip = this.shadowRoot?.querySelector(
      ".nys-tooltip__content",
    ) as HTMLElement;

    if (!ref || !tooltip) return;

    // Pointer being inside either the tooltip or the attached component should cancel any fade out.
    if (this._isPointerInside(ref, tooltip)) return;
    console.log(this._isPointerInside(ref, tooltip));

    this._triggerFadeOut(tooltip);
  };

  private _triggerFadeOut(tooltip: HTMLElement) {
    if (this._hideTimeout) return;
    if (!tooltip) return;

    tooltip.classList.add("fade-out");

    this._hideTimeout = window.setTimeout(() => {
      this._active = false;
      this._removeScrollListeners();
      this._positionStartingBase();
      this._resetTooltipPositioningStyles(tooltip);

      tooltip.classList.remove("fade-out");
      this._hideTimeout = null;
    }, 200);
  }

  private _cancelFadeOut = () => {
    const tooltip = this.shadowRoot?.querySelector(
      ".nys-tooltip__content",
    ) as HTMLElement;
    if (!tooltip) return;

    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    }

    tooltip.classList.remove("fade-out");
    this._active = true;
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

    this._showTooltip();
  };

  private _handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this._active) {
      this._active = false;
      this._removeScrollListeners();

      const tooltip = this.shadowRoot?.querySelector(
        ".nys-tooltip__content",
      ) as HTMLElement;
      if (tooltip) {
        this._resetTooltipPositioningStyles(tooltip);
      }
    }
  };

  /*************************************** Functions ***************************************/
  private _getReferenceElement() {
    const targetId = this.for;
    if (!targetId) return null;

    // lightDOM search
    let htmlElement = document.getElementById(targetId);
    if (htmlElement) return htmlElement;

    // Search recursively through shadow DOMs (e.g. for nys-label within other component's shadowDOM)
    const findInShadows = (root: ParentNode): HTMLElement | null => {
      for (const el of Array.from(root.querySelectorAll("*"))) {
        const shadowElement = el.shadowRoot;
        if (shadowElement) {
          const found = shadowElement.getElementById(targetId);
          if (found) return found;

          const deeper = findInShadows(shadowElement);
          if (deeper) return deeper;
        }
      }
      return null;
    };

    return findInShadows(document);
  }

  // We need to pass `ariaLabel` or `ariaDescription` to the nys-components so they can announce both their label and the tooltip's text
  private async _passAria(el: HTMLElement) {
    const tagName = el.tagName.toLowerCase();

    if (tagName === "nys-icon") {
      // For nys-icon, use ariaLabel instead
      el.setAttribute("ariaLabel", `Hint: ${this.text}`);
    } else if (tagName === "nys-button") {
      // For other components like nys-button, use ariaDescription
      el.setAttribute("ariaDescription", `, Hint: ${this.text}`);
    }
  }

  /**
   * In React, the reference element found is often the native HTML element within the nys-component.
   * Therefore, this function accounts for the closest NYS component ancestor that supports a tooltip prop.
   */
  private _applyTooltipPropToFormComponent(ref: HTMLElement) {
    const tagName = ref.tagName.toLowerCase();
    if (!tagName.startsWith("nys-")) return;

    if (tagName === "nys-button" || tagName === "nys-icon") {
      // Already handled elsewhere in this component; we just ensure we attach listeners
      this._applyFocusBehavior(ref);
      this._passAria(ref);
      return;
    }

    if ("tooltip" in ref) {
      ref.tooltip = this.text;
    }
  }

  // Applies focus behavior to an otherwise non focus element (i.e. nys-icon is non focusable by default)
  private async _applyFocusBehavior(el: HTMLElement) {
    if (!this.focusable) return;
    el.style.cursor = "pointer";

    const tagName = el.tagName.toLowerCase();
    if (tagName === "nys-icon") {
      if ("updateComplete" in el) {
        await (el as any).updateComplete;
      }
      const svg = el.shadowRoot?.querySelector("svg");
      if (svg) {
        svg.setAttribute("tabindex", "0");
      }
    } else {
      el.setAttribute("tabindex", "0");
    }
  }

  /**
   * Checks if the tooltip fits inside the viewport on the given side of the trigger.
   * Used for auto-positioning. Ignores text overflow for now.
   */
  private _doesPositionFit(position: typeof this._position) {
    const ref = this._getReferenceElement();
    const tooltip = this.shadowRoot?.querySelector(".nys-tooltip__content");

    if (!ref || !tooltip || position == null) return;

    const refRect = ref.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Define some margin buffer between tooltip and trigger (to avoid touching the edges too tightly)
    const margin = 8;

    // Available space on each side relative to trigger rect and viewport
    const spaceAvailable = {
      top: refRect.top - margin,
      left: refRect.left - margin,
      bottom: window.innerHeight - refRect.bottom - margin,
      right: window.innerWidth - refRect.right - margin,
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

  private _userPositionTooltip() {
    const tooltip = this.shadowRoot?.querySelector(
      ".nys-tooltip__content",
    ) as HTMLElement;
    const ref = this._getReferenceElement();
    if (tooltip && ref) {
      this._positionTooltipElement(ref, tooltip, this.position);
      this._shiftTooltipIntoViewport(tooltip);
    }
  }

  // Calculates the best placement based on available space (flips placement if it doesn't fit)
  private async _autoPositionTooltip() {
    const ref = this._getReferenceElement();
    const tooltip = this.shadowRoot?.querySelector(
      ".nys-tooltip__content",
    ) as HTMLElement;

    if (!ref || !tooltip) return;

    const refRect = ref.getBoundingClientRect();
    const margin = 8;

    const spaceAvailable = {
      top: refRect.top - margin,
      left: refRect.left - margin,
      bottom: window.innerHeight - refRect.bottom - margin,
      right: window.innerWidth - refRect.right - margin,
    };

    // Default tryOrder for auto mode
    let tryOrder: Array<keyof typeof spaceAvailable> = [
      "top",
      "bottom",
      "right",
      "left",
    ];

    // If user explicitly set a preferred position (even if it didn’t fit),
    // favor it first before trying others
    if (this._userHasSetPosition && this._originalUserPosition) {
      const userPosition = this._originalUserPosition;
      if (userPosition === "left") {
        tryOrder = ["left", "right", "top", "bottom"];
      } else if (userPosition === "right") {
        tryOrder = ["right", "left", "top", "bottom"];
      } else if (userPosition === "top") {
        tryOrder = ["top", "bottom", "right", "left"];
      } else if (userPosition === "bottom") {
        tryOrder = ["bottom", "top", "right", "left"];
      }
    }

    // 1) Try to find the first side that fits
    for (const pos of tryOrder) {
      if (this._doesPositionFit(pos)) {
        this._setInternalPosition(pos);
        await this.updateComplete;
        this._positionTooltipElement(ref, tooltip, pos);
        this._shiftTooltipIntoViewport(tooltip);
        return;
      }
    }

    // 2) Fallback: pick the side with the most space
    let bestPosition: keyof typeof spaceAvailable = "top";
    let maxSpace = spaceAvailable.top;

    for (const pos of tryOrder) {
      if (spaceAvailable[pos] > maxSpace) {
        maxSpace = spaceAvailable[pos];
        bestPosition = pos;
      }
    }
    this._setInternalPosition(bestPosition);
    await this.updateComplete;
    this._positionTooltipElement(ref, tooltip, bestPosition);
    this._shiftTooltipIntoViewport(tooltip);
  }

  private _positionStartingBase() {
    const tooltip = this.shadowRoot?.querySelector(
      ".nys-tooltip__content",
    ) as HTMLElement;

    if (!tooltip) return;

    tooltip.style.top = "0px";
    tooltip.style.left = "0px";
  }

  private _positionTooltipElement(
    ref: HTMLElement,
    tooltip: HTMLElement,
    bestPosition: typeof this._position,
  ) {
    const refRect = ref.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const margin = 8;

    let top = 0;
    let left = 0;

    switch (bestPosition) {
      case "top":
        top = refRect.top - tooltipRect.height - margin;
        left = refRect.left + refRect.width / 2 - tooltipRect.width / 2;
        break;
      case "bottom":
        top = refRect.bottom + margin;
        left = refRect.left + refRect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = refRect.top + refRect.height / 2 - tooltipRect.height / 2;
        left = refRect.left - tooltipRect.width - margin;
        break;
      case "right":
        top = refRect.top + refRect.height / 2 - tooltipRect.height / 2;
        left = refRect.right + margin;
        break;
      default:
        // Default to top
        top = refRect.top - tooltipRect.height - margin;
        left = refRect.left + refRect.width / 2 - tooltipRect.width / 2;
        break;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  // Like storybook, some user's parent container may contain transform styling, which sets a new coordinate system.
  // This function reverse any container of that scale to not interfere with tooltip calculation.
  private applyInverseTransform() {
    document.querySelectorAll('div[scale="1"]').forEach((el) => {
      (el as HTMLElement).style.transform = "none";
    });
  }

  private _isPointerInside(ref: Element, tooltip: Element) {
    return ref.matches(":hover") || tooltip.matches(":hover");
  }

  private _setInternalPosition(bestPosition: typeof this._position) {
    this._internallyUpdatingPosition = true;
    this.position = bestPosition;
    this._internallyUpdatingPosition = false;
  }

  // Determines if text of tooltip over-extends outside of viewport edge and adjust tooltip for horizontal overflow
  private _shiftTooltipIntoViewport(tooltip: HTMLElement) {
    const ref = this._getReferenceElement();
    if (!ref) return;

    const refRect = ref.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const refCenter = refRect.left + refRect.width / 2;

    const overflowLeft = tooltipRect.left < 0;
    const overflowRight = tooltipRect.right > window.innerWidth;

    // Tooltip is past the viewport edge, shift it inwards
    if (overflowLeft) {
      tooltip.style.left = "10px";
      tooltip.style.transform = "none";
    } else if (overflowRight) {
      tooltip.style.right = "0px";
      tooltip.style.left = "auto";
      tooltip.style.transform = "none";
    }

    // Recalculate tooltip rect after any shift
    const newTooltipRect = tooltip.getBoundingClientRect();

    // Arrow offset relative to tooltip width to maintain accuracy on zoom and out-of-bounds
    const arrowOffsetRatio =
      (refCenter - newTooltipRect.left) / newTooltipRect.width;
    const arrowOffsetPercent = Math.max(0, Math.min(1, arrowOffsetRatio)) * 100;

    tooltip.style.setProperty("--arrow-offset-x", `${arrowOffsetPercent}%`);
  }

  // Reposition tooltip back to original set position (e.g. top, left, bottom, right) to avoid positioning issue base on last position
  private _resetTooltipPositioningStyles(tooltip: HTMLElement) {
    tooltip.style.left = "";
    tooltip.style.right = "";
    tooltip.style.transform = "";
  }

  render() {
    return html`
      <div class="nys-tooltip__main">
        ${this.text?.trim()
          ? html`<div
              id=${this.id}
              class="nys-tooltip__content"
              role="tooltip"
              aria-hidden=${!this._active}
              ?active=${this._active}
              style="visibility: ${this._active ? "visible" : "hidden"}; "
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

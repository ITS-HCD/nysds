import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import "./nys-dropdownmenuitem";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-dropdownmenu.scss?inline";

/**
 * Dropdown menus enable users to select an action from a list of options.
 * They’re commonly used to save space by grouping related actions, or to provide actions in a confined space.
 *
 * @element nys-dropdownmenu
 * @example
 * <button id="my-trigger">Action</button>
 * <nys-dropdownmenu for="my-trigger">
 *   <nys-dropdownitem label="Label 1" link="#"></nys-dropdownitem>
 * </nys-dropdownmenu>
 */

export class NysDropdownMenu extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) for = "";
  @property({ type: Boolean }) showDropdown = false;

  // Track if user set position is set explicitly
  private _originalUserPosition: typeof this._position | null = null;
  private _internallyUpdatingPosition = false;
  private _position:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "bottom-start"
    | "bottom-end"
    | "top-start"
    | "top-end" = "bottom-start";
  private _trigger: HTMLElement | null = null;

  /**
   * Preferred position relative to trigger. Auto-adjusts if space is insufficient.
   * - `bottom-start`: opens downward, left-aligned with trigger
   * - `bottom-end`: opens downward, right-aligned with trigger
   * - `top-start`: opens upward, left-aligned with trigger
   * - `top-end`: opens upward, right-aligned with trigger
   * - `bottom` / `top` / `left` / `right`: legacy axis-only positions
   * @default "bottom-start"
   */
  @property({ type: String, reflect: true })
  get position() {
    return this._position;
  }

  set position(value) {
    const oldVal = this._position;
    this._position = value;
    this.requestUpdate("position", oldVal);

    if (!this._internallyUpdatingPosition) {
      this._originalUserPosition = value;
    }
  }

  // Lifecycle Methods
  constructor() {
    super();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
  }

  async firstUpdated() {
    await this.updateComplete;
    this._connectTrigger();
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _findTrigger() {
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

  private _connectTrigger() {
    const trigger = this._findTrigger();
    if (trigger) {
      this._trigger = trigger;
      this._trigger.setAttribute("aria-haspopup", "true");
      this._trigger.setAttribute("aria-expanded", "false");
      this._trigger.addEventListener("click", () => this._toggleDropdown());
    }
  }

  private _toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this._trigger?.setAttribute("aria-expanded", "true");
      this.updateComplete.then(() => this._positionMenu());
    } else {
      this._trigger?.setAttribute("aria-expanded", "false");
    }
  }

  /**
   * Position Logic
   * --------------------------------------------------------------------------
   */

  /** Returns true if the menu fits on the given side of the trigger. */
  private _doesPositionFit(pos: typeof this._position): boolean {
    if (!this._trigger) return false;

    const menuEl = this.shadowRoot?.querySelector(
      ".nys-dropdownmenu",
    ) as HTMLElement | null;
    if (!menuEl) return false;

    const triggerRect = this._trigger.getBoundingClientRect();
    const menuRect = menuEl.getBoundingClientRect();
    const gap = 4;
    const margin = 8;

    const spaceBelow = window.innerHeight - triggerRect.bottom - margin;
    const spaceAbove = triggerRect.top - margin;
    const spaceRight = window.innerWidth - triggerRect.right - margin;
    const spaceLeft = triggerRect.left - margin;

    switch (pos) {
      case "bottom":
      case "bottom-start":
      case "bottom-end":
        return spaceBelow >= menuRect.height + gap;
      case "top":
      case "top-start":
      case "top-end":
        return spaceAbove >= menuRect.height + gap;
      case "right":
        return spaceRight >= menuRect.width + gap;
      case "left":
        return spaceLeft >= menuRect.width + gap;
      default:
        return false;
    }
  }

  /** Returns the fallback position when the preferred one doesn't fit. */
  private _getFallbackPosition(
    preferred: typeof this._position,
  ): typeof this._position {
    switch (preferred) {
      case "bottom-start":
        return "top-start";
      case "bottom-end":
        return "top-end";
      case "top-start":
        return "bottom-start";
      case "top-end":
        return "bottom-end";
      case "bottom":
        return "top";
      case "top":
        return "bottom";
      case "right":
        return "left";
      case "left":
        return "right";
      default:
        return "bottom-start";
    }
  }

  private _setInternalPosition(pos: typeof this._position) {
    this._internallyUpdatingPosition = true;
    this.position = pos;
    this._internallyUpdatingPosition = false;
  }

  private _positionMenu() {
    if (!this._trigger) return;

    const menuEl = this.shadowRoot?.querySelector(
      ".nys-dropdownmenu",
    ) as HTMLElement | null;
    if (!menuEl) return;

    const triggerRect = this._trigger.getBoundingClientRect();
    const menuRect = menuEl.getBoundingClientRect();
    const menuWidth = menuRect.width;
    const menuHeight = menuRect.height;

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const gap = 4; // px gap between trigger and menu

    // Always resolve from the user's original preference (not the last internal flip)
    const preferred = this._originalUserPosition ?? this._position;
    let effectivePosition = preferred;
    if (!this._doesPositionFit(preferred)) {
      const fallback = this._getFallbackPosition(preferred);
      if (this._doesPositionFit(fallback)) {
        effectivePosition = fallback;
      }
      // If neither fits, keep the preferred position
    }
    this._setInternalPosition(effectivePosition);

    // Anchors (page-absolute)
    const anchorTop = triggerRect.top + scrollY;
    const anchorBottom = triggerRect.bottom + scrollY;
    const anchorLeft = triggerRect.left + scrollX;
    const anchorRight = triggerRect.right + scrollX;

    // Reset any previously set inline styles
    this.style.top = "";
    this.style.left = "";
    this.style.right = "";
    this.style.bottom = "";
    this.style.position = "absolute";

    switch (effectivePosition) {
      case "bottom-start":
        // Opens downward, left-aligned with trigger's left edge
        this.style.top = `${anchorBottom + gap}px`;
        this.style.left = `${anchorLeft}px`;
        break;

      case "bottom-end":
        // Opens downward, right-aligned with trigger's right edge
        this.style.top = `${anchorBottom + gap}px`;
        this.style.left = `${anchorRight - menuWidth}px`;
        break;

      case "top-start":
        // Opens upward, left-aligned with trigger's left edge
        this.style.top = `${anchorTop - menuHeight - gap}px`;
        this.style.left = `${anchorLeft}px`;
        break;

      case "top-end":
        // Opens upward, right-aligned with trigger's right edge
        this.style.top = `${anchorTop - menuHeight - gap}px`;
        this.style.left = `${anchorRight - menuWidth}px`;
        break;

      case "bottom":
        // Legacy: opens downward, left-aligned
        this.style.top = `${anchorBottom + gap}px`;
        this.style.left = `${anchorLeft}px`;
        break;

      case "top":
        // Legacy: opens upward, left-aligned
        this.style.top = `${anchorTop - menuHeight - gap}px`;
        this.style.left = `${anchorLeft}px`;
        break;

      case "right":
        this.style.top = `${anchorBottom}px`;
        this.style.left = `${anchorRight + gap}px`;
        break;

      case "left":
        this.style.top = `${anchorBottom}px`;
        this.style.left = `${anchorLeft - menuWidth - gap}px`;
        break;
    }
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  render() {
    return html`<div
      class="nys-dropdownmenu ${this.showDropdown ? "active" : ""}"
      for=${this.for}
    >
      <ul role="menu">
        <slot></slot>
      </ul>
    </div>`;
  }
}

if (!customElements.get("nys-dropdownmenu")) {
  customElements.define("nys-dropdownmenu", NysDropdownMenu);
}

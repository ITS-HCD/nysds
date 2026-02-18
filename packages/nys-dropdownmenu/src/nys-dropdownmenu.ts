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
  private _userHasSetPosition = false;
  private _originalUserPosition: "top" | "bottom" | "left" | "right" | null =
    null;
  private _position: "top" | "bottom" | "left" | "right" = "bottom";
  private _trigger: HTMLElement | null = null;

  /**
   * Preferred position relative to trigger. Auto-adjusts if space is insufficient.
   * @default null (auto-positioned based on available space)
   */
  @property({ type: String, reflect: true })
  get position() {
    return this._position;
  }

  set position(value) {
    const oldVal = this._position;
    this._position = value;
    this.requestUpdate("position", oldVal);

    // The "_userHasSetPosition" flag allows user's set position to take preference
    if (!this._userHasSetPosition) {
      this._userHasSetPosition = value !== null;
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
    console.log("_connectTrigger");
    const trigger = this._findTrigger();
    console.log("trigger", trigger);
    if (trigger) {
      this._trigger = trigger;
      this._trigger.setAttribute("aria-haspopup", "true");
      this._trigger.setAttribute("aria-expanded", "false");
      this._trigger.addEventListener("click", () => this._toggleDropdown());
    }
  }

  private _toggleDropdown() {
    console.log("_toggleDropdown");
    this.showDropdown = !this.showDropdown;
    console.log(this.showDropdown);
  }

  /**
   * Position Logic
   * --------------------------------------------------------------------------
   */

  private _positionMenu() {
    if (!this._trigger) return;

    const triggerRect = this._trigger.getBoundingClientRect();
    const menuEl = this.shadowRoot?.querySelector(
      ".nys-dropdownmenu",
    ) as HTMLElement | null;
    if (!menuEl) return;

    const menuRect = menuEl.getBoundingClientRect();
    const menuWidth = menuRect.width;
    const menuHeight = menuRect.height;

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Anchor: bottom-left of the trigger
    const anchorLeft = triggerRect.left + scrollX;
    const anchorBottom = triggerRect.bottom + scrollY;
    const anchorTop = triggerRect.top + scrollY;

    const gap = 4; // px gap between trigger and menu

    // Determine effective position, falling back if there isn't enough space
    let effectivePosition = this._position;

    // Check available space for each direction (viewport-relative)
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const spaceRight = viewportWidth - triggerRect.right;
    const spaceLeft = triggerRect.left;

    if (effectivePosition === "bottom" && spaceBelow < menuHeight + gap) {
      effectivePosition = "top";
    } else if (effectivePosition === "top" && spaceAbove < menuHeight + gap) {
      effectivePosition = "bottom";
    } else if (effectivePosition === "right" && spaceRight < menuWidth + gap) {
      effectivePosition = "left";
    } else if (effectivePosition === "left" && spaceLeft < menuWidth + gap) {
      effectivePosition = "right";
    }

    // Reset any previously set inline styles
    this.style.top = "";
    this.style.left = "";
    this.style.right = "";
    this.style.bottom = "";
    this.style.position = "absolute";

    switch (effectivePosition) {
      case "bottom":
        // Opens downward, left edge aligned with trigger's left edge
        this.style.top = `${anchorBottom + gap}px`;
        this.style.left = `${anchorLeft}px`;
        break;

      case "top":
        // Opens upward, left edge aligned with trigger's left edge
        this.style.top = `${anchorTop - menuHeight - gap}px`;
        this.style.left = `${anchorLeft}px`;
        break;

      case "right":
        // Opens to the right, top edge aligned with trigger's bottom edge
        this.style.top = `${anchorBottom}px`;
        this.style.left = `${triggerRect.right + scrollX + gap}px`;
        break;

      case "left":
        // Opens to the left, top edge aligned with trigger's bottom edge
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

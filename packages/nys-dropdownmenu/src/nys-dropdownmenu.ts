import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import "./nys-dropdownmenuitem";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-dropdownmenu.scss?inline";

let dropdownMenuIdCounter = 0;

/**
 * Dropdown menus enable users to select an action from a list of options.
 * They’re commonly used to save space by grouping related actions, or to provide actions in a confined space.
 *
 * @summary Action menu with auto-positioning, keyboard support, and screen reader integration.
 * @element nys-dropdownmenu
 *
 * @example Basic dropdown
 * ```html
 * <button id="my-trigger">Actions</button>
 * <nys-dropdownmenu for="my-trigger">
 *   <nys-dropdownmenuitem label="Edit" link="/edit"></nys-dropdownmenuitem>
 *   <nys-dropdownmenuitem label="Delete" link="/delete"></nys-dropdownmenuitem>
 * </nys-dropdownmenu>
 * ```
 *
 * @example Positioned dropdown
 * ```html
 * <button id="settings-btn">Settings</button>
 * <nys-dropdownmenu for="settings-btn" position="top-start">
 *   <nys-dropdownmenuitem label="Profile" link="/profile"></nys-dropdownmenuitem>
 *   <nys-dropdownmenuitem label="Logout" link="/logout"></nys-dropdownmenuitem>
 * </nys-dropdownmenu>
 * ```
 */

type Position = "bottom-start" | "bottom-end" | "top-start" | "top-end";

interface PositionCoordinates {
  top: number;
  left: number;
}

interface SpaceAvailable {
  top: number;
  bottom: number;
  start: number;
  end: number;
}

export class NysDropdownMenu extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) for = "";
  @property({ type: Boolean }) showDropdown = false;

  /**
   * Preferred position relative to trigger.
   * @default "bottom-start"
   */
  @property({ type: String, reflect: true }) position: Position | null = null;

  private _trigger: HTMLElement | null = null;
  private _menuElement: HTMLElement | null = null;
  private _ariaTarget: HTMLElement | null = null;
  private readonly GAP = 4;

  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */

  constructor() {
    super();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();

        if (!this.id) {
      this.id = `nys-dropdownmenu-${Date.now()}-${dropdownMenuIdCounter++}`;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  async firstUpdated() {
    await this.updateComplete;
    this.applyInverseTransform();
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
    if (!trigger) return;

    this._trigger = trigger;

    const ariaTarget =
      trigger.tagName.toLowerCase() === "nys-button"
        ? (trigger.shadowRoot?.querySelector("button") ?? trigger)
        : trigger;

    ariaTarget.setAttribute("aria-haspopup", "menu");
    ariaTarget.setAttribute("aria-expanded", "false");

    this._ariaTarget = ariaTarget;

    this._trigger.addEventListener("click", this._toggleDropdown);
    this._trigger.addEventListener("keydown", this._handleTriggerKeydown);
  }

  private _toggleDropdown = async () => {
    this.showDropdown = !this.showDropdown;

    this._ariaTarget?.setAttribute("aria-expanded", String(this.showDropdown));

    if (this.showDropdown) {
      window.addEventListener("scroll", this._handleWindowScroll, true);
      window.addEventListener("resize", this._handleWindowResize);
      document.addEventListener("click", this._handleDocumentClick);

      this._menuElement = this.shadowRoot?.querySelector(
        ".nys-dropdownmenu",
      ) as HTMLElement | null;
      this._menuElement!.addEventListener("keydown", this._handleMenuKeydown);

      await this.updateComplete;
      this._positionMenu();
      this._focusOnFirstItem();
    } else {
      window.removeEventListener("scroll", this._handleWindowScroll, true);
      window.removeEventListener("resize", this._handleWindowResize);
      document.removeEventListener("click", this._handleDocumentClick);
      this._menuElement!.removeEventListener(
        "keydown",
        this._handleMenuKeydown,
      );
    }
  };

  private _closeDropdown() {
    this.showDropdown = false;
    this._ariaTarget?.setAttribute("aria-expanded", "false");
    this._trigger?.focus();
  }

  private _getMenuItems(): HTMLElement[] {
    const slot = this.shadowRoot?.querySelector("slot");
    const assigned = slot?.assignedElements({ flatten: true }) || [];

    return assigned.filter(
      (el) => el && !el.hasAttribute("disabled"),
    ) as HTMLElement[];
  }

  private _handleDocumentClick = (event: MouseEvent) => {
    if (!this.showDropdown) return;

    const path = event?.composedPath();

    const clickedInsideMenu = path.includes(this);
    const clickedTrigger = this._trigger && path.includes(this._trigger);

    if (!clickedInsideMenu && !clickedTrigger) {
      this._closeDropdown();
    }
  };

  private async _focusOnFirstItem() {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const items = this._getMenuItems();
    if (items.length > 0) items[0].focus();
  }

  // In some iframes (like Storybook's) or embedded containers , parent elements may have CSS transforms applied, creating a new coordinate context.
  // This function removes such transforms to prevent them from affecting tooltip positioning calculations.
  private applyInverseTransform() {
    document.querySelectorAll('div[scale="1"]').forEach((el) => {
      (el as HTMLElement).style.transform = "none";
    });
  }

  /**
   * Position Logic
   * --------------------------------------------------------------------------
   */

  /**
   * The controller function for positioning the dropdown menu.
   * The logic diverts to if user sets position or we auto position the dropdown menu
   */
  private _positionMenu() {
    if (!this._trigger) return;

    this._menuElement = this.shadowRoot?.querySelector(
      ".nys-dropdownmenu",
    ) as HTMLElement | null;
    if (!this._menuElement) return;

    // Decide position based on user preference OR auto position if no position chosen
    const finalPosition = this.position
      ? this._setUserPosition(this.position)
      : this._autoPosition();

    // Apply the calculated position
    const coords = this._calculateCoordinates(finalPosition);
    this._applyPosition(coords);
  }

  private _setUserPosition(userPosition: Position): Position {
    const space = this._checkSpaceAvailable();
    const menuRect = this._menuElement!.getBoundingClientRect();

    const userPositionFits = this._checkPositionFits(
      userPosition,
      space,
      menuRect,
    );

    if (userPositionFits) {
      return userPosition;
    }

    // User position doesn't fit, find best alternative
    return this._findBestAlternative(userPosition, space, menuRect);
  }

  /**
   * Auto Positioning of the dropdown menu relies on the best surrounding space available
   * to select the desirable position.
   */
  private _autoPosition(): Position {
    const space = this._checkSpaceAvailable();
    const menuRect = this._menuElement!.getBoundingClientRect();

    const defaultPosition: Position = "bottom-end";

    if (this._checkPositionFits(defaultPosition, space, menuRect)) {
      return defaultPosition;
    }

    return this._findBestAlternative(defaultPosition, space, menuRect);
  }

  /**
   * Checks if the dropdown menu fits inside the viewport on the given side of the trigger.
   * Overrides user set position for auto-positioning if user's desire space is not available
   */
  private _checkSpaceAvailable(): SpaceAvailable {
    if (!this._trigger) {
      return { top: 0, bottom: 0, start: 0, end: 0 };
    }

    const triggerRect = this._trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    return {
      top: triggerRect.top,
      bottom: viewportHeight - triggerRect.bottom,
      start: triggerRect.left,
      end: viewportWidth - triggerRect.right,
    };
  }

  private _checkPositionFits(
    position: Position,
    space: SpaceAvailable,
    menuRect: DOMRect,
  ): boolean {
    const menuWidth = menuRect.width;
    const menuHeight = menuRect.height;

    const [vertical, horizontal] = position.split("-") as [
      "top" | "bottom",
      "start" | "end",
    ];

    const verticalFits =
      vertical === "bottom"
        ? space.bottom >= menuHeight + this.GAP
        : space.top >= menuHeight + this.GAP;

    const horizontalFits =
      horizontal === "start"
        ? space.end >= menuWidth
        : space.start >= menuWidth;
    return verticalFits && horizontalFits;
  }

  /**
   * This position is called for when user's set position didn't fit OR auto positioning when default position doesn't fit
   * We look for the best alternative positions in order of preference base on the set position (e.g. bottom-start => bottom-end).
   * @param userPosition
   * @param space
   * @param menuRect
   */
  private _findBestAlternative(
    userPosition: Position,
    space: SpaceAvailable,
    menuRect: DOMRect,
  ): Position {
    const [vertical, horizontal] = userPosition.split("-") as [
      "top" | "bottom",
      "start" | "end",
    ];

    const alternatives: Position[] = [
      `${vertical === "bottom" ? "top" : "bottom"}-${horizontal}`, // Flip vertical
      `${vertical}-${horizontal === "start" ? "end" : "start"}`, // Flip horizontal
      `${vertical === "bottom" ? "top" : "bottom"}-${horizontal === "start" ? "end" : "start"}`, // Flip both
    ];

    for (const altPosition of alternatives) {
      if (this._checkPositionFits(altPosition, space, menuRect)) {
        return altPosition;
      }
    }

    // Fallback: nothing fits, return position with most space
    return this._findMostAvailableSpace(space) as Position;
  }

  private _findMostAvailableSpace(space: SpaceAvailable): Position {
    const vertical = space.bottom >= space.top ? "bottom" : "top";
    const horizontal = space.start >= space.end ? "start" : "end";

    return `${vertical}-${horizontal}`;
  }

  /**
   * A valid ideal position has been chosen.
   * This function calculates the coordinate of the trigger to properly position the dropdown menu.
   * @param position
   * @returns
   */
  private _calculateCoordinates(position: Position): PositionCoordinates {
    if (!this._trigger || !this._menuElement) {
      return { top: 0, left: 0 };
    }

    const triggerRect = this._trigger.getBoundingClientRect();
    const menuRect = this._menuElement.getBoundingClientRect();

    const [vertical, horizontal] = position.split("-") as [
      "top" | "bottom",
      "start" | "end",
    ];

    let top = 0;
    let left = 0;

    // Vertical position
    if (vertical === "bottom") {
      top = triggerRect.bottom + this.GAP;
    } else {
      top = triggerRect.top - menuRect.height - this.GAP;
    }

    // Horizontal position
    if (horizontal === "start") {
      left = triggerRect.left;
    } else {
      left = triggerRect.right - menuRect.width;
    }

    return { top, left };
  }

  private _applyPosition(coords: PositionCoordinates) {
    if (!this._menuElement) return;

    this._menuElement.style.top = `${coords.top}px`;
    this._menuElement.style.left = `${coords.left}px`;
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private _handleTriggerKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._toggleDropdown();
    }

    if (event.key === "Escape" && this.showDropdown) {
      event.preventDefault();
      this._closeDropdown();
    }
  };

  private _handleMenuKeydown = (event: KeyboardEvent) => {
    const items = this._getMenuItems();
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this._closeDropdown();
        break;
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        const nextIndex =
          currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        items[nextIndex].focus();
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        items[prevIndex].focus();
        break;

      default:
        break;
    }
  };

  private _handleWindowResize = () => {
    if (this.showDropdown) {
      this._positionMenu();
    }
  };

  private _handleWindowScroll = () => {
    if (this.showDropdown) {
      this._positionMenu();
    }
  };

  render() {
    return html`<div
      class="nys-dropdownmenu ${this.showDropdown ? "active" : ""}"
      for=${this.for}
      ?hidden=${!this.showDropdown}
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

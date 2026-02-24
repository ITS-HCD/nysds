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

  // // Track if user set position is set explicitly
  // private _userHasSetPosition = false;
  // private _originalUserPosition: Position | null = null;
  // private _position: Position = "bottom";

  private _trigger: HTMLElement | null = null;
  private _menuElement: HTMLElement | null = null;
  private readonly GAP = 4; // px gap between trigger and menu

  /**
   * Preferred position relative to trigger. Auto-adjusts if space is insufficient.
   * @default null (auto-positioned based on available space)
   */
  // @property({ type: String, reflect: true })
  // get position() {
  //   return this._position;
  // }

  // set position(value) {
  //   const oldVal = this._position;
  //   this._position = value;
  //   this.requestUpdate("position", oldVal);

  //   // The "_userHasSetPosition" flag allows user's set position to take preference
  //   if (!this._userHasSetPosition) {
  //     this._userHasSetPosition = value !== null;
  //     this._originalUserPosition = value;
  //   }
  // }

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
      requestAnimationFrame(() => this._positionMenu());
    }
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

    // const triggerRect = this._trigger.getBoundingClientRect();
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

    console.log(
      "verticalFits && horizontalFits: ",
      verticalFits,
      horizontalFits,
    );
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
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const [vertical, horizontal] = position.split("-") as [
      "top" | "bottom",
      "start" | "end",
    ];

    let top = 0;
    let left = 0;

    // Vertical position
    if (vertical === "bottom") {
      top = triggerRect.bottom + scrollY + this.GAP;
    } else {
      top = triggerRect.top + scrollY - menuRect.height - this.GAP;
    }

    if (horizontal === "start") {
      left = triggerRect.left + scrollX + this.GAP;
    } else {
      left = triggerRect.right + scrollX - menuRect.width;
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

import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-dropdown.scss?inline";

/**
 * Dropdown menus enable users to select an action from a list of options. They’re commonly used to save space by grouping related actions, or to provide actions in a confined space.
 */

export class NysDropdown extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) for = "";
  @property({ type: String }) divider = "";

  // Track if user set position is set explicitly
  private _userHasSetPosition = false;
  // Keeping track of original user set position
  private _originalUserPosition: typeof this._position | null = null;
  // Position Logic
  private _position: "left" | "right" | null = null;

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

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  // Placeholder for generic functions (component-specific)

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  // Placeholder for event handlers if needed

  render() {
    return html`<div class="nys-dropdown">
      <ul role="menu">
        <slot></slot>
      </ul>
    </div>`;
  }
}

if (!customElements.get("nys-dropdown")) {
  customElements.define("nys-dropdown", NysDropdown);
}

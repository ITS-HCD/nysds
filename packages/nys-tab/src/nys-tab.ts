import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tab.scss?inline";

/** @internal Monotonically increasing counter used to generate unique element IDs. */
let componentIdCounter = 0;

/**
 * `<nys-tab>` is a single tab within a `<nys-tabgroup>`.
 *
 * Paired with a `<nys-tabpanel>` by render order inside the parent
 * `<nys-tabgroup>`. ARIA attributes (`role`, `aria-selected`, `aria-controls`,
 * `tabindex`) are managed externally by `<nys-tabgroup>` via `_applySelection`;
 * do not set them directly on this element.
 *
 * @element nys-tab
 *
 * @fires nys-tab-select - Dispatched when the tab is activated via click or
 *   Enter / Space. Bubbles and crosses shadow DOM boundaries.
 *   `detail: { id: string, label: string }`
 * @fires nys-tab-focus - Dispatched when the inner `<button>` receives
 *   focus. Bubbles and crosses shadow DOM boundaries.
 *   `detail: { id: string }`
 * @fires nys-tab-blur - Dispatched when the inner `<button>` loses focus.
 *   Bubbles and crosses shadow DOM boundaries.
 *   `detail: { id: string }`
 *
 * @slot - No slots; content is derived from the `label` property.
 */
export class NysTab extends LitElement {
  static styles = unsafeCSS(styles);

  /**
   * `delegatesFocus: true` ensures that when the host element (which carries
   * `role="tab"` and `tabindex`) receives focus programmatically or via Tab,
   * focus is forwarded to the inner `<button>` so the browser renders the
   * correct focus indicator.
   */
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * Unique identifier for the tab element.
   * If not provided, one is auto-generated in `connectedCallback`.
   * Reflected to the DOM attribute so `aria-controls` references on sibling
   * panels resolve correctly.
   *
   * @attr id
   */
  @property({ type: String, reflect: true }) id = "";

  /**
   * Visible text label rendered inside the inner `<button>`.
   *
   * @attr label
   */
  @property({ type: String }) label = "";

  /**
   * Whether this tab is the currently active tab.
   * Managed by `<nys-tabgroup>`; reflected to the DOM attribute so CSS
   * selected-state styles can be applied via the attribute selector.
   *
   * @attr selected
   */
  @property({ type: Boolean, reflect: true }) selected = false;

  /**
   * Whether this tab is disabled.
   * When `true`, click and keyboard activation are suppressed and the inner
   * `<button>` renders in its disabled state.
   * Reflected to the DOM attribute for CSS styling.
   *
   * @attr disabled
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Sets `role="tab"` and a default `tabindex="-1"` on the host so the ARIA
   * tab role is visible outside the shadow DOM. `<nys-tabgroup>` overrides
   * `tabindex` to `"0"` on the selected tab via `_applySelection`.
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-tab-${Date.now()}-${componentIdCounter++}`;
    }
    this.setAttribute("role", "tab");
    this.setAttribute("tabindex", "-1");
  }

  /**
   * Keeps `aria-disabled` on the host in sync with the `disabled` property so
   * assistive technologies can perceive disabled state even when the native
   * `disabled` attribute is on the inner `<button>` (inside the shadow DOM).
   */
  updated(changed: Map<string, unknown>) {
    if (changed.has("disabled")) {
      if (this.disabled) {
        this.setAttribute("aria-disabled", "true");
      } else {
        this.removeAttribute("aria-disabled");
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Moves browser focus to the inner `<button>`.
   * The host carries `role="tab"` and `tabindex`; `delegatesFocus: true` on
   * the shadow root ensures AT associates the tab role with the focused element.
   *
   * @param options - Optional `FocusOptions` forwarded to the inner button.
   */
  public focus(options?: FocusOptions): void {
    const button = this.shadowRoot?.querySelector(
      "button",
    ) as HTMLButtonElement | null;
    if (button) {
      button.focus(options);
    } else {
      super.focus(options);
    }
  }

  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------

  /**
   * Handles click activation of the tab.
   * No-ops when the tab is disabled. Dispatches `nys-tab-select` so the
   * parent `<nys-tabgroup>` can update selection state.
   */
  private _handleClick(): void {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent("nys-tab-select", {
        bubbles: true,
        composed: true,
        detail: { id: this.id, label: this.label },
      }),
    );
  }

  /**
   * Handles focus on the inner `<button>`.
   * Re-dispatches as `nys-tab-focus` so consumers can observe tab-level focus
   * without piercing the shadow DOM.
   */
  private _handleFocus(): void {
    this.dispatchEvent(
      new CustomEvent("nys-tab-focus", {
        bubbles: true,
        composed: true,
        detail: { id: this.id },
      }),
    );
  }

  /**
   * Handles blur on the inner `<button>`.
   * Re-dispatches as `nys-tab-blur` so consumers can observe tab-level blur
   * without piercing the shadow DOM.
   */
  private _handleBlur(): void {
    this.dispatchEvent(
      new CustomEvent("nys-tab-blur", {
        bubbles: true,
        composed: true,
        detail: { id: this.id },
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  render() {
    return html`
      <button
        class="nys-tab"
        type="button"
        tabindex="-1"
        ?disabled=${this.disabled}
        @click=${this._handleClick}
        @focus=${this._handleFocus}
        @blur=${this._handleBlur}
      >
        ${this.label}
      </button>
    `;
  }
}

if (!customElements.get("nys-tab")) {
  customElements.define("nys-tab", NysTab);
}

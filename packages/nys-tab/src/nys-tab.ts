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
 * `<nys-tabgroup>`. ARIA attributes (`aria-controls`, `tabindex`,
 * `selected`) are managed externally by `<nys-tabgroup>` via
 * `_applySelection`; do not set them directly on this element.
 *
 * @element nys-tab
 *
 * @fires nys-tab-select - Dispatched when the tab is activated via click or
 *   Enter / Space. Bubbles and crosses shadow DOM boundaries.
 *   `detail: { id: string, label: string }`
 * @fires nys-tab-focus - Dispatched when the inner `<nys-button>` receives
 *   focus. Bubbles and crosses shadow DOM boundaries.
 *   `detail: { id: string }`
 * @fires nys-tab-blur - Dispatched when the inner `<nys-button>` loses focus.
 *   Bubbles and crosses shadow DOM boundaries.
 *   `detail: { id: string }`
 *
 * @slot - No slots; content is derived from the `label` property.
 */
export class NysTab extends LitElement {
  static styles = unsafeCSS(styles);

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
   * Visible text label rendered inside the inner `<nys-button>`.
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
   * `<nys-button>` renders in its disabled state.
   * Reflected to the DOM attribute for CSS styling.
   *
   * @attr disabled
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Called when the element is inserted into the document.
   * Auto-generates a unique `id` if one was not provided, then sets
   * `role="tab"` on the host so the ARIA role is visible outside the
   * shadow DOM.
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-tab-${Date.now()}-${componentIdCounter++}`;
    }
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Moves browser focus to this tab by chaining through the shadow DOM.
   *
   * Focus is forwarded to the inner `<nys-button>` (which in turn forwards it
   * to its own shadow-DOM `<button>`). Falls back to `super.focus()` if
   * `<nys-button>` is not yet in the shadow root.
   *
   * @param options - Optional `FocusOptions` (e.g. `{ preventScroll: true }`)
   *   forwarded verbatim to the inner element.
   * @returns void
   */
  public focus(options?: FocusOptions): void {
    const button = this.shadowRoot?.querySelector("nys-button") as
      | (HTMLElement & { focus?: (o?: FocusOptions) => void })
      | null;
    if (button?.focus) {
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
   *
   * @returns void
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
   * Handles keyboard events on the inner `<nys-button>`.
   * Only Enter and Space trigger activation (per the ARIA Tabs Pattern);
   * ArrowKey navigation is handled one level up by `<nys-tabgroup>`.
   * No-ops when the tab is disabled.
   *
   * @param e - The `KeyboardEvent` from the inner button's `keydown` listener.
   * @returns void
   */
  private _handleKeydown(e: KeyboardEvent): void {
    if (this.disabled) return;
    if (e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();
    this._handleClick();
  }

  /**
   * Handles the `nys-focus` event bubbled up from the inner `<nys-button>`.
   * Re-dispatches as `nys-tab-focus` so consumers can observe tab-level focus
   * without piercing the shadow DOM.
   *
   * @returns void
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
   * Handles the `nys-blur` event bubbled up from the inner `<nys-button>`.
   * Re-dispatches as `nys-tab-blur` so consumers can observe tab-level blur
   * without piercing the shadow DOM.
   *
   * @returns void
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
      <nys-button
        class="nys-tab"
        type="button"
        label=${this.label}
        ?disabled=${this.disabled}
        ariaControls=${this.getAttribute("aria-controls") ?? ""}
        aria-disabled=${this.disabled}
        @nys-click=${this._handleClick}
        @nys-focus=${this._handleFocus}
        @nys-blur=${this._handleBlur}
        @keydown=${this._handleKeydown}
      ></nys-button>
    `;
  }
}

if (!customElements.get("nys-tab")) {
  customElements.define("nys-tab", NysTab);
}

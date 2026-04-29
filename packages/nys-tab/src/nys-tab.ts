import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tab.scss?inline";

/** @internal Monotonically increasing counter used to generate unique element IDs. */
let componentIdCounter = 0;

/**
 * `<nys-tab>` is a single tab within a `<nys-tabgroup>`.
 *
 * The host element carries `role="tab"`, `tabindex`, `aria-selected`,
 * `aria-controls`, and `aria-disabled` so assistive technologies see the
 * correct ARIA tab semantics on the element that is actually focused.
 * `<nys-tabgroup>` manages `tabindex`, `aria-selected`, and `aria-controls`
 * via `_applySelection`; do not set them directly on this element.
 *
 * @element nys-tab
 *
 * @fires nys-tab-select - Dispatched when the tab is activated via click or
 *   Enter / Space. Bubbles and crosses shadow DOM boundaries.
 *   `detail: { id: string, label: string }`
 * @fires nys-tab-focus - Dispatched when the host receives focus. Bubbles and
 *   crosses shadow DOM boundaries. `detail: { id: string }`
 * @fires nys-tab-blur - Dispatched when the host loses focus. Bubbles and
 *   crosses shadow DOM boundaries. `detail: { id: string }`
 *
 * @slot - No slots; content is derived from the `label` property.
 */
export class NysTab extends LitElement {
  static styles = unsafeCSS(styles);

  /**
   * Unique identifier for the tab element.
   * Reflected to the DOM attribute so `aria-controls` references resolve.
   *
   * @attr id
   */
  @property({ type: String, reflect: true }) id = "";

  /**
   * Visible text label rendered inside the inner `<span>`.
   *
   * @attr label
   */
  @property({ type: String }) label = "";

  /**
   * Whether this tab is the currently active tab.
   * Managed by `<nys-tabgroup>`; reflected for CSS attribute selectors.
   *
   * @attr selected
   */
  @property({ type: Boolean, reflect: true }) selected = false;

  /**
   * Whether this tab is disabled.
   * Reflected to the DOM attribute for CSS styling.
   *
   * @attr disabled
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Sets `role="tab"` and `tabindex="-1"` on the host (the element that AT
   * will read and that receives keyboard focus). Attaches host-level listeners
   * for keydown, focus, blur, and click so that interaction events work
   * correctly on the host element itself.
   *
   * Click is handled at the host level so iOS VoiceOver double-tap (which
   * dispatches `click` directly on the host because of `role="tab"`, bypassing
   * shadow-DOM children) activates the tab. Normal taps land on the inner
   * `<span>` and bubble up to this listener.
   *
   * `<nys-tabgroup>` overrides `tabindex` to `"0"` on the selected tab.
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-tab-${Date.now()}-${componentIdCounter++}`;
    }
    this.setAttribute("role", "tab");
    this.setAttribute("tabindex", "-1");
    this.addEventListener("keydown", this._onKeydown);
    this.addEventListener("focus", this._onFocus);
    this.addEventListener("blur", this._onBlur);
    this.addEventListener("click", this._onClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this._onKeydown);
    this.removeEventListener("focus", this._onFocus);
    this.removeEventListener("blur", this._onBlur);
    this.removeEventListener("click", this._onClick);
  }

  /**
   * Keeps `aria-disabled` on the host in sync with the `disabled` property so
   * AT perceives the disabled state on the element it actually focuses.
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
   * Focuses the host element. The host carries `role="tab"` and `tabindex`,
   * so it is the correct element for AT to land on.
   */
  public focus(options?: FocusOptions): void {
    super.focus(options);
  }

  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------

  /**
   * Enter / Space on the focused host activate the tab.
   * Arrow-key navigation is handled one level up by `<nys-tabgroup>`.
   */
  private _onKeydown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    this._handleClick();
  };

  /**
   * Host focus → dispatch `nys-tab-focus` for external observers.
   */
  private _onFocus = (): void => {
    this.dispatchEvent(
      new CustomEvent("nys-tab-focus", {
        bubbles: true,
        composed: true,
        detail: { id: this.id },
      }),
    );
  };

  /**
   * Host blur → dispatch `nys-tab-blur` for external observers.
   */
  private _onBlur = (): void => {
    this.dispatchEvent(
      new CustomEvent("nys-tab-blur", {
        bubbles: true,
        composed: true,
        detail: { id: this.id },
      }),
    );
  };

  /**
   * Host-level click handler. Activates the tab regardless of whether the
   * click landed on the inner element (normal pointer/keyboard tap, which
   * bubbles up) or directly on the host (iOS VoiceOver double-tap dispatches
   * `click` on the element with `role="tab"`, bypassing shadow-DOM children).
   */
  private _onClick = (): void => {
    this._handleClick();
  };

  /**
   * Focuses the host then dispatches `nys-tab-select`. Called from both the
   * click handler and the keydown handler.
   */
  private _handleClick(): void {
    if (this.disabled) return;
    this.focus();
    this.dispatchEvent(
      new CustomEvent("nys-tab-select", {
        bubbles: true,
        composed: true,
        detail: { id: this.id, label: this.label },
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  render() {
    // Inner element is a non-interactive `<span>` (not `<button>`) so that
    // axe-core's `nested-interactive` rule does not fire — the host already
    // carries `role="tab"` + `tabindex` and is the interactive control.
    // Disabled gating, click activation, and keyboard activation all happen
    // on the host; the span is purely a styling/labeling target.
    return html`<span class="nys-tab">${this.label}</span>`;
  }
}

if (!customElements.get("nys-tab")) {
  customElements.define("nys-tab", NysTab);
}

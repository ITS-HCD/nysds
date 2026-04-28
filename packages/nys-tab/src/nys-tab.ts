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
   * Visible text label rendered inside the inner `<button>`.
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
   * for keydown, focus, and blur so that interaction events work correctly
   * when the host — not the inner button — is the focused element.
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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this._onKeydown);
    this.removeEventListener("focus", this._onFocus);
    this.removeEventListener("blur", this._onBlur);
  }

  /**
   * Keeps `aria-disabled` on the host in sync with the `disabled` property so
   * AT can perceive disabled state even though `disabled` is on the inner
   * `<button>` inside the shadow DOM.
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
   * Click on the inner button. Focuses the host (so AT sees the tab as
   * focused) then dispatches `nys-tab-select`.
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
    return html`
      <button
        class="nys-tab"
        type="button"
        tabindex="-1"
        ?disabled=${this.disabled}
        @mousedown=${(e: MouseEvent) => e.preventDefault()}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `;
  }
}

if (!customElements.get("nys-tab")) {
  customElements.define("nys-tab", NysTab);
}

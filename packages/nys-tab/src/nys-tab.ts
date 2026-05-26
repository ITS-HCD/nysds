import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-tab.scss?inline";

/** @internal Monotonically increasing counter used to generate unique element IDs.  *
 * ## Dependencies
 *
 * This component depends on the following NYS Design System components:
 *
 *   - `nys-button`
 */
let componentIdCounter = 0;

/**
 * A single tab within a `<nys-tabgroup>` container. Each tab has a label and is associated with a panel via `<nys-tabpanel>`.
 * The host element carries `role="tab"`, `tabindex`, `aria-selected`, `aria-controls`, and `aria-disabled`
 * so assistive technologies see the correct ARIA tab semantics on the element that is actually focused.
 * `<nys-tabgroup>` manages tab selection, focus, and keyboard navigation; do not set these attributes directly.
 *
 * ## When to use
 * - Organize related content into logical sections/views.
 * - Allow users to switch between views without navigating away from the page.
 * - Use for tabbed interfaces with 2-6 logical categories (more tabs may overwhelm users).
 * - Each tab should represent a distinct topic or context, not steps in a workflow (use Stepper for that).
 * - Always wrap tabs in a `<nys-tabgroup>` container; do not use tabs standalone.
 *
 * ## Variants
 * - **Default tab**: Label is visible; not selected, not disabled.
 * - **Selected tab**: Set `selected` to mark the active tab (usually the first tab by default).
 * - **Disabled tab**: Set `disabled` to prevent selection; the tab is hidden from keyboard and mouse interaction.
 * - **Tab with long label**: Labels should be concise (1-3 words); long labels wrap to multiple lines.
 *
 * ## Accessibility
 * - Host element is the interactive control; receives `role="tab"` and `tabindex`.
 * - `aria-selected` indicates the currently active tab.
 * - `aria-controls` links the tab to its corresponding panel.
 * - `aria-disabled` reflects the disabled state.
 * - Keyboard support managed by `<nys-tabgroup>`: Arrow Left/Right to navigate, Home/End to jump to first/last.
 * - Enter/Space activates a tab; focus does not activate it (manual, not automatic activation).
 * - Screen readers announce the tab's label, selected state, and position in the tab list.
 *
 * ## Content Guidelines
 * - Keep tab labels short and descriptive (e.g., "Overview", "Details", "Reviews").
 * - Use sentence case or title case consistently.
 * - Avoid special characters or very long labels.
 * - Ensure each tab represents distinct content or functionality.
 *
 * @element nys-tab
 *
 * @fires nys-tab-select - Fired when the tab is activated via click or Enter / Space.
 *   Bubbles and crosses shadow DOM boundaries. Detail: `{ id: string, label: string }`
 * @fires nys-tab-focus - Fired when the tab receives keyboard focus (does not activate the tab).
 *   Bubbles and crosses shadow DOM boundaries. Detail: `{ id: string }`
 * @fires nys-tab-blur - Fired when the tab loses keyboard focus.
 *   Bubbles and crosses shadow DOM boundaries. Detail: `{ id: string }`
 *
 * @slot - No slots; content is derived from the `label` property.
 *
 * @example Basic tab group (always use with nys-tabgroup)
 * ```html
 * <nys-tabgroup name="My Tabs">
 *   <nys-tab label="Overview"></nys-tab>
 *   <nys-tab label="Details" selected></nys-tab>
 *   <nys-tab label="Archived" disabled></nys-tab>
 *   <nys-tabpanel><p>Overview content</p></nys-tabpanel>
 *   <nys-tabpanel><p>Details content (shown by default)</p></nys-tabpanel>
 *   <nys-tabpanel><p>Archived content</p></nys-tabpanel>
 * </nys-tabgroup>
 * ```
 *
 * @example Listen for tab selection
 * ```javascript
 * const tabgroup = document.querySelector('nys-tabgroup');
 * tabgroup.addEventListener('nys-tab-select', (event) => {
 *   console.log('Tab selected:', event.detail.id, event.detail.label);
 * });
 * ```
 *
 * @example Listen for focus changes
 * ```javascript
 * const tabgroup = document.querySelector('nys-tabgroup');
 * tabgroup.addEventListener('nys-tab-focus', (event) => {
 *   console.log('Tab focused:', event.detail.id);
 * });
 * ```
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

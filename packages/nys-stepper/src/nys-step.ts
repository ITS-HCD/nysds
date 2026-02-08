import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-stepper.scss?inline";

/**
 * A single step within `nys-stepper`. Represents one stage in a multi-step process.
 *
 * Mark as `current` to indicate active progress point. Previous steps become clickable for navigation.
 * Set `href` for page-based navigation or listen to `nys-step-click` for SPA routing.
 *
 * ## Step States
 *
 * Understanding the three step states is critical for proper stepper usage:
 *
 * - **`selected`** - Which step is currently being displayed/viewed. This controls which step's
 *   content is shown. Defaults to `current` if not set. Cannot be set on a step after `current`.
 *   Users can click previous steps to change `selected` without changing `current`.
 *
 * - **`current`** - The furthest step the user has reached. This is the progress boundary.
 *   Update this as the user completes steps and advances. Steps after `current` are not navigable.
 *   Only one step should have `current` at a time.
 *
 * - **`previous`** - Auto-applied by the stepper to all steps before `current`. Do not set manually.
 *   Steps with `previous` are clickable and allow the user to navigate back.
 *
 * ## Common Patterns
 *
 * **Initial state:** Set `current` on the first step. `selected` will default to it.
 * ```html
 * <nys-step label="Step 1" current></nys-step>
 * <nys-step label="Step 2"></nys-step>
 * ```
 *
 * **User completed step 1, now on step 2:**
 * ```html
 * <nys-step label="Step 1"></nys-step>
 * <nys-step label="Step 2" current></nys-step>
 * ```
 *
 * **User went back to review step 1 (but progress is still at step 2):**
 * ```html
 * <nys-step label="Step 1" selected></nys-step>
 * <nys-step label="Step 2" current></nys-step>
 * ```
 *
 * @summary Individual step for use within nys-stepper with navigation support.
 * @element nys-step
 *
 * @fires nys-step-click - Fired when a navigable step is clicked. Detail: `{href, label}`. Cancelable.
 *
 * @example Step with navigation
 * ```html
 * <nys-step label="Personal Info" href="/step-1"></nys-step>
 * ```
 */
export class NysStep extends LitElement {
  static styles = unsafeCSS(styles);

  /** Whether this step is currently being viewed. Set by parent stepper. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Marks the furthest reached step. Steps before this are navigable. */
  @property({ type: Boolean, reflect: true }) current = false;

  /** Step label text displayed alongside the step number. */
  @property({ type: String }) label = "";

  /** URL for page navigation when step is clicked. Optional for SPA routing. */
  @property({ type: String }) href = "";

  /** Internal: Whether parent stepper's compact view is expanded. */
  @property({ type: Boolean }) isCompactExpanded = false;

  /** Custom click handler. Called before `nys-step-click` event. */
  @property({ attribute: false }) onClick?: (e: Event) => void;

  /** Step number (1-indexed). Auto-assigned by parent stepper. */
  @property({ type: Number }) stepNumber = 0;

  private _handleActivate(e: Event) {
    // Run user-supplied onClick first (if present)
    if (typeof this.onClick === "function") {
      this.onClick(e);
    }

    // Dispatch event as cancelable so user can prevent navigation
    const event = new CustomEvent("nys-step-click", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { href: this.href, label: this.label },
    });

    if ((this.hasAttribute("previous") || this.current) && !this.selected) {
      this.dispatchEvent(event);

      // Only navigate if event was not canceled
      if (!event.defaultPrevented && this.href) {
        window.location.href = this.href;
      }
    }
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._handleActivate(e);
    }
  }

  render() {
    return html`
      <div class="nys-step">
        <div class="nys-step__linewrapper">
          <div class="nys-step__line"></div>
        </div>
        <div
          class="nys-step__contentwrapper"
          @click=${this._handleActivate}
          @keydown=${this._handleKeydown}
          ?disabled=${!(
            this.selected ||
            this.current ||
            this.hasAttribute("previous")
          )}
        >
          <div class="nys-step__number" tabindex="-1" aria-hidden="true">
            ${this.stepNumber}
          </div>
          <div class="nys-step__content" tabindex="-1" aria-hidden="true">
            <div
              class="nys-step__label"
              role="button"
              aria-label="${this.label} Step"
              tabindex=${!(
                this.selected ||
                this.current ||
                this.hasAttribute("previous")
              )
                ? "-1"
                : "0"}
              aria-hidden="true"
            >
              ${this.label}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-step")) {
  customElements.define("nys-step", NysStep);
}

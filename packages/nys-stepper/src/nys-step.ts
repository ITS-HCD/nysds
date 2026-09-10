import { html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { NysElement } from "@nysds/internals";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-stepper.scss?inline";

/**
 * A single step within `nys-stepper`. Represents one stage in a multi-step process.
 *
 * Mark as `current` to indicate the active progress point. Previous steps become clickable for navigation.
 * Set `href` for page-based navigation, or omit it and listen to `nys-step-click` for SPA/framework routing.
 *
 * ## Step states
 *
 * Three boolean attributes control step appearance and behavior:
 *
 * - **`current`** — The furthest step the user has reached (the progress boundary). Only one step should
 *   have `current` at a time; if multiple are set the parent stepper keeps the first and removes the rest.
 *   Steps after `current` are not navigable and do not fire `nys-step-click`. Update `current` in your
 *   application state when the user advances.
 *
 * - **`selected`** — Which step's content is currently displayed. Defaults to the `current` step if not
 *   explicitly set. If `selected` is placed on a step after `current`, the stepper silently corrects it
 *   to match `current`. When managing state from a framework, always set `selected` explicitly — without
 *   it the stepper's fallback will reset in-sidebar navigation on every state update.
 *
 * - **`previous`** — Auto-applied by the parent stepper to every step before `current`. Do not set this
 *   manually. Steps with `previous` are clickable and fire `nys-step-click`.
 *
 * ## `nys-step-click` firing conditions
 *
 * The event fires only when ALL of the following are true:
 * 1. The step has `previous` or `current` (i.e. it is navigable).
 * 2. The step does NOT already have `selected` (clicking the already-viewed step is a no-op).
 *
 * Steps that are neither `previous` nor `current` (future steps) never fire the event.
 *
 * ## `href` and navigation
 *
 * If `href` is set, the stepper calls `window.location.href = href` after dispatching `nys-step-click`
 * — but only if the event was **not canceled**. To handle navigation yourself (SPA routing, fetch, etc.),
 * always call `e.preventDefault()` in your listener. Omitting `href` entirely is simpler for SPAs.
 *
 * ## `onClick` vs `nys-step-click`
 *
 * The `onClick` property (a function reference, not a DOM attribute) is called **before** the
 * `nys-step-click` event is dispatched. Use it for imperative pre-navigation logic. In React, pass it
 * as the `onClick` prop on `NysStep`.
 *
 * ## Accessibility
 * - The host carries `role="listitem"` so the parent stepper's `<ol>` and its slotted
 *   `<nys-step>` children form a real list — assistive technology announces each step's
 *   position and count (e.g. "2 of 4") automatically.
 * - Navigable steps (`current`, `previous`, `selected`) render a real `<button>` for their
 *   row, giving native keyboard activation (Enter/Space), focus handling, and semantics for
 *   free — no manual `tabindex`/`keydown` scaffolding required.
 * - Future (non-navigable) steps render the row as a plain, non-interactive `<div>` — not a
 *   disabled button. They are not focusable and carry no `role`, `tabindex`, or `aria-disabled`.
 * - `aria-label` announces the step name and 1-indexed position, e.g. `"Personal Info, step 1"`.
 * - The `current` step (progress boundary) is marked with `aria-current="step"` on the
 *   `<button>` itself so assistive technology announces the user's current position.
 * - The visual step number is `aria-hidden` (its meaning is folded into the row's accessible name).
 *
 * ## Common patterns
 *
 * **Initial state:** Set `current` on the first step. `selected` defaults to it.
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
 * **User went back to review step 1 (progress still at step 2):**
 * ```html
 * <nys-step label="Step 1" selected></nys-step>
 * <nys-step label="Step 2" current></nys-step>
 * ```
 *
 * @summary Individual step for use within nys-stepper with navigation support.
 * @element nys-step
 *
 * @fires nys-step-click - Fired when a navigable (`previous` or `current`) non-selected step is clicked
 *   or activated by keyboard. Detail: `{ href: string, label: string }`. Cancelable — call
 *   `e.preventDefault()` to suppress `window.location.href` navigation.
 */
export class NysStep extends NysElement {
  static styles = unsafeCSS(styles);

  /**
   * Which step is currently being displayed. If not set, defaults to the `current` step.
   * Setting this on a step after `current` is silently corrected to match `current`.
   * When controlling state from a framework, always set this explicitly.
   */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** The furthest step the user has reached (progress boundary). Steps before this are navigable. */
  @property({ type: Boolean, reflect: true }) current = false;

  /** Step label text displayed alongside the step number. */
  @property({ type: String }) label = "";

  /**
   * URL navigated to when the step is activated, via `window.location.href`.
   * Navigation is suppressed if the `nys-step-click` listener calls `e.preventDefault()`.
   * Omit for SPA/framework routing and handle navigation in the event listener instead.
   */
  @property({ type: String }) href = "";

  /**
   * @internal Auto-applied by `nys-stepper` to every step that comes before `current`.
   * Marks the step as navigable and clickable. Do not set this manually — the parent stepper
   * adds and removes it on every render based on which step has `current`.
   */
  @property({ type: Boolean, reflect: true }) previous = false;

  /** @internal Propagated by the parent stepper. Do not set manually. */
  @property({ type: Boolean }) isCompactExpanded = false;

  /** Optional function called before `nys-step-click` is dispatched. Use for pre-navigation logic. */
  @property({ attribute: false }) onClick?: (e: Event) => void;

  /** @internal 1-indexed position. Auto-assigned by the parent stepper on first render. Do not set manually. */
  @property({ type: Number }) stepNumber = 0;

  /** A step is navigable (focusable + activatable) when it is the displayed,
   * current, or a previously-reached step. Future steps are inert. */
  private get _navigable(): boolean {
    return this.selected || this.current || this.hasAttribute("previous");
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Sets `role="listitem"` on the host so the parent stepper's `<ol>` (which
   * only ever slots `<nys-step>` elements, never real `<li>`s) still forms a
   * valid ARIA list. This is what lets assistive technology announce each
   * step's position and count. Uses a plain attribute (not ElementInternals)
   * so `getAttribute("role")` keeps working for existing consumers/tests,
   * matching the convention used by `<nys-tab>`.
   */
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "listitem");
  }

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

  render() {
    const navigable = this._navigable;
    const accessibleName = this.stepNumber
      ? `${this.label}, step ${this.stepNumber}`
      : `${this.label} Step`;

    const rowContent = html`
      <div class="nys-step__number" aria-hidden="true">${this.stepNumber}</div>
      <div class="nys-step__content">
        <div class="nys-step__label">${this.label}</div>
      </div>
    `;

    return html`
      <div class="nys-step">
        <div class="nys-step__linewrapper">
          <div class="nys-step__line"></div>
        </div>
        ${navigable
          ? html`
              <button
                type="button"
                class="nys-step__contentwrapper"
                @click=${this._handleActivate}
                aria-label=${accessibleName}
                aria-current=${ifDefined(this.current ? "step" : undefined)}
              >
                ${rowContent}
              </button>
            `
          : html`
              <div
                class="nys-step__contentwrapper"
                aria-label=${accessibleName}
              >
                ${rowContent}
              </div>
            `}
      </div>
    `;
  }
}

if (!customElements.get("nys-step")) {
  customElements.define("nys-step", NysStep);
}

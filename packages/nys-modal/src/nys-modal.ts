import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-modal.scss?inline";

let componentIdCounter = 0;

/**
 * An accessible modal dialog with focus trapping, keyboard navigation, scroll management, and optional dismiss button.
 *
 * **Status:** Stable | **WCAG:** 2.2 AA
 *
 * Set `open` to show the modal. Content goes in the default slot; action buttons (e.g., `nys-button`) in the `actions` slot.
 * Dismisses via close button (top right, unless `mandatory` is set) or Escape key (unless `mandatory` is set).
 * Focus returns to the triggering element when the modal closes. Background page scrolling is blocked while the modal is open.
 *
 * ## When to use
 * - Confirmations that require user acknowledgment (e.g., "Are you sure you want to delete this?")
 * - Inline forms (e.g., login, signup, feedback forms) that don't warrant a full page
 * - Alerts and notifications that need explicit user acknowledgment before continuing
 * - Displaying additional information or clarification without leaving the current page
 * - Critical decisions where the user must make an explicit choice before proceeding
 *
 * ## When to consider something else
 * - Content-heavy modals (> 1 screen of scrollable content) should generally be avoided; use a dedicated page or `nys-stepper` instead.
 * - For inline status messages (success, info, warning), use a `nys-alert` or banner placed on the page.
 * - Quick hints for form-related components (e.g., text inputs) use a `nys-tooltip`.
 * - Do not stack multiple modals; only one modal should be open at a time.
 *
 * ## Width variants
 * Control modal width with the `width` prop:
 * - `sm` (Small): 400px, for simple confirmations or short forms
 * - `md` (Medium): 600px, default, suitable for most modals
 * - `lg` (Large): 800px, for more complex content or wider forms
 *
 * ## Content structure
 * A modal has three main sections:
 * - **Header**: `heading` (required, displayed as `<h2>`) and optional `subheading` below it
 * - **Body**: Default slot for main content (text, paragraphs, forms, etc.)
 * - **Footer**: `actions` slot for action buttons
 *
 * By convention, place the secondary/cancel button first in the actions slot, followed by the primary/confirm button.
 *
 * ## Content guidelines
 * - Use clear, concise headings (required for accessibility).
 * - Keep modals short and focused; avoid overwhelming the user with too much content.
 * - Use the `mandatory` prop to disable the dismiss button when the user must make a critical decision or acknowledge essential information.
 * - Keep the `subheading` brief and use `<p>` tags within the modal body for longer information.
 * - Avoid overloading with long forms or dense text.
 * - Avoid showing trivial information in a modal.
 * - Avoid forcing a `mandatory` modal unnecessarily; only use when the action is truly critical.
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Use for actions that need confirmation.
 * - Keep content short and focused.
 * - Use the `mandatory` prop to disable the dismiss button when the user must make a critical decision.
 * - Keep the `subheading` short and use `<p>` tags within the modal for longer information.
 *
 * **Don't:**
 * - Overload with long forms or texts.
 * - Show trivial information.
 * - Stack multiple modals.
 * - Force a mandatory modal unnecessarily.
 *
 * ## Mandatory action modals
 * Set `mandatory="true"` to disable the dismiss button (close icon in header) and prevent closing via Escape key.
 * Users must take an action (click a button) to close the modal. Use sparingly for critical confirmations only.
 * You must provide action buttons in the `actions` slot when `mandatory` is true.
 *
 * ## Scrolling behavior
 * The modal grows with content. When content exceeds the available height:
 * - Header and footer remain fixed
 * - Only the body section scrolls
 * - Page scrolling is blocked while the modal is open to keep focus within the modal
 *
 * ## Accessibility
 * The `nys-modal` component includes the following accessibility-focused features:
 * - **Focus Trapping:** Trap focus inside the modal so keyboard users cannot tab to background content.
 * - **Focus Restoration:** Return focus to the triggering element when the modal closes.
 * - **Keyboard Navigation:** Support Escape key to close (unless `mandatory` is set). Tab and Shift+Tab navigate within the modal.
 * - **ARIA Dialog Role:** Announce the modal to screen readers using `role="dialog"` and `aria-modal="true"`.
 * - **ARIA Labeling:** `aria-labelledby` links to the heading; `aria-describedby` links to subheading and body content.
 * - **Background Scroll Prevention:** Prevent background scroll so users don't lose context when the modal is open.
 *
 * ## Dependencies
 *
 * This component depends on the following NYS Design System components:
 *
 *   - `nys-button`
 *
 * @summary Accessible modal dialog with focus trap, keyboard support, scroll lock, and mandatory action mode.
 * @element nys-modal
 *
 * @slot - Default slot for body content.
 * @slot actions - Action buttons displayed in footer. Buttons auto-resize on mobile.
 *
 * @fires nys-open - Fired when modal opens. Detail: `{id}`.
 * @fires nys-close - Fired when modal closes. Detail: `{id}`.
 *
 * @example Basic modal
 * ```html
 * <nys-modal id="confirm-modal" heading="Confirm action" open>
 *   <p>Are you sure you want to proceed?</p>
 *   <div slot="actions">
 *     <nys-button label="Cancel" variant="outline"></nys-button>
 *     <nys-button label="Confirm" variant="filled"></nys-button>
 *   </div>
 * </nys-modal>
 * ```
 *
 * @example Listen for open/close events
 * ```js
 * const modal = document.querySelector("nys-modal");
 * modal.addEventListener("nys-open", (event) => {
 *   console.log(`Modal ${event.detail.id} opened`);
 * });
 * modal.addEventListener("nys-close", (event) => {
 *   console.log(`Modal ${event.detail.id} closed`);
 * });
 * ```
 *
 * @example Mandatory action (no dismiss button)
 * ```html
 * <nys-modal heading="Important decision" mandatory open>
 *   <p>You must make a choice before continuing.</p>
 *   <div slot="actions">
 *     <nys-button label="Decline" variant="outline"></nys-button>
 *     <nys-button label="Accept" variant="filled"></nys-button>
 *   </div>
 * </nys-modal>
 * ```
 */

export class NysModal extends LitElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Modal heading text. Required for accessibility. */
  @property({ type: String }) heading = "";

  /** Secondary heading below the main heading. */
  @property({ type: String }) subheading = "";

  /** Controls modal visibility. Set to `true` to show. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Prevents dismissal via close button or Escape key. User must take an action. */
  @property({ type: Boolean, reflect: true }) mandatory = false;

  /**
   * Modal width: `sm` (400px), `md` (600px), or `lg` (800px).
   * @default "md"
   */
  @property({ type: String, reflect: true }) width: "sm" | "md" | "lg" = "md";

  private _actionButtonSlot: HTMLSlotElement | null = null; // cache action button slots (if given) so we can manipulate their widths for mobile vs desktop
  private _prevFocusedElement: HTMLElement | null = null;
  private _originalBodyOverflow: string | null = null;
  private _mobileMedia = window.matchMedia("(max-width: 480px)");

  // Track slot contents to control what HTML is rendered
  @state() private hasBodySlots = false;
  @state() private hasActionSlots = false;

  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-modal-${Date.now()}-${componentIdCounter++}`;
    }
    this._mobileMedia.addEventListener(
      "change",
      this._updateSlottedButtonWidth,
    );
    window.addEventListener("keydown", (e) => this._handleKeydown(e));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._restoreBodyScroll(); // make sure scroll is restored when modal is removed
    this._mobileMedia.removeEventListener(
      "change",
      this._updateSlottedButtonWidth,
    );
    window.removeEventListener("keydown", (e) => this._handleKeydown(e));
  }

  async updated(changeProps: Map<string, any>) {
    // Hide main body's scroll bar if modal is open/active
    if (changeProps.has("open")) {
      if (this.open) {
        this._hideBodyScroll();
        this._dispatchOpenEvent();
        await this.updateComplete;
        this._savePrevFocused();
        this._focusOnModal();
        this._updateDismissAria();
      } else {
        this._restorePrevFocused();
        this._restoreBodyScroll();
        this._dispatchCloseEvent();
        this._updateDismissAria();
      }
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _hideBodyScroll() {
    if (this._originalBodyOverflow === null) {
      this._originalBodyOverflow = document.body.style.overflow;
    }
    document.body.style.overflow = "hidden";
  }

  private _restoreBodyScroll() {
    if (this._originalBodyOverflow !== null) {
      document.body.style.overflow = this._originalBodyOverflow;
      this._originalBodyOverflow = null;
    }
  }

  private _savePrevFocused() {
    this._prevFocusedElement = document.activeElement as HTMLElement;
  }

  private _focusOnModal() {
    const modal = this.shadowRoot?.querySelector<HTMLElement>(".nys-modal");
    modal?.focus();
  }

  private async _restorePrevFocused() {
    const prev = this._prevFocusedElement;
    prev?.focus();

    this._prevFocusedElement = null;
  }

  // Check if the slot contains stuff (aka user add texts & action buttons), and render visibility accordingly
  private _handleBodySlotChange = async () => {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    if (!slot) return;
    this.hasBodySlots = slot
      .assignedNodes({ flatten: true })
      .some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim(),
      );
  };

  // Determines whether we hide the action buttons slot container based on if user put in action buttons
  private async _handleActionSlotChange() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>(
      'slot[name="actions"]',
    );
    if (!slot) return;
    this.hasActionSlots = slot
      .assignedNodes({ flatten: true })
      .some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim(),
      );

    // Cached the action button slot container so we can use it continuously for _updateSlottedButtonWidth() during screen resize
    this._actionButtonSlot = slot;
    // Update button widths immediately
    this._updateSlottedButtonWidth();
  }

  // Design has it that the slotted action buttons should be fullWidth and display:column direction for mobile view.
  // Therefore, we need to account for mobile size and screen resizes
  private _updateSlottedButtonWidth() {
    if (!this._actionButtonSlot) return; // use the cached variable
    const isMobile = this._mobileMedia.matches;

    this._actionButtonSlot.assignedElements().forEach((el) => {
      el.querySelectorAll("nys-button").forEach((btn) => {
        if (isMobile) {
          btn?.setAttribute("fullWidth", "");
        } else {
          btn?.removeAttribute("fullWidth");
        }
      });
    });
  }

  private _dispatchOpenEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-open", {
        detail: { id: this.id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _dispatchCloseEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-close", {
        detail: { id: this.id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _getAriaDescribedBy() {
    // Handling what aria-describedby needs to announce in VO based on if the subheading or slot contents exists
    const ariaDescriptions: string[] = [];
    if (this.subheading) {
      ariaDescriptions.push(`${this.id}-subheading`);
    }
    if (this.hasBodySlots) {
      ariaDescriptions.push(`${this.id}-desc`);
    }
    return ariaDescriptions.join(" ");
  }

  /**
   * This exist to prevent the VO for dismiss button from announcing itself between the heading & subheading/slot content.
   * We add the "Close this window" ariaLabel after the initial VO is done
   */
  private _updateDismissAria() {
    const dismissBtn = this.shadowRoot?.querySelector("nys-button");
    if (!dismissBtn) return;

    // Hide from VO initially
    dismissBtn.setAttribute("ariaLabel", " ");

    if (this.open) {
      // After focus is moved into modal, update label
      setTimeout(() => {
        dismissBtn.setAttribute("ariaLabel", "Close this window");
      }, 100);
    }
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private async _handleKeydown(e: KeyboardEvent) {
    if (!this.open) return;

    // Exit the modal for "escape" key
    if (e.key === "Escape" && !this.mandatory) {
      e.preventDefault();
      this._closeModal();
    }

    // Trap focus to be within the modal only
    if (e.key === "Tab") {
      const modal = this.shadowRoot?.querySelector(".nys-modal");
      if (!modal) return;

      // Gather all elements from slots + dismissible btn
      const knownFocusableElements =
        'a[href], area[href], button:not([disabled]), details, iframe, object, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contentEditable="true"], [tabindex]:not([tabindex^="-"])';
      const focusableElements: HTMLElement[] = [];
      const dismissBtn = modal.querySelector("nys-button") as HTMLElement;

      if (dismissBtn) {
        focusableElements.push(dismissBtn);
      }

      // Gather from slot elements to store the focusable elements in focusableElements for focus trapping
      const slotElements = Array.from(modal.querySelectorAll("slot"));
      for (const slot of slotElements) {
        const assigned = slot.assignedElements({ flatten: true });
        for (const el of assigned) {
          if (el instanceof HTMLElement && el.matches(knownFocusableElements)) {
            focusableElements.push(el);
          }
          // also account for the action slot container that has nys-buttons
          el.querySelectorAll<HTMLElement>("nys-button").forEach(
            (actionBtn) => {
              focusableElements.push(actionBtn);
            },
          );
        }
      }

      if (focusableElements.length > 0) {
        // Laying out the starting (i.e. dismiss btn) and ending elements for looping focus elements
        const firstFocusableEl = focusableElements[0];
        const lastFocusableEl = focusableElements[focusableElements.length - 1];
        let activeElement = document.activeElement as HTMLElement | null;
        let activeIndex = focusableElements.indexOf(
          activeElement as HTMLElement,
        );

        /**
         * Move focus backward when Shift+Tab is pressed.
         * Focus goes to the previous element in focusableElements.
         * If currently at the first element, wrap around to the last element and focus directly.
         */
        if (e.shiftKey) {
          e.preventDefault();

          let prevIndex = activeIndex - 1;
          if (prevIndex < 0) {
            prevIndex = focusableElements.length - 1; // wrap back to lastFocusableEl
          }

          const prevElement = focusableElements[prevIndex];
          prevElement.focus();
        } else {
          // Tab (go back to first focusable element if we're at last)
          if (activeElement === lastFocusableEl) {
            e.preventDefault();
            firstFocusableEl.focus();
          }
        }
      }
    }
  }

  private _closeModal() {
    this.open = false;
    this._dispatchCloseEvent();
  }

  render() {
    return this.open
      ? html`<div
          class="nys-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="${this.id}-heading"
          aria-describedby="${this._getAriaDescribedBy()}"
        >
          <div class="nys-modal" tabindex="-1">
            <div class="nys-modal_header">
              <div class="nys-modal_header-inner">
                <h2 id="${this.id}-heading">${this.heading}</h2>
                ${!this.mandatory
                  ? html`<nys-button
                      id="dismiss-modal"
                      circle
                      icon="close"
                      variant="ghost"
                      @nys-click=${this._closeModal}
                    ></nys-button>`
                  : ""}
              </div>
              ${this.subheading
                ? html`<p id="${this.id}-subheading">${this.subheading}</p>`
                : ""}
            </div>

            <div
              id="${this.id}-desc"
              class="nys-modal_body ${!this.hasBodySlots ? "hidden" : ""}"
            >
              <div class="nys-modal_body-inner">
                <slot @slotchange=${this._handleBodySlotChange}></slot>
              </div>
            </div>

            <div
              class="nys-modal_footer ${!this.hasActionSlots ? "hidden" : ""}"
            >
              <slot
                name="actions"
                @slotchange=${this._handleActionSlotChange}
              ></slot>
            </div>
          </div>
        </div>`
      : "";
  }
}

if (!customElements.get("nys-modal")) {
  customElements.define("nys-modal", NysModal);
}

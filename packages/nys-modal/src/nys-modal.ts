import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-modal.scss?inline";

let componentIdCounter = 0;

/**
 * An accessible modal dialog with focus trapping, keyboard navigation, and scroll management.
 *
 * Set `open` to show the modal. Content goes in the default slot; action buttons in the `actions` slot.
 * Dismisses via close button or Escape key unless `mandatory` is set. Focus returns to trigger on close.
 *
 * @summary Accessible modal dialog with focus trap, keyboard support, and action slots.
 * @element nys-modal
 *
 * @slot - Default slot for body content.
 * @slot actions - Action buttons displayed in footer. Buttons auto-resize on mobile.
 *
 * @fires nys-open - Fired when modal opens. Detail: `{id}`.
 * @fires nys-close - Fired when modal closes. Detail: `{id}`.
 *
 * @example Basic
 * ```html
 * <nys-modal
 *   id="modal1"
 *   heading="Update Available"
 * >
 *   <p>
 *     Would you like to install the latest version? Albany ipsum dolor sit
 *     Empire, Hudson consectetur Adirondack elit, sed do MetroCard tempor
 *     incididunt ut Capitol et Broadway magna Niagara. Ut enim ad Erie
 *     veniam, quis nostrud Catskill ullamco Bronx nisi ut LongIsland ex ea
 *     Cuomo consequat.
 *   </p>
 * </nys-modal>
 * ```
 *
 * @render Basic
 * ```html
 * <div id="modal-wrapper1">
 *   <nys-button label="Open Modal" onclick="document.querySelector('.modal1').open = true; document.getElementById('modal-wrapper1').style.padding = '100px 0'"></nys-button>
 *   <nys-modal
 *     class="modal1"
 *     id="modal1"
 *     heading="Update Available"
 *   >
 *     <p>
 *       Would you like to install the latest version? Albany ipsum dolor sit
 *       Empire, Hudson consectetur Adirondack elit, sed do MetroCard tempor
 *       incididunt ut Capitol et Broadway magna Niagara. Ut enim ad Erie
 *       veniam, quis nostrud Catskill ullamco Bronx nisi ut LongIsland ex ea
 *       Cuomo consequat.
 *     </p>
 *   </nys-modal>
 * </div>
 * ```
 *

 * @example Subheading
 * ```html
 * <nys-modal
 *   id="modal-subheading"
 *   heading="Before you continue"
 *   subheading="Your progress has been saved automatically."
 * >
 *   <p>You can safely leave this page and return later to pick up where you left off.</p>
 * </nys-modal>
 * ```
 *
 * @render Subheading
 * ```html
 * <div id="modal-wrapper-subheading">
 *   <nys-button label="Open Modal" onclick="document.querySelector('.modal-subheading').open = true; document.getElementById('modal-wrapper-subheading').style.padding = '100px 0'"></nys-button>
 *   <nys-modal
 *     class="modal-subheading"
 *     id="modal-subheading"
 *     heading="Before you continue"
 *     subheading="Your progress has been saved automatically."
 *   >
 *     <p>You can safely leave this page and return later to pick up where you left off.</p>
 *   </nys-modal>
 * </div>
 * ```
 *
 * @example Actions Slot
 * ```html
 * <nys-modal id="modal3" heading="Update password?">
 *   <p>
 *     Would you like to install the latest version? Albany ipsum dolor sit
 *     Empire, Hudson consectetur Adirondack elit, sed do MetroCard tempor
 *     incididunt ut Capitol et Broadway magna Niagara. Ut enim ad Erie
 *     veniam, quis nostrud Catskill ullamco Bronx nisi ut LongIsland ex ea
 *     Cuomo consequat.
 *   </p>
 *   <div slot="actions">
 *     <nys-button label="Not now" variant="outline"></nys-button>
 *     <nys-button label="Update"></nys-button>
 *   </div>
 * </nys-modal>
 * ```
 *
 * @render Actions Slot
 * ```html
 * <div id="modal-wrapper3">
 *   <nys-button label="Open Modal" onclick="document.querySelector('.modal3').open = true; document.getElementById('modal-wrapper3').style.padding = '100px 0'"></nys-button>
 *   <nys-modal
 *     class="modal3"
 *     id="modal3"
 *     heading="Update password?"
 *   >
 *   <p>
 *     Would you like to install the latest version? Albany ipsum dolor sit
 *     Empire, Hudson consectetur Adirondack elit, sed do MetroCard tempor
 *     incididunt ut Capitol et Broadway magna Niagara. Ut enim ad Erie
 *     veniam, quis nostrud Catskill ullamco Bronx nisi ut LongIsland ex ea
 *     Cuomo consequat.
 *   </p>
 *     <div slot="actions">
 *       <nys-button label="Not now" variant="outline" onclick="document.querySelector('.modal3').open = false; document.getElementById('modal-wrapper3').style.padding = '0'"></nys-button>
 *       <nys-button label="Update" onclick="alert('Mock Alert: Changes saved!'); document.querySelector('.modal3').open = false; document.getElementById('modal-wrapper3').style.padding = '0'"></nys-button>
 *     </div>
 *   </nys-modal>
 * </div>
 * ```
 *
 * @example Mandatory Action
 * ```html
 * <nys-modal
 *   id="modal4"
 *   heading="There is no way to X out of here"
 *   subheading="Don't use this prop unless you add in the actions slot so the user does not get stuck in here."
 *   mandatory
 * >
 *   <div slot="actions">
 *     <nys-button label="Get me out"></nys-button>
 *   </div>
 * </nys-modal>
 * ```
 *
 * @render Mandatory Action
 * ```html
 * <div id="modal-wrapper4">
 *   <nys-button label="Open Modal" onclick="document.querySelector('.modal4').open = true; document.getElementById('modal-wrapper4').style.padding = '100px 0'"></nys-button>
 *   <nys-modal
 *     class="modal4"
 *     id="modal4"
 *     heading="There is no way to X out of here"
 *     subheading="Don't use this prop unless you add in the actions slot so the user does not get stuck in here."
 *     mandatory
 *   >
 *     <div slot="actions">
 *       <nys-button label="Get me out" onclick="alert('Ok, ok. You can go now.'); document.querySelector('.modal4').open = false; document.getElementById('modal-wrapper4').style.padding = '0'"></nys-button>
 *     </div>
 *   </nys-modal>
 * </div>
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

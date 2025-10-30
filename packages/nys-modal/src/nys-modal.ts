import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-modal.styles";

let componentIdCounter = 0; // Counter for generating unique IDs

export class NysModal extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) heading = "";
  @property({ type: String }) subheading = "";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) mandatory = false;

  private static readonly VALID_WIDTHS = ["sm", "md", "lg"] as const;
  private _width: (typeof NysModal.VALID_WIDTHS)[number] = "md";
  @property({ reflect: true })
  get width(): (typeof NysModal.VALID_WIDTHS)[number] {
    return this._width;
  }
  set width(value: string) {
    this._width = NysModal.VALID_WIDTHS.includes(
      value as (typeof NysModal.VALID_WIDTHS)[number],
    )
      ? (value as (typeof NysModal.VALID_WIDTHS)[number])
      : "md";
  }

  private _actionButtonSlot: HTMLSlotElement | null = null; // cache action button slots (if given) so we can manipulate their widths for mobile vs desktop
  private _prevFocusedElement: HTMLElement | null = null;
  private _originalBodyOverflow: string | null = null;

  // Track slot contents to control what HTML is rendered
  @state() private hasBodySlots = false;
  @state() private hasActionSlots = false;

  static styles = styles;

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-{{componentName}}-${Date.now()}-${componentIdCounter++}`;
    }
    window.addEventListener("resize", () => this._updateSlottedButtonWidth());
    window.addEventListener("keydown", (e) => this._handleKeydown(e));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._restoreBodyScroll(); // make sure scroll is restored when modal is removed
    window.removeEventListener("keydown", (e) => this._handleKeydown(e));
  }

  firstUpdated() {
    this._handleBodySlotChange();
    this._handleActionSlotChange();

    const closeTrustBtn = this.shadowRoot?.getElementById("dismiss-modal");
    if (closeTrustBtn) {
      closeTrustBtn.addEventListener("nys-click", () => {
        this._closeModal();
      });
    }
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

  /******************** Functions ********************/
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

    if (prev && prev.tagName.toLowerCase() === "nys-button") {
      const innerBtn = await (prev as any).getButtonElement();
      if (innerBtn) {
        innerBtn.focus();
        return;
      }
    } else {
      this._prevFocusedElement?.focus();
    }
    this._prevFocusedElement = null;
  }

  // Check if the slot contains stuff (aka user add texts & action buttons), and render visibility accordingly
  private async _handleBodySlotChange() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    if (!slot) return;
    this.hasBodySlots = slot
      .assignedNodes({ flatten: true })
      .some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim(),
      );
  }

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
    const isMobile = window.innerWidth <= 480;

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

  /****************** Event Handlers ******************/
  private async _handleKeydown(e: KeyboardEvent) {
    if (!this.open) return;

    /** Exit the modal for "escape" key **/
    if (e.key === "Escape" && !this.mandatory) {
      e.preventDefault();
      this._closeModal();
    }

    /** Trap focus to be within the modal only **/
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

      // Gather from slot elements to store the focusable elements for trapping
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
        let active = document.activeElement as HTMLElement | null;
        let activeIndex = focusableElements.indexOf(active as HTMLElement);

        /**
         * Move focus backward when Shift+Tab is pressed.
         * Focus goes to the previous element in focusableElements.
         * If currently at the first element, wrap around to the last element.
         * For <nys-button>, focus the internal button. For other elements, focus directly.
         */
        if (e.shiftKey) {
          e.preventDefault();

          let prevIndex = activeIndex - 1;
          if (prevIndex < 0) {
            prevIndex = focusableElements.length - 1; // wrap back to lastFocusableEl
          }

          const prevElement = focusableElements[prevIndex];
          const isNysButton =
            focusableElements[prevIndex].tagName.toLowerCase() === "nys-button";

          if (isNysButton) {
            const innerBtn = await (prevElement as any).getButtonElement();
            innerBtn?.focus();
          } else {
            prevElement.focus();
          }
        } else {
          // Tab (go back to first focusable element if we're at last)
          if (active === lastFocusableEl) {
            e.preventDefault();
            if (firstFocusableEl.tagName.toLowerCase() === "nys-button") {
              const innerBtn = await (
                firstFocusableEl as any
              ).getButtonElement();
              innerBtn?.focus();
            } else {
              firstFocusableEl.focus();
            }
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
          id=${this.id}
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

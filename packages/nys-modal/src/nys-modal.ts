import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-modal.styles";

let componentIdCounter = 0; // Counter for generating unique IDs

export class NysModal extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) heading = "";
  @property({ type: String }) subheading = "";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) dismissible = true;

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
  }

  updated(changeProps: Map<string, any>) {
    // Hide main body's scroll bar if modal is open/active
    if (changeProps.has("open")) {
      document.body.style.overflow = this.open ? "hidden" : "";
      this._dispatchOpenEvent();
    }
  }

  private _restoreBodyScroll = () => {
    document.body.style.overflow = "";
  };

  /******************** Functions ********************/
  // Determines whether we hide the body slot container based on if user put in stuff in slots
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
    const isMobile = window.innerWidth <= 400;

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

  /****************** Event Handlers ******************/
  private _handleKeydown(e: KeyboardEvent) {
    if (!this.open) return;

    if (e.key === "Escape" && this.dismissible) {
      e.preventDefault();
      this._closeModal();
    }

    // trap user "tab" focus to be within the modal only
    if (e.key === "Tab") {
      const modal = this.shadowRoot?.querySelector(".nys-modal");

      if (modal) {
      }
    }
  }

  private _closeModal() {
    this.open = false;

    this.dispatchEvent(
      new CustomEvent("nys-close", {
        detail: { id: this.id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return this.open
      ? html`<div class="nys-modal-overlay">
          <div class="nys-modal" role="dialog" aria-modal="true" tabindex="-1">
            <div class="nys-modal_header">
              <div class="nys-modal_header-inner">
                <h2>${this.heading}</h2>
                <nys-button
                  circle
                  icon="close"
                  variant="ghost"
                  .onClick=${() => this._closeModal()}
                ></nys-button>
              </div>
              ${this.subheading ? html`<p>${this.subheading}</p>` : ""}
            </div>

            <div class="nys-modal_body ${!this.hasBodySlots ? "hidden" : ""}">
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

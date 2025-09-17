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

  // Track slot content state
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
  }

  firstUpdated() {
    this._handleBodySlotChange();
    this._handleActionSlotChange();
  }

  /******************** Functions ********************/
  private async _handleBodySlotChange() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    console.log("SLOT", slot);
    if (!slot) return;
    this.hasBodySlots = slot
      .assignedNodes({ flatten: true })
      .some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim(),
      );
  }

  private async _handleActionSlotChange() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>(
      'slot[name="actions"]',
    );
    console.log("SLOT2", slot);
    if (!slot) return;
    this.hasActionSlots = slot
      .assignedNodes({ flatten: true })
      .some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim(),
      );
  }

  /****************** Event Handlers ******************/
  // Placeholder for event handlers if needed

  render() {
    return html`<div class="nys-modal">
      <div class="nys-modal_header">
        <div class="nys-modal_header-inner">
          <h2>${this.heading}</h2>
          <nys-button circle icon="close" variant="ghost"></nys-button>
        </div>
        <p>${this.subheading}</p>
      </div>

      <div class="nys-modal_body ${!this.hasBodySlots ? "hidden" : ""}">
        <slot @slotchange=${this._handleBodySlotChange}></slot>
      </div>

      <div class="nys-modal_footer ${!this.hasActionSlots ? "hidden" : ""}">
        <slot name="actions" @slotchange=${this._handleActionSlotChange}></slot>
      </div>
    </div>`;
  }
}

if (!customElements.get("nys-modal")) {
  customElements.define("nys-modal", NysModal);
}

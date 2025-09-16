import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
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

  /******************** Functions ********************/
  // Placeholder for generic functions (component-specific)

  /****************** Event Handlers ******************/
  // Placeholder for event handlers if needed

  render() {
    return html`<div class="nys-modal">
      <div class="nys-modal_header">${this.heading}</div>
      <div class="nys-modal_body">
        <slot name=""></slot>
      </div>
      <div class="nys-modal_footer">
        <slot name="actions"></slot>
      </div>
    </div>`;
  }
}

if (!customElements.get("nys-modal")) {
  customElements.define("nys-modal", NysModal);
}

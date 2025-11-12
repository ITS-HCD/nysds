import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-accordion.styles";
import "./nys-accordionitem";

let accordionIdCounter = 0; // Counter for generating unique IDs

/**
 * The "nys-accordion" is the wrapper that groups individual accordion items within it.
 * The items within is called "nys-accordionitem"
 */
export class NysAccordion extends LitElement {
  @property({ type: String, reflect: true }) id = "";
  @property({ type: Boolean, reflect: true }) singleSelect = false;
  @property({ type: Boolean, reflect: true }) bordered = false;

  static styles = styles;

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    // Generate a unique ID if not provided
    if (!this.id) {
      this.id = this._generateUniqueId();
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("bordered")) {
      this._applyBordered();
    }
  }

  /******************** Functions ********************/
  private _generateUniqueId() {
    return `nys-accordionitem-${Date.now()}-${accordionIdCounter++}`;
  }

  private _getAccordions() {
    const slot = this.shadowRoot?.querySelector("slot");
    const assigned = slot?.assignedElements() || [];

    return assigned.filter(
      (el) => el.tagName.toLowerCase() === "nys-accordionitem",
    );
  }

  private _onAccordionToggle(event: CustomEvent) {
    if (!this.singleSelect) return;

    const accordionId = event.detail.id;
    const accordionIsExpanded = event.detail.expanded;

    // All accordions that don't match the selected accordion's id is unexpanded.
    // If id match, it is up to the individual accordion to handle the expand logic
    if (accordionIsExpanded) {
      this._getAccordions().forEach((accordion: any) => {
        if (accordion.id !== accordionId && accordion.expanded) {
          accordion.expanded = false;
        }
      });
    }
  }

  private _applyBordered() {
    this._getAccordions().forEach((accordion: any) => {
      accordion.bordered = this.bordered;
    });
  }

  render() {
    return html`<div
      class="nys-accordion"
      @nys-accordionitem-toggle=${this._onAccordionToggle}
    >
      <slot></slot>
    </div>`;
  }
}

if (!customElements.get("nys-accordion")) {
  customElements.define("nys-accordion", NysAccordion);
}

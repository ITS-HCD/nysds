import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import "./nys-accordionitem";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-accordion.scss?inline";

let accordionIdCounter = 0; // Counter for generating unique IDs

/**
 * `<nys-accordion>` groups one or more `<nys-accordionitem>` components.
 *
 * Responsibilities:
 * - Manages single-select behavior across accordion items
 * - Propagates shared visual state such as `bordered`
 * - Coordinates expand and collapse behavior between items
 */
export class NysAccordion extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: Boolean, reflect: true }) singleSelect = false;
  @property({ type: Boolean, reflect: true }) bordered = false;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

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

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _generateUniqueId() {
    return `nys-accordionitem-${Date.now()}-${accordionIdCounter++}`;
  }

  private _getAccordionItems() {
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
      this._getAccordionItems().forEach((accordion: any) => {
        if (accordion.id !== accordionId && accordion.expanded) {
          accordion.expanded = false;
        }
      });
    }
  }

  private _applyBordered() {
    this._getAccordionItems().forEach((accordion: any) => {
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

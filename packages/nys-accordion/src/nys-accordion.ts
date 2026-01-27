import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import "./nys-accordionitem";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-accordion.scss?inline";

let accordionIdCounter = 0;

/**
 * A container for grouping `nys-accordionitem` components with coordinated expand/collapse behavior.
 *
 * Place `nys-accordionitem` elements as children. Set `singleSelect` to allow only one item open at a time.
 * The `bordered` style propagates to all children automatically.
 *
 * @summary Container for accordion items with optional single-select and bordered styling.
 * @element nys-accordion
 *
 * @slot - Default slot for `nys-accordionitem` elements.
 *
 * @example Basic accordion
 * ```html
 * <nys-accordion>
 *   <nys-accordionitem heading="Section 1">Content for section 1</nys-accordionitem>
 *   <nys-accordionitem heading="Section 2">Content for section 2</nys-accordionitem>
 * </nys-accordion>
 * ```
 *
 * @example Single-select accordion
 * ```html
 * <nys-accordion singleSelect bordered>
 *   <nys-accordionitem heading="FAQ 1" expanded>Answer 1</nys-accordionitem>
 *   <nys-accordionitem heading="FAQ 2">Answer 2</nys-accordionitem>
 * </nys-accordion>
 * ```
 */

export class NysAccordion extends LitElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Only one item can be expanded at a time. Expanding one collapses others. */
  @property({ type: Boolean, reflect: true }) singleSelect = false;

  /** Adds borders around each accordion item. Propagates to all children. */
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

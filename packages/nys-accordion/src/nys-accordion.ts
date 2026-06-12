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
 * @cssprop [--nys-accordion-background-color--header] - Background color of the accordion header.
 * @cssprop [--nys-accordion-background-color--header--hover] - Background hover color of the accordion header.
 * @cssprop [--nys-accordion-content-max-width] - Maximum readable width of accordion content. Defaults to a character-based width (80ch) for readability.
 *
 * @example Basic
 * ```html
 * <nys-accordion>
 *   <nys-accordionitem id="accordionId1" heading="How do I renew my passport or apply for a new one?">
 *     <p>
 *       You can apply for or renew a U.S. passport through the U.S. Department
 *       of State. Some renewals can be done by mail.
 *     </p>
 *     <div style="display: flex; gap: 0.5rem; font-size: 1rem;">
 *      <a href="https://www.ny.gov" target="_blank">Check your registration</a>
 *      <a href="https://www.ny.gov" target="_blank">Fill out application</a>
 *    </div>
 *  </nys-accordionitem>
 *  <nys-accordionitem id="accordionId2" heading="How can I find out if I’m registered to vote?">
 *    <p>You can check your registration status, update your information, or find out how to register through the National Association of Secretaries of State.</p>
 *   </nys-accordionitem>
 * </nys-accordion>
 * ```
 *
 * @example Single Select
 * ```html
 * <nys-accordion singleSelect>
 *   <nys-accordionitem heading="FAQ 1">Answer 1</nys-accordionitem>
 *   <nys-accordionitem heading="FAQ 2">Answer 2</nys-accordionitem>
 * </nys-accordion>
 * ```
 *
 * @example Bordered
 * ```html
 *
 * <nys-accordion bordered>
 *  <nys-accordionitem heading="We are a group of accordions">
 *   <p>Stronger together! Learn more at
 *      <a href="https://www.ny.gov" target="_blank">ny.gov</a>
 *    </p>
 *  </nys-accordionitem>
 *   <nys-accordionitem heading="Liberty Ipsum: Bridges & Boroughs">
 *    <p>Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central Park, consectetur adipiscing elit.</p>
 *   </nys-accordionitem>
 *   <nys-accordionitem heading="Hudson Ipsum: Riverfront Stories">
 *     <p>From the banks of the Hudson to the peaks of the Adirondacks, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
 *   </nys-accordionitem>
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
    return `nys-accordion-${Date.now()}-${accordionIdCounter++}`;
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

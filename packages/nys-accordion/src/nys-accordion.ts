import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import "./nys-accordionitem";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-accordion.scss?inline";

let accordionIdCounter = 0;

/**
 * A container for grouping `nys-accordionitem` components with coordinated expand/collapse behavior.
 *
 * **Status:** Stable | **WCAG:** 2.2 AA
 *
 * Place `nys-accordionitem` elements as children. Set `singleSelect` to allow only one item open at a time.
 * The `bordered` style propagates to all children automatically. If an id is not passed, a unique id will be generated.
 *
 * ## When to use
 *
 * Use an accordion to organize related information into expandable sections, reducing the need for users to scroll through long content.
 * Ideal for supplemental details like optional steps, extra instructions, or secondary eligibility notes—similar to FAQs.
 * Helpful in mobile layouts to keep pages compact while still allowing access to full details.
 *
 * Do not hide essential, universal information such as critical deadlines, main eligibility criteria, or urgent alerts inside collapsed panels.
 * Keep these visible by default. If users need to compare details from multiple sections at once, consider using a table or side-by-side layout instead.
 *
 * ## Accessibility
 *
 * The `nys-accordionitem` component includes the following accessibility-focused features:
 * - Keyboard navigation (e.g. Tab to move between headers, Enter or Space to toggle)
 * - Headers are large enough to interact with easily (minimum 44x44px)
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Use accordions for FAQs on state services (e.g., DMV procedures, benefits information).
 * - Use to break up long descriptions into manageable sections without overwhelming users.
 * - Label headings clearly so users understand the content before expanding.
 *
 * **Don't:**
 * - Hide time-sensitive deadlines or required steps in collapsed sections.
 * - Use vague or unclear headings that obscure what is inside.
 * - Overuse accordions for content short enough to display fully on the page.
 *
 * ## Events
 *
 * The `nys-accordionitem` component emits the `nys-accordionitem-toggle` event when the accordion is clicked.
 * The event's `detail` object includes:
 * - id (string): The id of the accordion
 * - heading (string): The accordion's heading text
 * - expanded (boolean): true if the accordion is expanded, otherwise false
 *
 * ```js
 * const accordion = document.querySelector("nys-accordionitem");
 * accordion.addEventListener("nys-accordionitem-toggle", (event) => {
 *   console.log("Accordion toggled");
 *   console.log("Accordion details:", event.detail);
 * });
 * ```
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

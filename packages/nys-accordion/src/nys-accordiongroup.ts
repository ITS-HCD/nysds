import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-accordion.styles";

export class NysAccordionGroup extends LitElement {
  @property({ type: Boolean }) singleSelect = false;

  static styles = styles;

  /**************** Lifecycle Methods ****************/
  constructor() {
    super();
  }

  /******************** Functions ********************/
  private _getAccordions() {
    const slot = this.shadowRoot?.querySelector("slot");
    const assigned = slot?.assignedElements() || [];

    return assigned.filter(
      (el) => el.tagName.toLowerCase() === "nys-accordion",
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

  render() {
    return html`<div
      class="nys-accordiongroup"
      @nys-toggle=${this._onAccordionToggle}
    >
      <slot></slot>
    </div>`;
  }
}

if (!customElements.get("nys-accordiongroup")) {
  customElements.define("nys-accordiongroup", NysAccordionGroup);
}

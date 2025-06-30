import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { NysStep } from "./nys-step";
import styles from "./nys-stepper.styles";

export class NysStepper extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";

  static styles = styles;

  constructor() {
    super();
  }

  private _validateButtonSlot(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const assignedElements = slot.assignedElements();

    // Ensure exactly one direct node in the slot, and it must be a div
    if (
      assignedElements.length !== 1 ||
      assignedElements[0].tagName.toLowerCase() !== "div"
    ) {
      console.warn(
        "The 'actions' slot must have exactly one <div> as a direct child.",
      );
      return;
    }

    const div = assignedElements[0] as HTMLElement;

    // Iterate through its children and validate
    Array.from(div.children).forEach((child) => {
      const isNysButton =
        child instanceof HTMLElement &&
        child.tagName.toLowerCase() === "nys-button";

      if (!isNysButton) {
        console.warn(
          "The <div> inside 'actions' slot only accepts <nys-button> elements. Removing invalid node:",
          child,
        );
        child.remove();
      }
    });
  }

  render() {
    return html`
      <div class="nys-stepper">
        <slot name="actions" @slotchange=${this._validateButtonSlot}></slot>
      </div>
    `;
  }
}

if (!customElements.get("nys-stepper")) {
  customElements.define("nys-stepper", NysStepper);
}

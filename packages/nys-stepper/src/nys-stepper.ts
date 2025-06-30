import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-stepper.styles";

export class NysStepper extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) label = "";

  static styles = styles;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    // Defer step validation to next tick to ensure children are upgraded
    requestAnimationFrame(() => this._validateSteps());
  }

  private _validateSteps() {
    Array.from(this.children).forEach((child) => {
      const isStep =
        child instanceof HTMLElement &&
        child.tagName.toLowerCase() === "nys-step";
      const isSlotActionsContainer =
        child instanceof HTMLElement &&
        child.hasAttribute("slot") &&
        child.getAttribute("slot") === "actions";

      if (!isStep && !isSlotActionsContainer) {
        console.warn(
          "Only <nys-step> elements or the <div slot='actions'> container are allowed as direct children of <nys-stepper>. Removing:",
          child,
        );
        child.remove();
      }
    });
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

  updated() {
    const steps = this.querySelectorAll("nys-step");
    const hasCurrent = Array.from(steps).some((step) =>
      step.hasAttribute("current"),
    );
    let foundCurrent = false;

    steps.forEach((step, i) => {
      // Handle 'first' attribute
      if (i === 0) {
        step.setAttribute("first", "");
      } else {
        step.removeAttribute("first");
      }

      // Handle 'previous' attribute only if there's a current step
      if (hasCurrent) {
        if (step.hasAttribute("current")) {
          foundCurrent = true;
          step.removeAttribute("previous");
        } else if (!foundCurrent) {
          step.setAttribute("previous", "");
        } else {
          step.removeAttribute("previous");
        }
      } else {
        // No current -> ensure none have 'previous'
        step.removeAttribute("previous");
      }
    });
  }

  render() {
    return html`
      <div class="nys-stepper">
        <slot name="actions" @slotchange=${this._validateButtonSlot}></slot>
        ${this.label}
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get("nys-stepper")) {
  customElements.define("nys-stepper", NysStepper);
}

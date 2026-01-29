import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import "./nys-step";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-stepper.scss?inline";

let stepperIdCounter = 0;

/**
 * A multi-step progress indicator for forms or wizards. Manages `nys-step` children with selection and navigation.
 *
 * Add `nys-step` elements as children. Mark one step as `current` to indicate progress; previous steps become
 * navigable. Compact view on mobile expands to show all steps. Use `actions` slot for navigation buttons.
 *
 * @summary Multi-step progress indicator with navigation and mobile-friendly compact view.
 * @element nys-stepper
 *
 * @slot - Default slot for `nys-step` elements.
 * @slot actions - Navigation buttons (e.g., Back, Continue). Must be wrapped in a `<div>`.
 *
 * @example Basic stepper
 * ```html
 * <nys-stepper label="Application Progress">
 *   <nys-step label="Personal Info" current></nys-step>
 *   <nys-step label="Contact Details"></nys-step>
 *   <nys-step label="Review"></nys-step>
 * </nys-stepper>
 * ```
 */

export class NysStepper extends LitElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. */
  @property({ type: String, reflect: true }) id = "";

  /** Name attribute for form association. */
  @property({ type: String, reflect: true }) name = "";

  /** Title displayed above the step counter. */
  @property({ type: String }) label = "";

  /** Progress text (e.g., "Step 2 of 5"). Auto-updated based on selection. */
  @property({ type: String }) counterText = "initial";

  /** Whether compact mobile view is expanded to show all steps. */
  @property({ type: Boolean, reflect: true })
  isCompactExpanded = false;

  private _stepsNumbered = false;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("nys-step-click", this._onStepClick);
    // Defer step validation to next tick to ensure children are upgraded
    requestAnimationFrame(() => this._validateSteps());

    // Generate unique id if not provided
    if (!this.id) {
      this.id = `nys-stepper-${++stepperIdCounter}-${Date.now()}`;
    }
  }

  disconnectedCallback() {
    this.removeEventListener("nys-step-click", this._onStepClick);
    super.disconnectedCallback();
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

    // Iterate through all buttons and validate
    Array.from(div.children).forEach((button) => {
      const isNysButton =
        button instanceof HTMLElement &&
        button.tagName.toLowerCase() === "nys-button";

      if (!isNysButton) {
        console.warn(
          "The <div> inside 'actions' slot only accepts <nys-button> elements. Removing invalid node:",
          button,
        );
        button.remove();
      } else {
        // Ensure nys-button has correct styles
        button.setAttribute("size", "sm");
        if (button.hasAttribute("fullWidth")) {
          button.style.flex = "1 1 0";
        }
      }
    });
  }

  private _onStepClick = async (event: Event) => {
    const clickedStep = event
      .composedPath()
      .find(
        (el) =>
          el instanceof HTMLElement && el.tagName.toLowerCase() === "nys-step",
      ) as HTMLElement | undefined;

    if (!clickedStep) return;

    const steps = Array.from(this.querySelectorAll("nys-step"));
    const currentIndex = steps.findIndex((step) =>
      step.hasAttribute("current"),
    );
    const clickedIndex = steps.indexOf(clickedStep);

    // Can't select past current
    if (currentIndex !== -1 && clickedIndex > currentIndex) return;

    // Can't select already selected
    if (clickedStep.hasAttribute("selected")) return;

    // Remove selected from previous and move to new selected
    steps.forEach((step) => step.removeAttribute("selected"));
    clickedStep.setAttribute("selected", "");

    // Update counter immediately
    this._updateCounter();

    // Close expanded if it was open
    this.isCompactExpanded = false;
  };

  private _updateCounter() {
    let newCounterText: string;

    if (this.isCompactExpanded) {
      newCounterText = "Back to Form";
      this.style.height = "-webkit-fit-content";
      this.style.height = "-moz-fit-content";
      this.style.height = "fit-content";
    } else {
      this.style.height = "auto";

      const steps = this.querySelectorAll<HTMLElement>("nys-step");
      const selectedIndex = Array.from(steps).findIndex((step) =>
        step.hasAttribute("selected"),
      );
      const totalSteps = steps.length;

      newCounterText =
        selectedIndex >= 0
          ? `Step ${selectedIndex + 1} of ${totalSteps}`
          : `Step 1 of ${totalSteps}`;
    }

    if (newCounterText !== this.counterText) {
      this.counterText = newCounterText;
    }
  }

  willUpdate() {
    const steps = this.querySelectorAll<any>("nys-step");

    if (!this._stepsNumbered) {
      steps.forEach((step, index) => {
        step.stepNumber = index + 1;
      });
      this._stepsNumbered = true;
    }

    let foundCurrent = false;
    let selectedAssigned = false;
    let currentAssigned = false;

    steps.forEach((step, i) => {
      // Check if multiple "current" exist, respect the first instance
      if (step.hasAttribute("current")) {
        if (!currentAssigned) {
          currentAssigned = true;
        } else {
          step.removeAttribute("current");
        }
      }

      // Set first
      if (i === 0) {
        step.setAttribute("first", "");
      } else {
        step.removeAttribute("first");
      }

      // Set previous
      if (step.hasAttribute("current")) {
        foundCurrent = true;
        step.removeAttribute("previous");
      } else if (!foundCurrent) {
        step.setAttribute("previous", "");
      } else {
        step.removeAttribute("previous");
      }

      // Handle selected, respect first instance
      if (step.hasAttribute("selected")) {
        if (foundCurrent || selectedAssigned) {
          step.removeAttribute("selected");
        } else {
          selectedAssigned = true;
        }
      }

      // Handle compact expanded
      if (this.isCompactExpanded) {
        step.setAttribute("isCompactExpanded", "");
      } else {
        step.removeAttribute("isCompactExpanded");
      }
    });

    // Selected fallback
    if (!selectedAssigned) {
      if (currentAssigned) {
        steps.forEach((step) => {
          if (step.hasAttribute("current") && !selectedAssigned) {
            step.setAttribute("selected", "");
            selectedAssigned = true;
          }
        });
      } else if (steps.length > 0) {
        // If no current or selected, mark first as both current and selected
        steps[0].setAttribute("current", "");
        steps[0].setAttribute("selected", "");
      }
    }

    // Always update counter
    this._updateCounter();
  }

  private _toggleCompact() {
    this.isCompactExpanded = !this.isCompactExpanded;
  }

  private _handleCounterKeydown(event: KeyboardEvent) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this._toggleCompact();
    }
  }

  render() {
    return html`
      <div class="nys-stepper" name=${this.name}>
        <div class="nys-stepper__header">
          <slot name="actions" @slotchange=${this._validateButtonSlot}></slot>
          <div class="nys-stepper__headertext">
            <div class="nys-stepper__label">${this.label}</div>
            <div
              class="nys-stepper__counter"
              @click=${this._toggleCompact}
              @keydown=${this._handleCounterKeydown}
              role="button"
              tabindex="0"
              aria-label=${this.isCompactExpanded
                ? "Collapse step navigation to view the form"
                : `Expand step navigation. You are on ${this.counterText}`}
              aria-expanded=${this.isCompactExpanded ? "true" : "false"}
            >
              ${this.counterText}
            </div>
          </div>
        </div>
        <slot class="nys-stepper__steps"></slot>
      </div>
    `;
  }
}

if (!customElements.get("nys-stepper")) {
  customElements.define("nys-stepper", NysStepper);
}

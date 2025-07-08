import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-stepper.styles";

export class NysStepper extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) contentTarget = "";
  @property({ type: String }) counterText = "initial";
  @property({ type: Boolean, reflect: true })
  isCompactExpanded = false;

  static styles = styles;

  private hasLoadedInitialContent = false;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("nys-step-click", this._onStepClick);
    // Defer step validation to next tick to ensure children are upgraded
    requestAnimationFrame(() => this._validateSteps());
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
      } else {
        // Ensure nys-button has correct styles
        child.setAttribute("size", "sm");
        if (child.hasAttribute("fullWidth")) {
          child.style.flex = "1 1 0";
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

    // Update selected
    steps.forEach((step) => step.removeAttribute("selected"));
    clickedStep.setAttribute("selected", "");

    // Update counter immediately
    this._updateCounter();

    // Load content
    this._loadHref(clickedStep.getAttribute("href"));

    // Close expanded if it was open
    this.isCompactExpanded = false;
  };

  private _updateCounter() {
    const steps = this.querySelectorAll<HTMLElement>("nys-step");
    const selectedIndex = Array.from(steps).findIndex((step) =>
      step.hasAttribute("selected"),
    );
    const totalSteps = steps.length;

    this.counterText =
      selectedIndex >= 0
        ? `Step ${selectedIndex + 1} of ${totalSteps}`
        : `Step 1 of ${totalSteps}`;
  }

  updated() {
    const steps = this.querySelectorAll<HTMLElement>("nys-step");
    let foundCurrent = false;
    let selectedAssigned = false;
    let currentAssigned = false;

    // Pre-pass to normalize multiple `current` attributes
    steps.forEach((step) => {
      if (step.hasAttribute("current")) {
        if (!currentAssigned) {
          currentAssigned = true;
        } else {
          step.removeAttribute("current");
        }
      }

      step.style.setProperty("flex", "1 1 0");

      if (this.hasAttribute("isCompactExpanded")) {
        step.setAttribute("isCompactExpanded", "");
      } else {
        step.removeAttribute("isCompactExpanded");
      }
    });

    steps.forEach((step, i) => {
      if (i === 0) {
        step.setAttribute("first", "");
      } else {
        step.removeAttribute("first");
      }

      if (step.hasAttribute("current")) {
        foundCurrent = true;
        step.removeAttribute("previous");
      } else if (!foundCurrent) {
        step.setAttribute("previous", "");
      } else {
        step.removeAttribute("previous");
      }

      if (step.hasAttribute("selected")) {
        if (foundCurrent || selectedAssigned) {
          step.removeAttribute("selected");
        } else {
          selectedAssigned = true;
        }
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

    // Load content on first update
    if (!this.hasLoadedInitialContent) {
      this.hasLoadedInitialContent = true;
      const selected = Array.from(steps).find((step) =>
        step.hasAttribute("selected"),
      );
      if (selected) {
        this._loadHref(selected.getAttribute("href"));
      }
    }
  }

  private async _loadHref(href: string | null) {
    if (!href) return;

    let container: HTMLElement | null = null;

    // If developer specified a content target ID, use it
    if (this.contentTarget) {
      container = document.getElementById(this.contentTarget);
    }

    // Otherwise fallback to next sibling
    if (!container) {
      container = this.nextElementSibling as HTMLElement;
    }

    if (container) {
      try {
        const response = await fetch(href);
        container.innerHTML = await response.text();
      } catch (err) {
        console.error("Failed to load step content:", err);
      }
    } else {
      console.warn("No container found for loading step content.");
    }
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
      <div class="nys-stepper" id=${this.id} name=${this.name}>
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
            >
              ${this.counterText}
            </div>
          </div>
        </div>
        <div class="nys-stepper__steps"><slot></slot></div>
      </div>
    `;
  }
}

if (!customElements.get("nys-stepper")) {
  customElements.define("nys-stepper", NysStepper);
}

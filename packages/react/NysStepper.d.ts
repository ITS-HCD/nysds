import React from "react";
import { NysStepper as NysStepperElement } from "../../dist/nysds.es.js";

export type { NysStepperElement };

export interface NysStepperProps extends Pick<
  React.AllHTMLAttributes<HTMLElement>,
  | "children"
  | "dir"
  | "hidden"
  | "id"
  | "lang"
  | "slot"
  | "style"
  | "title"
  | "translate"
  | "onClick"
  | "onFocus"
  | "onBlur"
> {
  /** Whether compact mobile view is expanded to show all steps. */
  isCompactExpanded?: boolean;

  /** Unique identifier. */
  id?: NysStepperElement["id"];

  /** Name attribute for form association. */
  name?: NysStepperElement["name"];

  /** Title displayed above the step counter. */
  label?: NysStepperElement["label"];

  /** Progress text (e.g., "Step 2 of 5"). Auto-updated based on selection. */
  counterText?: NysStepperElement["counterText"];

  /** A space-separated list of the classes of the element. Classes allows CSS and JavaScript to select and access specific elements via the class selectors or functions like the method `Document.getElementsByClassName()`. */
  className?: string;

  /** Contains a space-separated list of the part names of the element that should be exposed on the host element. */
  exportparts?: string;

  /** Used for labels to link them with their inputs (using input id). */
  htmlFor?: string;

  /** Used to help React identify which items have changed, are added, or are removed within a list. */
  key?: number | string;

  /** Contains a space-separated list of the part names of the element. Part names allows CSS to select and style specific elements in a shadow tree via the ::part pseudo-element. */
  part?: string;

  /** A mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component. */
  ref?: any;

  /** Allows developers to make HTML elements focusable, allow or prevent them from being sequentially focusable (usually with the `Tab` key, hence the name) and determine their relative ordering for sequential focus navigation. */
  tabIndex?: number;
}

/**
 * Multi-step progress indicator with navigation and mobile-friendly compact view.
 * ---
 *
 *
 * ### **Slots:**
 *  - _default_ - Default slot for `nys-step` elements.
 * - **actions** - Navigation buttons (e.g., Back, Continue). Must be wrapped in a `<div>`.
 */
export const NysStepper: React.ForwardRefExoticComponent<NysStepperProps>;

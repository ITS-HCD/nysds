import React from "react";
import { NysStep as NysStepElement } from "../../dist/nysds.es.js";

export type { NysStepElement };

export interface NysStepProps extends Pick<
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
  /** Marks the furthest reached step. Steps before this are navigable. */
  current?: boolean;

  /** Internal: Whether parent stepper's compact view is expanded. */
  isCompactExpanded?: boolean;

  /** Whether this step is currently being viewed. Set by parent stepper. */
  selected?: boolean;

  /** URL for page navigation when step is clicked. Optional for SPA routing. */
  href?: NysStepElement["href"];

  /** Step label text displayed alongside the step number. */
  label?: NysStepElement["label"];

  /** Step number (1-indexed). Auto-assigned by parent stepper. */
  stepNumber?: NysStepElement["stepNumber"];

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

  /** Custom click handler. Called before `nys-step-click` event. */
  onClick?: NysStepElement["onClick"];

  /** Fired when a navigable step is clicked. Detail: `{href, label}`. Cancelable. */
  onNysStepClick?: (event: CustomEvent) => void;
}

/**
 * Individual step for use within nys-stepper with navigation support.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-step-click** - Fired when a navigable step is clicked. Detail: `{href, label}`. Cancelable.
 */
export const NysStep: React.ForwardRefExoticComponent<NysStepProps>;

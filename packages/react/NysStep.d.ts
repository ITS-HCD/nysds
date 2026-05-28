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
  /** Which step is currently being displayed. If not set, defaults to the `current` step.
Setting this on a step after `current` is silently corrected to match `current`.
When controlling state from a framework, always set this explicitly. */
  selected?: boolean;

  /** The furthest step the user has reached (progress boundary). Steps before this are navigable. */
  current?: boolean;

  /** Step label text displayed alongside the step number. */
  label?: NysStepElement["label"];

  /** URL navigated to when the step is activated, via `window.location.href`.
Navigation is suppressed if the `nys-step-click` listener calls `e.preventDefault()`.
Omit for SPA/framework routing and handle navigation in the event listener instead. */
  href?: NysStepElement["href"];

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

  /** Optional function called before `nys-step-click` is dispatched. Use for pre-navigation logic. */
  onClick?: NysStepElement["onClick"];

  /** Fired when a navigable (`previous` or `current`) non-selected step is clicked or activated by keyboard. Detail: `{ href: string, label: string }`. Cancelable — call `e.preventDefault()` to suppress `window.location.href` navigation. */
  onNysStepClick?: (event: CustomEvent) => void;
}

/**
 * Individual step for use within nys-stepper with navigation support.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-step-click** - Fired when a navigable (`previous` or `current`) non-selected step is clicked or activated by keyboard. Detail: `{ href: string, label: string }`. Cancelable — call `e.preventDefault()` to suppress `window.location.href` navigation.
 */
export const NysStep: React.ForwardRefExoticComponent<NysStepProps>;

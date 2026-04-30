import React from "react";
import {
  NysLabel as NysLabelElement,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysLabelElement, CustomEvent };

export interface NysLabelProps extends Pick<
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
  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;

  /** Helper text displayed below the label. */
  description?: NysLabelElement["description"];

  /** Flag type: `required` shows asterisk, `optional` shows "(Optional)". */
  flag?: NysLabelElement["flag"];

  /** The ID of the label. */
  id?: NysLabelElement["id"];

  /** Label text displayed above the form field. */
  label?: NysLabelElement["label"];

  /** Tooltip text shown on hover/focus of info icon next to label. */
  tooltip?: NysLabelElement["tooltip"];

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

  /** undefined */
  onNysLabelClick?: (event: CustomEvent) => void;
}

/**
 * Internal label component for form fields with flag and tooltip support.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-label-click**
 *
 * ### **Slots:**
 *  - **description** - Custom HTML description content below the label.
 */
export const NysLabel: React.ForwardRefExoticComponent<NysLabelProps>;

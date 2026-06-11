import React from "react";
import {
  NysVerticalnavGroup as NysVerticalnavGroupElement,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysVerticalnavGroupElement, CustomEvent };

export interface NysVerticalnavGroupProps extends Pick<
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
  /** undefined */
  expanded?: boolean;

  /** undefined */
  disabled?: boolean;

  /** undefined */
  active?: boolean;

  /** undefined */
  label?: NysVerticalnavGroupElement["label"];

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
  onNysChildResize?: (event: CustomEvent) => void;
}

/**
 * Collapsible link group for use within `<nys-verticalnav>`.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-child-resize**
 */
export const NysVerticalnavGroup: React.ForwardRefExoticComponent<NysVerticalnavGroupProps>;

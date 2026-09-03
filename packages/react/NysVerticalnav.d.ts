import React from "react";
import { NysVerticalnav as NysVerticalnavElement } from "@nysds/nys-verticalnav";

export type { NysVerticalnavElement };

export interface NysVerticalnavProps extends Pick<
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
  /** Hides the visible heading while keeping an accessible label for the navigation. */
  hideHeading?: boolean;

  /** Expands or collapses the navigation on mobile. */
  expanded?: boolean;

  /** ID for the navigation. Generated automatically if not provided. */
  id?: NysVerticalnavElement["id"];

  /** Heading text displayed at the top of the navigation. Defaults to "Page navigation". */
  heading?: NysVerticalnavElement["heading"];

  /** Heading level used for the navigation heading (`h1` through `h6`). */
  headingLevel?: NysVerticalnavElement["headingLevel"];

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
 * Responsive navigation that becomes an accordion on smaller screens.
 * ---
 *
 *
 * ### **Methods:**
 *  - **open()** - Public API for controlling the mobile accordion from outside the component
 * --------------------------------------------------------------------------
 */
export const NysVerticalnav: React.ForwardRefExoticComponent<NysVerticalnavProps>;

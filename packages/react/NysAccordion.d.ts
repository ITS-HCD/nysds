import React from "react";
import { NysAccordion as NysAccordionElement } from "../../dist/nysds.es.js";

export type { NysAccordionElement };

export interface NysAccordionProps extends Pick<
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
  /** Only one item can be expanded at a time. Expanding one collapses others. */
  singleSelect?: boolean;

  /** Adds borders around each accordion item. Propagates to all children. */
  bordered?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysAccordionElement["id"];

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
 * Container for accordion items with optional single-select and bordered styling.
 * ---
 *
 *
 * ### **Slots:**
 *  - _default_ - Default slot for `nys-accordionitem` elements.
 *
 * ### **CSS Properties:**
 *  - **--nys-accordion-background-color--header** - Background color of the accordion header. _(default: undefined)_
 * - **--nys-accordion-background-color--header--hover** - Background hover color of the accordion header. _(default: undefined)_
 * - **--nys-accordion-content-max-width** - Maximum readable width of accordion content. Defaults to a character-based width (80ch) for readability. _(default: undefined)_
 */
export const NysAccordion: React.ForwardRefExoticComponent<NysAccordionProps>;

import React from "react";
import { NysProcesslistitem as NysProcesslistitemElement } from "../../dist/nysds.es.js";

export type { NysProcesslistitemElement };

export interface NysProcesslistitemProps extends Pick<
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
  /** Step heading text. */
  label?: NysProcesslistitemElement["label"];

  /** Supporting information displayed below the label. Use the `description` slot for rich text. */
  description?: NysProcesslistitemElement["description"];

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

  /** A description is shown when either the property or the slot has content, so an item with
neither renders no empty paragraph. */
  _hasDescription?: NysProcesslistitemElement["_hasDescription"];
}

/**
 * A numbered step for use inside `<nys-processlist>`.
 * ---
 *
 *
 * ### **Slots:**
 *  - **description** - Custom HTML description content below the label. Overrides the `description` property.
 */
export const NysProcesslistitem: React.ForwardRefExoticComponent<NysProcesslistitemProps>;

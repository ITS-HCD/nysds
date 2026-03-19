import React from "react";
import { NysRadiogroup as NysRadiogroupElement } from "../../dist/nysds.es.js";

export type { NysRadiogroupElement };

export interface NysRadiogroupProps extends Pick<
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
  /** Requires a selection before form submission. */
  required?: boolean;

  /** Shows "Optional" flag. */
  optional?: boolean;

  /** Shows error message when true. */
  showError?: boolean;

  /** Renders all radiobuttons as tiles with larger clickable area. */
  tile?: boolean;

  /** Adjusts colors for dark backgrounds. Applied to all children. */
  inverted?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysRadiogroupElement["id"];

  /** Name for form submission. Auto-populated from child radiobuttons. */
  name?: NysRadiogroupElement["name"];

  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysRadiogroupElement["errorMessage"];

  /** Visible label text for the group. */
  label?: NysRadiogroupElement["label"];

  /** Helper text below label. Use slot for custom HTML. */
  description?: NysRadiogroupElement["description"];

  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysRadiogroupElement["tooltip"];

  /** Form `id` to associate with. Applied to all children. */
  form?: NysRadiogroupElement["form"];

  /** Radio size for all children: `sm` (24px) or `md` (32px, default). */
  size?: NysRadiogroupElement["size"];

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
 * Container for grouping radio buttons as a single form control.
 * ---
 *
 *
 * ### **Slots:**
 *  - _default_ - Default slot for `nys-radiobutton` elements.
 * - **description** - Custom HTML description content.
 */
export const NysRadiogroup: React.ForwardRefExoticComponent<NysRadiogroupProps>;

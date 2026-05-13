import React from "react";
import { NysCheckboxgroup as NysCheckboxgroupElement } from "../../dist/nysds.es.js";

export type { NysCheckboxgroupElement };

export interface NysCheckboxgroupProps extends Pick<
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
  /** Requires at least one checkbox to be checked. */
  required?: boolean;

  /** Shows "Optional" flag. */
  optional?: boolean;

  /** Shows error message when true. */
  showError?: boolean;

  /** Renders all checkboxes as tiles with larger clickable area. */
  tile?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysCheckboxgroupElement["id"];

  /** Name for form submission. Set on group, not individual checkboxes. */
  name?: NysCheckboxgroupElement["name"];

  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysCheckboxgroupElement["errorMessage"];

  /** Visible label text for the group. */
  label?: NysCheckboxgroupElement["label"];

  /** Helper text below label. Use slot for custom HTML. */
  description?: NysCheckboxgroupElement["description"];

  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysCheckboxgroupElement["tooltip"];

  /** Form `id` to associate with. Applied to all children. */
  form?: NysCheckboxgroupElement["form"];

  /** Checkbox size for all children: `sm` (24px) or `md` (32px, default). */
  size?: NysCheckboxgroupElement["size"];

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
 * Container for grouping checkboxes as a single form control.
 * ---
 *
 *
 * ### **Slots:**
 *  - _default_ - Default slot for `nys-checkbox` elements.
 * - **description** - Custom HTML description content.
 */
export const NysCheckboxgroup: React.ForwardRefExoticComponent<NysCheckboxgroupProps>;

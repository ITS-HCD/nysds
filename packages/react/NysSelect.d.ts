import React from "react";
import {
  NysSelect as NysSelectElement,
  Event,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysSelectElement, Event, CustomEvent };

export interface NysSelectProps extends Pick<
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
  /** Prevents interaction. */
  disabled?: boolean;

  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;

  /** Shows "Optional" flag. Use when most fields are required. */
  optional?: boolean;

  /** Marks as required. Shows "Required" flag and validates on blur. */
  required?: boolean;

  /** Shows error message when true. Set by validation or manually. */
  showError?: boolean;

  /** Helper text below label. Use slot for custom HTML. */
  description?: NysSelectElement["description"];

  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysSelectElement["errorMessage"];

  /** Form `id` to associate with when select is outside form element. */
  form?: NysSelectElement["form"];

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysSelectElement["id"];

  /** Visible label text. Required for accessibility. */
  label?: NysSelectElement["label"];

  /** Name for form submission. */
  name?: NysSelectElement["name"];

  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysSelectElement["tooltip"];

  /** Currently selected option value. */
  value?: NysSelectElement["value"];

  /** Select width: `sm` (88px), `md` (200px), `lg` (384px), `full` (100%, default). */
  width?: NysSelectElement["width"];

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

  /** Fired when select loses focus. Triggers validation. */
  onNysBlur?: (event: CustomEvent) => void;

  /** Fired when selection changes. Detail: `{id, value}`. */
  onNysChange?: (event: CustomEvent) => void;

  /** Fired when select gains focus. */
  onNysFocus?: (event: CustomEvent) => void;
}

/**
 * Dropdown select for choosing one option from a list.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-blur** - Fired when select loses focus. Triggers validation.
 * - **nys-change** - Fired when selection changes. Detail: `{id, value}`.
 * - **nys-focus** - Fired when select gains focus.
 *
 * ### **Methods:**
 *  - **checkValidity(): _boolean_** - Functions
 * --------------------------------------------------------------------------
 *
 * ### **Slots:**
 *  - _default_ - Default slot for `<option>` and `<optgroup>` elements.
 * - **description** - Custom HTML description content below the label.
 */
export const NysSelect: React.ForwardRefExoticComponent<NysSelectProps>;

import React from "react";
import {
  NysCombobox as NysComboboxElement,
  CustomEvent,
  Event,
} from "../../dist/nysds.es.js";

export type { NysComboboxElement, CustomEvent, Event };

export interface NysComboboxProps extends Pick<
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
  disabled?: boolean;

  /** undefined */
  required?: boolean;

  /** undefined */
  optional?: boolean;

  /** undefined */
  inverted?: boolean;

  /** undefined */
  showError?: boolean;

  /** undefined */
  id?: NysComboboxElement["id"];

  /** undefined */
  name?: NysComboboxElement["name"];

  /** undefined */
  label?: NysComboboxElement["label"];

  /** undefined */
  description?: NysComboboxElement["description"];

  /** undefined */
  value?: NysComboboxElement["value"];

  /** undefined */
  tooltip?: NysComboboxElement["tooltip"];

  /** undefined */
  form?: NysComboboxElement["form"];

  /** undefined */
  width?: NysComboboxElement["width"];

  /** undefined */
  errorMessage?: NysComboboxElement["errorMessage"];

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

  /** Fired while the user is typing. Detail: `{ id, value }`. */
  onNysInput?: (event: CustomEvent) => void;

  /** Fired when the input receives focus. */
  onNysFocus?: (event: CustomEvent) => void;

  /** Fired when the input loses focus. */
  onNysBlur?: (event: CustomEvent) => void;

  /** Fired when an option is selected. Detail: `{ id, value }`. */
  onNysChange?: (event: CustomEvent) => void;
}

/**
 * Filterable combo box with keyboard navigation and form validation.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-input** - Fired while the user is typing. Detail: `{ id, value }`.
 * - **nys-focus** - Fired when the input receives focus.
 * - **nys-blur** - Fired when the input loses focus.
 * - **nys-change** - Fired when an option is selected. Detail: `{ id, value }`.
 *
 * ### **Slots:**
 *  - **description** - Optional custom description content below the label.
 * - **default** - Options (`<option>`, `<optgroup>`) to populate the dropdown
 */
export const NysCombobox: React.ForwardRefExoticComponent<NysComboboxProps>;

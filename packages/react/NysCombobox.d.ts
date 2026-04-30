import React from "react";
import {
  NysCombobox as NysComboboxElement,
  Event,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysComboboxElement, Event, CustomEvent };

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
  inverted?: boolean;

  /** undefined */
  optional?: boolean;

  /** undefined */
  required?: boolean;

  /** undefined */
  showError?: boolean;

  /** undefined */
  description?: NysComboboxElement["description"];

  /** undefined */
  errorMessage?: NysComboboxElement["errorMessage"];

  /** undefined */
  form?: NysComboboxElement["form"];

  /** undefined */
  id?: NysComboboxElement["id"];

  /** undefined */
  label?: NysComboboxElement["label"];

  /** undefined */
  name?: NysComboboxElement["name"];

  /** undefined */
  tooltip?: NysComboboxElement["tooltip"];

  /** undefined */
  value?: NysComboboxElement["value"];

  /** undefined */
  width?: NysComboboxElement["width"];

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

  /** Fired when combobox loses focus. */
  onNysBlur?: (event: CustomEvent) => void;

  /** Fired when selection changes. Detail: `{ id, value }`. */
  onNysChange?: (event: CustomEvent) => void;

  /** Fired when combobox receives focus. */
  onNysFocus?: (event: CustomEvent) => void;

  /** Fired on input change. Detail: `{ id, value }`. */
  onNysInput?: (event: CustomEvent) => void;
}

/**
 * `<nys-combobox>` is a form-enabled combo box combining text input with a filterable dropdown.
 *
 * Features:
 * - Type to filter options
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Mouse and keyboard interaction
 * - Clears non-selected text on blur
 * - Clear button when value is selected
 * - Integrates with forms via ElementInternals
 * - Supports native <option> and <optgroup> elements
 * - Accessible per W3C ARIA Authoring Practices
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-blur** - Fired when combobox loses focus.
 * - **nys-change** - Fired when selection changes. Detail: `{ id, value }`.
 * - **nys-focus** - Fired when combobox receives focus.
 * - **nys-input** - Fired on input change. Detail: `{ id, value }`.
 *
 * ### **Slots:**
 *  - **default** - Options (<option>, <optgroup>) to populate the dropdown
 * - **description** - Optional custom description content below the label.
 */
export const NysCombobox: React.ForwardRefExoticComponent<NysComboboxProps>;

import React from "react";
import {
  NysCheckbox as NysCheckboxElement,
  CustomEvent,
  Event,
} from "../../dist/nysds.es.js";

export type { NysCheckboxElement, CustomEvent, Event };

export interface NysCheckboxProps extends Pick<
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
  /** Whether checkbox is checked. */
  checked?: boolean;

  /** Prevents interaction. */
  disabled?: boolean;

  /** Marks as required. Validates that checkbox is checked. */
  required?: boolean;

  /** Shows error message when true. */
  showError?: boolean;

  /** Internal: Set by parent checkboxgroup. Do not set manually. */
  groupExist?: boolean;

  /** Renders as tile with larger clickable area. Apply to group for consistency. */
  tile?: boolean;

  /** undefined */
  other?: boolean;

  /** undefined */
  showOtherError?: boolean;

  /** Visible label text. Required for accessibility. */
  label?: NysCheckboxElement["label"];

  /** Helper text below label. Use slot for custom HTML. */
  description?: NysCheckboxElement["description"];

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysCheckboxElement["id"];

  /** Name for form submission. Use same name for grouped checkboxes. */
  name?: NysCheckboxElement["name"];

  /** Value submitted when checked. */
  value?: NysCheckboxElement["value"];

  /** Form `id` to associate with when checkbox is outside form element. */
  form?: NysCheckboxElement["form"];

  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysCheckboxElement["errorMessage"];

  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysCheckboxElement["tooltip"];

  /** Checkbox size: `sm` (24px) or `md` (32px, default). */
  size?: NysCheckboxElement["size"];

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

  /** Fired when checked state changes. Detail: `{id, checked, name, value}`. */
  onNysChange?: (event: CustomEvent) => void;

  /** Fired when "other" text input value changes. Detail: `{id, name, value}`. */
  onNysOtherInput?: (event: CustomEvent) => void;

  /** Fired when checkbox gains focus. */
  onNysFocus?: (event: CustomEvent) => void;

  /** Fired when checkbox loses focus. */
  onNysBlur?: (event: CustomEvent) => void;

  /** undefined */
  onNysError?: (event: CustomEvent) => void;

  /** undefined */
  onNysErrorClear?: (event: CustomEvent) => void;
}

/**
 * Checkbox for binary choices or multi-select options.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-change** - Fired when checked state changes. Detail: `{id, checked, name, value}`.
 * - **nys-other-input** - Fired when "other" text input value changes. Detail: `{id, name, value}`.
 * - **nys-focus** - Fired when checkbox gains focus.
 * - **nys-blur** - Fired when checkbox loses focus.
 * - **nys-error**
 * - **nys-error-clear**
 *
 * ### **Methods:**
 *  - **checkValidity(): _boolean_** - Functions
 * --------------------------------------------------------------------------
 *
 * ### **Slots:**
 *  - **description** - Custom HTML description content.
 */
export const NysCheckbox: React.ForwardRefExoticComponent<NysCheckboxProps>;

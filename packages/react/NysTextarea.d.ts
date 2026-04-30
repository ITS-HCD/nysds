import React from "react";
import {
  NysTextarea as NysTextareaElement,
  Event,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysTextareaElement, Event, CustomEvent };

export interface NysTextareaProps extends Pick<
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

  /** Makes textarea read-only but focusable. */
  readonly?: boolean;

  /** Marks as required. Shows "Required" flag and validates on blur. */
  required?: boolean;

  /** Shows error message when true. Set by validation or manually. */
  showError?: boolean;

  /** Helper text below label. Use slot for custom HTML. */
  description?: NysTextareaElement["description"];

  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysTextareaElement["errorMessage"];

  /** Form `id` to associate with when textarea is outside form element. */
  form?: NysTextareaElement["form"];

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysTextareaElement["id"];

  /** Visible label text. Required for accessibility. */
  label?: NysTextareaElement["label"];

  /** Maximum character length. */
  maxlength?: NysTextareaElement["maxlength"];

  /** Name for form submission. */
  name?: NysTextareaElement["name"];

  /** Placeholder text. Don't use as label replacement. */
  placeholder?: NysTextareaElement["placeholder"];

  /** Resize behavior: `vertical` (default, user can resize height), `none` (fixed size). */
  resize?: NysTextareaElement["resize"];

  /** Visible height in lines. */
  rows?: NysTextareaElement["rows"];

  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysTextareaElement["tooltip"];

  /** Current textarea value. */
  value?: NysTextareaElement["value"];

  /** Textarea width: `sm` (88px), `md` (200px), `lg` (384px), `full` (100%, default). */
  width?: NysTextareaElement["width"];

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

  /** Fired when textarea loses focus. Triggers validation. */
  onNysBlur?: (event: CustomEvent) => void;

  /** Fired when textarea gains focus. */
  onNysFocus?: (event: CustomEvent) => void;

  /** Fired on input change. Detail: `{id, value}`. */
  onNysInput?: (event: CustomEvent) => void;

  /** Fired when user selects text. Detail: `{id, value}`. */
  onNysSelect?: (event: CustomEvent) => void;

  /** undefined */
  onNysSelectionchange?: (event: CustomEvent) => void;
}

/**
 * Multi-line text input for comments, descriptions, and feedback.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-blur** - Fired when textarea loses focus. Triggers validation.
 * - **nys-focus** - Fired when textarea gains focus.
 * - **nys-input** - Fired on input change. Detail: `{id, value}`.
 * - **nys-select** - Fired when user selects text. Detail: `{id, value}`.
 * - **nys-selectionchange**
 *
 * ### **Methods:**
 *  - **checkValidity(): _boolean_** - Functions
 * --------------------------------------------------------------------------
 *
 * ### **Slots:**
 *  - **description** - Custom HTML description content below the label.
 */
export const NysTextarea: React.ForwardRefExoticComponent<NysTextareaProps>;

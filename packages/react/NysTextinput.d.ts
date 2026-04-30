import React from "react";
import {
  NysTextinput as NysTextinputElement,
  Event,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysTextinputElement, Event, CustomEvent };

export interface NysTextinputProps extends Pick<
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

  /** Makes input read-only but focusable. */
  readonly?: boolean;

  /** Marks as required. Shows "Required" flag and validates on blur. */
  required?: boolean;

  /** Shows error message when true. Set by validation or manually. */
  showError?: boolean;

  /** Accessible label. When set, assuming "label" isn't provided for private special cases (i.e., <checkbox other>). */
  ariaLabel?: NysTextinputElement["ariaLabel"];

  /** Helper text below label. Use slot for custom HTML. */
  description?: NysTextinputElement["description"];

  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysTextinputElement["errorMessage"];

  /** Form `id` to associate with when input is outside form element. */
  form?: NysTextinputElement["form"];

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysTextinputElement["id"];

  /** Visible label text. Required for accessibility. */
  label?: NysTextinputElement["label"];

  /** Maximum value for `type="number"`. */
  max?: NysTextinputElement["max"];

  /** Maximum character length. */
  maxlength?: NysTextinputElement["maxlength"];

  /** Minimum value for `type="number"`. */
  min?: NysTextinputElement["min"];

  /** Name for form submission. */
  name?: NysTextinputElement["name"];

  /** Regex pattern for validation. Shows error on mismatch. */
  pattern?: NysTextinputElement["pattern"];

  /** Placeholder text. Don't use as label replacement. */
  placeholder?: NysTextinputElement["placeholder"];

  /** Step increment for `type="number"`. */
  step?: NysTextinputElement["step"];

  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysTextinputElement["tooltip"];

  /** Input type: `text` (default), `email`, `number`, `password`, `search`, `tel` (auto-masked), `url`. */
  type?: NysTextinputElement["type"];

  /** Current input value. */
  value?: NysTextinputElement["value"];

  /** Input width: `sm` (88px), `md` (200px), `lg` (384px), `full` (100%, default). */
  width?: NysTextinputElement["width"];

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

  /** Fired when input loses focus. Triggers validation. */
  onNysBlur?: (event: CustomEvent) => void;

  /** Fired when input gains focus. */
  onNysFocus?: (event: CustomEvent) => void;

  /** Fired on input change. Detail: `{id, value}`. */
  onNysInput?: (event: CustomEvent) => void;
}

/**
 * Text input for short single-line data with validation and masking support.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-blur** - Fired when input loses focus. Triggers validation.
 * - **nys-focus** - Fired when input gains focus.
 * - **nys-input** - Fired on input change. Detail: `{id, value}`.
 *
 * ### **Methods:**
 *  - **checkValidity(): _boolean_** - Functions
 * --------------------------------------------------------------------------
 *
 * ### **Slots:**
 *  - **description** - Custom HTML description content below the label.
 * - **endButton** - Button at input end. Use single `nys-button` only.
 * - **startButton** - Button at input start. Use single `nys-button` only.
 */
export const NysTextinput: React.ForwardRefExoticComponent<NysTextinputProps>;

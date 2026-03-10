import React from "react";
import {
  NysTextinput as NysTextinputElement,
  CustomEvent,
  Event,
} from "../../dist/nysds.es.js";

export type { NysTextinputElement, CustomEvent, Event };

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

  /** Makes input read-only but focusable. */
  readonly?: boolean;

  /** Marks as required. Shows "Required" flag and validates on blur. */
  required?: boolean;

  /** Shows "Optional" flag. Use when most fields are required. */
  optional?: boolean;

  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;

  /** Shows error message when true. Set by validation or manually. */
  showError?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysTextinputElement["id"];

  /** Name for form submission. */
  name?: NysTextinputElement["name"];

  /** Input type: `text` (default), `email`, `number`, `password`, `search`, `tel` (auto-masked), `url`. */
  type?: NysTextinputElement["type"];

  /** Visible label text. Required for accessibility. */
  label?: NysTextinputElement["label"];

  /** Helper text below label. Use slot for custom HTML. */
  description?: NysTextinputElement["description"];

  /** Placeholder text. Don't use as label replacement. */
  placeholder?: NysTextinputElement["placeholder"];

  /** Current input value. */
  value?: NysTextinputElement["value"];

  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysTextinputElement["tooltip"];

  /** Form `id` to associate with when input is outside form element. */
  form?: NysTextinputElement["form"];

  /** Regex pattern for validation. Shows error on mismatch. */
  pattern?: NysTextinputElement["pattern"];

  /** Maximum character length. */
  maxlength?: NysTextinputElement["maxlength"];

  /** Accessible label. When set, assuming "label" isn't provided for private special cases (i.e., <checkbox other>). */
  ariaLabel?: NysTextinputElement["ariaLabel"];

  /** Input width: `sm` (88px), `md` (200px), `lg` (384px), `full` (100%, default). */
  width?: NysTextinputElement["width"];

  /** Step increment for `type="number"`. */
  step?: NysTextinputElement["step"];

  /** Minimum value for `type="number"`. */
  min?: NysTextinputElement["min"];

  /** Maximum value for `type="number"`. */
  max?: NysTextinputElement["max"];

  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysTextinputElement["errorMessage"];

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

  /** Fired on input change. Detail: `{id, value}`. */
  onNysInput?: (event: CustomEvent) => void;

  /** Fired when input gains focus. */
  onNysFocus?: (event: CustomEvent) => void;

  /** Fired when input loses focus. Triggers validation. */
  onNysBlur?: (event: CustomEvent) => void;
}

/**
 * Text input for short single-line data with validation and masking support.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-input** - Fired on input change. Detail: `{id, value}`.
 * - **nys-focus** - Fired when input gains focus.
 * - **nys-blur** - Fired when input loses focus. Triggers validation.
 *
 * ### **Methods:**
 *  - **checkValidity(): _boolean_** - Functions
 * --------------------------------------------------------------------------
 *
 * ### **Slots:**
 *  - **description** - Custom HTML description content below the label.
 * - **startButton** - Button at input start. Use single `nys-button` only.
 * - **endButton** - Button at input end. Use single `nys-button` only.
 */
export const NysTextinput: React.ForwardRefExoticComponent<NysTextinputProps>;

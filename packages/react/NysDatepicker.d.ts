import React from "react";
import {
  NysDatepicker as NysDatepickerElement,
  Event,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysDatepickerElement, Event, CustomEvent };

export interface NysDatepickerProps extends Pick<
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
  /** Disable interaction. */
  disabled?: boolean;

  /** Hide the "Clear" button in calendar popup. */
  hideClearButton?: boolean;

  /** Hide the "Today" button in calendar popup. */
  hideTodayButton?: boolean;

  /** Dark background mode. */
  inverted?: boolean;

  /** Show "Optional" flag. Use when most fields are required. */
  optional?: boolean;

  /** Mark as required. Shows "Required" flag and validates on blur. */
  required?: boolean;

  /** Show error state. */
  showError?: boolean;

  /** Helper text below label. */
  description?: NysDatepickerElement["description"];

  /** Error message text. */
  errorMessage?: NysDatepickerElement["errorMessage"];

  /** Form `id` to associate with when input is outside form. */
  form?: NysDatepickerElement["form"];

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysDatepickerElement["id"];

  /** Label text. Required for accessibility. */
  label?: NysDatepickerElement["label"];

  /** The latest selectable date (YYYY-MM-DD). */
  maxDate?: NysDatepickerElement["maxDate"];

  /** The earliest selectable date (YYYY-MM-DD). */
  minDate?: NysDatepickerElement["minDate"];

  /** Name for form submission. */
  name?: NysDatepickerElement["name"];

  /** Initial date when calendar opens (YYYY-MM-DD). */
  startDate?: NysDatepickerElement["startDate"];

  /** Tooltip text on info icon hover. */
  tooltip?: NysDatepickerElement["tooltip"];

  /** Input type. Currently only supports `date`. */
  type?: NysDatepickerElement["type"];

  /** Selected date. Accepts Date object or ISO string (YYYY-MM-DD). */
  value?: NysDatepickerElement["value"];

  /** Input width: `md` (200px), `lg` (384px), `full` (100%). */
  width?: NysDatepickerElement["width"];

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

  /** Fired when input or calendar loses focus. Triggers validation. */
  onNysBlur?: (event: CustomEvent) => void;

  /** Fired on date selection. Detail: `{id, value}`. */
  onNysInput?: (event: CustomEvent) => void;
}

/**
 * Date picker with calendar popup and native fallback.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-blur** - Fired when input or calendar loses focus. Triggers validation.
 * - **nys-input** - Fired on date selection. Detail: `{id, value}`.
 *
 * ### **Methods:**
 *  - **checkValidity(): _boolean_** - Passive check of validity:
 * - Returns true/false
 * - Does NOT update UI or show errors
 * - Used in form submission checks
 */
export const NysDatepicker: React.ForwardRefExoticComponent<NysDatepickerProps>;

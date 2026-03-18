import React from "react";
import {
  NysDatepicker as NysDatepickerElement,
  CustomEvent,
  Event,
} from "../../dist/nysds.es.js";

export type { NysDatepickerElement, CustomEvent, Event };

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
  /** Hide the "Today" button in calendar popup. */
  hideTodayButton?: boolean;

  /** Hide the "Clear" button in calendar popup. */
  hideClearButton?: boolean;

  /** Disable interaction. */
  disabled?: boolean;

  /** Mark as required. Shows "Required" flag and validates on blur. */
  required?: boolean;

  /** Show "Optional" flag. Use when most fields are required. */
  optional?: boolean;

  /** Show error state. */
  showError?: boolean;

  /** Dark background mode. */
  inverted?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysDatepickerElement["id"];

  /** Name for form submission. */
  name?: NysDatepickerElement["name"];

  /** Input width: `md` (200px), `lg` (384px), `full` (100%). */
  width?: NysDatepickerElement["width"];

  /** Error message text. */
  errorMessage?: NysDatepickerElement["errorMessage"];

  /** Form `id` to associate with when input is outside form. */
  form?: NysDatepickerElement["form"];

  /** Tooltip text on info icon hover. */
  tooltip?: NysDatepickerElement["tooltip"];

  /** Input type. Currently only supports `date`. */
  type?: NysDatepickerElement["type"];

  /** Label text. Required for accessibility. */
  label?: NysDatepickerElement["label"];

  /** Helper text below label. */
  description?: NysDatepickerElement["description"];

  /** Initial date when calendar opens (YYYY-MM-DD). */
  startDate?: NysDatepickerElement["startDate"];

  /** Selected date. Accepts Date object or ISO string (YYYY-MM-DD). */
  value?: NysDatepickerElement["value"];

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

  /** Fired on date selection. Detail: `{id, value}`. */
  onNysInput?: (event: CustomEvent) => void;

  /** Fired when input or calendar loses focus. Triggers validation. */
  onNysBlur?: (event: CustomEvent) => void;
}

/**
 * Date picker with calendar popup and native fallback.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-input** - Fired on date selection. Detail: `{id, value}`.
 * - **nys-blur** - Fired when input or calendar loses focus. Triggers validation.
 *
 * ### **Methods:**
 *  - **checkValidity(): _boolean_** - Passive check of validity:
 * - Returns true/false
 * - Does NOT update UI or show errors
 * - Used in form submission checks
 */
export const NysDatepicker: React.ForwardRefExoticComponent<NysDatepickerProps>;

import React from "react";
import {
  NysRadiobutton as NysRadiobuttonElement,
  Event,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysRadiobuttonElement, Event, CustomEvent };

export interface NysRadiobuttonProps extends Pick<
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
  /** Whether this radio is selected. Only one per group can be checked. */
  checked?: boolean;

  /** Prevents interaction. */
  disabled?: boolean;

  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;

  /** undefined */
  other?: boolean;

  /** Marks group as required. Set on radiogroup, not individual radios. */
  required?: boolean;

  /** undefined */
  showOtherError?: boolean;

  /** Renders as tile with larger clickable area. */
  tile?: boolean;

  /** Helper text below label. Use slot for custom HTML. */
  description?: NysRadiobuttonElement["description"];

  /** Form `id` to associate with. */
  form?: NysRadiobuttonElement["form"];

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysRadiobuttonElement["id"];

  /** Visible label text. Required for accessibility. */
  label?: NysRadiobuttonElement["label"];

  /** Group name. Radios with same name are mutually exclusive. */
  name?: NysRadiobuttonElement["name"];

  /** Radio size: `sm` (24px) or `md` (32px, default). */
  size?: NysRadiobuttonElement["size"];

  /** Value submitted when this radio is selected. */
  value?: NysRadiobuttonElement["value"];

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

  /** Fired when radio loses focus. */
  onNysBlur?: (event: CustomEvent) => void;

  /** Fired when selection changes. Detail: `{id, checked, name, value}`. */
  onNysChange?: (event: CustomEvent) => void;

  /** undefined */
  onNysError?: (event: CustomEvent) => void;

  /** undefined */
  onNysErrorClear?: (event: CustomEvent) => void;

  /** Fired when radio gains focus. */
  onNysFocus?: (event: CustomEvent) => void;

  /** Fired when "other" text input value changes. Detail: `{id, name, value}`. */
  onNysOtherInput?: (event: CustomEvent) => void;
}

/**
 * Radio button for single selection from mutually exclusive options.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-blur** - Fired when radio loses focus.
 * - **nys-change** - Fired when selection changes. Detail: `{id, checked, name, value}`.
 * - **nys-error**
 * - **nys-error-clear**
 * - **nys-focus** - Fired when radio gains focus.
 * - **nys-other-input** - Fired when "other" text input value changes. Detail: `{id, name, value}`.
 *
 * ### **Methods:**
 *  - **getInputElement(): _Promise<HTMLInputElement | null>_** - Functions
 * --------------------------------------------------------------------------
 *
 * ### **Slots:**
 *  - **description** - Custom HTML description content.
 */
export const NysRadiobutton: React.ForwardRefExoticComponent<NysRadiobuttonProps>;

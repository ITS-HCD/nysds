import React from "react";
import {
  NysToggle as NysToggleElement,
  Event,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysToggleElement, Event, CustomEvent };

export interface NysToggleProps extends Pick<
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
  /** Whether toggle is on. */
  checked?: boolean;

  /** Prevents interaction. */
  disabled?: boolean;

  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;

  /** Hides check/close icon inside toggle knob. */
  noIcon?: boolean;

  /** Helper text below label. Use slot for custom HTML. */
  description?: NysToggleElement["description"];

  /** Form `id` to associate with. */
  form?: NysToggleElement["form"];

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysToggleElement["id"];

  /** Visible label text. */
  label?: NysToggleElement["label"];

  /** Name for form submission. */
  name?: NysToggleElement["name"];

  /** Toggle size: `sm` or `md` (default). */
  size?: NysToggleElement["size"];

  /** Value submitted when toggle is on. */
  value?: NysToggleElement["value"];

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

  /** Fired when toggle loses focus. */
  onNysBlur?: (event: CustomEvent) => void;

  /** Fired when toggle state changes. Detail: `{id, checked}`. */
  onNysChange?: (event: CustomEvent) => void;

  /** Fired when toggle gains focus. */
  onNysFocus?: (event: CustomEvent) => void;
}

/**
 * Toggle switch for binary settings with immediate effect.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-blur** - Fired when toggle loses focus.
 * - **nys-change** - Fired when toggle state changes. Detail: `{id, checked}`.
 * - **nys-focus** - Fired when toggle gains focus.
 *
 * ### **Slots:**
 *  - **description** - Custom HTML description content.
 */
export const NysToggle: React.ForwardRefExoticComponent<NysToggleProps>;

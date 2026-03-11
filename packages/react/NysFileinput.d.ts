import React from "react";
import {
  NysFileinput as NysFileinputElement,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysFileinputElement, CustomEvent };

export interface NysFileinputProps extends Pick<
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
  /** Allows selecting multiple files. */
  multiple?: boolean;

  /** Prevents interaction. */
  disabled?: boolean;

  /** Requires at least one file to be uploaded. */
  required?: boolean;

  /** Shows "Optional" flag. */
  optional?: boolean;

  /** Shows error message when true. */
  showError?: boolean;

  /** Enables drag-and-drop zone UI. */
  dropzone?: boolean;

  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysFileinputElement["id"];

  /** Name for form submission. */
  name?: NysFileinputElement["name"];

  /** Visible label text. */
  label?: NysFileinputElement["label"];

  /** Helper text below label. Use slot for custom HTML. */
  description?: NysFileinputElement["description"];

  /** Form `id` to associate with. */
  form?: NysFileinputElement["form"];

  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysFileinputElement["tooltip"];

  /** Accepted file types. Use MIME types (`image/*`) or extensions (`.pdf`). Validated via magic bytes. */
  accept?: NysFileinputElement["accept"];

  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysFileinputElement["errorMessage"];

  /** Component width: `lg` (384px) or `full` (100%, default). */
  width?: NysFileinputElement["width"];

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

  /** Fired when files are added or removed. Detail: `{id, files}`. */
  onNysChange?: (event: CustomEvent) => void;
}

/**
 * File input with drag-and-drop, validation, and progress tracking.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-change** - Fired when files are added or removed. Detail: `{id, files}`.
 *
 * ### **Slots:**
 *  - **description** - Custom HTML description content.
 */
export const NysFileinput: React.ForwardRefExoticComponent<NysFileinputProps>;

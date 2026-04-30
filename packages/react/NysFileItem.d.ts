import React from "react";
import {
  NysFileItem as NysFileItemElement,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysFileItemElement, CustomEvent };

export interface NysFileItemProps extends Pick<
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
  /** Error message displayed when status is `error`. */
  errorMessage?: NysFileItemElement["errorMessage"];

  /** Name of the file being displayed. */
  filename?: NysFileItemElement["filename"];

  /** Upload progress percentage (0-100). Only shown when status is `processing`. */
  progress?: NysFileItemElement["progress"];

  /** Upload status: `pending` (queued), `processing` (uploading), `done` (complete), `error` (failed). */
  status?: NysFileItemElement["status"];

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

  /** Fired when remove button is clicked. Detail: `{filename}`. */
  onNysFileRemove?: (event: CustomEvent) => void;
}

/**
 * Internal file item display with status, progress bar, and remove action.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-fileRemove** - Fired when remove button is clicked. Detail: `{filename}`.
 */
export const NysFileItem: React.ForwardRefExoticComponent<NysFileItemProps>;

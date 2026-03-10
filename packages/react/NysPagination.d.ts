import React from "react";
import {
  NysPagination as NysPaginationElement,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysPaginationElement, CustomEvent };

export interface NysPaginationProps extends Pick<
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
  /** Internal state for layout adjustments near the end. */
  _twoBeforeLast?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysPaginationElement["id"];

  /** Name attribute for form association. */
  name?: NysPaginationElement["name"];

  /** Currently active page (1-indexed). Clamped to valid range. */
  currentPage?: NysPaginationElement["currentPage"];

  /** Total number of pages. Must be at least 1. */
  totalPages?: NysPaginationElement["totalPages"];

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

  /** Fired when page changes. Detail: `{page}`. */
  onNysChange?: (event: CustomEvent) => void;
}

/**
 * Page navigation with numbered links, prev/next buttons, and responsive layout.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-change** - Fired when page changes. Detail: `{page}`.
 */
export const NysPagination: React.ForwardRefExoticComponent<NysPaginationProps>;

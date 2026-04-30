import React from "react";
import { NysTable as NysTableElement } from "../../dist/nysds.es.js";

export type { NysTableElement };

export interface NysTableProps extends Pick<
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
  /** undefined */
  bordered?: boolean;

  /** undefined */
  sortable?: boolean;

  /** undefined */
  striped?: boolean;

  /** undefined */
  download?: NysTableElement["download"];

  /** undefined */
  id?: NysTableElement["id"];

  /** undefined */
  name?: NysTableElement["name"];

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

  /** Fired when the download button or sortable headers are clicked. */
  onNysClick?: (event: CustomEvent) => void;

  /** Fired when a sortable column header is clicked.  Can be prevented by calling `event.preventDefault()` to override default sort behavior. Detail: { columnIndex: number, columnLabel: string, sortDirection: "asc" | "desc" | "none" } */
  onNysColumnSort?: (event: CustomEvent) => void;
}

/**
 * `<nys-table>` is a responsive table component that can display native HTML tables,
 * supports striped and bordered styling, sortable columns, and CSV download.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-click** - Fired when the download button or sortable headers are clicked.
 * - **nys-column-sort** - Fired when a sortable column header is clicked.  Can be prevented by calling `event.preventDefault()` to override default sort behavior. Detail: { columnIndex: number, columnLabel: string, sortDirection: "asc" | "desc" | "none" }
 *
 * ### **Slots:**
 *  - _default_ - Accepts a `<table>` element. Only the first table is rendered.
 */
export const NysTable: React.ForwardRefExoticComponent<NysTableProps>;

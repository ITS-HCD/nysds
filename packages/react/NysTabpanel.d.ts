import React from "react";
import { NysTabpanel as NysTabpanelElement } from "../../dist/nysds.es.js";

export type { NysTabpanelElement };

export interface NysTabpanelProps extends Pick<
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
  /** Unique identifier for the panel element.
If not provided, one is auto-generated in `connectedCallback`.
Reflected to the DOM attribute so `aria-controls` references on sibling
`<nys-tab>` elements resolve correctly. */
  id?: NysTabpanelElement["id"];

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
}

/**
 * `<nys-tabpanel>` is a content panel paired with a `<nys-tab>` inside a
 * `<nys-tabgroup>`.
 *
 * Pairing is determined by render order: the Nth `<nys-tabpanel>` child of a
 * `<nys-tabgroup>` corresponds to the Nth `<nys-tab>` child.
 * `aria-labelledby` and the `hidden` attribute are managed externally by
 * `<nys-tabgroup>` via `_applySelection`; do not set them directly.
 * ---
 *
 *
 * ### **Slots:**
 *  - _default_ - Default slot for panel content. Rendered inside a wrapper `<div>` with the `.nys-tabpanel` class for styling.
 */
export const NysTabpanel: React.ForwardRefExoticComponent<NysTabpanelProps>;

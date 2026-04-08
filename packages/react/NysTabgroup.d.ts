import React from "react";
import { NysTabgroup as NysTabgroupElement } from "../../dist/nysds.es.js";

export type { NysTabgroupElement };

export interface NysTabgroupProps extends Pick<
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
  /** Unique identifier for the tabgroup element.
If not provided, one is auto-generated in `connectedCallback`.
Reflected to the DOM attribute. */
  id?: NysTabgroupElement["id"];

  /** Accessible label for the tab list (`aria-label` on the inner
`[role="tablist"]`). Should describe the purpose of the tab set
(e.g. `"Account settings"`). */
  name?: NysTabgroupElement["name"];

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
 * `<nys-tabgroup>` is the container for `<nys-tab>` and `<nys-tabpanel>`
 * elements.
 *
 * Accepts tabs and panels as flat light-DOM children in any order (interleaved
 * or grouped). On slot change, children are sorted into dedicated shadow-DOM
 * containers, ARIA relationships are wired, and the first selected (or first)
 * tab is activated.
 *
 * Scroll shadows are rendered on either side of the tab list and toggled via
 * `ResizeObserver` and a `scroll` listener so they accurately reflect whether
 * overflow content exists in each direction.
 *
 * Keyboard navigation follows the
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ ARIA Tabs Pattern:
 * - Arrow keys move focus without changing selection.
 * - Enter / Space confirm selection on the focused tab.
 * - Only the selected tab holds a tab stop (`tabindex="0"`); all others are
 *   removed from the tab sequence (`tabindex="-1"`).
 * ---
 *
 *
 * ### **Slots:**
 *  - _default_ - Accepts `<nys-tab>` and `<nys-tabpanel>` children. Elements are moved into internal shadow-DOM containers on `slotchange`; the slot itself is not rendered visibly.
 */
export const NysTabgroup: React.ForwardRefExoticComponent<NysTabgroupProps>;

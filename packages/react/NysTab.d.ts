import React from "react";
import { NysTab as NysTabElement, CustomEvent } from "../../dist/nysds.es.js";

export type { NysTabElement, CustomEvent };

export interface NysTabProps extends Pick<
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
  /** Whether this tab is the currently active tab.
Managed by `<nys-tabgroup>`; reflected to the DOM attribute so CSS
selected-state styles can be applied via the attribute selector. */
  selected?: boolean;

  /** Whether this tab is disabled.
When `true`, click and keyboard activation are suppressed and the inner
`<button>` renders in its disabled state.
Reflected to the DOM attribute for CSS styling. */
  disabled?: boolean;

  /** Unique identifier for the tab element.
If not provided, one is auto-generated in `connectedCallback`.
Reflected to the DOM attribute so `aria-controls` references on sibling
panels resolve correctly. */
  id?: NysTabElement["id"];

  /** Visible text label rendered inside the inner `<button>`. */
  label?: NysTabElement["label"];

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

  /** Dispatched when the tab is activated via click or Enter / Space. Bubbles and crosses shadow DOM boundaries. `detail: { id: string, label: string }` */
  onNysTabSelect?: (event: CustomEvent) => void;

  /** Dispatched when the inner `<button>` receives focus. Bubbles and crosses shadow DOM boundaries. `detail: { id: string }` */
  onNysTabFocus?: (event: CustomEvent) => void;

  /** Dispatched when the inner `<button>` loses focus. Bubbles and crosses shadow DOM boundaries. `detail: { id: string }` */
  onNysTabBlur?: (event: CustomEvent) => void;
}

/**
 * `<nys-tab>` is a single tab within a `<nys-tabgroup>`.
 *
 * Paired with a `<nys-tabpanel>` by render order inside the parent
 * `<nys-tabgroup>`. ARIA attributes (`role`, `aria-selected`, `aria-controls`,
 * `tabindex`) are managed externally by `<nys-tabgroup>` via `_applySelection`;
 * do not set them directly on this element.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-tab-select** - Dispatched when the tab is activated via click or Enter / Space. Bubbles and crosses shadow DOM boundaries. `detail: { id: string, label: string }`
 * - **nys-tab-focus** - Dispatched when the inner `<button>` receives focus. Bubbles and crosses shadow DOM boundaries. `detail: { id: string }`
 * - **nys-tab-blur** - Dispatched when the inner `<button>` loses focus. Bubbles and crosses shadow DOM boundaries. `detail: { id: string }`
 *
 * ### **Methods:**
 *  - **focus(options: _FocusOptions_): _void_** - Moves browser focus to the inner `<button>`.
 * The host carries `role="tab"` and `tabindex`; `delegatesFocus: true` on
 * the shadow root ensures AT associates the tab role with the focused element.
 *
 * ### **Slots:**
 *  - _default_ - No slots; content is derived from the `label` property.
 */
export const NysTab: React.ForwardRefExoticComponent<NysTabProps>;

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
Managed by `<nys-tabgroup>`; reflected for CSS attribute selectors. */
  selected?: boolean;

  /** Whether this tab is disabled.
Reflected to the DOM attribute for CSS styling. */
  disabled?: boolean;

  /** Unique identifier for the tab element.
Reflected to the DOM attribute so `aria-controls` references resolve. */
  id?: NysTabElement["id"];

  /** Visible text label rendered inside the inner `<span>`. */
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

  /** Fired when the tab is activated via click or Enter / Space. Bubbles and crosses shadow DOM boundaries. Detail: `{ id: string, label: string }` */
  onNysTabSelect?: (event: CustomEvent) => void;

  /** Fired when the tab receives keyboard focus (does not activate the tab). Bubbles and crosses shadow DOM boundaries. Detail: `{ id: string }` */
  onNysTabFocus?: (event: CustomEvent) => void;

  /** Fired when the tab loses keyboard focus. Bubbles and crosses shadow DOM boundaries. Detail: `{ id: string }` */
  onNysTabBlur?: (event: CustomEvent) => void;
}

/**
 * A single tab within a `<nys-tabgroup>` container. Each tab has a label and is associated with a panel via `<nys-tabpanel>`.
 * The host element carries `role="tab"`, `tabindex`, `aria-selected`, `aria-controls`, and `aria-disabled`
 * so assistive technologies see the correct ARIA tab semantics on the element that is actually focused.
 * `<nys-tabgroup>` manages tab selection, focus, and keyboard navigation; do not set these attributes directly.
 *
 * ## When to use
 * - Organize related content into logical sections/views.
 * - Allow users to switch between views without navigating away from the page.
 * - Use for tabbed interfaces with 2-6 logical categories (more tabs may overwhelm users).
 * - Each tab should represent a distinct topic or context, not steps in a workflow (use Stepper for that).
 * - Always wrap tabs in a `<nys-tabgroup>` container; do not use tabs standalone.
 *
 * ## Variants
 * - **Default tab**: Label is visible; not selected, not disabled.
 * - **Selected tab**: Set `selected` to mark the active tab (usually the first tab by default).
 * - **Disabled tab**: Set `disabled` to prevent selection; the tab is hidden from keyboard and mouse interaction.
 * - **Tab with long label**: Labels should be concise (1-3 words); long labels wrap to multiple lines.
 *
 * ## Accessibility
 * - Host element is the interactive control; receives `role="tab"` and `tabindex`.
 * - `aria-selected` indicates the currently active tab.
 * - `aria-controls` links the tab to its corresponding panel.
 * - `aria-disabled` reflects the disabled state.
 * - Keyboard support managed by `<nys-tabgroup>`: Arrow Left/Right to navigate, Home/End to jump to first/last.
 * - Enter/Space activates a tab; focus does not activate it (manual, not automatic activation).
 * - Screen readers announce the tab's label, selected state, and position in the tab list.
 *
 * ## Content Guidelines
 * - Keep tab labels short and descriptive (e.g., "Overview", "Details", "Reviews").
 * - Use sentence case or title case consistently.
 * - Avoid special characters or very long labels.
 * - Ensure each tab represents distinct content or functionality.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-tab-select** - Fired when the tab is activated via click or Enter / Space. Bubbles and crosses shadow DOM boundaries. Detail: `{ id: string, label: string }`
 * - **nys-tab-focus** - Fired when the tab receives keyboard focus (does not activate the tab). Bubbles and crosses shadow DOM boundaries. Detail: `{ id: string }`
 * - **nys-tab-blur** - Fired when the tab loses keyboard focus. Bubbles and crosses shadow DOM boundaries. Detail: `{ id: string }`
 *
 * ### **Methods:**
 *  - **focus(options: _FocusOptions_): _void_** - Focuses the host element. The host carries `role="tab"` and `tabindex`,
 * so it is the correct element for AT to land on.
 *
 * ### **Slots:**
 *  - _default_ - No slots; content is derived from the `label` property.
 */
export const NysTab: React.ForwardRefExoticComponent<NysTabProps>;

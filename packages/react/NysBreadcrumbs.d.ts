import React from "react";
import {
  NysBreadcrumbs as NysBreadcrumbsElement,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysBreadcrumbsElement, CustomEvent };

export interface NysBreadcrumbsProps extends Pick<
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
  /** On mobile, renders the trail as a single back-to-parent link pointing to the item before the current page.
Has no effect on desktop or when only one item is present (which always renders as a back link). */
  backToParent?: boolean;

  /** Forces the trail into its collapsed state.
It shows only the first item, an ellipsis, and the last two items.
The user can still expand the trail by clicking the ellipsis. */
  collapsed?: boolean;

  /** Renders a filled light theme background bar behind the breadcrumb trail. */
  backgroundBar?: boolean;

  /** Prevents interaction. */
  disabled?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysBreadcrumbsElement["id"];

  /** Accessible label for the `<nav>` landmark. Defaults to "path to this page" if not set.
Override when multiple crumbs exist on the same page. */
  ariaLabel?: NysBreadcrumbsElement["ariaLabel"];

  /** Controls the visual size of the breadcrumb text and spacing: `sm` for dense layouts, `md` (default) for standard use. */
  size?: NysBreadcrumbsElement["size"];

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

  /** undefined */
  onNysExpand?: (event: CustomEvent) => void;

  /** Fired when the user clicks the ellipsis to expand the trail. */
  onNysBreadcrumbsExpand?: (event: CustomEvent) => void;
}

/**
 * Breadcrumb navigation trail with responsive collapse support.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-expand**
 * - **nys-breadcrumbs-expand** - Fired when the user clicks the ellipsis to expand the trail.
 *
 * ### **Slots:**
 *  - _default_ - One or more `nys-breadcrumbitem` elements defining the trail.
 */
export const NysBreadcrumbs: React.ForwardRefExoticComponent<NysBreadcrumbsProps>;

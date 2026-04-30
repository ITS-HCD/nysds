import React from "react";
import {
  NysBreadcrumbItem as NysBreadcrumbItemElement,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysBreadcrumbItemElement, CustomEvent };

export interface NysBreadcrumbItemProps extends Pick<
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
  /** Private property used by nys-breadcrumbs to indicate this breadcrumb item is the last in the trail * */
  isLast?: boolean;

  /** undefined */
  isBackToParent?: boolean;

  /** undefined */
  id?: NysBreadcrumbItemElement["id"];

  /** undefined */
  label?: NysBreadcrumbItemElement["label"];

  /** undefined */
  link?: NysBreadcrumbItemElement["link"];

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

  /** Fired when the link is clicked. Detail: `{id, link}`. */
  onNysBreadcrumbitemClick?: (event: CustomEvent) => void;
}

/**
 * Single breadcrumb trail item with chevron separator and current page support.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-breadcrumbitem-click** - Fired when the link is clicked. Detail: `{id, link}`.
 */
export const NysBreadcrumbItem: React.ForwardRefExoticComponent<NysBreadcrumbItemProps>;

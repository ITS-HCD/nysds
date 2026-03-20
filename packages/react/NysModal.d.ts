import React from "react";
import {
  NysModal as NysModalElement,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysModalElement, CustomEvent };

export interface NysModalProps extends Pick<
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
  /** Controls modal visibility. Set to `true` to show. */
  open?: boolean;

  /** Prevents dismissal via close button or Escape key. User must take an action. */
  mandatory?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysModalElement["id"];

  /** Modal heading text. Required for accessibility. */
  heading?: NysModalElement["heading"];

  /** Secondary heading below the main heading. */
  subheading?: NysModalElement["subheading"];

  /** Modal width: `sm` (400px), `md` (600px), or `lg` (800px). */
  width?: NysModalElement["width"];

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

  /** Fired when modal opens. Detail: `{id}`. */
  onNysOpen?: (event: CustomEvent) => void;

  /** Fired when modal closes. Detail: `{id}`. */
  onNysClose?: (event: CustomEvent) => void;
}

/**
 * Accessible modal dialog with focus trap, keyboard support, and action slots.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-open** - Fired when modal opens. Detail: `{id}`.
 * - **nys-close** - Fired when modal closes. Detail: `{id}`.
 *
 * ### **Slots:**
 *  - _default_ - Default slot for body content.
 * - **actions** - Action buttons displayed in footer. Buttons auto-resize on mobile.
 */
export const NysModal: React.ForwardRefExoticComponent<NysModalProps>;

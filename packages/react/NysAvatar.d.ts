import React from "react";
import { NysAvatar as NysAvatarElement } from "../../dist/nysds.es.js";

export type { NysAvatarElement };

export interface NysAvatarProps extends Pick<
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
  /** Prevents interaction when `interactive` is true. */
  disabled?: boolean;

  /** Makes avatar clickable with button role and focus ring. */
  interactive?: boolean;

  /** Enables lazy loading for the image. */
  lazy?: boolean;

  /** Accessible label for screen readers. Required when no image `alt` is available. */
  ariaLabel?: NysAvatarElement["ariaLabel"];

  /** Background color. Foreground auto-adjusts for contrast. Accepts CSS values or variables. */
  color?: NysAvatarElement["color"];

  /** Custom icon name. Falls back to `account_circle` if not set. */
  icon?: NysAvatarElement["icon"];

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysAvatarElement["id"];

  /** Image URL. Takes priority over initials and icon. */
  image?: NysAvatarElement["image"];

  /** 1-2 character initials. Used when no image is provided. */
  initials?: NysAvatarElement["initials"];

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
 * User avatar with image, initials, or icon fallback and contrast-aware colors.
 * ---
 *
 *
 * ### **Slots:**
 *  - _default_ - Custom icon content. Overrides default icon when no image or initials.
 */
export const NysAvatar: React.ForwardRefExoticComponent<NysAvatarProps>;

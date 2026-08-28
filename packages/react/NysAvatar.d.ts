import React from "react";
import { NysAvatar as NysAvatarElement } from "@nysds/nys-avatar";

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
  /** Makes avatar clickable with button role and focus ring. */
  interactive?: boolean;

  /** Prevents interaction when `interactive` is true. */
  disabled?: boolean;

  /** Enables lazy loading for the image. */
  lazy?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysAvatarElement["id"];

  /** Accessible name for the avatar — who or what it represents ("Jane Smith"),
not what it is ("avatar").

Leave it unset for a decorative avatar and the whole thing is hidden from
assistive tech, which is the right outcome next to a visible name. Set it
whenever the avatar is the only thing identifying the person, and always when
`interactive` is set: that renders a `<button>`, and a nameless button cannot
be operated by screen reader or voice-control users (WCAG 4.1.2). An
interactive avatar without a name logs a console warning.

Whitespace-only values — including a non-breaking space — count as no name. */
  ariaLabel?: NysAvatarElement["ariaLabel"];

  /** Image URL. Takes priority over initials and icon. */
  image?: NysAvatarElement["image"];

  /** 1-2 character initials. Used when no image is provided. */
  initials?: NysAvatarElement["initials"];

  /** Custom icon name. Falls back to `account_circle` if not set. */
  icon?: NysAvatarElement["icon"];

  /** Background color. Foreground auto-adjusts for contrast. Accepts CSS values or variables. */
  color?: NysAvatarElement["color"];

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

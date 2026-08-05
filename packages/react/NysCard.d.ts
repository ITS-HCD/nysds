import React from "react";
import { NysCard as NysCardElement, Event } from "../../dist/nysds.es.js";

export type { NysCardElement, Event };

export interface NysCardProps extends Pick<
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
  /** When true, adds padding around the media to visually contain it. */
  inset?: boolean;

  /** When true, adds a drop shadow to the card, giving it a raised appearance. */
  elevated?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysCardElement["id"];

  /** Appears above the heading text. */
  preheading?: NysCardElement["preheading"];

  /** Heading text in the card. */
  heading?: NysCardElement["heading"];

  /** Heading level used for the card heading (`h1` through `h6`). */
  headingLevel?: NysCardElement["headingLevel"];

  /** Appears below the heading text. */
  subheading?: NysCardElement["subheading"];

  /** Appears below the subheading text. Takes in plain text. Use the main slot if the description requires rich text or more content. */
  description?: NysCardElement["description"];

  /** URL to navigate to. Makes the whole card a single `<a>`. Keep the card's slots
free of other interactive elements when using this — nesting them inside the
card control is invalid HTML and unreachable for keyboard and screen reader users. */
  href?: NysCardElement["href"];

  /** Link target: `_self` (same tab), `_blank` (new tab), `_parent`, `_top`, or frame name. Only used with `href`. */
  target?: NysCardElement["target"];

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

  /** Click handler. Makes the whole card a single `<button>`. Use instead of
`@click` to ensure keyboard accessibility. */
  onClick?: NysCardElement["onClick"];

  /** Fired when an interactive card is activated (mouse or keyboard). */
  onNysClick?: (event: CustomEvent) => void;

  /** Fired when an interactive card receives focus. */
  onNysFocus?: (event: CustomEvent) => void;

  /** Fired when an interactive card loses focus. */
  onNysBlur?: (event: CustomEvent) => void;
}

/**
 * Flexible container that groups related content and actions about a single subject.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-click** - Fired when an interactive card is activated (mouse or keyboard).
 * - **nys-focus** - Fired when an interactive card receives focus.
 * - **nys-blur** - Fired when an interactive card loses focus.
 *
 * ### **Slots:**
 *  - **top** - Content rendered above the heading block (e.g. a badge or label).
 * - _default_ - Default slot for the card's main body. Use for rich content when the `description` property is not enough.
 * - **bottom** - Content rendered at the bottom of the card, typically actions like buttons or links.
 * - **media** - Visual content displayed at the top of the card, typically an `<img>`.
 * - **media-accent** - Text for the accent badge displayed over the media, typically a date. Pass a wrapper holding two elements: the first is rendered as the month line, the second as the day line. Only renders when the `media` slot has content. The card becomes a single interactive control when it is given something to do: an `href` renders it as an `<a>`, a click handler (`onClick` or an inline `onclick`) renders it as a `<button>`.
 */
export const NysCard: React.ForwardRefExoticComponent<NysCardProps>;

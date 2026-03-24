import React from "react";
import { NysIcon as NysIconElement } from "../../dist/nysds.es.js";

export type { NysIconElement };

export interface NysIconProps extends Pick<
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
  /** Icon name from Material Symbols library. Required. */
  name?: NysIconElement["name"];

  /** Accessible label. When set, removes `aria-hidden` and adds `aria-label` to the SVG. */
  ariaLabel?: NysIconElement["ariaLabel"];

  /** Rotation in degrees. Applied via CSS `rotate`. */
  rotate?: NysIconElement["rotate"];

  /** Flip direction: `horizontal`, `vertical`, or empty for none. */
  flip?: NysIconElement["flip"];

  /** Icon color. Accepts any CSS color value. Defaults to `currentcolor`. */
  color?: NysIconElement["color"];

  /** Icon size. Semantic sizes: `xs`-`5xl`. Pixel sizes: `12`-`50`. */
  size?: NysIconElement["size"];

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
 * SVG icon from Material Symbols library with size, rotation, and color options.
 * ---
 *
 */
export const NysIcon: React.ForwardRefExoticComponent<NysIconProps>;

import React from "react";
import { NysCard as NysCardElement } from "../../dist/nysds.es.js";

export type { NysCardElement };

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

  /** Appears below the heading text. */
  subheading?: NysCardElement["subheading"];

  /** Appears below the subheading text. Takes in plain text. Use the main slot if the description requires rich text or more content. */
  description?: NysCardElement["description"];

  /** Visual content for the card. Supported types are images: png, jpg, etc. */
  media?: NysCardElement["media"];

  /** Accent appearing on the media. Only supports date in v1 */
  mediaAccent?: NysCardElement["mediaAccent"];

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
 * A card component is a reusable, self-contained element that groups related content and actions about a single subject into a distinct, flexible container.
 * ---
 *
 */
export const NysCard: React.ForwardRefExoticComponent<NysCardProps>;

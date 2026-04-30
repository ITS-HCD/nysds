import React from "react";
import { NysVideo as NysVideoElement } from "../../dist/nysds.es.js";

export type { NysVideoElement };

export interface NysVideoProps extends Pick<
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
  /** Triggers autoplay when the iframe loads */
  autoplay?: boolean;

  /** Prevents the video from being played */
  disabled?: boolean;

  /** Full YouTube URL — required. Component will not render if invalid. */
  id?: NysVideoElement["id"];

  /** undefined */
  loading?: NysVideoElement["loading"];

  /** Largest size for the video player.
If not set, size is determined automatically by viewport width. */
  size?: NysVideoElement["size"];

  /** Time in seconds where playback begins. * */
  starttime?: NysVideoElement["starttime"];

  /** Custom thumbnail image path.
Falls back to YouTube's auto-generated thumbnail if not provided. */
  thumbnail?: NysVideoElement["thumbnail"];

  /** Title text for the thumbnail of the video */
  titleText?: NysVideoElement["titleText"];

  /** Full YouTube URL — required. Component will not render if invalid. */
  videourl?: NysVideoElement["videourl"];

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

  /** Fired when the user clicks the thumbnail to load the player. */
  onNysVideoPlay?: (event: CustomEvent) => void;
}

/**
 * YouTube video player with thumbnail preview and accessibility announcements.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-video-play** - Fired when the user clicks the thumbnail to load the player.
 */
export const NysVideo: React.ForwardRefExoticComponent<NysVideoProps>;

import React from "react";
import { NysGlobalHeader as NysGlobalHeaderElement } from "../../dist/nysds.es.js";

export type { NysGlobalHeaderElement };

export interface NysGlobalHeaderProps extends Pick<
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
  /** Displays the NYS brand mark in the header. Off by default.

Enable only for internal, state-employee (back-office) applications that omit
`nys-unavheader`. Any resident-facing app — even one requiring login — should
keep `nys-unavheader` for trust and leave this off. */
  nysLogo?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysGlobalHeaderElement["id"];

  /** Application name displayed prominently. */
  appName?: NysGlobalHeaderElement["appName"];

  /** Agency name displayed below app name (or as main title if no appName). */
  agencyName?: NysGlobalHeaderElement["agencyName"];

  /** URL for the header title link. If empty, title is not clickable. */
  homepageLink?: NysGlobalHeaderElement["homepageLink"];

  /** Accessible name for the `banner` landmark this header renders.

Leave it unset and the banner is named after the visible `appName` or
`agencyName`, which cannot drift out of sync and is translated with the rest
of the page. Falls back to `"Site"` when there is no title to reference.

Set this only when neither is right for your audience. A page pairing this
with `nys-unavheader` carries two `banner` landmarks, so the name must stay
distinct from that header's (`"New York State"` by default) or landmark
navigation stops distinguishing them.

An explicit name replaces the reference to the visible title. */
  landmarkLabel?: NysGlobalHeaderElement["landmarkLabel"];

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
 * Agency header with navigation, mobile menu, and active link highlighting.
 * ---
 *
 *
 * ### **Slots:**
 *  - _default_ - Navigation content (typically `<ul>` with `<li><a>` links). Auto-sanitized.
 * - **user-actions** - User-account controls (e.g. profile link, settings, log-out button) shown in the header.
 */
export const NysGlobalHeader: React.ForwardRefExoticComponent<NysGlobalHeaderProps>;

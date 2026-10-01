import React from "react";
import { NysGlobalFooter as NysGlobalFooterElement } from "../../dist/nysds.es.js";

export type { NysGlobalFooterElement };

export interface NysGlobalFooterProps extends Pick<
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
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysGlobalFooterElement["id"];

  /** Agency name displayed as the footer heading. */
  agencyName?: NysGlobalFooterElement["agencyName"];

  /** Optional subheading displayed below the agency name. */
  agencySubheading?: NysGlobalFooterElement["agencySubheading"];

  /** URL for the agency name link. If empty, name is not clickable. */
  homepageLink?: NysGlobalFooterElement["homepageLink"];

  /** Accessible name for the `contentinfo` landmark this footer renders.

Leave it unset and the landmark is named after the visible `agencyName`
heading, which cannot drift out of sync and is translated with the rest of
the page. Falls back to `"Site"` when there is no agency name to reference.

Set this only when the agency name is not right for your audience. A page
pairing this with `nys-unavfooter` carries two `contentinfo` landmarks, so
the name must stay distinct from that footer's (`"New York State"` by
default) or landmark navigation stops distinguishing them.

An explicit name replaces the reference to the visible heading. */
  landmarkLabel?: NysGlobalFooterElement["landmarkLabel"];

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
 * Agency footer with auto-layout for contact info and link sections.
 * ---
 *
 *
 * ### **Slots:**
 *  - _default_ - Footer content (links, contact info). Use `<h4>` for column headings.
 *
 * ### **CSS Properties:**
 *  - **--nys-max-width--content** - Overrides the inner content max width across the grid, header, footer, and breadcrumb. Set at a higher level like `:root` to apply to all instances. Takes priority over the size-specific variable. _(default: undefined)_
 * - **--_nys-globalfooter-max-width--content** - Maximum width for the inner container. Defaults to the size's max width (e.g. 1280px). _(default: undefined)_
 */
export const NysGlobalFooter: React.ForwardRefExoticComponent<NysGlobalFooterProps>;

import React from "react";
import {
  NysAlert as NysAlertElement,
  CustomEvent,
} from "../../dist/nysds.es.js";

export type { NysAlertElement, CustomEvent };

export interface NysAlertProps extends Pick<
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
  /** Shows close button allowing users to dismiss the alert. */
  dismissible?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysAlertElement["id"];

  /** Bold heading text displayed at the top of the alert. */
  heading?: NysAlertElement["heading"];

  /** Custom icon name. Defaults to type-appropriate icon if not set. */
  icon?: NysAlertElement["icon"];

  /** Auto-dismiss after specified milliseconds. Set to 0 to disable. */
  duration?: NysAlertElement["duration"];

  /** Body text content. Ignored if slot content is provided. */
  text?: NysAlertElement["text"];

  /** URL for the primary action link. */
  primaryAction?: NysAlertElement["primaryAction"];

  /** URL for the secondary action link. */
  secondaryAction?: NysAlertElement["secondaryAction"];

  /** Label text for primary action link. */
  primaryLabel?: NysAlertElement["primaryLabel"];

  /** Label text for secondary action link. */
  secondaryLabel?: NysAlertElement["secondaryLabel"];

  /** Semantic alert type affecting color and ARIA role. `danger`/`emergency` use assertive live region. */
  type?: NysAlertElement["type"];

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

  /** Returns ARIA role and label based on alert type.
- 'alert' => assertive live region (implied)
- 'status' => polite live region
- 'region' => generic, requires aria-label */
  ariaAttributes?: NysAlertElement["ariaAttributes"];

  /** Returns live-region type for screen readers if applicable.
- 'polite' for status role
- undefined for alert (since it's implicitly assertive) or region */
  liveRegion?: NysAlertElement["liveRegion"];

  /** Fired when alert is dismissed. Detail: `{id, type, label}`. */
  onNysClose?: (event: CustomEvent) => void;
}

/**
 * Alert for contextual feedback with semantic types and live region support.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-close** - Fired when alert is dismissed. Detail: `{id, type, label}`.
 *
 * ### **Slots:**
 *  - _default_ - Default slot for custom body content. Overrides `text` prop when provided.
 */
export const NysAlert: React.ForwardRefExoticComponent<NysAlertProps>;

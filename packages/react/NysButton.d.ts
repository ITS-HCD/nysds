import React from "react";
import { NysButton as NysButtonElement, Event } from "../../dist/nysds.es.js";

export type { NysButtonElement, Event };

export interface NysButtonProps extends Pick<
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
  /** Expands button to fill container width. Use for mobile layouts or stacked button groups. */
  fullWidth?: boolean;

  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;

  /** Renders circular icon-only button. Requires `icon` prop. `label` becomes aria-label. */
  circle?: boolean;

  /** Prevents interaction. Avoid disabling without explanation—show validation errors instead. */
  disabled?: boolean;

  /** Unique identifier. Auto-generated if not provided. */
  id?: NysButtonElement["id"];

  /** Name for form submission. */
  name?: NysButtonElement["name"];

  /** Button height: `sm` (40px) for dense UIs, `md` (48px, default) for standard use, `lg` (56px) for prominent CTAs. */
  size?: NysButtonElement["size"];

  /** Visual style: `filled` for primary (one per section), `outline` for secondary, `ghost` for tertiary, `text` for inline actions. Avoid `text` for navigation. */
  variant?: NysButtonElement["variant"];

  /** Visible button text. Use sentence case, action-oriented text (e.g., "Save Draft"). Becomes aria-label in `circle` mode. */
  label?: NysButtonElement["label"];

  /** Screen reader label. Required for icon-only buttons if `label` is not set. */
  ariaLabel?: NysButtonElement["ariaLabel"];

  /** ID of controlled element (e.g., dropdown or modal). Sets `aria-controls`. */
  ariaControls?: NysButtonElement["ariaControls"];

  /** Material Symbol icon before label. Not shown for `text` variant or `circle` mode. */
  prefixIcon?: NysButtonElement["prefixIcon"];

  /** Material Symbol icon after label. Use `chevron_down` for dropdowns, `open_in_new` for external links. Not shown for `text` variant or `circle` mode. */
  suffixIcon?: NysButtonElement["suffixIcon"];

  /** Icon for circle mode. Required when `circle` is true. Scales with size (sm=24px, md=32px, lg=40px). */
  icon?: NysButtonElement["icon"];

  /** Form `id` to associate with. Use when button is outside the form element. */
  form?: NysButtonElement["form"];

  /** Value submitted with form data. Only used when `type="submit"`. */
  value?: NysButtonElement["value"];

  /** Additional screen reader description. Sets `aria-description`. */
  ariaDescription?: NysButtonElement["ariaDescription"];

  /** Form behavior: `button` (default, no form action), `submit` (submits form), `reset` (resets form). Always set explicitly to avoid unintended submissions. */
  type?: NysButtonElement["type"];

  /** URL to navigate to. Renders as `<a>` tag. Omit for action buttons. */
  href?: NysButtonElement["href"];

  /** Link target: `_self` (same tab), `_blank` (new tab—add `suffixIcon="open_in_new"`), `_parent`, `_top`, or frame name. */
  target?: NysButtonElement["target"];

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

  /** Click handler. Use instead of `@click` to ensure keyboard accessibility. */
  onClick?: NysButtonElement["onClick"];

  /** Fired when the button receives focus. */
  onNysFocus?: (event: CustomEvent) => void;

  /** Fired when the button loses focus. */
  onNysBlur?: (event: CustomEvent) => void;

  /** Fired when the button is clicked (mouse or keyboard). Not fired when disabled. */
  onNysClick?: (event: CustomEvent) => void;
}

/**
 * Button for actions and CTAs with variants, sizes, and icon support.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-focus** - Fired when the button receives focus.
 * - **nys-blur** - Fired when the button loses focus.
 * - **nys-click** - Fired when the button is clicked (mouse or keyboard). Not fired when disabled.
 *
 * ### **Slots:**
 *  - **prefix-icon** - Icon before label. Not shown for `text` variant.
 * - **suffix-icon** - Icon after label. Not shown for `text` variant.
 * - **circle-icon** - Icon for circle mode. Overrides `icon` prop.
 *
 * ### **CSS Properties:**
 *  - **--nys-button-color** - Text color of the button label. _(default: undefined)_
 * - **--nys-button-color--hover** - Text color when hovered. _(default: undefined)_
 * - **--nys-button-color--active** - Text color when active/pressed. _(default: undefined)_
 * - **--nys-button-background-color** - Background color of the button. _(default: undefined)_
 * - **--nys-button-background-color--hover** - Background color when hovered. _(default: undefined)_
 * - **--nys-button-background-color--active** - Background color when active/pressed. _(default: undefined)_
 * - **--nys-button-border-color** - Border color of the button. _(default: undefined)_
 * - **--nys-button-border-color--hover** - Border color when hovered. _(default: undefined)_
 * - **--nys-button-border-color--active** - Border color when active/pressed. _(default: undefined)_
 */
export const NysButton: React.ForwardRefExoticComponent<NysButtonProps>;

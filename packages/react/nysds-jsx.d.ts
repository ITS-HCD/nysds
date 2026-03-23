import type { NysAccordion } from "NysAccordion";
import type { NysAccordionItem, CustomEvent } from "NysAccordionItem";
import type { NysAlert, CustomEvent } from "NysAlert";
import type { NysAvatar } from "NysAvatar";
import type { NysBacktotop } from "NysBacktotop";
import type { NysBadge } from "NysBadge";
import type { NysButton, Event } from "NysButton";
import type { NysCheckbox, CustomEvent, Event } from "NysCheckbox";
import type { NysCheckboxgroup } from "NysCheckboxgroup";
import type { NysCombobox, CustomEvent, Event } from "NysCombobox";
import type { NysDatepicker, CustomEvent, Event } from "NysDatepicker";
import type { NysDivider } from "NysDivider";
import type { NysDropdownMenu } from "NysDropdownMenu";
import type { NysDropdownMenuItem, CustomEvent } from "NysDropdownMenuItem";
import type { NysErrorMessage } from "NysErrorMessage";
import type { NysFileinput, CustomEvent } from "NysFileinput";
import type { NysFileItem, CustomEvent } from "NysFileItem";
import type { NysGlobalFooter } from "NysGlobalFooter";
import type { NysGlobalHeader } from "NysGlobalHeader";
import type { NysIcon } from "NysIcon";
import type { NysLabel } from "NysLabel";
import type { NysModal, CustomEvent } from "NysModal";
import type { NysPagination, CustomEvent } from "NysPagination";
import type { NysRadiobutton, CustomEvent, Event } from "NysRadiobutton";
import type { NysRadiogroup } from "NysRadiogroup";
import type { NysOption } from "NysOption";
import type { NysSelect, CustomEvent, Event } from "NysSelect";
import type { NysSkipnav } from "NysSkipnav";
import type { NysStep } from "NysStep";
import type { NysStepper } from "NysStepper";
import type { NysTable } from "NysTable";
import type { NysTextarea, CustomEvent, Event } from "NysTextarea";
import type { NysTextinput, CustomEvent, Event } from "NysTextinput";
import type { NysToggle, CustomEvent, Event } from "NysToggle";
import type { NysTooltip } from "NysTooltip";
import type { NysUnavFooter } from "NysUnavFooter";
import type { NysUnavHeader } from "NysUnavHeader";

/**
 * This type can be used to create scoped tags for your components.
 *
 * Usage:
 *
 * ```ts
 * import type { ScopedElements } from "path/to/library/jsx-integration";
 *
 * declare module "my-library" {
 *   namespace JSX {
 *     interface IntrinsicElements
 *       extends ScopedElements<'test-', ''> {}
 *   }
 * }
 * ```
 *
 */
export type ScopedElements<Prefix extends string = "", Suffix extends string = ""> = {
  [Key in keyof CustomElements as `${Prefix}${Key}${Suffix}`]: CustomElements[Key];
};

type BaseProps = {
  /** Content added between the opening and closing tags of the element */
  children?: any;
  /** Used for declaratively styling one or more elements using CSS (Cascading Stylesheets) */
  class?: string;
  /** Used for declaratively styling one or more elements using CSS (Cascading Stylesheets) */
  className?: string;
  /** Takes an object where the key is the class name(s) and the value is a boolean expression. When true, the class is applied, and when false, it is removed. */
  classList?: Record<string, boolean | undefined>;
  /** Specifies the text direction of the element. */
  dir?: "ltr" | "rtl";
  /** Contains a space-separated list of the part names of the element that should be exposed on the host element. */
  exportparts?: string;
  /** For <label> and <output>, lets you associate the label with some control. */
  htmlFor?: string;
  /** Specifies whether the element should be hidden. */
  hidden?: boolean | string;
  /** A unique identifier for the element. */
  id?: string;
  /** Keys tell React which array item each component corresponds to */
  key?: string | number;
  /** Specifies the language of the element. */
  lang?: string;
  /** Contains a space-separated list of the part names of the element. Part names allows CSS to select and style specific elements in a shadow tree via the ::part pseudo-element. */
  part?: string;
  /** Use the ref attribute with a variable to assign a DOM element to the variable once the element is rendered. */
  ref?: unknown | ((e: unknown) => void);
  /** Adds a reference for a custom element slot */
  slot?: string;
  /** Prop for setting inline styles */
  style?: Record<string, string | number>;
  /** Overrides the default Tab button behavior. Avoid using values other than -1 and 0. */
  tabIndex?: number;
  /** Specifies the tooltip text for the element. */
  title?: string;
  /** Passing 'no' excludes the element content from being translated. */
  translate?: "yes" | "no";
};

type BaseEvents = {};

export type NysAccordionProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysAccordion["id"];
  /** Only one item can be expanded at a time. Expanding one collapses others. */
  singleSelect?: NysAccordion["singleSelect"];
  /** Adds borders around each accordion item. Propagates to all children. */
  bordered?: NysAccordion["bordered"];
};

export type NysAccordionItemProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysAccordionItem["id"];
  /** Heading text displayed in the clickable toggle button. */
  heading?: NysAccordionItem["heading"];
  /** Whether the content panel is visible. Toggle via click or keyboard. */
  expanded?: NysAccordionItem["expanded"];
  /** Adds border styling. Set by parent `nys-accordion`, not directly. */
  bordered?: NysAccordionItem["bordered"];

  /** Fired when expanded state changes. Detail: `{id, heading, expanded}`. */
  "onnys-accordionitem-toggle"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysAlertProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysAlert["id"];
  /** Bold heading text displayed at the top of the alert. */
  heading?: NysAlert["heading"];
  /** Custom icon name. Defaults to type-appropriate icon if not set. */
  icon?: NysAlert["icon"];
  /** Shows close button allowing users to dismiss the alert. */
  dismissible?: NysAlert["dismissible"];
  /** Auto-dismiss after specified milliseconds. Set to 0 to disable. */
  duration?: NysAlert["duration"];
  /** Body text content. Ignored if slot content is provided. */
  text?: NysAlert["text"];
  /** URL for the primary action link. */
  primaryAction?: NysAlert["primaryAction"];
  /** URL for the secondary action link. */
  secondaryAction?: NysAlert["secondaryAction"];
  /** Label text for primary action link. */
  primaryLabel?: NysAlert["primaryLabel"];
  /** Label text for secondary action link. */
  secondaryLabel?: NysAlert["secondaryLabel"];
  /** Semantic alert type affecting color and ARIA role. `danger`/`emergency` use assertive live region. */
  type?: NysAlert["type"];
  /** Returns ARIA role and label based on alert type.
- 'alert' => assertive live region (implied)
- 'status' => polite live region
- 'region' => generic, requires aria-label */
  ariaAttributes?: NysAlert["ariaAttributes"];
  /** Returns live-region type for screen readers if applicable.
- 'polite' for status role
- undefined for alert (since it's implicitly assertive) or region */
  liveRegion?: NysAlert["liveRegion"];
  /** Fired when alert is dismissed. Detail: `{id, type, label}`. */
  "onnys-close"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysAvatarProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysAvatar["id"];
  /** Accessible label for screen readers. Required when no image `alt` is available. */
  ariaLabel?: NysAvatar["ariaLabel"];
  /** Image URL. Takes priority over initials and icon. */
  image?: NysAvatar["image"];
  /** 1-2 character initials. Used when no image is provided. */
  initials?: NysAvatar["initials"];
  /** Custom icon name. Falls back to `account_circle` if not set. */
  icon?: NysAvatar["icon"];
  /** Background color. Foreground auto-adjusts for contrast. Accepts CSS values or variables. */
  color?: NysAvatar["color"];
  /** Makes avatar clickable with button role and focus ring. */
  interactive?: NysAvatar["interactive"];
  /** Prevents interaction when `interactive` is true. */
  disabled?: NysAvatar["disabled"];
  /** Enables lazy loading for the image. */
  lazy?: NysAvatar["lazy"];
};

export type NysBacktotopProps = {
  /** Horizontal position: `left` or `right`. */
  position?: NysBacktotop["position"];
  /** Force button visibility. Overrides auto-show scroll behavior. */
  visible?: NysBacktotop["visible"];
};

export type NysBadgeProps = {
  /** Unique identifier. */
  id?: NysBadge["id"];
  /** Name attribute for form association. */
  name?: NysBadge["name"];
  /** Badge size: `sm` (smaller text) or `md` (default). */
  size?: NysBadge["size"];
  /** Semantic intent affecting color: `neutral`, `error`, `success`, or `warning`. */
  intent?: NysBadge["intent"];
  /** Secondary label displayed before the main label. */
  prefixLabel?: NysBadge["prefixLabel"];
  /** Primary label text displayed in the badge. */
  label?: NysBadge["label"];
  /**  */
  variant?: NysBadge["variant"];
  /**  */
  prefixicon?: NysBadge["prefixIcon"];
  /**  */
  suffixicon?: NysBadge["suffixIcon"];
};

export type NysButtonProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysButton["id"];
  /** Name for form submission. */
  name?: NysButton["name"];
  /** Button height: `sm` (40px) for dense UIs, `md` (48px, default) for standard use, `lg` (56px) for prominent CTAs. */
  size?: NysButton["size"];
  /** Expands button to fill container width. Use for mobile layouts or stacked button groups. */
  fullWidth?: NysButton["fullWidth"];
  /** Visual style: `filled` for primary (one per section), `outline` for secondary, `ghost` for tertiary, `text` for inline actions. Avoid `text` for navigation. */
  variant?: NysButton["variant"];
  /** Adjusts colors for dark backgrounds. */
  inverted?: NysButton["inverted"];
  /** Visible button text. Use sentence case, action-oriented text (e.g., "Save Draft"). Becomes aria-label in `circle` mode. */
  label?: NysButton["label"];
  /** Screen reader label. Required for icon-only buttons if `label` is not set. */
  ariaLabel?: NysButton["ariaLabel"];
  /** ID of controlled element (e.g., dropdown or modal). Sets `aria-controls`. */
  ariaControls?: NysButton["ariaControls"];
  /** Material Symbol icon before label. Not shown for `text` variant or `circle` mode. */
  prefixIcon?: NysButton["prefixIcon"];
  /** Material Symbol icon after label. Use `chevron_down` for dropdowns, `open_in_new` for external links. Not shown for `text` variant or `circle` mode. */
  suffixIcon?: NysButton["suffixIcon"];
  /** Renders circular icon-only button. Requires `icon` prop. `label` becomes aria-label. */
  circle?: NysButton["circle"];
  /** Icon for circle mode. Required when `circle` is true. Scales with size (sm=24px, md=32px, lg=40px). */
  icon?: NysButton["icon"];
  /** Prevents interaction. Avoid disabling without explanation—show validation errors instead. */
  disabled?: NysButton["disabled"];
  /** Form `id` to associate with. Use when button is outside the form element. */
  form?: NysButton["form"];
  /** Value submitted with form data. Only used when `type="submit"`. */
  value?: NysButton["value"];
  /** Additional screen reader description. Sets `aria-description`. */
  ariaDescription?: NysButton["ariaDescription"];
  /** Form behavior: `button` (default, no form action), `submit` (submits form), `reset` (resets form). Always set explicitly to avoid unintended submissions. */
  type?: NysButton["type"];
  /** URL to navigate to. Renders as `<a>` tag. Omit for action buttons. */
  href?: NysButton["href"];
  /** Link target: `_self` (same tab), `_blank` (new tab—add `suffixIcon="open_in_new"`), `_parent`, `_top`, or frame name. */
  target?: NysButton["target"];
  /** Click handler. Use instead of `@click` to ensure keyboard accessibility. */
  onClick?: NysButton["onClick"];
  /** Fired when the button receives focus. */
  "onnys-focus"?: (e: CustomEvent<Event>) => void;
  /** Fired when the button loses focus. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
  /** Fired when the button is clicked (mouse or keyboard). Not fired when disabled. */
  "onnys-click"?: (e: CustomEvent<Event>) => void;
};

export type NysCheckboxProps = {
  /** Whether checkbox is checked. */
  checked?: NysCheckbox["checked"];
  /** Prevents interaction. */
  disabled?: NysCheckbox["disabled"];
  /** Marks as required. Validates that checkbox is checked. */
  required?: NysCheckbox["required"];
  /** Visible label text. Required for accessibility. */
  label?: NysCheckbox["label"];
  /** Helper text below label. Use slot for custom HTML. */
  description?: NysCheckbox["description"];
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysCheckbox["id"];
  /** Name for form submission. Use same name for grouped checkboxes. */
  name?: NysCheckbox["name"];
  /** Value submitted when checked. */
  value?: NysCheckbox["value"];
  /** Form `id` to associate with when checkbox is outside form element. */
  form?: NysCheckbox["form"];
  /** Shows error message when true. */
  showError?: NysCheckbox["showError"];
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysCheckbox["errorMessage"];
  /** Internal: Set by parent checkboxgroup. Do not set manually. */
  groupExist?: NysCheckbox["groupExist"];
  /** Renders as tile with larger clickable area. Apply to group for consistency. */
  tile?: NysCheckbox["tile"];
  /** Adjusts colors for dark backgrounds. */
  inverted?: NysCheckbox["inverted"];
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysCheckbox["tooltip"];
  /** Checkbox size: `sm` (24px) or `md` (32px, default). */
  size?: NysCheckbox["size"];
  /**  */
  other?: NysCheckbox["other"];
  /**  */
  showOtherError?: NysCheckbox["showOtherError"];
  /**  */
  _hasDescription?: NysCheckbox["_hasDescription"];
  /** Fired when checked state changes. Detail: `{id, checked, name, value}`. */
  "onnys-change"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when "other" text input value changes. Detail: `{id, name, value}`. */
  "onnys-other-input"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when checkbox gains focus. */
  "onnys-focus"?: (e: CustomEvent<Event>) => void;
  /** Fired when checkbox loses focus. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
  /**  */
  "onnys-error"?: (e: CustomEvent<CustomEvent>) => void;
  /**  */
  "onnys-error-clear"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysCheckboxgroupProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysCheckboxgroup["id"];
  /** Name for form submission. Set on group, not individual checkboxes. */
  name?: NysCheckboxgroup["name"];
  /** Requires at least one checkbox to be checked. */
  required?: NysCheckboxgroup["required"];
  /** Shows "Optional" flag. */
  optional?: NysCheckboxgroup["optional"];
  /** Shows error message when true. */
  showError?: NysCheckboxgroup["showError"];
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysCheckboxgroup["errorMessage"];
  /** Visible label text for the group. */
  label?: NysCheckboxgroup["label"];
  /** Helper text below label. Use slot for custom HTML. */
  description?: NysCheckboxgroup["description"];
  /** Renders all checkboxes as tiles with larger clickable area. */
  tile?: NysCheckboxgroup["tile"];
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysCheckboxgroup["tooltip"];
  /** Adjusts colors for dark backgrounds. Applied to all children. */
  inverted?: NysCheckboxgroup["inverted"];
  /** Form `id` to associate with. Applied to all children. */
  form?: NysCheckboxgroup["form"];
  /** Checkbox size for all children: `sm` (24px) or `md` (32px, default). */
  size?: NysCheckboxgroup["size"];
};

export type NysComboboxProps = {
  /**  */
  id?: NysCombobox["id"];
  /**  */
  name?: NysCombobox["name"];
  /**  */
  label?: NysCombobox["label"];
  /**  */
  description?: NysCombobox["description"];
  /**  */
  value?: NysCombobox["value"];
  /**  */
  disabled?: NysCombobox["disabled"];
  /**  */
  required?: NysCombobox["required"];
  /**  */
  optional?: NysCombobox["optional"];
  /**  */
  tooltip?: NysCombobox["tooltip"];
  /**  */
  form?: NysCombobox["form"];
  /**  */
  width?: NysCombobox["width"];
  /**  */
  inverted?: NysCombobox["inverted"];
  /**  */
  showError?: NysCombobox["showError"];
  /**  */
  errorMessage?: NysCombobox["errorMessage"];

  /** Fired on input change. Detail: `{ id, value }`. */
  "onnys-input"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when combobox receives focus. */
  "onnys-focus"?: (e: CustomEvent<Event>) => void;
  /** Fired when combobox loses focus. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
  /** Fired when selection changes. Detail: `{ id, value }`. */
  "onnys-change"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysDatepickerProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysDatepicker["id"];
  /** Name for form submission. */
  name?: NysDatepicker["name"];
  /** Input width: `md` (200px), `lg` (384px), `full` (100%). */
  width?: NysDatepicker["width"];
  /** Hide the "Today" button in calendar popup. */
  hideTodayButton?: NysDatepicker["hideTodayButton"];
  /** Hide the "Clear" button in calendar popup. */
  hideClearButton?: NysDatepicker["hideClearButton"];
  /** Disable interaction. */
  disabled?: NysDatepicker["disabled"];
  /** Mark as required. Shows "Required" flag and validates on blur. */
  required?: NysDatepicker["required"];
  /** Show "Optional" flag. Use when most fields are required. */
  optional?: NysDatepicker["optional"];
  /** Show error state. */
  showError?: NysDatepicker["showError"];
  /** Error message text. */
  errorMessage?: NysDatepicker["errorMessage"];
  /** Form `id` to associate with when input is outside form. */
  form?: NysDatepicker["form"];
  /** Tooltip text on info icon hover. */
  tooltip?: NysDatepicker["tooltip"];
  /** Input type. Currently only supports `date`. */
  type?: NysDatepicker["type"];
  /** Label text. Required for accessibility. */
  label?: NysDatepicker["label"];
  /** Helper text below label. */
  description?: NysDatepicker["description"];
  /** Initial date when calendar opens (YYYY-MM-DD). */
  startDate?: NysDatepicker["startDate"];
  /** Dark background mode. */
  inverted?: NysDatepicker["inverted"];
  /** Selected date. Accepts Date object or ISO string (YYYY-MM-DD). */
  value?: NysDatepicker["value"];

  /** Fired on date selection. Detail: `{id, value}`. */
  "onnys-input"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when input or calendar loses focus. Triggers validation. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
};

export type NysDividerProps = {
  /** Adjusts colors for dark backgrounds. */
  inverted?: NysDivider["inverted"];
};

export type NysDropdownMenuProps = {
  /**  */
  for?: NysDropdownMenu["for"];
  /**  */
  showDropdown?: NysDropdownMenu["showDropdown"];
  /** Preferred position relative to trigger. */
  position?: NysDropdownMenu["position"];
};

export type NysDropdownMenuItemProps = {
  /**  */
  label?: NysDropdownMenuItem["label"];
  /**  */
  href?: NysDropdownMenuItem["href"];
  /**  */
  disabled?: NysDropdownMenuItem["disabled"];
  /**  */
  target?: NysDropdownMenuItem["target"];
  /**  */
  prefixIcon?: NysDropdownMenuItem["prefixIcon"];
  /**  */
  divider?: NysDropdownMenuItem["divider"];

  /**  */
  "onnys-click"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysErrorMessageProps = {
  /** Whether to display the error message. */
  showError?: NysErrorMessage["showError"];
  /** Error text to display. Falls back to native validation message if available. */
  errorMessage?: NysErrorMessage["errorMessage"];
  /** Shows a divider line above the error message. */
  showDivider?: NysErrorMessage["showDivider"];
};

export type NysFileinputProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysFileinput["id"];
  /** Name for form submission. */
  name?: NysFileinput["name"];
  /** Visible label text. */
  label?: NysFileinput["label"];
  /** Helper text below label. Use slot for custom HTML. */
  description?: NysFileinput["description"];
  /** Allows selecting multiple files. */
  multiple?: NysFileinput["multiple"];
  /** Form `id` to associate with. */
  form?: NysFileinput["form"];
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysFileinput["tooltip"];
  /** Accepted file types. Use MIME types (`image/*`) or extensions (`.pdf`). Validated via magic bytes. */
  accept?: NysFileinput["accept"];
  /** Prevents interaction. */
  disabled?: NysFileinput["disabled"];
  /** Requires at least one file to be uploaded. */
  required?: NysFileinput["required"];
  /** Shows "Optional" flag. */
  optional?: NysFileinput["optional"];
  /** Shows error message when true. */
  showError?: NysFileinput["showError"];
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysFileinput["errorMessage"];
  /** Enables drag-and-drop zone UI. */
  dropzone?: NysFileinput["dropzone"];
  /** Component width: `lg` (384px) or `full` (100%, default). */
  width?: NysFileinput["width"];
  /** Adjusts colors for dark backgrounds. */
  inverted?: NysFileinput["inverted"];

  /** Fired when files are added or removed. Detail: `{id, files}`. */
  "onnys-change"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysFileItemProps = {
  /** Name of the file being displayed. */
  filename?: NysFileItem["filename"];
  /** Upload status: `pending` (queued), `processing` (uploading), `done` (complete), `error` (failed). */
  status?: NysFileItem["status"];
  /** Upload progress percentage (0-100). Only shown when status is `processing`. */
  progress?: NysFileItem["progress"];
  /** Error message displayed when status is `error`. */
  errorMessage?: NysFileItem["errorMessage"];

  /** Fired when remove button is clicked. Detail: `{filename}`. */
  "onnys-fileRemove"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysGlobalFooterProps = {
  /** Agency name displayed as the footer heading. */
  agencyName?: NysGlobalFooter["agencyName"];
  /** URL for the agency name link. If empty, name is not clickable. */
  homepageLink?: NysGlobalFooter["homepageLink"];
};

export type NysGlobalHeaderProps = {
  /** Application name displayed prominently. */
  appName?: NysGlobalHeader["appName"];
  /** Agency name displayed below app name (or as main title if no appName). */
  agencyName?: NysGlobalHeader["agencyName"];
  /** URL for the header title link. If empty, title is not clickable. */
  homepageLink?: NysGlobalHeader["homepageLink"];
};

export type NysIconProps = {
  /** Icon name from Material Symbols library. Required. */
  name?: NysIcon["name"];
  /** Accessible label. When set, removes `aria-hidden` and adds `aria-label` to the SVG. */
  ariaLabel?: NysIcon["ariaLabel"];
  /** Rotation in degrees. Applied via CSS `rotate`. */
  rotate?: NysIcon["rotate"];
  /** Flip direction: `horizontal`, `vertical`, or empty for none. */
  flip?: NysIcon["flip"];
  /** Icon color. Accepts any CSS color value. Defaults to `currentcolor`. */
  color?: NysIcon["color"];
  /** Icon size. Semantic sizes: `xs`-`5xl`. Pixel sizes: `12`-`50`. */
  size?: NysIcon["size"];
};

export type NysLabelProps = {
  /** ID of the form element this label is associated with. */
  for?: NysLabel["for"];
  /** Label text displayed above the form field. */
  label?: NysLabel["label"];
  /** Helper text displayed below the label. */
  description?: NysLabel["description"];
  /** Flag type: `required` shows asterisk, `optional` shows "(Optional)". */
  flag?: NysLabel["flag"];
  /** Adjusts colors for dark backgrounds. */
  inverted?: NysLabel["inverted"];
  /** Tooltip text shown on hover/focus of info icon next to label. */
  tooltip?: NysLabel["tooltip"];
};

export type NysModalProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysModal["id"];
  /** Modal heading text. Required for accessibility. */
  heading?: NysModal["heading"];
  /** Secondary heading below the main heading. */
  subheading?: NysModal["subheading"];
  /** Controls modal visibility. Set to `true` to show. */
  open?: NysModal["open"];
  /** Prevents dismissal via close button or Escape key. User must take an action. */
  mandatory?: NysModal["mandatory"];
  /** Modal width: `sm` (400px), `md` (600px), or `lg` (800px). */
  width?: NysModal["width"];

  /** Fired when modal opens. Detail: `{id}`. */
  "onnys-open"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when modal closes. Detail: `{id}`. */
  "onnys-close"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysPaginationProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysPagination["id"];
  /** Name attribute for form association. */
  name?: NysPagination["name"];
  /** Currently active page (1-indexed). Clamped to valid range. */
  currentPage?: NysPagination["currentPage"];
  /** Total number of pages. Must be at least 1. */
  totalPages?: NysPagination["totalPages"];
  /** Internal state for layout adjustments near the end. */
  _twoBeforeLast?: NysPagination["_twoBeforeLast"];

  /** Fired when page changes. Detail: `{page}`. */
  "onnys-change"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysRadiobuttonProps = {
  /** Whether this radio is selected. Only one per group can be checked. */
  checked?: NysRadiobutton["checked"];
  /** Prevents interaction. */
  disabled?: NysRadiobutton["disabled"];
  /** Marks group as required. Set on radiogroup, not individual radios. */
  required?: NysRadiobutton["required"];
  /** Visible label text. Required for accessibility. */
  label?: NysRadiobutton["label"];
  /** Helper text below label. Use slot for custom HTML. */
  description?: NysRadiobutton["description"];
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysRadiobutton["id"];
  /** Group name. Radios with same name are mutually exclusive. */
  name?: NysRadiobutton["name"];
  /** Value submitted when this radio is selected. */
  value?: NysRadiobutton["value"];
  /** Adjusts colors for dark backgrounds. */
  inverted?: NysRadiobutton["inverted"];
  /** Form `id` to associate with. */
  form?: NysRadiobutton["form"];
  /** Radio size: `sm` (24px) or `md` (32px, default). */
  size?: NysRadiobutton["size"];
  /** Renders as tile with larger clickable area. */
  tile?: NysRadiobutton["tile"];
  /**  */
  other?: NysRadiobutton["other"];
  /**  */
  showOtherError?: NysRadiobutton["showOtherError"];

  /**  */
  "onnys-error-clear"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when selection changes. Detail: `{id, checked, name, value}`. */
  "onnys-change"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when "other" text input value changes. Detail: `{id, name, value}`. */
  "onnys-other-input"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when radio gains focus. */
  "onnys-focus"?: (e: CustomEvent<Event>) => void;
  /** Fired when radio loses focus. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
  /**  */
  "onnys-error"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysRadiogroupProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysRadiogroup["id"];
  /** Name for form submission. Auto-populated from child radiobuttons. */
  name?: NysRadiogroup["name"];
  /** Requires a selection before form submission. */
  required?: NysRadiogroup["required"];
  /** Shows "Optional" flag. */
  optional?: NysRadiogroup["optional"];
  /** Shows error message when true. */
  showError?: NysRadiogroup["showError"];
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysRadiogroup["errorMessage"];
  /** Visible label text for the group. */
  label?: NysRadiogroup["label"];
  /** Helper text below label. Use slot for custom HTML. */
  description?: NysRadiogroup["description"];
  /** Renders all radiobuttons as tiles with larger clickable area. */
  tile?: NysRadiogroup["tile"];
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysRadiogroup["tooltip"];
  /** Adjusts colors for dark backgrounds. Applied to all children. */
  inverted?: NysRadiogroup["inverted"];
  /** Form `id` to associate with. Applied to all children. */
  form?: NysRadiogroup["form"];
  /** Radio size for all children: `sm` (24px) or `md` (32px, default). */
  size?: NysRadiogroup["size"];
};

export type NysOptionProps = {
  /** Prevents selection of this option. */
  disabled?: NysOption["disabled"];
  /** Pre-selects this option. */
  selected?: NysOption["selected"];
  /** Value submitted when this option is selected. */
  value?: NysOption["value"];
  /** Display text for the option. Auto-populated from slot content if not set. */
  label?: NysOption["label"];
  /** Hides the option from the dropdown list. */
  hidden?: NysOption["hidden"];
};

export type NysSelectProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysSelect["id"];
  /** Name for form submission. */
  name?: NysSelect["name"];
  /** Visible label text. Required for accessibility. */
  label?: NysSelect["label"];
  /** Helper text below label. Use slot for custom HTML. */
  description?: NysSelect["description"];
  /** Currently selected option value. */
  value?: NysSelect["value"];
  /** Prevents interaction. */
  disabled?: NysSelect["disabled"];
  /** Marks as required. Shows "Required" flag and validates on blur. */
  required?: NysSelect["required"];
  /** Shows "Optional" flag. Use when most fields are required. */
  optional?: NysSelect["optional"];
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysSelect["tooltip"];
  /** Form `id` to associate with when select is outside form element. */
  form?: NysSelect["form"];
  /** Adjusts colors for dark backgrounds. */
  inverted?: NysSelect["inverted"];
  /** Shows error message when true. Set by validation or manually. */
  showError?: NysSelect["showError"];
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysSelect["errorMessage"];
  /** Select width: `sm` (88px), `md` (200px), `lg` (384px), `full` (100%, default). */
  width?: NysSelect["width"];

  /** Fired when selection changes. Detail: `{id, value}`. */
  "onnys-change"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when select gains focus. */
  "onnys-focus"?: (e: CustomEvent<Event>) => void;
  /** Fired when select loses focus. Triggers validation. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
};

export type NysSkipnavProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysSkipnav["id"];
  /** Target element ID (with `#`). Defaults to `#main-content`. */
  href?: NysSkipnav["href"];
};

export type NysStepProps = {
  /** Whether this step is currently being viewed. Set by parent stepper. */
  selected?: NysStep["selected"];
  /** Marks the furthest reached step. Steps before this are navigable. */
  current?: NysStep["current"];
  /** Step label text displayed alongside the step number. */
  label?: NysStep["label"];
  /** URL for page navigation when step is clicked. Optional for SPA routing. */
  href?: NysStep["href"];
  /** Internal: Whether parent stepper's compact view is expanded. */
  isCompactExpanded?: NysStep["isCompactExpanded"];
  /** Step number (1-indexed). Auto-assigned by parent stepper. */
  stepNumber?: NysStep["stepNumber"];
  /** Custom click handler. Called before `nys-step-click` event. */
  onClick?: NysStep["onClick"];
  /** Fired when a navigable step is clicked. Detail: `{href, label}`. Cancelable. */
  "onnys-step-click"?: (e: CustomEvent<never>) => void;
};

export type NysStepperProps = {
  /** Unique identifier. */
  id?: NysStepper["id"];
  /** Name attribute for form association. */
  name?: NysStepper["name"];
  /** Title displayed above the step counter. */
  label?: NysStepper["label"];
  /** Progress text (e.g., "Step 2 of 5"). Auto-updated based on selection. */
  counterText?: NysStepper["counterText"];
  /** Whether compact mobile view is expanded to show all steps. */
  isCompactExpanded?: NysStepper["isCompactExpanded"];
};

export type NysTableProps = {
  /**  */
  id?: NysTable["id"];
  /**  */
  name?: NysTable["name"];
  /**  */
  striped?: NysTable["striped"];
  /**  */
  sortable?: NysTable["sortable"];
  /**  */
  bordered?: NysTable["bordered"];
  /**  */
  download?: NysTable["download"];

  /** Fired when the download button or sortable headers are clicked. */
  "onnys-click"?: (e: CustomEvent<never>) => void;
  /** Fired when a sortable column header is clicked.  Can be prevented by calling `event.preventDefault()` to override default sort behavior. Detail: { columnIndex: number, columnLabel: string, sortDirection: "asc" | "desc" | "none" } */
  "onnys-column-sort"?: (e: CustomEvent<never>) => void;
};

export type NysTextareaProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysTextarea["id"];
  /** Name for form submission. */
  name?: NysTextarea["name"];
  /** Visible label text. Required for accessibility. */
  label?: NysTextarea["label"];
  /** Helper text below label. Use slot for custom HTML. */
  description?: NysTextarea["description"];
  /** Placeholder text. Don't use as label replacement. */
  placeholder?: NysTextarea["placeholder"];
  /** Current textarea value. */
  value?: NysTextarea["value"];
  /** Prevents interaction. */
  disabled?: NysTextarea["disabled"];
  /** Makes textarea read-only but focusable. */
  readonly?: NysTextarea["readonly"];
  /** Marks as required. Shows "Required" flag and validates on blur. */
  required?: NysTextarea["required"];
  /** Shows "Optional" flag. Use when most fields are required. */
  optional?: NysTextarea["optional"];
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysTextarea["tooltip"];
  /** Adjusts colors for dark backgrounds. */
  inverted?: NysTextarea["inverted"];
  /** Form `id` to associate with when textarea is outside form element. */
  form?: NysTextarea["form"];
  /** Maximum character length. */
  maxlength?: NysTextarea["maxlength"];
  /** Textarea width: `sm` (88px), `md` (200px), `lg` (384px), `full` (100%, default). */
  width?: NysTextarea["width"];
  /** Visible height in lines. */
  rows?: NysTextarea["rows"];
  /** Resize behavior: `vertical` (default, user can resize height), `none` (fixed size). */
  resize?: NysTextarea["resize"];
  /** Shows error message when true. Set by validation or manually. */
  showError?: NysTextarea["showError"];
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysTextarea["errorMessage"];

  /** Fired on input change. Detail: `{id, value}`. */
  "onnys-input"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when textarea gains focus. */
  "onnys-focus"?: (e: CustomEvent<Event>) => void;
  /** Fired when textarea loses focus. Triggers validation. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
  /** Fired when user selects text. Detail: `{id, value}`. */
  "onnys-select"?: (e: CustomEvent<CustomEvent>) => void;
  /**  */
  "onnys-selectionchange"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysTextinputProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysTextinput["id"];
  /** Name for form submission. */
  name?: NysTextinput["name"];
  /** Input type: `text` (default), `email`, `number`, `password`, `search`, `tel` (auto-masked), `url`. */
  type?: NysTextinput["type"];
  /** Visible label text. Required for accessibility. */
  label?: NysTextinput["label"];
  /** Helper text below label. Use slot for custom HTML. */
  description?: NysTextinput["description"];
  /** Placeholder text. Don't use as label replacement. */
  placeholder?: NysTextinput["placeholder"];
  /** Current input value. */
  value?: NysTextinput["value"];
  /** Prevents interaction. */
  disabled?: NysTextinput["disabled"];
  /** Makes input read-only but focusable. */
  readonly?: NysTextinput["readonly"];
  /** Marks as required. Shows "Required" flag and validates on blur. */
  required?: NysTextinput["required"];
  /** Shows "Optional" flag. Use when most fields are required. */
  optional?: NysTextinput["optional"];
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: NysTextinput["tooltip"];
  /** Form `id` to associate with when input is outside form element. */
  form?: NysTextinput["form"];
  /** Regex pattern for validation. Shows error on mismatch. */
  pattern?: NysTextinput["pattern"];
  /** Maximum character length. */
  maxlength?: NysTextinput["maxlength"];
  /** Accessible label. When set, assuming "label" isn't provided for private special cases (i.e., <checkbox other>). */
  ariaLabel?: NysTextinput["ariaLabel"];
  /** Input width: `sm` (88px), `md` (200px), `lg` (384px), `full` (100%, default). */
  width?: NysTextinput["width"];
  /** Step increment for `type="number"`. */
  step?: NysTextinput["step"];
  /** Minimum value for `type="number"`. */
  min?: NysTextinput["min"];
  /** Maximum value for `type="number"`. */
  max?: NysTextinput["max"];
  /** Adjusts colors for dark backgrounds. */
  inverted?: NysTextinput["inverted"];
  /** Shows error message when true. Set by validation or manually. */
  showError?: NysTextinput["showError"];
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: NysTextinput["errorMessage"];

  /** Fired on input change. Detail: `{id, value}`. */
  "onnys-input"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when input gains focus. */
  "onnys-focus"?: (e: CustomEvent<Event>) => void;
  /** Fired when input loses focus. Triggers validation. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
};

export type NysToggleProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysToggle["id"];
  /** Name for form submission. */
  name?: NysToggle["name"];
  /** Value submitted when toggle is on. */
  value?: NysToggle["value"];
  /** Visible label text. */
  label?: NysToggle["label"];
  /** Helper text below label. Use slot for custom HTML. */
  description?: NysToggle["description"];
  /** Form `id` to associate with. */
  form?: NysToggle["form"];
  /** Whether toggle is on. */
  checked?: NysToggle["checked"];
  /** Prevents interaction. */
  disabled?: NysToggle["disabled"];
  /** Hides check/close icon inside toggle knob. */
  noIcon?: NysToggle["noIcon"];
  /** Adjusts colors for dark backgrounds. */
  inverted?: NysToggle["inverted"];
  /** Toggle size: `sm` or `md` (default). */
  size?: NysToggle["size"];

  /** Fired when toggle state changes. Detail: `{id, checked}`. */
  "onnys-change"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when toggle gains focus. */
  "onnys-focus"?: (e: CustomEvent<Event>) => void;
  /** Fired when toggle loses focus. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
};

export type NysTooltipProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: NysTooltip["id"];
  /** Tooltip content text. Required. */
  text?: NysTooltip["text"];
  /** Adjusts colors for dark backgrounds. */
  inverted?: NysTooltip["inverted"];
  /** ID of the trigger element to attach this tooltip to. Required. */
  for?: NysTooltip["for"];
  /** Preferred position relative to trigger. Auto-adjusts if space is insufficient. */
  position?: NysTooltip["position"];
};

export type NysUnavFooterProps = {};

export type NysUnavHeaderProps = {
  /** Internal: Whether trust bar panel is expanded. */
  trustbarVisible?: NysUnavHeader["trustbarVisible"];
  /** Internal: Whether search dropdown is visible (mobile). */
  searchDropdownVisible?: NysUnavHeader["searchDropdownVisible"];
  /** Internal: Whether language dropdown is visible. */
  languageVisible?: NysUnavHeader["languageVisible"];
  /** Internal: Whether search input is focused. */
  isSearchFocused?: NysUnavHeader["isSearchFocused"];
  /** Hides the translation dropdown. */
  hideTranslate?: NysUnavHeader["hideTranslate"];
  /** Hides the search functionality. */
  hideSearch?: NysUnavHeader["hideSearch"];
  /** The URL endpoint of the search, make sure to include the query param. */
  searchUrl?: NysUnavHeader["searchUrl"];
  /** The list of languages this site can be translated to, default to use Smartling */
  languages?: NysUnavHeader["languages"];
};

export type CustomElements = {
  /**
   * Container for accordion items with optional single-select and bordered styling.
   * ---
   *
   *
   * ### **Slots:**
   *  - _default_ - Default slot for `nys-accordionitem` elements.
   *
   * ### **CSS Properties:**
   *  - **--nys-accordion-background-color--header** - Background color of the accordion header. _(default: undefined)_
   * - **--nys-accordion-background-color--header--hover** - Background hover color of the accordion header. _(default: undefined)_
   * - **--nys-accordion-content-max-width** - Maximum readable width of accordion content. Defaults to a character-based width (80ch) for readability. _(default: undefined)_
   */
  "nys-accordion": Partial<NysAccordionProps & BaseProps & BaseEvents>;

  /**
   * Collapsible panel for use within nys-accordion with keyboard support.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-accordionitem-toggle** - Fired when expanded state changes. Detail: `{id, heading, expanded}`.
   *
   * ### **Slots:**
   *  - _default_ - Default slot for panel content shown when expanded.
   */
  "nys-accordionitem": Partial<NysAccordionItemProps & BaseProps & BaseEvents>;

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
  "nys-alert": Partial<NysAlertProps & BaseProps & BaseEvents>;

  /**
   * User avatar with image, initials, or icon fallback and contrast-aware colors.
   * ---
   *
   *
   * ### **Slots:**
   *  - _default_ - Custom icon content. Overrides default icon when no image or initials.
   */
  "nys-avatar": Partial<NysAvatarProps & BaseProps & BaseEvents>;

  /**
   * Floating back-to-top button with auto-show behavior and smooth scroll.
   * ---
   *
   */
  "nys-backtotop": Partial<NysBacktotopProps & BaseProps & BaseEvents>;

  /**
   * Compact label for status, counts, or categorization with semantic styling.
   * ---
   *
   */
  "nys-badge": Partial<NysBadgeProps & BaseProps & BaseEvents>;

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
  "nys-button": Partial<NysButtonProps & BaseProps & BaseEvents>;

  /**
   * Checkbox for binary choices or multi-select options.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-change** - Fired when checked state changes. Detail: `{id, checked, name, value}`.
   * - **nys-other-input** - Fired when "other" text input value changes. Detail: `{id, name, value}`.
   * - **nys-focus** - Fired when checkbox gains focus.
   * - **nys-blur** - Fired when checkbox loses focus.
   * - **nys-error**
   * - **nys-error-clear**
   *
   * ### **Methods:**
   *  - **checkValidity(): _boolean_** - Functions
   * --------------------------------------------------------------------------
   *
   * ### **Slots:**
   *  - **description** - Custom HTML description content.
   */
  "nys-checkbox": Partial<NysCheckboxProps & BaseProps & BaseEvents>;

  /**
   * Container for grouping checkboxes as a single form control.
   * ---
   *
   *
   * ### **Slots:**
   *  - _default_ - Default slot for `nys-checkbox` elements.
   * - **description** - Custom HTML description content.
   */
  "nys-checkboxgroup": Partial<NysCheckboxgroupProps & BaseProps & BaseEvents>;

  /**
   * `<nys-combobox>` is a form-enabled combo box combining text input with a filterable dropdown.
   *
   * Features:
   * - Type to filter options
   * - Keyboard navigation (Arrow keys, Enter, Escape)
   * - Mouse and keyboard interaction
   * - Clears non-selected text on blur
   * - Clear button when value is selected
   * - Integrates with forms via ElementInternals
   * - Supports native <option> and <optgroup> elements
   * - Accessible per W3C ARIA Authoring Practices
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-input** - Fired on input change. Detail: `{ id, value }`.
   * - **nys-focus** - Fired when combobox receives focus.
   * - **nys-blur** - Fired when combobox loses focus.
   * - **nys-change** - Fired when selection changes. Detail: `{ id, value }`.
   *
   * ### **Slots:**
   *  - **description** - Optional custom description content below the label.
   * - **default** - Options (<option>, <optgroup>) to populate the dropdown
   */
  "nys-combobox": Partial<NysComboboxProps & BaseProps & BaseEvents>;

  /**
   * Date picker with calendar popup and native fallback.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-input** - Fired on date selection. Detail: `{id, value}`.
   * - **nys-blur** - Fired when input or calendar loses focus. Triggers validation.
   *
   * ### **Methods:**
   *  - **checkValidity(): _boolean_** - Passive check of validity:
   * - Returns true/false
   * - Does NOT update UI or show errors
   * - Used in form submission checks
   */
  "nys-datepicker": Partial<NysDatepickerProps & BaseProps & BaseEvents>;

  /**
   * Horizontal divider for visual separation of content sections.
   * ---
   *
   */
  "nys-divider": Partial<NysDividerProps & BaseProps & BaseEvents>;

  /**
   *
   * ---
   *
   */
  "nys-dropdownmenu": Partial<NysDropdownMenuProps & BaseProps & BaseEvents>;

  /**
   * Dropdown item to display label and provide href link.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-click**
   */
  "nys-dropdownmenuitem": Partial<NysDropdownMenuItemProps & BaseProps & BaseEvents>;

  /**
   * Internal error message display with icon and ARIA alert support.
   * ---
   *
   */
  "nys-errormessage": Partial<NysErrorMessageProps & BaseProps & BaseEvents>;

  /**
   * File input with drag-and-drop, validation, and progress tracking.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-change** - Fired when files are added or removed. Detail: `{id, files}`.
   *
   * ### **Slots:**
   *  - **description** - Custom HTML description content.
   */
  "nys-fileinput": Partial<NysFileinputProps & BaseProps & BaseEvents>;

  /**
   * Internal file item display with status, progress bar, and remove action.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-fileRemove** - Fired when remove button is clicked. Detail: `{filename}`.
   */
  "nys-fileitem": Partial<NysFileItemProps & BaseProps & BaseEvents>;

  /**
   * Agency footer with auto-layout for contact info and link sections.
   * ---
   *
   *
   * ### **Slots:**
   *  - _default_ - Footer content (links, contact info). Use `<h4>` for column headings.
   */
  "nys-globalfooter": Partial<NysGlobalFooterProps & BaseProps & BaseEvents>;

  /**
   * Agency header with navigation, mobile menu, and active link highlighting.
   * ---
   *
   *
   * ### **Slots:**
   *  - _default_ - Navigation content (typically `<ul>` with `<li><a>` links). Auto-sanitized.
   */
  "nys-globalheader": Partial<NysGlobalHeaderProps & BaseProps & BaseEvents>;

  /**
   * SVG icon from Material Symbols library with size, rotation, and color options.
   * ---
   *
   */
  "nys-icon": Partial<NysIconProps & BaseProps & BaseEvents>;

  /**
   * Internal label component for form fields with flag and tooltip support.
   * ---
   *
   *
   * ### **Slots:**
   *  - **description** - Custom HTML description content below the label.
   */
  "nys-label": Partial<NysLabelProps & BaseProps & BaseEvents>;

  /**
   * Accessible modal dialog with focus trap, keyboard support, and action slots.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-open** - Fired when modal opens. Detail: `{id}`.
   * - **nys-close** - Fired when modal closes. Detail: `{id}`.
   *
   * ### **Slots:**
   *  - _default_ - Default slot for body content.
   * - **actions** - Action buttons displayed in footer. Buttons auto-resize on mobile.
   */
  "nys-modal": Partial<NysModalProps & BaseProps & BaseEvents>;

  /**
   * Page navigation with numbered links, prev/next buttons, and responsive layout.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-change** - Fired when page changes. Detail: `{page}`.
   */
  "nys-pagination": Partial<NysPaginationProps & BaseProps & BaseEvents>;

  /**
   * Radio button for single selection from mutually exclusive options.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-error-clear**
   * - **nys-change** - Fired when selection changes. Detail: `{id, checked, name, value}`.
   * - **nys-other-input** - Fired when "other" text input value changes. Detail: `{id, name, value}`.
   * - **nys-focus** - Fired when radio gains focus.
   * - **nys-blur** - Fired when radio loses focus.
   * - **nys-error**
   *
   * ### **Methods:**
   *  - **getInputElement(): _Promise<HTMLInputElement | null>_** - Functions
   * --------------------------------------------------------------------------
   *
   * ### **Slots:**
   *  - **description** - Custom HTML description content.
   */
  "nys-radiobutton": Partial<NysRadiobuttonProps & BaseProps & BaseEvents>;

  /**
   * Container for grouping radio buttons as a single form control.
   * ---
   *
   *
   * ### **Slots:**
   *  - _default_ - Default slot for `nys-radiobutton` elements.
   * - **description** - Custom HTML description content.
   */
  "nys-radiogroup": Partial<NysRadiogroupProps & BaseProps & BaseEvents>;

  /**
   * Option item for nys-select dropdown.
   * ---
   *
   *
   * ### **Slots:**
   *  - _default_ - Option label text. Auto-populates the `label` prop if provided.
   */
  "nys-option": Partial<NysOptionProps & BaseProps & BaseEvents>;

  /**
   * Dropdown select for choosing one option from a list.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-change** - Fired when selection changes. Detail: `{id, value}`.
   * - **nys-focus** - Fired when select gains focus.
   * - **nys-blur** - Fired when select loses focus. Triggers validation.
   *
   * ### **Methods:**
   *  - **checkValidity(): _boolean_** - Functions
   * --------------------------------------------------------------------------
   *
   * ### **Slots:**
   *  - _default_ - Default slot for `<option>` and `<optgroup>` elements.
   * - **description** - Custom HTML description content below the label.
   */
  "nys-select": Partial<NysSelectProps & BaseProps & BaseEvents>;

  /**
   * Skip navigation link for keyboard accessibility. Hidden until focused.
   * ---
   *
   */
  "nys-skipnav": Partial<NysSkipnavProps & BaseProps & BaseEvents>;

  /**
   * Individual step for use within nys-stepper with navigation support.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-step-click** - Fired when a navigable step is clicked. Detail: `{href, label}`. Cancelable.
   */
  "nys-step": Partial<NysStepProps & BaseProps & BaseEvents>;

  /**
   * Multi-step progress indicator with navigation and mobile-friendly compact view.
   * ---
   *
   *
   * ### **Slots:**
   *  - _default_ - Default slot for `nys-step` elements.
   * - **actions** - Navigation buttons (e.g., Back, Continue). Must be wrapped in a `<div>`.
   */
  "nys-stepper": Partial<NysStepperProps & BaseProps & BaseEvents>;

  /**
   * `<nys-table>` is a responsive table component that can display native HTML tables,
   * supports striped and bordered styling, sortable columns, and CSV download.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-click** - Fired when the download button or sortable headers are clicked.
   * - **nys-column-sort** - Fired when a sortable column header is clicked.  Can be prevented by calling `event.preventDefault()` to override default sort behavior. Detail: { columnIndex: number, columnLabel: string, sortDirection: "asc" | "desc" | "none" }
   *
   * ### **Slots:**
   *  - _default_ - Accepts a `<table>` element. Only the first table is rendered.
   */
  "nys-table": Partial<NysTableProps & BaseProps & BaseEvents>;

  /**
   * Multi-line text input for comments, descriptions, and feedback.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-input** - Fired on input change. Detail: `{id, value}`.
   * - **nys-focus** - Fired when textarea gains focus.
   * - **nys-blur** - Fired when textarea loses focus. Triggers validation.
   * - **nys-select** - Fired when user selects text. Detail: `{id, value}`.
   * - **nys-selectionchange**
   *
   * ### **Methods:**
   *  - **checkValidity(): _boolean_** - Functions
   * --------------------------------------------------------------------------
   *
   * ### **Slots:**
   *  - **description** - Custom HTML description content below the label.
   */
  "nys-textarea": Partial<NysTextareaProps & BaseProps & BaseEvents>;

  /**
   * Text input for short single-line data with validation and masking support.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-input** - Fired on input change. Detail: `{id, value}`.
   * - **nys-focus** - Fired when input gains focus.
   * - **nys-blur** - Fired when input loses focus. Triggers validation.
   *
   * ### **Methods:**
   *  - **checkValidity(): _boolean_** - Functions
   * --------------------------------------------------------------------------
   *
   * ### **Slots:**
   *  - **description** - Custom HTML description content below the label.
   * - **startButton** - Button at input start. Use single `nys-button` only.
   * - **endButton** - Button at input end. Use single `nys-button` only.
   */
  "nys-textinput": Partial<NysTextinputProps & BaseProps & BaseEvents>;

  /**
   * Toggle switch for binary settings with immediate effect.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-change** - Fired when toggle state changes. Detail: `{id, checked}`.
   * - **nys-focus** - Fired when toggle gains focus.
   * - **nys-blur** - Fired when toggle loses focus.
   *
   * ### **Slots:**
   *  - **description** - Custom HTML description content.
   */
  "nys-toggle": Partial<NysToggleProps & BaseProps & BaseEvents>;

  /**
   * Contextual tooltip with auto-positioning, keyboard support, and screen reader integration.
   * ---
   *
   */
  "nys-tooltip": Partial<NysTooltipProps & BaseProps & BaseEvents>;

  /**
   * Universal NYS footer with logo and statewide links. Required site-wide.
   * ---
   *
   */
  "nys-unavfooter": Partial<NysUnavFooterProps & BaseProps & BaseEvents>;

  /**
   *
   * ---
   *
   */
  "nys-unavheader": Partial<NysUnavHeaderProps & BaseProps & BaseEvents>;
};

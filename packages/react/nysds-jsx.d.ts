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
  id?: string;
  /** Only one item can be expanded at a time. Expanding one collapses others. */
  singleSelect?: boolean;
  /** Adds borders around each accordion item. Propagates to all children. */
  bordered?: boolean;
};

export type NysAccordionItemProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Heading text displayed in the clickable toggle button. */
  heading?: string;
  /** Whether the content panel is visible. Toggle via click or keyboard. */
  expanded?: boolean;
  /** Adds border styling. Set by parent `nys-accordion`, not directly. */
  bordered?: boolean;

  /** Fired when expanded state changes. Detail: `{id, heading, expanded}`. */
  "onnys-accordionitem-toggle"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysAlertProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Bold heading text displayed at the top of the alert. */
  heading?: string;
  /** Custom icon name. Defaults to type-appropriate icon if not set. */
  icon?: string;
  /** Shows close button allowing users to dismiss the alert. */
  dismissible?: boolean;
  /** Auto-dismiss after specified milliseconds. Set to 0 to disable. */
  duration?: number;
  /** Body text content. Ignored if slot content is provided. */
  text?: string;
  /** URL for the primary action link. */
  primaryAction?: string;
  /** URL for the secondary action link. */
  secondaryAction?: string;
  /** Label text for primary action link. */
  primaryLabel?: string;
  /** Label text for secondary action link. */
  secondaryLabel?: string;
  /** Semantic alert type affecting color and ARIA role. `danger`/`emergency` use assertive live region. */
  type?: "base" | "info" | "success" | "warning" | "danger" | "emergency";
  /** Returns ARIA role and label based on alert type.
- 'alert' => assertive live region (implied)
- 'status' => polite live region
- 'region' => generic, requires aria-label */
  ariaAttributes?: {
    role: "alert" | "status" | "region";
    ariaLabel: string;
  };
  /** Returns live-region type for screen readers if applicable.
- 'polite' for status role
- undefined for alert (since it's implicitly assertive) or region */
  liveRegion?: "polite" | undefined;
  /** Fired when alert is dismissed. Detail: `{id, type, label}`. */
  "onnys-close"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysAvatarProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Accessible label for screen readers. Required when no image `alt` is available. */
  ariaLabel?: string;
  /** Image URL. Takes priority over initials and icon. */
  image?: string;
  /** 1-2 character initials. Used when no image is provided. */
  initials?: string;
  /** Custom icon name. Falls back to `account_circle` if not set. */
  icon?: string;
  /** Background color. Foreground auto-adjusts for contrast. Accepts CSS values or variables. */
  color?: string;
  /** Makes avatar clickable with button role and focus ring. */
  interactive?: boolean;
  /** Prevents interaction when `interactive` is true. */
  disabled?: boolean;
  /** Enables lazy loading for the image. */
  lazy?: boolean;
};

export type NysBacktotopProps = {
  /** Horizontal position: `left` or `right`. */
  position?: string;
  /** Force button visibility. Overrides auto-show scroll behavior. */
  visible?: boolean;
};

export type NysBadgeProps = {
  /** Unique identifier. */
  id?: string;
  /** Name attribute for form association. */
  name?: string;
  /** Badge size: `sm` (smaller text) or `md` (default). */
  size?: "sm" | "md";
  /** Semantic intent affecting color: `neutral`, `error`, `success`, or `warning`. */
  intent?: "neutral" | "error" | "success" | "warning";
  /** Secondary label displayed before the main label. */
  prefixLabel?: string;
  /** Primary label text displayed in the badge. */
  label?: string;
  /**  */
  variant?: "strong" | "";
  /**  */
  prefixicon?: string | boolean;
  /**  */
  suffixicon?: string | boolean;
};

export type NysBreadcrumbItemProps = {
  /**  */
  id?: string;
  /**  */
  label?: string;
  /**  */
  link?: string;
  /** Private property used by nys-breadcrumbs to indicate this breadcrumb item is the last in the trail * */
  isLast?: boolean;
  /**  */
  isBackToParent?: boolean;

  /** Fired when the link is clicked. Detail: `{id, link}`. */
  "onnys-breadcrumbitem-click"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysBreadcrumbsProps = {
  /**  */
  id?: string;
  /**  */
  size?: "sm" | "md" | "";
  /**  */
  itemsBeforeCollapse?: string;
  /**  */
  itemsAfterCollapse?: string;
  /** Property overrides default maxItem of 5 breadcrumbs for desktop only * */
  maxItems?: string;
  /**  */
  backToParentMobile?: boolean;
  /**  */
  collapsed?: boolean;

  /** Fired when the user clicks the ellipsis to expand the trail. */
  "onnys-breadcrumbs-expand"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysButtonProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Name for form submission. */
  name?: string;
  /** Button height: `sm` (40px) for dense UIs, `md` (48px, default) for standard use, `lg` (56px) for prominent CTAs. */
  size?: "sm" | "md" | "lg";
  /** Expands button to fill container width. Use for mobile layouts or stacked button groups. */
  fullWidth?: boolean;
  /** Visual style: `filled` for primary (one per section), `outline` for secondary, `ghost` for tertiary, `text` for inline actions. Avoid `text` for navigation. */
  variant?: "filled" | "outline" | "ghost" | "text";
  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;
  /** Visible button text. Use sentence case, action-oriented text (e.g., "Save Draft"). Becomes aria-label in `circle` mode. */
  label?: string;
  /** Screen reader label. Required for icon-only buttons if `label` is not set. */
  ariaLabel?: string;
  /** ID of controlled element (e.g., dropdown or modal). Sets `aria-controls`. */
  ariaControls?: string;
  /** Material Symbol icon before label. Not shown for `text` variant or `circle` mode. */
  prefixIcon?: string;
  /** Material Symbol icon after label. Use `chevron_down` for dropdowns, `open_in_new` for external links. Not shown for `text` variant or `circle` mode. */
  suffixIcon?: string;
  /** Renders circular icon-only button. Requires `icon` prop. `label` becomes aria-label. */
  circle?: boolean;
  /** Icon for circle mode. Required when `circle` is true. Scales with size (sm=24px, md=32px, lg=40px). */
  icon?: string;
  /** Prevents interaction. Avoid disabling without explanation—show validation errors instead. */
  disabled?: boolean;
  /** Form `id` to associate with. Use when button is outside the form element. */
  form?: string | null;
  /** Value submitted with form data. Only used when `type="submit"`. */
  value?: string;
  /** Additional screen reader description. Sets `aria-description`. */
  ariaDescription?: string;
  /** Form behavior: `button` (default, no form action), `submit` (submits form), `reset` (resets form). Always set explicitly to avoid unintended submissions. */
  type?: "submit" | "reset" | "button";
  /** URL to navigate to. Renders as `<a>` tag. Omit for action buttons. */
  href?: string;
  /** Link target: `_self` (same tab), `_blank` (new tab—add `suffixIcon="open_in_new"`), `_parent`, `_top`, or frame name. */
  target?: "_self" | "_blank" | "_parent" | "_top" | "framename";
  /** Click handler. Use instead of `@click` to ensure keyboard accessibility. */
  onClick?: ((event: Event) => void) | null;
  /** Fired when the button receives focus. */
  "onnys-focus"?: (e: CustomEvent<Event>) => void;
  /** Fired when the button loses focus. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
  /** Fired when the button is clicked (mouse or keyboard). Not fired when disabled. */
  "onnys-click"?: (e: CustomEvent<Event>) => void;
};

export type NysCheckboxProps = {
  /** Whether checkbox is checked. */
  checked?: boolean;
  /** Prevents interaction. */
  disabled?: boolean;
  /** Marks as required. Validates that checkbox is checked. */
  required?: boolean;
  /** Visible label text. Required for accessibility. */
  label?: string;
  /** Helper text below label. Use slot for custom HTML. */
  description?: string;
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Name for form submission. Use same name for grouped checkboxes. */
  name?: string;
  /** Value submitted when checked. */
  value?: string;
  /** Form `id` to associate with when checkbox is outside form element. */
  form?: string | null;
  /** Shows error message when true. */
  showError?: boolean;
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: string;
  /** Internal: Set by parent checkboxgroup. Do not set manually. */
  groupExist?: boolean;
  /** Renders as tile with larger clickable area. Apply to group for consistency. */
  tile?: boolean;
  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: string;
  /** Checkbox size: `sm` (24px) or `md` (32px, default). */
  size?: "sm" | "md";
  /**  */
  other?: boolean;
  /**  */
  showOtherError?: boolean;
  /**  */
  _hasDescription?: string;
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
  id?: string;
  /** Name for form submission. Set on group, not individual checkboxes. */
  name?: string;
  /** Requires at least one checkbox to be checked. */
  required?: boolean;
  /** Shows "Optional" flag. */
  optional?: boolean;
  /** Shows error message when true. */
  showError?: boolean;
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: string;
  /** Visible label text for the group. */
  label?: string;
  /** Helper text below label. Use slot for custom HTML. */
  description?: string;
  /** Renders all checkboxes as tiles with larger clickable area. */
  tile?: boolean;
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: string;
  /** Adjusts colors for dark backgrounds. Applied to all children. */
  inverted?: boolean;
  /** Form `id` to associate with. Applied to all children. */
  form?: string | null;
  /** Checkbox size for all children: `sm` (24px) or `md` (32px, default). */
  size?: "sm" | "md";
};

export type NysComboboxProps = {
  /**  */
  id?: string;
  /**  */
  name?: string;
  /**  */
  label?: string;
  /**  */
  description?: string;
  /**  */
  value?: string;
  /**  */
  disabled?: boolean;
  /**  */
  required?: boolean;
  /**  */
  optional?: boolean;
  /**  */
  tooltip?: string;
  /**  */
  form?: string | null;
  /**  */
  width?: "md" | "lg" | "full";
  /**  */
  inverted?: boolean;
  /**  */
  showError?: boolean;
  /**  */
  errorMessage?: string;

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
  id?: string;
  /** Name for form submission. */
  name?: string;
  /** Input width: `md` (200px), `lg` (384px), `full` (100%). */
  width?: "md" | "lg" | "full";
  /** Hide the "Today" button in calendar popup. */
  hideTodayButton?: boolean;
  /** Hide the "Clear" button in calendar popup. */
  hideClearButton?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  /** Mark as required. Shows "Required" flag and validates on blur. */
  required?: boolean;
  /** Show "Optional" flag. Use when most fields are required. */
  optional?: boolean;
  /** Show error state. */
  showError?: boolean;
  /** Error message text. */
  errorMessage?: string;
  /** Form `id` to associate with when input is outside form. */
  form?: string | null;
  /** Tooltip text on info icon hover. */
  tooltip?: string;
  /** Input type. Currently only supports `date`. */
  type?: string;
  /** Label text. Required for accessibility. */
  label?: string;
  /** Helper text below label. */
  description?: string;
  /** Initial date when calendar opens (YYYY-MM-DD). */
  startDate?: string;
  /** Dark background mode. */
  inverted?: boolean;
  /** Selected date. Accepts Date object or ISO string (YYYY-MM-DD). */
  value?: string | Date | undefined;

  /** Fired on date selection. Detail: `{id, value}`. */
  "onnys-input"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when input or calendar loses focus. Triggers validation. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
};

export type NysDividerProps = {
  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;
};

export type NysDropdownMenuProps = {
  /**  */
  for?: string;
  /**  */
  showDropdown?: boolean;
  /** Preferred position relative to trigger. */
  position?: Position | null;
};

export type NysDropdownMenuItemProps = {
  /**  */
  label?: string;
  /**  */
  href?: string;
  /**  */
  disabled?: boolean;
  /**  */
  target?: string;
  /**  */
  prefixIcon?: string;
  /**  */
  divider?: string;

  /**  */
  "onnys-click"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysErrorMessageProps = {
  /** Whether to display the error message. */
  showError?: boolean;
  /** Error text to display. Falls back to native validation message if available. */
  errorMessage?: string;
  /** Shows a divider line above the error message. */
  showDivider?: boolean;
};

export type NysFileinputProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Name for form submission. */
  name?: string;
  /** Visible label text. */
  label?: string;
  /** Helper text below label. Use slot for custom HTML. */
  description?: string;
  /** Allows selecting multiple files. */
  multiple?: boolean;
  /** Form `id` to associate with. */
  form?: string | null;
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: string;
  /** Accepted file types. Use MIME types (`image/*`) or extensions (`.pdf`). Validated via magic bytes. */
  accept?: string;
  /** Prevents interaction. */
  disabled?: boolean;
  /** Requires at least one file to be uploaded. */
  required?: boolean;
  /** Shows "Optional" flag. */
  optional?: boolean;
  /** Shows error message when true. */
  showError?: boolean;
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: string;
  /** Enables drag-and-drop zone UI. */
  dropzone?: boolean;
  /** Component width: `lg` (384px) or `full` (100%, default). */
  width?: "lg" | "full";
  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;

  /** Fired when files are added or removed. Detail: `{id, files}`. */
  "onnys-change"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysFileItemProps = {
  /** Name of the file being displayed. */
  filename?: string;
  /** Upload status: `pending` (queued), `processing` (uploading), `done` (complete), `error` (failed). */
  status?: "pending" | "processing" | "done" | "error";
  /** Upload progress percentage (0-100). Only shown when status is `processing`. */
  progress?: number;
  /** Error message displayed when status is `error`. */
  errorMessage?: string;

  /** Fired when remove button is clicked. Detail: `{filename}`. */
  "onnys-fileRemove"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysGlobalFooterProps = {
  /** Agency name displayed as the footer heading. */
  agencyName?: string;
  /** URL for the agency name link. If empty, name is not clickable. */
  homepageLink?: string;
};

export type NysGlobalHeaderProps = {
  /** Application name displayed prominently. */
  appName?: string;
  /** Agency name displayed below app name (or as main title if no appName). */
  agencyName?: string;
  /** URL for the header title link. If empty, title is not clickable. */
  homepageLink?: string;
  /** Toggles the NYS brand mark */
  nysLogo?: boolean;
};

export type NysIconProps = {
  /** Icon name from Material Symbols library. Required. */
  name?: string;
  /** Accessible label. When set, removes `aria-hidden` and adds `aria-label` to the SVG. */
  ariaLabel?: string;
  /** Rotation in degrees. Applied via CSS `rotate`. */
  rotate?: string;
  /** Flip direction: `horizontal`, `vertical`, or empty for none. */
  flip?: string;
  /** Icon color. Accepts any CSS color value. Defaults to `currentcolor`. */
  color?: string;
  /** Icon size. Semantic sizes: `xs`-`5xl`. Pixel sizes: `12`-`50`. */
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "12"
    | "14"
    | "16"
    | "18"
    | "20"
    | "24"
    | "32"
    | "40"
    | "50";
};

export type NysLabelProps = {
  /** ID of the form element this label is associated with. */
  for?: string;
  /** Label text displayed above the form field. */
  label?: string;
  /** Helper text displayed below the label. */
  description?: string;
  /** Flag type: `required` shows asterisk, `optional` shows "(Optional)". */
  flag?: string;
  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;
  /** Tooltip text shown on hover/focus of info icon next to label. */
  tooltip?: string;
};

export type NysModalProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Modal heading text. Required for accessibility. */
  heading?: string;
  /** Secondary heading below the main heading. */
  subheading?: string;
  /** Controls modal visibility. Set to `true` to show. */
  open?: boolean;
  /** Prevents dismissal via close button or Escape key. User must take an action. */
  mandatory?: boolean;
  /** Modal width: `sm` (400px), `md` (600px), or `lg` (800px). */
  width?: "sm" | "md" | "lg";

  /** Fired when modal opens. Detail: `{id}`. */
  "onnys-open"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when modal closes. Detail: `{id}`. */
  "onnys-close"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysPaginationProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Name attribute for form association. */
  name?: string;
  /** Currently active page (1-indexed). Clamped to valid range. */
  currentPage?: number;
  /** Total number of pages. Must be at least 1. */
  totalPages?: number;
  /** Internal state for layout adjustments near the end. */
  _twoBeforeLast?: boolean;

  /** Fired when page changes. Detail: `{page}`. */
  "onnys-change"?: (e: CustomEvent<CustomEvent>) => void;
};

export type NysRadiobuttonProps = {
  /** Whether this radio is selected. Only one per group can be checked. */
  checked?: boolean;
  /** Prevents interaction. */
  disabled?: boolean;
  /** Marks group as required. Set on radiogroup, not individual radios. */
  required?: boolean;
  /** Visible label text. Required for accessibility. */
  label?: string;
  /** Helper text below label. Use slot for custom HTML. */
  description?: string;
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Group name. Radios with same name are mutually exclusive. */
  name?: string;
  /** Value submitted when this radio is selected. */
  value?: string;
  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;
  /** Form `id` to associate with. */
  form?: string | null;
  /** Radio size: `sm` (24px) or `md` (32px, default). */
  size?: "sm" | "md";
  /** Renders as tile with larger clickable area. */
  tile?: boolean;
  /**  */
  other?: boolean;
  /**  */
  showOtherError?: boolean;

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
  id?: string;
  /** Name for form submission. Auto-populated from child radiobuttons. */
  name?: string;
  /** Requires a selection before form submission. */
  required?: boolean;
  /** Shows "Optional" flag. */
  optional?: boolean;
  /** Shows error message when true. */
  showError?: boolean;
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: string;
  /** Visible label text for the group. */
  label?: string;
  /** Helper text below label. Use slot for custom HTML. */
  description?: string;
  /** Renders all radiobuttons as tiles with larger clickable area. */
  tile?: boolean;
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: string;
  /** Adjusts colors for dark backgrounds. Applied to all children. */
  inverted?: boolean;
  /** Form `id` to associate with. Applied to all children. */
  form?: string | null;
  /** Radio size for all children: `sm` (24px) or `md` (32px, default). */
  size?: "sm" | "md";
};

export type NysOptionProps = {
  /** Prevents selection of this option. */
  disabled?: boolean;
  /** Pre-selects this option. */
  selected?: boolean;
  /** Value submitted when this option is selected. */
  value?: string;
  /** Display text for the option. Auto-populated from slot content if not set. */
  label?: string;
  /** Hides the option from the dropdown list. */
  hidden?: boolean;
};

export type NysSelectProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Name for form submission. */
  name?: string;
  /** Visible label text. Required for accessibility. */
  label?: string;
  /** Helper text below label. Use slot for custom HTML. */
  description?: string;
  /** Currently selected option value. */
  value?: string;
  /** Prevents interaction. */
  disabled?: boolean;
  /** Marks as required. Shows "Required" flag and validates on blur. */
  required?: boolean;
  /** Shows "Optional" flag. Use when most fields are required. */
  optional?: boolean;
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: string;
  /** Form `id` to associate with when select is outside form element. */
  form?: string | null;
  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;
  /** Shows error message when true. Set by validation or manually. */
  showError?: boolean;
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: string;
  /** Select width: `sm` (88px), `md` (200px), `lg` (384px), `full` (100%, default). */
  width?: "sm" | "md" | "lg" | "full";

  /** Fired when selection changes. Detail: `{id, value}`. */
  "onnys-change"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when select gains focus. */
  "onnys-focus"?: (e: CustomEvent<Event>) => void;
  /** Fired when select loses focus. Triggers validation. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
};

export type NysSkipnavProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Target element ID (with `#`). Defaults to `#main-content`. */
  href?: string;
};

export type NysStepProps = {
  /** Whether this step is currently being viewed. Set by parent stepper. */
  selected?: boolean;
  /** Marks the furthest reached step. Steps before this are navigable. */
  current?: boolean;
  /** Step label text displayed alongside the step number. */
  label?: string;
  /** URL for page navigation when step is clicked. Optional for SPA routing. */
  href?: string;
  /** Internal: Whether parent stepper's compact view is expanded. */
  isCompactExpanded?: boolean;
  /** Step number (1-indexed). Auto-assigned by parent stepper. */
  stepNumber?: number;
  /** Custom click handler. Called before `nys-step-click` event. */
  onClick?: (e: Event) => void | undefined;
  /** Fired when a navigable step is clicked. Detail: `{href, label}`. Cancelable. */
  "onnys-step-click"?: (e: CustomEvent<never>) => void;
};

export type NysStepperProps = {
  /** Unique identifier. */
  id?: string;
  /** Name attribute for form association. */
  name?: string;
  /** Title displayed above the step counter. */
  label?: string;
  /** Progress text (e.g., "Step 2 of 5"). Auto-updated based on selection. */
  counterText?: string;
  /** Whether compact mobile view is expanded to show all steps. */
  isCompactExpanded?: boolean;
};

export type NysTableProps = {
  /**  */
  id?: string;
  /**  */
  name?: string;
  /**  */
  striped?: boolean;
  /**  */
  sortable?: boolean;
  /**  */
  bordered?: boolean;
  /**  */
  download?: string;

  /** Fired when the download button or sortable headers are clicked. */
  "onnys-click"?: (e: CustomEvent<never>) => void;
  /** Fired when a sortable column header is clicked.  Can be prevented by calling `event.preventDefault()` to override default sort behavior. Detail: { columnIndex: number, columnLabel: string, sortDirection: "asc" | "desc" | "none" } */
  "onnys-column-sort"?: (e: CustomEvent<never>) => void;
};

export type NysTextareaProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Name for form submission. */
  name?: string;
  /** Visible label text. Required for accessibility. */
  label?: string;
  /** Helper text below label. Use slot for custom HTML. */
  description?: string;
  /** Placeholder text. Don't use as label replacement. */
  placeholder?: string;
  /** Current textarea value. */
  value?: string;
  /** Prevents interaction. */
  disabled?: boolean;
  /** Makes textarea read-only but focusable. */
  readonly?: boolean;
  /** Marks as required. Shows "Required" flag and validates on blur. */
  required?: boolean;
  /** Shows "Optional" flag. Use when most fields are required. */
  optional?: boolean;
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: string;
  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;
  /** Form `id` to associate with when textarea is outside form element. */
  form?: string | null;
  /** Maximum character length. */
  maxlength?: number | null;
  /** Textarea width: `sm` (88px), `md` (200px), `lg` (384px), `full` (100%, default). */
  width?: "sm" | "md" | "lg" | "full";
  /** Visible height in lines. */
  rows?: number;
  /** Resize behavior: `vertical` (default, user can resize height), `none` (fixed size). */
  resize?: "vertical" | "none";
  /** Shows error message when true. Set by validation or manually. */
  showError?: boolean;
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: string;

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
  id?: string;
  /** Name for form submission. */
  name?: string;
  /** Input type: `text` (default), `email`, `number`, `password`, `search`, `tel` (auto-masked), `url`. */
  type?: "email" | "number" | "password" | "search" | "tel" | "text" | "url";
  /** Visible label text. Required for accessibility. */
  label?: string;
  /** Helper text below label. Use slot for custom HTML. */
  description?: string;
  /** Placeholder text. Don't use as label replacement. */
  placeholder?: string;
  /** Current input value. */
  value?: string;
  /** Prevents interaction. */
  disabled?: boolean;
  /** Makes input read-only but focusable. */
  readonly?: boolean;
  /** Marks as required. Shows "Required" flag and validates on blur. */
  required?: boolean;
  /** Shows "Optional" flag. Use when most fields are required. */
  optional?: boolean;
  /** Tooltip text shown on hover/focus of info icon. */
  tooltip?: string;
  /** Form `id` to associate with when input is outside form element. */
  form?: string | null;
  /** Regex pattern for validation. Shows error on mismatch. */
  pattern?: string;
  /** Maximum character length. */
  maxlength?: number | null;
  /** Accessible label. When set, assuming "label" isn't provided for private special cases (i.e., <checkbox other>). */
  ariaLabel?: string;
  /** Input width: `sm` (88px), `md` (200px), `lg` (384px), `full` (100%, default). */
  width?: "sm" | "md" | "lg" | "full";
  /** Step increment for `type="number"`. */
  step?: number | null;
  /** Minimum value for `type="number"`. */
  min?: number | null;
  /** Maximum value for `type="number"`. */
  max?: number | null;
  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;
  /** Shows error message when true. Set by validation or manually. */
  showError?: boolean;
  /** Error message text. Shown only when `showError` is true. */
  errorMessage?: string;

  /** Fired on input change. Detail: `{id, value}`. */
  "onnys-input"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when input gains focus. */
  "onnys-focus"?: (e: CustomEvent<Event>) => void;
  /** Fired when input loses focus. Triggers validation. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
};

export type NysToggleProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Name for form submission. */
  name?: string;
  /** Value submitted when toggle is on. */
  value?: string;
  /** Visible label text. */
  label?: string;
  /** Helper text below label. Use slot for custom HTML. */
  description?: string;
  /** Form `id` to associate with. */
  form?: string | null;
  /** Whether toggle is on. */
  checked?: boolean;
  /** Prevents interaction. */
  disabled?: boolean;
  /** Hides check/close icon inside toggle knob. */
  noIcon?: boolean;
  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;
  /** Toggle size: `sm` or `md` (default). */
  size?: "sm" | "md";

  /** Fired when toggle state changes. Detail: `{id, checked}`. */
  "onnys-change"?: (e: CustomEvent<CustomEvent>) => void;
  /** Fired when toggle gains focus. */
  "onnys-focus"?: (e: CustomEvent<Event>) => void;
  /** Fired when toggle loses focus. */
  "onnys-blur"?: (e: CustomEvent<Event>) => void;
};

export type NysTooltipProps = {
  /** Unique identifier. Auto-generated if not provided. */
  id?: string;
  /** Tooltip content text. Required. */
  text?: string;
  /** Adjusts colors for dark backgrounds. */
  inverted?: boolean;
  /** ID of the trigger element to attach this tooltip to. Required. */
  for?: string;
  /** Preferred position relative to trigger. Auto-adjusts if space is insufficient. */
  position?: string;
};

export type NysUnavFooterProps = {};

export type NysUnavHeaderProps = {
  /** Internal: Whether trust bar panel is expanded. */
  trustbarVisible?: boolean;
  /** Internal: Whether search dropdown is visible (mobile). */
  searchDropdownVisible?: boolean;
  /** Internal: Whether language dropdown is visible. */
  languageVisible?: boolean;
  /** Internal: Whether search input is focused. */
  isSearchFocused?: boolean;
  /** Hides the translation dropdown. */
  hideTranslate?: boolean;
  /** Hides the search functionality. */
  hideSearch?: boolean;
  /** The URL endpoint of the search, make sure to include the query param. */
  searchUrl?: string;
  /** The list of languages this site can be translated to, default to use Smartling */
  languages?: Language[];
};

export type NysVideoProps = {
  /** Full YouTube URL — required. Component will not render if invalid. */
  id?: string;
  /** Title text for the thumbnail of the video */
  titleText?: string;
  /** Full YouTube URL — required. Component will not render if invalid. */
  videourl?: string;
  /** Largest size for the video player.
If not set, size is determined automatically by viewport width. */
  size?: "full" | "md" | "sm" | "";
  /**  */
  loading?: "lazy" | "eager";
  /** Time in seconds where playback begins. * */
  starttime?: number;
  /** Custom thumbnail image path.
Falls back to YouTube's auto-generated thumbnail if not provided. */
  thumbnail?: string | null;
  /** Triggers autoplay when the iframe loads */
  autoplay?: boolean;
  /** Prevents the video from being played */
  disabled?: boolean;

  /** Fired when the user clicks the thumbnail to load the player. */
  "onnys-video-play"?: (e: CustomEvent<never>) => void;
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
   * Single breadcrumb trail item with chevron separator and current page support.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-breadcrumbitem-click** - Fired when the link is clicked. Detail: `{id, link}`.
   */
  "nys-breadcrumbitem": Partial<NysBreadcrumbItemProps & BaseProps & BaseEvents>;

  /**
   * Breadcrumb navigation trail with responsive collapse support.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-breadcrumbs-expand** - Fired when the user clicks the ellipsis to expand the trail.
   *
   * ### **Slots:**
   *  - _default_ - One or more `nys-breadcrumbitem` elements defining the trail.
   */
  "nys-breadcrumbs": Partial<NysBreadcrumbsProps & BaseProps & BaseEvents>;

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

  /**
   * YouTube video player with thumbnail preview and accessibility announcements.
   * ---
   *
   *
   * ### **Events:**
   *  - **nys-video-play** - Fired when the user clicks the thumbnail to load the player.
   */
  "nys-video": Partial<NysVideoProps & BaseProps & BaseEvents>;
};

# NYSDS Component Examples Audit

This document tracks the consistency between JSDoc `@example` blocks in component source files and their corresponding Storybook stories.

## Summary

| Component           | Status     | Last Audited | Notes                                            |
| :------------------ | :--------- | :----------- | :----------------------------------------------- |
| `nys-accordion`     | ✅ Match   | 2026-06-12   | All JSDoc examples have matching stories.        |
| `nys-accordionitem` | ✅ Match   | 2026-06-12   | Example is included in `nys-accordion` stories.  |
| `nys-alert`         | ✅ Match   | 2026-06-12   | Comprehensive coverage of all functional states. |
| `nys-avatar`        | ✅ Match   | 2026-06-12   | JSDoc matches stories; missing 'lazy' example.   |
| `nys-backtotop`     | ✅ Match   | 2026-06-12   | All JSDoc examples have matching stories.        |
| `nys-badge`         | ✅ Match   | 2026-06-12   | All JSDoc examples have matching stories.        |
| `nys-breadcrumbs`   | ⚠️ Missing | 2026-06-12   | Missing JSDoc examples for size, backToParent.   |
| `nys-button`        | ✅ Match   | 2026-06-12   | Good coverage; missing size/inverted examples.   |
| `nys-checkbox`      | ⚠️ Missing | 2026-06-12   | Missing JSDoc examples for size, tile, other.    |
| `nys-checkboxgroup` | ⚠️ Missing | 2026-06-12   | Missing JSDoc examples for size, tile, optional. |
| `nys-combobox`      | ❌ Missing | 2026-06-12   | No JSDoc examples present.                       |
| `nys-datepicker`    | ✅ Match   | 2026-06-12   | Good coverage; missing minDate/maxDate examples. |
| `nys-divider`       | ✅ Match   | 2026-06-12   | Basic coverage; missing subtle/inverted.         |
| `nys-dropdownmenu`  | ✅ Match   | 2026-06-12   | Good coverage; missing icon/disabled examples.   |
| `nys-errormessage`  | ❌ Missing | 2026-06-12   | No JSDoc examples present.                       |
| `nys-fileinput`     | ✅ Match   | 2026-06-12   | Good coverage; missing width/inverted examples.  |

---

## Component Details

### `nys-fileinput`

| JSDoc Example                  | Storybook Story         | Status   | Notes |
| :----------------------------- | :---------------------- | :------- | :---- |
| `Single file upload`           | `Basic`                 | ✅ Match |       |
| `Multiple files with dropzone` | `Dropzone` / `Multiple` | ✅ Match |       |

#### To Add

- **Width**: Examples for `lg` and `full` width.
- **Disabled**: Example for `disabled` state.
- **Inverted**: Example for `inverted` mode.
- **Optional**: Example showing the `optional` flag.
- **Description Slot**: Example showing rich content in the `description` slot.

### `nys-errormessage`

| JSDoc Example | Storybook Story | Status     | Notes                                |
| :------------ | :-------------- | :--------- | :----------------------------------- |
| None          | `Basic`         | ❌ Missing | No JSDoc examples present in source. |

#### To Add

- **Basic**: Usage showing `showError` and `errorMessage`.
- **Divider**: Example showing the `showDivider` property.

### `nys-dropdownmenu`

| JSDoc Example         | Storybook Story | Status   | Notes |
| :-------------------- | :-------------- | :------- | :---- |
| `Basic dropdown`      | `Basic`         | ✅ Match |       |
| `Positioned dropdown` | `Basic` (Args)  | ✅ Match |       |

#### To Add

- **Icons**: Example showing `prefixIcon` on `nys-dropdownmenuitem`.
- **Links vs Actions**: Example showing items with `href` vs items that fire clicks.
- **Disabled Items**: Example showing `disabled` on menu items.

### `nys-divider`

| JSDoc Example   | Storybook Story | Status   | Notes |
| :-------------- | :-------------- | :------- | :---- |
| `Basic divider` | `Basic`         | ✅ Match |       |

#### To Add

- **Inverted**: Example for `inverted` property.
- **Subtle**: Example for `subtle` property.

### `nys-datepicker`

| JSDoc Example                   | Storybook Story  | Status   | Notes |
| :------------------------------ | :--------------- | :------- | :---- |
| `Basic date picker`             | `Basic`          | ✅ Match |       |
| `With width and description`    | `WidthVariants`  | ✅ Match |       |
| `Hide buttons, set start date`  | `WithoutButtons` | ✅ Match |       |
| `With validation error message` | `Basic` (Args)   | ✅ Match |       |

#### To Add

- **Date Range**: Examples for `minDate` and `maxDate`.
- **Disabled**: Example for `disabled` state.
- **Inverted**: Example for `inverted` mode.

### `nys-combobox`

| JSDoc Example | Storybook Story | Status     | Notes                                |
| :------------ | :-------------- | :--------- | :----------------------------------- |
| None          | `Basic`         | ❌ Missing | No JSDoc examples present in source. |

#### To Add

- **Basic**: Basic usage with `<option>` elements.
- **Option Groups**: Example using `<optgroup>`.
- **Default Value**: Example with a pre-selected value.
- **Size/Width**: Examples for different width options.
- **Error State**: Example showing `showError` and `errorMessage`.

### `nys-checkbox`

| JSDoc Example     | Storybook Story | Status   | Notes                                  |
| :---------------- | :-------------- | :------- | :------------------------------------- |
| `Single checkbox` | `Required`      | ✅ Match | Matches the required state story.      |
| `Checkbox group`  | `Basic`         | ✅ Match | Matches the basic group configuration. |

#### To Add

- **Size**: Example showing `size="sm"`.
- **Tile**: Example showing the `tile` variant.
- **Other**: Example showing the `other` property and its text input.
- **Error State**: Example showing `showError` and `errorMessage`.
- **Description Slot**: Example showing rich content in the `description` slot.

### `nys-checkboxgroup`

| JSDoc Example          | Storybook Story | Status   | Notes |
| :--------------------- | :-------------- | :------- | :---- |
| `Basic checkbox group` | `Basic`         | ✅ Match |       |

#### To Add

- **Size**: Example showing `size="sm"` applied to the group.
- **Tile**: Example showing `tile` applied to the group.
- **Optional**: Example showing the `optional` flag.
- **Tooltip**: Example showing the `tooltip` property.

### `nys-button`

| JSDoc Example                      | Storybook Story | Status   | Notes |
| :--------------------------------- | :-------------- | :------- | :---- |
| `Basic filled button`              | `Basic`         | ✅ Match |       |
| `Secondary outline button`         | `Variants`      | ✅ Match |       |
| `Button with icons`                | `Icons`         | ✅ Match |       |
| `Circle icon button`               | `Circle`        | ✅ Match |       |
| `Link-style button for navigation` | `Link`          | ✅ Match |       |
| `Form submit button`               | `Basic` (Args)  | ✅ Match |       |

#### To Add

- **Size**: Examples for `sm`, `md`, and `lg`.
- **Full Width**: Example for `fullWidth`.
- **Inverted**: Example for `inverted` on dark backgrounds.
- **Disabled**: Example for `disabled` state.

### `nys-breadcrumbs`

| JSDoc Example | Storybook Story | Status | Notes |
| :--- | :--- | :--- | :--- |
| `Full trail with current page` | `Basic` | ✅ Match | |
| `Trail without current page` | `WithoutCurrentPage` | ✅ Match | |
| `Single item renders as back-to-parent` | `SingleCrumb` | ✅ Match | |
| `Size small` | `Size` | ✅ Match | |
| `Back to parent (mobile)` | `BackToParent` | ✅ Match | |
| `With background bar` | `BackgroundBar` | ✅ Match | |
| `Disabled` | `Disabled` | ✅ Match | |

#### To Add

- None (All properties covered).


### `nys-backtotop`

| JSDoc Example | Storybook Story | Status   | Notes |
| :------------ | :-------------- | :------- | :---- |
| `Basic`       | `Basic`         | ✅ Match |       |
| `Left`        | `Left`          | ✅ Match |       |

#### To Add

- None (All properties covered).

### `nys-badge`

| JSDoc Example        | Storybook Story    | Status   | Notes                                   |
| :------------------- | :----------------- | :------- | :-------------------------------------- |
| `Status badge`       | `ScreenReaderText` | ✅ Match | Matches one of the badges in the story. |
| `Count badge`        | `Basic` (via Args) | ✅ Match | Covered.                                |
| `Intent`             | `Intent`           | ✅ Match | Covered.                                |
| `Strong variant`     | `Strong`           | ✅ Match | Covered.                                |
| `Custom icons`       | `Icons`            | ✅ Match | Covered.                                |
| `Size`               | `Size`             | ✅ Match | Covered.                                |
| `Screen reader text` | `ScreenReaderText` | ✅ Match | Covered.                                |

### `nys-accordion`

| JSDoc Example   | Storybook Story | Status   | Notes                                        |
| :-------------- | :-------------- | :------- | :------------------------------------------- |
| `Basic`         | `Basic`         | ✅ Match | Minor whitespace/CSS formatting differences. |
| `Single Select` | `SingleSelect`  | ✅ Match |                                              |
| `Bordered`      | `Bordered`      | ✅ Match |                                              |

#### To Add

- None (All properties covered).

### `nys-accordionitem`

| JSDoc Example   | Storybook Story | Status   | Notes                                           |
| :-------------- | :-------------- | :------- | :---------------------------------------------- |
| `Expanded item` | `ExpandedItem`  | ✅ Match | Story is located in `nys-accordion.stories.ts`. |

#### To Add

- None (All properties covered).

### `nys-alert`

| JSDoc Example  | Storybook Story | Status   | Notes |
| :------------- | :-------------- | :------- | :---- |
| `Basic`        | `Basic`         | ✅ Match |       |
| `Text`         | `Text`          | ✅ Match |       |
| `Rich Text`    | `RichText`      | ✅ Match |       |
| `Type`         | `Type`          | ✅ Match |       |
| `Dismissible`  | `Dismissible`   | ✅ Match |       |
| `Duration`     | `Duration`      | ✅ Match |       |
| `Custom Icon`  | `CustomIcon`    | ✅ Match |       |
| `Action Links` | `ActionLinks`   | ✅ Match |       |

#### To Add

- **Custom ID**: Example explicitly setting a custom `id` property.

### `nys-avatar`

| JSDoc Example             | Storybook Story         | Status   | Notes |
| :------------------------ | :---------------------- | :------- | :---- |
| `Basic`                   | `Basic`                 | ✅ Match |       |
| `Image`                   | `Image`                 | ✅ Match |       |
| `Initials`                | `Initials`              | ✅ Match |       |
| `Icon`                    | `Icon`                  | ✅ Match |       |
| `Interactive`             | `Interactive`           | ✅ Match |       |
| `Disabled`                | `Disabled`              | ✅ Match |       |
| `Custom Background Color` | `CustomBackgroundColor` | ✅ Match |       |

#### To Add

- **Lazy Loading**: Example demonstrating the `lazy` property for images to showcase performance optimization options.
- **Custom ID**: Example explicitly setting a custom `id` property.
howcase performance optimization options.
- **Custom ID**: Example explicitly setting a custom `id` property.

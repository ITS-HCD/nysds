# NYSDS Component Examples Audit

This document tracks the consistency between JSDoc `@example` blocks in component source files and their corresponding Storybook stories.

## Summary

| Component           | Status     | Last Audited | Notes                                                                                    |
| :------------------ | :--------- | :----------- | :--------------------------------------------------------------------------------------- |
| `nys-accordion`     | ✅ Match   | 2026-06-12   | All JSDoc examples have matching stories.                                                |
| `nys-accordionitem` | ✅ Match   | 2026-06-12   | Example is included in `nys-accordion` stories.                                          |
| `nys-alert`         | ✅ Match   | 2026-06-12   | Comprehensive coverage of all functional states.                                         |
| `nys-avatar`        | ✅ Match   | 2026-06-12   | JSDoc matches stories; missing 'lazy' example.                                           |
| `nys-backtotop`     | ✅ Match   | 2026-06-12   | All JSDoc examples have matching stories.                                                |
| `nys-badge`         | ✅ Match   | 2026-06-12   | All JSDoc examples have matching stories.                                                |
| `nys-breadcrumbs`   | ✅ Match   | 2026-06-15   | All JSDoc examples have matching stories.                                                |
| `nys-button`        | ✅ Match   | 2026-06-15   | All JSDoc examples have matching stories. Stories are now granular (one demo per story). |
| `nys-checkbox`      | ⚠️ Missing | 2026-06-12   | Missing JSDoc examples for size, tile, other.                                            |
| `nys-checkboxgroup` | ⚠️ Missing | 2026-06-12   | Missing JSDoc examples for size, tile, optional.                                         |
| `nys-combobox`      | ❌ Missing | 2026-06-12   | No JSDoc examples present.                                                               |
| `nys-datepicker`    | ✅ Match   | 2026-06-12   | Good coverage; missing minDate/maxDate examples.                                         |
| `nys-divider`       | ✅ Match   | 2026-06-12   | Basic coverage; missing subtle/inverted.                                                 |
| `nys-dropdownmenu`  | ✅ Match   | 2026-06-12   | Good coverage; missing icon/disabled examples.                                           |
| `nys-errormessage`  | ❌ Missing | 2026-06-12   | No JSDoc examples present.                                                               |
| `nys-fileinput`     | ✅ Match   | 2026-06-12   | Good coverage; missing width/inverted examples.                                          |

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

| JSDoc Example | Storybook Story | Status   | Notes |
| :------------ | :-------------- | :------- | :---- |
| `Basic`       | `Basic`         | ✅ Match |       |
| `Divider`     | `Divider`       | ✅ Match |       |

#### To Add

- None (All properties covered).

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

| JSDoc Example   | Storybook Story   | Status     | Notes |
| :-------------- | :---------------- | :--------- | :---- |
| `Basic`         | `Basic`           | ✅ Match   |       |
| None            | `DefaultValue`    | ⚠️ Missing |       |
| `Option Groups` | `OptionGroup`     | ✅ Match   |       |
| `Disabled`      | `Disabled`        | ✅ Match   |       |
| None            | `Required`        | ⚠️ Missing |       |
| None            | `Optional`        | ⚠️ Missing |       |
| None            | `Width`           | ⚠️ Missing |       |
| None            | `DescriptionSlot` | ⚠️ Missing |       |
| `Error State`   | `ErrorMessage`    | ✅ Match   |       |
| None            | `Inverted`        | ⚠️ Missing |       |
| None            | `DisabledOptions` | ⚠️ Missing |       |

#### To Add

- Add JSDoc `@example` tags for remaining identified stories: `DefaultValue`, `Required`, `Optional`, `Width`, `DescriptionSlot`, `Inverted`, `DisabledOptions`.

### `nys-checkbox`

| JSDoc Example     | Storybook Story | Status     | Notes                                     |
| :---------------- | :-------------- | :--------- | :---------------------------------------- |
| `Single checkbox` | `Required`      | ✅ Match   | Matches the required state story.         |
| `Checkbox group`  | `Basic`         | ✅ Match   | Matches the basic group configuration.    |
| None              | `Disabled`      | ⚠️ Missing | Violation: Story contains multiple demos. |
| None              | `Size`          | ⚠️ Missing | Violation: Story contains multiple demos. |
| None              | `Tile`          | ⚠️ Missing | Violation: Story contains multiple demos. |
| None              | `ErrorMessage`  | ✅ Missing | Should be added as JSDoc example.         |
| None              | `Slot`          | ✅ Missing | Should be added as JSDoc example.         |
| None              | `Other`         | ⚠️ Missing | Violation: Story contains multiple demos. |

#### To Add

- **ErrorMessage**: Example showing `showError` and `errorMessage`.
- **Description Slot**: Example showing rich content in the `description` slot.

### `nys-checkboxgroup`

| JSDoc Example          | Storybook Story | Status     | Notes                                     |
| :--------------------- | :-------------- | :--------- | :---------------------------------------- |
| `Basic checkbox group` | `Basic`         | ✅ Match   |                                           |
| None                   | `Grouping`      | ⚠️ Missing | Violation: Story contains multiple demos. |
| None                   | `Optional`      | ⚠️ Missing | Violation: Story contains multiple demos. |
| None                   | `Size`          | ⚠️ Missing |                                           |
| None                   | `Tile`          | ⚠️ Missing |                                           |
| None                   | `Other`         | ⚠️ Missing |                                           |

#### To Add

- **Grouping**: Example showing grouping multiple `nys-checkboxgroup` elements.
- **Optional**: Example showing `optional` property.
- **Size**: Example showing `size="sm"`.
- **Tile**: Example showing `tile` property.
- **Other**: Example showing `other` checkbox usage.
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

- None (All properties covered).

### `nys-breadcrumbs`

| JSDoc Example                           | Storybook Story      | Status   | Notes |
| :-------------------------------------- | :------------------- | :------- | :---- |
| `Full trail with current page`          | `Basic`              | ✅ Match |       |
| `Trail without current page`            | `WithoutCurrentPage` | ✅ Match |       |
| `Single item renders as back-to-parent` | `SingleCrumb`        | ✅ Match |       |
| `Size small`                            | `Size`               | ✅ Match |       |
| `Back to parent (mobile)`               | `BackToParent`       | ✅ Match |       |
| `With background bar`                   | `BackgroundBar`      | ✅ Match |       |
| `Disabled`                              | `Disabled`           | ✅ Match |       |

#### To Add

- None (All properties covered).

### `nys-stepper`

| JSDoc Example   | Storybook Story     | Status     | Notes                                         |
| :-------------- | :------------------ | :--------- | :-------------------------------------------- |
| `Basic stepper` | `BasicStepper`      | ✅ Match   |                                               |
| `Grid layout`   | `GridLayout`        | ✅ Match   |                                               |
| None            | `NavigationButtons` | ⚠️ Missing | Violation: Story is a code block, not a demo. |

#### To Add

- **Actions Slot**: Example showing valid use of the `actions` slot with buttons.

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

### `nys-globalheader`

| JSDoc Example  | Storybook Story | Status   | Notes |
| :------------- | :-------------- | :------- | :---- |
| `Basic header` | `Basic`         | ✅ Match |       |

#### To Add

- Add examples showing `appName`, `agencyName` combinations and `nysLogo` property.

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

### `nys-icon`

| JSDoc Example       | Storybook Story                | Status   | Notes |
| :------------------ | :----------------------------- | :------- | :---- |
| `Basic icon`        | `BasicIconDefaultNYSDSLibrary` | ✅ Match |       |
| `Font Awesome icon` | `FontAwesomeIcon`              | ✅ Match |       |
| `Accessible icon`   | `AccessibleIconWithLabel`      | ✅ Match |       |

#### To Add

- **Rotate/Flip**: Examples for `rotate` and `flip` properties.

### `nys-label`

| JSDoc Example | Storybook Story   | Status     | Notes |
| :------------ | :---------------- | :--------- | :---- |
| None          | `Basic`           | ⚠️ Missing |       |
| None          | `Description`     | ⚠️ Missing |       |
| None          | `DescriptionSlot` | ⚠️ Missing |       |
| None          | `Required`        | ⚠️ Missing |       |
| None          | `Optional`        | ⚠️ Missing |       |
| None          | `Tooltip`         | ⚠️ Missing |       |

#### To Add

- Add examples for `Basic`, `Description`, `DescriptionSlot`, `Required`, `Optional`, `Tooltip`.
- **Inverted**: Example for `inverted` property.

### `nys-modal`

| JSDoc Example | Storybook Story | Status   | Notes |
| :------------ | :-------------- | :------- | :---- |
| `Basic modal` | `Basic`         | ✅ Match |       |

#### To Add

- **Subheading**: Example for `subheading` property.
- **Mandatory**: Example for `mandatory` property.
- **Width**: Examples for `sm`, `md`, `lg` widths.

### `nys-tab`

| JSDoc Example | Storybook Story | Status     | Notes |
| :------------ | :-------------- | :--------- | :---- |
| `Basic`       | `Basic`         | ✅ Match   |       |
| None          | `Disabled`      | ⚠️ Missing |       |
| None          | `Preselect`     | ⚠️ Missing |       |
| None          | `PanelContent`  | ⚠️ Missing |       |

#### To Add

- Add examples for `Disabled`, `Preselect`, `PanelContent`.

### `nys-table`

| JSDoc Example | Storybook Story | Status     | Notes                      |
| :------------ | :-------------- | :--------- | :------------------------- |
| None          | `Basic`         | ❌ Missing | No JSDoc examples present. |
| None          | `Striped`       | ❌ Missing |                            |
| None          | `Bordered`      | ❌ Missing |                            |
| None          | `Sortable`      | ❌ Missing |                            |
| None          | `Downloadable`  | ❌ Missing |                            |

#### To Add

- Add JSDoc `@example` tags for all identified stories: `Basic`, `Striped`, `Bordered`, `Sortable`, `Downloadable`.

### `nys-textarea`

| JSDoc Example | Storybook Story           | Status   | Notes |
| :------------ | :------------------------ | :------- | :---- |
| `Basic`       | `Basic`                   | ✅ Match |       |
| `Required`    | `RequiredWithDescription` | ✅ Match |       |

#### To Add

- None (All properties covered).

### `nys-textinput`

| JSDoc Example | Storybook Story    | Status     | Notes |
| :------------ | :----------------- | :--------- | :---- |
| `Basic`       | `Basic`            | ✅ Match   |       |
| None          | `RequiredEmail`    | ⚠️ Missing |       |
| None          | `PhoneWithMasking` | ⚠️ Missing |       |
| None          | `SearchWithButton` | ⚠️ Missing |       |

#### To Add

- Add examples for `RequiredEmail`, `PhoneWithMasking`, `SearchWithButton`.

### `nys-toggle`

| JSDoc Example | Storybook Story | Status     | Notes |
| :------------ | :-------------- | :--------- | :---- |
| `Basic`       | `Basic`         | ✅ Match   |       |
| None          | `DarkMode`      | ⚠️ Missing |       |

#### To Add

- Add example for `DarkMode`.

### `nys-tooltip`

| JSDoc Example | Storybook Story | Status     | Notes |
| :------------ | :-------------- | :--------- | :---- |
| `Basic`       | `Basic`         | ✅ Match   |       |
| None          | `Positioned`    | ⚠️ Missing |       |

#### To Add

- Add example for `Positioned`.

### `nys-unavfooter`

| JSDoc Example | Storybook Story | Status   | Notes |
| :------------ | :-------------- | :------- | :---- |
| `Basic`       | `Basic`         | ✅ Match |       |

#### To Add

- None (All properties covered).

### `nys-unavheader`

| JSDoc Example | Storybook Story            | Status     | Notes |
| :------------ | :------------------------- | :--------- | :---- |
| `Basic`       | `Basic`                    | ✅ Match   |       |
| None          | `HideTranslateSearch`      | ⚠️ Missing |       |
| None          | `CustomSearchUrl`          | ⚠️ Missing |       |
| None          | `CustomLanguages`          | ⚠️ Missing |       |
| None          | `CustomLanguageUrl`        | ⚠️ Missing |       |
| None          | `CustomLanguageJSOverride` | ⚠️ Missing |       |

#### To Add

- Add examples for `HideTranslateSearch`, `CustomSearchUrl`, `CustomLanguages`, `CustomLanguageUrl`, `CustomLanguageJSOverride`.

### `nys-video`

| JSDoc Example | Storybook Story | Status   | Notes |
| :------------ | :-------------- | :------- | :---- |
| `Basic`       | `Basic`         | ✅ Match |       |

#### To Add

- None (All properties covered).

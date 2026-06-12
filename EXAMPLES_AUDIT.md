# NYSDS Component Examples Audit

This document tracks the consistency between JSDoc `@example` blocks in component source files and their corresponding Storybook stories.

## Summary

| Component           | Status   | Last Audited | Notes                                            |
| :------------------ | :------- | :----------- | :----------------------------------------------- |
| `nys-accordion`     | ✅ Match | 2026-06-12   | All JSDoc examples have matching stories.        |
| `nys-accordionitem` | ✅ Match | 2026-06-12   | Example is included in `nys-accordion` stories.  |
| `nys-alert`         | ✅ Match | 2026-06-12   | Comprehensive coverage of all functional states. |
| `nys-avatar`        | ✅ Match | 2026-06-12   | JSDoc matches stories; missing 'lazy' example.   |
| `nys-badge`         | ✅ Match | 2026-06-12   | All JSDoc examples have matching stories.        |

---

## Component Details

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

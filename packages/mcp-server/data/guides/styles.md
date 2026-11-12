# NYSDS Styles Guide

`@nysds/styles` has two installs. They differ in what they put on the page besides the components.

## Default install: CSS variables only

```css
@import '@nysds/styles';
```

File: `nysds.min.css`. It loads:

- The CSS variables (design tokens) that style NYSDS components, including every agency theme.
- A rule that hides `nys-*` elements until their JavaScript defines them.

It does **not** include a CSS reset, typography styles, or utility classes. With the default install:

- `nys-grid-*`, `nys-display-*`, `nys-margin-*`, `nys-padding-*`, `nys-font-*`, and every other class from `get_utility_classes` does nothing.
- Headings, paragraphs, and links keep your project's own styles or the browser defaults.

Use it when your project already has its own reset, typography, and layout system and you only want NYSDS components to render correctly.

## Full install: reset, typography, and utility classes

```css
@import '@nysds/styles/full';
```

File: `nysds-full.min.css`. It loads everything in the default install, plus:

- A CSS reset.
- Typography styles, including the `nys-font-*` type scale classes.
- Utility classes: the grid (`nys-grid-*`), flexbox, display, spacing, opacity, z-index, and the other classes `get_utility_classes` lists.

Use it for a new project, and whenever you use NYSDS utility classes or the page-structure templates, which are built on the grid.

Load one or the other, not both: the full install already contains the default one.

## Comparison

| Import | File | CSS variables | Reset | Typography | Utility classes |
|--------|------|---------------|-------|------------|-----------------|
| `@nysds/styles` (default) | `nysds.min.css` | Yes | No | No | No |
| `@nysds/styles/full` | `nysds-full.min.css` | Yes | Yes | Yes | Yes |
| `@nysds/styles/typography` | `nysds-typography.min.css` | No | No | Yes | No |

### Typography only

`@nysds/styles/typography` adds just the `nys-font-*` type scale classes to the default install. It doesn't define the CSS variables it uses, so load it together with `@nysds/styles`:

```css
@import '@nysds/styles';
@import '@nysds/styles/typography';
```

## Loading without a bundler

The files are in the package's `dist/` folder:

```html
<!-- Full install -->
<link rel="stylesheet" href="node_modules/@nysds/styles/dist/nysds-full.min.css" />

<!-- Default install -->
<link rel="stylesheet" href="node_modules/@nysds/styles/dist/nysds.min.css" />
```

## Agency theming

Both installs include every agency theme. Apply one with a `data-theme` attribute:

```html
<html data-theme="health">
```

Or with a CSS class:

```html
<body class="nys-theme-health">
```

Use the `get_guide` tool with `topic: "themes"` to see all available agency themes.

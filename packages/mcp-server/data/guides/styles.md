# NYSDS Styles Installation Guide

## Package Options

NYSDS provides modular style packages to include only what you need.

### Full Bundle (Recommended)
Includes reset, typography, and all utility classes.

```bash
npm install @nysds/styles
```

```css
/* Import full bundle */
@import '@nysds/styles/full';
```

### CSS Variables Only
For projects using NYSDS components that need just the design tokens.

```css
/* Import CSS variables/tokens only */
@import '@nysds/styles';
```

### Typography Only
Just the typography styles without utilities.

```css
@import '@nysds/styles/typography';
```

## What Each Bundle Includes

| Bundle | Reset | Typography | Utility Classes | Design Tokens |
|--------|-------|------------|-----------------|---------------|
| `@nysds/styles` | No | No | No | Yes |
| `@nysds/styles/typography` | No | Yes | No | Yes |
| `@nysds/styles/full` | Yes | Yes | Yes | Yes |

## CDN Usage

```html
<!-- Full bundle via CDN -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nysds/styles/dist/nysds.min.css">
```

## Agency Theming

Apply an agency theme by adding a data attribute to your HTML:

```html
<html data-theme="excelsior">
```

Available themes can be retrieved using the `get_tokens` tool with `output: "themes"`.

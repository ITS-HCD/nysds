# NYSDS Styles Guide

## Choosing a stylesheet

NYSDS provides three CSS bundles. Choose based on your project:

| File | Reset | Typography | Utilities | CSS Variables |
|------|-------|------------|-----------|---------------|
| `nysds-full.min.css` | Yes | Yes | Yes | Yes |
| `nysds-typography.min.css` | No | Yes | No | Yes |
| `nysds.min.css` | No | No | No | Yes |

**New project?** Use `nysds-full.min.css` — it includes a CSS reset, typography, and utility/layout classes so you can start building immediately.

**Existing project?** Use `nysds.min.css` — it loads only the CSS variables that style NYSDS components, without overriding your existing reset or typography.

## Installation via npm

```bash
npm install @nysds/styles
```

```css
/* New project — full bundle */
@import '@nysds/styles/full';

/* Existing project — variables only */
@import '@nysds/styles';

/* Typography only */
@import '@nysds/styles/typography';
```

## Agency theming

Apply an agency theme with a `data-theme` attribute:

```html
<html data-theme="health">
```

Or with a CSS class:

```html
<body class="nys-theme-health">
```

Use the `get_tokens` tool with `output: "themes"` to see all available agency themes.

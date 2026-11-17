# NYSDS Themes

NYSDS supports 8 agency themes that remap the `--nys-color-theme-*` design tokens to agency-specific color palettes. The default theme (NY.gov blue) is active when no theme is set.

## Available Themes

| Theme ID | Name | Description |
|----------|------|-------------|
| `default` | Default (NY.gov) | Default NY.gov theme for general state sites |
| `admin` | Administration | For administrative and regulatory agencies |
| `business` | Business | For commerce and economic development agencies |
| `environment` | Environment | For environmental and conservation agencies |
| `health` | Health | For health and human services agencies |
| `local` | Local Government | For local government entities |
| `safety` | Public Safety | For public safety agencies |
| `transportation` | Transportation | For DOT and transit authorities |

## How to Apply a Theme

### HTML attribute (recommended)

Set the `data-theme` attribute on a root element:

```html
<html data-theme="admin">
```

### CSS class

Apply a theme class to any element:

```html
<body class="nys-theme-admin">
```

### Scoped theming

Apply a theme to a specific section of the page:

```html
<section data-theme="health">
  <!-- All NYSDS components inside will use the Health theme -->
</section>
```

## What Themes Change

Themes remap these seven CSS custom properties to the agency's color palette:

- `--nys-color-theme-faint` — faintest tint, for subtle backgrounds and hover states
- `--nys-color-theme-weaker` — very light tint, for secondary backgrounds
- `--nys-color-theme-weak` — light tint, for borders and light accent backgrounds
- `--nys-color-theme-mid` — mid-range color, for secondary buttons and active states
- `--nys-color-theme` — primary theme color, for primary buttons, links, and key accents
- `--nys-color-theme-strong` — dark variant, for hover states on primary elements
- `--nys-color-theme-stronger` — darkest variant, for active and pressed states

All NYSDS components that use `--nys-color-theme-*` tokens automatically reflect the active theme. Style your own UI with these tokens, not with a theme's palette primitives, so it follows the theme too.

## Default Behavior

The default theme's values are set on `:root`. There is no selector for the default theme, so a nested section can't switch back to the default theme inside a themed parent.

## Looking up theme values

The tables below list every theme's value for each token. To look values up from a tool:

- `get_token({ token: "--nys-color-theme-mid" })` returns that token's value in every theme.
- `find_tokens({ query: "theme", theme: "health" })` returns all seven theme tokens with their Health values.

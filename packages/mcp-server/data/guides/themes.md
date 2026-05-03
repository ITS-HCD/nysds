# NYSDS Themes

NYSDS supports 8 agency themes that remap the `--nys-color-theme-*` design tokens to agency-specific color palettes. The default theme (NY.gov blue) is active when no theme is explicitly set.

## Available Themes

| Theme ID | Name | Description | Primary Color |
|----------|------|-------------|---------------|
| `default` | Default (NY.gov) | Default NY.gov theme for general state sites | `#154973` |
| `admin` | Administration | For administrative and regulatory agencies | `#a2350a` |
| `business` | Business | For commerce and economic development agencies | `#084b52` |
| `environment` | Environment | For environmental and conservation agencies | `#233f2b` |
| `health` | Health | For health and human services agencies | `#43285d` |
| `local` | Local Government | For local government entities | `#402217` |
| `safety` | Public Safety | For public safety agencies | `#435d6e` |
| `transportation` | Transportation | For DOT and transit authorities | `#0b5583` |

## How to Apply a Theme

### HTML attribute (recommended)

Set the `data-nys-theme` attribute on a root element:

```html
<html data-nys-theme="admin">
```

### CSS class

Apply a theme class to any element:

```html
<body class="nys-theme-admin">
```

### Scoped theming

Apply a theme to a specific section of the page:

```html
<section data-nys-theme="health">
  <!-- All NYSDS components inside will use the Health theme -->
</section>
```

## What Themes Change

Themes remap these CSS custom properties to the agency's color palette:

- `--nys-color-theme` — primary theme color
- `--nys-color-theme-strong` — darker variant
- `--nys-color-theme-stronger` — darkest variant
- `--nys-color-theme-weak` — lighter variant
- `--nys-color-theme-weaker` — lightest variant
- `--nys-color-theme-weakest` — near-white variant

All NYSDS components that use `--nys-color-theme-*` tokens automatically reflect the active theme.

## Default Behavior

The default theme applies at `:root` level. You do not need to set `data-nys-theme="default"` unless you are overriding a parent theme within a nested section.

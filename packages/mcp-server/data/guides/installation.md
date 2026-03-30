# NYSDS Installation Guide

## 1. Install the component package

```bash
npm install @nysds/components
```

## 2. Load the styles

NYSDS components require CSS variables to render correctly. Choose the right stylesheet based on your project:

### New project (recommended)

Use `nysds-full.min.css` — includes a CSS reset, typography styles, and utility/layout classes:

```html
<link rel="stylesheet" href="/path/to/nysds-full.min.css" />
```

### Existing project

If you already have a CSS reset and typography, use `nysds.min.css` — loads only the CSS variables that style the components:

```html
<link rel="stylesheet" href="/path/to/nysds.min.css" />
```

### Via npm

```bash
npm install @nysds/styles
```

```css
/* New project — full bundle with reset, typography, and utilities */
@import '@nysds/styles/full';

/* Existing project — CSS variables only */
@import '@nysds/styles';
```

## 3. Import and use components

Import components individually:

```javascript
import '@nysds/nys-button';
import '@nysds/nys-alert';
```

Or import all components:

```javascript
import '@nysds/components';
```

Then use them in HTML:

```html
<nys-button label="Click me" variant="filled"></nys-button>
<nys-alert type="info">This is an informational message.</nys-alert>
```

## Style bundles reference

| File | Reset | Typography | Utilities | CSS Variables |
|------|-------|------------|-----------|---------------|
| `nysds-full.min.css` | Yes | Yes | Yes | Yes |
| `nysds-typography.min.css` | No | Yes | No | Yes |
| `nysds.min.css` | No | No | No | Yes |

Use the `get_tokens` tool to explore available design tokens, or `get_utility_classes` for layout and spacing utilities.

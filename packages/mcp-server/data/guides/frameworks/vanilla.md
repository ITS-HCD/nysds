# NYSDS with Vanilla JavaScript

## Installation

```bash
npm install @nysds/components @nysds/styles
```

## Load styles

Load one of the two `@nysds/styles` installs. The full install includes the CSS variables plus a reset, typography, and utility classes; the default install includes only the CSS variables. See `get_guide({ topic: "styles" })` for the differences.

```html
<!-- Full install (new projects): CSS variables + reset + typography + utility classes -->
<link rel="stylesheet" href="node_modules/@nysds/styles/dist/nysds-full.min.css" />

<!-- Default install (existing projects): CSS variables only. No reset, typography, or utility classes. -->
<link rel="stylesheet" href="node_modules/@nysds/styles/dist/nysds.min.css" />
```

## Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="node_modules/@nysds/styles/dist/nysds-full.min.css" />
  <script type="module">
    import '@nysds/components';
  </script>
</head>
<body>
  <nys-button label="Click me"></nys-button>
</body>
</html>
```

You can also import individual components to reduce bundle size:

```html
<script type="module">
  import '@nysds/nys-button';
  import '@nysds/nys-alert';
</script>
```

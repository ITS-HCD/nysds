# NYSDS with Vanilla JavaScript

## Installation

```bash
npm install @nysds/components @nysds/styles
```

## Load styles

Choose the right stylesheet for your project:

```html
<!-- New project: includes reset, typography, and utility classes -->
<link rel="stylesheet" href="node_modules/@nysds/styles/dist/nysds-full.min.css" />

<!-- Existing project: CSS variables only (styles components, nothing else) -->
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
  import '@nysds/components/nys-button';
  import '@nysds/components/nys-alert';
</script>
```

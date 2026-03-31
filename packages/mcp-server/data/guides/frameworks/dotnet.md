# NYSDS with .NET / Blazor

> **Note:** .NET / Blazor integration is currently untested. The guidance below is based on standard web component usage patterns and may require adjustments.

## Installation

Add the NYSDS scripts and styles to your layout file (e.g., `_Layout.cshtml` or `App.razor`).

Install via npm:

```bash
npm install @nysds/components @nysds/styles
```

Then reference in your layout:

```html
<head>
  <!-- New project: includes reset, typography, and utility classes -->
  <link rel="stylesheet" href="node_modules/@nysds/styles/dist/nysds-full.min.css" />

  <!-- Existing project: CSS variables only -->
  <!-- <link rel="stylesheet" href="node_modules/@nysds/styles/dist/nysds.min.css" /> -->

  <script type="module" src="node_modules/@nysds/components/dist/nysds.es.js"></script>
</head>
```

## Usage in Razor

```razor
<nys-button label="Click me"></nys-button>
<nys-alert type="info">This is an informational message.</nys-alert>
```

## Usage in Blazor

Blazor treats unknown elements as custom elements by default. No additional configuration is needed:

```razor
<nys-button label="Submit" variant="filled"></nys-button>
```

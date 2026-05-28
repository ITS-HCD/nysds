# NYSDS with Drupal

> **Note:** Drupal integration is currently untested. The guidance below is based on standard web component usage patterns and may require adjustments.

## Installation

Install the packages:

```bash
npm install @nysds/components @nysds/styles
```

Add the NYSDS styles and scripts to your theme's `*.libraries.yml`:

```yaml
nysds:
  css:
    theme:
      # New project: includes reset, typography, and utility classes
      /node_modules/@nysds/styles/dist/nysds-full.min.css: { minified: true }
      # Existing project: CSS variables only
      # /node_modules/@nysds/styles/dist/nysds.min.css: { minified: true }
  js:
    /node_modules/@nysds/components/dist/nysds.es.js: { attributes: { type: module } }
```

Then attach the library in your theme's `.info.yml`:

```yaml
libraries:
  - mytheme/nysds
```

## Usage in Twig

```twig
<nys-button label="{{ 'Click me'|t }}"></nys-button>
<nys-alert type="info">{{ 'This is an alert.'|t }}</nys-alert>
```

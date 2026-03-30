# NYSDS with Drupal

> **Note:** Drupal integration is currently untested. The guidance below is based on standard web component usage patterns and may require adjustments.

## Installation

Add the library to your theme's libraries.yml:

```yaml
nysds:
  js:
    https://cdn.jsdelivr.net/npm/@nysds/components: { type: external, minified: true }
```

## Usage in Twig

```twig
<nys-button label="{{ 'Click me'|t }}"></nys-button>
```

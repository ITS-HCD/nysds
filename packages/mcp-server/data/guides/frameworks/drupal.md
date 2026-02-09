# NYSDS with Drupal

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

# NYSDS Font Setup Guide

## Overview

NYSDS uses proprietary fonts that are licensed for New York State government use. These fonts are distributed through a private repository.

## Obtaining Fonts

The NYSDS font package is available through a private npm registry. Contact the NYSDS team for access:

1. Request access to the private font repository
2. Configure your npm to use the private registry
3. Install the font package

## Manual Installation

If you have the font files:

1. Place font files in your project (e.g., `/assets/fonts/`)
2. Include the font CSS in your stylesheet
3. The fonts will be loaded automatically when using NYSDS styles

### Directory Structure
```
/assets/fonts/
├── proxima-nova/
│   ├── proxima-nova-regular.woff2
│   ├── proxima-nova-medium.woff2
│   ├── proxima-nova-semibold.woff2
│   └── proxima-nova-bold.woff2
└── d-din/
    ├── d-din-regular.woff2
    └── d-din-bold.woff2
```

## Font Tokens

NYSDS provides the following font family tokens:

| Token | Description | Usage |
|-------|-------------|-------|
| `--nys-font-body` | Body text font | Paragraphs, general content |
| `--nys-font-heading` | Heading font | h1-h6 elements |
| `--nys-font-ui` | UI font | Buttons, labels, form elements |
| `--nys-font-display` | Display font | Large headlines, hero text |
| `--nys-font-brand` | Brand font | Brand-specific usage |
| `--nys-font-alt` | Alternative font | Secondary content |

### Usage Example
```css
.custom-heading {
  font-family: var(--nys-font-heading);
  font-weight: 600;
}
```

## Font Preloading

For optimal performance, preload critical fonts in your HTML head:

```html
<link rel="preload" href="/assets/fonts/proxima-nova/proxima-nova-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/proxima-nova/proxima-nova-semibold.woff2" as="font" type="font/woff2" crossorigin>
```

## Fallback Fonts

NYSDS includes system font fallbacks. If custom fonts are unavailable, the design system will gracefully degrade to:

- **Sans-serif:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial
- **Monospace:** "SF Mono", Consolas, "Liberation Mono", Menlo, monospace

## Getting Access

To request access to the NYSDS font package, contact the NYSDS team through:
- The NYS Digital Services team
- Your agency's designated NYSDS contact

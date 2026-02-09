# NYSDS Component Usage Guide

## Installation

```bash
npm install @nysds/components
```

## Basic Usage

Import components individually:

```javascript
import '@nysds/components/nys-button';
import '@nysds/components/nys-alert';
```

Or import all components:

```javascript
import '@nysds/components';
```

## Using Components in HTML

```html
<nys-button label="Click me" variant="primary"></nys-button>
<nys-alert type="info">This is an informational message.</nys-alert>
```

## CSS Custom Properties

NYSDS components use CSS custom properties for theming. Import the base styles:

```css
@import '@nysds/components/dist/styles.css';
```

Use the `get_tokens` tool to explore available design tokens.

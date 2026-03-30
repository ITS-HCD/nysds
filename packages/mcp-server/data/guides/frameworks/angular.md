# NYSDS with Angular

> **Note:** Angular integration is currently untested. The guidance below is based on standard web component usage patterns and may require adjustments.

## Installation

```bash
npm install @nysds/components @nysds/styles
```

## Load styles

Add the NYSDS stylesheet to `angular.json`:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/@nysds/styles/dist/nysds-full.min.css",
              "src/styles.css"
            ]
          }
        }
      }
    }
  }
}
```

Use `nysds-full.min.css` for new projects (includes reset, typography, and utilities) or `nysds.min.css` for existing projects (CSS variables only).

## Configuration

Add `CUSTOM_ELEMENTS_SCHEMA` to your module so Angular allows custom element tags:

```typescript
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

For standalone components:

```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<nys-button label="Click me"></nys-button>`
})
export class MyComponent {}
```

## Usage

Import components in the component or module where they're used:

```typescript
import '@nysds/components/nys-button';
```

```html
<nys-button label="Click me"></nys-button>
```

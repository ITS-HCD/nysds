# NYSDS with Angular

> **Note:** Angular integration is currently untested. The guidance below is based on standard web component usage patterns and may require adjustments.

## Installation

```bash
npm install @nysds/components
```

## Configuration

Add CUSTOM_ELEMENTS_SCHEMA to your module:

```typescript
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

## Usage

```typescript
import '@nysds/components/nys-button';
```

```html
<nys-button label="Click me"></nys-button>
```

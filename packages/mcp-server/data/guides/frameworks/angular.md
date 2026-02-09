# NYSDS with Angular

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

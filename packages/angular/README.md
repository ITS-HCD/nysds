# @nysds/angular

Angular directives for the [New York State Design System](https://designsystem.ny.gov/) web component library.

> **Status:** work in progress. This package is being built out incrementally — see the implementation plan tracked alongside this repo.

## What it provides

- Standalone Angular directives that attach to the existing `nys-*` custom element tags.
- `ControlValueAccessor` implementations for every form-associated NYSDS component, so `ngModel` and Reactive Forms work out of the box.
- Typed `@Input()`s and `@Output()`s mirroring each component's documented properties and custom events.
- Side-effect imports of the underlying `@nysds/components` modules, so consumers don't have to register custom elements manually.

## Installation

```bash
npm install @nysds/components @nysds/angular @nysds/styles
```

## Requirements

- Angular >= 17
- `CUSTOM_ELEMENTS_SCHEMA` added to any component that renders `nys-*` tags

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FormsModule
    // ...NYSDS directives will be imported here
  ],
  template: `<!-- nys-* tags go here -->`,
})
export class ExampleComponent {}
```

Full usage docs will land alongside the directive implementations.

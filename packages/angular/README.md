# `@nysds/angular` — Angular directives for NYSDS web components

Standalone Angular directives that make the [New York State Design System](https://designsystem.ny.gov/) web components feel native inside Angular apps:

- **`ControlValueAccessor` bindings** for every form-associated NYSDS component so `ngModel` and Reactive Forms "just work."
- **Typed `@Input()`s and `@Output()`s** mirroring the components' documented properties and `nys-*` events — no more casting `$event` to `any`.
- **Two-way binding** (`[(open)]`, `[(expanded)]`, `[(currentPage)]`) on the few components that support it.
- **Side-effect import** of `@nysds/components` so the underlying `<nys-*>` custom elements register exactly once when any directive is imported.

## Install

```bash
npm install @nysds/components @nysds/angular @nysds/styles
```

You can also import directives from the design system's root package via the `./angular` subpath, identical to the existing React subpath:

```ts
import { NysButtonDirective } from '@nysds/components/angular';
```

## Requirements

| | Minimum |
| --- | --- |
| Angular | `>= 20` (developed against 21) |
| TypeScript | matches your Angular peer (5.8+ for v20, 5.9+ for v21) |
| `@nysds/components` | `^1.18.1` |

Every component that renders a `<nys-*>` tag must include `CUSTOM_ELEMENTS_SCHEMA` — Angular's schema system needs to know the tag exists, even with a directive selector matching it.

## Quick start (standalone components)

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NysTextinputDirective, NysButtonDirective } from '@nysds/angular';

@Component({
  selector: 'app-signup',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FormsModule, NysTextinputDirective, NysButtonDirective],
  template: `
    <form (ngSubmit)="submit()">
      <nys-textinput
        label="Full name"
        name="fullName"
        required
        [(ngModel)]="name"
      ></nys-textinput>

      <nys-button type="submit" label="Sign up"></nys-button>
    </form>
  `,
})
export class SignupComponent {
  name = signal('');

  submit(): void {
    console.log(this.name());
  }
}
```

## `ReactiveFormsModule`

```ts
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NysTextinputDirective, NysCheckboxDirective } from '@nysds/angular';

@Component({
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ReactiveFormsModule, NysTextinputDirective, NysCheckboxDirective],
  template: `
    <form [formGroup]="form">
      <nys-textinput label="Email" formControlName="email"></nys-textinput>
      <nys-checkbox label="Subscribe" formControlName="optIn"></nys-checkbox>
    </form>
  `,
})
export class NewsletterComponent {
  form = new FormBuilder().group({
    email: ['', [Validators.required, Validators.email]],
    optIn: [false],
  });
}
```

## Two-way binding

`NysModalDirective`, `NysAccordionitemDirective`, and `NysPaginationDirective` ship matching `*Change` outputs so the banana-in-a-box syntax works:

```ts
import { NysModalDirective, NysButtonDirective } from '@nysds/angular';

@Component({ /* … */ imports: [NysModalDirective, NysButtonDirective] })
export class DemoComponent {
  open = signal(false);
}
```

```html
<nys-button label="Open" (click)="open.set(true)"></nys-button>

<nys-modal [(open)]="open" modalTitle="Hello">
  <p>Press Escape to close — Angular's signal stays in sync.</p>
</nys-modal>
```

## Listening to typed events

Every `nys-*` `CustomEvent` is surfaced as a camelCase `@Output()` typed as `EventEmitter<CustomEvent>` (cast to the concrete detail shape in your handler):

```ts
import { NysAlertDirective, type NysCloseEventDetail } from '@nysds/angular';

@Component({ /* … */ imports: [NysAlertDirective] })
export class BannerComponent {
  onClose(event: CustomEvent): void {
    const detail = event.detail as { id: string; type: string; label: string };
    console.log('dismissed', detail);
  }
}
```

```html
<nys-alert
  type="info"
  heading="Heads up"
  text="Click the X to dismiss."
  dismissible
  (nysClose)="onClose($event)"
></nys-alert>
```

Event-name mapping mirrors the React wrappers:

| DOM event          | Angular `@Output()` |
| ------------------ | ------------------- |
| `nys-input`        | `nysInput`          |
| `nys-change`       | `nysChange`         |
| `nys-blur`         | `nysBlur`           |
| `nys-focus`        | `nysFocus`          |
| `nys-close`        | `nysClose`          |
| `nys-step-click`   | `nysStepClick`      |
| *(any new event)*  | *(auto-generated)*  |

## Legacy `NgModule` consumers

```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NysAngularModule } from '@nysds/angular';

@NgModule({
  imports: [NysAngularModule, FormsModule],
  declarations: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

`NysAngularModule` re-exports every directive — handy for non-standalone apps. Standalone consumers can spread the same set inline:

```ts
import { NYS_DIRECTIVES } from '@nysds/angular';

@Component({
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [...NYS_DIRECTIVES, FormsModule],
  template: `…`,
})
```

## Limitations

A few NYSDS components behave in ways that are worth knowing about up front:

- **`<nys-globalheader>` and `<nys-breadcrumbs>`** clone and sanitize their slotted markup into shadow DOM, which strips Angular event bindings inside the slot. Pass navigation entries through the directives' `items` `@Input()` instead.
- **`<nys-tooltip>` and `<nys-dropdownmenu>`** locate their trigger element by `for="triggerId"`. Use stable, hand-authored `id`s on the trigger — don't rely on Angular's autogenerated IDs which can change between renders.
- **`<nys-radiogroup>` and `<nys-checkboxgroup>`** don't expose public `value` / `selectedValues` getters yet, so the `ControlValueAccessor` directives walk their children to read/write state. Flagged upstream — once getters land, the directives simplify automatically.
- **`<nys-button>` form submission** doesn't propagate through Angular's template boundary, so `NysButtonDirective` walks up to the enclosing `<form>` and calls `requestSubmit()` itself when `type="submit"`. `(ngSubmit)` continues to fire normally.
- **Schema requirement** — Angular still needs `CUSTOM_ELEMENTS_SCHEMA` in any component that renders `nys-*` tags. The directives don't (and can't) bypass that.

## How it stays in sync with the components

```
npm run cem
  └─► cem analyze --config custom-elements-manifest.config.mjs
        ├─► customElementReactWrapperPlugin  → packages/react/
        ├─► customElementJsxPlugin           → packages/react/nysds-jsx.d.ts
        ├─► customElementVsCodePlugin        → dist/.vscode/
        └─► packages/angular/scripts/generate-directives.mjs
              └─► packages/angular/src/lib/ui/<tag>.directive.ts (19 files)
```

The generator owns the 19 simple "wrapper" directives — their `@Input()`s and `@Output()`s are derived directly from the CEM each time `npm run cem` runs. The 10 `ControlValueAccessor` directives and 9 special-case UI directives (button, modal, accordionitem, pagination, globalheader, breadcrumbs, unavheader, tooltip, dropdownmenu) stay hand-written because their behaviour encodes Angular-specific logic the CEM doesn't model. Generated files carry a header banner — edits to them will be overwritten on the next run.

## Repo layout

```
packages/angular/
├── package.json                # private:true at source; ng-packagr writes a
│                               # publishable copy into dist/
├── ng-package.json
├── tsconfig.json
├── tsconfig.lib.json
├── scripts/
│   └── generate-directives.mjs # CEM-driven generator
├── src/
│   ├── public-api.ts           # barrel + side-effect import of @nysds/components
│   ├── lib/
│   │   ├── shared/             # NysControlValueAccessorBase + typed event helpers
│   │   ├── form/               # 10 ControlValueAccessor directives
│   │   ├── ui/                 # 9 hand-written + 19 generated directives
│   │   └── nys-angular.module.ts
└── integration-test/           # standalone Angular + Playwright smoke harness
```

## Local development

```bash
# From the repo root — produce component dists and the CEM
npm run build:packages

# Build the Angular library
npm run build --workspace=@nysds/angular

# Regenerate directives after a Lit component changes (also runs via `npm run cem`)
npm run generate --workspace=@nysds/angular
```

The smoke-test harness in [`integration-test/`](./integration-test/) covers the three integration surfaces — see its own README for run instructions.

## Why not just `CUSTOM_ELEMENTS_SCHEMA` alone?

`CUSTOM_ELEMENTS_SCHEMA` is necessary, but it tells Angular's template type checker to accept *anything* on a custom element — losing all type safety on properties and events. These directives plug that back in: every property gets a typed `@Input()`, every event gets a typed `@Output()`, and form-associated components get `ControlValueAccessor` for free.

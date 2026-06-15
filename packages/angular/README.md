# `@nysds/angular` — Angular wrapper components for NYSDS

Standalone Angular components that wrap each NYSDS web component, giving Angular apps:

- **No `CUSTOM_ELEMENTS_SCHEMA` required** in consumer templates. Each `<nys-*>` tag is matched by an Angular Component selector, so the template type checker stays fully active across the rest of your template — typos on regular elements and bad `@Input()` names still fail the build the way Angular consumers expect.
- **`ControlValueAccessor` bindings** for every form-associated NYSDS component so `ngModel` and Reactive Forms "just work."
- **Typed `@Input()`s and `@Output()`s** mirroring the components' documented properties and `nys-*` events.
- **Two-way binding** (`[(open)]`, `[(expanded)]`, `[(currentPage)]`) on the few components that support it.
- **Side-effect import** of `@nysds/components` so the underlying custom elements register exactly once when any wrapper is imported.

## How it works (briefly)

Each wrapper is declared like this:

```ts
@Component({
  selector: 'nys-textinput',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysTextinputComponent { /* @Input()s, @Output()s, CVA */ }
```

Two things happen when Angular renders `<nys-textinput>` in a consumer's template:

1. Angular finds `NysTextinputComponent` (selector match) and creates the host element.
2. The browser sees a `<nys-textinput>` tag in the DOM, finds the registered custom element, and upgrades the host — the host element IS the custom element.

Slotted content flows through `<ng-content>` (Angular's projection) into the host's light DOM, then into the custom element's shadow DOM `<slot>`.

## Install

```bash
npm install @nysds/components @nysds/angular @nysds/styles
```

You can also import wrappers from the design system's root package via the `./angular` subpath, identical to the existing React subpath:

```ts
import { NysButtonComponent } from '@nysds/components/angular';
```

## Requirements

| | Minimum |
| --- | --- |
| Angular | `>= 20` (developed against 21) |
| TypeScript | matches your Angular peer (5.8+ for v20, 5.9+ for v21) |
| `@nysds/components` | `^1.18.1` |

## Quick start (standalone components)

```ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NysTextinputComponent, NysButtonComponent } from '@nysds/angular';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, NysTextinputComponent, NysButtonComponent],
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

Notice the absence of `CUSTOM_ELEMENTS_SCHEMA` or any schema declaration — none is needed.

## `ReactiveFormsModule`

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NysTextinputComponent, NysCheckboxComponent } from '@nysds/angular';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NysTextinputComponent, NysCheckboxComponent],
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

`NysModalComponent`, `NysAccordionitemComponent`, and `NysPaginationComponent` ship matching `*Change` outputs so the banana-in-a-box syntax works:

```ts
import { Component, signal } from '@angular/core';
import { NysModalComponent, NysButtonComponent } from '@nysds/angular';

@Component({
  standalone: true,
  imports: [NysModalComponent, NysButtonComponent],
  template: `
    <nys-button label="Open" (click)="open.set(true)"></nys-button>

    <nys-modal [(open)]="openValue" modalTitle="Hello">
      <p>Press Escape to close — Angular's signal stays in sync.</p>
    </nys-modal>
  `,
})
export class DemoComponent {
  open = signal(false);
  get openValue() { return this.open(); }
  set openValue(value: boolean) { this.open.set(value); }
}
```

## Listening to typed events

Every `nys-*` `CustomEvent` is surfaced as a camelCase `@Output()` typed as `EventEmitter<CustomEvent>` (cast to the concrete detail shape in your handler):

```ts
import { Component } from '@angular/core';
import { NysAlertComponent } from '@nysds/angular';

@Component({
  standalone: true,
  imports: [NysAlertComponent],
  template: `
    <nys-alert
      type="info"
      heading="Heads up"
      text="Click the X to dismiss."
      dismissible
      (nysClose)="onClose($event)"
    ></nys-alert>
  `,
})
export class BannerComponent {
  onClose(event: CustomEvent): void {
    const detail = event.detail as { id: string; type: string; label: string };
    console.log('dismissed', detail);
  }
}
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
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NysAngularModule } from '@nysds/angular';

@NgModule({
  imports: [NysAngularModule, FormsModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

`NysAngularModule` re-exports every wrapper — handy for non-standalone apps. Standalone consumers can spread the same set inline:

```ts
import { Component } from '@angular/core';
import { NYS_COMPONENTS } from '@nysds/angular';

@Component({
  standalone: true,
  imports: [...NYS_COMPONENTS, FormsModule],
  template: `…`,
})
export class AnyComponent {}
```

## Limitations

A few NYSDS components behave in ways that are worth knowing about up front:

- **`<nys-globalheader>` and `<nys-breadcrumbs>`** clone and sanitize their slotted markup into shadow DOM, which strips Angular event bindings inside the slot. Pass navigation entries through the wrappers' `items` `@Input()` instead.
- **`<nys-tooltip>` and `<nys-dropdownmenu>`** locate their trigger element by `for="triggerId"`. Use stable, hand-authored `id`s on the trigger — don't rely on Angular's autogenerated IDs which can change between renders.
- **`<nys-radiogroup>` and `<nys-checkboxgroup>`** don't expose public `value` / `selectedValues` getters yet, so the `ControlValueAccessor` wrappers walk their children to read/write state. Flagged upstream — once getters land, the wrappers simplify automatically.
- **`<nys-button>` form submission** doesn't propagate through Angular's template boundary, so `NysButtonComponent` walks up to the enclosing `<form>` and calls `requestSubmit()` itself when `type="submit"`. `(ngSubmit)` continues to fire normally.

## How it stays in sync with the components

```
npm run cem
  └─► cem analyze --config custom-elements-manifest.config.mjs
        ├─► customElementReactWrapperPlugin  → packages/react/
        ├─► customElementJsxPlugin           → packages/react/nysds-jsx.d.ts
        ├─► customElementVsCodePlugin        → dist/.vscode/
        └─► nysdsAngularComponentsPlugin (scripts/cem-angular-plugin.mjs)
              ├─► src/lib/ui/<tag>.component.ts    (19 UI wrappers + button)
              └─► src/lib/form/<tag>.component.ts  (10 form components)
```

The generator runs as a CEM plugin during `cem analyze`, reading the in-memory manifest (no extra post-step). It owns three categories, all regenerated from the CEM each time `npm run cem` runs:

- **19 UI wrappers** — thin `@Component`s with one typed `@Input()` per CEM field and one `@Output()` per CEM event (`GENERATED_TAGS`).
- **10 form components** — `ControlValueAccessor`s extending `NysControlValueAccessorBase`. 8 are simple single-value controls; `nys-checkboxgroup` / `nys-radiogroup` read & write their child elements (`FORM_COMPONENTS`). Their value + disabled state are owned by Angular forms, so those properties are excluded from the generated passthrough `@Input()`s.
- **`nys-button`** — typed `@Input()`s derived from the CEM plus the `requestSubmit()` bridge (`type` handled specially).

8 special-case UI components (modal, accordionitem, pagination, globalheader, breadcrumbs, unavheader, tooltip, dropdownmenu) stay hand-written because their behaviour encodes Angular-specific logic the CEM doesn't model. Generated files carry a header banner — edits to them will be overwritten on the next run. To regenerate without a full analysis, run `npm run generate --workspace=@nysds/angular`, which feeds the built `custom-elements.json` through the same generator core.

## Repo layout

```
packages/angular/
├── package.json                # private:true at source; ng-packagr writes a
│                               # publishable copy into dist/
├── ng-package.json
├── tsconfig.json
├── tsconfig.lib.json
├── scripts/
│   ├── cem-angular-plugin.mjs  # CEM-driven generator (runs as a cem plugin)
│   └── generate-components.mjs # standalone CLI wrapper around the same core
├── src/
│   ├── public-api.ts           # barrel + side-effect import of @nysds/components
│   ├── lib/
│   │   ├── shared/             # NysControlValueAccessorBase + typed event helpers
│   │   ├── form/               # 10 generated ControlValueAccessor components
│   │   ├── ui/                 # 8 hand-written + 20 generated components
│   │   └── nys-angular.module.ts
├── demo/                       # runnable signup-form demo (ReactiveForms)
└── integration-test/           # standalone Angular + Playwright smoke harness
```

## Local development

```bash
# From the repo root — produce component dists and the CEM
npm run build:packages

# Build the Angular library
npm run build --workspace=@nysds/angular

# Regenerate wrappers after a Lit component changes (also runs via `npm run cem`)
npm run generate --workspace=@nysds/angular
```

The smoke-test harness in [`integration-test/`](./integration-test/) and the runnable form in [`demo/`](./demo/) both consume the local `dist/`. See their READMEs for run instructions.

## Why wrappers and not directives?

An earlier version of this package shipped attribute-selector **Directives** matched against the `<nys-*>` tags. Directives don't satisfy Angular's template type checker for the host tag — consumers had to add `CUSTOM_ELEMENTS_SCHEMA` to every component that rendered a `<nys-*>` element, which has a real cost: it disables template type checking globally on that component, so typos on a regular `<div>` or wrong `@Input()` names on other Angular components silently pass through.

Wrapping each web component as an Angular Component (with `template: '<ng-content></ng-content>'` and selector matching the tag) lets the consumer template stay fully type-checked while still rendering the real custom element — the host element IS the custom element, since the browser upgrades it during creation.

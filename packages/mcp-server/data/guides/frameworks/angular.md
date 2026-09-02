<!--
  GENERATED FILE. Do not edit directly.
  Source: packages/angular/README.md
  Regenerate with: npm run sync:guides -w @nysds/mcp-server
-->
# @nysds/angular

Angular components for the New York State Design System. Generated from the NYSDS web components library, with full support for template-driven forms, Reactive Forms, and Signal Forms.

## Install

```bash
npm install @nysds/angular @nysds/components
```

Peer dependencies: Angular `>=20.0.0` (core, common, forms).

## Load styles

Add NYSDS styles to your `angular.json`:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/@nysds/styles/full.css"
            ]
          }
        }
      }
    }
  }
}
```

Or import in your main component:

```typescript
import "@nysds/styles/full.css";
```

## First component

Import standalone components directly into your component:

```typescript
import { Component } from "@angular/core";
import { NysTextinputComponent, NysButtonComponent } from "@nysds/angular";

@Component({
  selector: "app-example",
  standalone: true,
  imports: [NysTextinputComponent, NysButtonComponent],
  template: `
    <nys-textinput label="Your name"></nys-textinput>
    <nys-button>Submit</nys-button>
  `,
})
export class ExampleComponent {}
```

Or use `NysAngularModule` in an NgModule app:

```typescript
import { NgModule } from "@angular/core";
import { NysAngularModule } from "@nysds/angular";

@NgModule({
  imports: [NysAngularModule],
  // ...
})
export class AppModule {}
```

## Inputs, outputs, and two-way binding

All properties are typed inputs; events are typed outputs. No `CUSTOM_ELEMENTS_SCHEMA` needed:

```typescript
<nys-textinput
  [label]="'Email'"
  [required]="true"
  (nysChange)="onEmailChange($event)"
></nys-textinput>
```

Event detail is typed:

```typescript
onEmailChange(event: NysTextinputChangeEvent) {
  console.log(event.detail.value); // autocompletes
}
```

## Publishing

The `dist/` directory is the publishable package root. It contains the ng-packagr output (optimized FESM bundles, type definitions, and package.json). Publishing runs from `dist/`, not from the source directory.

## Signal Forms Known Limitations

When using Angular's Signal Forms with `[formField]`, be aware of these constraints:

- **name property overwrite**: The `[formField]` binding overwrites the `name` attribute. This is an Angular Signal Forms limitation; there is no workaround on the component side. Use a different approach for form arrays that require distinct names.
- **pattern validation on empty array**: Angular's Signal Forms passes an empty array for unset pattern metadata. The component defensively ignores these writes; no action needed on your side.

## Forms

### Template-driven forms

Use `[(ngModel)]` with form components:

```typescript
<form>
  <nys-textinput [(ngModel)]="email" name="email"></nys-textinput>
  <nys-checkbox [(ngModel)]="agreed" name="agreed"></nys-checkbox>
</form>
```

### Reactive Forms

Use `formControl` or `formControlName`:

```typescript
form = this.fb.group({
  email: ["", [Validators.required, Validators.email]],
  agreed: [false, Validators.required],
});
```

```html
<form [formGroup]="form">
  <nys-textinput formControlName="email"></nys-textinput>
  <nys-checkbox formControlName="agreed"></nys-checkbox>
</form>
```

### Signal Forms (Angular 21+)

Use `[formField]` with a form field definition:

```typescript
email = signal<string>("");
emailControl = new FormControl<string>("", Validators.required);
```

```html
<nys-textinput [formField]="emailControl"></nys-textinput>
```

### Group controls

`nys-checkboxgroup` and `nys-radiogroup` bind at group level:

```typescript
form = this.fb.group({
  languages: [["en"], Validators.required],
});
```

```html
<nys-checkboxgroup formControlName="languages">
  <nys-checkbox value="en">English</nys-checkbox>
  <nys-checkbox value="es">Spanish</nys-checkbox>
</nys-checkboxgroup>
```

### Validation

By default, the component owns validation. Its `required` and `pattern` attributes drive ElementInternals validation, shown on blur.

To let Angular own validation instead, add the `nysControlErrors` directive:

```html
<nys-textinput
  formControlName="email"
  nysControlErrors
></nys-textinput>
```

The directive subscribes to `control.errors` and sets the component's `showError` and `errorMessage`. Override the default messages:

```typescript
providers: [
  {
    provide: NYS_ERROR_MESSAGES,
    useValue: {
      required: () => "Please fill in this field",
      email: () => "Enter a valid email",
    },
  },
]
```

### Disabled state

`FormControl({ disabled: true })` disables the component:

```typescript
control = new FormControl({ value: "", disabled: true });
```

```html
<nys-textinput [formControl]="control"></nys-textinput>
```

## Server-side rendering

The components render client-side. For SSR, wrap containers in `ngSkipHydration`:

```html
<div ngSkipHydration>
  <nys-textinput></nys-textinput>
</div>
```

Or use `provideClientHydration` if registering components client-only.

## Zoneless

The component outputs use Angular's `output()` function, which integrates with zoneless change detection. Zoneless apps work without extra configuration.

## Subpath imports

Import individual components:

```typescript
import { NysTextinputComponent } from "@nysds/angular/textinput";
import { NysCheckboxComponent } from "@nysds/angular/checkbox";
```

## License

MIT

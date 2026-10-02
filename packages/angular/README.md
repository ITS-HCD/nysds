# @nysds/angular

Angular components for the New York State Design System. Generated from the NYSDS web components library, with full support for template-driven forms, Reactive Forms, and Signal Forms.

NYSDS Angular components are true Angular components, not raw custom elements. They work with Angular's template type-checking out of the box, and `CUSTOM_ELEMENTS_SCHEMA` is not needed.

## Requirements
 
- Angular `>=20.0.0` (core, common, forms)

## Installation
Install the two NYSDS packages: `@nysds/angular` for the Angular-wrapped components and `@nysds/styles` for the design tokens and global CSS.

```bash
npm install @nysds/angular @nysds/styles
```

> **Note:** Both packages are versioned together. Always install matching versions to avoid token/component mismatches.

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
              "node_modules/@nysds/styles/dist/nysds-full.min.css"
            ]
          }
        }
      }
    }
  }
}
```

## Basic usage
 
### Standalone components
 
Import individual NYSDS components directly into your standalone component's `imports` array:
 
```typescript
import { Component } from "@angular/core";
import { NysButtonComponent } from "@nysds/angular";
 
@Component({
  selector: "app-my-component",
  standalone: true,
  imports: [NysButtonComponent],
  template: `
    <nys-button
      label="Submit"
      variant="primary"
      (nysClick)="handleSubmit()"
    ></nys-button>
  `,
})
export class MyComponent {
  handleSubmit() {
    console.log("Button clicked!");
  }
}
```

### NgModule apps
 
If you're using an NgModule-based architecture, or want to import all components at once, import `NysAngularModule` into your app or feature module:

```typescript
import { NgModule } from "@angular/core";
import { NysAngularModule } from "@nysds/angular";

@NgModule({
  imports: [NysAngularModule],
  // ...
})
export class AppModule {}
```

### Forms integration
 
Components support `ControlValueAccessor` natively, so they work with Template-driven forms (`[(ngModel)]`) and Reactive Forms (`formControlName`), including built-in form validation:
 
```html
<!-- Template-driven forms -->
<nys-textinput
  label="First name"
  name="firstName"
  [(ngModel)]="firstName"
></nys-textinput>
 
<!-- Reactive forms -->
<nys-textinput
  label="First name"
  name="firstName"
  formControlName="firstName"
></nys-textinput>
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

### Subpath imports
 
Import individual components:
 
```typescript
import { NysTextinputComponent } from "@nysds/angular/textinput";
import { NysCheckboxComponent } from "@nysds/angular/checkbox";
```

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


## Publishing

The `dist/` directory is the publishable package root. It contains the ng-packagr output (optimized FESM bundles, type definitions, and package.json). Publishing runs from `dist/`, not from the source directory.

## License

MIT

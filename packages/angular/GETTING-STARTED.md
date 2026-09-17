# Getting started with `@nysds/angular`

Typed standalone Angular components for every NYSDS web component. Requires Angular 20+.

## 1. Install

```bash
npm install @nysds/angular@alpha @nysds/styles
```

- `@alpha` is required until 1.22.0 ships. `latest` still points at the old 1.18.2 build.
- Pin the exact version in `package.json`.
- Using Yarn classic or pnpm without auto-installed peers? Also add `lit@^3.3.1`.
- Keep `"skipLibCheck": true` in `tsconfig.json` (the Angular CLI default).

## 2. Load styles

```css
/* src/styles.css */
@import "@nysds/styles/full";
```

Optional agency theme: `<html data-theme="health">`. Themes: `admin`, `business`, `environment`, `health`, `local`, `safety`, `transportation`.

Fonts aren't bundled. Load them the way your agency normally does.

## 3. Use a component

**Standalone apps:** import each wrapper you use, including child elements (`NysCheckboxComponent` inside a checkbox group, `NysTabComponent` inside a tab group, …).

```ts
import { Component } from "@angular/core";
import { NysAlertComponent, NysButtonComponent } from "@nysds/angular";

@Component({
  selector: "app-root",
  imports: [NysAlertComponent, NysButtonComponent],
  template: `
    <nys-alert type="info" heading="Welcome"></nys-alert>
    <nys-button label="Start" (nysClick)="start()"></nys-button>
  `,
})
export class AppComponent {
  start() {}
}
```

**NgModule apps:** add `NysAngularModule` to `imports`.

Per-component subpaths also work: `import { NysButtonComponent } from "@nysds/angular/button"`.

No `CUSTOM_ELEMENTS_SCHEMA` is needed.

## 4. Inputs, outputs, slots

```html
<nys-textinput
  label="Email"
  required
  [maxlength]="50"
  [showError]="hasError()"
  (nysChange)="onChange($event)"
>
  <span slot="description">We'll never share it.</span>
</nys-textinput>
```

- **Inputs** use property names in camelCase.
- **Nullable number inputs** (`maxlength`, `min`, `max`, `step`) need `[bracket]` binding.
- **Outputs** are camelCased event names: `nys-change` → `(nysChange)`. `$event` is typed, e.g. `import type { NysTextinputChangeEvent } from "@nysds/nys-textinput"`.
- **No two-way binding** (`[(value)]`). Use Angular Forms instead.

## 5. Forms

Works with `formControlName`, `[formControl]`, and `[(ngModel)]`:

| Component | Value |
| --- | --- |
| `textinput`, `textarea`, `select`, `combobox`, `datepicker`, `radiogroup` | `string` |
| `checkboxgroup` | `string[]` |
| `checkbox`, `toggle` | `boolean` |
| `fileinput` | `File[]` |

```html
<form [formGroup]="form">
  <nys-textinput label="Name" formControlName="name"></nys-textinput>
  <nys-radiogroup label="Contact" formControlName="contact">
    <nys-radiobutton label="Email" value="email"></nys-radiobutton>
    <nys-radiobutton label="Phone" value="phone"></nys-radiobutton>
  </nys-radiogroup>
</form>
```

- Bind radios on `nys-radiogroup`, not on each `nys-radiobutton`.
- Blur marks the control touched. `disable()` disables the element.
- Signal Forms (Angular 21+, experimental) works via `[formField]`. See `examples/angular-app/src/app/forms-signal/`.

## 6. Validation

Choose one owner per field:

- **Component:** set `required`, `pattern`, etc. on the element. It shows its own errors on blur.
- **Angular:** add validators to the control and put `nysControlErrors` on the element (import `NysControlErrorsDirective`). To change messages, provide `NYS_ERROR_MESSAGES`. Your object replaces the defaults, so include every key you use.

## 7. Element methods

```ts
upload = viewChild.required("upload", { read: ElementRef<NysFileinput> });
// this.upload().nativeElement.setFiles(files)
```

## Migrating from plain web components

1. Remove the NYSDS `<script>` tag or `import "@nysds/components"`.
2. Remove `CUSTOM_ELEMENTS_SCHEMA` where it only served `nys-*` tags.
3. Import the wrappers.
4. Replace `(nys-change)` with `(nysChange)`, and `[attr.x]` or `$any` bindings with typed inputs.
5. Replace hand-written form glue with `formControlName` or `ngModel`.

## Known limitations (alpha)

| Issue | Workaround |
| --- | --- |
| A `nys-checkbox` with `other` bound to a form can report `false` after the "Other" field is edited | Bind the parent `nys-checkboxgroup` |
| `nys-checkboxgroup` may emit a child's string before its `string[]` | Use the final value, not every emission |
| `nysControlErrors` doesn't show errors on blur alone | On submit, call `markAllAsTouched()`, then `updateValueAndValidity()` on each control |
| `form.reset()` leaves files visible in `nys-fileinput` | Also set `nativeElement.files = []` |
| SSR isn't verified | Build client-only, or put `ngSkipHydration` on a component host |

## Troubleshooting

| Error | Fix |
| --- | --- |
| `NG8001: 'nys-x' is not a known element` | Import `NysXComponent`. Check casing, e.g. `NysDropdownMenuComponent` |
| `Type '"50"' is not assignable to type 'number'` | Use `[maxlength]="50"` |
| `Cannot find module '@nysds/internals'` | Set `skipLibCheck: true` |
| Unstyled components | Load `@nysds/styles/full` |

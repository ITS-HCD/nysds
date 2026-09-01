# WS5: Example apps and CI matrix

**Goal:** Prove both packages in real apps across the supported framework versions, on every PR. The example apps double as the source for the per-framework reference pages (WS6).
**Depends on:** WS3, WS4.
**Owns:** `examples/**`, `.github/workflows/frameworks.yaml` (the matrix section WS0 stubbed).
**Branch:** `feat/fw-5-examples`.

## Apps

All are `private: true` workspace packages consuming `@nysds/react` / `@nysds/angular` through the workspace link. Each has the same three pages so the two frameworks stay comparable, and each page maps to a section of the framework reference page on the docs site.

| Page | What it exercises |
|---|---|
| `/kitchen-sink` | Every component rendered once with representative props and slots; asserts custom elements upgraded |
| `/forms` | A realistic application form: textinput, textarea, select, combobox, datepicker, checkbox, checkboxgroup, radiogroup, toggle, fileinput, submit button. Native validation, framework validation, disabled state, reset, and a submitted-values readout |
| `/events` | Alert close, modal open/close two-way, pagination change, tabs change, dropdown menu select; a log panel showing typed detail |

### `examples/react-vite`

Vite + React 19 + TypeScript strict. `/forms` implemented twice: controlled `useState`, and React Hook Form with `useNysField`. A `REACT_VERSION` env switch (or a second package `examples/react-vite-18`) so CI can run the same app on React 18.

### `examples/next-app`

Next.js App Router, latest stable. Same three pages as client components; one server component page that renders a client wrapper through a boundary. `next build` must succeed with no hydration warnings in `next start` (Playwright asserts on console).

### `examples/angular-app`

Angular CLI standalone app on the Angular 20 line, TypeScript strict, `strictTemplates`. `/forms` implemented three times: template-driven (`[(ngModel)]`), Reactive (`formControlName` + `nysControlErrors`), and Signal Forms (`[formField]`, compiled only when the installed Angular is ≥ 21; keep it in a lazily loaded route so the app builds on 20). Zoneless bootstrap (`provideZonelessChangeDetection`) behind a flag so CI runs both.

### `examples/angular-ngmodule`

Minimal NgModule-based app importing `NysAngularModule`. One page. Exists to prove the non-standalone path.

## Version matrix

CI installs the example app's framework at each version in the matrix and runs build + smoke tests. Matrix values live in one place (`examples/matrix.json`) so bumping a version is one edit:

```json
{
  "react": ["18.3", "19"],
  "next": ["latest"],
  "angular": ["20", "21", "22"]
}
```

For Angular, the matrix job runs `npx ng update`-free installs: `npm i @angular/core@<v> @angular/common@<v> @angular/forms@<v> @angular/platform-browser@<v> @angular/cli@<v> @angular-devkit/build-angular@<v> typescript@<compatible>` in the example app, then builds. A helper script `examples/scripts/pin-angular.mjs <version>` does this and picks the TypeScript range Angular's `package.json` peer says.

## Smoke tests

Playwright, one `tests/` folder per app, run against the production build served statically (`vite preview`, `next start`, `ng serve --configuration production` or a static server on `dist/`).

Shared assertions (write once in `examples/shared-tests/`, import per app):
- Kitchen sink: every `nys-*` tag on the page has `customElements.get(tag)` defined and a shadow root (except `nys-radiobutton`).
- Forms: type into textinput → model updates; check checkbox → model updates; choose radio → group model updates; pick date → model is `YYYY-MM-DD`; submit invalid → error message visible; submit valid → readout matches; disable via framework → element `disabled`; reset → cleared.
- Events: close alert → handler received typed detail; open modal → two-way state true; Escape → false.
- Console: zero errors, zero Lit `change-in-update` warnings, zero hydration warnings (Next).

## CI wiring

Flip the WS0 placeholder matrix job on. Jobs run after `build:all`, in parallel per app × version. Cache `~/.npm` and Playwright browsers. Fail the PR on any failure. Total wall time target: under 15 minutes.

## Acceptance criteria

- [ ] Four example apps build and their smoke tests pass locally on the default versions
- [ ] Matrix job passes for React 18 and 19, Next latest, Angular 20, 21, 22 (zone and zoneless)
- [ ] Signal Forms route passes on 21 and 22 and is skipped, not failing, on 20
- [ ] Each app's `/forms` page has a `data-testid="submitted"` readout used by the shared tests
- [ ] `examples/README.md` explains how to run each app and how to bump `matrix.json`

## Commands for the user to run

- `npm run build:all && npm run test:examples` (add this root script: runs every example's `test` script)

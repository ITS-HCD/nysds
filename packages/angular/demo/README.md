# @nysds/angular demo

A runnable Angular 21 standalone app that exercises three `@nysds/angular`
directives wired through `ReactiveFormsModule`:

| Field      | Component             | Validation                    |
| ---------- | --------------------- | ----------------------------- |
| Full name  | `<nys-textinput>`     | `required`, `minLength(2)`    |
| Email      | `<nys-textinput type="email">` | `required`, `email`  |
| Frequency  | `<nys-radiogroup>` with three `<nys-radiobutton>` children | `required` |

Submitting prints the typed form value into a result panel.

## Running locally

`@nysds/angular` is referenced as `file:../dist` so the parent library must be
built first — the npm registry doesn't have `@nysds/angular` yet.

```bash
# From the repo root, on a fresh clone
npm install                                  # workspace install
npm run build:packages                       # produces all dist/ folders incl. @nysds/angular

# Then in this folder
cd packages/angular/demo
npm install
npm run dev                                  # vite dev server on http://localhost:5173
```

If you only changed `@nysds/angular` source after the initial setup:

```bash
# Rebuild the library
npm run build --workspace=@nysds/angular

# Reinstall locally so the demo picks up the fresh dist
cd packages/angular/demo
npm install --force
```

## What's in here

```
packages/angular/demo/
├── package.json          @nysds/angular as file:../dist
├── vite.config.ts        Vite + @analogjs/vite-plugin-angular
├── tsconfig.json
├── index.html            <app-root> + global @nysds/styles
└── src/
    ├── main.ts           bootstrapApplication(AppComponent)
    └── app.component.ts  the signup form
```

## Why not the Angular CLI?

Same reason the integration-test harness doesn't use it: Vite + Analog is
lighter, no scaffolding to maintain, and matches the build tooling the rest
of the NYSDS monorepo already uses.

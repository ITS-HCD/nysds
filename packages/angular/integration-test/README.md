# @nysds/angular smoke-test harness

This is **not** a published package. It exists to prove the library wires up
correctly inside a real Angular standalone app.

The harness covers three integration surfaces:

1. `ControlValueAccessor` round-trip — `ngModel` through `NysTextinputDirective`.
2. Typed `CustomEvent` output — `(nysClose)` on `NysAlertDirective`.
3. Two-way binding — `[(open)]` on `NysModalDirective`.

## Running locally

```bash
# From this directory — installs Angular runtime + Playwright + vite + analog
npm install

# One-time: install the Playwright browser
npm run test:install

# Manual sanity check (vite dev server on http://localhost:4321)
npm run dev

# Run the Playwright spec — boots `vite dev` automatically via webServer config
npm test
```

The vite dev server uses `@analogjs/vite-plugin-angular` so there's no Angular
CLI scaffolding to maintain — the standalone app bootstraps directly through
`main.ts`.

## Prerequisites

`@nysds/angular` is referenced as `file:../dist` in [package.json](./package.json),
so the parent library must be built **before** running `npm install` here.
The npm registry doesn't have `@nysds/angular` yet (still unpublished), so
without the local `dist/` you'll see `404 Not Found` during install.

```bash
# From the repo root — produces packages/angular/dist/ via ng-packagr
npm run build --workspace=@nysds/angular

# (Or, on a fresh clone, run the full workspace build to get every component
#  dist too — required for the ng-packagr build to resolve @nysds/components)
npm run build:packages
```

Re-run the angular build whenever you change directive source. After that,
`npm install --force` (or wipe `node_modules`) here picks up the new copy.

## Why isn't this in npm workspaces?

It's intentionally outside the `packages/*` glob so its heavy dev dependencies
(`@analogjs/*`, `@playwright/test`, `@angular/build`, etc.) don't bleed into
the root install for everyone working on the design system. Run `npm install`
inside this directory to set it up on demand.

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

# Build + run the Playwright spec
npm run build
npm test
```

The vite dev server uses `@analogjs/vite-plugin-angular` so there's no Angular
CLI scaffolding to maintain — the standalone app bootstraps directly through
`main.ts`.

## Prerequisites

Before installing here, the parent `@nysds/angular` package must have been
built so its `dist/` is available to symlink:

```bash
# From the repo root
npm run build:packages
```

## Why isn't this in npm workspaces?

It's intentionally outside the `packages/*` glob so its heavy dev dependencies
(`@analogjs/*`, `@playwright/test`, `@angular/build`, etc.) don't bleed into
the root install for everyone working on the design system. Run `npm install`
inside this directory to set it up on demand.

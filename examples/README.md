# NYSDS example apps

Minimal apps that consume `@nysds/react` and `@nysds/angular` through
workspace links and prove the framework integration on every PR. Each
app renders the same three pages, so the frameworks stay comparable:

| Page | What it exercises |
|---|---|
| `/kitchen-sink` | Every component rendered once; asserts each custom element is defined and upgraded |
| `/forms` | A realistic application form: model binding, validation, disabled state, reset, and a submitted-values readout |
| `/events` | Typed component events (alert close, modal two-way, pagination, tabs, dropdown menu) logged to a panel |

## Apps

| App | Framework | Form variants |
|---|---|---|
| `react-vite/` | Vite + React 19 (CI also runs 18.3) | `/forms/controlled` (useState + native validation), `/forms/hook-form` (React Hook Form + `useNysField`) |
| `next-app/` | Next.js App Router | `/forms` (controlled); `/kitchen-sink` renders through a server-component boundary |
| `angular-app/` | Angular 20 standalone, strict templates, zone and zoneless builds | `/forms/template` (`[(ngModel)]`), `/forms/reactive` (`formControlName` + `nysControlErrors`), `/forms/signal` (Signal Forms `[formField]`, Angular 21+) |
| `angular-ngmodule/` | Angular 20 NgModule app | One page proving `NysAngularModule` and `[(ngModel)]` |

`shared-tests/` holds the Playwright assertions every app imports, and
`scripts/` holds the version-pinning helper and the static file server
for the Angular builds.

## Run an app locally

Build the monorepo once, then build and test the app:

```sh
npm run build:all              # or at minimum: npm run cem && npm run build:packages && npm run build:frameworks
npm run build -w examples/react-vite
npm run test -w examples/react-vite
```

The `test` script starts the app's production server through
Playwright's `webServer`. Use `npm run dev -w examples/<app>` for a dev
server. `examples/angular-app` also has `npm run test:zoneless`, which
runs the same suite against the zoneless build that `build` produces.

Install Playwright's browser once per machine:

```sh
npx playwright install chromium
```

## Version matrix

CI reads `examples/matrix.json` and runs every app at every listed
framework version. To add or bump a version, edit that file — the
workflow (`.github/workflows/frameworks.yaml`) expands it into jobs.

To reproduce a matrix cell locally:

```sh
# React 18 in the react-vite app
npm i -w examples/react-vite react@18.3 react-dom@18.3 @types/react@18 @types/react-dom@18

# Angular 22 in the angular-app
node examples/scripts/pin-angular.mjs 22 examples/angular-app
```

`pin-angular.mjs` installs every `@angular/*` package the app uses at
the requested major plus the TypeScript version its compiler asks for.
Pin back to the default (React 19, Angular 20) the same way, and reset
the caret ranges in the app's `package.json` before committing.

## Signal Forms on Angular 20

`@angular/forms/signals` doesn't exist on Angular 20, so
`angular-app/scripts/sync-signal-forms.mjs` (a `prebuild` hook) writes
the `/forms/signal` route's barrel to point at the real page on Angular
21+ and at a fallback page on 20. The smoke tests skip the signal suite
when they see the fallback.

## Temporary workarounds

The Angular apps compile `@nysds/angular` from source through a
tsconfig `paths` mapping because the package's exports map doesn't
match its ng-packagr output yet. The mapping, and the two tsconfig
relaxations next to it, carry `WORKAROUND` comments and come out when
WS4 fixes the packaging.

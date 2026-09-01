# NYSDS Angular kitchen-sink demo

An Angular 20 app (standalone components, zoneless, signals) that renders
every NYSDS component through the generated `@nysds/angular` wrappers,
resolved via the npm workspace to the **local** `packages/*/dist` builds.

```bash
# from the repo root
npm install
npm run build:packages          # builds tokens, styles, every nys-* package, and @nysds/angular
npm start -w @nysds/angular-demo   # serves on http://localhost:4200
```

Highlights:

- `src/app/app.component.ts` imports everything at once via
  `...NYSDS_COMPONENTS`.
- The "Template-driven forms" and "Reactive form" sections exercise the
  generated `ControlValueAccessor`s (`[(ngModel)]`, `formControlName`,
  validation + `touched` styling).
- Booleans are property-bound (`[bordered]="true"`) — see
  [`../PACKAGING.md`](../PACKAGING.md) for why.

Why certain things look the way they do — the wrapper generation, the
per-element subpath exports, ng-packagr — is documented step by step in
[`../PACKAGING.md`](../PACKAGING.md).

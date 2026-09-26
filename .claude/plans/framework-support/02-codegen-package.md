# WS2: `@nysds/codegen`

**Goal:** One package that knows how to read the manifest and emit framework artifacts, so React, Angular, the docs site, the MCP server, and Storybook all derive from the same rules.
**Depends on:** WS0. Uses WS1's tags when they land; until then, develops against fixtures.
**Owns:** `packages/codegen/**`, the plugin registrations in `src/scripts/custom-elements-manifest.config.mjs`.
**Branch:** `feat/fw-2-codegen`.

## Package shape

```
packages/codegen/
  package.json              @nysds/codegen, "type": "module", published (the docs site needs it)
  tsconfig.json
  src/
    index.ts                public API
    manifest/
      load.ts               loadManifest(path) → typed Manifest; validates with a light schema
      components.ts         listComponents(manifest) → ComponentMeta[]
      form-control.ts       parseFormControlTag(jsdoc) → { kind, changeEvent, inputEvent? }
      naming.ts             tagToClass, classToAngularClass, eventToReactProp, eventToAngularOutput, tagToSubpath
      packages.ts           tagToPackage(manifest module path) → "@nysds/nys-accordion" (derived from module path, no table)
      filters.ts            isPublicMember, isExposedEvent (skips @internal, @deprecated, leading underscore, static, Lit internals like updateComplete)
    cem-plugins/
      form-control.mjs      CEM plugin: attaches declaration.formControl from the @formControl tag; fails the analyze run on malformed tags
      react.mjs             CEM plugin: writes packages/react/src/generated/**
      angular.mjs           CEM plugin: writes packages/angular/src/generated/**
      deps.mjs              CEM plugin: rewrites the generated `dependencies` block in both framework package.json files (lockstep versions)
    transform/
      parse.ts              parse5-based HTML fragment parser
      to-jsx.ts             HTML → JSX string
      to-angular.ts         HTML → Angular template string
      index.ts              transformExample({ html, framework, manifest, options })
  test/
    fixtures/manifest.json  trimmed manifest covering every case (form kinds, sub-components, slots, boolean/number/object props, events)
    fixtures/examples/*.html + expected .jsx / .angular.html golden files
    *.test.ts               node:test or vitest
```

`src/scripts/custom-elements-manifest.config.mjs` imports the plugins from `@nysds/codegen/cem-plugins` and registers `formControlPlugin()` before `reactPlugin()` and `angularPlugin()`. The `custom-element-react-wrappers` and `custom-element-jsx-integration` registrations are removed in WS8 (interim: both run until `@nysds/react` ships).

Because the CEM analyze step runs before `packages/codegen` is built in `build:all`, the plugins are plain `.mjs` with no build step, importing only from other `.mjs` files or from the built `dist/` of the TypeScript sources. Simplest: keep `manifest/*` and `transform/*` in TypeScript (built), and make the `.mjs` plugins thin and self-contained for the parts the analyzer needs (naming, filters, form-control parsing), sharing a single `naming.mjs` that the TypeScript side re-exports. Don't duplicate rules in two languages; pick one direction of import and document it.

## Public API

```ts
export function loadManifest(path?: string): Manifest;            // defaults to require.resolve("@nysds/components/custom-elements.json")
export function listComponents(m: Manifest): ComponentMeta[];
export interface ComponentMeta {
  tag: string;                 // "nys-textinput"
  className: string;           // "NysTextinput"
  packageName: string;         // "@nysds/nys-textinput"
  subpath: string;             // "textinput"
  props: PropMeta[];           // public, non-deprecated; { name, attribute?, type, default?, description, isBoolean, isPrimitive }
  events: EventMeta[];         // { name, typeText, reactProp, angularOutput, description }
  slots: SlotMeta[];
  formControl?: { kind: "value" | "checked" | "files"; changeEvent: string; inputEvent?: string };
}
export function transformExample(input: { html: string; framework: "react" | "angular"; manifest: Manifest; formsMode?: "none" | "template" | "reactive" }): TransformResult;
export interface TransformResult { code: string; language: "jsx" | "html"; warnings: string[]; unsupported: boolean }
```

## Transformer rules

Input is the `preview` HTML from a docs example (or a `@example` block in JSDoc). Output is a snippet, not a full file; the docs partial wraps imports.

**Both frameworks**
- Only `nys-*` elements are transformed; native elements pass through.
- Attribute names map to `fieldName` from the manifest (`show-error` → `showError`). Unknown attributes pass through unchanged with a warning.
- Boolean attributes: present → `true`.
- `slot="x"` stays as an attribute in both frameworks.
- `<script>` and `<style>` blocks in the example are dropped with a warning and `unsupported: true` if the script referenced a `nys-*` element (the example depends on imperative code that can't be transformed).
- Inline `onclick`-style handlers → warning + `unsupported: true`.

**React (`to-jsx.ts`)**
- Element → class name: `<nys-button label="Go">` → `<NysButton label="Go" />` (self-close when empty).
- `class` → `className`, `for` → `htmlFor` on native elements.
- Boolean → `{true}` omitted (bare prop). Numbers → `{3}`. Strings stay quoted.
- If `formControl` exists and the example sets `value`/`checked`, emit the controlled pattern comment: `value={value} onNysChange={(e) => setValue(e.detail.value)}` behind `formsMode !== "none"`. Default `formsMode: "none"` keeps snippets static.
- Emit an `imports` list in the result (`["NysButton"]`) so the docs partial can render `import { NysButton } from "@nysds/react";` above the snippet.

**Angular (`to-angular.ts`)**
- Tags stay as they are.
- String attributes stay attributes. Booleans stay bare attributes (`required`). Numbers and objects become property bindings (`[maxlength]="10"`).
- Event attributes never appear in HTML examples; nothing to map.
- `formsMode: "template"` and a `formControl` on the element: add `[(ngModel)]="model.<name>"` and drop `value`/`checked`. `formsMode: "reactive"`: add `formControlName="<name>"`.
- Emit `imports` as Angular class names (`NysButtonComponent`) so the docs partial can render the `imports: [...]` line.

**Golden tests**
- One fixture per rule above.
- A test that runs the transformer over every `{% set preview %}` block extracted from `../nysds-site/src/content/components/**/index.md` (path configurable, skipped when absent) and asserts zero `unsupported` results except an allowlist. This is how the docs site build stays honest.

## CEM plugin contracts

**`form-control.mjs`**: reads the class JSDoc `@formControl` tag; writes `declaration.formControl`. Malformed tag or unknown kind → throw with file path. Missing tag on a class that extends `NysFormControlElement` (detect via `superclass.name`) → throw, except for an allowlist (`NysButton`, `NysRadiobutton`, `NysOption`) declared in the plugin options, not in code.

**`react.mjs`**: for each component, writes `packages/react/src/generated/<ClassName>.ts` and `packages/react/src/generated/index.ts`. Template is decided by R1 (see `03-react-package.md`). Clears the directory first. Skips a component when `packages/react/src/overrides/<ClassName>.ts` exists and re-exports from it in the barrel.

**`angular.mjs`**: writes `packages/angular/src/generated/<tag>.component.ts`, `packages/angular/src/generated/index.ts`, and `packages/angular/src/generated/nys-angular.module.ts`. Same override rule with `packages/angular/src/overrides/`. Template in `04-angular-package.md`.

**`deps.mjs`**: reads root `package.json` version; rewrites `dependencies` in `packages/react/package.json` and `packages/angular/package.json` to `{ "@nysds/nys-<name>": "<version>" }` for every component package that has a wrapper, and `peerDependencies["@nysds/components"]` to `^<major>.<minor>.0`. Also rewrites the `exports` map with one subpath per component (`./textinput`). Deterministic ordering. The rest of each `package.json` is hand-written and untouched.

## Acceptance criteria

- [ ] `npm test -w @nysds/codegen` passes; golden files cover every transformer rule
- [ ] `npm run cem` on `develop` + WS1 produces `formControl` on all ten form components and throws on a deliberately malformed tag (test by temporarily editing a fixture, not a real component)
- [ ] Naming rules match `README.md` section 4.1 exactly; a single test table pins them
- [ ] No per-component table anywhere in the package (`grep -rn "nys-" src/ | grep -v test` returns only the `nys-` prefix constant and the allowlist option default)
- [ ] `tagToPackage` derives from the manifest module path (`packages/nys-accordion/src/nys-accordionitem.ts` → `@nysds/nys-accordion`)
- [ ] Package publishes as `@nysds/codegen` with `files: ["dist", "cem-plugins", "README.md"]`

## Commands for the user to run

- `npm run build -w @nysds/codegen && npm test -w @nysds/codegen`
- `npm run cem` then inspect `custom-elements.json` for `formControl`

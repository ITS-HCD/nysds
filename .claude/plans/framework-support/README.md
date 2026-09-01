# NYSDS framework support: React and Angular

**Status:** Plan, ready for review
**Date:** 2026-09-01
**Owner:** NYSDS core team
**Deliverables:** `@nysds/react`, `@nysds/angular`, generated docs snippets, per-framework reference pages

This directory is the working plan for shipping first-class React and Angular support. It's written so that a team of agents (or people) can pick up any workstream brief and build it without re-deriving the context.

| File | What it covers |
|---|---|
| `README.md` (this file) | Findings, decisions, architecture, workstream map, sequencing, acceptance criteria |
| `00-hygiene-and-foundations.md` | Repo hygiene, cleanup of prior attempts, shared build plumbing |
| `01-component-event-contract.md` | Normalize the form-component event and property contract that both frameworks depend on |
| `02-codegen-package.md` | `@nysds/codegen`: one metadata layer, two CEM plugins, one snippet transformer |
| `03-react-package.md` | `@nysds/react` |
| `04-angular-package.md` | `@nysds/angular`, including forms |
| `05-example-apps-and-ci.md` | Example apps, framework version matrix, smoke tests |
| `06-docs-site.md` | Tabbed snippets on every component page, per-framework reference pages |
| `07-mcp-storybook-and-tooling.md` | MCP server guides and tools, Storybook, plugin agent definitions |
| `08-release-and-migration.md` | Deprecations, alpha channel, release script, comms |
| `agent-brief-template.md` | Prompt template for handing a workstream to a subagent |

## 1. Priorities (from the request)

1. **Automation over hand-built wrappers.** One source of truth generates every framework artifact. Adding a component to the design system must not require touching the framework packages by hand.
2. **Native DX in each framework.** `ngModel`, Reactive Forms, and Signal Forms in Angular; controlled components, refs, React Hook Form, and Next.js in React.
3. **Consistency across frameworks.** Same names, same event mapping rules, same package shape, same docs shape.
4. **Documentation that maintains itself.** The code snippets on designsystem.ny.gov are derived, not authored, per framework.
5. **Angular forms are the hard part.** Teams report that Angular's form handling is where custom elements break. The plan treats this as a first-class design problem, not a wrapper detail.

Locked by the team before this plan: the packages are `@nysds/react` and `@nysds/angular`. The `@nysds/components/react` subpath is deprecated and `@nysds/components/angular` never ships.

## 2. What exists today (findings)

Four investigations ran against `develop`, the two feature branches, npm, and the docs site. The full detail lives in the workstream briefs; this is the summary.

### 2.1 React on `develop`

- `custom-element-react-wrappers` already generates `packages/react/` (105 committed files) from `custom-elements.json` during `npm run cem`, exposed as `@nysds/components/react`.
- Generated output is committed with no cleanup step. `packages/react/NysBreadcrumbItem.js` is an orphan for a component that no longer exists.
- Generated `.d.ts` files import `CustomEvent` and `Event` from component packages that don't export them, so strict TypeScript consumers get errors on every wrapper.
- Primitive props are set as attributes, not properties. Controlled inputs that re-set the same value after user typing don't round-trip.
- `src/scripts/patch-react-utils.js` overwrites the generator's runtime after every build to fix a stale-closure bug. That's a maintained fork-by-patch of third-party code.
- No `"use client"` banner; `ssrSafe` is commented out.
- The plugin's `react-wrapper` agent definition describes `@lit/react`, which the repo doesn't use.

### 2.2 `enhancement/react-angular-implementation` (junior developer, 2026-08-28)

Real hand-written code on the branch is about 230 lines; the remaining 21,000 insertions are `package-lock.json`, generated output, and a polluted `custom-elements.json` that now includes `packages/angular/node_modules/@babel/core/src/**`.

Keep:
- The `modulePath` change so React wrappers import `@nysds/nys-<name>` per component instead of `../../dist/nysds.es.js`. Correct and minimal.
- The `customElements.get("nys-option")` guard in `nys-option.ts`.
- `PRDFRAMEWORKS.md`: a well-reasoned doc whose locked decisions this plan keeps (D1 per-component imports, D2 deprecated alias, D7 example apps in CI, D9 defer class-name normalization).

Don't build on:
- The Angular half. Generated `@Component` proxies declare `@Input()`s that never reach the element (no setter, no `ngOnChanges`, no `Renderer2`), and `@Output()`s that never emit while shadowing the native DOM events that would otherwise work. The CVA listens for `nys-change` on `nys-textinput`, `nys-textarea`, and `nys-datepicker`, which fire `nys-input`. Nothing on the branch compiles the Angular package; `ng-packagr` was never run.
- Root `files` drops `packages/react/` while `exports` still declares `./react`, which breaks every current `@nysds/components/react` consumer with no deprecation path.
- Hand-maintained tables (`tagToPackageMap`, `FORM_COMPONENTS`) that duplicate information already in the manifest.
- `packages/angular/package.json` with no `main`, `module`, `types`, `exports`, or `files`.

### 2.3 `feature/angular-support` (Eric Steinborn, May–June 2026) and `@nysds/angular@1.18.2` on npm

This is the better Angular design and the plan builds on it:
- Abstract `NysControlValueAccessorBase` directive: `Renderer2` property writes, `nys-blur` → `onTouched`, overridable `extractValue(event)` reading `event.detail`.
- Typed inputs as setters that forward to the element; typed `CustomEvent` aliases; an `NgModule` for non-standalone apps; a demo app; Playwright smoke tests; publish-ready `package.json` built by ng-packagr.
- Later commits moved to "wrap the components, no custom schema needed" and "convert generation to a CEM plugin".

Problems:
- Stale (2.5 months behind `develop`), imports the `@nysds/components` monolith instead of per-component packages, and only 19 tags are generator-managed; the rest are hand-written.
- `@nysds/angular@1.18.2` (and two alphas) on npm is the **source folder**, not the ng-packagr output: `demo/`, `integration-test/`, `.turbo/` logs, lockfiles, and no `main` or `exports`. Anyone who installs it gets nothing usable. It needs `npm deprecate`.

### 2.4 Form component architecture on `develop`

Every form component extends `NysFormControlElement` (`packages/internals/src/form-control-mixin.ts`) with `formAssociated = true` and `ElementInternals`. That's the single integration seam, and it's good. The event contract on top of it is inconsistent, and those inconsistencies are exactly what breaks Angular:

| Issue | Where | Why it matters |
|---|---|---|
| `nys-focus`/`nys-blur` dispatched with no `bubbles`/`composed` | `nys-checkbox` | Any ancestor or delegated listener misses them |
| No events at all | `nys-checkboxgroup` | A group-level CVA has nothing to subscribe to |
| No public `value` | `nys-checkboxgroup`, `nys-radiogroup` (`selectedValue` is private state) | `writeValue()` has to reach into children |
| `nys-input` only, no `nys-change` | `nys-datepicker` | A discrete selection reads as continuous input |
| `nys-input.detail.value` is filter text, not the value | `nys-combobox` | Binding to `nys-input` writes garbage into the form model |
| `nys-change` detail differs per component | `{id,value}` vs `{id,checked,name,value}` vs `{id,checked}` vs `{id,files,changedFiles}` | No single typed detail; wrappers need per-component types |
| `@fires` claims events never dispatched | `nys-radiobutton` (`nys-focus`, `nys-blur`, `nys-other-input`) | Manifest lists them with `type: undefined`; wrappers grow dead props |
| No `nys-focus` | `nys-datepicker`, `nys-fileinput` | Asymmetric touched handling |
| camelCase event name | `nys-fileRemove` | Breaks the `on<PascalCase>` mapping convention |
| Components overwrite `errorMessage` during validation; precedence differs (`textinput` vs the rest) | text-like inputs | Two-way binding fights the component |
| Internal members leak as public props | `_showOtherError`, `groupExist`, `_hasDescription`, `updateComplete` | Wrappers expose them |
| Event types in the manifest are bare `CustomEvent`/`Event` | all | Detail shapes exist only as prose |

No component re-dispatches native `input` or `change`, and every input except `nys-radiobutton` lives in shadow DOM. Angular's `DefaultValueAccessor` therefore sees nothing, which is the root of the "Angular forms don't work" reports. A CVA per form component is mandatory, and it must listen to `nys-*` events and write properties.

### 2.5 Docs site (`nysds-site`)

- Eleventy 3, Nunjucks. All 426 code examples across 72 pages funnel through one partial, `src/_includes/partials/code-preview.njk`, and nearly all use `{% set code = preview %}`: the displayed source is the preview HTML.
- The site doesn't read `custom-elements.json` today, but the file is in `node_modules/@nysds/components/` at build time. JSON5 data files are already wired.
- No tab switcher exists. `showSourceCode`/`copyCode` in `nysds-site.js` scope to `.code-preview-container`, so tabs can nest inside it.
- `get-started/developers.md` documents `@nysds/components/react` and an alpha Angular `CUSTOM_ELEMENTS_SCHEMA` snippet; `foundations/components.md` says wrappers are "planned but not yet available". These contradict each other.

### 2.6 Framework facts that shape the design

- Angular 20, 21, and 22 are the supported majors as of September 2026. Signal Forms shipped experimental in 21 and stable in 22; the `[formField]` directive interoperates with existing `ControlValueAccessor` implementations, so a CVA serves template-driven, Reactive, and Signal Forms today. A native `FormValueControl` adapter can come later as an enhancement, not a rewrite.
- Angular only needs `CUSTOM_ELEMENTS_SCHEMA` for elements it doesn't recognize. If the wrapper is an Angular `@Component` whose selector is the tag (a proxy component with `<ng-content>`), the schema requirement goes away and template type-checking covers every binding.
- React 19 sets properties on custom elements natively but still doesn't map custom events to props. `@lit/react` (Lit's official package) handles properties, typed custom events, refs, and works on React 18 and 19.

## 3. Decisions

### 3.1 Locked

| # | Decision | Choice |
|---|---|---|
| L1 | Package names and import paths | `@nysds/react`, `@nysds/angular`. `@nysds/components/react` becomes a deprecated re-export for one minor release, then is removed. `@nysds/components/angular` never ships. |
| L2 | Source of truth | `custom-elements.json`, enriched by JSDoc tags on the component classes. Generators contain zero hand-maintained per-component tables. If a generator needs a fact, that fact goes into JSDoc and flows through the manifest. |
| L3 | Component loading | Per-component packages. Every wrapper imports `@nysds/nys-<name>`. Framework packages declare each `@nysds/nys-*` package as a dependency, generated at build time. |
| L4 | Versioning | Lockstep with `@nysds/components`. `@nysds/react@1.21.0` pairs with `@nysds/components@1.21.0`. Peer ranges on `@nysds/nys-*` are generated. |
| L5 | Generated output is not committed | `packages/react/src/generated/`, `packages/angular/src/generated/`, and generated `package.json` dependency blocks are gitignored and rebuilt by `npm run build:all` and CI. Generators clear their output directory first. Hand-written files live outside `generated/`. |
| L6 | Shared codegen layer | One workspace package, `@nysds/codegen`, owns manifest readers, naming rules, form-control metadata, both framework CEM plugins, and the HTML → JSX / Angular snippet transformer. Nothing framework-specific lives in `src/scripts/`. |
| L7 | Angular wrapper shape | Generated proxy `@Component`s (selector is the tag, `template: '<ng-content></ng-content>'`, typed input setters that write properties, typed outputs re-emitted from DOM events). Consumers don't need `CUSTOM_ELEMENTS_SCHEMA`. Form components additionally provide `NG_VALUE_ACCESSOR` through a shared base class. |
| L8 | Angular forms bridge | `ControlValueAccessor` on every form component (covers `ngModel`, Reactive Forms, and Signal Forms through Angular's interop). A `FormValueControl` adapter is a later enhancement. |
| L9 | Event contract | Normalize before generating. See `01-component-event-contract.md`. Additive changes first; deprecations, not removals, in 1.x. |
| L10 | Docs snippets | Derived at site build time from the canonical HTML example through `@nysds/codegen`'s transformer. Hand-written per-framework overrides are the exception and are stored next to the example. |
| L11 | Scope | React and Angular only. Vue and Next.js-specific packages are out of scope, but the codegen layer leaves room for a third plugin. |
| L12 | Class-name normalization | Deferred (PRD D9). Ship on today's class names. |

### 3.2 Recommended (needs your sign-off before the dependent workstream starts)

**R1: React generator: switch to `@lit/react` `createComponent`, generated by our own CEM plugin.**
Blocks: WS3.
Today's `custom-element-react-wrappers` output is attribute-first, has broken type imports, needs a runtime patch, and is a single-maintainer package. `@lit/react` is property-first, derives prop types from the element class (`WebComponentProps<NysTextinput>`) so types never drift, types events with their detail (`EventName<NysInputEvent>`), forwards refs, and runs on React 18 and 19. The generated file per component is about 15 lines. The plugin that emits it mirrors the Angular plugin, which satisfies the consistency priority.
The fact that changes the answer: if you'd rather not take a runtime dependency on `@lit/react` (about 1 KB), keep the wc-toolkit generator and fix its four known defects instead. Same workstream, different template.

**R2: Angular support range: `>=20.0.0`, built with the Angular 20 toolchain, verified on 20, 21, and 22 in CI.**
Blocks: WS4, WS5.
Libraries compiled with ng-packagr for version N run on N and newer, not older. Building with 20 covers every supported major.
The fact that changes the answer: if any consuming agency is pinned to Angular 18 or 19, the minimum drops and the build toolchain drops with it. Nobody has surveyed this. WS0 includes the survey.

**R3: Close the `enhancement/react-angular-implementation` PR and salvage two commits.**
Blocks: WS0.
Cherry-pick the `modulePath` change and the `nys-option` guard into a small PR against `develop`. Everything else is superseded by this plan. Give the author the review as written feedback; the `technical-review-voice` skill can draft it.

**R4: Deprecate `@nysds/angular@1.18.2`, `1.18.2-alpha-1`, and `1.18.2-alpha-2` on npm now.**
Blocks: nothing, but the longer it's up the more confusing it is. Needs npm auth, so it's yours to run: `npm deprecate @nysds/angular@"<=1.18.2" "Unusable pre-release artifact. Use 1.21.0 or later."`

## 4. Architecture

```
packages/nys-*/src/*.ts            JSDoc: @fires, @formControl, @slot, exported detail types
        │
        ▼  npm run cem
custom-elements.json               single source of truth (root; copied to dist/)
        │
        ▼
packages/codegen  (@nysds/codegen)
  ├─ lib/manifest.ts               readers: components, form-control metadata, tag→package, naming
  ├─ lib/transform-html.ts         HTML example → JSX and → Angular template
  ├─ plugins/react.mjs             CEM plugin → packages/react/src/generated/*
  └─ plugins/angular.mjs           CEM plugin → packages/angular/src/generated/*
        │                                  │
        ▼                                  ▼
packages/react  (@nysds/react)      packages/angular  (@nysds/angular)
  src/generated/  (gitignored)        src/generated/  (gitignored)
  src/overrides/  (hand-written)      src/lib/forms/  (CVA base classes, hand-written)
  vite lib build → dist/              ng-packagr → dist/
        │                                  │
        ▼                                  ▼
examples/react-vite, examples/next-app   examples/angular-app (20/21/22 matrix)
        │
        ▼
nysds-site: code-preview.njk tabs (HTML | React | Angular), filters call @nysds/codegen transform
mcp-server: get_component returns per-framework snippets; framework guides regenerated
```

### 4.1 Naming rules (apply everywhere)

| Concept | Rule | Example |
|---|---|---|
| Tag → class | Manifest `declaration.name` | `nys-textinput` → `NysTextinput` |
| React component | Class name | `NysTextinput` |
| Angular component | Class name + `Component` | `NysTextinputComponent` |
| Angular module | `NysAngularModule` (aggregates all standalone components) | |
| Event → React prop | `on` + PascalCase of the full event name | `nys-change` → `onNysChange` |
| Event → Angular output | camelCase of the full event name | `nys-change` → `nysChange` |
| Attribute → prop | Manifest `fieldName` (camelCase property, never the attribute) | `show-error` → `showError` |
| Subpath imports | Tag minus `nys-` | `@nysds/react/textinput`, `@nysds/angular/textinput` |

Keep the `Nys` prefix on event props (`onNysChange`, not `onChange`). It avoids collisions with React's synthetic `onChange` and with `nys-button`'s own `onClick` property, and it makes the mapping mechanical in both directions.

### 4.2 Form-control metadata

A JSDoc tag on each form component declares how frameworks bind it:

```ts
/**
 * @formControl value nys-change nys-input
 */
export class NysTextinput extends NysFormControlElement { ... }
```

Grammar: `@formControl <kind> <changeEvent> [inputEvent]` where `kind` is `value`, `checked`, or `files`. `@nysds/codegen` parses it into `declaration.formControl = { kind, changeEvent, inputEvent }`. The Angular plugin picks the CVA base class by `kind`; the React plugin uses it to document controlled-component usage; the snippet transformer uses it to render `[(ngModel)]` and `value`/`onNysChange` examples. No generator has a per-component table.

### 4.3 Event detail types

Each component package exports its detail types and typed event aliases:

```ts
export interface NysTextinputInputDetail { id: string; value: string }
export type NysTextinputInputEvent = CustomEvent<NysTextinputInputDetail>;
```

`@fires nys-input {NysTextinputInputEvent}` in JSDoc puts the type name into the manifest. Both plugins import the alias from `@nysds/nys-textinput`, so a React consumer sees `onNysInput?: (e: NysTextinputInputEvent) => void` and an Angular consumer sees `nysInput: OutputEmitterRef<NysTextinputInputEvent>`.

## 5. Workstreams

| WS | Name | Depends on | Can run in parallel with | Brief |
|---|---|---|---|---|
| 0 | Hygiene and foundations | — | — | `00-hygiene-and-foundations.md` |
| 1 | Component event contract | 0 | 2 (scaffold) | `01-component-event-contract.md` |
| 2 | `@nysds/codegen` | 0; 1 for real fixtures | 1 | `02-codegen-package.md` |
| 3 | `@nysds/react` | 1, 2, R1 | 4 | `03-react-package.md` |
| 4 | `@nysds/angular` | 1, 2, R2 | 3 | `04-angular-package.md` |
| 5 | Example apps and CI | 3, 4 | 6, 7 | `05-example-apps-and-ci.md` |
| 6 | Docs site | 2 (transformer), 3, 4 for accuracy | 5, 7 | `06-docs-site.md` |
| 7 | MCP, Storybook, tooling | 2, 3, 4 | 5, 6 | `07-mcp-storybook-and-tooling.md` |
| 8 | Release and migration | all | — | `08-release-and-migration.md` |

### 5.1 Sequencing

```
Week 1   WS0 ──────────┐
                       ├─ WS1 (contract) ──┐
Week 1–2               └─ WS2 (codegen) ───┤
                                           ├─ WS3 (react)   ─┐
Week 2–3                                   └─ WS4 (angular) ─┤
                                                             ├─ WS5 (examples+CI)
Week 3–4                                                     ├─ WS6 (docs site)
                                                             └─ WS7 (mcp/storybook)
Week 4     alpha publish (--tag next) → agency pilot → WS8 (release)
```

Week numbers are for ordering, not commitments. WS1 is the long pole: it touches ten component packages and needs the user's test run per package.

### 5.2 Running this with subagents

- Give each agent exactly one brief and the `agent-brief-template.md` preamble.
- Each brief lists the files it owns. Two agents never own the same file. WS1 is split per component inside its brief so multiple agents can work it.
- Agents don't run the test suite (CLAUDE.md rule); they list the commands for the user to run and report which they couldn't verify.
- Agents commit to a branch per workstream (`feat/fw-<ws>-<slug>`) off `develop` and open a draft PR against `develop` with the brief's acceptance criteria as the PR checklist.
- No AI attribution in commits (global rule for NYS repos).

## 6. Acceptance criteria (whole effort)

**Automation**
- [ ] Adding a new `packages/nys-<name>` component and running `npm run build:all` produces its React and Angular wrappers, its snippet transforms, and its entries in both framework `package.json` files with no manual edit.
- [ ] Removing a component removes its wrappers on the next build. No orphans.
- [ ] Neither framework package contains a per-component lookup table.

**React DX**
- [ ] `import { NysTextinput } from "@nysds/react"` and `from "@nysds/react/textinput"` both work with full prop and event types.
- [ ] Controlled inputs round-trip (`value` + `onNysInput`), including re-setting the same value.
- [ ] React Hook Form `Controller` example works with `nys-textinput`, `nys-select`, `nys-checkbox`, `nys-radiogroup`, `nys-datepicker`, and `nys-fileinput`.
- [ ] Next.js App Router example builds and hydrates without warnings; wrappers carry `"use client"`.
- [ ] Works on React 18 and 19 (CI matrix).

**Angular DX**
- [ ] No `CUSTOM_ELEMENTS_SCHEMA` needed. `[label]="x"` on an unknown property is a template type error.
- [ ] `[(ngModel)]`, `formControlName`, and Signal Forms `[formField]` work on every form component, including `nys-checkboxgroup` and `nys-radiogroup` at group level.
- [ ] `FormControl({ disabled: true })` disables; `control.markAsTouched()` after `nys-blur`; `required` attribute participates in Angular validation.
- [ ] A documented, opt-in way to render Angular validation errors through the component's own `errorMessage`/`showError`.
- [ ] `NysAngularModule` works in an NgModule app. Standalone imports work per component.
- [ ] Works on Angular 20, 21, and 22 (CI matrix), zoneless and zone.js.

**Consistency**
- [ ] Same component and event naming rules in both packages (section 4.1).
- [ ] Same `package.json` shape: `exports` map with barrel plus subpaths, `sideEffects`, `peerDependencies`, generated `dependencies`.
- [ ] Same README structure: install, register styles, first component, forms, events, SSR, troubleshooting.

**Docs**
- [ ] Every component page's examples show HTML / React / Angular tabs, generated at build time.
- [ ] `/get-started/react/` and `/get-started/angular/` exist with install, setup, forms, events, SSR, and troubleshooting sections.
- [ ] `foundations/components.md` and `developers.md` no longer contradict each other.
- [ ] MCP `get_component` returns per-framework snippets; framework guides no longer say "untested".

**Release**
- [ ] `npm run release:dry-run` lists `@nysds/react` and `@nysds/angular` tarballs whose file lists contain only `dist/`, `README.md`, `package.json`, `LICENSE`.
- [ ] `@nysds/angular@<=1.18.2` deprecated on npm.
- [ ] `@nysds/components/react` prints a deprecation notice and re-exports `@nysds/react`.

## 7. Risks

| Risk | Mitigation |
|---|---|
| WS1 changes component behavior for existing HTML consumers | Additive only in 1.x: new events fire alongside old ones; deprecated events keep firing with a console warning in dev builds. Breaking removals wait for 2.0. |
| Angular minimum version excludes an agency | WS0 survey before WS4 starts. The toolchain choice is a one-line change if the answer is 19. |
| `@lit/react` and React 19 native custom-element support diverge | `@lit/react` is maintained by the Lit team and explicitly supports 19. Track upstream; the plugin template is the only thing that would change. |
| Signal Forms interop with CVA changes across Angular releases | CI matrix on 21 and 22 catches it; `FormValueControl` adapter is the fallback path. |
| Snippet transformer produces wrong code for edge cases (slots, nested components, script blocks) | Golden-file tests in `@nysds/codegen` over every example in the site; unknown constructs fall back to HTML with a visible "no React example" state rather than wrong code. |
| Docs site build now depends on `@nysds/codegen` | Published package, lockstep version, same install as `@nysds/components`. |
| Team bandwidth for eight workstreams | 0, 1, 2 first; 3 and 4 in parallel; 5, 6, 7 are mostly agent work with review. |

## 8. Out of scope

- `@nysds/vue`. The codegen layer makes it a third plugin later.
- Lit SSR / declarative shadow DOM. Client-side rendering only; documented for Next.js and Angular SSR.
- Component class-name normalization (PRD D9).
- Figma Code Connect for React/Angular.
- Rewriting the MCP server's framework guide format.

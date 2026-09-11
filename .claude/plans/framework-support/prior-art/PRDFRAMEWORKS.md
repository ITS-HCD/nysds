> **Provenance:** Copied unchanged from `PRDFRAMEWORKS.md` at the root of the
> `enhancement/react-angular-implementation` branch (tip `c95ee656`, 2026-09-01)
> by WS0 (`plans/framework-support/00-hygiene-and-foundations.md`, task 0.1).
> The framework-support plan in `plans/framework-support/README.md` keeps this
> PRD's decisions D1 (per-component wrapper imports), D2 (deprecated
> `@nysds/components/react` alias), D3 as revised by the plan (React 18 and 19
> through `@lit/react`, not 19-only), D7 (example apps in CI), and D9 (defer
> class-name normalization). It supersedes D5 and D8: both generators are now
> CEM plugins in `@nysds/codegen` (WS2), and the React plugin emits `@lit/react`
> `createComponent` wrappers (README recommendation R1) instead of extending
> `customElementReactWrapperPlugin`. The branch's `modulePath` idea — each
> wrapper imports its own `@nysds/nys-<name>` package instead of
> `../../dist/nysds.es.js` — is kept as a concept, but WS2 reimplements it from
> the manifest without the branch's hand-maintained `tagToPackageMap` table.

# PRD: NYSDS Framework Integrations (Revised)

**Packages:** `@nysds/react`, `@nysds/angular`, `@nysds/vue` + Next.js support
**Branch:** `feature/frameworks`
**Status:** Draft — Revision 2
**Last updated:** 2026-08-26
**Revision note:** This revision responds to two open questions raised on the original
draft: (1) whether replacing `customElementReactWrapperPlugin` with an in-house generator
is actually justified, and (2) whether component class-name normalization should block
the React/Angular implementation. Section 3 documents the wrapper investigation and
reverses the default decision. Section 13 moves class-name normalization to a
non-blocking follow-up phase. Everything else from the original draft is preserved except
where it depended on those two decisions.

---

## 0. What changed in this revision — read this first

| # | Original draft | This revision |
|---|---|---|
| 1 | Build an in-house `cem-react-plugin.mjs`, retire `customElementReactWrapperPlugin` | **Default: keep and reconfigure `customElementReactWrapperPlugin`.** A time-boxed spike (Phase 0.5) verifies this is sufficient; only the specific gaps the spike confirms get custom code. Full replacement is now the *fallback*, not the default. |
| 2 | P0-4 (class-name inconsistency) is a Phase 0 exit-criteria gate — blocks Phase 1 | **Moved to Phase 6, after React and Angular ship.** Normalization is real work with real breaking-change implications, but it does not need to precede the framework packages — see Section 13 for why and how. |

Everything else — goals, non-goals, D2–D7, Phases 2–5, CI/release policy — is unchanged
from the original draft unless a section below says otherwise.

---

## 1. Problem statement

NYSDS ships Lit web components that work in any framework, but the way we package them
defeats the point of ES modules and makes framework adoption harder than it should be:

1. **The "ES module" build is a monolith.** `@nysds/components` publishes a single
   `dist/nysds.es.js` (~500 KB) containing every component. The root `vite.config.js`
   default export overrides the shared `external` function so only `lit` is externalized —
   every `@nysds/nys-*` package gets inlined.
2. **The generated React wrappers point at that monolith — but this is a configuration
   choice, not a limitation of the generator.** `cem.config.mjs` sets
   `modulePath: () => "../../dist/nysds.es.js"` for `customElementReactWrapperPlugin`.
   That plugin's `modulePath` option is a function of `(className, tagName)` specifically
   designed to let each wrapper point at its own module — the monolith import is how *we*
   configured it, not something the plugin forces on us. (Full findings in Section 3.)
3. **There is no first-class Angular or Vue story.** Angular support exists only on the
   unmerged `feature/angular-support` branch. Vue support is implied by the generated JSX
   types but is unverified and undocumented.

Meanwhile, the granular building blocks already exist: every `@nysds/nys-*` component
package builds and publishes its own ES module with `lit` and cross-component imports
correctly externalized, and every component guards registration with
`if (!customElements.get(tag))`.

## 2. Goals

- `import { NysButton } from "@nysds/react"` works out of the box in a React 19 app and
  bundles **only** the button's dependency chain (button → icon → lit), verified by an
  automated bundle-content check.
- `@nysds/angular` wraps every component in a standalone Angular component so consumers
  never set `CUSTOM_ELEMENTS_SCHEMA`, with all properties/attributes/events surfaced as
  typed `@Input()`s/`@Output()`s and `ControlValueAccessor` on form components.
- `@nysds/vue` ships generated Vue 3 wrapper components with typed props/emits and
  `v-model` support on form components.
- Next.js (App Router) support is verified and documented using the `@nysds/react`
  wrappers as client components.
- Every framework has a minimal sample app in an `examples/` workspace, built and
  smoke-tested in CI.
- **Everything generated, nothing hand-maintained.** All wrapper code, types, barrels, and
  wrapper-package dependency lists are generated during `npm run cem`. Adding a new Lit
  component requires zero manual work in any framework package.

### Non-goals (this effort)

- **React 18 support.** Deferred (Phase 5). `@nysds/react` targets React ≥ 19 only.
- **Declarative Shadow DOM / `@lit-labs/ssr` server rendering.** Next.js support is
  client-components-only.
- **Restructuring the `@nysds/components` monolith build.** Stays as-is for CDN and
  existing consumers.
- Svelte, Solid, or other frameworks.
- **Component class-name normalization as part of this effort's critical path** — see
  Section 13.

## 3. Investigation: is an in-house React wrapper generator actually necessary?

This section answers the questions raised on the draft directly, using
`customElementReactWrapperPlugin`'s actual documented configuration and the specific
complaints logged against the current output.

### 3.1 What the plugin actually supports

`custom-element-react-wrappers` (imported in `cem.config.mjs` as
`customElementReactWrapperPlugin`) accepts, among others:

| Option | What it does |
|---|---|
| `modulePath(className, tagName) => string` | Per-component control of the import path each wrapper points at. Can return a plain string, a per-tag path, or delegate to arbitrary lookup logic. |
| `attributeMapping` | Renames attributes that collide with React/JS reserved words. |
| `globalProps` / `globalEvents` | Adds shared props/events to every wrapper without per-component config. |
| `reactProps` | Opts individual wrappers into the full standard HTML prop/event surface. |
| `scopedTags` | Generates a `ScopeProvider` for prefix/suffix tag scoping (multi-version-on-page safety). |
| `ssrSafe` | Formats wrappers to run safely under SSR (Next.js/Remix) by deferring registration/execution to the client. |
| `exclude`, `defaultExport`, `descriptionSrc`, `hideSlotDocs` / `hideEventDocs` / etc. | Output shaping and docs. |
| Event handling | Event names are auto-converted to `on*` camelCase handlers "with no manual event mapping" per the plugin's own description — this is a built-in, not something we'd be adding. |

Two things in `cem.config.mjs` are directly relevant and worth flagging on their own:

- `modulePath: () => "../../dist/nysds.es.js"` — **this is the actual cause of P0-1.**
  The plugin was configured to always resolve to the monolith. Nothing here indicates the
  plugin *requires* that; the option exists specifically to avoid it.
- `// ssrSafe: true, // Commented out but kept here in case we run into any issues with SSR`
  — SSR support was already anticipated and is one config flag away, sitting unused. This
  is directly relevant to Phase 4 (Next.js) and worth revisiting before writing any custom
  `"use client"` banner logic.

### 3.2 Re-examining the original justifications for a custom generator

| Original justification | Investigation finding |
|---|---|
| "One `NysButton` import drags in everything" (P0-1) | **Config bug, not a generator limitation.** A `modulePath` function that maps each component to `@nysds/nys-<name>` (the same shape as the plugin's own documented example, `` (className, tagName) => `../dist/${tagName}/${className}.js` ``) is very plausibly sufficient. This needs to be tried before it's used to justify a rewrite. |
| "No `forwardRef`, no property-syncing layer — React 19 handles this natively" | **Needs verification, not assumed.** The plugin's own docs show ref access via a typed `<Component>Element` pattern, which doesn't obviously require legacy `forwardRef`-based syncing — but we don't yet know what the generated runtime does internally on the installed version. This is a concrete, checkable question, not a reason on its own to replace the generator. |
| "`events.js` runtime — the one thing React 19 still doesn't do" | **Likely already covered.** Automatic event-name-to-`on*`-prop mapping is a headline, built-in feature of the plugin, not a gap. |
| "`patch-react-utils.js` papers over a stale-closure/duplicate-listener bug" | **This is the one substantiated, concrete limitation found.** It's a real bug in generated runtime behavior. It does *not* by itself justify replacing the whole generator — first check whether it's fixed in a newer release of the package (repo appears to be pinned to an older version), and whether it's a small, contained fix vs. something structural. |
| "Boolean-attribute vs. property semantics handled ad-hoc" (P0-6) | **Plausible genuine gap.** Nothing in the documented config indicates the plugin derives DOM-property-vs-attribute handling from CEM metadata the way the draft's shared decision table would. This may need a small supplemental transform, not a full generator. |
| "`\"use client\"` baked in" | **Not a generator-replacement issue.** `ssrSafe` may cover the functional need; even if it doesn't, injecting a one-line banner into generated files is a small post-processing script, not a reason to own the whole wrapper generator. |

### 3.3 Recommendation

**Do not commit to an in-house generator by default.** The single biggest complaint in
the original PRD (P0-1, "the headline bug") appears to be a configuration mistake in our
own `cem.config.mjs`, not a limitation of `custom-element-react-wrappers`. Replacing an
actively maintained, purpose-built generator to fix a one-line config value would trade a
small, well-scoped fix for a new piece of infrastructure we'd own indefinitely
(generator code, its own bugs, its own React-version follow-ups).

Instead: **Phase 0.5** (new, Section 7) is a short, time-boxed spike that actually tries
reconfiguring the plugin against the real component set and checks each row in the table
above. Only items the spike confirms as genuine, unfixable gaps get custom code — and even
then, prefer a small supplemental layer (a post-generation script, a thin wrapper around
the plugin's output) over a full replacement generator. A full in-house replacement is
back on the table only if the spike finds the gaps are structural (e.g., the
stale-closure bug is unfixed, unfixable via config, and blocks correct behavior; or the
plugin cannot produce per-component modules at all in practice).

**Honest tradeoff to record either way:** `custom-element-react-wrappers` is a small
package (single-digit-hundreds weekly downloads at last check) maintained by one person.
That's a real bus-factor risk to weigh against the cost of owning a generator ourselves —
it doesn't change the recommendation above, but it's a legitimate reason the spike should
also produce a short note on maintenance risk either way, so the tradeoff is made with
eyes open rather than by default.

---

## 4. Decisions

| # | Decision | Status | Choice |
|---|----------|--------|--------|
| D1 | How wrappers load component code | **Locked** | Per-component packages. Wrapper files import `@nysds/nys-<name>` directly; `@nysds/react` declares the `@nysds/nys-*` packages as dependencies. No changes to the core build. |
| D2 | Fate of `@nysds/components/react` | Locked | Deprecated alias for one release cycle, re-exporting `@nysds/react`. |
| D3 | React version support | Locked | React 19+ only; React 18 is a separate side project (Phase 5). |
| D4 | Next.js SSR scope | Locked | Client components only. No `@lit-labs/ssr`. Whether this is delivered via `ssrSafe` or a small custom banner is decided in Phase 0.5/Phase 4, not here. |
| D5 | Angular generator | Locked | Regenerate from scratch as a CEM plugin (no comparable existing tool to reuse — see Section 9). `feature/angular-support` is behavioral reference only. |
| D6 | Vue deliverable | Locked | Full `@nysds/vue` wrapper package (not types-only). |
| D7 | Sample apps | Locked | `examples/` npm workspace, wired into CI, build + Playwright smoke test per app. |
| D8 | **React wrapper generator source** *(new)* | **Pending Phase 0.5 spike** | **Default:** reconfigure and extend `customElementReactWrapperPlugin`. **Fallback (only if spike finds structural gaps):** in-house generator, scoped to only the confirmed gaps. |
| D9 | **Class-name normalization timing** *(new)* | Locked | Follow-up phase (Phase 6), after React and Angular ship. Not a Phase 0 gate. See Section 13. |

---

## 5. Architecture overview

```
custom-elements.json  (npm run cem — single source of truth)
        │
        ├─► customElementReactWrapperPlugin (reconfigured modulePath)
        │     + small supplemental scripts only for spike-confirmed gaps  ─► packages/react/    (@nysds/react)
        ├─► cem-angular-plugin.mjs (new, in-house — no reusable existing tool) ─► packages/angular/  (@nysds/angular, built by ng-packagr)
        ├─► cem-vue-plugin.mjs (new, in-house)  ─► packages/vue/      (@nysds/vue)
        └─► (existing) vscode, jsx, examples plugins

packages/nys-button/dist/nys-button.js   ◄─ imported by all three wrapper layers
        └─ imports @nysds/nys-icon (externalized) └─ imports lit (peer)

examples/
  react-app/     Vite + React 19 + TS
  angular-app/   Angular 20 standalone app
  vue-app/       Vite + Vue 3 + TS (SFC and TSX usage)
  nextjs-app/    Next.js App Router + React 19
```

If Phase 0.5 concludes a replacement generator is genuinely required, the React branch of
this diagram reverts to the original draft's `cem-react-plugin.mjs` — the rest is
unaffected.

**Why this tree-shakes when the monolith didn't:** each wrapper package sets
`"sideEffects": false` in its own `package.json`, so bundlers prune unimported wrapper
modules from the barrel. The wrapper module that *is* used keeps its
`import "@nysds/nys-button"`, and that package's own `"sideEffects": true` preserves the
`customElements.define` call. Registration guards make double definition harmless.

**Version lockstep:** wrapper packages depend on `@nysds/nys-*` with caret ranges pinned
to the repo version. A generation-time step writes these dependency lists from the CEM +
root `package.json` version.

---

## 6. Phase 0 — Build-output audit & prerequisites

| ID | Issue | Impact on frameworks | Fix |
|----|-------|----------------------|-----|
| P0-1 | Generated React wrappers import `../../dist/nysds.es.js` because `modulePath` is hardcoded to it; root package is `"sideEffects": true`. | One import = whole library, untree-shakeable. | **Reconfigure `modulePath` to map each component to `@nysds/nys-<name>`, verified in Phase 0.5.** Only fall back to a new generator if this doesn't resolve it. |
| P0-2 | **Stale artifacts in root `dist/`**: per-component files at v1.19.2, published via `"files": ["dist/"]`, despite `build:all` calling `clean:dist`. | Deep-importers get a stale duplicate; confuses bundle analysis. | Find out why they survived `clean:dist`; add `audit:dist` assertion that every file in `dist/` was produced by the current build. |
| P0-3 | `react-utils.js` is patched post-generation (`patch-react-utils.js`) for a stale-closure/duplicate-listener bug in the generator's runtime. | We're maintaining a fork-by-patch of a third-party runtime. | **Check whether this is fixed in a newer `custom-element-react-wrappers` release before deciding anything else** (Phase 0.5). If fixed: upgrade, drop the patch. If not: keep the minimal patch (much smaller than replacing the generator) and consider upstreaming a fix. |
| P0-4 | Component **class names are inconsistent** in source (`NysAccordionItem` vs `NysIconlistitem`, `NysCheckboxgroup` vs `NysVerticalnavGroup`, `NysBacktotop`, etc.). | Becomes permanent public API in three frameworks once released. | **Moved off Phase 0's exit criteria — see Phase 6.** Not a blocker for Phase 1/2. |
| P0-5 | **Event metadata quality in the CEM varies**; typed `@Output()`s/`emits` will expose it. | Wrong/`any`-typed event payloads in all three frameworks. | Add a CEM lint step that fails `npm run cem` if a declared event lacks a `type`. Fix offending JSDoc in component sources. |
| P0-6 | Wrapper prop → attribute handling in current output is ad-hoc. | Boolean-attribute vs. property semantics must be identical across frameworks. | Check in Phase 0.5 whether `customElementReactWrapperPlugin`'s attribute handling is sufficient as-is, or needs a small CEM-metadata-driven supplement shared with the Angular/Vue generators. |
| P0-7 | Styles are compiled/inlined into component JS; global CSS lives in `@nysds/styles`. | Consumers who install only the wrapper package get unstyled components. | Wrapper READMEs and every sample app import `@nysds/styles/dist/nysds.min.css` explicitly; docs call it a hard requirement. |
| P0-8 | Build output is minified; public API survives via CEM, not dist. | The CEM is the only trustworthy API source for generators. | Convention, enforced by review: generators consume `custom-elements.json` only. |
| P0-9 | Mixing the monolith and per-component packages double-loads component code. | Bloat + configuration confusion. | Documented as unsupported; deprecated-alias release notes tell React consumers to drop direct `@nysds/components` imports when migrating. |

**Exit criteria:** `audit:dist` passes with no stale files; CEM event-lint passes;
Phase 0.5 spike complete with D8 resolved.

---

## 7. Phase 0.5 — React wrapper decision spike *(new)*

A short, time-boxed investigation before Phase 1 implementation begins in earnest, to
resolve D8 with evidence instead of assumption.

**Tasks:**

1. Reconfigure `modulePath` in `cem.config.mjs` to resolve each component to its
   `@nysds/nys-<name>` package instead of the monolith; regenerate and confirm a
   `NysButton`-only bundle no longer pulls in unrelated components.
2. Check the current installed version of `custom-element-react-wrappers` against the
   latest release notes/issues for the stale-closure/duplicate-listener bug behind
   `patch-react-utils.js`. Determine: fixed upstream / fixable via config / genuinely
   requires the patch to continue.
3. Inspect what the plugin's generated `ref` handling actually does at runtime on our
   version, and confirm whether it's redundant or necessary under React 19.
4. Try `ssrSafe: true` (already present, commented out, in `cem.config.mjs`) against a
   minimal Next.js smoke test; determine whether it satisfies D4's client-component
   requirement or whether a small supplemental `"use client"` banner script is still
   needed alongside it.
5. Confirm whether attribute-vs-property handling (P0-6) needs supplemental logic beyond
   what the plugin provides out of the box.
6. Write up findings against the table in Section 3.2 and formally resolve D8: extend the
   existing plugin (default), or build a scoped in-house generator limited to the
   confirmed gaps only, or (only if findings are structural) the full replacement from the
   original draft.

**Exit criteria:** D8 resolved and documented with evidence; Phase 1 generator section
below updated to match before implementation starts.

---

## 8. Phase 1 — `@nysds/react`

### Package

- `packages/react/` becomes a real workspace package: `@nysds/react`, with its own
  generated `package.json` (`"sideEffects": false`, exports map,
  `peerDependencies: { react: ">=19", react-dom: ">=19" }`, dependencies on the exact set
  of `@nysds/nys-*` packages the CEM says exist).
- Exports: barrel (`.`) plus per-component subpaths for consumers who want explicit
  file-level imports.
- Every generated file's client-only requirement is satisfied per Phase 0.5's finding on
  `ssrSafe` vs. a supplemental banner (D4).

### Generator (pending Phase 0.5, D8)

**Default path:** `customElementReactWrapperPlugin`, reconfigured:

- `modulePath: (className, tagName) => ...` mapped to the corresponding
  `@nysds/nys-<name>` package entry point (resolves P0-1).
- `globalEvents` / `attributeMapping` / `reactProps` tuned to our component set.
- `ssrSafe: true` enabled if Phase 0.5 confirms it covers D4; otherwise a small
  post-generation script adds the `"use client"` banner.
- Any spike-confirmed gap (attribute/property handling, the stale-closure bug if still
  unfixed) addressed with the smallest possible supplemental layer — a thin
  post-processing step, not a parallel generator.
- `patch-react-utils.js` retained only if Phase 0.5 confirms the bug is still present and
  unfixable via config/upgrade; otherwise retired.

**Fallback path (only if Phase 0.5 finds structural gaps):** the original draft's
in-house `src/scripts/cem-react-plugin.mjs`, scoped down to cover only the confirmed
gaps rather than reimplementing everything the existing plugin already does well
(module resolution, event mapping, prop typing, docs).

### Deprecated alias (D2)

`@nysds/components` keeps `"./react"` in its exports, pointing at a tiny generated shim
folder that re-exports `@nysds/react`. README + release notes mark it deprecated with a
removal version.

### Sample app: `examples/react-app`

Vite + React 19 + TypeScript, consuming `@nysds/react` through the workspace. Pages
exercise: a form (textinput, select, checkbox group, radio group, datepicker → submit
handler), events, slots/children, a modal, and `ref` access to an element method.

### Verification (automated, in CI)

1. Example app builds; Playwright smoke test asserts components render and an event
   round-trips.
2. **Tree-shaking budget test:** a minimal entry importing only `NysButton` is built; a
   script asserts the output contains `nys-button`/`nys-icon` registrations, does **not**
   contain marker strings from unrelated components, and is under a size budget
   (~40 KB min, pre-gzip).
3. Generator snapshot tests (fixture CEM → expected wrapper source) run in the normal
   test suite — regardless of which generator path D8 resolves to.

**Exit criteria:** all three checks green in CI; `npm run build:all` produces the package
with zero manual steps; lint passes on generated output.

---

## 9. Phase 2 — `@nysds/angular`

No existing generator was found to reuse here — unlike React, there's no equivalent
`customElementReactWrapperPlugin` in play, so D5 (regenerate from scratch as a CEM
plugin) stands as originally scoped. `feature/angular-support` and the published
`1.18.2-alpha-2` remain behavioral reference only.

### Package

- `packages/angular/` workspace package `@nysds/angular`, built with ng-packagr
  (FESM2022 + types). Peer deps: `@angular/core|common|forms >= 20`, plus generated
  `@nysds/nys-*` dependencies (per D1 — not the monolith).

### Generator: `packages/angular/scripts/cem-angular-plugin.mjs`

Emits one standalone component per element:

- `selector` matching the custom element tag, `template: "<ng-content></ng-content>"` —
  `CUSTOM_ELEMENTS_SCHEMA` never required.
- Every CEM property → typed `@Input()`; every CEM event → typed `@Output()`
  `EventEmitter<CustomEvent<Detail>>`.
- `ControlValueAccessor` on form components, driven by a small per-component config map
  (value prop + change event + disabled prop).
- Barrel `public-api.ts`, `NYS_COMPONENTS` array, optional `NysAngularModule`.

### Sample app: `examples/angular-app`

Standalone-bootstrap Angular 20 app: template-driven form, reactive form, modal
open/close, event handling. Built + Playwright smoke test in CI.

**Exit criteria:** example app compiles with strict template checking on and no
`CUSTOM_ELEMENTS_SCHEMA`; `ngModel` and Reactive Forms round-trip values on all CVA
components; generator snapshots green.

---

## 10. Phase 3 — `@nysds/vue`

### Verification first

`packages/react/nysds-jsx.d.ts` covers Vue JSX/TSX but nothing for SFC templates
(needs a `GlobalComponents` augmentation for Volar). Verify and document this boundary
as the first task of this phase.

### Package & generator

`packages/vue/` workspace package `@nysds/vue`; `src/scripts/cem-vue-plugin.mjs` emits
per-component `defineComponent` render-function wrappers (no SFC compile step):

- `props`/`emits` from CEM metadata (shared boolean/number handling table).
- `v-model` on form components, sharing the same value-map the Angular CVA generator
  uses.
- Default + named slots; `GlobalComponents` augmentation `.d.ts`.

### Sample app: `examples/vue-app`

Vite + Vue 3 + TS: SFC templates with `v-model`, plus one TSX view. Built + Playwright
smoke test.

**Exit criteria:** `v-model` round-trips on all form components; `vue-tsc` passes;
generator snapshots green.

---

## 11. Phase 4 — Next.js

No new package: proves and documents `@nysds/react` inside Next.js App Router.

- `examples/nextjs-app`: Next 15+/React 19 App Router app. NYSDS usage lives in client
  components.
- Whether "client-only" is achieved via `ssrSafe: true` (already present, unused, in
  `cem.config.mjs`) or a supplemental `"use client"` banner is settled by Phase 0.5, not
  re-litigated here.
- Verify and document: ESM resolution under Next's bundler, hydration warnings (none
  expected), FOUC mitigation (`:not(:defined)` visibility rule).

**Exit criteria:** production `next build` clean; smoke test green; docs page describing
the supported pattern and non-support of RSC/SSR rendering of the components themselves.

---

## 12. Phase 5 (deferred side project) — React 18 fallback

Out of scope for the main effort (D3). When picked up: a `@nysds/react/v18` subpath (or
`@nysds/react-legacy` package) adding whatever property-syncing layer React 18 needs that
React 19 doesn't. Nothing in Phases 1–4 depends on or blocks on this.

---

## 13. Phase 6 (follow-up, non-blocking) — Component class-name normalization

P0-4 is real: `NysAccordionItem` / `NysDropdownMenuItem` / `NysFileItem` vs.
`NysIconlistitem` / `NysProcesslistitem`; `NysCheckboxgroup` vs. `NysVerticalnavGroup`;
`NysBacktotop` are inconsistent, and framework packages make these names public API in
three ecosystems at once. That's exactly why it deserves a dedicated pass rather than a
same-PR fix rushed to unblock Phase 1 — but it is **not** a prerequisite for React or
Angular shipping.

**Sequencing:**

1. Ship `@nysds/react` and `@nysds/angular` first, on today's class names.
2. Review all existing component class names for consistency.
3. Define a naming convention (e.g. `NysIconlistitem` → `NysIconListItem`,
   `NysProcesslistitem` → `NysProcessListItem`, `NysCheckboxgroup` → `NysCheckboxGroup`,
   `NysBacktotop` → `NysBackToTop`).
4. Normalize inconsistent class names in a dedicated PR, separate from framework work.
5. Account for breaking changes for anyone importing component classes directly (source
   package exports) — a deprecated-alias/re-export period, mirroring the pattern already
   used for D2, is the likely shape; confirm during the PR.
6. Regenerate all three framework packages so wrapper names follow the normalized
   classes going forward, with a documented migration note (old wrapper name →
   new wrapper name) in each framework package's release notes.

**Why this ordering is safe:** the framework generators derive names from the CEM at
build time — normalizing source names later and re-running `npm run cem` regenerates
correctly-named wrappers without hand edits, the same way any other component rename
would propagate. The cost of doing this after Phase 1/2 instead of before is one
additional breaking release per framework package down the line, versus delaying the
entire framework effort now on a naming-convention decision that doesn't need to be made
under that time pressure.

---

## 14. Sample apps & CI

- New root workspace entry: `examples/*`, `"private": true`, never published, consuming
  sibling packages through the workspace.
- New workflow `test-frameworks.yaml`: `npm run build:all`, then per example app: build,
  start, Playwright smoke spec, plus the Phase 1 tree-shaking budget test. Runs on PRs to
  `develop`/`main`, path-filtered to `packages/**`, `examples/**`, `src/**`.
- Turbo: example apps get `build` tasks with `dependsOn: ["^build"]`.

## 15. Release & registry policy

- **Default: no registry involvement.** Workspace linking covers development, CI, and
  sample apps end-to-end. `npm pack` + install-from-tarball approximates packed-output
  validation without publishing.
- **If a step genuinely requires a published version**, the work pauses and Eric runs the
  build and alpha release (`--tag next`), as with the Angular alpha. Expected to be
  rare-to-never.
- Wrapper packages version in lockstep with the monorepo and ride the existing `release`
  script; `examples/*` excluded via `private: true`.

## 16. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Phase 0.5 spike finds the existing React plugin insufficient after all, costing time before Phase 1 can start | Time-box the spike explicitly; its exit criteria are a documented decision, not a perfect solution — a "needs a scoped generator for X" outcome is a valid, useful result. |
| `custom-element-react-wrappers` is a small, single-maintainer package | Named explicitly as a tradeoff in Section 3.3, not hidden; if Phase 0.5 turns up an unresponsive upstream on the stale-closure bug, that's itself grounds to revisit D8 toward the in-house fallback. |
| Generated wrapper APIs freeze in inconsistent names (P0-4) before the Phase 6 normalization lands | Documented as a known, deliberate follow-up (Section 13), with a specific migration mechanism (deprecated re-exports) rather than left implicit. |
| CEM metadata gaps produce wrong types in three frameworks at once | CEM lint gate (P0-5) + generator snapshot tests; fixes land in component JSDoc, never in generators. |
| Version skew between wrapper deps and component packages | Dependency lists generated from the root version at `cem` time; lockstep publish. |
| Monolith + granular double-loading in consumer apps | Registration guards make it safe; docs mark it unsupported; deprecation notes steer consumers off the monolith. |
| ng-packagr / Vue build steps drift from the repo's Vite-only pipeline | Each lives inside its package's own `build` script under Turbo. |
| Playwright example tests flake CI | Smoke tests kept minimal; reuse the repo's pinned Playwright version. |

## 17. Success metrics

- Importing a single component from `@nysds/react` yields a bundle ≤ ~10% of the monolith
  path (enforced by the CI budget test) — regardless of which generator path D8 resolves
  to.
- Zero manual edits required in any framework package when a new component is scaffolded
  via `npm run gen` and picked up by `npm run cem`.
- All four example apps build and pass smoke tests in CI on every PR.
- `@nysds/components/react` consumers migrate with a one-line import change.
- Phase 6 lands with a documented, versioned migration path and no silent breaking
  changes to wrapper import names.

## 18. Phase sequencing

```
Phase 0    Build audit & prerequisites                (gates everything except P0-4)
Phase 0.5  React wrapper decision spike (D8)           (gates Phase 1's generator choice)
Phase 1    @nysds/react + examples/react-app           (establishes generator/verification patterns)
Phase 2    @nysds/angular + examples/angular-app
Phase 3    @nysds/vue + examples/vue-app
Phase 4    Next.js verification + examples/nextjs-app  (depends only on Phase 1)
Phase 5    React 18 fallback                           (deferred side project)
Phase 6    Component class-name normalization           (follow-up, after Phase 1 & 2 ship)
```

Phase 4 can run in parallel with Phases 2–3 once Phase 1 lands. Phase 6 is intentionally
sequenced last and does not block release of any earlier phase.
# PRD: SSR & Bundler Safety for `nys-icon` and NYSDS Components

**Issue:** [ITS-HCD/nysds#1677](https://github.com/ITS-HCD/nysds/issues/1677)
**Related:** [#1613](https://github.com/ITS-HCD/nysds/issues/1613), [#1618](https://github.com/ITS-HCD/nysds/issues/1618), [#872](https://github.com/ITS-HCD/nysds/issues/872)
**Status:** Phase 1 implemented (2026-07-02); Phases 2–4 pending
**Owner:** NYSDS Core Team

---

## 1. Problem Statement

Since v1.19.0, importing `@nysds/components` executes browser-only code at
module-evaluation time inside `nys-icon`'s icon-library registry
(`packages/nys-icon/src/icon-library-registry.ts`). This produces two
symptoms with one root cause:

**A. SSR crash (universal to server rendering).** Any server/Node import of
the bundle throws before a single component renders:

```
$ node --input-type=module -e "await import('@nysds/components')"
ReferenceError: window is not defined
```

Next.js 15 `next build` fails at "Collecting page data" with the same error.
This affects every SSR/SSG framework: Next.js, Remix, Astro SSR, Angular
Universal, Nuxt, etc. Client-only SPAs (plain Vite, CRA) are unaffected
because the module only executes in the browser.

**B. Webpack compile error (older Next.js).** The
`new URL("./icons/", import.meta.url)` pattern is statically analyzed by some
Webpack configs, which try to resolve `./icons/` as a build-time asset:

```
Module not found: Can't resolve './icons/'
```

**Root cause (single):** eager, unguarded, browser-only side effects at module
scope:

| Location | Offense |
|---|---|
| `icon-library-registry.ts:37-45` | `window.__nysIconRegistry` / `window.__nysIconWatchers` read/written at module top level with no guard |
| `icon-library-registry.ts:101-107` | `resolveDefaultIconBaseUrl()` called eagerly at import |
| `icon-library-registry.ts:93-94` | `import.meta.url` + `new URL("./icons/", …)` — statically rewritable by bundlers |
| `icon-library-registry.ts:96` | `document.baseURI` fallback outside the `typeof document` guard |

The documented runtime workaround (copy `dist/icons`, re-register the
`"default"` library) cannot help: the module throws at import, before any
user code runs.

## 2. Goals

1. `import "@nysds/components"` is **side-effect-safe in Node** — no
   `window`, `document`, or eagerly-evaluated `import.meta.url` access at
   module-evaluation time.
2. Standard NYSDS icons render **zero-config** in vanilla JS, Vite, Webpack,
   and Next.js — no per-app asset copying or resolver re-registration.
3. Every NYSDS component guards browser-global access so components survive
   server-side construction and rendering.
4. Regressions are caught automatically by an SSR test gate in CI.

## 3. Non-Goals

- Full declarative-shadow-DOM server rendering via `@lit-labs/ssr` (i.e.
  server-generated component markup). Phases 1–4 make importing and
  constructing components safe on the server; actual server-side *rendering*
  support is future work.
- Changing the public `registerIconLibrary()` / `unregisterIconLibrary()` API
  surface (Phase 3 extends it backwards-compatibly).

## 4. Guard Convention (applies to all phases)

- **Inside Lit components:** `import { isServer } from "lit"` and
  early-return (`if (isServer) return;`) in lifecycle methods that touch
  browser globals. Verified: the repo's installed `lit@3.3.x` exports
  `isServer`.
- **In plain (non-Lit) modules:** `typeof window !== "undefined"` /
  `typeof document !== "undefined"` guards — the pattern already used in
  `nys-backtotop` and at `icon-library-registry.ts:80`.
- **Class fields must never initialize from browser globals.** Class-field
  initializers run in the constructor, which executes during server
  rendering. Declare the field (`private _mq?: MediaQueryList`) and assign it
  in a guarded `connectedCallback()`.
- **Module scope must never touch browser globals**, guarded or not, except
  a cheap guarded capture where synchronous timing is required (see Phase 1,
  Step 2).

---

## 5. Phase 1 — Minimal SSR Fix: Make the Icon Registry Import-Safe

**Outcome:** importing `@nysds/components` (and standalone `@nysds/nys-icon`)
no longer throws in Node. Fixes symptom A. Smallest possible change; browser
behavior is unchanged.

**File:** `packages/nys-icon/src/icon-library-registry.ts`

### Steps

1. **Move singleton storage from `window` to `globalThis`.**
   Replace `window.__nysIconRegistry` / `window.__nysIconWatchers`
   (lines 37–45) with `globalThis` equivalents. `globalThis` exists in Node
   and every browser, so no guard is needed, and the original rationale —
   surviving module duplication by bundlers (see file header, lines 9–11) —
   is preserved. Update the `declare global` block accordingly.

2. **Defer default-library registration to first use.**
   Delete the eager `resolveDefaultIconBaseUrl()` call at import (lines
   101–107). Instead:
   - At module scope, keep only a cheap, guarded capture of
     `document.currentScript?.src` into a variable. This is the one signal
     that is *only* valid during synchronous module init (see comment at
     lines 55–57), so it must stay eager — but it must be wrapped in
     `typeof document !== "undefined"`.
   - Move the rest of the resolution chain (script-tag scan,
     `import.meta.url`, `document.baseURI`) into a lazy path that runs the
     first time `getIconLibrary("default")` is called — which only happens
     from a component rendering in a browser.

3. **Guard the `document.baseURI` fallback.**
   Line 96 sits outside the `typeof document` guard at line 80. Move it
   inside the guard (or add its own), returning a safe no-op value when
   `document` is absent.

### Testing gate (Phase 1)

| Check | Command / Method | Pass criteria |
|---|---|---|
| SSR smoke test | `npm run build && npm run test:ssr` | Passes (fails today — this is the red/green gate) |
| Exact issue repro | `node --input-type=module -e "await import('./dist/nysds.es.js')"` | No `ReferenceError` |
| Unit tests | New cases in `src/nys-icon.test.ts`: default library registers lazily on first `getIconLibrary("default")`; `registerIconLibrary()` / `unregisterIconLibrary()` / watcher redraw still work | Green |
| Full suite | `npm run test` (run by maintainer) | No regressions |
| Visual | Storybook (`npm run storybook`) — icon stories render | Icons visible |
| Framework repro | `create-next-app` + `import "@nysds/components"` in `_app.tsx` + `next build` (Next 15, pages router) | Build succeeds |

---

## 6. Phase 2 — Bundler-Safe Asset Resolution

**Outcome:** older Next.js/Webpack configs no longer fail with
`Can't resolve './icons/'`. Fixes symptom B.

**File:** `packages/nys-icon/src/icon-library-registry.ts`

### Steps

1. **Confirm no top-level `new URL(...)` executes.** This mostly falls out of
   Phase 1's laziness; verify the module body contains zero URL construction.

2. **Break the statically-analyzable pattern in the lazy path.**
   Webpack rewrites the exact shape `new URL(<string literal>,
   import.meta.url)`. In the lazy resolver:
   - Read `import.meta.url` through an intermediate variable (already done at
     line 93 — keep it).
   - Build the `"./icons/"` path from a non-literal (e.g. a `const` assembled
     at runtime) so neither argument is a literal in the `new URL()` call.
   - Add a code comment stating this exists to defeat bundler static
     analysis, so a future refactor doesn't "simplify" it back.

3. **Verify shipped output.** After `npm run build`, grep `dist/nysds.es.js`
   (and the standalone `packages/nys-icon/dist/` bundles) for
   `new URL("./icons/"` — zero matches allowed.

### Testing gate (Phase 2)

| Check | Command / Method | Pass criteria |
|---|---|---|
| SSR smoke test | `npm run test:ssr` | Still green |
| Dist audit | `grep 'new URL("./icons/' dist/nysds.es.js` | No matches |
| Webpack fixture | Minimal Webpack 5 production build importing the package | Compiles |
| Next.js fixture | Pages-router app (issue's older-Next variant), `next build` | Compiles, no `Can't resolve './icons/'` |
| Vanilla check | Serve `dist/` with a `<script>` tag, render `<nys-icon>` | Icons load from `dist/icons/` |

---

## 7. Phase 3 — Self-Contained Default Icon Library (Zero-Config)

**Outcome:** the default NYSDS icon set resolves from an inline SVG map
instead of fetched URLs, eliminating the entire "icons don't resolve in
bundler X" class of issues (extends #872). URL-based resolution remains for
custom libraries (Font Awesome, Material, etc.).

**Key asset:** `packages/nys-icon/src/nys-icon.library.ts` — the inline
`Record<string, string>` SVG map (~142 KB source) already in the repo; today
it is only consumed at build time by `src/scripts/extract-icons.mjs` to
produce `dist/icons/*.svg`.

**Files:** `icon-library-registry.ts`, `nys-icon.ts`, `icon-cache.ts`,
`nys-icon.mdx`, root `README.md`

### Steps

1. **Extend the `IconLibrary` contract** so a resolver may return inline SVG
   source in addition to a URL — e.g. a discriminated result
   (`{ type: "svg", content }` | `{ type: "url", href }`) or a separate
   optional `source(name)` member. Backwards-compatible: existing
   string-returning resolvers keep meaning "URL".

2. **Re-point the default library at the inline map.** The lazily-registered
   `"default"` library imports `iconLibrary` from `nys-icon.library.ts` and
   returns SVG source directly — no fetch, no base-URL guessing, inherently
   SSR-safe.

3. **Short-circuit fetch in the component.** In `nys-icon.ts`
   `_loadIcon()`, when the resolver yields inline SVG, skip `fetchIcon()`'s
   network path but keep the existing sanitization pipeline
   (`DOMParser` + `DOMPurify` in `icon-cache.ts`) before injection.

4. **Preserve external-library and asset workflows.** Keep the
   `dist/icons/` extraction (external consumers may hotlink the SVGs) and
   `registerIconLibrary()` for custom libraries. Document the bundle-size
   trade-off in the PR: ~142 KB raw source re-enters the bundle (measure
   gzip/brotli impact); list mitigations considered (per-icon dynamic import,
   subsetting) and why the simple inline map was chosen or deferred.

5. **Docs cleanup.** Remove the per-framework asset-copy / resolver
   re-registration workarounds from `nys-icon.mdx` and the README; custom
   libraries become the only documented use of `registerIconLibrary()`.

### Testing gate (Phase 3)

| Check | Command / Method | Pass criteria |
|---|---|---|
| SSR smoke test | `npm run test:ssr` | Green |
| Zero-fetch proof | Storybook icon gallery with devtools Network tab | No requests to `icons/*.svg` for default-library icons |
| Custom library | Existing `nys-icon library system` tests in `nys-icon.test.ts` + new inline-vs-URL cases | Green |
| Sanitization | Unit test: inline SVG passes through DOMPurify path | Green |
| Framework repro | Next.js app renders `<nys-icon name="check_circle">` with zero config | Icon visible after hydration |
| Full suite | `npm run test` (run by maintainer) | No regressions |
| Bundle size | Compare `dist/nysds.es.js` size before/after (raw + gzip) | Delta documented in PR |

---

## 8. Phase 4 — Repo-Wide SSR Guard Rollout

**Outcome:** every NYSDS component survives server-side construction and
lifecycle execution. Fixes the remaining unguarded `window`/`document` access
found in the repo audit (2026-07). Each component is one step, with a
verification step between every one.

**Fix patterns** (per the convention in §4):

- **P1 — class field:** move `window.matchMedia(...)` initializers into a
  guarded `connectedCallback()`; type the field optional and null-check
  consumers.
- **P2 — lifecycle guard:** early-return `isServer` (from `lit`) at the top
  of `connectedCallback` / `firstUpdated` / `updated` blocks that attach
  document/window listeners or observers; mirror in `disconnectedCallback`.
- **P3 — method guard:** guard methods that read `window.innerWidth/Height`,
  `window.location`, `document.*` with `isServer` early-returns or safe
  fallbacks.

**Verification step (run between every component step):**
`npm run build && npm run test:ssr`, plus the package's own tests
(`cd packages/nys-<name> && npm test`, run by maintainer).

### Component steps (in order)

| # | Component | File / Lines | Pattern |
|---|---|---|---|
| 1 | nys-checkbox | `nys-checkbox.ts:98` — `window.matchMedia` class field | P1 |
| 2 | nys-modal | `nys-modal.ts:62` (class field); `:86` keydown listener; `:125-138` `document.body` overflow + `document.activeElement` | P1 + P2 + P3 |
| 3 | nys-radiogroup | `nys-radiogroup.ts:112` — `window.matchMedia` in `connectedCallback` | P2 |
| 4 | nys-breadcrumbs | `nys-breadcrumbs.ts:119` matchMedia; `:254` `window.innerWidth` fallback | P2 + P3 |
| 5 | nys-combobox | `nys-combobox.ts:97,103` document listeners; `:323` `window.innerHeight` | P2 + P3 |
| 6 | nys-dropdownmenu | `nys-dropdownmenu.ts:159-167` window/document listeners + `ResizeObserver(document.documentElement)`; `:307-308` `window.innerWidth/Height` | P2 + P3 |
| 7 | nys-globalheader | `nys-globalheader.ts:58-59` document listeners; `:75,147` `window.location`; `:210` matchMedia | P2 + P3 |
| 8 | nys-tooltip | `nys-tooltip.ts:101` keydown listener; `:206` `window.setTimeout`; `:245,253` scroll listeners; `:378-379,419-420,549` viewport reads | P2 + P3 |
| 9 | nys-datepicker | `nys-datepicker.ts:572` document listener; `:789` matchMedia | P3 |
| 10 | nys-video | `nys-video.ts:161-198` — `window.YT`, script injection, `window.onYouTubeIframeAPIReady` (method scope, verified not module scope) | P3 |
| 11 | nys-avatar | `nys-avatar.ts:128-132` — `document.createElement` + `document.body` for contrast computation | P3 |
| 12 | nys-backtotop | `nys-backtotop.ts:112-115` — complete the existing partial guards for `document.body` access | P3 |
| 13 | nys-skipnav | `nys-skipnav.ts:68` — `document.getElementById` | P3 |

**No action needed (event-handler-only, never runs on server):**
`nys-step.ts:153`, `nys-unavheader.ts:163,215` (`window.location.href`
navigation inside click handlers). Listed here so future audits don't re-flag
them.

### Phase 4 exit criterion

Extend `scripts/test-ssr.mjs` to also **construct** each exported custom
element class (not just import the bundle), so constructor-time regressions —
the class-field category above — are caught in CI, not just import-time
crashes. Wire it into the existing `test:ssr` script.

---

## 9. Acceptance Criteria

1. `node --input-type=module -e "await import('@nysds/components')"` exits 0.
2. `create-next-app` + `import "@nysds/components"` + `next build` succeeds
   on both current and older (Webpack-pattern-sensitive) Next.js versions.
3. `<nys-icon name="…">` renders standard NYSDS icons in vanilla, Vite,
   Webpack, and Next.js with **zero** app-side configuration.
4. `npm run test:ssr` (import + construct) passes in CI and gates PRs.
5. No behavioral or visual regressions in Storybook or the existing test
   suite across all phases.

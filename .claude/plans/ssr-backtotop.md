# Workstream: SSR Back-to-Top (and Related Components)

## Context

`nys-backtotop` calls `window.matchMedia()` directly in its **constructor** (line 59), which runs during custom element registration in Node.js/SSR environments. This crashes any SSR framework (Next.js, Nuxt, Astro) that imports the NYSDS bundle. Additional `window`/`document` calls exist in `connectedCallback` and helper methods.

The same pattern affects `nys-breadcrumbs`, `nys-datepicker`, `nys-dropdownmenu`, `nys-modal`, `nys-tooltip`, and `nys-globalheader` — all call browser APIs without guards. However, the **constructor** call in backtotop is the most critical because it runs at class definition time during module import.

## Files to Modify (Narrow Scope — backtotop only)

| File | Severity | Browser API Calls |
|------|----------|-------------------|
| `packages/nys-backtotop/src/nys-backtotop.ts` | **Critical** — constructor crash | `window.matchMedia()` in constructor (L59), `window.addEventListener` in connectedCallback (L65-66), `window.scrollY/innerHeight` in methods (L85-90), `window.scrollTo` (L94), `document.body` (L107-110) |
| `packages/nys-backtotop/src/nys-backtotop.test.ts` | — | Add SSR smoke test |

**Deferred to follow-up:** nys-breadcrumbs, nys-datepicker, nys-dropdownmenu, nys-modal, nys-tooltip, nys-globalheader

## Changes

### Strategy: Use `typeof window !== 'undefined'` guards

Lit's `isServer` from `@lit/reactive-element` is the cleanest pattern for Lit components, but it requires adding a new import. Since the codebase doesn't currently use it anywhere, use the simpler `typeof window !== 'undefined'` guard for consistency and zero new dependencies.

### 1. nys-backtotop.ts (Critical)

**Constructor fix** — move `window.matchMedia` out of the constructor:

```typescript
// BEFORE (crashes in SSR):
constructor() {
  super();
  this._handleScroll = this._handleScroll.bind(this);
  this._handleResize = this._handleResize.bind(this);
  this.mediaQuery = window.matchMedia("(max-width: 480px)");
}

// AFTER:
private mediaQuery: MediaQueryList | null = null;

constructor() {
  super();
  this._handleScroll = this._handleScroll.bind(this);
  this._handleResize = this._handleResize.bind(this);
}

connectedCallback() {
  super.connectedCallback();
  if (typeof window === 'undefined') return;
  this.mediaQuery = window.matchMedia("(max-width: 480px)");
  this.forceVisible = this.hasAttribute("visible");
  window.addEventListener("scroll", this._handleScroll);
  this.mediaQuery.addEventListener("change", this._handleResize);
  this._handleResize();
}
```

**Method guards** — wrap `window`/`document` calls in `_handleScroll`, `_scrollToTop`:

```typescript
private _handleScroll() {
  if (typeof window === 'undefined') return;
  // ... existing logic using window.innerHeight, window.scrollY, etc.
}

private _scrollToTop() {
  if (typeof window === 'undefined') return;
  // ... existing logic using window.scrollTo, document.body, etc.
}
```

### 2. nys-breadcrumbs.ts

Guard the `connectedCallback` matchMedia call:

```typescript
connectedCallback() {
  super.connectedCallback();
  if (typeof window !== 'undefined') {
    this._mediaQuery = window.matchMedia("(max-width: 767px)");
    // ... rest of browser-dependent setup
  }
}
```

Guard `_updateCollapseThreshold` and `_handleSlotChange` `window.innerWidth` calls with fallback defaults for SSR:

```typescript
const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
```

Note: `document.createElement()` calls are safe in SSR if they're only called from render paths that run client-side (inside `updated`, event handlers, etc.). If they run in `connectedCallback` or `firstUpdated` during SSR, they need guards.

### 3. nys-datepicker.ts

Lower priority — `document.createElement` calls are in `firstUpdated` and event handlers, which typically don't run in SSR. Guard the `window.matchMedia` call in `_isMobile()`:

```typescript
private _isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia("(pointer: coarse)").matches;
}
```

### 4. nys-dropdownmenu.ts

Guard `connectedCallback`/`firstUpdated` browser API calls:

```typescript
// In methods that use document/window:
if (typeof window === 'undefined') return;
```

Key locations: `_findTrigger` (document.getElementById), `_toggleDropdown` (window/document listeners), `_checkSpaceAvailable` (window.innerWidth/Height).

## Public API Impact

| Aspect | Change |
|--------|--------|
| Component behavior in browser | No change |
| Component behavior in SSR | No longer crashes; renders nothing (Lit's default SSR behavior for unhydrated components) |
| Attributes/props/events | No change |

## Test Strategy

- All existing browser tests must continue passing (no regressions)
- Add a Node.js smoke test that imports the full bundle without crashing:
  ```bash
  node -e "import('./dist/nysds.es.js').then(() => console.log('OK'))"
  ```
- The smoke test should be added to the test workflow (or as a separate script)
- Per-component: suggest user run `cd packages/nys-backtotop && npm test`

## Breaking Change Classification

**None** — adds safety guards without changing browser behavior.

## Dependencies on Other Workstreams

- No hard dependencies
- **Soft dependency on ci-workflows**: CI should be working to validate the SSR smoke test

## Recommended Merge Order

**5th** — after CI is fixed and higher-priority security issues are resolved.

## Resolved Decisions

- **Scope:** Narrow — fix **nys-backtotop only** (the constructor crash that blocks any SSR import). Other components can be follow-ups.
- **Guard pattern:** Use `typeof window !== 'undefined'` (simpler, no new imports, consistent)
- **Smoke test:** Add as a root script (e.g., `scripts/test-ssr.mjs`) that can be called from CI

## Remaining Open Question

1. **Smoke test location:** Root `scripts/test-ssr.mjs` or inline in the CI workflow as a one-liner? A script file is more reusable.

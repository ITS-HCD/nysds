# PRD: NYSDS Performance Improvements

**Date:** 2026-06-04  
**Status:** In Progress  
**Priority:** High

## Background

A codebase audit identified 13 performance issues across the NYSDS monorepo affecting bundle size, rendering efficiency, and memory usage. These improvements will reduce bundle sizes by an estimated 30–50% for typical consumers (who use 3–5 components) and eliminate several memory-leak patterns that impact single-page applications.

---

## Goals

- Reduce shipped JS bundle size for NYSDS consumers
- Eliminate event listener memory leaks in modal, header, and dropdown components
- Reduce unnecessary DOM re-renders and layout thrash
- Improve runtime performance in table-heavy and list-heavy views

---

## Non-Goals

- Rewriting components in a different framework
- Changing the public component API (breaking changes)
- CSS token restructuring (separate effort)

---

## Tasks

### P0 — High Impact

| # | Task | Files | Expected Win |
|---|------|-------|-------------|
| 1 | Fix barrel exports to enable tree-shaking | `src/index.ts` | 30–50% bundle reduction for consumers using ≤5 components |
| 2 | Make `wc-datepicker` a dynamic import | `packages/nys-datepicker/src/nys-datepicker.ts` | ~50KB savings for 80% of apps |
| 3 | Fix anonymous closure memory leak in `nys-modal` | `packages/nys-modal/src/nys-modal.ts:86` | Prevents keydown handler leak in SPAs |
| 4 | Refactor `nys-table` DOM rebuild pattern | `packages/nys-table/src/nys-table.ts:88,97,184` | Eliminates 3+ reflows per table update |
| 5 | Audit and trim `reflect: true` in `nys-button` | `packages/nys-button/src/nys-button.ts:78-159` | Reduces attribute sync overhead in lists |
| 6 | Lazy-load DOMPurify in `nys-icon` | `packages/nys-icon/src/icon-cache.ts` | ~30KB savings for static icon consumers |

### P1 — Medium Impact

| # | Task | Files | Expected Win |
|---|------|-------|-------------|
| 7 | Debounce slot-change handlers in `nys-button` | `packages/nys-button/src/nys-button.ts:203-204` | Reduces re-renders on batch DOM updates |
| 8 | Disconnect observers in `disconnectedCallback` | dropdownmenu, tooltip, tabgroup | Prevents resize-handler accumulation |
| 9 | Cache caption query in `nys-table` `willUpdate` | `packages/nys-table/src/nys-table.ts:61-74` | Removes O(n) DOM query per update cycle |

### P2 — Low Impact

| # | Task | Files | Expected Win |
|---|------|-------|-------------|
| 10 | Add CSS containment to component host selectors | All component SCSS | 5–10% layout recalc reduction |
| 11 | Store and clear `setTimeout` in `nys-button` | `packages/nys-button/src/nys-button.ts:310` | Prevents orphaned timeout on unmount |
| 12 | Guard `matchMedia` re-attachment in `nys-modal` | `packages/nys-modal/src/nys-modal.ts:62,82` | Prevents double-handler on SPA reconnect |
| 13 | Fix `nys-globalheader` listener cleanup | `packages/nys-globalheader/src/nys-globalheader.ts:58-65` | Prevents leaks on SPA navigation |

---

## Success Metrics

- Consumer bundle size for a 5-component subset: ≤ 100KB (down from ~570KB)
- No growth in event listener count across 10 modal open/close cycles (measure via DevTools)
- `nys-table` row update time < 16ms for tables with ≤ 200 rows
- Zero ResizeObserver callbacks firing after component removal

---

## Rollout

All changes are internal refactors with no public API changes. Ship as a patch/minor version bump after smoke-testing Storybook stories for each affected component.

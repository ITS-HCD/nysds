# NYSDS v1.18.1 Remediation Plans

Implementation plans for resolving critical and high-priority findings from the v1.18.1 audit. Each workstream is designed to be executed in an isolated git worktree by a parallel agent.

## Workstreams

| # | Workstream | Summary | Breaking? | Model |
|---|-----------|---------|-----------|-------|
| 1 | [ci-workflows](ci-workflows.md) | Fix broken CI: @v6→@v4, add permissions, npm ci, audit step | None | Sonnet |
| 2 | [button-injection](button-injection.md) | Remove `new Function()` XSS vector, add ESLint guard | None (Option B) | Opus |
| 3 | [tabgroup-memory-leak](tabgroup-memory-leak.md) | Verify fix already landed; add disconnect test if needed | None | Sonnet |
| 4 | [wcag-new-components](wcag-new-components.md) | Fix 3 critical WCAG issues: aria-current, aria-describedby, aria-label | None | Opus |
| 5 | [ssr-backtotop](ssr-backtotop.md) | Add `typeof window` guards to prevent SSR crashes | None | Sonnet |
| 6 | [typescript-plop-gaps](typescript-plop-gaps.md) | Add 3 missing tsconfig refs, fix Plop templates for future | None | Sonnet |
| 7 | [side-effects](side-effects.md) | Add `sideEffects` field to all 37 package.json files | None | Sonnet |

## Recommended Merge Order

```
1. ci-workflows        ← Merge FIRST (restores CI validation for all other PRs)
2. button-injection    ← Security P0, needs CI to validate
3. tabgroup-memory-leak ← Quick verify-and-close or minimal fix
4. wcag-new-components ← Accessibility critical fixes
5. ssr-backtotop       ← SSR safety (touches some same files as #4)
6. typescript-plop-gaps ← Tooling fixes
7. side-effects        ← Package metadata (no code changes, safest last)
```

**Rationale:**
- CI must be fixed first so all subsequent PRs get validated
- Security (button) is highest-risk and should land early
- Tabgroup is a quick verification — if already fixed, it's just adding a test
- WCAG and SSR both touch new component source files but different sections (ARIA attrs vs lifecycle guards)
- Plop and sideEffects are metadata/tooling — lowest risk, no runtime changes

## Cross-Workstream Dependencies

```
ci-workflows ──────────────────────────────────────────────────────────┐
                                                                       │
button-injection (independent)                                         │ All workstreams
                                                                       │ benefit from CI
tabgroup-memory-leak (independent)                                     │ being fixed first
                                                                       │
wcag-new-components ──┐                                                │
                      ├── May touch same files (breadcrumbs, datepicker)│
ssr-backtotop ────────┘                                                │
                                                                       │
typescript-plop-gaps ──┐                                               │
                       ├── Both add sideEffects (different files)       │
side-effects ──────────┘                                               │
```

**Conflict risk:** `wcag-new-components` and `ssr-backtotop` both modify `nys-breadcrumbs.ts`, `nys-datepicker.ts`, and `nys-dropdownmenu.ts`. If running in parallel worktrees, the second to merge will need a rebase. Mitigation: merge WCAG first (it touches render methods), then SSR (it touches lifecycle methods) — different sections of the same files.

## Breaking Change Summary

**No breaking changes across any workstream.** All changes are:
- Bug fixes (button injection, tabgroup)
- Additive ARIA attributes (WCAG)
- Safety guards that don't change browser behavior (SSR)
- Build metadata and tooling (CI, plop, sideEffects)

## Per-Workstream Model Recommendation

| Workstream | Model | Rationale |
|-----------|-------|-----------|
| ci-workflows | **Sonnet** | Simple file edits (YAML), no complex logic, well-defined changes |
| button-injection | **Opus** | Security-critical refactor requiring judgment about backward compatibility, event dispatch flow analysis, potential double-fire issues |
| tabgroup-memory-leak | **Sonnet** | Verification task — read code, confirm fix exists, add test. Minimal creativity needed |
| wcag-new-components | **Opus** | Requires understanding ARIA patterns, cross-component consistency, and judgment about API design (dropdownmenu label strategy) |
| ssr-backtotop | **Sonnet** | Mechanical guard insertion at known locations. Pattern is clear and repetitive. |
| typescript-plop-gaps | **Sonnet** | Config file edits and template fixes. Well-defined locations and patterns. |
| side-effects | **Sonnet** | Repetitive metadata addition across 37 files. Script-like execution. |

## Versioning

Single patch bump: **1.18.1 → 1.18.2** for the entire monorepo after all workstreams merge. No per-package versioning (Changesets deferred to separate initiative). No migration guide needed — all changes are non-breaking.

## Audit Reference

All findings documented in `.claude/docs/audit-v1.18.1/`:
- `EXECUTIVE-SUMMARY.md` — Overview
- `AUDIT-FINDINGS.md` — Complete findings
- `GITHUB-ISSUES.md` — Issue templates
- `OPTIMIZATION-ROADMAP.md` — Prioritized fix list

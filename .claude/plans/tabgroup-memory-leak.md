# Workstream: Tabgroup Memory Leak

## Context

The v1.18.1 audit flagged `nys-tabgroup` as having a memory leak: scroll and wheel event listeners attached in `firstUpdated`/`updated` are never removed because there's no `disconnectedCallback`.

**However, code exploration reveals this may already be fixed.** The current source at `packages/nys-tab/src/nys-tabgroup.ts` shows:

- Lines 127-144: `firstUpdated()` attaches `scroll` and `wheel` listeners using **arrow function class properties** (proper binding)
- Lines 146-153: `disconnectedCallback()` **exists** and removes both listeners + disconnects the ResizeObserver
- Both `_updateScrollShadows` and `_handleWheel` are arrow function properties (no anonymous wrapper issue)

```typescript
disconnectedCallback() {
  super.disconnectedCallback();
  this._tabsEl?.removeEventListener("scroll", this._updateScrollShadows);
  this._tabsEl?.removeEventListener("wheel", this._handleWheel);
  this._resizeObserver?.disconnect();
  this._resizeObserver = undefined;
}
```

## Verdict

**This issue appears to be already resolved.** The cleanup code is properly implemented:
- Arrow function properties ensure stable references
- `disconnectedCallback` removes all listeners
- ResizeObserver is properly disconnected
- Optional chaining (`?.`) prevents errors if the element was never rendered

## Files to Verify

| File | Action |
|------|--------|
| `packages/nys-tab/src/nys-tabgroup.ts` | Verify disconnectedCallback is present and correct |
| `packages/nys-tab/src/nys-tabgroup.test.ts` | Consider adding mount/unmount leak test if not present |

## Changes (Minimal)

### 1. Verify current state

The executing agent should confirm `disconnectedCallback` exists and properly removes listeners. If it does (as exploration suggests), no code changes are needed.

### 2. Add mount/unmount test (if missing)

If no test covers the disconnect behavior, add one:
```typescript
it("removes event listeners on disconnect", async () => {
  const el = await fixture(html`<nys-tabgroup>...</nys-tabgroup>`);
  const tabsEl = el.shadowRoot!.querySelector(".nys-tabgroup__tabs")!;
  const spy = sinon.spy(tabsEl, "removeEventListener");
  el.remove(); // triggers disconnectedCallback
  expect(spy).to.have.been.calledWith("scroll", sinon.match.func);
  expect(spy).to.have.been.calledWith("wheel", sinon.match.func);
});
```

### 3. Verify super.disconnectedCallback() call order

Current code calls `super.disconnectedCallback()` first (line 147). Lit docs recommend calling super first in `disconnectedCallback` (unlike `connectedCallback` where super goes first too). This is correct.

## Public API Impact

None.

## Test Strategy

- Verify existing tests pass
- Add disconnect cleanup test if missing
- Manual verification: mount/unmount tabgroup in Storybook, check DevTools for listener count

## Breaking Change Classification

**None** — bug verification only, no API changes.

## Dependencies on Other Workstreams

None. Independent.

## Recommended Merge Order

**3rd** (low risk, can go early)

## Open Questions

1. **Was this fixed between the audit snapshot and the current code?** The audit was run May 24, 2026 — if a commit landed after that date fixing this, we can close the issue with a reference to that commit. The agent should check `git log --oneline packages/nys-tab/src/nys-tabgroup.ts` to see if a recent fix was applied.
2. **Should we still file/close the GitHub issue?** If already fixed, this workstream becomes "verify and add test coverage" rather than "fix the leak."

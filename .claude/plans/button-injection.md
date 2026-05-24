# Workstream: Button Injection (new Function() Removal)

## Context

`nys-button` uses `new Function("return " + onClickAttr)` at line 335 to execute the `onClick` HTML attribute string on keyboard activation (Space/Enter). This is functionally equivalent to `eval()` — it creates a code injection vector (CVSS 8.1) and blocks CSP compliance. The pattern exists because native click events execute inline `onclick` attributes automatically, but keyboard activation of the custom element doesn't trigger that native behavior. This has been open since the v1.12.1 audit.

**Current code** (`packages/nys-button/src/nys-button.ts:325-341`):
```typescript
private _handleAnyAttributeFunction() {
  const onClickAttr = this.getAttribute("onClick");
  if (onClickAttr) {
    const callFunc = new Function("return " + onClickAttr);
    callFunc();
  }
}
```

Called from `_handleKeydown()` at line 308 when Space/Enter is pressed and no `href` is present.

## API Options to Replace new Function()

### Option A: Global function name lookup (Recommended)

Parse the attribute value to extract a function name and call it from `window`:

```typescript
private _handleAnyAttributeFunction() {
  const onClickAttr = this.getAttribute("onClick");
  if (!onClickAttr) return;

  // Extract function name from patterns like "doThing()" or "doThing(arg)"
  const match = onClickAttr.match(/^(\w[\w.]*)\s*\(/);
  if (match) {
    const funcPath = match[1];
    const parts = funcPath.split(".");
    let fn: any = window;
    for (const part of parts) {
      fn = fn?.[part];
    }
    if (typeof fn === "function") {
      fn();
    }
  }
}
```

**Pros:**
- Handles `onClick="doThing()"` and `onClick="namespace.doThing()"` — covers 90%+ of real-world usage
- CSP-safe (no string evaluation)
- Simple mental model for consumers

**Cons:**
- Does NOT support inline expressions like `onClick="x++; doThing(x)"` or `onClick="doThing('arg')"`
- Slight behavior change for consumers passing arguments

### Option B: Synthetic click dispatch

Instead of evaluating the attribute, dispatch a synthetic `click` event on the host element, which the browser handles natively (including inline `onclick` execution):

```typescript
private _handleAnyAttributeFunction() {
  this.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
}
```

**Pros:**
- Zero custom parsing — the browser handles `onclick` natively
- Supports ALL patterns (expressions, arguments, etc.)
- CSP-safe — the browser's own inline event handler mechanism applies
- No behavioral gap with native buttons

**Cons:**
- May cause double-firing if the keyboard handler already triggers a click event downstream
- Need to verify it doesn't recurse (keyboard → synthetic click → _handleKeydown again)
- The `onClick` attribute (capital C) vs `onclick` (lowercase) distinction matters — native handlers use lowercase

### Option C: Remove feature entirely, document addEventListener

Remove `_handleAnyAttributeFunction()` completely. Document that programmatic click handling requires `addEventListener`:

```typescript
// Just remove the method entirely
// In _handleKeydown, remove the call to _handleAnyAttributeFunction()
```

**Pros:**
- Simplest implementation, zero attack surface
- Aligns with web component best practices (use events, not attribute strings)

**Cons:**
- Breaking change for any agency using `<nys-button onClick="...">` in vanilla HTML
- Keyboard activation would no longer invoke the attribute handler

## Decision: Option B (Synthetic Click) — APPROVED

**Rationale:** Option B maintains backward compatibility for agencies using `<nys-button onclick="handleClick()">` because the browser's native inline event system handles the execution (CSP-compliant for inline handlers if the CSP policy allows `unsafe-inline` or uses a nonce). It requires no custom parsing logic and handles all existing patterns. The key insight is that dispatching a real `click` event lets the browser's own machinery handle any `onclick` attribute — which is exactly what happens on a native `<button>`. This aligns with Lit's "use the platform" philosophy — `this.click()` is the native `HTMLElement.click()` method.

**Important nuance on CSP:** Inline event handlers (`onclick="..."`) themselves require `unsafe-inline` in CSP. But that's a consumer decision about their CSP policy — our code no longer uses `eval()`/`new Function()`, which requires the much more dangerous `unsafe-eval`. Consumers who want strict CSP can migrate to `addEventListener`.

**Attribute casing:** Use `getAttribute("onclick")` (lowercase). HTML attribute lookup is case-insensitive, so this catches both `onclick` and `onClick` usage.

## Files to Modify

| File | Change |
|------|--------|
| `packages/nys-button/src/nys-button.ts` | Replace `_handleAnyAttributeFunction()` implementation |
| `packages/nys-button/src/nys-button.test.ts` | Update/add tests for keyboard activation with onClick attr |
| `eslint.config.js` | Add `no-new-func` rule to prevent recurrence |

## Changes

### 1. Replace _handleAnyAttributeFunction (nys-button.ts)

Replace the method body. If Option B (synthetic click):
- Remove the `new Function()` call
- Replace with `this.click()` or `this.dispatchEvent(new MouseEvent('click', ...))`
- Verify the `_handleKeydown` flow doesn't double-fire (the method is called at line 308, and line 309 does `this._handleClick()` — may need to restructure to avoid duplicate dispatch)

**Execution note:** The agent should trace the full `_handleKeydown` → `_handleAnyAttributeFunction` → `_handleClick` flow to ensure no double-fire. If `_handleClick` already dispatches a click, the synthetic click approach may need to replace both calls.

### 2. Add ESLint rule (eslint.config.js)

Add to the `rules` object (around line 33-42):
```javascript
"no-new-func": "error",
```

### 3. Update tests (nys-button.test.ts)

- Test: keyboard Enter on `<nys-button onclick="window.__testClicked = true">` fires the handler
- Test: keyboard Space on `<nys-button onclick="window.__testClicked = true">` fires the handler
- Test: verify no `new Function` in the source (grep test or ESLint integration test)

## Public API Impact

| Aspect | Change |
|--------|--------|
| `onClick` attribute (string) | Still works for simple function calls; inline expressions may not work depending on option chosen |
| `onClick` property (function) | No change — line 182-183 is a separate programmatic callback |
| `nys-click` event | No change |
| CSP compliance | Removes `unsafe-eval` requirement |

## Backward Compatibility

Agencies currently using `<nys-button onClick="doSomething()">`:
- **Option B**: Fully backward compatible (browser handles it natively)
- **Option A**: Compatible for `functionName()` patterns, breaks for inline expressions
- **Option C**: Breaking — must migrate to addEventListener

## Breaking Change Classification

- **Option B**: **None** (patch-safe)
- **Option A**: **Patch** (minor behavior change for edge cases)
- **Option C**: **Minor** (removes documented attribute behavior)

## Dependencies on Other Workstreams

None. Independent.

## Recommended Merge Order

**2nd** (after ci-workflows so CI validates it)

## Resolved Decisions

- **API option:** Option B (synthetic click) — approved
- **Attribute casing:** Use lowercase `onclick` only — HTML attribute lookup is case-insensitive
- **Deprecation:** Soft removal — no deprecation warning, no console.warn. Just replace the implementation silently. The `onclick` attribute pattern continues to work safely.
- **Migration guide:** Not needed — no breaking change

## Remaining Open Question

1. **Double-fire concern:** In `_handleKeydown`, line 308 calls `_handleAnyAttributeFunction()` and line 309 calls `this._handleClick()`. If we use `this.click()`, we need to understand whether `_handleClick` also dispatches a native click. The executing agent should trace this flow and consolidate if needed to avoid double-fire.

# Workstream: WCAG New Components (3 Critical Issues)

## Context

The 7 new components added since v1.12.1 introduce 33 WCAG 2.2 AA issues (3 critical, 10 high). This workstream addresses the **3 critical** findings:

1. **nys-breadcrumbs** — missing `aria-current="page"` on the current page item
2. **nys-datepicker** — input lacks `aria-describedby` linking to its error message
3. **nys-dropdownmenu** — `<ul role="menu">` has no accessible name

## Files to Modify

| File | Issue |
|------|-------|
| `packages/nys-breadcrumbs/src/nys-breadcrumbs.ts` | Add `aria-current="page"` to current breadcrumb |
| `packages/nys-breadcrumbs/src/nys-breadcrumbs.test.ts` | Test aria-current rendering |
| `packages/nys-datepicker/src/nys-datepicker.ts` | Add `aria-describedby` to input, wire to error message ID |
| `packages/nys-datepicker/src/nys-datepicker.test.ts` | Test aria-describedby linkage |
| `packages/nys-dropdownmenu/src/nys-dropdownmenu.ts` | Add `aria-label` or `aria-labelledby` to menu |
| `packages/nys-dropdownmenu/src/nys-dropdownmenu.test.ts` | Test accessible name |

## Changes

### 1. nys-breadcrumbs: Add `aria-current="page"`

**Location:** `_createCrumbElement()` method (lines 217-246)

The method already detects the current page item (line 225: `if (isCurrentPage)`). Add the ARIA attribute:

```typescript
if (isCurrentPage) {
  liEl.textContent = label;
  liEl.setAttribute("aria-current", "page");  // ADD THIS
  return liEl;
}
```

**Public API consideration:** Should `aria-current` be configurable? The WAI-ARIA breadcrumb pattern specifies `aria-current="page"` for the current page. Some implementations allow `"step"` or `"location"`. For now, hardcode `"page"` — it's the correct value for navigation breadcrumbs per WAI-ARIA APG.

### 2. nys-datepicker: Add `aria-describedby` for error messages

**Location:** The input element render (around lines 812-829) and the error message component (line 899).

**Approach:**
1. Generate a stable error message ID based on the component's ID: `${this.id}-error`
2. Add `aria-describedby` to the input element, pointing to the error ID (only when `showError` is true)
3. Pass the ID to the `<nys-errormessage>` component (or set it on its wrapper)

```typescript
// In the input render:
<input
  ...existing attributes...
  aria-describedby=${this.showError ? `${this.id}-error` : nothing}
/>

// In the error message render:
<nys-errormessage
  id="${this.id}-error"
  ?showError=${this.showError}
  errorMessage=${this._internals.validationMessage || this.errorMessage}
></nys-errormessage>
```

**Note:** Check how `nys-errormessage` renders — if it wraps content in a `<div>`, the ID may need to go on an inner element. The `aria-describedby` target must be the element containing the visible error text.

**Also consider:** If other form components (textinput, select, textarea) have the same pattern, this fix should be applied consistently. However, only datepicker is flagged as critical — the others may already handle this. The executing agent should check.

### 3. nys-dropdownmenu: Add accessible name to menu

**Location:** Line 497 — the `<ul role="menu">` element.

**Approach:** Add `aria-label` derived from the trigger button's text content, or accept a `label` property:

```typescript
// Option A: Use existing label/name prop
<ul role="menu" aria-label=${this.label || "Menu"}>
  <slot></slot>
</ul>

// Option B: Use aria-labelledby pointing to trigger
<ul role="menu" aria-labelledby=${this._triggerId}>
  <slot></slot>
</ul>
```

**Recommended:** Option A with a new `label` attribute (simpler, no cross-shadow-DOM ID reference issues). If the component already has a `label` or `name` property, reuse it. If not, add one with a sensible default.

**Fallback:** If no label is provided, use the trigger element's text content as `aria-label`. The executing agent should check what props already exist on nys-dropdownmenu.

## Public API Impact

| Component | Change | Type |
|-----------|--------|------|
| nys-breadcrumbs | `aria-current="page"` added to current item `<li>` | Internal (no new props) |
| nys-datepicker | `aria-describedby` added to input when error shows | Internal (no new props) |
| nys-dropdownmenu | New `label` attribute/property (if needed) | **New attribute** — additive |

If nys-dropdownmenu already has a `label` prop, no API change is needed.

## Test Strategy

### nys-breadcrumbs
- Test that the last breadcrumb `<li>` has `aria-current="page"`
- Test that non-current items do NOT have `aria-current`

### nys-datepicker
- Test that when `showError` is true, the input has `aria-describedby` pointing to the error element
- Test that when `showError` is false, `aria-describedby` is absent
- Test that the error element has the expected ID

### nys-dropdownmenu
- Test that `<ul role="menu">` has an `aria-label` (or `aria-labelledby`)
- Test that setting the `label` property updates the accessible name

## Breaking Change Classification

**None** — all changes are additive (new ARIA attributes on existing elements, optional new property with default).

## Dependencies on Other Workstreams

- No hard dependencies
- If **ssr-backtotop** adds guards to breadcrumbs/datepicker/dropdownmenu, coordinate to avoid merge conflicts in the same files

## Recommended Merge Order

**4th** — after CI and security fixes, but can run in parallel with ssr-backtotop if files don't overlap significantly.

## Open Questions

1. **nys-dropdownmenu label:** Does the component already have a `label` or similar prop? The agent should check before adding a new one.
2. **aria-describedby scope:** Should we also wire `aria-describedby` to the `description` slot/prop (for help text, not just errors)? Many form patterns link to both description and error. This could be a follow-up.
3. **Breadcrumbs detection logic:** How does the component determine which item is "current"? Is it the last item, or is there an explicit `current` attribute on a breadcrumb item? The fix depends on this logic.

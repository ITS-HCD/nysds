# Workstream: Side Effects

## Context

All 37 packages in the NYSDS monorepo are missing the `sideEffects` field in their `package.json`. Without this field, tree-shaking bundlers (webpack, Rollup, esbuild) use heuristics to determine which modules have side effects. For web components that register themselves via `customElements.define()`, this can result in the registration being tree-shaken away — silently breaking components for consumers.

**Important:** The correct value is NOT universally `"sideEffects": false`. Packages that register custom elements on import **have side effects** and must declare them. The audit recommendation to add `"sideEffects": true` to all packages is the safe default, but we can be more precise.

## Import Pattern Analysis

### How NYSDS components register

Every component package follows this pattern (from exploration of nys-button):

```typescript
// packages/nys-button/src/nys-button.ts (bottom of file)
if (!customElements.get("nys-button")) {
  customElements.define("nys-button", NysButton);
}
```

The `index.ts` in each package re-exports from the component file:
```typescript
// packages/nys-button/src/index.ts
export { NysButton } from "./nys-button.js";
```

This means **importing the package triggers custom element registration** as a side effect of module evaluation. The `customElements.define()` call runs at import time.

### Package categories

| Category | Packages | Has Side Effects? | Correct Value |
|----------|----------|-------------------|---------------|
| Component packages (33) | nys-accordion through nys-video | **Yes** — registers custom element on import | `"sideEffects": true` |
| tokens | @nysds/tokens | **No** — exports CSS/JSON, no registration | `"sideEffects": false` |
| styles | @nysds/styles | **No** — CSS-only package | `"sideEffects": ["**/*.css"]` |
| mcp-server | @nysds/mcp-server | **No** — Node.js tool, not bundled | Can omit or set `false` |
| Root package | @nysds/components | **Yes** — barrel imports trigger all registrations | `"sideEffects": true` |

### More granular option for component packages

A more precise declaration for component packages:

```json
"sideEffects": ["./dist/*.js"]
```

This tells bundlers "the JS output files have side effects" (because they register elements) while theoretically allowing tree-shaking of other file types. However, since each component package has exactly one JS entry point, `true` is equivalent and simpler.

## Files to Modify

| File | Value |
|------|-------|
| `packages/nys-accordion/package.json` | `"sideEffects": true` |
| `packages/nys-alert/package.json` | `"sideEffects": true` |
| `packages/nys-avatar/package.json` | `"sideEffects": true` |
| `packages/nys-backtotop/package.json` | `"sideEffects": true` |
| `packages/nys-badge/package.json` | `"sideEffects": true` |
| `packages/nys-breadcrumbs/package.json` | `"sideEffects": true` |
| `packages/nys-button/package.json` | `"sideEffects": true` |
| `packages/nys-checkbox/package.json` | `"sideEffects": true` |
| `packages/nys-combobox/package.json` | `"sideEffects": true` |
| `packages/nys-datepicker/package.json` | `"sideEffects": true` |
| `packages/nys-divider/package.json` | `"sideEffects": true` |
| `packages/nys-dropdownmenu/package.json` | `"sideEffects": true` |
| `packages/nys-errormessage/package.json` | `"sideEffects": true` |
| `packages/nys-fileinput/package.json` | `"sideEffects": true` |
| `packages/nys-globalfooter/package.json` | `"sideEffects": true` |
| `packages/nys-globalheader/package.json` | `"sideEffects": true` |
| `packages/nys-icon/package.json` | `"sideEffects": true` |
| `packages/nys-label/package.json` | `"sideEffects": true` |
| `packages/nys-modal/package.json` | `"sideEffects": true` |
| `packages/nys-pagination/package.json` | `"sideEffects": true` |
| `packages/nys-radiobutton/package.json` | `"sideEffects": true` |
| `packages/nys-select/package.json` | `"sideEffects": true` |
| `packages/nys-skipnav/package.json` | `"sideEffects": true` |
| `packages/nys-stepper/package.json` | `"sideEffects": true` |
| `packages/nys-tab/package.json` | `"sideEffects": true` |
| `packages/nys-table/package.json` | `"sideEffects": true` |
| `packages/nys-textarea/package.json` | `"sideEffects": true` |
| `packages/nys-textinput/package.json` | `"sideEffects": true` |
| `packages/nys-toggle/package.json` | `"sideEffects": true` |
| `packages/nys-tooltip/package.json` | `"sideEffects": true` |
| `packages/nys-unavfooter/package.json` | `"sideEffects": true` |
| `packages/nys-unavheader/package.json` | `"sideEffects": true` |
| `packages/nys-video/package.json` | `"sideEffects": true` |
| `packages/tokens/package.json` | `"sideEffects": false` |
| `packages/styles/package.json` | `"sideEffects": ["**/*.css"]` |
| `packages/mcp-server/package.json` | `"sideEffects": false` |
| Root `package.json` | `"sideEffects": true` |

## Changes

### Implementation approach

Use a Node.js script or shell one-liner to add the field to all packages. The executing agent can either:

**Option A: Script approach**
```bash
for pkg in packages/*/package.json; do
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('$pkg', 'utf8'));
    const name = pkg.name;
    if (name === '@nysds/tokens' || name === '@nysds/mcp-server') {
      pkg.sideEffects = false;
    } else if (name === '@nysds/styles') {
      pkg.sideEffects = ['**/*.css'];
    } else {
      pkg.sideEffects = true;
    }
    fs.writeFileSync('$pkg', JSON.stringify(pkg, null, 2) + '\n');
  "
done
```

**Option B: Manual edits**
Add `"sideEffects": true` after `"type": "module"` in each component package.json. Set appropriate values for tokens, styles, and mcp-server.

### Field placement

Insert `"sideEffects"` after the `"type"` field for consistency:

```json
{
  "name": "@nysds/nys-button",
  "version": "1.18.1",
  ...
  "type": "module",
  "sideEffects": true,
  ...
}
```

### Root package.json

Add `"sideEffects": true` since importing the root barrel (`src/index.ts`) triggers all custom element registrations.

## Public API Impact

| Aspect | Change |
|--------|--------|
| Bundler behavior | Tree-shaking bundlers will correctly preserve custom element registrations |
| Package consumers | No behavior change if bundler was already keeping imports (most do by default without the field) |
| tokens package | Bundlers CAN now tree-shake unused token imports (positive) |

## Test Strategy

- `npm run build` must pass (sideEffects doesn't affect the build itself)
- Verify with a minimal webpack/Rollup config that importing a single component still registers it:
  ```javascript
  import "@nysds/nys-button";
  console.log(customElements.get("nys-button")); // should not be undefined
  ```
- The Plop template fix (in **typescript-plop-gaps** workstream) ensures new packages also get this field

## Breaking Change Classification

**None** — adding `sideEffects` is purely declarative metadata. It tells bundlers what they should already assume.

## Dependencies on Other Workstreams

- Coordinate with **typescript-plop-gaps** which adds `sideEffects` to the Plop template (different files, no conflict)
- No blocking dependencies

## Recommended Merge Order

**7th** (last) — safe, low-risk, no dependencies, but logically follows typescript-plop-gaps.

## Open Questions

1. **Granularity for component packages:** Should we use `"sideEffects": true` (simple, correct) or `"sideEffects": ["./dist/*.js"]` (slightly more precise)? I recommend `true` for simplicity — each component package has exactly one JS entry that always has side effects.
2. **styles package:** The value `["**/*.css"]` tells bundlers that CSS imports have side effects (correct — CSS is always a side effect) but JS imports don't. Does `@nysds/styles` have any JS exports? If it's pure CSS, `true` would also be fine.
3. **Verification tooling:** Should we add a CI check that ensures all package.json files have a `sideEffects` field? A simple grep-based check in the test workflow would prevent regression.

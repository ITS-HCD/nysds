# Workstream: TypeScript & Plop Gaps

## Context

Three packages added since v1.12.1 (`nys-breadcrumbs`, `nys-tab`, `nys-video`) are missing from `tsconfig.build.json` because Plop doesn't auto-update it. The Plop scaffolding tool also has other gaps: MDX generation is commented out, the `lit-analyze` glob is non-recursive, and `sideEffects` is missing from the package template. This workstream fixes the immediate gaps AND the Plop templates so future scaffolding doesn't reproduce them.

## Files to Modify

| File | Change |
|------|--------|
| `tsconfig.build.json` | Add 3 missing package references |
| `plopfile.js` | Add tsconfig.build.json update action, uncomment MDX, fix lit-analyze glob |
| `src/templates/package.template.hbs` | Add `sideEffects` field, fix lit-analyze glob |
| `src/templates/mdx.template.hbs` | Verify template is still valid for current MDX format |

## Changes

### 1. Add missing packages to tsconfig.build.json

Add these entries to the `references` array (alphabetical order):

```json
{ "path": "packages/nys-breadcrumbs" },
{ "path": "packages/nys-tab" },
{ "path": "packages/nys-video" }
```

**Current state:** 30 references exist (confirmed). Insert `nys-breadcrumbs` after `nys-badge`, `nys-tab` after `nys-stepper`, and `nys-video` after `nys-unavheader`.

### 2. Add Plop action to update tsconfig.build.json

In `plopfile.js`, add a new action after the existing `modify` actions (after line ~107). Use Plop's `modify` action type with a pattern match:

```javascript
{
  type: "modify",
  path: "tsconfig.build.json",
  pattern: /(\s*)(]\s*})/,
  template: '$1  { "path": "packages/nys-{{componentName}}" },\n$1$2',
},
```

**Alternative (more robust):** Use a custom Plop action function that reads `tsconfig.build.json` as JSON, pushes the new reference, sorts alphabetically, and writes it back:

```javascript
{
  type: "custom",
  action: async (answers) => {
    const fs = require("fs");
    const path = require("path");
    const tsconfigPath = path.resolve("tsconfig.build.json");
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
    const newRef = { path: `packages/nys-${answers.componentName}` };
    tsconfig.references.push(newRef);
    tsconfig.references.sort((a, b) => a.path.localeCompare(b.path));
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n");
    return `Added nys-${answers.componentName} to tsconfig.build.json`;
  },
},
```

**Recommendation:** The regex approach is simpler and consistent with how Plop modifies `build-order.js` and `src/index.ts`. However, the custom action is more robust (won't break if formatting changes). The executing agent should use whichever approach best matches the existing code patterns in `plopfile.js`.

### 3. DO NOT uncomment MDX template action

Leave the MDX action commented out in `plopfile.js` (lines 42-46). MDX uncommenting is deferred to a separate effort.

### 4. Fix lit-analyze glob in package.template.hbs

In `src/templates/package.template.hbs`, find the `lit-analyze` script and change the glob:

```json
// BEFORE:
"lit-analyze": "lit-analyzer '*.ts'"

// AFTER:
"lit-analyze": "lit-analyzer 'src/**/*.ts'"
```

Use `src/**/*.ts` rather than just `**/*.ts` to avoid analyzing node_modules or dist files.

### 5. Add sideEffects field to package.template.hbs

Add `"sideEffects": true` to the template. Place it after `"type": "module"`:

```json
"type": "module",
"sideEffects": true,
```

**Note:** This ensures NEW packages get the field. Existing packages are handled by the **side-effects** workstream.

### 6. Skip MDX template verification

MDX template work is deferred. Do not modify `src/templates/mdx.template.hbs`.

## Public API Impact

None. Build tooling and scaffolding only.

## Test Strategy

- Run `tsc --build tsconfig.build.json` after adding the 3 missing references — should complete without errors
- Run `npm run gen` with a test component name to verify:
  - MDX file is generated
  - `tsconfig.build.json` is updated
  - Generated `package.json` has `sideEffects: true`
  - Generated `package.json` has correct lit-analyze glob
- Delete the test component after verification

## Breaking Change Classification

**None** — tooling and build configuration only.

## Dependencies on Other Workstreams

- **side-effects** workstream adds `sideEffects` to existing packages; this workstream ensures new packages get it too. No merge conflict risk — different files.
- No blocking dependencies.

## Recommended Merge Order

**6th** — low risk, independent, but logically groups with side-effects.

## Resolved Decisions

- **Existing lit-analyze globs:** Yes, fix all 8 existing packages — change `'*.ts'` to `'src/**/*.ts'`
- **MDX:** Do NOT uncomment MDX action. Deferred to separate effort.
- **Plop scope:** Add tsconfig.build.json update action + fix glob + add sideEffects in package.template.hbs
- **Versioning:** Single patch bump (1.18.2) for entire monorepo after all workstreams merge

## Remaining Open Question

1. **Plop action style:** Should the tsconfig.build.json update use regex `modify` or a custom action function? The existing plopfile uses `modify` with regex for `build-order.js` and `src/index.ts`, so regex is consistent with the codebase pattern. Agent should match existing style.

## Additional Files to Modify (from decisions)

| File | Change |
|------|--------|
| `packages/nys-breadcrumbs/package.json` | Fix lit-analyze glob: `'*.ts'` → `'src/**/*.ts'` |
| `packages/nys-combobox/package.json` | Fix lit-analyze glob |
| `packages/nys-datepicker/package.json` | Fix lit-analyze glob |
| `packages/nys-dropdownmenu/package.json` | Fix lit-analyze glob |
| `packages/nys-pagination/package.json` | Fix lit-analyze glob |
| `packages/nys-table/package.json` | Fix lit-analyze glob |
| `packages/nys-tab/package.json` | Fix lit-analyze glob |
| `packages/nys-video/package.json` | Fix lit-analyze glob |

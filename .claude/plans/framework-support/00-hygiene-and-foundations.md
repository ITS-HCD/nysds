# WS0: Hygiene and foundations

**Goal:** Clear the ground so WS1–WS4 start from a clean, consistent base. Nothing here changes runtime behavior for consumers.
**Depends on:** nothing.
**Owns:** root `package.json`, `.gitignore`, `turbo.json`, `tsconfig.build.json`, `src/scripts/custom-elements-manifest.config.mjs`, `.github/workflows/`, `packages/react/` (removal), `packages/angular/` (removal), `PRDFRAMEWORKS.md` (relocation).
**Branch:** `feat/fw-0-foundations` off `develop`.

## Context

Read `README.md` sections 2.1–2.3 first. Two prior attempts left artifacts in the repo and on npm; this workstream reconciles them before anyone generates anything new.

## Tasks

### 0.1 Salvage from `enhancement/react-angular-implementation` (recommendation R3)

Cherry-pick, or re-apply by hand, only these:

1. `packages/nys-select/src/nys-option.ts`: guard the define call with `if (!customElements.get("nys-option"))`. Every other component already has this guard.
2. `PRDFRAMEWORKS.md` from the branch root → `.claude/plans/framework-support/prior-art/PRDFRAMEWORKS.md`. Add a one-paragraph header saying which of its decisions this plan keeps (D1, D2, D3-as-revised, D7, D9) and which it supersedes (D5, D8).
3. The `modulePath` idea (per-component imports). Don't cherry-pick the code; WS2 reimplements it without the `tagToPackageMap` table. Record it in the prior-art header.

Don't take: the Angular output, `packages/react/package.json`, the `files` change, the `turbo.json` change, `examples/react-app/package.json`, the polluted `custom-elements.json`, the `package-lock.json`.

### 0.2 Copy reference material from `feature/angular-support`

Into `.claude/plans/framework-support/prior-art/angular-support/` (read-only reference for WS4, not compiled):

- `packages/angular/src/lib/shared/nys-control-value-accessor.base.ts`
- `packages/angular/src/lib/shared/nys-event.types.ts`
- `packages/angular/src/lib/form/*.directive.ts`
- `packages/angular/integration-test/tests/smoke.spec.ts`
- `packages/angular/README.md`

Use `git show origin/feature/angular-support:<path>`. Don't check the branch out.

### 0.3 Remove committed generated output

- Delete `packages/react/**` from git. WS3 recreates `packages/react/` as a real workspace package with hand-written scaffolding and gitignored `src/generated/`.
- Until WS3 lands, keep `@nysds/components/react` working: `npm run cem` still runs `customElementReactWrapperPlugin` into `packages/react/` and the root `files`/`exports` entries stay. Add `packages/react/*.js`, `packages/react/*.d.ts` to `.gitignore` so the output stops being committed. This is the interim state; WS8 removes the plugin.
- Verify: `git ls-files packages/react | wc -l` is `0` after the commit; `npm run build:all && ls packages/react | wc -l` is `> 100`.

### 0.4 Harden `custom-elements-manifest.config.mjs`

Add to `exclude`:

```js
"**/node_modules/**",
"**/packages/react/**",
"**/packages/angular/**",
"**/packages/codegen/**",
"**/examples/**",
```

Verify: after `npm run cem`, `grep -c '"path": "packages/angular' custom-elements.json` is `0` and `grep -c node_modules custom-elements.json` is `0`. Also fix the stale copy: `dist/custom-elements.json` must match the root file after `npm run cem` (it's `cp`'d; confirm the `cem` script runs after `build:root`, or move the copy into `build:root`).

### 0.5 Workspace and build plumbing for the new packages

- Root `package.json` `workspaces`: add `"examples/*"`. Keep `"packages/*"`.
- `tsconfig.build.json`: add project references for `packages/codegen` and `packages/react` when they exist (WS2/WS3 add their own `tsconfig.json`; this task adds the reference entries with a `// added by WS2/WS3` note or leaves a documented TODO). `packages/angular` is built by ng-packagr, not `tsc -b`; exclude it explicitly.
- `turbo.json`: leave `outputs` as is (`["dist/**", ".tsbuildinfo"]`). Add `"custom-elements.json"` to the root build `inputs` for the framework packages so a manifest change invalidates their cache. Add a `generate` task with `dependsOn: ["^build"]`, `cache: false`.
- Root scripts: add
  - `"build:frameworks": "turbo run build --filter=@nysds/codegen --filter=@nysds/react --filter=@nysds/angular"`
  - Insert `npm run build:frameworks` into `build:all` after `npm run cem` (wrappers need the manifest) and before `build:mcp`.
- `.gitignore`: add `packages/react/src/generated/`, `packages/angular/src/generated/`, `packages/*/dist/` (confirm not already covered), `examples/*/dist/`, `examples/*/.angular/`, `examples/*/.next/`.

### 0.6 CI

Add `.github/workflows/frameworks.yaml` (runs on PRs to `develop` and `main` when `packages/**`, `examples/**`, or `src/scripts/**` change):

1. `npm i`, `npm run build:all`.
2. `npm run typecheck -w @nysds/react`, `npm run build -w @nysds/angular`.
3. Placeholder job matrix for WS5 (`examples/*` build + Playwright) marked `if: false` until WS5 flips it.
4. `npm pack --dry-run -w @nysds/react -w @nysds/angular` and fail if the file list contains `src/`, `demo/`, `integration-test/`, `.turbo/`, or `package-lock.json`. This guard exists because the 1.18.2 Angular publish shipped exactly those.

### 0.7 npm cleanup (user action)

Give the user this command; don't run it (needs npm auth, and it's outward-facing):

```bash
npm deprecate @nysds/angular@"1.18.2 || 1.18.2-alpha-1 || 1.18.2-alpha-2" "Broken publish: this version contains unbuilt source with no usable entry points. Use @nysds/angular 1.21.0 or later."
```

The versions are listed explicitly because a `<=1.18.2` range does not
match the `-alpha` prereleases — semver ranges exclude prerelease
versions unless the comparator itself carries a prerelease tag.

Confirm afterwards with `npm view @nysds/angular@<version> deprecated`
for each of the three versions. Still not run as of 2026-09-02.

### 0.8 Branch cleanup (user action)

- `feature/react-integration` (local): 0 commits ahead of `develop`. Delete.
- `enhancement/react-angular-implementation`: close with feedback after 0.1 is merged.
- `feature/angular-support`: leave until WS4 ships, then delete.

### 0.9 Survey Angular versions in use (user action, unblocks R2)

Ask the agency teams that reported Angular problems which Angular major they're on. Record the answer in `README.md` section 3.2 R2. If anyone is on 18 or 19, WS4's `ng-packagr` and peer range change before WS4 starts.

## Acceptance criteria

- [ ] `git ls-files packages/react packages/angular | wc -l` → `0`
- [ ] `npm run cem` produces a manifest with no `node_modules` or `packages/angular` paths
- [ ] `npm run build:all` succeeds on `develop` + this branch with `@nysds/components/react` still importable (interim)
- [ ] `frameworks.yaml` runs green with the WS5 matrix disabled
- [ ] `.claude/plans/framework-support/prior-art/` contains the PRD and the Angular reference files with provenance headers
- [ ] The three user actions (0.7, 0.8, 0.9) are listed in the PR description as checkboxes for the user

## Commands for the user to run

- `npm run build:all`
- `npm run test` (no component behavior changed; this is a regression check for the `nys-option` guard)

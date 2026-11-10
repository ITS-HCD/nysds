# WS8: Release and migration

**Goal:** Ship `@nysds/react` and `@nysds/angular` at `1.21.0` in lockstep with `@nysds/components`, without breaking `@nysds/components/react` consumers on day one, and without repeating the 1.18.2 Angular publish mistake.
**Depends on:** all other workstreams.
**Owns:** root `package.json` `release*` scripts, `src/scripts/publish-dry-run.js`, `src/scripts/create-release-zip.js`, `CHANGELOG.md`, `packages/react-alias/`, the `nysds-release` skill (ops-claude-plugins).
**Branch:** `feat/fw-8-release`.

## Status (2026-09-02, docs-only slice)

The docs deliverables are done; the script changes are not. Two new
documents in this directory carry the operational detail and supersede
the sections marked below:

- `release-checklist.md` — the runnable release checklist, including the
  exact `npm deprecate` command, the publish order, the tarball guard
  procedure, and the docs-site merge coordination.
- `migration-guide.md` — consumer-facing migration from
  `@nysds/components/react`, from the broken `@nysds/angular@1.18.2`,
  from `CUSTOM_ELEMENTS_SCHEMA` usage, and from the superseded branches.

Actuals versus this brief:

| Brief item | Actual |
|---|---|
| Target version 1.21.0 | Confirmed. npm has `@nysds/components@1.20.1`; the branch sits at 1.20.1. `@nysds/react` and `@nysds/codegen` are unpublished; `@nysds/angular` has only the three broken 1.18.2 versions. |
| `publish-order.mjs` + tarball guard | Not built. `release` still runs `npm publish --workspaces`; `publish-dry-run.js` loops `packages/*` but doesn't fail on bad tarball contents. Written into the checklist as script-change steps. |
| Angular publishes from `dist/` with a private source `package.json` | **Unresolved — reconcile before release.** As of this writing, `packages/angular/package.json` is not private, maps `exports` into `./dist/...`, and publishes from the package directory with `files: ["dist", "README.md"]`; the packaging was being actively reworked when this was written. The checklist describes both conventions. |
| `packages/react-alias/` warns and re-exports `@nysds/react` | Not built. The legacy wc-toolkit wrappers still regenerate (`customElementReactWrapperPlugin` and `customElementJsxPlugin` remain in the CEM config, and `patch-react-utils.js` still runs in `cem`), root `exports["./react"]` still points at them, and no deprecation warning exists. Decision needed; see checklist §1. |
| Root tarball | Root `files` includes all of `packages/react/`, which drags `src/` and `test/` into the `@nysds/components` tarball. Checklist §3 flags it. |
| `examples/*` skipped by `--workspaces` | All five example workspaces verified `private: true`; npm skips private packages. The checklist still says to confirm the skip in dry-run output. |
| `packages/mcp-server` | Publishes through `--workspaces` today (`@nysds/mcp-server@1.20.1` is on npm); it stays in the publish set. |
| `CHANGELOG.md` | Does not exist in this repo. Release notes go through the GitHub release and the site "What's new" post instead. |
| Deprecate `<=1.18.2` | Not yet run; user action. The range in this brief's "npm cleanup" section misses the alphas (semver ranges exclude prereleases); the checklist carries the corrected single command. |
| R2 Angular peer `>=20` | Still open, pending the agency survey (WS0 §0.9). `>=20.0.0` is the shipped default in `packages/angular` and the examples matrix (20, 21, 22 in CI). |
| SSR / hydration | Fixes were in flight on the branch at the time of writing (uncommitted work in `packages/angular` and `packages/codegen`). The checklist gates the release on the frameworks CI workflow being green. |

## Release script changes

Today: `npm publish --workspaces --access public && npm publish --access public`. This publishes every workspace's source folder, which is what shipped the broken Angular package.

Change to an explicit list, in dependency order, driven by a `src/scripts/publish-order.mjs` that reads workspaces and:

1. Publishes `packages/tokens`, `packages/styles`, `packages/internals`.
2. Publishes every `packages/nys-*`.
3. Publishes the root `@nysds/components`.
4. Publishes `packages/codegen`.
5. Publishes `packages/react` (from the package dir; `files` restricts to `dist/`).
6. Publishes `packages/angular/dist` (`npm publish` with `cwd` set to `dist/`; the source `package.json` is `private: true` and stays that way; `strip-private.mjs` is not needed because ng-packagr's `dist/package.json` is generated from `ng-package.json` + the fields we whitelist).
7. Skips `examples/*`, `packages/mcp-server` unless already published that way (check current practice), and anything `private: true`.

Before step 1, the script runs `npm pack --dry-run --json` for every package it will publish and fails if any tarball's file list contains `src/`, `demo/`, `integration-test/`, `.turbo/`, `node_modules/`, or `package-lock.json`, or if any framework package's `version` differs from the root version. `release:dry-run` prints the full list so the person releasing can eyeball it.

`release:alpha` publishes the same set with `--tag next`.

## Version sync

The `nysds-release` skill bumps all `packages/*/package.json` versions. Extend its checklist to include `packages/react`, `packages/angular` (source), `packages/codegen`, and to run `npm run cem` afterwards so `deps.mjs` rewrites the generated dependency blocks with the new version before the commit. Add a check to `publish-order.mjs` that every `@nysds/nys-*` dependency in the framework packages equals the root version.

## Deprecation path for `@nysds/components/react`

Release `1.21.0`: root `exports["./react"]` → `packages/react-alias/index.js` (WS3) which warns once and re-exports `@nysds/react`. Root `dependencies` gains `@nysds/react` at the same version. `customElementReactWrapperPlugin` and `customElementJsxPlugin` are removed from the CEM config; `packages/react/nysds-jsx.d.ts` consumers (Vue/Preact JSX types) get the same types from `@nysds/react`'s declarations or a documented `@nysds/codegen` JSX output if anyone was actually using it (check with the team; the Vue guide on the site referenced it).

Release `1.22.0`: remove the alias, the `./react` export, and `packages/react-alias`. Changelog and site note.

## npm cleanup

Superseded by `release-checklist.md` §0, which carries the corrected
single command. A plain `<=1.18.2` range does not match the `-alpha`
versions — semver ranges exclude prereleases unless the comparator
itself carries a prerelease tag — so the command lists all three
versions explicitly. Not yet run as of 2026-09-02 (`npm view` shows no
`deprecated` field); it needs npm auth, so the user runs it.

## Changelog and release notes

No root `CHANGELOG.md` exists in this repo, so these sections go into
the GitHub release notes and the site "What's new" post. `1.21.0`
sections:
- **New packages:** `@nysds/react`, `@nysds/angular`, `@nysds/codegen`, with install lines and links to the site pages.
- **Component changes (WS1):** per component, the added events, the detail-shape additions, the `nys-combobox` `nys-input` fix, the `nys-checkbox` focus/blur fix, `nys-fileinput` `detail.files` change (or `rawFiles` addition), `nys-fileRemove` → `nys-file-remove` (both fire until 2.0).
- **Deprecated:** `@nysds/components/react` (removed in 1.22.0), `nys-button.onClick` property, `nys-fileRemove`.
- **Docs:** framework tabs on every component page; new React and Angular pages.

## Rollout

1. `release:alpha` → `@nysds/react@1.21.0-alpha.1`, `@nysds/angular@1.21.0-alpha.1`, `@nysds/components@1.21.0-alpha.1` on `next`.
2. Pilot with one Angular team and one React team from the group that reported problems. Give them the site pages (built from the branch, deployed to a preview) and the example apps. Two-week window; collect issues in a GitHub milestone.
3. Fix, `alpha.2` if needed, then `1.21.0` on `latest`.
4. Announce: site "What's new" post, the CDO channel, and a direct note to teams on `@nysds/components/react`.

## Follow-ups filed, not blocking

- Angular `FormValueControl` adapter (Signal Forms native, Angular ≥ 22).
- `@nysds/vue` as a third codegen plugin.
- Component class-name normalization (PRD D9) with a regeneration pass.
- Lit SSR / declarative shadow DOM for Next.js and Angular SSR.
- Figma Code Connect mappings for React and Angular.
- Delete `feature/angular-support` and `enhancement/react-angular-implementation` once `1.21.0` ships.

## Acceptance criteria

- [ ] `npm run release:dry-run` prints the ordered publish list with file counts and passes the tarball guard
- [ ] `release:alpha` publishes the three packages on `next` and `npm view @nysds/angular@next` shows `exports` and `main`
- [ ] A fresh Angular 20 app and a fresh Vite React app install the alphas and run the forms example from the site
- [ ] `CHANGELOG.md` complete; site "What's new" entry drafted
- [ ] Pilot feedback captured in a milestone; blockers resolved before `latest`

## Commands for the user to run

- `npm run release:dry-run`
- `npm run release:alpha` (publishes; user runs it deliberately)

# Release checklist: 1.21.0 framework packages

**Status:** Draft, written 2026-09-02 against `enhancement/nysds-codegen`.
**Scope:** First release of `@nysds/react`, `@nysds/angular`, and `@nysds/codegen`, in lockstep with `@nysds/components@1.21.0`.
**Audience:** The person running the release (needs npm publish rights for the `@nysds` scope).

Items marked **(script change)** need a code change that this docs-only
pass doesn't make. Items marked **(reconcile)** depend on work that was
in flight when this checklist was written; verify the current state
before trusting the wording.

## Published state as of 2026-09-02

Verified against the npm registry:

| Package | On npm | Notes |
|---|---|---|
| `@nysds/components` | 1.20.1 | Current latest |
| `@nysds/mcp-server` | 1.20.1 | Publishes through `npm publish --workspaces` today |
| `@nysds/angular` | 1.18.2, 1.18.2-alpha-1, 1.18.2-alpha-2 | All three are broken source-folder publishes. Deprecate them. |
| `@nysds/react` | not published | New in this release |
| `@nysds/codegen` | not published | New in this release |

## 0. Deprecate the broken Angular publishes (do now, before anything else)

Run this command yourself; it needs npm auth:

```sh
npm deprecate @nysds/angular@"1.18.2 || 1.18.2-alpha-1 || 1.18.2-alpha-2" "Broken publish: this version contains unbuilt source with no usable entry points. Use @nysds/angular 1.21.0 or later."
```

The explicit `||` list matters. A plain `<=1.18.2` range does not match
the `-alpha` versions, because semver ranges exclude prerelease versions
unless the comparator itself carries a prerelease tag.

Confirm with:

```sh
npm view @nysds/angular@1.18.2 deprecated
npm view @nysds/angular@1.18.2-alpha-1 deprecated
npm view @nysds/angular@1.18.2-alpha-2 deprecated
```

## 1. Pre-flight

- [ ] Open decision **R2** resolved: Angular peer range stays `>=20.0.0`
      unless the agency survey (WS0 §0.9) turns up a team pinned to 18
      or 19. If the minimum drops, the build toolchain drops with it and
      `packages/angular` rebuilds before release.
- [ ] **(reconcile)** Angular packaging finalized. At the time of
      writing, `packages/angular/package.json` maps `main`, `types`, and
      every `exports` entry into `./dist/...` and publishes from the
      package directory with `"files": ["dist", "README.md"]`. The WS8
      brief instead planned an ng-packgr-style publish from `dist/`
      (source `package.json` private, `npm publish` run inside `dist/`).
      An agent was actively changing the Angular packaging when this
      checklist was written. Confirm which convention landed, then use
      the matching publish step in section 4 and the matching tarball
      assertion in section 3.
- [ ] SSR and hydration fixes that were in flight on the branch are
      merged, and `examples/next-app` and the zoneless Angular build
      pass in CI (`.github/workflows/frameworks.yaml`).
- [ ] `enhancement/nysds-codegen` merged to `develop`, `develop` green.
- [ ] Decide the `@nysds/components/react` deprecation surface. Today
      the legacy wc-toolkit wrappers are still generated
      (`customElementReactWrapperPlugin` and `customElementJsxPlugin`
      remain in `src/scripts/custom-elements-manifest.config.mjs`) and
      the root package still ships `packages/react/` with no deprecation
      warning. The WS3 brief planned a committed `packages/react-alias/`
      that warns once and re-exports `@nysds/react`; it was not built.
      Either ship the legacy wrappers one more minor with a console
      warning, or build the alias. **(script change)** Both options need
      a code change; shipping silently duplicates two React
      implementations with no signpost.

## 2. Version bump

- [ ] Bump every `packages/*/package.json`, the root `package.json`, and
      the examples' pinned `@nysds/*` versions to `1.21.0`. The
      `nysds-release` skill drives this; its checklist must now include
      `packages/codegen`, `packages/react`, and `packages/angular`
      (source `package.json`, and `dist/package.json` if the dist
      publish convention wins — ng-packagr regenerates that on build).
- [ ] Run `npm run cem` after the bump so `depsPlugin`
      (`packages/codegen/cem-plugins/deps.mjs`) rewrites the generated
      `@nysds/nys-*` dependency blocks in both framework packages at the
      new version.
- [ ] Grep-check: no `@nysds/*` dependency anywhere in
      `packages/react/package.json` or `packages/angular/package.json`
      differs from `1.21.0`.

## 3. Tarball guard (dry run)

- [ ] `npm run build:all` from a clean `git clean -dfx`-level state.
- [ ] `npm run release:dry-run`. The current
      `src/scripts/publish-dry-run.js` loops `npm publish --dry-run`
      over `packages/*` plus the root, so it now covers codegen, react,
      and angular for free — but it only prints; it doesn't fail on bad
      contents, and it doesn't cover a `dist/`-rooted Angular publish.
      **(script change)** The planned `publish-order.mjs` guard fails
      the run when any tarball contains `src/`, `demo/`,
      `integration-test/`, `.turbo/`, `node_modules/`, or
      `package-lock.json`, or when any version differs from the root
      version. Until it exists, eyeball the dry-run output for exactly
      these names. This guard is what prevents a 1.18.2 repeat.
- [ ] `@nysds/react` tarball: `dist/`, `README.md`, `package.json`,
      `LICENSE` only. The legacy top-level `Nys*.js` files in
      `packages/react/` must not appear (`files` excludes them; verify).
- [ ] `@nysds/angular` tarball **(reconcile)**: compiled output
      (`fesm2022/`, typings), `README.md`, `package.json` — no `src/`,
      no `ng-package.json`, no `tsconfig*`.
- [ ] Root `@nysds/components` tarball: root `files` currently includes
      all of `packages/react/`, which drags `src/`, `test/`, and config
      files into the tarball alongside the legacy wrappers. Narrow it to
      the legacy wrapper files (or to `packages/react-alias/` once that
      exists). **(script change)**

## 4. Publish order

Publish dependencies before dependents so no install window resolves a
wrapper whose `@nysds/nys-*` dependencies don't exist at the version:

1. `packages/tokens`, `packages/styles`, `packages/internals`
2. Every `packages/nys-*`
3. Root `@nysds/components`
4. `packages/codegen` — unblocks the docs-site merge (section 6)
5. `packages/react`
6. `packages/angular` — **(reconcile)** from the package directory if
   the current `files: ["dist"]` convention stands, or `npm publish`
   with the working directory set to `packages/angular/dist` if the
   ng-packagr dist-publish convention wins. In the dist-publish case the
   source `package.json` must be `private: true`, which also removes it
   from `--workspaces`; this step is then a distinct command the root
   script must add. **(script change)**
7. `packages/mcp-server` (current practice; it published as 1.20.1
   through `--workspaces`)

Notes on the current `release` script:

- `npm publish --workspaces` does not guarantee dependency order. Until
  `publish-order.mjs` exists **(script change)**, either accept the
  small out-of-order window (all packages land within minutes and
  versions are lockstep) or publish the seven groups manually with
  `npm publish -w <pkg>` in the order listed.
- `examples/*` are workspaces but all five carry `"private": true`
  (verified: angular-app, angular-ngmodule, next-app, react-vite,
  shared-tests). npm skips private packages under `--workspaces` with a
  warning, not an error. Confirm the skip appears in the dry-run output
  rather than trusting this checklist.
- `release:alpha` today rebuilds and publishes only the root package
  with `--tag next`. For the alpha rollout below it must cover the same
  set as `release`, with `--tag next` throughout. **(script change)**

## 5. Alpha rollout

- [ ] Publish the full set as `1.21.0-alpha.1` with `--tag next`.
- [ ] Smoke-test from the registry, not the workspace: fresh Vite React
      app and fresh Angular 20 app, install the alphas, run the forms
      example from the docs pages.
- [ ] `npm view @nysds/angular@next` shows real `main` and `exports`.
- [ ] Pilot: one React team and one Angular team from the group that
      reported the original forms problems. Two-week window; issues in a
      GitHub milestone. Blockers fixed in `alpha.2` before `latest`.

## 6. Docs-site coordination (`nysds-site`, branch `feat/fw-6-docs`)

The site branch depends on `@nysds/codegen@^1.20.0`, which doesn't exist
on npm yet, so the branch cannot merge before step 4 of section 4 runs.

After `@nysds/codegen@1.21.0` publishes:

- [ ] On `feat/fw-6-docs`, bump `@nysds/components` to `1.21.0`
      (`^1.20.0` on codegen already matches `1.21.0`; bump it too if you
      want the lockstep visible).
- [ ] `npm install`, build the site, spot-check the HTML / React /
      Angular tabs and both get-started pages.
- [ ] Merge and deploy.

## 7. Announce

- [ ] Release notes. No root `CHANGELOG.md` exists in this repo (the
      WS8 brief assumed one), so publish through the GitHub release and
      the site "What's new" post. Sections: new packages
      (`@nysds/react`, `@nysds/angular`, `@nysds/codegen`) with install
      lines; per-component WS1 event-contract changes; deprecations
      (`@nysds/components/react` removed in 1.22.0, `nys-fileRemove`,
      the three `@nysds/angular` 1.18.2 versions); docs (framework tabs,
      new get-started pages).
- [ ] CDO channel post, plus a direct note to teams known to import
      `@nysds/components/react` and to anyone who installed
      `@nysds/angular@1.18.2`.
- [ ] Point migrating teams at the migration guide
      (`migration-guide.md` in this directory; publish it to the site
      as part of the get-started pages or a "What's new" link).

## 8. After 1.21.0 ships

- [ ] Close and delete `feature/angular-support` and
      `enhancement/react-angular-implementation` (superseded).
- [ ] File the non-blocking follow-ups from the WS8 brief: Angular
      `FormValueControl` adapter, `@nysds/vue` plugin, class-name
      normalization (PRD D9), Lit SSR / declarative shadow DOM, Figma
      Code Connect for React and Angular.
- [ ] Schedule the 1.22.0 removals: the `./react` root export, the
      legacy wrapper generation (`customElementReactWrapperPlugin`,
      `customElementJsxPlugin`, and `src/scripts/patch-react-utils.js`,
      which still runs in the `cem` script today).

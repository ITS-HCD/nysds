# Workstream: CI Workflows

## Context

Both GitHub Actions workflows (`test-node-js.yaml` and `deploy-github-pages.yaml`) reference `actions/checkout@v6` and `actions/setup-node@v6`, which do not exist. Latest stable is `@v4`. This means **zero CI protection** — no PR validation, no Storybook deployment. Additionally, the test workflow lacks a `permissions` block (defaults to write-all) and both use `npm install`/`npm i` instead of deterministic `npm ci`.

## Files to Modify

| File | Change |
|------|--------|
| `.github/workflows/test-node-js.yaml` | Fix action versions, add permissions, use npm ci, add audit step |
| `.github/workflows/deploy-github-pages.yaml` | Fix action versions, use npm ci |

## Changes

### 1. Fix action version references (both files)

Replace all `@v6` references with `@v4`:
- `actions/checkout@v6` → `actions/checkout@v4`
- `actions/setup-node@v6` → `actions/setup-node@v4`

### 2. Add permissions block to test-node-js.yaml

Add at the workflow level (after `on:` block, before `jobs:`):

```yaml
permissions:
  contents: read
```

The deploy workflow already has explicit permissions (`contents: read`, `pages: write`, `id-token: write`).

### 3. Switch to npm ci (both files)

- `test-node-js.yaml`: Change `npm i` → `npm ci`
- `deploy-github-pages.yaml`: Change `install_command: npm install` → `install_command: npm ci`

### 4. Add npm audit step to test workflow

After the install step in `test-node-js.yaml`, add:
```yaml
- name: Security audit
  run: npm audit --audit-level=high
```

This gates PRs on high/critical vulnerabilities without blocking on moderate devDep issues.

## Public API Impact

None. CI-only changes.

## Test Strategy

- Push the branch and verify both workflows execute successfully on a PR to `develop`
- Confirm the test workflow runs: lint, build, test, audit
- Confirm the deploy workflow triggers on push to `develop` and publishes Storybook

## Breaking Change Classification

**None** — infrastructure only, no consumer-facing changes.

## Dependencies on Other Workstreams

None. This workstream is independent and should merge **first** — it restores CI validation for all subsequent PRs.

## Recommended Merge Order

**1st** (before all others)

## Resolved Decisions

- **Action pinning:** Use full commit SHAs (not tags) for supply chain hardening
- **Dependabot:** Yes, add `.github/dependabot.yml` in this same PR (keeps SHAs maintainable)
- **Node version:** Keep `24.x` — it's been LTS since October 2025, no reason to downgrade

## Additional Work (from decisions)

### 5. Pin actions to SHAs

Look up the current commit SHAs for:
- `actions/checkout@v4` → find the SHA for the latest v4 release
- `actions/setup-node@v4` → find the SHA for the latest v4 release
- `bitovi/github-actions-storybook-to-github-pages@v1.0.3` → find its SHA

Use format: `actions/checkout@<sha> # v4.2.2` (comment with version for readability)

### 6. Add Dependabot config

Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
```

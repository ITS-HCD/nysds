# @nysds/codegen

Reads the NYSDS custom elements manifest and derives every framework
artifact from it: component metadata, naming rules, the CEM plugins that
generate the React and Angular wrappers, and the transformer that turns an
HTML example into a JSX or Angular snippet.

The manifest is the single source of truth. This package contains no
per-component tables; if a generator needs a fact, that fact belongs in the
component's JSDoc and flows through the manifest.

## Layout

- `cem-plugins/` — plain JavaScript plugins for
  `@custom-elements-manifest/analyzer`. No build step, so the analyzer can
  run them before this package is built.
- `cem-plugins/lib/core.mjs` — the shared rules: naming, filters,
  `@formControl` parsing, package derivation, and component metadata.
  `core.d.mts` carries the types.
- `src/` — the TypeScript API. The `src/manifest/` modules re-export
  `core.mjs`; the import direction is always TypeScript to `.mjs`, never
  the other way, so no rule exists twice.
- `src/transform/` — the parse5-based snippet transformer.

## Public API

```ts
import {
  loadManifest,
  listComponents,
  transformExample,
} from "@nysds/codegen";

const manifest = loadManifest();
const components = listComponents(manifest);
const { code, imports, warnings } = transformExample({
  html: example,
  framework: "react",
  manifest,
});
```

`loadManifest()` without a path resolves the manifest that ships with
`@nysds/components`. `listComponents()` returns one `ComponentMeta` per
component: tag, class name, package name, subpath, public props, exposed
events with React and Angular names, slots, and the `formControl` block
when the manifest carries one.

## CEM plugins

```js
import {
  formControlPlugin,
  reactPlugin,
  angularPlugin,
  depsPlugin,
} from "@nysds/codegen/cem-plugins";
```

Register `formControlPlugin()` before the wrapper plugins. Paths are
resolved from the process working directory; run the analyzer from the
repository root.

| Plugin | What it does |
|---|---|
| `formControlPlugin` | Attaches `declaration.formControl` from the `@formControl` JSDoc tag. Fails the analyze run on a malformed tag. A form component without the tag throws with `strict: true` and logs one warning with `strict: false`. |
| `reactPlugin` | Writes the `@lit/react` wrapper per component to `packages/react/src/generated/`. |
| `angularPlugin` | Writes the typed Angular proxy component per component, the barrel, and `NysAngularModule` to `packages/angular/src/generated/`. |
| `depsPlugin` | Rewrites the generated `dependencies`, `peerDependencies["@nysds/components"]`, and `exports` blocks in both framework `package.json` files. Skips a target that doesn't exist yet. |

Both wrapper plugins clear their output directory first and skip any
component that has a hand-written file in the package's `src/overrides/`
directory. Both handle a manifest without typed event aliases by falling
back to `CustomEvent`.

## Transformer

`transformExample({ html, framework, manifest, formsMode })` turns the
canonical HTML example into a snippet. Only design-system elements are
transformed; native elements pass through. Unknown attributes pass through
with a warning. `<script>` and `<style>` blocks are dropped; a script that
references a design-system element marks the result `unsupported`, as does
an inline `onclick`-style handler. `formsMode` controls form bindings:
`"none"` (default) keeps snippets static, `"template"` emits `[(ngModel)]`
or the React controlled pattern, `"reactive"` emits `formControlName`.

## Review generated output

The wrapper sources in `packages/*/src/generated/` are gitignored, so a pull
request diff doesn't show what a change does to them. To see that, run the
review script from the repository root:

```sh
npm run review:codegen -- --pr 1951 --html
```

With `--html`, the script writes the report as a standalone web page in your
temp folder, outside the repo, and prints its path. The page loads
NYSDS styles and components from jsDelivr and stays readable offline. To save
the page somewhere else, pass `--html-file <path>`. The page is the template
`src/scripts/review-codegen/report.html`, and it reads its contents from a
`review-data.js` written beside it, so keep the two files together. Without
`--html`, the report prints to the terminal.

The script exports the base and head commits to a temporary directory, runs
`cem analyze` in each, and compares the results. Your checkout and
`.gitignore` stay as they are. For every output that changed, the report
shows:

- The diff of the generated file. When the same edit repeats across every
  wrapper, the report shows it once and lists the other files.
- What produced it: the plugin and component source, or the file in
  `src/overrides/` that replaces the generated one.
- A verdict:
  - `expected`: the PR changed that component's source, its override, or
    the file itself.
  - `generator`: only a codegen plugin, the CEM config, or the lockfile
    changed.
  - `check`: nothing in the PR explains the change.

The report also lists API changes from each commit's regenerated manifest,
such as an added or removed prop, and components whose source changed with
no change to the generated output.

Other ways to pick what to compare:

```sh
npm run review:codegen -- --base origin/develop --head my-branch
npm run review:codegen -- --working-tree    # include uncommitted changes
npm run review:codegen -- --pr 1951 --component nys-avatar --framework react
npm run review:codegen -- --help
```

By default, the script reuses this checkout's `node_modules` and points
workspace packages at each commit's own copies, so each commit runs its own
generator. When a commit's lockfile differs from yours, the report says so.
For an exact install, pass `--install` to run `npm ci` in each snapshot. To
keep the snapshots for a closer look, pass `--keep`.

The script runs the codegen config and plugins from both commits. Run it
only on code you'd be willing to check out and build.

## Test

```sh
npm test -w @nysds/codegen
```

Golden files under `test/fixtures/examples/` pin every transformer rule.
`test/fixtures/site-corpus/` holds preview blocks copied from the docs
site. Set `NYSDS_SITE_DIR` to a checkout of the docs site to also sweep
every live example.

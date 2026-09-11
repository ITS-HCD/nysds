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

## Test

```sh
npm test -w @nysds/codegen
```

Golden files under `test/fixtures/examples/` pin every transformer rule.
`test/fixtures/site-corpus/` holds preview blocks copied from the docs
site. Set `NYSDS_SITE_DIR` to a checkout of the docs site to also sweep
every live example.

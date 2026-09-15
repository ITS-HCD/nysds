# @nysds/nys-unavbundle

The New York State universal navigation — `<nys-unavheader>` and `<nys-unavfooter>` —
as a single self-contained script.

Add one `<script>` and the two custom elements work. There is nothing else to
install, no stylesheet to link, and no icon directory to host.

```html
<script src="https://unpkg.com/@nysds/nys-unavbundle"></script>

<nys-unavheader></nys-unavheader>
<!-- your page -->
<nys-unavfooter></nys-unavfooter>
```

## What's inside

Everything the two elements reach at runtime is compiled into the one file:

- Lit 3 and the shared `@nysds/internals` base classes
- `nys-button`, `nys-textinput`, `nys-alert`, `nys-icon`, `nys-label`,
  `nys-errormessage`, `nys-tooltip` — the components the header composes
- DOMPurify, which `nys-icon` uses to sanitize SVG
- The `@nysds/tokens` CSS variables, injected on load (see below)
- 26 of the icon library's 82 icons — the set the nav can actually render

## Installing

### CDN

```html
<script src="https://unpkg.com/@nysds/nys-unavbundle"></script>
```

Pin a version for production:

```html
<script src="https://unpkg.com/@nysds/nys-unavbundle@1.21.0/dist/nys-unavbundle.js"></script>
```

Self-hosting works the same way — copy `dist/nys-unavbundle.js` and point a
`<script src>` at it.

### npm

```bash
npm install @nysds/nys-unavbundle
```

```js
import "@nysds/nys-unavbundle";
```

The import is for its side effects: it registers both elements and injects the
tokens. There is no setup call to make.

## Design tokens

The component styles read `--nys-*` custom properties, so the bundle injects the
NYSDS token stylesheet as the **first** `<style>` in `<head>` when it loads.
Being first is deliberate — a page that defines its own `--nys-*` values, or that
already loads `@nysds/styles`, wins on source order rather than fighting the
bundle for them.

To take over the timing, set a flag before the script runs and call the export
yourself:

```html
<script>
  window.NYS_UNAV_SKIP_TOKENS = true;
</script>
<script src="https://unpkg.com/@nysds/nys-unavbundle"></script>
<script>
  NYSUnav.injectTokens();
</script>
```

A page already loading `@nysds/styles` can set the flag and skip injection
entirely.

## Using it alongside the full design system

Every element in the bundle registers itself behind a
`customElements.get()` check, so whichever script loads **first** wins. If your
page already loads the full NYSDS, load it before this bundle and its
definitions — including the complete icon library — stay in place.

Loading this bundle first on a page that also uses NYSDS components has one
consequence worth knowing: `nys-icon` will be the pruned build, so a
`<nys-button icon="download">` elsewhere on that page renders no icon. Either
load the full library first, or use `@nysds/components` rather than this bundle
on pages that need more than the nav.

## Icon pruning

`nys-icon` ships 82 icons and lazy-loads them as one map. A drop-in script can't
lazy-load anything, so the map would land in the bundle whole — about 139 KB of
source for a nav that uses a couple of dozen icons.

At build time, `scripts/icon-allowlist.js` walks the sources that end up in the
bundle, collects every string literal that names a real icon, and keeps only
those. The scan is deliberately loose — it matches any quoted lowercase
identifier and intersects with the library's own keys — because over-matching
costs a few hundred bytes while under-matching renders a blank square.

Two sets of names can't be seen statically and are listed explicitly in
`RUNTIME_ICONS`:

- the values of `FEED_ICONS` in `nys-unavheader`, which the statewide alert feed
  selects by name at runtime
- the per-type fallback icons `nys-alert` uses when the feed sends none

To see what the current scan keeps and drops:

```bash
npm run icons -w @nysds/nys-unavbundle
```

If you add an icon to the header or footer, the scan picks it up on the next
build. If you add one that is chosen at runtime, add it to `RUNTIME_ICONS`.

## Building

```bash
npm run build -w @nysds/nys-unavbundle
```

Unlike the per-component packages, this one resolves `@nysds/*` to TypeScript
**source** rather than each package's `dist/`. That is what lets the icon map be
intercepted — by the time a package is built, the dynamic `import()` inside
`icon-library-registry` has already been resolved into a chunk. It also means
the package is transpiled by esbuild with no `tsc --emitDeclarationOnly` pass, so
`types/index.d.ts` is hand-maintained.

There is a demo page at `demo/index.html` that loads the built file and nothing
else — if the nav renders there, the bundle is genuinely self-contained.

## License

MIT

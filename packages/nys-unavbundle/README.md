# @nysds/nys-unavbundle

The New York State universal navigation — `<nys-unavheader>` and `<nys-unavfooter>` —
as a single self-contained script.

Add one `<script>` and the two custom elements work. There is nothing else to
install, no stylesheet to link, and no icon directory to host.

```html
<script src="../nys-unavbundle.js"></script>

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

copy `dist/nys-unavbundle.js` and point a `<script src>` at it.

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

The component styles read `--nys-*` custom properties, so the bundle injects the NYSDS token stylesheet as the **first** `<style>` in `<head>` when it loads.
Being first is deliberate — a page that defines its own `--nys-*` values, or that already loads `@nysds/styles`, wins on source order rather than fighting the bundle for them.

## Using it instead of the full design system

Every element in the bundle registers itself behind a
`customElements.get()` check, so whichever script loads **first** wins.
**If your page already loads the full NYSDS, YOU DO NOT NEED THIS BUNDLE**

## License

MIT

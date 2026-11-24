# NYSDS Icons Guide

## Use the NYSDS icon set first

`<nys-icon>` renders icons from its `"default"` library: the curated NYSDS icon set that ships inside `@nysds/components`. No setup, no network request per icon. Pick a name from the list at the end of this guide.

```html
<nys-icon name="check_circle"></nys-icon>
<nys-icon name="upload_file" ariaLabel="Upload file"></nys-icon>
```

Components with icon attributes (`nys-button`'s `prefixIcon`, `suffixIcon` and `icon`, `nys-alert`'s `icon`, `nys-badge`, `nys-dropdownmenuitem`, `nys-iconlistitem`, `nys-avatar`) render a `<nys-icon>` from the same default library, so they take the same names.

The default set is drawn and curated by the NYSDS team. A name that isn't in it renders nothing, even if it exists in Material Symbols or another library. Don't guess names; use the list below, or register another library as described next.

## Managing your icon `library`

`<nys-icon>` can load icons from any registered library, served locally or from a CDN. Register a library once, at startup, with `registerIconLibrary(name, { resolver, mutator })`:

- `resolver(name)` returns the icon's SVG URL (or `{ type: "svg", content }` for inline SVG). Return `undefined` when the library has no such icon.
- `mutator(svg)` (optional) adjusts the parsed `<svg>` element, for example to make it inherit the text color.

### Register an additional library

In a bundled app (React, Angular, Vue, or any ES module build), import `registerIconLibrary` from `@nysds/components`:

```js
import { registerIconLibrary } from "@nysds/components";

// Font Awesome
registerIconLibrary("font-awesome", {
  resolver: (name) =>
    `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/${name}.svg`,
  mutator: (svg) => {
    svg.setAttribute("fill", "currentColor");
  },
});
```

With the UMD bundle (`<script src="nysds.js">`), the function is on the `NYSDS` global:

```html
<script src="nysds.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    NYSDS.registerIconLibrary("font-awesome", {
      resolver: (name) =>
        `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/${name}.svg`,
      mutator: (svg) => svg.setAttribute("fill", "currentColor"),
    });
  });
</script>
```

### Use the `library` attribute

Once a library is registered, set `library` on `<nys-icon>` to pull an icon from it. Icons without `library` keep using the NYSDS default set.

```html
<!-- From the registered Font Awesome library -->
<nys-icon name="house" library="font-awesome"></nys-icon>

<!-- From the NYSDS default set (no library attribute needed) -->
<nys-icon name="upload_file"></nys-icon>
```

Icon attributes on other components (`prefixIcon`, `icon`, etc.) always use the default library. For an icon from another library there, slot a `<nys-icon library="...">` in instead, where the component has an icon slot (for example `nys-button`'s `prefix-icon`, `suffix-icon` and `circle-icon` slots):

```html
<nys-button label="Home">
  <nys-icon slot="prefix-icon" name="house" library="font-awesome"></nys-icon>
</nys-button>
```

### Override the `"default"` library

To serve your own icon set as the default (for example, self-hosted SVGs), register a library named `"default"`. Every `<nys-icon>` without `library`, and every component icon attribute, then resolves from it:

```js
NYSDS.registerIconLibrary("default", {
  resolver: (name) => `/assets/icons/${name}.svg`,
});
```

Overriding the default replaces the NYSDS set for the whole page, so names from the list below only render if your library has them too. Prefer registering a separately named library unless you mean to replace the set.

## Accessibility

- An icon without `ariaLabel` is decorative: it's hidden from screen readers (`aria-hidden="true"`).
- Set `ariaLabel` when the icon conveys meaning on its own.
- Pair icons with a visible text label; few icons are understood alone. For an icon-only action, use `<nys-button circle icon="..." label="...">` (the label becomes the accessible name), not a bare `<nys-icon>`.

Full documentation: https://designsystem.ny.gov/components/icon/#managing-your-icon-library

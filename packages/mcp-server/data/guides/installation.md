# NYSDS Installation Guide

## 1. Install the packages

```bash
npm install @nysds/components @nysds/styles
```

## 2. Load the styles

NYSDS components need the NYSDS CSS variables to render correctly. `@nysds/styles` has two installs. Pick one:

| | Default install | Full install |
|---|---|---|
| Import | `@nysds/styles` | `@nysds/styles/full` |
| File | `nysds.min.css` | `nysds-full.min.css` |
| CSS variables (component styling, agency themes) | Yes | Yes |
| CSS reset | No | Yes |
| Typography styles (`nys-font-*`) | No | Yes |
| Utility classes (grid, flex, spacing, display, and more) | No | Yes |

### Full install: new projects

Includes everything: CSS variables, a CSS reset, typography, and utility classes. Use it for a new project, and whenever you use the classes from `get_utility_classes` or the page-structure templates.

```css
@import '@nysds/styles/full';
```

### Default install: existing projects

Includes only the CSS variables that style NYSDS components. It adds no reset, no typography, and no utility classes, so `nys-grid-*`, `nys-margin-*`, and the other utility classes do nothing with it. Use it when your project already has its own reset, typography, and layout.

```css
@import '@nysds/styles';
```

Without a bundler, link the file from the package's `dist/` folder, for example `node_modules/@nysds/styles/dist/nysds-full.min.css`.

For the typography-only add-on and more detail, call `get_guide` with `topic: "styles"`.

## 3. Import and use components

Import components individually:

```javascript
import '@nysds/nys-button';
import '@nysds/nys-alert';
```

Or import all components:

```javascript
import '@nysds/components';
```

Then use them in HTML:

```html
<nys-button label="Click me" variant="filled"></nys-button>
<nys-alert type="info">This is an informational message.</nys-alert>
```

## Framework Integration

For framework-specific setup, call the `get_guide` tool with `topic: "installation"` and a `framework` (angular, react, vue, dotnet, drupal, or vanilla).

React, Vue, and Angular are first-class packages, not wrapper snippets:
`@nysds/react` (`npm install @nysds/react`), `@nysds/vue`
(`npm install @nysds/vue`), and `@nysds/angular`
(`npm install @nysds/angular @nysds/components`) generate typed
components, props, and events directly from this design system's
manifest. See the `nysds://frameworks` resource for their current
published versions, `nysds://frameworks/react`, `nysds://frameworks/vue`, and
`nysds://frameworks/angular` for their full guides, and pass
`framework: "react"`, `"angular"`, or `"vue"` to `get_component` for
per-component import lines and framework-specific usage notes.

## Next steps

Use the `find_tokens` tool to explore available design tokens, or `get_utility_classes` for layout and spacing utilities.

## Resources

- Documentation: https://designsystem.ny.gov/
- GitHub: https://github.com/ITS-HCD/nysds

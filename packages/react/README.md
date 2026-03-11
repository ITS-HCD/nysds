# `@nysds/components/react` — Auto-generated React Wrappers

This folder is **fully auto-generated** — do not edit files inside it directly.
Files are regenerated every time `npm run cem` runs, which is called automatically by `npm run build:all`.

---

## How it works

```
npm run cem
  └─► cem analyze --config custom-elements-manifest.config.mjs
        └─► customElementReactWrapperPlugin  (custom-element-react-wrappers)
              └─► packages/react/
                    ├── index.js        ← barrel, one export per component
                    ├── index.d.ts      ← TypeScript types
                    ├── react-utils.js  ← internal hooks used by wrappers, do not use directly
                    ├── NysButton.js    ← one file per component
                    └── … etc.
```

The plugin is configured in `custom-elements-manifest.config.mjs` at the repo root.
The `./react` subpath export is declared in the root `package.json`, pointing at this folder.

---

## Usage

```tsx
import { NysButton, NysTextinput } from "@nysds/components/react";

function MyForm() {
  return (
    <>
      <NysTextinput
        label="First name"
        onNysInput={(e) => console.log(e.detail)}
      />
      <NysButton
        label="Submit"
        variant="filled"
        onNysClick={() => console.log("clicked!")}
      />
    </>
  );
}
```

All props are typed. Custom events map to `on<EventName>` React callbacks.

---

## Event name convention

| DOM event        | React prop       |
|------------------|------------------|
| `nys-click`      | `onNysClick`     |
| `nys-change`     | `onNysChange`    |
| `nys-input`      | `onNysInput`     |
| `nys-focus`      | `onNysFocus`     |
| `nys-blur`       | `onNysBlur`      |
| `nys-open`       | `onNysOpen`      |
| `nys-close`      | `onNysClose`     |
| `nys-step-click` | `onNysStepClick` |
| *(any new event)*| *(auto-added)*   |

---

## Adding a new component

Nothing to do. Once a new Lit component is picked up by `cem analyze`, its wrapper is generated on the next `npm run cem` / `npm run build:all`.

---

## Why not React 19 native web component support?

React 19 improves web component interop but doesn't bridge custom events to `on*` callbacks, and provides no TypeScript prop types from the element class. These wrappers handle both and keep the same developer experience as any standard React component library.

---

## Repo layout

```
custom-elements-manifest.config.mjs  ← plugin configured here
package.json                         ← "./react" subpath export declared here
packages/
  react/                             ← auto-generated, do not edit
    index.js
    index.d.ts
    react-utils.js
    NysButton.js  … etc.
```
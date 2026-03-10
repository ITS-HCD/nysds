# `@nysds/react` — Auto-generated React Wrappers

This package is **fully auto-generated** — do not edit files inside it directly.
It is re-created every time `npm run build:all` which in turn calls `npm run cem` as part of the normal build pipeline.

Consumers import from `@nysds/react` and never need to touch `@lit/react` or
call `createComponent` themselves.

---

## How it works

```
npm run cem
  └─► cem analyze --config custom-elements-manifest.config.mjs
        └─► reactWrapper() plugin  (custom-element-react-wrappers)
              └─► packages/react/
                    ├── index.js        ← barrel, one export per component
                    ├── index.d.ts      ← TypeScript types
                    └── NysButton.js    ← one file per component
                        NysTextInput.js
                        … etc.
```

The `reactWrapper()` plugin is declared in `custom-elements-manifest.config.mjs`.
Running `npm run cem` (which is already called by `npm run build:all`) regenerates
everything automatically. **No separate script, no manual step.**

---

## Usage (consumer side)

```tsx
import { NysButton, NysTextinput } from "@nysds/react";

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

All props are typed. Custom events map to `on<EventName>` callbacks with the same
naming convention as the previous manual wrappers — migrating is a find-and-replace.

---

## Event name convention

| DOM event        | React prop        |
|------------------|-------------------|
| `nys-click`      | `onNysClick`      |
| `nys-change`     | `onNysChange`     |
| `nys-input`      | `onNysInput`      |
| `nys-focus`      | `onNysFocus`      |
| `nys-blur`       | `onNysBlur`       |
| `nys-open`       | `onNysOpen`       |
| `nys-close`      | `onNysClose`      |
| `nys-step-click` | `onNysStepClick`  |
| *(any new event)*| *(auto-added)*    |

---

## Adding a new component

Nothing to do. Once your Lit component is picked up by `cem analyze`, its
wrapper will be generated on the next `npm run cem` / `npm run build:all`.

---

## Why not React 19 native web component support?

React 19 improves web component interop but still doesn't bridge custom events
to `on*` callbacks, and provides no TypeScript prop types derived from the element
class. These wrappers remain the correct ergonomic solution and doesn't take away from how developers normally use components in React.

---

## Repo layout

```
custom-elements-manifest.config.mjs  ← reactWrapper() plugin configured here
packages/
  react/                             ← this package (auto-generated, do not edit)
    package.json
    index.js
    index.d.ts
    NysButton.js  …etc.
```
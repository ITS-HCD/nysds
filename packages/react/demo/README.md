# NYSDS React kitchen-sink demo

A Vite + React 19 app that renders every NYSDS component through the
generated `@nysds/react` wrappers, resolved via the npm workspace to the
**local** `packages/*/dist` builds.

```bash
# from the repo root
npm install
npm run build:packages          # builds tokens, styles, and every nys-* package
npm run dev -w @nysds/react-demo   # serves on http://localhost:5173
```

Highlights:

- Controlled components: `NysTextinput`, `NysSelect`, `NysToggle`, and the
  radio group round-trip through React state via their `onNys*` event props.
- `NysModal` open/close is driven by state through the `open` prop and the
  `onNysClose` event.
- Events keep their `CustomEvent` payloads — read `event.detail` or
  `event.target`.

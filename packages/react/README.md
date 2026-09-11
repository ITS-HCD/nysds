# @nysds/react

React components for the New York State Design System (NYSDS). Every
component wraps the matching NYSDS web component with
[`@lit/react`](https://github.com/lit/lit/tree/main/packages/react), and
every wrapper is generated from the design system's
`custom-elements.json` — props, events, and types stay in sync with the
web components without hand maintenance.

Works with React 18 and React 19, including Next.js App Router.

## Install

```sh
npm install @nysds/react
```

`react` and `react-dom` (18 or 19) are peer dependencies. The matching
`@nysds/nys-*` component packages install automatically.

## Load styles

Import the design system stylesheet once, at your app's entry point:

```tsx
import "@nysds/styles";
```

Without it, components render unstyled. `@nysds/styles` ships the
design tokens and global styles; component-level styles live in each
component's shadow DOM and need no extra setup.

## First component

```tsx
import { NysButton } from "@nysds/react";

export function Save() {
  return <NysButton label="Save" variant="primary" onNysClick={() => save()} />;
}
```

Importing a component registers its custom element as a side effect.
You can also import from a subpath to keep the dependency graph narrow:

```tsx
import { NysTextinput } from "@nysds/react/textinput";
```

## Props, events, refs

**Props** are typed from the underlying element class and set as DOM
properties, not attributes. Use the camelCase property names
(`showError`, `errorMessage`), not the kebab-case attribute names.

**Events** keep their full NYSDS names, mapped to `onNys*` props:
`nys-change` becomes `onNysChange`, `nys-input` becomes `onNysInput`.
The handler parameter is the typed event, so `e.detail` autocompletes:

```tsx
<NysTextinput
  label="First name"
  onNysInput={(e) => console.log(e.detail.value)}
/>
```

There is no synthetic `onChange`. React's `onChange` prop attaches a
native `change` listener, which NYSDS components don't dispatch — use
`onNysChange`.

**Refs** resolve to the element instance:

```tsx
const ref = React.useRef<NysTextinputElement>(null);
<NysTextinput ref={ref} label="Name" />;
// ref.current?.checkValidity()
```

## Forms

### Controlled

Bind `value` and update state from `onNysInput`:

```tsx
const [name, setName] = React.useState("");

<NysTextinput
  label="Name"
  value={name}
  onNysInput={(e) => setName(e.detail.value)}
/>;
```

The wrapper re-sets properties on every commit, so re-rendering with
the same value snaps the element back to your state.

### Uncontrolled with a native form

NYSDS form components are form-associated custom elements: they submit
with a plain `<form>` like native inputs.

```tsx
function ContactForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        console.log(data.get("email"));
      }}
    >
      <NysTextinput label="Email" name="email" type="email" />
      <NysButton type="submit" label="Send" />
    </form>
  );
}
```

### React Hook Form

Use `Controller` and wire the field through the event detail:

```tsx
<Controller
  name="firstName"
  control={control}
  render={({ field }) => (
    <NysTextinput
      label="First name"
      value={field.value}
      onNysInput={(e) => field.onChange(e.detail.value)}
      onNysBlur={field.onBlur}
    />
  )}
/>
```

The `useNysField` helper collapses that to a prop bag. Pass the kind of
form control: `"value"` (default), `"checked"`, or `"files"`.

```tsx
<Controller
  name="subscribed"
  control={control}
  render={({ field }) => (
    <NysCheckbox label="Subscribe" {...useNysField(field, "checked")} />
  )}
/>
```

To surface validation errors through the component's own error slot:

```tsx
<NysTextinput
  label="Name"
  showError={!!errors.name}
  errorMessage={errors.name?.message}
  {...useNysField(field)}
/>
```

## SSR and Next.js

Every wrapper carries a `"use client"` directive, so the App Router
works with a normal import — no `"use client"` needed in your own files
unless they hold state:

```tsx
// app/page.tsx (server component)
import { Signup } from "./signup"; // a client component that renders NYSDS wrappers
```

- **App Router:** import wrappers from any client component. A server
  component can't render a wrapper directly; pass it through a client
  boundary like the `Signup` example.
- **Pages Router:** import and use anywhere.
- Components render client side. There is no declarative shadow DOM
  server rendering in this release.

## TypeScript tips

- `NysTextinputProps` is the full prop type:
  `React.ComponentProps<typeof NysTextinput>`.
- `NysTextinputElement` is the element class type — use it for refs and
  `e.target` casts.
- Event detail types come from the component packages:
  `import type { NysTextinputInputEvent } from "@nysds/nys-textinput"`.
- Unknown props are compile errors. If a prop is missing, check the
  component's documented API — the wrapper exposes every public
  property.

## Troubleshooting

**The element renders but has no styling or behavior.** The custom
element didn't upgrade. Import the component from `@nysds/react` (the
import registers it); check the browser console for load errors. If you
render raw `<nys-*>` tags instead of wrappers, import the
`@nysds/nys-*` package yourself.

**Everything renders unstyled.** Import `@nysds/styles` once at the app
entry (see Load styles).

**Hooks error or "Invalid hook call".** Usually a duplicate React.
Check `npm ls react` and dedupe; `@nysds/react` declares React as a
peer dependency, so a single copy must win.

**`onChange` never fires.** NYSDS components dispatch `nys-*` events.
Use `onNysChange` / `onNysInput`, not React's `onChange`.

**Rejecting user input from a handler.** If your handler sets state to
a value React considers unchanged, React skips the re-render and the
element keeps the user's text. Force a commit (state that always
changes) or write the property directly in the handler:

```tsx
onNysInput={(e) => {
  const next = sanitize(e.detail.value);
  setValue(next);
  (e.target as NysTextinputElement).value = next;
}}
```

## How this package is built

`src/generated/` is written by the `@nysds/codegen` CEM plugin on every
`npm run cem` and is not committed. Hand-written wrappers in
`src/overrides/` replace a generated file by class name. See
`src/overrides/README.md`.

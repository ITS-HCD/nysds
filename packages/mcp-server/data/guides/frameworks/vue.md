<!--
  GENERATED FILE. Do not edit directly.
  Source: packages/vue/README.md
  Regenerate with: npm run sync:guides -w @nysds/mcp-server
-->
# @nysds/vue

Vue 3 components and types for the New York State Design System (NYSDS).
Every component renders the matching NYSDS web component, and every
wrapper is generated from the design system's `custom-elements.json` —
props, events, slots, and types stay in sync with the web components
without hand maintenance.

You get two ways to use the design system, and can mix them freely:

- **Wrapper components** (`<NysTextinput>`) — real Vue components with
  typed props, `@nys-*` events, `<template #slot>` slots, and `v-model`
  on form controls.
- **Raw `<nys-*>` tags** — the custom elements themselves, typed in
  templates and TSX.

Requires Vue 3.4 or later (tested on 3.4 and 3.5).

## Set up a new app

### 1. Create a project

Skip this if you already have a Vue 3 app. Otherwise, with Vite:

```sh
npm create vue@latest my-app   # choose TypeScript; Router if you want it
cd my-app
```

### 2. Install

```sh
npm install @nysds/vue @nysds/styles
```

`vue` is a peer dependency. The matching `@nysds/nys-*` component
packages install automatically. Pin the exact version in `package.json`
so the wrappers stay aligned with the components.

### 3. Load styles

Import the design system stylesheet once, at the top of your entry file:

```ts
// src/main.ts
import "@nysds/styles/full";
```

Vue's default TypeScript config rejects side-effect imports it can't
resolve, and a stylesheet isn't a module. If `npm run build` fails with
`TS2882: Cannot find module or type declarations for side-effect import of
'@nysds/styles/full'`, declare the stylesheets once in `env.d.ts`:

```ts
// env.d.ts
declare module "@nysds/styles/*";
```

Without it, components render unstyled. `@nysds/styles` ships the design
tokens and global styles; component-level styles live in each component's
shadow DOM and need no extra setup.

Optional agency theme: `<html data-theme="health">`. Themes: `admin`,
`business`, `environment`, `health`, `local`, `safety`, `transportation`.
Fonts aren't bundled. Load them the way your agency normally does.

### 4. Use a component

```vue
<script setup lang="ts">
import { NysAlert, NysButton } from "@nysds/vue";

const start = () => console.log("started");
</script>

<template>
  <NysAlert type="info" heading="Welcome" />
  <NysButton label="Start" @nys-click="start" />
</template>
```

Importing a wrapper registers its custom element as a side effect — no
`app.use()` call or global registration. Run `npm run dev`; you should see
a styled alert and button.

That's the whole setup. No compiler options are needed for wrapper
components. If you'd rather write raw `<nys-*>` tags, see
[Raw tags](#raw-tags).

## Props, events, slots, and refs

**Props** are typed from the underlying element class and set as DOM
properties. Use camelCase or kebab-case in templates, whichever you
prefer (`appName` and `app-name` are the same prop). Bind numbers and
booleans with `:` so they keep their type:

```vue
<NysPagination :total-pages="5" :current-page="1" />
<NysTextinput label="Name" required :disabled="locked" />
```

A prop you don't pass is left alone, so the element keeps its own
default.

**Events** keep their full NYSDS names. Listen with `@nys-change`,
`@nys-input`, and so on. The handler parameter is the typed event, so
`e.detail` autocompletes:

```vue
<NysTextinput
  label="First name"
  @nys-input="(e) => console.log(e.detail.value)"
/>
```

Use the `nys-*` events rather than native `@input` and `@change`: they
are NYSDS's public event contract, they carry typed details, and they cover
cases native events don't (a combobox selection, a date picked from the
calendar).

**Slots** work with `<template #name>`. The default slot renders as direct
children:

```vue
<NysTextinput label="Email">
  <template #description>We'll never share it.</template>
</NysTextinput>

<NysTooltip text="Tooltip text">
  <NysButton label="Hover me" />
</NysTooltip>
```

Named slot content is wrapped in a `<span slot="…" style="display:
contents">` so any content (text, components, fragments) can fill it. You
can also put a plain `slot="name"` attribute on your own child element.

**Refs** on a wrapper resolve to the Vue component instance. The element
itself is `$el`, typed as the element class:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { NysTextinput } from "@nysds/vue";

const name = ref<InstanceType<typeof NysTextinput> | null>(null);
const check = () => name.value?.$el.checkValidity();
</script>

<template>
  <NysTextinput ref="name" label="Name" />
</template>
```

## Forms

### `v-model`

Every form control supports `v-model`. It binds the property the
component's form contract defines:

| Component | `v-model` value |
| --- | --- |
| `NysTextinput`, `NysTextarea`, `NysSelect`, `NysCombobox`, `NysDatepicker`, `NysRadiogroup` | `string` |
| `NysCheckboxgroup` | `string[]` |
| `NysCheckbox`, `NysToggle` | `boolean` |

```vue
<script setup lang="ts">
import { reactive } from "vue";
import {
  NysCheckbox,
  NysCheckboxgroup,
  NysRadiobutton,
  NysRadiogroup,
  NysTextinput,
} from "@nysds/vue";

const model = reactive({
  firstName: "",
  agree: false,
  languages: [] as string[],
  contact: "",
});
</script>

<template>
  <NysTextinput v-model="model.firstName" label="First name" required />
  <NysCheckbox v-model="model.agree" label="I agree to the terms" />

  <NysCheckboxgroup v-model="model.languages" label="Languages">
    <NysCheckbox label="English" value="en" />
    <NysCheckbox label="Spanish" value="es" />
  </NysCheckboxgroup>

  <NysRadiogroup v-model="model.contact" label="Preferred contact" name="contact">
    <NysRadiobutton label="Email" name="contact" value="email" />
    <NysRadiobutton label="Phone" name="contact" value="phone" />
  </NysRadiogroup>
</template>
```

- Bind checkbox and radio groups on `NysCheckboxgroup` and
  `NysRadiogroup`, not on each child.
- The model updates on the component's `nys-input` and `nys-change`
  events. Add `.lazy` (`v-model.lazy`) to update on `nys-change` alone, as
  on a native input.
- **File input** has no `v-model`. Listen for the change event and read
  the files from its detail:

  ```vue
  <NysFileinput
    label="Resume"
    @nys-change="(e) => (model.resume = e.detail.files[0]?.name ?? '')"
  />
  ```

### Submit and validate with a native form

NYSDS form components are form-associated custom elements: they submit
with a plain `<form>` like native inputs, and `required`, `pattern`, and
the rest drive the component's own validation and error display.

```vue
<form @submit.prevent="onSubmit">
  <NysTextinput v-model="model.firstName" label="First name" required />
  <NysButton type="submit" label="Submit" />
</form>
```

`nys-button type="submit"` submits through `form.requestSubmit()`, so an
invalid form blocks `@submit` and the component shows its error.

To drive errors from your own validation library instead, set the
component's error props:

```vue
<NysTextinput
  v-model="model.firstName"
  label="First name"
  :show-error="!!errors.firstName"
  :error-message="errors.firstName"
/>
```

### Reset

Setting the model back to its initial values resets every control. The
file input has no bound value, so also call `reset()` on the form:

```ts
const form = ref<HTMLFormElement | null>(null);

function reset() {
  Object.assign(model, initialModel());
  form.value?.reset();
}
```

## Raw tags

If you prefer the custom elements directly, import the package once for
its side effects and types, then tell Vue's compiler that `nys-*` tags are
custom elements so it doesn't try to resolve them as components:

```ts
// vite.config.ts
import vue from "@vitejs/plugin-vue";

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: { isCustomElement: (tag) => tag.startsWith("nys-") },
      },
    }),
  ],
};
```

```vue
<script setup lang="ts">
import { reactive } from "vue";
import "@nysds/vue"; // registers every element and adds the tag types

const model = reactive({ firstName: "" });
</script>

<template>
  <nys-textinput
    label="First name"
    :value="model.firstName"
    @nys-input="(e) => (model.firstName = e.detail.value)"
  />
</template>
```

Raw tags are typed in `.vue` templates (checked by `vue-tsc`) and in TSX.
Bind properties with `:` and update your state from the `@nys-*`
listener.

**Raw tags have no working `v-model`.** Vue's built-in `v-model` listens for
native `input` events instead of the `nys-*` events that make up NYSDS's
contract, so it misses updates (a combobox selection, a calendar pick, a
checkbox). Use a wrapper component, or bind `:value` and `@nys-input`
yourself as above.

## TypeScript

- `NysTextinputProps` is the full prop type, including the `on*` event
  handlers and, for form controls, `modelValue`.
- `NysTextinputElement` is the element class type.
- `NysTextinputSlots` and `NysTextinputSlotName` describe the slots.
- Event detail types come from the component packages:
  `import type { NysTextinputInputEvent } from "@nysds/nys-textinput"`.
- Run `vue-tsc --noEmit` in your build to type-check templates. Unknown
  props on a wrapper are compile errors; slot names are checked in `.vue`
  files but not in TSX.

## SSR and Nuxt

The package is safe to import in Node, and a wrapper renders its bare
element on the server. Components upgrade and become interactive in the
browser; there is no declarative shadow DOM rendering in this release, and
hydration has not been verified. For SSR frameworks such as Nuxt, render
NYSDS components inside client-only boundaries (`<ClientOnly>`) until you
have tested hydration in your app.

## Troubleshooting

**The element renders but has no styling or behavior.** The custom
element didn't upgrade. Import the component from `@nysds/vue` (the import
registers it) and check the browser console for load errors. If you use
raw `<nys-*>` tags, add `import "@nysds/vue"` yourself.

**Everything renders unstyled.** Import `@nysds/styles/full` once at your
entry file.

**`Failed to resolve component: nys-…`.** You used a raw tag without the
`isCustomElement` compiler option. Add it (see [Raw tags](#raw-tags)) or
use the wrapper component instead.

**`v-model` on a raw `<nys-*>` tag doesn't update.** See
[Raw tags](#raw-tags): use a wrapper, or bind `:value` and `@nys-input`.

**A prop change doesn't reach the element.** Bind numbers and booleans
with `:` (`:total-pages="5"`), not as plain attributes, so Vue passes the
typed value.

**Slot content has an extra wrapper.** Named slot content sits inside a
`display: contents` span. To avoid it, put a `slot="name"` attribute on
your own child element instead of using `<template #name>`.

**`app.use(router)` or the `<nys-*>` types break with two Vue versions.**
Two copies of Vue in `node_modules` give TypeScript two sets of types. Run
`npm ls vue` and dedupe. In a monorepo where you pin a different Vue in one
workspace, map `vue` in that app's `tsconfig.json`:

```json
{ "compilerOptions": { "baseUrl": ".", "paths": { "vue": ["./node_modules/vue"] } } }
```

## How this package is built

`src/generated/` is written by the `@nysds/codegen` CEM plugin on every
`npm run cem` and is not committed. The one hand-written file is
`src/runtime.ts`, which builds each wrapper from the generated metadata.

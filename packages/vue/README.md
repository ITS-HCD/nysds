# @nysds/vue

Vue 3 components and types for the NYSDS web components. Every file under
`src/generated/` is produced from `custom-elements.json` by the `vuePlugin` in
`@nysds/codegen` when you run `npm run cem`. Only `src/runtime.ts` is
hand-written.

## Two ways to use it

### 1. Wrapper components (`v-model` and slots)

```vue
<script setup lang="ts">
import { ref } from "vue";
import { NysTextinput, NysCheckbox, NysButton } from "@nysds/vue";

const email = ref("");
const agreed = ref(false);
</script>

<template>
  <NysTextinput v-model="email" label="Email" @nys-blur="validate">
    <template #description>We'll only use this to reply.</template>
  </NysTextinput>

  <NysCheckbox v-model="agreed" label="I agree" />

  <NysButton label="Save">
    <template #prefix-icon><MyIcon /></template>
  </NysButton>
</template>
```

- **`v-model`** is available on every form control and follows the
  component's `@formControl` contract: `value` for text inputs, selects and
  groups, `checked` for checkbox / radio / toggle, `files` for file input.
  It updates per keystroke where the component has an input event; `.lazy`
  switches to the change event, as on a native input.
- **Slots** use `<template #name>`. Named slots render inside a
  `<span slot="name" style="display: contents">`; the default slot renders as
  direct children.
- Props, and `@nys-*` listeners, work as on the element.
- Type-check `.vue` files with `vue-tsc` to get slot names checked. Slot names
  are not enforced in TSX.

### 2. Raw `<nys-*>` tags (types only)

If you'd rather use the elements directly, importing `@nysds/vue` also types
them in templates (`GlobalComponents`) and in TSX (`JSX.IntrinsicElements`).
Raw tags have no `v-model` — Vue's built-in `v-model` listens for native
`input` events, which NYSDS components don't dispatch. Use a wrapper, or bind
`:value` and `@nys-input` yourself.

Tell Vue's compiler these are custom elements:

```ts
// vite.config.ts
vue({
  template: {
    compilerOptions: { isCustomElement: (tag) => tag.startsWith("nys-") },
  },
});
```

The wrappers are regular components, so they need no such config.

import {
  defineComponent,
  h,
  type ComponentObjectPropsOptions,
  type Slot,
  type VNodeChild,
} from "vue";

/** How a form component binds to `v-model`. Matches `@formControl` kinds. */
export interface NysModelOptions {
  /** Which element property `modelValue` writes to, and the event detail key it reads. */
  kind: "value" | "checked" | "files";
  /** Vue listener prop for the change event, e.g. `onNysChange`. */
  changeListener: string;
  /** Vue listener prop for the per-keystroke event, when the component has one. */
  inputListener?: string;
}

export interface NysComponentOptions {
  /** Custom element tag, e.g. `nys-textinput`. */
  tag: string;
  /** Display name for devtools, e.g. `NysTextinput`. */
  name: string;
  /** Element properties forwarded as-is. */
  props: string[];
  /** Subset of `props` that are boolean (absent stays `undefined`, not `false`). */
  booleanProps: string[];
  model?: NysModelOptions;
}

/** Public type of a generated wrapper: props, and slots for `<template #name>`. */
export type NysComponent<Props, Slots> = new () => {
  $props: Props;
  $slots: Slots;
};

/** Slot function map for a wrapper; `Names` is the union of its slot names. */
export type NysSlots<Names extends string> = {
  [K in Names]?: Slot;
};

/**
 * Builds a Vue component that renders one NYSDS custom element.
 *
 * - Declared props are forwarded to the element as properties; absent props
 *   are left alone so the element keeps its own defaults.
 * - Vue slots render as light-DOM children. The default slot renders as
 *   direct children; named slots are wrapped in a
 *   `display: contents` span carrying the `slot` attribute, so any vnode
 *   (text, component, fragment) can fill one.
 * - Form components additionally support `v-model`, committing on the input
 *   and change events. `.lazy` commits on change alone, as on a native input.
 */
export function createNysComponent<T>(options: NysComponentOptions): T {
  const { tag, name, props, booleanProps, model } = options;

  const propDefs: ComponentObjectPropsOptions = {};
  for (const prop of props) {
    propDefs[prop] = booleanProps.includes(prop)
      ? { type: Boolean, default: undefined }
      : { type: null, default: undefined };
  }
  if (model) {
    propDefs.modelValue = { type: null, default: undefined };
    propDefs.modelModifiers = { type: Object, default: () => ({}) };
  }

  return defineComponent({
    name,
    props: propDefs,
    emits: model ? ["update:modelValue"] : [],
    setup(componentProps, { slots, emit }) {
      return () => {
        const domProps: Record<string, unknown> = {};
        for (const prop of props) {
          const value = (componentProps as Record<string, unknown>)[prop];
          if (value !== undefined) domProps[prop] = value;
        }

        if (model) {
          const modelValue = (componentProps as Record<string, unknown>)
            .modelValue;
          if (modelValue !== undefined) domProps[model.kind] = modelValue;

          const lazy = (
            (componentProps as Record<string, unknown>)
              .modelModifiers as Record<string, boolean>
          ).lazy;
          const commit = (event: CustomEvent) => {
            // Events from nested NYSDS elements (a checkbox inside a
            // checkboxgroup) bubble here; only the host's own count.
            if (event.target !== event.currentTarget) return;
            emit("update:modelValue", event.detail?.[model.kind]);
          };

          // Commit on both events, as the React `useNysField` hook does:
          // both carry the committed value, and some controls (combobox)
          // only fire the change event when an option is picked. `.lazy`
          // commits on change alone.
          domProps[model.changeListener] = commit;
          if (!lazy && model.inputListener) {
            domProps[model.inputListener] = commit;
          }
        }

        // Render whatever the caller provides, not just the manifest's slot
        // list: some elements (tooltip, dropdown menu, vertical nav) take
        // children without documenting a default slot.
        const children: VNodeChild[] = [];
        for (const [slotName, slot] of Object.entries(slots)) {
          if (!slot) continue;
          children.push(
            slotName === "default"
              ? slot()
              : h(
                  "span",
                  { slot: slotName, style: { display: "contents" } },
                  slot(),
                ),
          );
        }

        return h(tag, domProps, children);
      };
    },
  }) as unknown as T;
}

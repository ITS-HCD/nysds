"use client";

/**
 * Minimal shape of a React Hook Form controller field
 * (`ControllerRenderProps` matches it structurally).
 */
export interface NysFieldLike {
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
}

/** How a component binds to a form model. Matches `@formControl` kinds. */
export type NysFieldKind = "value" | "checked" | "files";

/**
 * Returns the prop bag that binds an NYSDS form component to a React
 * Hook Form controller field:
 * `<NysCheckbox {...useNysField(field, "checked")} />`.
 *
 * `T` is the value type for `"value"` fields — `string` by default,
 * `string[]` for `nys-checkboxgroup`.
 */
export function useNysField<T = string>(
  field: NysFieldLike,
  kind?: "value"
): {
  value: T;
  onNysInput: (e: CustomEvent<{ value: T }>) => void;
  onNysChange: (e: CustomEvent<{ value: T }>) => void;
  onNysBlur: () => void;
};
export function useNysField(
  field: NysFieldLike,
  kind: "checked"
): {
  checked: boolean;
  onNysChange: (e: CustomEvent<{ checked: boolean }>) => void;
  onNysBlur: () => void;
};
export function useNysField(
  field: NysFieldLike,
  kind: "files"
): {
  onNysChange: (e: CustomEvent<{ files: File[] }>) => void;
  onNysBlur: () => void;
};
export function useNysField(field: NysFieldLike, kind: NysFieldKind = "value") {
  const onNysBlur = () => field.onBlur();
  if (kind === "checked") {
    return {
      checked: !!field.value,
      onNysChange: (e: CustomEvent<{ checked: boolean }>) =>
        field.onChange(e.detail.checked),
      onNysBlur,
    };
  }
  if (kind === "files") {
    return {
      onNysChange: (e: CustomEvent<{ files: File[] }>) =>
        field.onChange(e.detail.files),
      onNysBlur,
    };
  }
  const commit = (e: CustomEvent<{ value: unknown }>) =>
    field.onChange(e.detail.value);
  return {
    value: field.value ?? "",
    onNysInput: commit,
    onNysChange: commit,
    onNysBlur,
  };
}

import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysCheckbox = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    checked,
    disabled,
    groupExist,
    inverted,
    other,
    required,
    showError,
    showOtherError,
    tile,
    description,
    errorMessage,
    form,
    id,
    label,
    name,
    size,
    tooltip,
    value,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-blur", props.onNysBlur);
  useEventListener(ref, "nys-change", props.onNysChange);
  useEventListener(ref, "nys-error", props.onNysError);
  useEventListener(ref, "nys-error-clear", props.onNysErrorClear);
  useEventListener(ref, "nys-focus", props.onNysFocus);
  useEventListener(ref, "nys-other-input", props.onNysOtherInput);

  return React.createElement(
    "nys-checkbox",
    {
      ref: (node) => {
        ref.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      ...filteredProps,
      description: props.description,
      errorMessage: props.errorMessage,
      form: props.form,
      id: props.id,
      label: props.label,
      name: props.name,
      size: props.size,
      tooltip: props.tooltip,
      value: props.value,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      checked: props.checked ? true : undefined,
      disabled: props.disabled ? true : undefined,
      groupExist: props.groupExist ? true : undefined,
      inverted: props.inverted ? true : undefined,
      other: props.other ? true : undefined,
      required: props.required ? true : undefined,
      showError: props.showError ? true : undefined,
      showOtherError: props.showOtherError ? true : undefined,
      tile: props.tile ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

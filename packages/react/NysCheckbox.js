import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysCheckbox = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    checked,
    disabled,
    required,
    showError,
    groupExist,
    tile,
    inverted,
    other,
    showOtherError,
    label,
    description,
    id,
    name,
    value,
    form,
    errorMessage,
    tooltip,
    size,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-change", props.onNysChange);
  useEventListener(ref, "nys-other-input", props.onNysOtherInput);
  useEventListener(ref, "nys-focus", props.onNysFocus);
  useEventListener(ref, "nys-blur", props.onNysBlur);
  useEventListener(ref, "nys-error", props.onNysError);
  useEventListener(ref, "nys-error-clear", props.onNysErrorClear);

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
      label: props.label,
      description: props.description,
      id: props.id,
      name: props.name,
      value: props.value,
      form: props.form,
      errorMessage: props.errorMessage,
      tooltip: props.tooltip,
      size: props.size,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      checked: props.checked ? true : undefined,
      disabled: props.disabled ? true : undefined,
      required: props.required ? true : undefined,
      showError: props.showError ? true : undefined,
      groupExist: props.groupExist ? true : undefined,
      tile: props.tile ? true : undefined,
      inverted: props.inverted ? true : undefined,
      other: props.other ? true : undefined,
      showOtherError: props.showOtherError ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

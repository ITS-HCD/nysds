import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysRadiobutton = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    checked,
    disabled,
    inverted,
    other,
    required,
    showOtherError,
    tile,
    description,
    form,
    id,
    label,
    name,
    size,
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
    "nys-radiobutton",
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
      form: props.form,
      id: props.id,
      label: props.label,
      name: props.name,
      size: props.size,
      value: props.value,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      checked: props.checked ? true : undefined,
      disabled: props.disabled ? true : undefined,
      inverted: props.inverted ? true : undefined,
      other: props.other ? true : undefined,
      required: props.required ? true : undefined,
      showOtherError: props.showOtherError ? true : undefined,
      tile: props.tile ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

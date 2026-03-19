import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysCombobox = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    disabled,
    required,
    optional,
    inverted,
    showError,
    id,
    name,
    label,
    description,
    value,
    tooltip,
    form,
    width,
    errorMessage,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-input", props.onNysInput);
  useEventListener(ref, "nys-focus", props.onNysFocus);
  useEventListener(ref, "nys-blur", props.onNysBlur);
  useEventListener(ref, "nys-change", props.onNysChange);

  return React.createElement(
    "nys-combobox",
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
      id: props.id,
      name: props.name,
      label: props.label,
      description: props.description,
      value: props.value,
      tooltip: props.tooltip,
      form: props.form,
      width: props.width,
      errorMessage: props.errorMessage,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      disabled: props.disabled ? true : undefined,
      required: props.required ? true : undefined,
      optional: props.optional ? true : undefined,
      inverted: props.inverted ? true : undefined,
      showError: props.showError ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

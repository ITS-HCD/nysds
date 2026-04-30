import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysCombobox = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    disabled,
    inverted,
    optional,
    required,
    showError,
    description,
    errorMessage,
    form,
    id,
    label,
    name,
    tooltip,
    value,
    width,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-blur", props.onNysBlur);
  useEventListener(ref, "nys-change", props.onNysChange);
  useEventListener(ref, "nys-focus", props.onNysFocus);
  useEventListener(ref, "nys-input", props.onNysInput);

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
      description: props.description,
      errorMessage: props.errorMessage,
      form: props.form,
      id: props.id,
      label: props.label,
      name: props.name,
      tooltip: props.tooltip,
      value: props.value,
      width: props.width,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      disabled: props.disabled ? true : undefined,
      inverted: props.inverted ? true : undefined,
      optional: props.optional ? true : undefined,
      required: props.required ? true : undefined,
      showError: props.showError ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

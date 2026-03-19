import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysSelect = forwardRef((props, forwardedRef) => {
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
    errorMessage,
    width,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-change", props.onNysChange);
  useEventListener(ref, "nys-focus", props.onNysFocus);
  useEventListener(ref, "nys-blur", props.onNysBlur);

  return React.createElement(
    "nys-select",
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
      errorMessage: props.errorMessage,
      width: props.width,
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

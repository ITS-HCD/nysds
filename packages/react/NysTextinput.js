import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysTextinput = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    disabled,
    readonly,
    required,
    optional,
    inverted,
    showError,
    id,
    name,
    type,
    label,
    description,
    placeholder,
    value,
    tooltip,
    form,
    pattern,
    maxlength,
    ariaLabel,
    width,
    step,
    min,
    max,
    errorMessage,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-input", props.onNysInput);
  useEventListener(ref, "nys-focus", props.onNysFocus);
  useEventListener(ref, "nys-blur", props.onNysBlur);

  return React.createElement(
    "nys-textinput",
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
      type: props.type,
      label: props.label,
      description: props.description,
      placeholder: props.placeholder,
      value: props.value,
      tooltip: props.tooltip,
      form: props.form,
      pattern: props.pattern,
      maxlength: props.maxlength,
      ariaLabel: props.ariaLabel,
      width: props.width,
      step: props.step,
      min: props.min,
      max: props.max,
      errorMessage: props.errorMessage,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      disabled: props.disabled ? true : undefined,
      readonly: props.readonly ? true : undefined,
      required: props.required ? true : undefined,
      optional: props.optional ? true : undefined,
      inverted: props.inverted ? true : undefined,
      showError: props.showError ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysTextinput = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    disabled,
    inverted,
    optional,
    readonly,
    required,
    showError,
    ariaLabel,
    description,
    errorMessage,
    form,
    id,
    label,
    max,
    maxlength,
    min,
    name,
    pattern,
    placeholder,
    step,
    tooltip,
    type,
    value,
    width,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-blur", props.onNysBlur);
  useEventListener(ref, "nys-focus", props.onNysFocus);
  useEventListener(ref, "nys-input", props.onNysInput);

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
      ariaLabel: props.ariaLabel,
      description: props.description,
      errorMessage: props.errorMessage,
      form: props.form,
      id: props.id,
      label: props.label,
      max: props.max,
      maxlength: props.maxlength,
      min: props.min,
      name: props.name,
      pattern: props.pattern,
      placeholder: props.placeholder,
      step: props.step,
      tooltip: props.tooltip,
      type: props.type,
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
      readonly: props.readonly ? true : undefined,
      required: props.required ? true : undefined,
      showError: props.showError ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

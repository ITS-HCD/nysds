import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysTextarea = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    disabled,
    inverted,
    optional,
    readonly,
    required,
    showError,
    description,
    errorMessage,
    form,
    id,
    label,
    maxlength,
    name,
    placeholder,
    resize,
    rows,
    tooltip,
    value,
    width,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-blur", props.onNysBlur);
  useEventListener(ref, "nys-focus", props.onNysFocus);
  useEventListener(ref, "nys-input", props.onNysInput);
  useEventListener(ref, "nys-select", props.onNysSelect);
  useEventListener(ref, "nys-selectionchange", props.onNysSelectionchange);

  return React.createElement(
    "nys-textarea",
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
      maxlength: props.maxlength,
      name: props.name,
      placeholder: props.placeholder,
      resize: props.resize,
      rows: props.rows,
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
      readonly: props.readonly ? true : undefined,
      required: props.required ? true : undefined,
      showError: props.showError ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

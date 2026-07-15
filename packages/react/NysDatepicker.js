import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysDatepicker = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    hideTodayButton,
    hideClearButton,
    disabled,
    required,
    optional,
    showError,
    inverted,
    id,
    name,
    width,
    errorMessage,
    form,
    tooltip,
    type,
    label,
    description,
    startDate,
    minDate,
    maxDate,
    value,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-input", props.onNysInput);
  useEventListener(ref, "nys-blur", props.onNysBlur);

  return React.createElement(
    "nys-datepicker",
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
      width: props.width,
      errorMessage: props.errorMessage,
      form: props.form,
      tooltip: props.tooltip,
      type: props.type,
      label: props.label,
      description: props.description,
      startDate: props.startDate,
      minDate: props.minDate,
      maxDate: props.maxDate,
      value: props.value,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      hideTodayButton: props.hideTodayButton ? true : undefined,
      hideClearButton: props.hideClearButton ? true : undefined,
      disabled: props.disabled ? true : undefined,
      required: props.required ? true : undefined,
      optional: props.optional ? true : undefined,
      showError: props.showError ? true : undefined,
      inverted: props.inverted ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

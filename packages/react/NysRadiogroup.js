import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysRadiogroup = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    required,
    optional,
    showError,
    tile,
    _showOtherError,
    id,
    name,
    errorMessage,
    label,
    description,
    tooltip,
    form,
    size,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-change", props.onNysChange);
  useEventListener(ref, "nys-other-input", props.onNysOtherInput);

  return React.createElement(
    "nys-radiogroup",
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
      errorMessage: props.errorMessage,
      label: props.label,
      description: props.description,
      tooltip: props.tooltip,
      form: props.form,
      size: props.size,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      required: props.required ? true : undefined,
      optional: props.optional ? true : undefined,
      showError: props.showError ? true : undefined,
      tile: props.tile ? true : undefined,
      _showOtherError: props._showOtherError ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

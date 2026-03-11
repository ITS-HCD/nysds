import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysFileinput = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    multiple,
    disabled,
    required,
    optional,
    showError,
    dropzone,
    inverted,
    id,
    name,
    label,
    description,
    form,
    tooltip,
    accept,
    errorMessage,
    width,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-change", props.onNysChange);

  return React.createElement(
    "nys-fileinput",
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
      form: props.form,
      tooltip: props.tooltip,
      accept: props.accept,
      errorMessage: props.errorMessage,
      width: props.width,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      multiple: props.multiple ? true : undefined,
      disabled: props.disabled ? true : undefined,
      required: props.required ? true : undefined,
      optional: props.optional ? true : undefined,
      showError: props.showError ? true : undefined,
      dropzone: props.dropzone ? true : undefined,
      inverted: props.inverted ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

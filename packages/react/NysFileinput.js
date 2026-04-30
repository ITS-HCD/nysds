import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysFileinput = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    disabled,
    dropzone,
    inverted,
    multiple,
    optional,
    required,
    showError,
    accept,
    description,
    errorMessage,
    form,
    id,
    label,
    name,
    tooltip,
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
      accept: props.accept,
      description: props.description,
      errorMessage: props.errorMessage,
      form: props.form,
      id: props.id,
      label: props.label,
      name: props.name,
      tooltip: props.tooltip,
      width: props.width,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      disabled: props.disabled ? true : undefined,
      dropzone: props.dropzone ? true : undefined,
      inverted: props.inverted ? true : undefined,
      multiple: props.multiple ? true : undefined,
      optional: props.optional ? true : undefined,
      required: props.required ? true : undefined,
      showError: props.showError ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

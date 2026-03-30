import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysToggle = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    checked,
    disabled,
    noIcon,
    inverted,
    id,
    name,
    value,
    label,
    description,
    form,
    size,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-change", props.onNysChange);
  useEventListener(ref, "nys-focus", props.onNysFocus);
  useEventListener(ref, "nys-blur", props.onNysBlur);

  return React.createElement(
    "nys-toggle",
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
      value: props.value,
      label: props.label,
      description: props.description,
      form: props.form,
      size: props.size,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      checked: props.checked ? true : undefined,
      disabled: props.disabled ? true : undefined,
      noIcon: props.noIcon ? true : undefined,
      inverted: props.inverted ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

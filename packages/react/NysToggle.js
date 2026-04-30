import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysToggle = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    checked,
    disabled,
    inverted,
    noIcon,
    description,
    form,
    id,
    label,
    name,
    size,
    value,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-blur", props.onNysBlur);
  useEventListener(ref, "nys-change", props.onNysChange);
  useEventListener(ref, "nys-focus", props.onNysFocus);

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
      description: props.description,
      form: props.form,
      id: props.id,
      label: props.label,
      name: props.name,
      size: props.size,
      value: props.value,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      checked: props.checked ? true : undefined,
      disabled: props.disabled ? true : undefined,
      inverted: props.inverted ? true : undefined,
      noIcon: props.noIcon ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysDropdownMenuItem = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    disabled,
    divider,
    href,
    label,
    prefixIcon,
    target,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-click", props.onNysClick);

  return React.createElement(
    "nys-dropdownmenuitem",
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
      divider: props.divider,
      href: props.href,
      label: props.label,
      prefixIcon: props.prefixIcon,
      target: props.target,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      disabled: props.disabled ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysVerticalnavGroup = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const { expanded, disabled, label, ...filteredProps } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-child-resize", props.onNysChildResize);

  return React.createElement(
    "nys-verticalnavgroup",
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
      label: props.label,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      expanded: props.expanded ? true : undefined,
      disabled: props.disabled ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

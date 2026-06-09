import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useProperties } from "./react-utils.js";

export const NysIcon = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    name,
    library,
    ariaLabel,
    rotate,
    flip,
    color,
    size,
    updateComplete,
    ...filteredProps
  } = props;

  /** Properties - run whenever a property has changed */
  useProperties(ref, "updateComplete", props.updateComplete);

  return React.createElement(
    "nys-icon",
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
      name: props.name,
      library: props.library,
      ariaLabel: props.ariaLabel,
      rotate: props.rotate,
      flip: props.flip,
      color: props.color,
      size: props.size,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      style: { ...props.style },
    },
    props.children,
  );
});

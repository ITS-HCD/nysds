import React, { forwardRef, useRef, useEffect } from "react";
import "@nysds/nys-processlist";
import { useProperties } from "./react-utils.js";

export const NysProcesslistitem = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const { label, description, _hasDescription, ...filteredProps } = props;

  /** Properties - run whenever a property has changed */
  useProperties(ref, "_hasDescription", props._hasDescription);

  return React.createElement(
    "nys-processlistitem",
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
      description: props.description,
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

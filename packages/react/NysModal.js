import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysModal = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const { open, mandatory, id, heading, subheading, width, ...filteredProps } =
    props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-open", props.onNysOpen);
  useEventListener(ref, "nys-close", props.onNysClose);

  return React.createElement(
    "nys-modal",
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
      heading: props.heading,
      subheading: props.subheading,
      width: props.width,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      open: props.open ? true : undefined,
      mandatory: props.mandatory ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

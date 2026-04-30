import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysAccordionItem = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const { bordered, expanded, heading, id, ...filteredProps } = props;

  /** Event listeners - run once */
  useEventListener(
    ref,
    "nys-accordionitem-toggle",
    props.onNysAccordionitemToggle,
  );

  return React.createElement(
    "nys-accordionitem",
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
      heading: props.heading,
      id: props.id,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      bordered: props.bordered ? true : undefined,
      expanded: props.expanded ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

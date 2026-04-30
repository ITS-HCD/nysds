import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysLabel = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const { inverted, description, flag, id, label, tooltip, ...filteredProps } =
    props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-label-click", props.onNysLabelClick);

  return React.createElement(
    "nys-label",
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
      flag: props.flag,
      id: props.id,
      label: props.label,
      tooltip: props.tooltip,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      inverted: props.inverted ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

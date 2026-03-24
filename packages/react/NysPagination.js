import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysPagination = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    _twoBeforeLast,
    id,
    name,
    currentPage,
    totalPages,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-change", props.onNysChange);

  return React.createElement(
    "nys-pagination",
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
      currentPage: props.currentPage,
      totalPages: props.totalPages,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      _twoBeforeLast: props._twoBeforeLast ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

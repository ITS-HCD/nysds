import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysTable = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const { bordered, sortable, striped, download, id, name, ...filteredProps } =
    props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-click", props.onNysClick);
  useEventListener(ref, "nys-column-sort", props.onNysColumnSort);

  return React.createElement(
    "nys-table",
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
      download: props.download,
      id: props.id,
      name: props.name,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      bordered: props.bordered ? true : undefined,
      sortable: props.sortable ? true : undefined,
      striped: props.striped ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysTable = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const { striped, sortable, bordered, id, name, download, ...filteredProps } =
    props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-click", props.onNysClick);

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
      id: props.id,
      name: props.name,
      download: props.download,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      striped: props.striped ? true : undefined,
      sortable: props.sortable ? true : undefined,
      bordered: props.bordered ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

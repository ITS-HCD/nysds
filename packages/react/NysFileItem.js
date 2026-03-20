import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysFileItem = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const { filename, status, progress, errorMessage, ...filteredProps } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-fileRemove", props.onNysFileRemove);

  return React.createElement(
    "nys-fileitem",
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
      filename: props.filename,
      status: props.status,
      progress: props.progress,
      errorMessage: props.errorMessage,
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

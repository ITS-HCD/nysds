import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysBreadcrumbItem = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const { isLast, isBackToParent, id, label, link, ...filteredProps } = props;

  /** Event listeners - run once */
  useEventListener(
    ref,
    "nys-breadcrumbitem-click",
    props.onNysBreadcrumbitemClick,
  );

  return React.createElement(
    "nys-breadcrumbitem",
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
      label: props.label,
      link: props.link,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      isLast: props.isLast ? true : undefined,
      isBackToParent: props.isBackToParent ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

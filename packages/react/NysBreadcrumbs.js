import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysBreadcrumbs = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    backToParent,
    collapsed,
    backgroundBar,
    id,
    ariaLabel,
    size,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-breadcrumbs-expand", props.onNysBreadcrumbsExpand);

  return React.createElement(
    "nys-breadcrumbs",
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
      ariaLabel: props.ariaLabel,
      size: props.size,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      backToParent: props.backToParent ? true : undefined,
      collapsed: props.collapsed ? true : undefined,
      backgroundBar: props.backgroundBar ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

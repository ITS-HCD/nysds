import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysBreadcrumbs = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    backToParentMobile,
    collapsed,
    id,
    size,
    itemsBeforeCollapse,
    itemsAfterCollapse,
    maxItems,
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
      size: props.size,
      itemsBeforeCollapse: props.itemsBeforeCollapse,
      itemsAfterCollapse: props.itemsAfterCollapse,
      maxItems: props.maxItems,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      backToParentMobile: props.backToParentMobile ? true : undefined,
      collapsed: props.collapsed ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

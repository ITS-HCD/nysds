import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysBreadcrumbs = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    backgroundBar,
    backToParent,
    collapsed,
    disabled,
    ariaLabel,
    id,
    size,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-breadcrumbs-expand", props.onNysBreadcrumbsExpand);
  useEventListener(ref, "nys-expand", props.onNysExpand);

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
      ariaLabel: props.ariaLabel,
      id: props.id,
      size: props.size,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      backgroundBar: props.backgroundBar ? true : undefined,
      backToParent: props.backToParent ? true : undefined,
      collapsed: props.collapsed ? true : undefined,
      disabled: props.disabled ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

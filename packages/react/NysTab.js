import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysTab = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const { selected, disabled, id, label, ...filteredProps } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-tab-select", props.onNysTabSelect);
  useEventListener(ref, "nys-tab-focus", props.onNysTabFocus);
  useEventListener(ref, "nys-tab-blur", props.onNysTabBlur);

  return React.createElement(
    "nys-tab",
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
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      selected: props.selected ? true : undefined,
      disabled: props.disabled ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

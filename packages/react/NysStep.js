import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener, useProperties } from "./react-utils.js";

export const NysStep = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    selected,
    current,
    isCompactExpanded,
    label,
    href,
    stepNumber,
    onClick,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-step-click", props.onNysStepClick);

  /** Properties - run whenever a property has changed */
  useProperties(ref, "onClick", props.onClick);

  return React.createElement(
    "nys-step",
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
      label: props.label,
      href: props.href,
      stepNumber: props.stepNumber,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      selected: props.selected ? true : undefined,
      current: props.current ? true : undefined,
      isCompactExpanded: props.isCompactExpanded ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

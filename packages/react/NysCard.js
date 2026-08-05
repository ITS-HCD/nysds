import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener, useProperties } from "./react-utils.js";

export const NysCard = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    inset,
    elevated,
    id,
    preheading,
    heading,
    headingLevel,
    subheading,
    description,
    href,
    target,
    onClick,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-click", props.onNysClick);
  useEventListener(ref, "nys-focus", props.onNysFocus);
  useEventListener(ref, "nys-blur", props.onNysBlur);

  /** Properties - run whenever a property has changed */
  useProperties(ref, "onClick", props.onClick);

  return React.createElement(
    "nys-card",
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
      preheading: props.preheading,
      heading: props.heading,
      headingLevel: props.headingLevel,
      subheading: props.subheading,
      description: props.description,
      href: props.href,
      target: props.target,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      inset: props.inset ? true : undefined,
      elevated: props.elevated ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});

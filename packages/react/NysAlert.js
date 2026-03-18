import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener, useProperties } from "./react-utils.js";

export const NysAlert = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    dismissible,
    id,
    heading,
    icon,
    duration,
    text,
    primaryAction,
    secondaryAction,
    primaryLabel,
    secondaryLabel,
    type,
    ariaAttributes,
    liveRegion,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-close", props.onNysClose);

  /** Properties - run whenever a property has changed */
  useProperties(ref, "ariaAttributes", props.ariaAttributes);
  useProperties(ref, "liveRegion", props.liveRegion);

  return React.createElement(
    "nys-alert",
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
      heading: props.heading,
      icon: props.icon,
      duration: props.duration,
      text: props.text,
      primaryAction: props.primaryAction,
      secondaryAction: props.secondaryAction,
      primaryLabel: props.primaryLabel,
      secondaryLabel: props.secondaryLabel,
      type: props.type,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      dismissible: props.dismissible ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
